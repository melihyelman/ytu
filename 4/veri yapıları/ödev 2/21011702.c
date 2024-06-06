#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAXLENGTH 256  // Kelime uzunluğu sınırı

// Stack linked list yapısı
typedef struct StackNode {
    char *data;
    struct StackNode *next;
} StackNode;

// Stack yapısı
typedef struct {
    StackNode *top;
} Stack;

// Queue linked list yapısı
typedef struct QueueNode {
    Stack *data;
    struct QueueNode *next;
} QueueNode;

// Queue yapısı
typedef struct {
    QueueNode *front;
    QueueNode *rear;
} Queue;

void createStack(Stack *stack);
int isStackEmpty(Stack *stack);
void push(Stack *stack, char *data);
char *pop(Stack *stack);
Stack *copyStack(Stack *stack);
void createQueue(Queue *queue);
int isQueueEmpty(Queue *queue);
void enqueue(Queue *queue, Stack *data);
Stack *dequeue(Queue *queue);
char **findSimilarWords(char **words, int *wordsLength, char *word, int *numWords);
char **getWords(char *fileName, int *numWords, int length, char *source);
void printReversedStack(StackNode *top);

/*
@brief Yeni bir Stack olusturur

@param stack, olusturulacak Stack yapisi
*/
void createStack(Stack *stack) {
    stack->top = NULL;
}

/*
@brief Stack'in bos olup olmadıgını kontrol eder

@param stack, kontrol edilecek Stack yapısı
*/
int isStackEmpty(Stack *stack) {
    return stack->top == NULL;
}

/*
@brief Stack'e yeni bir eleman ekler

@param stack, elemanın eklenecegi Stack yapisi
@param data, eklenecek veri
*/
void push(Stack *stack, char *data) {
    StackNode *node = (StackNode *)malloc(sizeof(StackNode));
    if (node == NULL) {
        printf("Memory allocation error.\n");
        return;
    }
    node->data = strdup(data);
    node->next = stack->top;
    stack->top = node;
}

/*
@brief Stack'ten bir eleman cikarir

@param stack, elemanin cikarilacagi Stack yapisi

@return cikarilan elemanin verisi
*/
char *pop(Stack *stack) {
    if (isStackEmpty(stack)) {
        return NULL;
    }
    StackNode *node = stack->top;   // Stack'in tepesini al
    stack->top = stack->top->next;  // Stack'in tepesini bir sonraki elemana ayarla
    char *data = node->data;        // Veriyi al
    free(node);                     // Dügümü sil
    return data;
}

/*
@brief Verilen Stack'in kopyasını olusturur

@param stack, kopyalanacak Stack yapisi

@return olusturulan Stack'in isaretcisi
*/
Stack *copyStack(Stack *stack) {
    if (stack == NULL)
        return NULL;

    Stack *newStack = (Stack *)malloc(sizeof(Stack));
    if (newStack == NULL) {
        printf("Memory allocation error.\n");
        return NULL;
    }
    createStack(newStack);

    StackNode *current = stack->top;  // Verilen Stack'in tepesini al
    StackNode *prev = NULL;           // Önceki stack için
    StackNode *newTop = NULL;         // Yeni Stack için

    while (current != NULL) {
        StackNode *newNode = (StackNode *)malloc(sizeof(StackNode));  // Yeni bir dügüm olustur
        if (newNode == NULL) {
            printf("Memory allocation error.\n");
            while (newTop != NULL) {  // Hafizada yer kalmadiginda olusturulan dügümleri sil
                StackNode *temp = newTop->next;
                free(newTop);
                newTop = temp;
            }
            free(newStack);
            return NULL;
        }
        newNode->data = current->data;  // Veriyi kopyala
        newNode->next = NULL;
        if (newTop == NULL) {
            newStack->top = newNode;  // Yeni Stack'in tepesini ayarla
        } else {
            prev->next = newNode;
        }
        prev = newNode;           // Önceki dügümü güncelle
        newTop = newNode;         // Yeni Stack'in tepesini güncelle
        current = current->next;  // Verilen Stack'teki bir sonraki dügüme gec
    }

    return newStack;
}

