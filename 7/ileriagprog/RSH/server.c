#include <arpa/inet.h>
#include <netdb.h>
#include <netinet/in.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

#include "misc.h"

#define LINE_SIZE 255
#define SCREEN_SIZE 1024
#define PRM_LEN 32
#define PRM_NUM 100
#define BACK_LOG 5

int main(int argc, char* argv[]) {
    int i, n, child_pid;
    int opt, argCnt = 0, processCnt;
    int sockfd, newsockfd, portno, clilen;   // int variable that is used later
    struct sockaddr_in serv_addr, cli_addr;  // calling the library struct
    char buffer[LINE_SIZE];                  // buffer of size created
    char** args;
    char prog[32];
    char screen[SCREEN_SIZE];

    while ((opt = getopt(argc, argv, "n:p:")) != -1) {
        switch (opt) {
            case 'n':
                processCnt = atoi(optarg);
                argCnt++;
                break;
            case 'p':
                portno = atoi(optarg);
                argCnt++;
                break;
            default: /* '?' */
                fprintf(stderr, "Usage: %s [-a ip_address] [-p port_number] \n", argv[0]);
                exit(EXIT_FAILURE);
        }
    }

    if (argCnt != 2) {
        error("ERR>> missing arguments");
    }

    // 1st IP Address 2nd TCP Concept 3rd Socket
    sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (sockfd == -1) {
        error("ERR>> socket creation failed");
    }

    bzero((char*)&serv_addr, sizeof(serv_addr));
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_addr.s_addr = INADDR_ANY;

    // convert and use port number
    serv_addr.sin_port = htons(portno);

    if (bind(sockfd, (struct sockaddr*)&serv_addr, sizeof(serv_addr)) < 0) {
        error("ERR>> can not bind to socket");
    }

    listen(sockfd, BACK_LOG);
    clilen = sizeof(cli_addr);

    //
    // The new socket for the client informations
    //

    int current_client_size = 0;
    int status;
    while (1) {
        if (waitpid(-1, &status, WNOHANG) > 0 && current_client_size > 0) {
            current_client_size--;
        }
        if (current_client_size < processCnt) {
            newsockfd = accept(sockfd, (struct sockaddr*)&cli_addr, (socklen_t*)&clilen);
            if (newsockfd < 0) {
                error("ERR>> can not accept");
            }

            current_client_size++;
            if (fork() == 0) {
                while (1) {
                    bzero(buffer, LINE_SIZE);    // Clears the buffer
                    bzero(screen, SCREEN_SIZE);  // Clears the screen
                    n = recv(newsockfd, buffer, LINE_SIZE, 0);
                    if (n < 0) {
                        error("ERR>> can not read from socket");
                    }

                    // Buffer Stores the msg sent by the client
                    printf("Here is the entered bash command: %s\n", buffer);

                    args = malloc(PRM_NUM * sizeof(char*));
                    for (i = 0; i < PRM_NUM; i++)
                        args[i] = malloc(PRM_LEN * sizeof(char));

                    // Running the Bash Commands
                    if (readAndParseCmdLine(buffer, prog, args)) {
                        int pipe_my[2];
                        pipe(pipe_my);
                        child_pid = fork();

                        if (child_pid == 0) {  // child part
                            close(pipe_my[0]);
                            dup2(pipe_my[1], STDOUT_FILENO);  // STDOUT = 1
                            dup2(pipe_my[1], STDERR_FILENO);  // STDOERR = 2
                            execvp(prog, args);               // create and run the new process and close the child process
                            printf("Error in excuting the command- please make sure you type the right syntax.\n");
                            exit(1);
                        } else {  // parent part
                            close(pipe_my[1]);
                            wait(&child_pid);
                            int prog_size = read(pipe_my[0], screen, SCREEN_SIZE);
                            n = send(newsockfd, screen, prog_size, 0);
                            if (n < 0) {
                                error("ERROR writing to socket");
                            }
                        }
                    }
                }
            } else {
                // parent
            }
        }
    }
}
