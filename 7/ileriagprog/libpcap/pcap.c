#include <stdio.h>
#include <time.h>
#include <pcap.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <netinet/ip.h>
#include <netinet/ip_icmp.h>
#include <netinet/if_ether.h>
#include <stdlib.h> 
/*
    Macte pcap_lookupdev deprecated olmuş. Onun yerine findalldevs kullanıldı. parametre olarak device eklendi.
*/
// gcc -o pcap pcap.c -lpcap
// ./pcap = list devices
// ./pcap en0
void handle_packet(u_char *user, const struct pcap_pkthdr *h, const u_char *bytes);
void list_devices(char *error_buffer);

int main(int argc, char *argv[]) {
    char *device;
    char error_buffer[PCAP_ERRBUF_SIZE];
    pcap_t *handle;
    int timeout_limit = 10000; 

    if (argc != 2) {
        list_devices(error_buffer);
        return 1;
    }

    device = argv[1];

    printf("Dev: %s\n", device);

    handle = pcap_open_live(
            device,
            BUFSIZ,
            1,
            timeout_limit,
            error_buffer
        );
        
    if (!handle) {
        fprintf(stderr, "pcap_open_live fail (%s): %s\n", device, error_buffer);
        return 1;
    }

    printf("ICMP packets\n");

    pcap_loop(handle, -1, handle_packet, NULL);

    pcap_close(handle);
    return 0;
}

void list_devices(char *error_buffer) {
    pcap_if_t *alldevs, *d;
    int i = 0;
    
    printf("All devs:\n");

    if (pcap_findalldevs(&alldevs, error_buffer) == -1) {
        fprintf(stderr, "error find devs %s\n", error_buffer);
        return;
    }

    for (d = alldevs; d; d = d->next) {
        printf("%d. name:%s\tdescription:%s\n", ++i, d->name,d->description);
    }

    if (i == 0) {
        printf("no dev.\n");
    }
    printf("Run: gcc -o pcap pcap.c -lpcap && ./pcap en0\n");
}


void handle_packet(u_char *args, const struct pcap_pkthdr *header, const u_char *packet) {
    if (header->caplen < sizeof(struct ether_header)) return;

    const struct ip *ip_hdr = (const struct ip *)(packet + sizeof(struct ether_header));
    if (ip_hdr->ip_p != IPPROTO_ICMP) return;
    
    size_t ip_hlen = ip_hdr->ip_hl * 4;    
    const struct icmp *icmp_hdr = (const struct icmp *)(packet + sizeof(struct ether_header) + ip_hlen);

    time_t now = header->ts.tv_sec;
    struct tm *tm = localtime(&now);
    char tbuf[32];
    strftime(tbuf, sizeof tbuf, "%Y-%m-%d %H:%M:%S", tm);

    char src_ip[INET_ADDRSTRLEN];
    char dst_ip[INET_ADDRSTRLEN];

    inet_ntop(AF_INET, &(ip_hdr->ip_src), src_ip, sizeof(src_ip));
    inet_ntop(AF_INET, &(ip_hdr->ip_dst), dst_ip, sizeof(dst_ip));

    printf("DATE: %s.%06ld\tSRC: %s\tDEST: %s\tICMP_TYPE: %d\n",
           tbuf, header->ts.tv_usec,
           src_ip,
           dst_ip,
           icmp_hdr->icmp_type);
}