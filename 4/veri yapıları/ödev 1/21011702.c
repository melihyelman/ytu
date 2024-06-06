#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAXLINELENGTH 1024  // Dosya satir okuma sınırı

// double linked list yapisi
struct Node {
    char* url;
    int count;
    struct Node* next;
    struct Node* prev;
};

void addFrontNode(struct Node** head, char* url);
void deleteLastNode(struct Node** head);
void printList(struct Node* node);
int length(struct Node* head);
struct Node* search(struct Node* head, char* url);
void replaceToHead(struct Node** head, struct Node* node);
char** getRequests(char* fileName, int* requestCount);
void freeRequests(char** requests, int requestCount);
void freeList(struct Node* head);
void handleLogic(struct Node** head, char* url, int t, int l, struct Node* searchedNode);

/*
@brief verilen urli linked listede arar

@param head, linked listin basi
@param url, aranacak url

@return eger bulunursa bulunan nodu, bulunmazsa NULL
*/
struct Node* search(struct Node* head, char* url) {
    while (head != NULL) {
        if (strcmp(head->url, url) == 0) {  // eger urli bulursa nodu döner
            return head;
        }
        head = head->next;
    }
    return NULL;
}

/*
@brief verilen linked listin uzunlugunu döner

@param head, linked listin basi

@return linked listin uzunlugu
*/
int length(struct Node* head) {
    int count = 0;
    struct Node* current = head;
    while (current != NULL) {
        count++;
        current = current->next;
    }
    return count;
}

/*
@brief verilen linked listin son nodunu siler

@param head, linked listin basi
*/
void deleteLastNode(struct Node** head) {
    if (*head == NULL)
        return;

    struct Node* temp = *head;

    // eğer linked listte sadece bir eleman varsa
    if (temp->next == NULL) {
        free(temp);
        *head = NULL;
        return;
    }

    while (temp->next != NULL) {
        temp = temp->next;
    }
    // temp su an linked listin son elemani
    temp->prev->next = NULL;
    free(temp);
}
/*
@brief verilen urli linked listin basina ekler

@param head, linked listin basi
@param url, eklenecek url
*/
void addFrontNode(struct Node** head, char* url) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));  // yeni node olustur

    // yeni nodeu olustururken urlin kopyasini al ve count 1 yap
    newNode->url = strdup(url);
    newNode->count = 1;

    // yeni nodeun nexti su anki headi gösterir
    newNode->next = (*head);
    // yeni nodeun previ NULLdır
    newNode->prev = NULL;

    if ((*head) != NULL)  // eger linked list bos değilse su anki headin previ yeni nodeu gösterir
        (*head)->prev = newNode;

    (*head) = newNode;  // yeni nodeu head yap
}

/*
@brief verilen nodu linked listin basina tasir, tasinan nodedan onceki ve sonraki nodeları gunceller

@param head, linked listin basi
@param node, tasinacak node
*/
void replaceToHead(struct Node** head, struct Node* node) {
    if (node == *head) {
        return;
    }
    // nodeun nexti NULL degilse nodeun nextinin previ nodeun previni gösterir
    if (node->next != NULL) {
        node->next->prev = node->prev;
    }
    // nodeun previ NULL degilse nodeun previnin nexti nodeun nexti gösterir
    if (node->prev != NULL) {
        node->prev->next = node->next;
    }
    if (node == *head) {
        *head = node->next;
    }
    node->next = *head;  // nodeun nexti su anki headi gosterir
    node->prev = NULL;
    if ((*head) != NULL) {
        (*head)->prev = node;
    }
    *head = node;  // nodeu head yap
}

/*
@brief verilen linked listi ekrana basar

@param head linked listin basi
*/
void printList(struct Node* node) {
    printf("\nCache Buffer: \n");
    while (node->next != NULL) {
        printf("%s,%d <-> ", node->url, node->count);
        node = node->next;
    }
    printf("%s,%d\n", node->url, node->count);
}

