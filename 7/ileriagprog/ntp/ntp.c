#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <time.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>

#define NTP_PORT            123     // Local port to listen for UDP packets
#define NTP_PACKET_SIZE     48      // NTP time stamp is in the first 48 bytes of the message

// Buffer to hold outgoing packets.
unsigned char ntpRequest [NTP_PACKET_SIZE];


// Function to prepare an NTP request
// You should fill this out 
void createNtpRequest ( void ) {

    // Set all bytes in the buffer to 0.
    memset (ntpRequest, 0, NTP_PACKET_SIZE);

    // Initialize values needed to form NTP request
    // LI = 0 (no warning), VN = 3 (NTP version 3), Mode = 3 (client)
	// 00 LI
	// 011 VN
	// 011 Mode
    ntpRequest[0] = 0x1b; // 00 011 011 in binary
    
    // The rest of the packet can remain zeros for a basic request

}

int main()  {

	int n, s, socSize;
	char  *hostname = "162.159.200.123";
	unsigned char ntpResponse[NTP_PACKET_SIZE];
	struct sockaddr_in server_addr;
	struct sockaddr_in source_addr;

	s=socket(AF_INET, SOCK_DGRAM, 0);
	if(s<0) {
		perror("ERR>> Can not create socket");
	}

	memset( &server_addr, 0, sizeof( server_addr ));
	server_addr.sin_family=AF_INET;
	server_addr.sin_addr.s_addr = inet_addr(hostname);
	server_addr.sin_port=htons(NTP_PORT);

	createNtpRequest();
	n = sendto(s, ntpRequest, sizeof(ntpRequest),0,(struct sockaddr *)&server_addr, sizeof(server_addr));

	printf("request sent, waiting for a reply...\n");

	// Receiving a reply
	socSize = sizeof(source_addr);
	n = recvfrom(s, ntpResponse, NTP_PACKET_SIZE, 0, (struct sockaddr *)&source_addr, (socklen_t *)&socSize);
	
	if (n < 0) {
		perror("ERR>> Failed to receive response");
		close(s);
		return 1;
	}
	
	printf("Response received (%d bytes)\n", n);
	
	// Now you have to process it 
	// Print out time 
	
	// The timestamp starts at byte 40 of the received packet
	// NTP timestamp is in seconds since 1900-01-01 00:00:00
	unsigned long highWord = (ntpResponse[40] << 24) | (ntpResponse[41] << 16) | 
	                         (ntpResponse[42] << 8) | ntpResponse[43];
	
	// Convert NTP time to Unix time (seconds since 1970-01-01 00:00:00)
	// There are 2208988800 seconds between 1900 and 1970
	const unsigned long seventyYears = 2208988800UL;
	unsigned long unixTime = highWord - seventyYears;
	
	// Convert to time structure and print
	time_t timeValue = (time_t)unixTime;
	printf("Unix timestamp: %lu\n", unixTime);
	printf("Time: %s", ctime(&timeValue));
	
	close(s);
	return 0;

}

