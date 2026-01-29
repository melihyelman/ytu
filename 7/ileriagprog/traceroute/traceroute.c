#include <arpa/inet.h>
#include <netinet/in.h>
#include <netinet/ip.h>
#include <netinet/ip_icmp.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/time.h>
#include <sys/types.h>
#include <unistd.h>

#define PACKET_SIZE 64
#define BUFFER_SIZE 1024

//run:
// ❯ gcc -o output main.c
// ❯ sudo ./output 8.8.8.8
// Visit count: 1  Address:172.30.16.1
// Visit count: 2  Address:194.27.101.108
// Visit count: 3  Address:193.255.0.73
// Visit count: 4  Address:193.140.0.149
// Visit count: 5  Address:193.192.103.42
// Visit count: 6  * * *
// Visit count: 7  * * *
// Visit count: 8  Address:72.14.210.191
// Visit count: 9  Address:72.14.210.190
// Visit count: 10 Address:142.251.244.71
// Visit count: 11 Address:142.250.60.187
// Reached!        Visit count: 12 Address:8.8.8.8

unsigned short checksum(void* b, int len) {
    unsigned short* buf = b;
    unsigned int sum = 0;
    unsigned short result;

    for (sum = 0; len > 1; len -= 2)
        sum += *buf++;
    if (len == 1)
        sum += *(unsigned char*)buf;
    sum = (sum >> 16) + (sum & 0xFFFF);
    sum += (sum >> 16);
    result = ~sum;
    return result;
}

int main(int argc, char* argv[]) {
    if (argc != 2) {
        printf("Need destination\n");
        exit(0);
    }

    const char* target_ip = argv[1];
    struct sockaddr_in remote_addr, recv_addr;
    int socket_raw;
    char send_buf[PACKET_SIZE];
    char recv_buf[BUFFER_SIZE];
    socklen_t addr_len = sizeof(recv_addr);

    // socket oluştur
    socket_raw = socket(AF_INET, SOCK_RAW, IPPROTO_ICMP);
    if (socket_raw < 0) {
        printf("Socket creation failed");
        exit(0);
    }

    // hedef address
    memset(&remote_addr, 0, sizeof(remote_addr));
    remote_addr.sin_family = AF_INET;
    inet_pton(AF_INET, target_ip, &remote_addr.sin_addr);

    // recv zaman aşımı
    struct timeval time_out;
    time_out.tv_sec = 1;
    time_out.tv_usec = 0;
    setsockopt(socket_raw, SOL_SOCKET, SO_RCVTIMEO, (const char*)&time_out, sizeof(time_out));

    int visit_count = 1;

    while (1) {
        // IP_TTL alanını değiştirme
        setsockopt(socket_raw, IPPROTO_IP, IP_TTL, &visit_count, sizeof(visit_count));

        // icmp paket hazırla
        memset(send_buf, 0, sizeof(send_buf));
        struct icmp* icmp_packet = (struct icmp*)send_buf;
        icmp_packet->icmp_type = ICMP_ECHO;
        icmp_packet->icmp_code = 0;
        icmp_packet->icmp_seq = visit_count + 1;
        icmp_packet->icmp_id = getpid();
        icmp_packet->icmp_cksum = 0;
        icmp_packet->icmp_cksum = checksum(icmp_packet, sizeof(struct icmp));

        // gönder
        if (sendto(socket_raw, send_buf, sizeof(struct icmp), 0, (struct sockaddr*)&remote_addr, sizeof(remote_addr)) <= 0) {
            printf("gonderilemedi\n");
        }

        // oku
        int packet_len = recvfrom(socket_raw, recv_buf, sizeof(recv_buf), 0, (struct sockaddr*)&recv_addr, &addr_len);

        if (packet_len > 0) {
            struct ip* ip_hdr = (struct ip*)recv_buf;
            int ip_header_len = ip_hdr->ip_hl * 4;
            struct icmp* icmp_recv = (struct icmp*)(recv_buf + ip_header_len);

            char sender_ip[INET_ADDRSTRLEN];
            inet_ntop(AF_INET, &(recv_addr.sin_addr), sender_ip, INET_ADDRSTRLEN);

            if (icmp_recv->icmp_type == ICMP_ECHOREPLY) {
                printf("\nReached!\tVisit count: %d\tAddress:%s\n", visit_count, sender_ip);
                break;
            } else {
                printf("\nVisit count: %d\tAddress:%s\n", visit_count, sender_ip);
            }
        }else {
            printf("\nVisit count:: %d\t* * *\n", visit_count);
        }
        visit_count++;
        if (visit_count > 50) break; // sınırlama
    }
    close(socket_raw);
    return 0;
}