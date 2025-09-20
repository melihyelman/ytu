"use client";

import { useState, useRef, useEffect } from "react";
import SearchSection from "@/components/SearchSection";
import MusicResults from "@/components/MusicResults";
import LyricsDisplay from "@/components/LyricsDisplay";
import SentimentAnalysis from "@/components/SentimentAnalysis";
import type { SpotifyTrack } from "@/utils/spotify";

export default function Home() {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [lyricsError, setLyricsError] = useState<boolean>(false);
  
  const lyricsRef = useRef<HTMLDivElement>(null);

  const handleSearch = (results: SpotifyTrack[]) => {
    setTracks(results);
    setHasSearched(true);
    setSelectedTrack(null);
    setLyrics(null);
    setLyricsError(false);
  };

  const handleSelectTrack = (track: SpotifyTrack) => {
    setSelectedTrack(track);
    setLyrics(null);
    setLyricsError(false); 
  };
  
  const handleLyricsLoaded = (fetchedLyrics: string, hasError: boolean = false) => {
    if (hasError) {
      setLyrics(null);
      setLyricsError(true);
    } else {
      setLyrics(fetchedLyrics);
      setLyricsError(false);
    }
  };
  
  useEffect(() => {
    if (selectedTrack && lyricsRef.current) {
      setTimeout(() => {
        lyricsRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [selectedTrack]);

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 lg:p-24 bg-gradient-to-b from-transparent via-purple-50/30 to-blue-50/20 dark:from-transparent dark:via-purple-900/5 dark:to-blue-900/10 page-transition">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
        Şarkı Sözlerinden Duygu Analizi
      </h1>
      
      <div className="w-full max-w-6xl mx-auto space-y-8">
        <div className="animate-[fadeIn_0.4s_ease-out_forwards]">
          <SearchSection onSearch={handleSearch} setIsLoading={setIsLoading} />
        </div>
        
        {(hasSearched || isLoading) && (
          <div className="animate-[fadeIn_0.5s_ease-out_forwards]">
            <MusicResults 
              tracks={tracks} 
              isLoading={isLoading} 
              onSelectTrack={handleSelectTrack}
              selectedTrack={selectedTrack}
            />
          </div>
        )}
        
        {selectedTrack && (
          <div ref={lyricsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fadeIn_0.6s_ease-out_forwards]">
            <LyricsDisplay 
              selectedTrack={selectedTrack} 
              onLyricsLoaded={handleLyricsLoaded} 
            />
            <SentimentAnalysis 
              selectedTrack={selectedTrack} 
              lyrics={lyricsError ? null : lyrics} 
            />
          </div>
        )}
      </div>
    </main>
  );
}
