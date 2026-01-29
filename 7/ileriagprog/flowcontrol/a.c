// flowmon_rules.c
// gcc -O2 -Wall flowmon_rules.c -lpcap -o flowmon
// sudo ./flowmon eth0 192.168.1.1

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

#define MAX_FLOWS      4096
#define MAX_SRCS       1024
#define MAX_PORTS_PER_SRC 256

// ====== Eşikler (ödev için ayarlanabilir) ======
#define PPS_LIMIT         1000   // Kural1: aynı flow 1 saniyede 200+ paket
#define PORTSCAN_WINDOW     5   // Kural2: 5 saniye içinde
#define PORTSCAN_LIMIT     30   //         30 farklı porta deneme
#define SSH_WINDOW         10   // Kural3: 10 saniye içinde
#define SSH_LIMIT          50   //         50+ paket -> brute-force şüphesi
// ==============================================

typedef struct {
    uint32_t src_ip, dst_ip;
    uint16_t src_port, dst_port;
    uint8_t  proto; // TCP/UDP
} FlowKey;

typedef struct {
    FlowKey key;

    // Kural1 için: saniyelik paket sayısı
    time_t   sec_bucket;     // hangi saniye
    uint32_t pps_in_sec;     // o saniyedeki paket sayısı

    time_t last_seen;
    uint64_t total_pkts;
} Flow;

typedef struct {
    uint32_t src_ip;

    // Kural2: portscan için pencere + unique port listesi
    time_t window_start;
    uint16_t ports[MAX_PORTS_PER_SRC];
    uint16_t port_count;

    // Kural3: SSH brute force için pencere + sayaç
    time_t ssh_window_start;
    uint32_t ssh_pkts;

    time_t last_seen;
} SrcState;

static Flow flows[MAX_FLOWS];
static int flow_count = 0;

static SrcState srcs[MAX_SRCS];
static int src_count = 0;

static void ip_to_str(uint32_t ip, char *buf, size_t n) {
    struct in_addr a; a.s_addr = ip;
    snprintf(buf, n, "%s", inet_ntoa(a));
}

static int flowkey_eq(const FlowKey *a, const FlowKey *b) {
    return a->src_ip==b->src_ip && a->dst_ip==b->dst_ip &&
           a->src_port==b->src_port && a->dst_port==b->dst_port &&
           a->proto==b->proto;
}

static Flow* get_or_create_flow(const FlowKey *k, time_t now) {
    for(int i=0;i<flow_count;i++) {
        if(flowkey_eq(&flows[i].key, k)) return &flows[i];
    }
    if(flow_count >= MAX_FLOWS) return NULL;

    Flow *f = &flows[flow_count++];
    memset(f, 0, sizeof(*f));
    f->key = *k;
    f->sec_bucket = now;
    f->pps_in_sec = 0;
    f->last_seen = now;
    return f;
}

static SrcState* get_or_create_src(uint32_t src_ip, time_t now) {
    for(int i=0;i<src_count;i++) {
        if(srcs[i].src_ip == src_ip) return &srcs[i];
    }
    if(src_count >= MAX_SRCS) return NULL;

    SrcState *s = &srcs[src_count++];
    memset(s, 0, sizeof(*s));
    s->src_ip = src_ip;
    s->window_start = now;
    s->ssh_window_start = now;
    s->last_seen = now;
    return s;
}

static int port_seen(SrcState *s, uint16_t dport) {
    for(uint16_t i=0;i<s->port_count;i++) {
        if(s->ports[i] == dport) return 1;
    }
    return 0;
}

static void add_port(SrcState *s, uint16_t dport) {
    if(port_seen(s, dport)) return;
    if(s->port_count < MAX_PORTS_PER_SRC) {
        s->ports[s->port_count++] = dport;
    }
}

// ====== KURALLAR ======

static void rule1_high_rate_flow(Flow *f, time_t now) {
    // aynı saniye mi?
    if(f->sec_bucket == now) {
        f->pps_in_sec++;
    } else {
        f->sec_bucket = now;
        f->pps_in_sec = 1;
    }

    if(f->pps_in_sec == PPS_LIMIT + 1) { // 1 kez yazsın diye == (limit+1)
        char sip[32], dip[32];
        ip_to_str(f->key.src_ip, sip, sizeof sip);
        ip_to_str(f->key.dst_ip, dip, sizeof dip);
        printf("[ANOMALY][RULE1 HighRate] %s:%u -> %s:%u proto=%u pps=%u (ACTION: THROTTLE_SIM)\n",
               sip, ntohs(f->key.src_port), dip, ntohs(f->key.dst_port),
               f->key.proto, f->pps_in_sec);
    }
}

