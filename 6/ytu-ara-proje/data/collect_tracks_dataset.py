import os
import time
import datetime
import re
import pandas as pd
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from spotipy.exceptions import SpotifyException
import lyricsgenius
from requests.exceptions import HTTPError
from langdetect import detect, DetectorFactory, LangDetectException
import random 
import concurrent.futures
import threading 

# Dil tespiti için seed
DetectorFactory.seed = 0

def is_english(text: str, min_words: int = 20) -> bool:
    """Metnin İngilizce olup olmadığını ve yeterince uzun olup olmadığını kontrol eder."""
    if not text:
        return False
    words = text.split()
    if len(words) < min_words:
        return False
    try:
        return detect(text) == 'en'
    except LangDetectException:
        return False

def clean_lyrics(raw: str) -> str:
    """Genius'tan çekilen ham şarkı sözlerini temizler."""
    if not raw:
        return ""
    text = re.sub(r"(?mi)^.*Contributors.*Lyrics.*$", "", raw)
    text = re.sub(r".*Done\.\s*", "", text, flags=re.DOTALL)
    text = re.sub(r"\[.*?\]", "", text)
    text = re.sub(r"(?m)^\s*\d+[\.\)]?\s*", "", text)
    text = re.sub(r"(?i)^.*read more.*$", "", text, flags=re.MULTILINE)
    return re.sub(r"\n{2,}", "\n", text).strip()

def spotify_search_safe(sp_client, q: str, **kwargs) -> dict:
    """Spotify API sorgularını oran sınırlamalarını aşacak şekilde güvenli bir şekilde yapar."""
    backoff = 1
    while True:
        try:
            return sp_client.search(q=q, **kwargs)
        except SpotifyException as e:
            if e.http_status == 429:
                retry = int(e.headers.get("Retry-After", backoff))
                print(f"[Spotify] 429 – sleeping {retry}s…")
                time.sleep(retry)
                backoff = min(backoff * 2, 60) # Maksimum 60 saniyeye kadar geri çekilme
            elif e.http_status == 400 and "Limit + Offset exceeds maximum of 1000" in str(e):
                print(f"[Spotify] HTTP 400 (Offset Limit) for '{q}' – skipping this offset.")
                return {'tracks': {'items': []}} 
            else:
                print(f"[Spotify] HTTP {e.http_status} for '{q}' – raising error.")
                raise 

request_count_lock = threading.Lock()
requests_made_in_interval = 0
last_reset_time = time.time()

def genius_search_safe(genius_client, title: str, artist: str, max_requests_per_minute: int = 40):
    """Genius API sorgularını oran sınırlamalarını aşacak şekilde güvenli bir şekilde yapar."""
    global requests_made_in_interval, last_reset_time

    with request_count_lock:
        current_time = time.time()
        # Eğer bir dakika geçtiyse sayacı sıfırla
        if current_time - last_reset_time >= 60:
            requests_made_in_interval = 0
            last_reset_time = current_time

        # Eğer dakikadaki maksimum istek sayısına ulaşıldıysa bekle
        if requests_made_in_interval >= max_requests_per_minute:
            wait_time = 60 - (current_time - last_reset_time)
            if wait_time > 0:
                print(f"[Genius Rate Limit] Max requests reached. Waiting for {wait_time:.2f} seconds...")
                time.sleep(wait_time)
            requests_made_in_interval = 0
            last_reset_time = time.time()

        requests_made_in_interval += 1 

    time.sleep(0.1) # Her istek arası kısa bir bekleme

    try:
        return genius_client.search_song(title, artist)
    except HTTPError as e:
        if e.response.status_code == 429:
            retry = int(e.response.headers.get('Retry-After', 5)) 
            print(f"[Genius] 429 – sleeping {retry}s…")
            time.sleep(retry)
            return genius_search_safe(genius_client, title, artist, max_requests_per_minute) 
        else:
            print(f"[Genius] HTTP {e.response.status_code} for '{title}' by '{artist}' – skipping.")
            return None
    except Exception as e:
        print(f"[Genius] Other error ({e}) for '{title}' by '{artist}' – skipping.")
        return None



