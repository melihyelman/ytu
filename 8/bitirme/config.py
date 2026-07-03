"""
Central configuration file — All scrapers use these settings.
"""

import os
import random
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
RAW_DIR = os.path.join(DATA_DIR, "raw")
PROCESSED_DIR = os.path.join(DATA_DIR, "processed")
for d in [RAW_DIR, PROCESSED_DIR]:
    os.makedirs(d, exist_ok=True)

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
]

REQUEST_DELAY_MIN = 1.0
REQUEST_DELAY_MAX = 3.0

MAX_RETRIES = 3
RETRY_BACKOFF = 5 

REQUEST_TIMEOUT = 30

PROXY = None

PROXIES = {"http": PROXY, "https": PROXY} if PROXY else None

MAX_REVIEWS_PER_MOVIE = 1000

MIN_REVIEW_LENGTH = 20

IMDB_TOP250_FILE = os.path.join(RAW_DIR, "imdb_top250.csv")
IMDB_REVIEWS_FILE = os.path.join(RAW_DIR, "imdb_reviews.csv")
LETTERBOXD_REVIEWS_FILE = os.path.join(RAW_DIR, "letterboxd_reviews.csv")
BEYAZPERDE_REVIEWS_FILE = os.path.join(RAW_DIR, "beyazperde_reviews.csv")
EKSISOZLUK_REVIEWS_FILE = os.path.join(RAW_DIR, "eksisozluk_reviews.csv")

def get_random_headers():
    return {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
    }


def random_delay():
    delay = random.uniform(REQUEST_DELAY_MIN, REQUEST_DELAY_MAX)
    time.sleep(delay)


def safe_request(session, url, method="GET", **kwargs):
    for attempt in range(MAX_RETRIES):
        try:
            kwargs.setdefault("headers", get_random_headers())
            kwargs.setdefault("timeout", REQUEST_TIMEOUT)
            if PROXIES:
                kwargs.setdefault("proxies", PROXIES)

            response = session.request(method, url, **kwargs)
            response.raise_for_status()
            return response

        except Exception as e:
            wait = RETRY_BACKOFF * (attempt + 1)
            print(f"[RETRY {attempt+1}/{MAX_RETRIES}] {url} — {e} — Waiting {wait}s...")
            time.sleep(wait)

    print(f" {url} — {MAX_RETRIES} attempts failed.")
    return None
