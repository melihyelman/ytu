const EMOTIONS = ['anger', 'sadness', 'fear', 'joy', 'surprise', 'disgust'];

function cleanLyrics(text: string): string {
  if (!text) return '';
  let cleaned = text;
  cleaned = cleaned.replace(/\[.*?\]/g, ''); 
  cleaned = cleaned.replace(/\(.*?\)/g, ''); 
  cleaned = cleaned.replace(/\n\s*\n/g, '\n');
  return cleaned.trim();
}

interface EmotionItem {
  label?: string;
  score?: number;
}



async function createApiClassifier() {
  const MODEL_ENDPOINT = 'http://localhost:8000/predict'; 

  return async (text: string) => {
    try {
      const processedText = cleanLyrics(text);
      console.log(processedText)
      const response = await fetch(MODEL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: processedText }),
      });

      if (!response.ok) {
        return getDefaultEmotions();
      }

      const result = await response.json();
      if (!result || !result.probs) {
        return getDefaultEmotions();
      }

      const emotionProbs = result.probs;
      const total = EMOTIONS.reduce((sum, e) => sum + (emotionProbs[e] ?? 0), 0);

      const normalized = EMOTIONS.map(emotion => ({
        label: emotion,
        score: total > 0 ? (emotionProbs[emotion] ?? 0) / total : 0
      }));

      return normalized;
    } catch {
      return getDefaultEmotions();
    }
  };
}

function getDefaultEmotions() {
  return [
    { label: 'joy', score: 0.0 },
    { label: 'surprise', score: 0.0},
    { label: 'fear', score: 0.0 },
    { label: 'sadness', score: 0.0 },
    { label: 'anger', score: 0.0 },
    { label: 'disgust', score: 0.0 }
  ];
}

class SentimentModel {
  static instance: ((text: string) => Promise<{ label: string; score: number }[]>) | null = null;

  static async getInstance() {
    if (this.instance === null) {
      this.instance = await createApiClassifier();
    }
    return this.instance;
  }
}

export default SentimentModel;
