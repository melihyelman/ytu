"""
    ./venv/bin/streamlit run web/app.py
"""

import os
import json
from pathlib import Path

import pandas as pd
import requests
import streamlit as st
import torch
import torch.nn.functional as F

BASE_DIR = Path(__file__).resolve().parent.parent

if Path('/content').exists():
    BASE_DIR = Path('/content/drive/MyDrive/bitirme')

SENTIMENT_DIR = BASE_DIR / 'sentiment' / 'models'
BERTOPIC_PATH = BASE_DIR / 'data' / 'processed' / 'bertopic_tam_model'
TOPICS_CSV    = BASE_DIR / 'data' / 'processed' / 'bertopic_tam_topics.csv'

ROBERTA_TR_BASE = 'burakaytan/roberta-base-turkish-uncased'
ROBERTA_EN_BASE = 'roberta-base'
QWEN_BASE       = 'Qwen/Qwen2.5-7B-Instruct'

DEVICE = 'cuda' if torch.cuda.is_available() else 'cpu'

st.set_page_config(
    page_title='',
    page_icon='',
    layout='wide',
)

st.title('Movie Review Topic & Sentiment Analyzer')

@st.cache_resource(show_spinner=False)
def load_bertopic():
    from bertopic import BERTopic
    from sentence_transformers import SentenceTransformer
    embedding_model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
    model = BERTopic.load(str(BERTOPIC_PATH), embedding_model=embedding_model)
    topics = pd.read_csv(TOPICS_CSV)
    return model, topics


@st.cache_resource(show_spinner=False)
def load_roberta(lang: str):
    from transformers import AutoTokenizer, AutoModelForSequenceClassification

    model_dir = SENTIMENT_DIR / f'roberta_{lang}_final'
    required_base = ['model.safetensors', 'config.json']
    has_base = all((model_dir / f).exists() for f in required_base)
    has_tokenizer = (model_dir / 'tokenizer.json').exists() or (model_dir / 'tokenizer_config.json').exists()

    if not (has_base and has_tokenizer):
        return None, None, None

    label_path = model_dir / 'label_classes.json'
    labels = json.loads(label_path.read_text()) if label_path.exists() else \
             ['anger', 'disgust', 'fear', 'happiness', 'neutral', 'sadness']
    tokenizer = AutoTokenizer.from_pretrained(str(model_dir))
    model = AutoModelForSequenceClassification.from_pretrained(str(model_dir)).to(DEVICE)
    model.eval()
    return tokenizer, model, labels