/*
@brief verilen dosyadan satir satir requestleri okur

@param fileName, requestlerin okunacagi dosya adi
@param requestCount, okunan request sayisi

@return okunan requestlerin dizisi
*/
char** getRequests(char* fileName, int* requestCount) {
    FILE* file = fopen(fileName, "r");
    if (file == NULL) {
        printf("File not found\n");
        return NULL;
    }

    char** requests = NULL;
    int capacity = 1;
    *requestCount = 0;                                    // okunan request sayisi sifirlanir
    requests = (char**)malloc(capacity * sizeof(char*));  // requestlerin tutulacagi dizi
    if (requests == NULL) {
        printf("Memory allocation error\n");
    }

    char request[MAXLINELENGTH];  // okunan request
    while (fgets(request, MAXLINELENGTH, file) != NULL) {
        if (request[strlen(request) - 1] == '\n')  // satir sonundaki newline karakteri silinir
            request[strlen(request) - 1] = '\0';

        requests[*requestCount] = (char*)malloc((strlen(request) + 1) * sizeof(char));  // requeste yer acilir
        if (requests[*requestCount] == NULL) {
            printf("Memory allocation error\n");
        }

        strcpy(requests[*requestCount], request);  // request kopyalanir
        (*requestCount)++;

        if (*requestCount >= capacity) {  // eger requestlerin sayisi kapasiteye esitse kapasite iki katına cikarilir
            capacity *= 2;
            requests = (char**)realloc(requests, capacity * sizeof(char*));  // requestlerin tutulacagi dizinin kapasitesi arttirilir
            if (requests == NULL) {
                printf("Memory allocation error\n");
            }
        }
    }

    fclose(file);
    return requests;
}

/*
@brief verilen requestlerin dizisini serbest birakir

@param requests, serbest birakilacak requestlerin dizisi
@param requestCount, dizinin uzunlugu
*/
void freeRequests(char** requests, int requestCount) {
    int i;
    for (i = 0; i < requestCount; i++) {
        free(requests[i]);
    }
    free(requests);
}

/*
@brief verilen linked listi serbest birakir

@param head, serbest birakilacak linked listin basi
*/
void freeList(struct Node* head) {
    struct Node* temp;
    while (head != NULL) {
        temp = head;
        head = head->next;
        free(temp->url);
        free(temp);
    }
}

/*
@brief verilen urlin linked listteki durumuna göre islem yapar

@param head, linked listin başı
@param url, islem yapilacak url
@param t, urlin t sayisina ulasinca basa alinacak
@param l, linked listin maksimum uzunlugu
@param searchedNode, urlin linked listte olup olmadigini kontrol etmek icin kullanilir
*/
void handleLogic(struct Node** head, char* url, int t, int l, struct Node* searchedNode) {
    searchedNode = search(*head, url);  // urlin linked listte olup olmadigini kontrol et
    if (searchedNode != NULL) {         // eger url linked listte varsa
        if (searchedNode->count >= t) {
            searchedNode->count++;              // eger urlin countu tye esitse countu arttir
            replaceToHead(head, searchedNode);  // urli linked listin basina tasi
        } else {
            searchedNode->count++;  // eger urlin countu tye esit degilse countu arttir
        }
    } else {  // eger url linked listte yoksa listenin basina ekle
        addFrontNode(head, url);
    }
    if (length(*head) > l) {  // eger linked listin uzunluğu lden büyükse linked listin son elemanini sil
        deleteLastNode(head);
    }
    printList(*head);
}

int main() {
    struct Node *head = NULL, *searchedNode = NULL;  // linked listin basi ve aranacak node degiskenleri
    int t, l, option;                                // t, l ve option degerleri
    printf("Enter the number of T: ");
    scanf("%d", &t);
    printf("Enter the number of L: ");
    scanf("%d", &l);
    printf("\nOptions: \n1. Add URL from console\n2. Add URL from file\n3. Clear buffer\n4. Quit\n");
    do {
        printf("Option: ");
        scanf("%d", &option);
        if (option == 1) {  // eger option 1se url al
            char* url = (char*)malloc(100);
            printf("\nEnter the url: ");
            scanf("%s", url);
            handleLogic(&head, url, t, l, searchedNode);
        } else if (option == 2) {  // eger option 2se dosyadan url al
            char* fileName = (char*)malloc(100);
            printf("\nEnter the file name: ");
            scanf("%s", fileName);
            int requestCount, i = 0;
            char** requests = getRequests(fileName, &requestCount);
            if (requests != NULL) {  // eger requestler bos degilse her bir request icin handleLogic fonksiyonunu cagır
                for (i = 0; i < requestCount; i++) {
                    handleLogic(&head, requests[i], t, l, searchedNode);
                }
                freeRequests(requests, requestCount);
            }
        } else if (option == 3) {  // eger option 3se linked listi temizle
            freeList(head);
            head = NULL;
            printf("Buffer cleared\n");
            printf("Enter the number of T: ");
            scanf("%d", &t);
            printf("Enter the number of L: ");
            scanf("%d", &l);
        }
    } while (option != 4);  // eger option 4se programı sonlandır
    freeList(head);
    return 0;
}