/*
@brief Yeni bir Queue olusturur

@param queue, olusturulacak Queue yapisi
*/
void createQueue(Queue *queue) {
    queue->front = NULL;
    queue->rear = NULL;
}

/*
@brief Queue'nun bos olup olmadigini kontrol eder

@param queue, kontrol edilecek Queue yapisi

@return Queue bos ise 1, dolu ise 0 dondurur
*/
int isQueueEmpty(Queue *queue) {
    return queue->front == NULL;
}

/*
@brief Queue'ye yeni bir eleman ekler

@param queue, elemanin eklenecegi Queue yapisi
@param data, eklenecek veri
*/
void enqueue(Queue *queue, Stack *data) {
    QueueNode *node = (QueueNode *)malloc(sizeof(QueueNode));
    if (node == NULL) {
        printf("Memory allocation error.\n");
        return;
    }

    Stack *newStack = copyStack(data);  // Stack'i kopyala
    if (newStack == NULL) {
        printf("Stack copy error.\n");
        free(node);
        return;
    }

    node->data = newStack;  // Veriyi ekle
    node->next = NULL;
    if (queue->rear == NULL) {  // Queue bos ise
        queue->front = node;
        queue->rear = node;
    } else {  // Queue dolu ise
        queue->rear->next = node;
        queue->rear = node;
    }
}

/*
@brief Queue'den bir eleman cikarir

@param queue, elemanin cikarilacagi Queue yapisi

@return cikarilan elemanin verisi
*/
Stack *dequeue(Queue *queue) {
    if (isQueueEmpty(queue)) {
        return NULL;
    }
    QueueNode *node = queue->front;     // Queue'nun basini al
    Stack *data = node->data;           // Veriyi al
    queue->front = queue->front->next;  // Queue'nun basini bir sonraki elemana ayarla
    if (queue->front == NULL)           // Queue bos ise
        queue->rear = NULL;
    free(node);
    return data;
}

/*
@brief Verilen kelimeler arasinda tek harf farki olan kelimeleri bulur

@param words, kelimelerin bulundugu dizi
@param wordsLength, dizi boyutu
@param word, karsilastirilacak kelime
@param numWords, bulunan kelimelerin sayisi

@return benzer kelimelerin bulundugu dizi
*/
char **findSimilarWords(char **words, int *wordsLength, char *word, int *numWords) {
    char **similarWords = NULL;
    int count = 0, i, j;
    for (i = 0; i < *wordsLength; i++) {
        int diffCount = 0;
        for (j = 0; j < strlen(word); j++) {
            if (words[i][j] != word[j]) {  // Karakterler farkliysa
                diffCount++;
            }
        }

        if (diffCount == 1) {                                                    // Tek karakter farki varsa
            similarWords = realloc(similarWords, sizeof(char *) * (count + 1));  // Bellek tahsisi yap
            if (similarWords == NULL) {
                printf("Memory allocation error.\n");
                return NULL;
            }
            similarWords[count] = strdup(words[i]);  // Kelimeyi similarWords'a kopyala
            if (similarWords[count] == NULL) {
                printf("Memory allocation error.\n");
                return NULL;
            }

            free(words[i]);                      // words dizisindeki ilgili indeksi sil
            words[i] = words[*wordsLength - 1];  // Silinen kelimenin yerine son kelimiyi koy
            (*wordsLength)--;                    // Dizi boyutunu azalt
            count++;
            i--;  // Döngüde bir geri git cunku uzunluk degisti
        }
    }
    *numWords = count;
    return similarWords;
}

