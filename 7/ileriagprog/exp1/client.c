/* BLM4900 - Echo Client Example 
 *
 * Written by Z.C.T.
 * 06.04.2021
 */

#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <arpa/inet.h>

#define BUFFER_SIZE	1000
#define SERVER_PORT	8888

int main(int argc, char *argv[])  {

	int  client_sd, noReadBytes;
	struct sockaddr_in server;
	char in_buffer[BUFFER_SIZE];
	char out_buffer[BUFFER_SIZE];


	// Create socket 
	client_sd = socket(PF_INET, SOCK_STREAM, 0);
	if(client_sd == -1)  {
		printf("ERR> Could not create client socket, exiting...\n");
		return -1;
	}
	printf("INFO> socket created successfully...\n");

	server.sin_family = AF_INET;
	server.sin_addr.s_addr = inet_addr("127.0.0.1");
	server.sin_port = htons(SERVER_PORT);

	if( (connect(client_sd, (struct sockaddr *)&server, sizeof(server))) < 0 ) {
		printf("ERR> connection failed...\n");
		return -1;
	}
	
	while(1)  {

		printf("Enter your message : \n ");
		scanf("%s", out_buffer);
		
		// Send user's message to server
		if( send(client_sd, out_buffer, strlen(out_buffer)+1, 0) < 0)  {
			printf("ERR> send failed...\n");
			return -2;
		}
		
		// Recieve back a reply from server
		if( (noReadBytes = recv(client_sd, in_buffer, BUFFER_SIZE, 0)) < 0 )  {
			printf("ERR> recv failed...\n");
			return -3;

		}
		printf("Server replied (%d) : %s\n", noReadBytes, in_buffer);
	}

	close(client_sd);
	return 0;
}

