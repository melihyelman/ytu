"use client";

import { BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import type { SpotifyTrack } from "@/utils/spotify";

interface SentimentAnalysisProps {
  selectedTrack?: SpotifyTrack | null;
  lyrics?: string | null;
}

const emotionConfig: Record<string, { color: string, gradient: string, turkishName: string }> = {
  joy: { 
    color: 'text-amber-500', 
    gradient: 'from-amber-400 to-amber-600',
    turkishName: 'Neşe'
  },
  surprise: { 
    color: 'text-fuchsia-500', 
    gradient: 'from-fuchsia-400 to-fuchsia-600',
    turkishName: 'Şaşkınlık'
  },
  sadness: { 
    color: 'text-sky-500', 
    gradient: 'from-sky-400 to-sky-600',
    turkishName: 'Üzüntü'
  },
  fear: { 
    color: 'text-indigo-500', 
    gradient: 'from-indigo-400 to-indigo-600',
    turkishName: 'Korku'
  },
  anger: { 
    color: 'text-red-500', 
    gradient: 'from-red-400 to-red-600',
    turkishName: 'Öfke'
  },
  disgust: { 
    color: 'text-emerald-600', 
    gradient: 'from-emerald-500 to-emerald-700',
    turkishName: 'Tiksinme'
  }
};

const SentimentAnalysis = ({ selectedTrack, lyrics }: SentimentAnalysisProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [emotions, setEmotions] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (selectedTrack && lyrics) {
      setIsLoading(true);
      setEmotions(null);
      setError(null);
      
      if (!lyrics || 
          lyrics.length < 50 ||
          lyrics.includes("Şarkı sözleri bulunamadı") || 
          lyrics.includes("Failed to fetch") ||
          lyrics.includes("Lyrics could not be extracted") ||
          lyrics.includes("Bu şarkı için şarkı sözleri bulunamadı") ||
          lyrics.trim() === "") {
        setIsLoading(false);
        setError("Şarkı sözleri bulunamadığı için duygu analizi yapılamıyor");
        return;
      }
      
      const analyzeSentiment = async () => {
        try {
          const response = await fetch('/api/sentiment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lyrics }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to analyze sentiment');
          }
          
          setEmotions(data.emotions);
        } catch {
          setError("Duygu analizi sırasında bir hata oluştu");
        } finally {
          setIsLoading(false);
        }
      };
      
      analyzeSentiment();
    } else {
      setEmotions(null);
      setError(null);
    }
  }, [selectedTrack, lyrics]);
  
  const renderEmotionBars = () => {
    if (!emotions) return null;
    
    return (
      <div className="grid grid-cols-2 gap-4 mt-2">
        {Object.entries(emotions)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .map(([emotion, value]) => {
            const config = emotionConfig[emotion] || { 
              color: 'text-gray-500', 
              gradient: 'from-gray-400 to-gray-600',
              turkishName: emotion 
            };
            
            return (
              <div 
                key={emotion} 
                className="bg-white dark:bg-gray-800/50 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md "
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className={`${config.color} font-medium`}>{config.turkishName}</h5>
                  <div className="relative">
                    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 ${config.color} text-sm font-bold shadow-sm`}>
                      {value}<span className="text-xs">%</span>
                    </span>
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${config.gradient} opacity-10 scale-110 blur-[2px]`}></div>
                  </div>
                </div>
                
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-700 ease-out emotion-bar`}
                    style={{ 
                      width: `${value}%`,
                      boxShadow: `0 0 8px rgba(var(--tw-gradient-stops), 0.4)`,
                      animation: 'growBar 1.5s ease-out forwards' 
                    }}
                  ></div>
                </div>
              </div>
            );
        })}
      </div>
    );
  };
  
  const SentimentSkeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className="p-4 rounded-lg bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200/60 dark:border-gray-700/60 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-1/3"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-24"></div>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mt-4"></div>
      </div>
      
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-3">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          <div className="ml-2 h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-14"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-2">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3 border border-gray-100/60 dark:border-gray-700/60"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  const getOverallMood = () => {
    if (!emotions) return null;
    
    const joyValue = emotions['joy'] || 0;
    const surpriseValue = emotions['surprise'] || 0;
    const sadnessValue = emotions['sadness'] || 0;
    const fearValue = emotions['fear'] || 0;
    const disgustValue = emotions['disgust'] || 0;
    const angerValue = emotions['anger'] || 0;
    
    const emotionValues = [
      { name: 'joy', value: joyValue },
      { name: 'surprise', value: surpriseValue },
      { name: 'sadness', value: sadnessValue },
      { name: 'fear', value: fearValue },
      { name: 'disgust', value: disgustValue },
      { name: 'anger', value: angerValue }
    ];
    
    emotionValues.sort((a, b) => b.value - a.value);
    const dominantEmotion = emotionValues[0].name;
    const dominantValue = emotionValues[0].value;
    
    if (dominantValue < 25) {
      return 'Karışık/Nötr';
    }
    
    if (dominantEmotion === 'joy') {
      return 'Neşeli';
    }
    
    if (dominantEmotion === 'surprise') {
      return 'Heyecanlı';
    }
    
    if (dominantEmotion === 'sadness') {
      return 'Üzgün';
    }
    
    if (dominantEmotion === 'fear') {
      return 'Korkulu';
    }
    
    if (dominantEmotion === 'anger') {
      return 'Öfkeli';
    }
    
    if (dominantEmotion === 'disgust') {
      return 'Tiksinmiş';
    }
  };
  
  const overallMood = getOverallMood();
  
  const getDominantEmotion = () => {
    if (!emotions) return null;
    
    const sorted = Object.entries(emotions)
      .sort(([, a], [, b]) => (b as number) - (a as number));
    
    return sorted.length > 0 ? sorted[0][0] : null;
  };
  
  const dominantEmotion = getDominantEmotion();
  const dominantConfig = dominantEmotion ? 
    emotionConfig[dominantEmotion] : 
    { color: 'text-gray-500', gradient: 'from-gray-400 to-gray-600', turkishName: dominantEmotion || '' };
  
  return (
    <section className="w-full h-full bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <BarChart3 size={22} className="text-purple-500" />
          <h2 className="font-semibold">Duygu Analizi</h2>
        </div>
      </div>
      
      <div className="px-6 py-4">
        {!selectedTrack ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <BarChart3 size={48} className="mb-4 opacity-50" />
            <p className="text-center">Duygu analizi için bir şarkı seçin</p>
          </div>
        ) : !lyrics ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <BarChart3 size={48} className="mb-4 opacity-50" />
            <p className="text-center">Şarkı sözleri yükleniyor...</p>
          </div>
        ) : isLoading ? (
          <SentimentSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-red-500">
            <BarChart3 size={48} className="mb-4 opacity-50" />
            <p className="text-center">{error}</p>
          </div>
        ) : emotions ? (
          <>
            
            <div className="mb-2">
              <div className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium mb-2">Duygu Analizi Sonucu</h3>

                      <div 
                        className={`px-4 py-2 rounded-md text-white font-medium shadow-sm bg-gradient-to-r ${dominantConfig.gradient}`}
                      >
                        {overallMood}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  Duygu analizi, şarkı sözlerindeki baskın duyguları değerlendirerek genel bir duygu durumu hesaplar.
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-3">
                <h4 className="text-base font-bold">Duygu Dağılımı</h4>
                <div className="ml-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full py-0.5 px-2">
                  6 Duygu
                </div>
              </div>
              {renderEmotionBars()}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <BarChart3 size={48} className="mb-4 opacity-50" />
            <p className="text-center">Duygu analizi sırasında bir hata oluştu.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SentimentAnalysis; 