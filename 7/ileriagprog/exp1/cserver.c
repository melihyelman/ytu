/* BLM4900 - Concurrent Echo Server Example 
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
#define QUEUE_SIZE	3

int main(int argc, char *argv[])  {

	int server_sd, client_sd, client_len, noReadBytes;
	struct sockaddr_in server, client;
	char buffer[BUFFER_SIZE];

	// Create socket 
	server_sd = socket(PF_INET, SOCK_STREAM, 0);
	if(server_sd == -1)  {
		printf("ERR> Could not create server socket, exiting...\n");
		return -1;
	}
	printf("INFO> server socket created successfully...\n");

	server.sin_family = AF_INET;
	server.sin_addr.s_addr = INADDR_ANY;
	server.sin_port = htons(SERVER_PORT);

	if( bind(server_sd, (struct sockaddr *)&server, sizeof(server)) < 0)  {
		printf("ERR> Could not bind to socket...\n");
		return -2;
	}
	printf("INFO> bind successful...\n");

	listen(server_sd, QUEUE_SIZE);
	printf("INFO> waiting for client connections...\n");
	
	
while (( client_sd = accept(server_sd, (struct sockaddr *)&client, (socklen_t *) &client_len))) {

	printf("INFO> connection accepted...\n");

	while( (noReadBytes = recv(client_sd, buffer, BUFFER_SIZE, 0)) > 0 ) {
		printf("DBG> received message from client (%d) : %s\n", noReadBytes, buffer);
		write(client_sd, buffer, noReadBytes);
	}
	
	if(noReadBytes == 0) {
		printf("INFO> client disconnected...\n");
	}else if (noReadBytes == -1 ) {
		printf("ERR> recv failed...\n");
		return -4;
	}
}

	return 0;
}

