"use client";

import { Search } from "lucide-react";
import type { SpotifyTrack } from "@/utils/spotify";
import MusicCard from "./MusicCard";

interface MusicResultsProps {
  tracks: SpotifyTrack[];
  isLoading: boolean;
  onSelectTrack: (track: SpotifyTrack) => void;
  selectedTrack: SpotifyTrack | null;
}

const SkeletonCard = () => (
  <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="relative h-40 w-full bg-gray-200 dark:bg-gray-700"></div>
    <div className="p-4 bg-white dark:bg-gray-800">
      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-md w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-md w-1/2 mb-3"></div>
      <div className="flex space-x-2">
        <div className="h-5 w-12 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
      </div>
    </div>
  </div>
);

const MusicResults = ({ tracks, isLoading, onSelectTrack, selectedTrack }: MusicResultsProps) => {
  if (isLoading) {
    return (
      <section className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Search size={22} className="text-purple-500" />
            <h2 className="font-semibold">Aranıyor...</h2>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (tracks.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Search size={22} className="text-purple-500" />
          <h2 className="font-semibold">Arama Sonuçları</h2>
        </div>
      </div>
      
      <div className="p-6 bg-gradient-to-br from-white via-gray-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-purple-900/10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {tracks.map((track) => (
            <MusicCard 
              key={track.id} 
              song={track} 
              onSelect={onSelectTrack}
              isSelected={selectedTrack?.id === track.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MusicResults; 