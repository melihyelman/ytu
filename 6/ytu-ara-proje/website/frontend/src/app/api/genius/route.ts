import { NextResponse } from 'next/server';

let geniusClientInstance: any = null; 

async function getGeniusClient() {
  if (geniusClientInstance) {
    return geniusClientInstance;
  }

  const Genius = await import('genius-lyrics');
  geniusClientInstance = Genius.default || Genius; 
  
  return geniusClientInstance;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const artist = searchParams.get('artist');
  
  
  if (!title) {
    return NextResponse.json({ error: 'Title parameter is required' }, { status: 400 });
  }

  try {
    const GeniusModule = await getGeniusClient();
    const geniusToken = process.env.GENIUS_ACCESS_TOKEN;

    if (!geniusToken) {
      return NextResponse.json({ error: 'Server configuration error: Genius API token missing' }, { status: 500 });
    }

    const Client = new GeniusModule.Client(geniusToken);
    
    const searchQuery = artist ? `${title} ${artist}` : title;
    
    const searches = await Client.songs.search(searchQuery);
    
    if (!searches || searches.length === 0) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }
    
    const firstSong = searches[0];
    
    let lyrics: string | null = null;

    lyrics = await firstSong.lyrics();
    

    if (!lyrics || lyrics.length < 50) { 
      return NextResponse.json({ error: 'Lyrics could not be extracted or are too short' }, { status: 404 });
    }
    
    const cleanedLyrics = cleanLyrics(lyrics);
    
    if (!cleanedLyrics || cleanedLyrics.length < 50) { 
      return NextResponse.json({ error: 'Lyrics could not be extracted after cleaning' }, { status: 404 });
    }
    
    
    return NextResponse.json({
      title: firstSong.title,
      artist: firstSong.artist.name,
      lyrics: cleanedLyrics
    });
    
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch lyrics due to a server error.' + err }, { status: 500 });
  }
}

function cleanLyrics(lyrics: string): string {
  if (!lyrics) return '';
  
  
  let cleaned = lyrics;
  
  cleaned = cleaned.replace(/\[.*?\]/g, '');

  cleaned = cleaned.replace(/^\d+\s*Contributors?.*$/gim, '') 
                   .replace(/^Translations?.*$/gim, '')   
                   .replace(/^Embed$/gim, '')             
                   .replace(/^You might also like$/gim, '') 
                   .replace(/^More on Genius$/gim, '') 
                   .replace(/^\d+K?$/gim, '')             
                   .replace(/^Lyrics$/gim, '')            
                   .replace(/^Song Lyrics$/gim, '')       
                   .replace(/^See.*Translations$/gim, ''); 
  
  cleaned = cleaned.replace(/\s{2,}/g, ' ') 
                   .replace(/\n\s+/g, '\n') 
                   .replace(/\n{2,}/g, '\n\n') 
                   .trim(); 
  
  cleaned = cleaned.split('\n')
                   .filter(line => line.trim().length > 0)
                   .join('\n')
                   .trim();
  
  
  return cleaned;
}