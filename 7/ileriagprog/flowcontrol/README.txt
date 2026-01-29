Compile:
gcc flowcontrol.c -lpcap -o flowcontrol

Run:
sudo ./flowcontrol <device> <ip>

Kendimden örnek:
sudo ./flowcontrol en0 192.168.1.1


ANOMALİLER

High Rate
   Aynı flow'dan saniyede çok fazla paket geliyorsa tespit edilir

Port Scanning
   Bir kaynak ip kısa sürede çok sayıda farklı porta erişmeye çalışıyorsa

SSH Brute-Force
   SSH portuna (22) kısa sürede çok sayıda bağlantı denemesi


Anomali eşikleri
#define PPS_THRESHOLD       100     // Kural 1: saniyede maksimum paket sayısı
#define SCAN_WINDOW         5       // Kural 2: port tarama penceresi (saniye)
#define SCAN_PORT_LIMIT     30      // Kural 2: farklı port deneme limiti
#define SSH_WINDOW          10      // Kural 3: SSH penceresi (saniye)
#define SSH_PACKET_LIMIT    50      // Kural 3: SSH paket limiti