"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import type { SpotifyTrack } from "@/utils/spotify";
import { getYear } from "@/utils/spotify";

interface MusicCardProps {
  song: SpotifyTrack;
  onSelect: (track: SpotifyTrack) => void;
  isSelected: boolean;
}

const MusicCard = ({ song, onSelect, isSelected }: MusicCardProps) => {
  const year = getYear(song);
  const mainImage = song.album.images[0]?.url || "https://placehold.co/300x300/4169e1/FFFFFF?text=No+Image";
  const artistName = song.artists.map(artist => artist.name).join(", ");

  return (
    <div 
      className={`relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer
        ${isSelected ? 'ring-2 ring-purple-500 shadow-lg scale-[1.03] bg-purple-50 dark:bg-purple-900/20' : 'hover:shadow-lg hover:scale-[1.02] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'} `}
      onClick={() => onSelect(song)}
    >
      <div className="relative h-40 w-full">
        <Image
          src={mainImage}
          alt={`${song.name} by ${artistName}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 bg-white dark:bg-gray-800">
        <h3 className="font-medium text-base truncate">{song.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm truncate">{artistName}</p>
        
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            {year}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
            <Star className="mr-1" size={12} /> {song.popularity}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MusicCard; 