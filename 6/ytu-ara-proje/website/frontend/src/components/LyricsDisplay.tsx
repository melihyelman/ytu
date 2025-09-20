"use client";

import { Music } from "lucide-react";
import { useState, useEffect } from "react";
import type { SpotifyTrack } from "@/utils/spotify";
import { getLyricsForSpotifyTrack } from "@/utils/genius";

interface LyricsDisplayProps {
  selectedTrack?: SpotifyTrack | null;
  onLyricsLoaded?: (lyrics: string, hasError?: boolean) => void;
}

const LyricsDisplay = ({ selectedTrack, onLyricsLoaded }: LyricsDisplayProps) => {
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatLyricsToHTML = (lyricsText: string): string => {
    if (!lyricsText) return '';
    
    
    let formattedLyrics = lyricsText
      .replace(/\n/g, '<br>')
      .replace(/\r/g, '')
      .trim();
    
    formattedLyrics = formattedLyrics.replace(/<br><br>/g, '<br><br><br>');
    
    return formattedLyrics;
  };

  useEffect(() => {
    if (selectedTrack) {
      setIsLoading(true);
      setLyrics(null);
      setError(null);
      
      const fetchLyrics = async () => {
        try {
          const fetchedLyrics = await getLyricsForSpotifyTrack(selectedTrack);
          
          if (fetchedLyrics && 
              !fetchedLyrics.includes("Şarkı sözleri bulunamadı") && 
              !fetchedLyrics.includes("Failed to fetch") &&
              !fetchedLyrics.includes("Lyrics could not be extracted") &&
              fetchedLyrics.length > 50) {
            
            setLyrics(fetchedLyrics);
            
            if (onLyricsLoaded) {
              onLyricsLoaded(fetchedLyrics, false);
            }
          } else {
            setError("Bu şarkı için şarkı sözleri bulunamadı.");
            if (onLyricsLoaded) {
              onLyricsLoaded("", true);
            }
          }
          
        } catch (err) {
          setError("Şarkı sözleri yüklenirken bir hata oluştu. Lütfen başka bir şarkı deneyin.");
          if (onLyricsLoaded) {
            onLyricsLoaded("", true);
          }
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchLyrics();
    } else {
      setLyrics(null);
      setError(null);
    }
  }, [selectedTrack, onLyricsLoaded]);

  const LyricsSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-12"></div>
      </div>
      
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-4/5"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
      
      <div className="py-2"></div>
      
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
      
      <div className="py-2"></div>
      
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-4/5"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6"></div>
    </div>
  );

  return (
    <section className="w-full h-full bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Music size={22} className="text-purple-500" />
          <h2 className="font-semibold">Şarkı Sözleri</h2>
        </div>
        {selectedTrack && (
          <div className="flex items-center">
            <span className="text-xs text-gray-500">{selectedTrack.name} - {selectedTrack.artists[0]?.name}</span>
          </div>
        )}
      </div>
      
      <div className="px-6 py-4 overflow-y-auto h-[500px] bg-white dark:bg-gray-800 text-sm sm:text-base leading-relaxed">
        {isLoading ? (
          <LyricsSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-red-500">
            <Music size={48} className="mb-4 opacity-50" />
            <p className="text-center">{error}</p>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Duygu analizi bu şarkı için yapılamayacak.
            </p>
          </div>
        ) : lyrics ? (
          <div 
            className="lyrics-content leading-7 text-gray-800 dark:text-gray-200"
            dangerouslySetInnerHTML={{ 
              __html: formatLyricsToHTML(lyrics) 
            }} 
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Music size={48} className="mb-4 opacity-50" />
            <p className="text-center">Şarkı sözlerini görüntülemek için bir şarkı seçin</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LyricsDisplay; 