@st.cache_resource(show_spinner=False)
def load_qwen(lang: str):
    if DEVICE != 'cuda':
        return None, None, None

    adapter_dir = SENTIMENT_DIR / f'qwen_{lang}_final'
    if not (adapter_dir / 'adapter_model.safetensors').exists():
        return None, None, None

    try:
        from transformers import AutoTokenizer, AutoModelForSequenceClassification, BitsAndBytesConfig
        from peft import PeftModel
    except ImportError as e:
        st.warning(f'{e.name}`')
        return None, None, None

    label_path = adapter_dir / 'label_classes.json'
    labels = json.loads(label_path.read_text()) if label_path.exists() else \
             ['anger', 'disgust', 'fear', 'happiness', 'neutral', 'sadness']

    bnb = BitsAndBytesConfig(
        load_in_4bit=True, bnb_4bit_quant_type='nf4',
        bnb_4bit_compute_dtype=torch.bfloat16,
    )
    base = AutoModelForSequenceClassification.from_pretrained(
        QWEN_BASE, num_labels=len(labels),
        quantization_config=bnb, device_map='auto', trust_remote_code=True,
    )

    tokenizer = AutoTokenizer.from_pretrained(str(adapter_dir), trust_remote_code=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    base.config.pad_token_id = tokenizer.pad_token_id
    model = PeftModel.from_pretrained(base, str(adapter_dir))
    model.eval()
    return tokenizer, model, labels


@st.cache_data(ttl=30, show_spinner=False)
def check_qwen_api(api_url: str) -> bool:
    try:
        return requests.get(f'{api_url}/health', timeout=5).ok
    except requests.RequestException:
        return False


def predict_sentiment_remote(text: str, lang: str, api_url: str):
    resp = requests.post(
        f'{api_url}/predict',
        json={'text': text, 'lang': lang},
        timeout=120,
    )
    resp.raise_for_status()
    data = resp.json()
    return data['label'], data['probs'], data['labels']


@torch.no_grad()
def predict_sentiment(text: str, tokenizer, model, labels):
    enc = tokenizer(text, return_tensors='pt', truncation=True, max_length=256).to(DEVICE)
    if DEVICE == 'cuda':
        with torch.amp.autocast('cuda', dtype=torch.bfloat16):
            logits = model(**enc).logits
    else:
        logits = model(**enc).logits
    probs = F.softmax(logits, dim=-1).squeeze().cpu().float().tolist()
    pred_idx = int(max(range(len(probs)), key=probs.__getitem__))
    return labels[pred_idx], probs


with st.sidebar:
    lang = st.radio(
        'Language',
        ['tr', 'en'],
        format_func=lambda x: '🇹🇷 Turkish' if x == 'tr' else '🇬🇧 English',
    )

    qwen_api_url = st.text_input(
        'Qwen Colab API URL',
        value=os.environ.get('QWEN_API_URL', ''),
        placeholder='https://xxxx.trycloudflare.com',
    ).strip().rstrip('/')

    qwen_remote_ok = bool(qwen_api_url) and check_qwen_api(qwen_api_url)
    if qwen_api_url:
        st.caption('🟢 Colab API connected' if qwen_remote_ok
                   else '🔴 Colab API unreachable')

    qwen_available = qwen_remote_ok or (DEVICE == 'cuda')
    model_options = ['RoBERTa']
    if qwen_available:
        model_options.append('Qwen 2.5 7B')

    sentiment_choice = st.radio(
        'Sentiment Model',
        model_options,
    )
    if not qwen_available:
        st.caption('(Qwen disabled — Paste a Colab API URL to enable.)')

    st.divider()
    st.markdown('**Active models**')
    st.markdown(f'- BERTopic')
    if sentiment_choice == 'RoBERTa':
        st.markdown(f'- RoBERTa {lang.upper()}')
    else:
        st.markdown(f'- Qwen 7B {lang.upper()} + LoRA')



text = st.text_area(
    'Text',
    key='text_input',
    height=150,
    placeholder='Text',
)

col_run, col_meta = st.columns([1, 4])
with col_run:
    run = st.button('Submit', type='primary', use_container_width=True)


if run and text.strip():
    with st.spinner('Loading...'):
        bert_model, topics_df = load_bertopic()
        topic_id, _ = bert_model.transform([text])
        tid = int(topic_id[0])
        topic_row = (
            topics_df[topics_df['Topic'] == tid].iloc[0]
            if (topics_df['Topic'] == tid).any() else None
        )

        sent_emo, sent_probs, sent_labels = None, None, None
        if sentiment_choice == 'RoBERTa':
            model_label = f'RoBERTa {lang.upper()}'
            tok, mdl, sent_labels = load_roberta(lang)
            if mdl is None:
                st.error(
                    f'RoBERTa {lang.upper()} empty files!'
                )
            else:
                sent_emo, sent_probs = predict_sentiment(text, tok, mdl, sent_labels)
        else:  # Qwen
            model_label = f'Qwen 2.5 7B {lang.upper()}'
            if qwen_remote_ok:
                model_label += ' '
                try:
                    sent_emo, sent_probs, sent_labels = predict_sentiment_remote(
                        text, lang, qwen_api_url
                    )
                except requests.RequestException as e:
                    st.error(f'Colab API error: {e}')
            else:
                tok, mdl, sent_labels = load_qwen(lang)
                if mdl is None:
                    st.error('Qwen could not be loaded (GPU required or adapter missing).')
                else:
                    sent_emo, sent_probs = predict_sentiment(text, tok, mdl, sent_labels)

    st.divider()

    st.subheader('Topic')
    if topic_row is not None and tid != -1:
        title    = topic_row.get('Title', '-') or '-'
        category = topic_row.get('Category', '-') or '-'
        keywords = topic_row.get('Representation', '')
        c1, c2 = st.columns(2)
        c1.metric('Title', title)
        c2.metric('Category', category)
        st.caption(f'**Keywords:** {keywords[:200]}')
    elif tid == -1:
        st.warning('This review could not be assigned to any topic (outlier).')
    else:
        st.warning(f'Topic #{tid} not found in CSV.')

    if sent_emo is not None:
        max_prob = max(sent_probs)
        confidence_str = f"{max_prob * 100:.1f}%" 
        
        st.subheader(f'Sentiment - {model_label}')
        st.metric('Predicted', sent_emo + ' : ' + confidence_str)
        
        
        for label, prob in zip(sent_labels, sent_probs):
            st.write(f"- **{label.capitalize()}**: {prob * 100:.1f}%")

elif run:
    st.error('Please enter some text first.')

