import pandas as pd
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

# CSV'yi oku
df = pd.read_csv('final_emotions_limited.csv', encoding='utf-8')

target_label = "surprise"  # örnek: 'joy', 'anger', vs.

# Parrot paraphraser modelini yükle
model_name = 'prithivida/parrot_paraphraser_on_T5'
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = model.to(device)

# Batch paraphrase üretim fonksiyonu
def generate_paraphrases_batch(texts, num_return_sequences=1, num_beams=5):
    input_texts = [f"paraphrase: {text}" for text in texts]
    batch = tokenizer(
        input_texts,
        truncation=True,
        padding=True,
        max_length=512,
        return_tensors='pt'
    ).to(device)

    try:
        translated = model.generate(
            **batch,
            max_length=200,
            num_beams=num_beams,
            num_return_sequences=num_return_sequences,
            do_sample=True,
            temperature=1.0,
            top_k=30,
            top_p=0.9
        )

        decoded = tokenizer.batch_decode(translated, skip_special_tokens=True)
        result = []
        for i in range(0, len(decoded), num_return_sequences):
            result.append(decoded[i:i + num_return_sequences])
        return result

    except Exception as e:
        print(f"[HATA - generate] {e}")
        return [[] for _ in texts]

# Hedef veri boyutu
max_samples = 4000
label_df = df[df['label_name'] == target_label].copy()
n_current = len(label_df)
n_to_generate = max_samples - n_current

print(f"{target_label}: mevcut={n_current}, eksik={n_to_generate}")

new_rows = []

if n_to_generate > 0:
    original_rows = label_df.to_dict('records')
    paraphrase_pool = [row for row in original_rows]

    batch_size = 64
    i = 0
    while n_to_generate > 0:
        batch_rows = [paraphrase_pool[j % len(paraphrase_pool)] for j in range(i, i + batch_size)]
        batch_texts = [row['seq'] for row in batch_rows]
        batch_labels = [row['label'] if 'label' in row else None for row in batch_rows]

        paraphrase_results = generate_paraphrases_batch(batch_texts, num_return_sequences=1)

        for original_text, paras, label in zip(batch_texts, paraphrase_results, batch_labels):
            for para in paras:
                new_rows.append({
                    'id': '999999',
                    'artist': 'augmented',
                    'seq': para,
                    'song': 'augmented',
                    'label_name': target_label,
                    'label': label
                })
                n_to_generate -= 1
                if n_to_generate <= 0:
                    break
        i += batch_size
        if i % 64 == 0:
            print(f"{i} paraphrase üretildi... Kalan: {n_to_generate}")

    print(f"{target_label} için augmentasyon tamamlandı.")
else:
    print(f"{target_label} etiketi için zaten yeterli veri var. Augmentasyona gerek yok.")

# Augmented verileri birleştir
augmented_df = pd.DataFrame(new_rows)
final_df = pd.concat([label_df, augmented_df], ignore_index=True)

# Sonuç dosyasını kaydet
print(f"{target_label} için toplam veri:", len(final_df))
output_file = f"augmented_emotions_{target_label}.csv"
final_df.to_csv(output_file, index=False)
print(f"Augmented CSV kaydedildi: {output_file}")