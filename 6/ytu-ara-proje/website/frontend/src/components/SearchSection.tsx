"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { searchTracks } from "@/utils/spotify";
import type { SpotifyTrack } from "@/utils/spotify";

interface SearchSectionProps {
  onSearch: (results: SpotifyTrack[]) => void;
  setIsLoading: (loading: boolean) => void;
}

const SearchSection = ({ onSearch, setIsLoading }: SearchSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    try {
      setIsLoading(true);
      const results = await searchTracks(searchTerm);
      onSearch(results);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-3xl">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Şarkı veya sanatçı ara..."
                className="w-full py-4 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-6 rounded-full hover:opacity-90 transition-opacity shadow-md"
            >
              Ara
            </button>
          </form>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Herhangi bir <span className="font-bold text-purple-600">İngilizce</span> şarkıyı arayarak duygu analizini yapabilirsiniz
        </div>
      </div>
    </section>
  );
};

export default SearchSection; 