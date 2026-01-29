import os
import re
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import nltk

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('tokenizers/punkt_tab')
except LookupError:
    nltk.download('punkt_tab', quiet=True)
    
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

CATEGORIES = {
    1: "World",
    2: "Sports",
    3: "Business",
    4: "Sci/Tech"
}

# Clean text by removing special characters, lowercasing.
def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'http\S+|www\S+|https\S+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^a-zA-Z\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# Remove English stopwords from text.
def remove_stopwords(text: str) -> str:
    if not text:
        return ""
    stop_words = set(stopwords.words('english'))
    words = word_tokenize(text)
    filtered_words = [word for word in words if word not in stop_words]
    return ' '.join(filtered_words)

# Full preprocessing pipeline.
def preprocess_text(text: str) -> str:
    text = clean_text(text)
    text = remove_stopwords(text)
    return text

# Combine title and description into a single text.
def combine_title_description(title: str, description: str) -> str:
    title = str(title) if title else ""
    description = str(description) if description else ""
    return f"{title} {description}".strip()

app = FastAPI(
    title="Bil. Erş. Arş. Proje",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "models")

model = None
vectorizer = None
metadata = None


class ArticleInput(BaseModel):
    title: str
    description: Optional[str] = ""


class PredictionResponse(BaseModel):
    category: str
    category_index: int
    confidence: Optional[float] = None
    processed_text: str


def load_model():
    global model, vectorizer, metadata
    
    model_path = os.path.join(MODEL_DIR, "best_model.pkl")
    vectorizer_path = os.path.join(MODEL_DIR, "vectorizer.pkl")
    metadata_path = os.path.join(MODEL_DIR, "metadata.pkl")
    
    if os.path.exists(model_path) and os.path.exists(vectorizer_path):
        model = joblib.load(model_path)
        vectorizer = joblib.load(vectorizer_path)
        if os.path.exists(metadata_path):
            metadata = joblib.load(metadata_path)
        print("Model loaded successfully!")
        return True
    else:
        print("Warning: Model files not found. Train the model first.")
        return False


@app.on_event("startup")
async def startup_event():
    load_model()

@app.post("/predict", response_model=PredictionResponse)
async def predict(article: ArticleInput):
    if model is None or vectorizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Run the notebook first.")
    
    combined_text = combine_title_description(article.title, article.description)
    processed_text = preprocess_text(combined_text)
    
    if not processed_text.strip():
        raise HTTPException(status_code=400, detail="Input text is empty after preprocessing")
    
    text_vectorized = vectorizer.transform([processed_text])
    prediction = model.predict(text_vectorized)[0]
    
    confidence = None
    if hasattr(model, 'predict_proba'):
        proba = model.predict_proba(text_vectorized)[0]
        confidence = float(max(proba))
    
    return PredictionResponse(
        category=CATEGORIES[prediction],
        category_index=int(prediction),
        confidence=confidence,
        processed_text=processed_text
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
