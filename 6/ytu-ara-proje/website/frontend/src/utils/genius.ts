import type { SpotifyTrack } from "./spotify";

export async function getLyricsForSpotifyTrack(track: SpotifyTrack): Promise<string> {
  try {
    const artistName = track.artists[0]?.name || '';
    const trackName = track.name || '';
    
    
    if (!trackName || !artistName) {
      throw new Error('Şarkı ismi veya sanatçı bilgisi eksik');
    }
    
    const response = await fetch(
      `/api/genius?title=${encodeURIComponent(trackName)}&artist=${encodeURIComponent(artistName)}`
    );
    
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Şarkı sözleri bulunamadı');
    }
    
    const data = await response.json();
    
    if (!data.lyrics || data.lyrics.length < 50) {
      throw new Error('Geçerli şarkı sözleri bulunamadı');
    }
    
    return data.lyrics;
  } catch (error) { 
    throw new Error(`Şarkı sözleri bulunamadı: ${(error as Error).message}`);
  }
} 