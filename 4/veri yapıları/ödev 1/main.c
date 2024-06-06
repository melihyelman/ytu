#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct Node {
    char* url;
    int count;
    struct Node* next;
    struct Node* prev;
};

void addFront(struct Node** head, char* url);
void deleteLastNode(struct Node** head);
void printList(struct Node* node);
int length(struct Node* head);
struct Node* search(struct Node* head, char* url);

struct Node* search(struct Node* head, char* url) {
    while (head != NULL) {
        if (strcmp(head->url, url) == 0) {
            return head;
        }
        head = head->next;
    }
    return NULL;
}

int length(struct Node* head) {
    int count = 0;
    struct Node* current = head;
    while (current != NULL) {
        count++;
        current = current->next;
    }
    return count;
}

void deleteLastNode(struct Node** head) {
    if (*head == NULL)
        return;

    struct Node* temp = *head;

    if (temp->next == NULL) {
        free(temp);
        *head = NULL;
        return;
    }

    while (temp->next != NULL) {
        temp = temp->next;
    }

    temp->prev->next = NULL;
    free(temp);
}

void addFront(struct Node** head, char* url) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));

    newNode->url = strdup(url);
    newNode->count = 1;

    newNode->next = (*head);

    newNode->prev = NULL;

    if ((*head) != NULL)
        (*head)->prev = newNode;

    (*head) = newNode;
}

void replaceToHead(struct Node** head, struct Node* node) {
    if (node == *head) {
        return;
    }
    if (node->next != NULL) {
        node->next->prev = node->prev;
    }
    if (node->prev != NULL) {
        node->prev->next = node->next;
    }
    if (node == *head) {
        *head = node->next;
    }
    node->next = *head;
    node->prev = NULL;
    if ((*head) != NULL) {
        (*head)->prev = node;
    }
    *head = node;
}

void printList(struct Node* node) {
    printf("\nCache Buffer: \n");
    while (node->next != NULL) {
        printf("%s,%d <-> ", node->url, node->count);
        node = node->next;
    }
    printf("%s,%d\n", node->url, node->count);
}
// read filename line by line
// return the requests
char* getRequests(char* fileName) {
    FILE* file = fopen(fileName, "r");
    if (file == NULL) {
        printf("File not found\n");
        return NULL;
    }
    // request sayısını 1 den başlat dosyanın satır uzunluğuna göre dinamik  olarak ayarla
    int requestCount = 1;
    char* request = (char*)malloc(requestCount);
    char c;
    int i = 0;
    while ((c = fgetc(file)) != EOF) {
        if (c == '\n') {
            request[i] = '\0';
            break;
        }
        request[i] = c;
        i++;
        request = (char*)realloc(request, ++requestCount);
    }
    fclose(file);
    return request;
}

int main() {
    struct Node *head = NULL, *searchedNode = NULL;
    int t, l, option;
    printf("Enter the number of T: ");
    scanf("%d", &t);
    printf("Enter the number of L: ");
    scanf("%d", &l);
    printf("\nOptions: \n1. Add URL from console\n2. Add URL from file\n3. End\n");
    do {
        printf("Option: ");
        scanf("%d", &option);
        if (option == 1) {
            char* url = (char*)malloc(100);
            printf("\nEnter the url: ");
            scanf("%s", url);
            searchedNode = search(head, url);
            if (searchedNode != NULL) {
                if (searchedNode->count >= t) {
                    searchedNode->count++;
                    replaceToHead(&head, searchedNode);
                } else {
                    searchedNode->count++;
                }
            } else {
                addFront(&head, url);
            }
            if (length(head) > l) {
                deleteLastNode(&head);
            }
            printList(head);
        } else if (option == 2) {
            char* fileName = (char*)malloc(100);
            printf("\nEnter the file name: ");
            scanf("%s", fileName);
            char* request = getRequests(fileName);
            if (request != NULL) {
                searchedNode = search(head, request);
                if (searchedNode != NULL) {
                    if (searchedNode->count >= t) {
                        searchedNode->count++;
                        replaceToHead(&head, searchedNode);
                    } else {
                        searchedNode->count++;
                    }
                } else {
                    addFront(&head, request);
                }
                if (length(head) > l) {
                    deleteLastNode(&head);
                }
                printList(head);
            }
        }
    } while (option != 3);
    return 0;
}