def main():
    # --- Yapılandırma ---
    SPOTIPY_CLIENT_ID     = ""
    SPOTIPY_CLIENT_SECRET = ""
    GENIUS_ACCESS_TOKEN   = "" 
    OUTPUT_CSV_FILE = "tracks_with_lyrics_and_popularity.csv"
    GENRES          = ['pop', 'rock', 'hip-hop', 'r&b', 'country', 'blues']
    TARGET_TRACKS_PER_GENRE = 2000
    SPOTIFY_LIMIT           = 50
    MAX_OFFSET_FOR_SEARCH = 1000 - SPOTIFY_LIMIT
    HIGH_POPULARITY_YEAR_RANGE = 2 
    TARGET_HIGH_POPULARITY_COUNT = 200 


    CURRENT_YEAR            = datetime.datetime.now().year
    YEAR_WINDOW             = 3
    START_YEAR              = 1980

    GENIUS_MAX_REQUESTS_PER_MINUTE = 30 # dakikada 30 istekten fazla yapma

    sp = spotipy.Spotify(
        client_credentials_manager=SpotifyClientCredentials(
            client_id=SPOTIPY_CLIENT_ID,
            client_secret=SPOTIPY_CLIENT_SECRET
        )
    )

    genius = lyricsgenius.Genius(
        GENIUS_ACCESS_TOKEN,
        remove_section_headers=True,
        skip_non_songs=True,
        verbose=False,
        timeout=15,
        sleep_time=0.3, 
        retries=3
    )

    all_tracks_data = []
    seen_track_ids  = set()

    if os.path.exists(OUTPUT_CSV_FILE):
        try:
            existing_df = pd.read_csv(OUTPUT_CSV_FILE)
            all_tracks_data.extend(existing_df.to_dict('records'))
            seen_track_ids.update(existing_df['track_id'].tolist())
            print(f"Mevcut '{OUTPUT_CSV_FILE}' dosyasından {len(existing_df)} kayıt yüklendi.")
        except pd.errors.EmptyDataError:
            print(f"'{OUTPUT_CSV_FILE}' dosyası boş, yeni veri toplanacak.")
        except Exception as e:
            print(f"'{OUTPUT_CSV_FILE}' yüklenirken hata oluştu: {e}. Yeni veri toplanacak.")

    year_ranges = []
    for y in range(START_YEAR, CURRENT_YEAR + 1, YEAR_WINDOW):
        year_ranges.append((y, min(y + YEAR_WINDOW - 1, CURRENT_YEAR)))

    print("\n--- Spotify'dan Şarkı Toplanıyor ---")
    for genre in GENRES:
        collected_for_genre = 0
        collected_high_popularity = 0 
        print(f"\n→ Tür '{genre}' için {TARGET_TRACKS_PER_GENRE} İngilizce şarkı toplanıyor")

        search_queries = []

        for y in range(CURRENT_YEAR - HIGH_POPULARITY_YEAR_RANGE, CURRENT_YEAR + 1):
            search_queries.append(f'genre:"{genre}" year:{y}')
            
            hot_words = ['hit', 'top', 'chart', 'billboard', 'viral', 'radio', 'gold', 'platinum', 'award']
            for hw in hot_words:
                search_queries.append(f'"{hw}" genre:"{genre}" year:{y}')
            

        alphabet = 'abcdefghijklmnopqrstuvwxyz'
        common_words = ['love', 'time', 'heart', 'night', 'dream', 'world', 'baby', 'run', 'away', 'feel', 'life', 'fire', 'water', 'sun', 'star', 'come', 'go', 'dance'] # Kelime listesi genişletildi
        
        for _ in range(5):
            random_char_or_word = random.choice(alphabet + ''.join(common_words))
            for start_yr, end_yr in year_ranges:
                 search_queries.append(f'{random_char_or_word} year:{start_yr}-{end_yr}')

        search_queries.append(f'genre:"{genre}"')

        for _ in range(2):
            random.shuffle(search_queries)

        for query_string in search_queries:
            if collected_for_genre >= TARGET_TRACKS_PER_GENRE and collected_high_popularity >= TARGET_HIGH_POPULARITY_COUNT:
                break 

            print(f"  • Arama Sorgusu: '{query_string}'")
            for offset in range(0, MAX_OFFSET_FOR_SEARCH + 1, SPOTIFY_LIMIT):
                if collected_for_genre >= TARGET_TRACKS_PER_GENRE and collected_high_popularity >= TARGET_HIGH_POPULARITY_COUNT:
                    break

                res = spotify_search_safe(
                    sp,
                    query_string,
                    type='track',
                    market='US',
                    limit=SPOTIFY_LIMIT,
                    offset=offset
                )
                items = res['tracks']['items']
                if not items:
                    break

                for t in items:
                    if t['id'] in seen_track_ids:
                        continue

                    track_artist_text = f"{t['name']} {t['artists'][0]['name']}"
                    if not is_english(track_artist_text, min_words=2):
                        continue

                    release_date = t['album']['release_date']
                    year = int(release_date.split('-')[0]) if t['album']['release_date_precision'] != 'year' else int(release_date)

                    track_data = {
                        'track_id':     t['id'],
                        'title':        t['name'],
                        'artist':       t['artists'][0]['name'],
                        'genre':        genre,
                        'release_year': year,
                        'popularity':   t['popularity'],
                        'lyrics':       ''
                    }
                    
                    if collected_high_popularity < TARGET_HIGH_POPULARITY_COUNT and t['popularity'] >= 80:
                        all_tracks_data.append(track_data)
                        seen_track_ids.add(t['id'])
                        collected_for_genre += 1
                        collected_high_popularity += 1
                        print(f"    '{genre}' için Yüksek Popülerlik ({t['popularity']}) şarkı toplandı. ({collected_high_popularity}/{TARGET_HIGH_POPULARITY_COUNT})")
                    elif collected_for_genre < TARGET_TRACKS_PER_GENRE:
                        all_tracks_data.append(track_data)
                        seen_track_ids.add(t['id'])
                        collected_for_genre += 1
                        
                    if collected_for_genre % 100 == 0:
                        print(f"    '{genre}' için {collected_for_genre}/{TARGET_TRACKS_PER_GENRE} şarkı toplandı.")
                    
                    if collected_for_genre >= TARGET_TRACKS_PER_GENRE and collected_high_popularity >= TARGET_HIGH_POPULARITY_COUNT:
                        break

        print(f"✓ Tür '{genre}' için toplam {collected_for_genre} şarkı toplandı. ({collected_high_popularity} yüksek popülerlikte)\n")

    initial_df = pd.DataFrame(all_tracks_data)
    initial_df.drop_duplicates(subset=['track_id'], inplace=True)
    print(f"\nToplam benzersiz Spotify şarkısı: {len(initial_df)}")

    print("\nToplanan şarkıların popülerlik dağılımı:")
    print(initial_df['popularity'].describe())
    print(initial_df['popularity'].value_counts(bins=10).sort_index())

    print(f"\n--- Genius'tan Şarkı Sözleri Çekiliyor ---")

    tracks_to_process_df = initial_df[initial_df['lyrics'] == ''].copy()
    total_tracks_to_process = len(tracks_to_process_df)
    print(f"\nŞarkı sözü çekilecek toplam {total_tracks_to_process} kayıt var.")

    MAX_WORKERS = 3 

    def fetch_lyrics_for_row_parallel(row_data, genius_client_instance, max_req_per_min):
        """Paralel işlem için bir şarkının sözlerini çeker."""
        track_id = row_data['track_id']
        title = row_data['title']
        artist = row_data['artist']

        lyrics = ''
        try:
            song = genius_search_safe(genius_client_instance, title, artist, max_req_per_min)
            raw_lyrics = song.lyrics if (song and song.lyrics) else ""
            cleaned_lyrics = clean_lyrics(raw_lyrics)

            if cleaned_lyrics and is_english(cleaned_lyrics):
                lyrics = cleaned_lyrics
            else:
                lyrics = ''
        except Exception as e:
            print(f"Track ID {track_id} için söz çekilirken hata: {e}")
            lyrics = '' 

        return track_id, lyrics

    processed_count = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(fetch_lyrics_for_row_parallel, row, genius, GENIUS_MAX_REQUESTS_PER_MINUTE): row['track_id']
                   for index, row in tracks_to_process_df.iterrows()}

        for future in concurrent.futures.as_completed(futures):
            track_id = futures[future]
            processed_count += 1
            try:
                fetched_track_id, lyrics = future.result()
                original_index = initial_df[initial_df['track_id'] == fetched_track_id].index
                if not original_index.empty:
                    initial_df.loc[original_index, 'lyrics'] = lyrics
                    title_to_log = initial_df.loc[original_index, 'title'].iloc[0]
                    if lyrics:
                        print(f"[{processed_count}/{total_tracks_to_process}] '{title_to_log}' – sözler çekildi ve kaydedildi.")
                    else:
                        print(f"[{processed_count}/{total_tracks_to_process}] '{title_to_log}' – sözler boş veya İngilizce değil, atlandı.")
                else:
                    print(f"Uyarı: Track ID {fetched_track_id} DataFrame'de bulunamadı.")


            except Exception as exc:
                print(f"Track ID {track_id} işlenirken beklenmeyen hata: {exc}")
                original_index = initial_df[initial_df['track_id'] == track_id].index
                if not original_index.empty:
                    initial_df.loc[original_index, 'lyrics'] = ''

            if processed_count % 500 == 0 or processed_count == total_tracks_to_process:
                initial_df.to_csv(OUTPUT_CSV_FILE, index=False)
                print(f"Ara kaydetme yapıldı: {OUTPUT_CSV_FILE}. İşlenen kayıt: {processed_count}/{total_tracks_to_process}")

    initial_df.to_csv(OUTPUT_CSV_FILE, index=False)
    print(f"\nBütün kayıtlar işlendi ve '{OUTPUT_CSV_FILE}' dosyasına yazıldı.")
    print(f"Toplam nihai satır: {len(initial_df)}")
    print("Şarkı sözü olan kayıt sayısı:", initial_df['lyrics'].apply(lambda x: len(x) > 0).sum())

if __name__ == "__main__":
    main()