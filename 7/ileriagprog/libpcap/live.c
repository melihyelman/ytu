#include <stdio.h>
#include <time.h>
#include <pcap.h>
#include <netinet/in.h>
#include <netinet/if_ether.h>
/*pcap lib kullanarak bir uygulama hazırla canlı trafiği izle icmp paketi ise ekrana yazdır.
pcaplib filter özelliğini kullanmayacak, filtre özelliğini kendin yap.
*/

void print_packet_info(const u_char *packet, struct pcap_pkthdr packet_header);

int main(int argc, char *argv[]) {
    char *device;
    char error_buffer[PCAP_ERRBUF_SIZE];
    pcap_t *handle;
    const u_char *packet;
    struct pcap_pkthdr packet_header;
    int packet_count_limit = 1;
    int timeout_limit = 10000; /* In milliseconds */

    // pcap_if_t *alldevs, *d;

    // if (pcap_findalldevs(&alldevs, error_buffer) == -1) {
    //     printf("Error finding devices: %s\n", error_buffer);
    //     return 1;
    // }

    // if (alldevs == NULL) {
    //     printf("No devices found.\n");
    //     return 1;
    // }

    // device = alldevs->name;


    pcap_if_t *first_if;
    char errbuf[PCAP_ERRBUF_SIZE];

    if (pcap_findalldevs(&first_if, errbuf) < 0) {
        fprintf(stderr, "pcap_findalldevs: %s\n", errbuf);
    }

    pcap_if_t *cur_if;
    for (cur_if = first_if ; cur_if ; cur_if = cur_if->next) {
        printf("name = %s, descriptoin=%s, flags=%x\n",
               cur_if->name, cur_if->description, cur_if->flags);
    }  

    /* Open device for live capture */
    handle = pcap_open_live(
            device,
            BUFSIZ,
            packet_count_limit,
            timeout_limit,
            error_buffer
        );

     /* Attempt to capture one packet. If there is no network traffic
      and the timeout is reached, it will return NULL */
     packet = pcap_next(handle, &packet_header);
     if (packet == NULL) {
        printf("No packet found.\n");
        return 2;
    }

    /* Our function to output some info */
    print_packet_info(packet, packet_header);

    return 0;
}

void print_packet_info(const u_char *packet, struct pcap_pkthdr packet_header) {
/*
    time_t nowtime;
    struct tm *nowtm;
    char tmbuf[64], buf[64];

    nowtime = packet_header.ts.tv_sec;
    nowtm = localtime(&nowtime);
    strftime(tmbuf, sizeof tmbuf, "%Y-%m-%d %H:%M:%S", nowtm);
    snprintf(buf, sizeof buf, "%s.%06ld", tmbuf, packet_header.ts.tv_usec);
*/

    printf("Packet capture length: %d\n", packet_header.caplen);
    printf("Packet total length %d\n", packet_header.len);
//    printf("time : %s\n", buf);
}