static void rule2_portscan(SrcState *s, uint16_t dst_port, time_t now) {
    // pencereyi kontrol et
    if(now - s->window_start > PORTSCAN_WINDOW) {
        s->window_start = now;
        s->port_count = 0;
    }

    add_port(s, dst_port);

    if(s->port_count == PORTSCAN_LIMIT) { // tam eşikte 1 kez bas
        char sip[32];
        ip_to_str(s->src_ip, sip, sizeof sip);
        printf("[ANOMALY][RULE2 PortScan] src=%s unique_dst_ports=%u in %ds (ACTION: BLACKLIST_SIM)\n",
               sip, s->port_count, PORTSCAN_WINDOW);

        // spam basmasın diye sıfırla (ödev için pratik)
        s->window_start = now;
        s->port_count = 0;
    }
}

static void rule3_ssh_bruteforce(SrcState *s, uint16_t dst_port, time_t now) {
    // sadece ssh portu
    if(ntohs(dst_port) != 22) return;

    if(now - s->ssh_window_start > SSH_WINDOW) {
        s->ssh_window_start = now;
        s->ssh_pkts = 0;
    }

    s->ssh_pkts++;

    if(s->ssh_pkts == SSH_LIMIT) { // eşikte 1 kez yaz
        char sip[32];
        ip_to_str(s->src_ip, sip, sizeof sip);
        printf("[ANOMALY][RULE3 SSHBrute] src=%s ssh_pkts=%u in %ds (dst_port=22) (ACTION: DROP_SIM)\n",
               sip, s->ssh_pkts, SSH_WINDOW);

        // tekrar yazmasın diye resetle
        s->ssh_window_start = now;
        s->ssh_pkts = 0;
    }
}

// ====== PACKET HANDLER ======

static void packet_handler(u_char *user,
                           const struct pcap_pkthdr *h,
                           const u_char *bytes)
{
    (void)user;
    time_t now = h->ts.tv_sec;

    // Ethernet
    const struct ether_header *eth = (const struct ether_header*)bytes;
    if(ntohs(eth->ether_type) != ETHERTYPE_IP) return;

    // IPv4
    const struct ip *iph = (const struct ip*)(bytes + sizeof(struct ether_header));
    int ip_len = iph->ip_hl * 4;
    if(ip_len < 20) return;

    FlowKey k;
    memset(&k, 0, sizeof(k));
    k.src_ip = iph->ip_src.s_addr;
    k.dst_ip = iph->ip_dst.s_addr;
    k.proto  = iph->ip_p;

    const u_char *l4 = (const u_char*)iph + ip_len;

    uint16_t src_port = 0, dst_port = 0;

    if(k.proto == IPPROTO_TCP) {
        const struct tcphdr *tcp = (const struct tcphdr*)l4;
        src_port = tcp->th_sport;
        dst_port = tcp->th_dport;
    } else if(k.proto == IPPROTO_UDP) {
        const struct udphdr *udp = (const struct udphdr*)l4;
        src_port = udp->uh_sport;
        dst_port = udp->uh_dport;
    } else {
        return; // sadece TCP/UDP
    }

    k.src_port = src_port;
    k.dst_port = dst_port;

    Flow *f = get_or_create_flow(&k, now);
    SrcState *s = get_or_create_src(k.src_ip, now);
    if(!f || !s) return;

    f->total_pkts++;
    f->last_seen = now;
    s->last_seen = now;

    // 3 kuralı çalıştır
    rule1_high_rate_flow(f, now);
    rule2_portscan(s, dst_port, now);
    rule3_ssh_bruteforce(s, dst_port, now);
}

int main(int argc, char **argv) {
    if(argc < 3) {
        fprintf(stderr, "Usage: %s <iface> <server_ip>\nExample: %s eth0 192.168.1.1\n", argv[0], argv[0]);
        return 1;
    }

    const char *iface = argv[1];
    const char *server_ip = argv[2];

    char errbuf[PCAP_ERRBUF_SIZE];
    pcap_t *handle = pcap_open_live(iface, 65535, 1, 1000, errbuf);
    if(!handle) {
        fprintf(stderr, "pcap_open_live failed: %s\n", errbuf);
        return 1;
    }

    // Sunucuya gelen TCP/UDP
    char filter_exp[256];
    snprintf(filter_exp, sizeof(filter_exp),
             "ip and (tcp or udp) and dst host %s", server_ip);

    struct bpf_program fp;
    if(pcap_compile(handle, &fp, filter_exp, 1, PCAP_NETMASK_UNKNOWN) == -1) {
        fprintf(stderr, "pcap_compile failed: %s\n", pcap_geterr(handle));
        return 1;
    }
    if(pcap_setfilter(handle, &fp) == -1) {
        fprintf(stderr, "pcap_setfilter failed: %s\n", pcap_geterr(handle));
        return 1;
    }
    pcap_freecode(&fp);

    printf("Listening on %s | filter: %s\n", iface, filter_exp);
    printf("Rules: R1 pps>%d, R2 %d ports/%ds, R3 SSH %d pkts/%ds\n",
           PPS_LIMIT, PORTSCAN_LIMIT, PORTSCAN_WINDOW, SSH_LIMIT, SSH_WINDOW);

    pcap_loop(handle, -1, packet_handler, NULL);
    pcap_close(handle);
    return 0;
}