/*
@brief Verilen dosyadan belirli uzunluktaki kelimeleri okur

@param fileName, okunacak dosyanın adı
@param numWords, okunan kelime sayısı
@param length, okunacak kelimenin uzunlugu
@param source, okunacak kelime

@return okunan kelimelerin dizisi
*/
char **getWords(char *fileName, int *numWords, int length, char *source) {
    FILE *file = fopen(fileName, "r");
    if (file == NULL) {
        printf("File error.\n");
        return NULL;
    }
    char **words = NULL;
    int count = 0, found = 0;

    char buffer[MAXLENGTH];                                             // Kelimeleri tutmak için geçici bir tampon
    while (fscanf(file, "%s", buffer) != EOF) {                         // Dosyadan kelimeleri oku
        if (strlen(buffer) == length && strcmp(buffer, source) != 0) {  // Uzunlugu kontrol et ve kaynak kelimeyi kontrol et
            words = realloc(words, sizeof(char *) * (count + 1));       // Bellek tahsisi yap
            if (words == NULL) {
                printf("Memory allocation error.\n");
                return NULL;
            }
            words[count] = strdup(buffer);  // Kelimeyi diziye kopyala
            if (words[count] == NULL) {
                printf("Memory allocation error.\n");
                return NULL;
            }
            count++;
        } else if (strcmp(buffer, source) == 0) {  // Kaynak kelime bulunduysa
            found = 1;
        }
    }

    fclose(file);
    if (!found) {  // Kaynak kelime bulunamazsa
        return NULL;
    }
    *numWords = count;
    return words;
}

/*
@brief Verilen Stack'i ters cevirir ve yazdirir

@param top, Stack'in tepesi
*/
void printReversedStack(StackNode *top) {
    StackNode *current = top;
    StackNode *prev = NULL;
    while (current != NULL) {
        StackNode *nextNode = current->next;
        current->next = prev;
        prev = current;
        current = nextNode;
    }
    top = prev;

    while (top->next != NULL) {
        printf("%s -> ", top->data);
        top = top->next;
    }
    printf("%s\n", top->data);
}

int main() {
    char source[MAXLENGTH], destination[MAXLENGTH];

    printf("Source word: ");
    scanf("%s", source);
    printf("Destination word: ");
    scanf("%s", destination);
    if (strlen(source) != strlen(destination)) {  // Kelimelerin aynı uzunlukta olup olmadigini kontrol et
        printf("Words must be the same length.\n");
        return 1;
    }
    int numWords = 0, similarWordsCount = 0, i = 0, found = 0;
    char **words = getWords("dictionary.txt", &numWords, strlen(source), source), **similarWords = NULL;
    if (words == NULL) {  // Dosya okunamazsa veya verilen kelime sözlükte bulunamazsa programı sonlandır
        printf("Source word could not be found in the dictionary.\n");
        return 1;
    }

    Queue queue;
    createQueue(&queue);
    Stack stack;
    createStack(&stack);
    push(&stack, source);
    enqueue(&queue, &stack);

    while (!isQueueEmpty(&queue) && !found) {        // Kuyruk bos olana veya hedef kelime bulunana kadar devam et
        Stack *node = dequeue(&queue);               // Kuyruktan bir eleman cikar
        StackNode *temp = node->top;                 // Elemanin tepesini al
        if (strcmp(temp->data, destination) == 0) {  // Hedef kelimeye ulasildiysa
            printf("\nPath: \n");
            printReversedStack(temp);                // Stack'i yazdir
            found = 1;                               // Hedef kelime bulundu, döngü sonlandırılacak
        } else {
            similarWords = findSimilarWords(words, &numWords, temp->data, &similarWordsCount);  // Benzer kelimeleri bul
            if (similarWords != NULL) {                                                         // Benzer kelimeler bulunduysa
                for (i = 0; i < similarWordsCount; i++) {
                    Stack *stack = copyStack(node);  // Stack'i kopyala
                    push(stack, similarWords[i]);    // Benzer kelimeyi Stack'e ekle
                    enqueue(&queue, stack);          // Stack'i kuyruga ekle
                    printReversedStack(stack->top);  // Stack'i yazdir
                }
            }
        }
    }
    if (isQueueEmpty(&queue) && !found) {  // Hedef kelimeye ulasilamadiysa ekrana uyari yazdir
        printf("There is no such way.\n");
    }

    return 0;
}