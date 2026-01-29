#include <pcap.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <time.h>
#include <arpa/inet.h>
#include <net/ethernet.h>
#include <netinet/ip.h>
#include <netinet/tcp.h>
#include <netinet/udp.h>

#define MAX_FLOWS           4096
#define MAX_SOURCES         1024
#define MAX_PORTS_PER_SRC   256
#define FLOW_TIMEOUT        300  

// anomali eşikleri
#define PPS_THRESHOLD       100     // kural 1: saniyede maksimum paket sayısı
#define SCAN_WINDOW         5       // kural 2: port tarama penceresi (saniye)
#define SCAN_PORT_LIMIT     30      // kural 2: farklı port deneme limiti
#define SSH_WINDOW          10      // kural 3: SSH penceresi (saniye)
#define SSH_PACKET_LIMIT    50      // kural 3: SSH paket limiti

// flow tanımları (src_ip, dst_ip, src_port, dst_port, protocol)
typedef struct {
    uint32_t src_ip, dst_ip;
    uint16_t src_port, dst_port;
    uint8_t  proto;
} FlowKey;

// Her flowun kayıtları
typedef struct {
    FlowKey key;
    time_t   sec_bucket;      // mevcut saniye bucketı
    uint32_t pps_in_sec;      // bu saniyedeki paket sayısı
    time_t   last_seen;       // son görülme zamanı
    uint64_t total_pkts;      // toplam paket sayısı
} Flow;

typedef struct {
    uint32_t src_ip;
    
    time_t   scan_window_start;
    uint16_t scanned_ports[MAX_PORTS_PER_SRC];
    uint16_t port_count;
    
    time_t   ssh_window_start;
    uint32_t ssh_pkts;
    
    time_t last_seen;
} SourceState;

Flow flows[MAX_FLOWS];
int flow_count = 0;

SourceState sources[MAX_SOURCES];
int source_count = 0;

void ip_to_str(uint32_t ip, char *buf, size_t n) {
    struct in_addr a;
    a.s_addr = ip;
    snprintf(buf, n, "%s", inet_ntoa(a));
}

// iki flowın eşit olup olmadığını kontrol eder
int flowkey_eq(const FlowKey *a, const FlowKey *b) {
    return a->src_ip == b->src_ip && a->dst_ip == b->dst_ip &&
           a->src_port == b->src_port && a->dst_port == b->dst_port &&
           a->proto == b->proto;
}

// eski flowları temizler
void cleanup_old_flows(time_t now) {
    int i = 0;
    while (i < flow_count) {
        if (now - flows[i].last_seen > FLOW_TIMEOUT) {
            flows[i] = flows[--flow_count];
        } else {
            i++;
        }
    }
}

// verilen flow anahtarı için flow bulur veya yeni oluşturur
Flow* get_or_create_flow(const FlowKey *k, time_t now) {
    for (int i = 0; i < flow_count; i++) {
        if (flowkey_eq(&flows[i].key, k)) {
            return &flows[i];
        }
    }
    
    if (flow_count >= MAX_FLOWS) { // yer aç
        cleanup_old_flows(now);
        if (flow_count >= MAX_FLOWS) return NULL;
    }
    
    Flow *f = &flows[flow_count++];
    memset(f, 0, sizeof(*f));
    f->key = *k;
    f->sec_bucket = now;
    f->pps_in_sec = 0;
    f->last_seen = now;
    f->total_pkts = 0;
    return f;
}

// source ip için flow bulur veya yeni oluşturur
SourceState* get_or_create_source(uint32_t src_ip, time_t now) {
    for (int i = 0; i < source_count; i++) {
        if (sources[i].src_ip == src_ip) {
            return &sources[i];
        }
    }
    
    if (source_count >= MAX_SOURCES) return NULL;
    
    SourceState *s = &sources[source_count++];
    memset(s, 0, sizeof(*s));
    s->src_ip = src_ip;
    s->scan_window_start = now;
    s->ssh_window_start = now;
    s->last_seen = now;
    return s;
}

// port daha önce kaydedildi mi kontrol eder
int is_port_seen(SourceState *s, uint16_t port) {
    for (uint16_t i = 0; i < s->port_count; i++) {
        if (s->scanned_ports[i] == port) return 1;
    }
    return 0;
}

// yeni bir portu kaydeder
void add_port(SourceState *s, uint16_t port) {
    if (is_port_seen(s, port)) return;
    if (s->port_count < MAX_PORTS_PER_SRC) {
        s->scanned_ports[s->port_count++] = port;
    }
}

// high rate, aynı flow'dan saniyede çok fazla paket isteği
void rule1_high_rate_detection(Flow *f, time_t now) {
    if (f->sec_bucket == now) {
        f->pps_in_sec++;
    } else {
        f->sec_bucket = now;
        f->pps_in_sec = 1;
    }
    
    if (f->pps_in_sec == PPS_THRESHOLD + 1) {
        char src_ip[32], dst_ip[32];
        ip_to_str(f->key.src_ip, src_ip, sizeof(src_ip));
        ip_to_str(f->key.dst_ip, dst_ip, sizeof(dst_ip));
        
        printf("Anomali---High rate---%s:%u -> %s:%u---Proto=%u---pps=%u\n",
               src_ip, ntohs(f->key.src_port), 
               dst_ip, ntohs(f->key.dst_port),
               f->key.proto, f->pps_in_sec);
    }
}

