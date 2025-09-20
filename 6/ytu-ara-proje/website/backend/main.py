from fastapi import FastAPI, Request
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

app = FastAPI()

model_name = "./roberta"
model = AutoModelForSequenceClassification.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

@app.post("/predict")
async def predict(request: Request):
    data = await request.json()
    text = data["text"]
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    outputs = model(**inputs)
    probs = torch.nn.functional.softmax(outputs.logits, dim=1)[0].tolist()
    prediction = torch.argmax(outputs.logits, dim=1).item()
    id2label = {0: 'fear', 1: 'sadness', 2: 'anger', 3: 'disgust', 4: 'joy', 5: 'surprise'}
    probs_dict = {id2label[i]: float(probs[i]) for i in range(len(probs))}
    print(f"Input text: {text}")
    print(f"Prediction: {id2label[prediction]}")
    print(f"Probabilities: {probs_dict}")
    return {
        "probs": probs_dict,
        "prediction": prediction,
        "label": id2label[prediction]
    }

#run command:  uvicorn main:app --reload 
#run command frontend:  npm run dev

# download dependencies:
# backend: pip install fastapi transformers torch uvicorn
# frontend: npm install 