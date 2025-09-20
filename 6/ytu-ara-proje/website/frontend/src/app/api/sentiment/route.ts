import { NextRequest, NextResponse } from 'next/server';
import SentimentModel from '../../../utils/model';

export async function POST(req: NextRequest) {
  
  try {
    const { lyrics } = await req.json();
    
    if (!lyrics) {
      return NextResponse.json({ error: 'Lyrics field is required' }, { status: 400 });
    }

    
    try {
      const classifier = await SentimentModel.getInstance();
      
      const results = await classifier(lyrics);
      
      const emotions: Record<string, number> = {};
      
      ['joy', 'surprise', 'anger', 'sadness', 'fear', 'disgust'].forEach(emotion => {
        emotions[emotion] = 0;
      });
      
      if (Array.isArray(results)) {
        results.forEach(result => {
          const { label, score } = result;
          if (label && typeof score === 'number') {
            emotions[label] = Math.round(score * 100);
          }
        });
      }
      
      
      return NextResponse.json({ emotions });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      throw new Error(`Model inference failed: ${errorMessage}`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage || 'An error occurred during sentiment analysis' }, { status: 500 });
  }
} 