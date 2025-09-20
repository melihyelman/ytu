interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  expiry_time: number;
}

interface SpotifyArtist {
  id: string;
  name: string;
}

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyAlbum {
  id: string;
  name: string;
  release_date: string;
  images: SpotifyImage[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  popularity: number;
  preview_url: string | null;
}

let spotifyToken: SpotifyToken | null = null;

async function getAccessToken(): Promise<string> {
  if (spotifyToken && spotifyToken.expiry_time > Date.now()) {
    return spotifyToken.access_token;
  }

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ;
  const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

  try {
    const credentials = typeof window !== 'undefined' 
      ? btoa(`${clientId}:${clientSecret}`)
      : Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.access_token) {
      throw new Error('No access token received from Spotify');
    }
    
    spotifyToken = {
      ...data,
      expiry_time: Date.now() + data.expires_in * 1000
    };

    return data.access_token;
  } catch (error) {
    throw error;
  }
}

export async function searchTracks(query: string): Promise<SpotifyTrack[]> {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const token = await getAccessToken();
    
    const cleanQuery = query.trim().replace(/[^\w\s-]/g, '');
    const encodedQuery = encodeURIComponent(cleanQuery);
    
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&market=US&limit=8`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to search tracks: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.tracks || !data.tracks.items) {
      return [];
    }
    
    const sortedTracks = [...data.tracks.items].sort((a, b) => b.popularity - a.popularity);
    
    return sortedTracks;
  } catch (error) {
    return [];
  }
}

export function getYear(track: SpotifyTrack): string {
  return track.album.release_date.split('-')[0];
} 