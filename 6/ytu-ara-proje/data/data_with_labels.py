import random
import pandas as pd
import re

df = pd.read_csv('./data/manoh2f2:tstterbak-lyrics-dataset-with-emotions.csv', encoding='utf-8')

# Gereksiz sütunları at
df = df.drop(columns=['__index_level_0__'])
df = df.dropna()
df = df[~df['emotions'].str.contains('neutral')]

# Metin temizleme
df['seq'] = df['seq'].apply(lambda x: re.sub(r'<[^>]+>', '', x))
df['seq'] = df['seq'].str.replace(r'_x000D_\n', ' ', regex=True).str.strip()
df['seq'] = df['seq'].str.replace(r'_x000D_', ' ', regex=True).str.strip()
df["seq"] = df["seq"].str.replace("\n", " ", regex=False)
df["seq"] = df["seq"].str.replace(r"\s{2,}", " ", regex=True).str.strip()

# Tekrarları sil
df = df.drop_duplicates(subset=['song'], keep='first')
df = df.drop_duplicates(subset=['seq'], keep='first')
df = df.drop_duplicates(subset=['song', 'artist'], keep='first').reset_index(drop=True)

# İstenen seçim fonksiyonu
def custom_emotion_select(emotion_str):
    emotion_str = emotion_str.strip().lower()
    if emotion_str.startswith('[') and emotion_str.endswith(']'):
        emotion_str = emotion_str[1:-1]
    emotions = [em.strip(" '\"") for em in emotion_str.split(',') if em.strip(" '\"")]
    # fear ve sadness harici varsa onlardan rastgele seç, yoksa fear veya sadness'ten rastgele seç
    other_emotions = [em for em in emotions if em not in ['fear', 'sadness']]
    if len(emotions) > 1 and other_emotions:
        return random.choice(other_emotions)
    else:
        return random.choice(emotions)

df['label_name'] = df['emotions'].apply(custom_emotion_select)

# Her labeldan en fazla 4000 tane al
max_per_label = 4000
sampled_frames = []
for label in df['label_name'].unique():
    temp = df[df['label_name'] == label]
    if len(temp) > max_per_label:
        temp = temp.sample(max_per_label, random_state=42)
    sampled_frames.append(temp)

final_df = pd.concat(sampled_frames).reset_index(drop=True)

# Sonuçları yazdır
print("Her label'dan örnek sayısı:")
print(final_df['label_name'].value_counts())
print("\nLabel isimleri ve label id eşleşmesi:")
print("\nToplam satır sayısı:", len(final_df))

final_df.to_csv("sampled_emotions.csv", index=False)
print("sampled_emotions.csv dosyası kaydedildi.")