// port scan, kısa sürede çok sayıda farklı porta istek
void rule2_portscan_detection(SourceState *s, uint16_t dst_port, time_t now) {
    if (now - s->scan_window_start > SCAN_WINDOW) {
        s->scan_window_start = now;
        s->port_count = 0;
    }
    
    add_port(s, dst_port);
    
    if (s->port_count == SCAN_PORT_LIMIT) {
        char src_ip[32];
        ip_to_str(s->src_ip, src_ip, sizeof(src_ip));
        
        printf("Anomali---Port scanning---kaynak=%s---%u farklı port---%ds içinde\n",
               src_ip, s->port_count, SCAN_WINDOW);
        
        s->scan_window_start = now;
        s->port_count = 0;
    }
}

// SSH brute-force, SSH portuna (22) kısa sürede çok sayıda istek
void rule3_ssh_bruteforce_detection(SourceState *s, uint16_t dst_port, time_t now) {
    if (ntohs(dst_port) != 22) return;
    
    if (now - s->ssh_window_start > SSH_WINDOW) {
        s->ssh_window_start = now;
        s->ssh_pkts = 0;
    }
    
    s->ssh_pkts++;
    
    if (s->ssh_pkts == SSH_PACKET_LIMIT) {
        char src_ip[32];
        ip_to_str(s->src_ip, src_ip, sizeof(src_ip));
        
        printf("Anomali---SSH brute-force---kaynak=%s---%u SSH paketi---%ds içinde\n",
               src_ip, s->ssh_pkts, SSH_WINDOW);
        
        s->ssh_window_start = now;
        s->ssh_pkts = 0;
    }
}

void packet_handler(u_char *user, const struct pcap_pkthdr *h, const u_char *bytes)
{
    (void)user;
    time_t now = h->ts.tv_sec;
    
    const struct ether_header *eth = (const struct ether_header*)bytes;
    if (ntohs(eth->ether_type) != ETHERTYPE_IP) return;
    
    const struct ip *iph = (const struct ip*)(bytes + sizeof(struct ether_header));
    int ip_hdr_len = iph->ip_hl * 4;
    if (ip_hdr_len < 20) return;
    
    FlowKey key;
    memset(&key, 0, sizeof(key));
    key.src_ip = iph->ip_src.s_addr;
    key.dst_ip = iph->ip_dst.s_addr;
    key.proto = iph->ip_p;
    
    const u_char *l4_header = (const u_char*)iph + ip_hdr_len;
    uint16_t src_port = 0, dst_port = 0;
    
    if (key.proto == IPPROTO_TCP) {
        const struct tcphdr *tcp = (const struct tcphdr*)l4_header;
        src_port = tcp->th_sport;
        dst_port = tcp->th_dport;
    } else if (key.proto == IPPROTO_UDP) {
        const struct udphdr *udp = (const struct udphdr*)l4_header;
        src_port = udp->uh_sport;
        dst_port = udp->uh_dport;
    } else {
        return;  // Sadece TCP/UDP
    }
    
    key.src_port = src_port;
    key.dst_port = dst_port;
    
    // flow ve source state'i al veya oluştur
    Flow *flow = get_or_create_flow(&key, now);
    SourceState *src = get_or_create_source(key.src_ip, now);
    if (!flow || !src) return;
    
    // istatistikleri güncelle
    flow->total_pkts++;
    flow->last_seen = now;
    src->last_seen = now;
    
    // anomali tespit kurallarını çalıştır
    rule1_high_rate_detection(flow, now);
    rule2_portscan_detection(src, dst_port, now);
    rule3_ssh_bruteforce_detection(src, dst_port, now);
}

int main(int argc, char **argv) {
    if (argc < 3) {
        fprintf(stderr, "kullanım: %s <device> <ip>\n", argv[0]);
        fprintf(stderr, "örnek:    %s en0 192.168.1.1\n", argv[0]);
        return 1;
    }
    
    const char *device = argv[1];
    const char *server_ip = argv[2];
    
    char errbuf[PCAP_ERRBUF_SIZE];
    pcap_t *handle = pcap_open_live(device, 65535, 1, 1000, errbuf);
    if (!handle) {
        fprintf(stderr, "pcap_open_live error: %s\n", errbuf);
        return 1;
    }
    
    printf("Device: %s\n", device);
    printf("-------------------------------------------------------------------------------\n");
    printf("Anomali:\n");
    printf("High rate: %d paket/saniye\n", PPS_THRESHOLD);
    printf("Port scan: %d port / %d saniye\n", SCAN_PORT_LIMIT, SCAN_WINDOW);
    printf("SSH brute-force: %d paket / %d saniye (port 22)\n", SSH_PACKET_LIMIT, SSH_WINDOW);
    printf("-------------------------------------------------------------------------------\n");
    printf("Dinleniyor...\n\n");
    
    pcap_loop(handle, -1, packet_handler, NULL);
    
    pcap_close(handle);
    return 0;
}
