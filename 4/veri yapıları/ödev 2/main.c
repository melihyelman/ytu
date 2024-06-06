#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAXLENGTH 256

typedef struct StackNode {
    char *data;
    struct StackNode *next;
} StackNode;

typedef struct {
    StackNode *top;
} Stack;

typedef struct QueueNode {
    Stack *data;
    struct QueueNode *next;
} QueueNode;

typedef struct {
    QueueNode *front;
    QueueNode *rear;
} Queue;

void createStack(Stack *stack) {
    stack->top = NULL;
}

int isStackEmpty(Stack *stack) {
    return stack->top == NULL;
}

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

char *pop(Stack *stack) {
    if (isStackEmpty(stack)) {
        return NULL;
    }
    StackNode *node = stack->top;
    stack->top = stack->top->next;
    char *data = node->data;
    free(node);
    return data;
}

Stack *copyStack(Stack *stack) {
    if (stack == NULL)
        return NULL;

    Stack *newStack = (Stack *)malloc(sizeof(Stack));
    if (newStack == NULL) {
        printf("Memory allocation error.\n");
        return NULL;
    }
    createStack(newStack);

    StackNode *current = stack->top;
    StackNode *prev = NULL;
    StackNode *newTop = NULL;  // Yeni Stack'in tepesi için bir işaretçi oluştur

    while (current != NULL) {
        StackNode *newNode = (StackNode *)malloc(sizeof(StackNode));
        if (newNode == NULL) {
            printf("Memory allocation error.\n");
            // Oluşturulan düğümleri temizle
            while (newTop != NULL) {
                StackNode *temp = newTop->next;
                free(newTop);
                newTop = temp;
            }
            free(newStack);
            return NULL;
        }
        newNode->data = current->data;
        newNode->next = NULL;
        if (newTop == NULL) {
            newStack->top = newNode;  // Yeni Stack'in tepesini ayarla
        } else {
            prev->next = newNode;
        }
        prev = newNode;
        newTop = newNode;  // Yeni Stack'in tepesini güncelle
        current = current->next;
    }

    return newStack;
}

void createQueue(Queue *queue) {
    queue->front = NULL;
    queue->rear = NULL;
}

int isQueueEmpty(Queue *queue) {
    return queue->front == NULL;
}
void enqueue(Queue *queue, Stack *data) {
    QueueNode *node = (QueueNode *)malloc(sizeof(QueueNode));
    if (node == NULL) {
        printf("Memory allocation error.\n");
        return;
    }

    // Stack'i kopyala
    Stack *newStack = copyStack(data);
    if (newStack == NULL) {
        printf("Stack copy error.\n");
        free(node);
        return;
    }

    node->data = newStack;
    node->next = NULL;
    if (queue->rear == NULL) {
        queue->front = node;
        queue->rear = node;
    } else {
        queue->rear->next = node;
        queue->rear = node;
    }
}

Stack *dequeue(Queue *queue) {
    if (isQueueEmpty(queue)) {
        return NULL;
    }
    QueueNode *node = queue->front;
    Stack *data = node->data;
    queue->front = queue->front->next;
    if (queue->front == NULL)
        queue->rear = NULL;
    free(node);
    return data;
}
// find similar words from words array and return them
char **findSimilarWords(char **words, int *wordsLength, char *word, int *numWords) {
    char **similarWords = NULL;
    int count = 0, i, j;
    for (i = 0; i < *wordsLength; i++) {
        int diffCount = 0;
        for (j = 0; j < strlen(word); j++) {
            if (words[i][j] != word[j]) {  // words[i][j] kullanılmalı, word[j] kullanılmış
                diffCount++;
            }
        }

        if (diffCount == 1) {
            similarWords = realloc(similarWords, sizeof(char *) * (count + 1));
            if (similarWords == NULL) {
                printf("Memory allocation error.\n");
                return NULL;
            }
            // Kelimeyi similarWords'a kopyala
            similarWords[count] = strdup(words[i]);
            if (similarWords[count] == NULL) {
                printf("Memory allocation error.\n");
                return NULL;
            }
            // words dizisindeki ilgili indeksi sil
            free(words[i]);
            words[i] = words[*wordsLength - 1];  // Silinen kelimenin yerine son kelimiyi koy
            (*wordsLength)--;                    // Dizi boyutunu azalt
            count++;
            i--;  // Bu satırı eklememiz, bir sonraki döngü adımında aynı indekse tekrar bakmamızı sağlar.
        }
    }
    *numWords = count;
    return similarWords;
}

char **getWords(char *fileName, int *numWords, int length, char *source) {
    FILE *file = fopen(fileName, "r");
    if (file == NULL) {
        printf("File error.\n");
        return NULL;
    }
    char **words = NULL;
    int count = 0, found = 0;

    char buffer[MAXLENGTH];  // Kelimeleri tutmak için geçici bir tampon
    while (fscanf(file, "%s", buffer) != EOF) {
        if (strlen(buffer) == length && strcmp(buffer, source) != 0) {
            words = realloc(words, sizeof(char *) * (count + 1));
            if (words == NULL) {
                printf("Memory allocation error.\n");
                return NULL;
            }
            // strdup kullanarak bellek tahsisi yap
            words[count] = strdup(buffer);
            if (words[count] == NULL) {
                printf("Memory allocation error.\n");
                return NULL;
            }
            count++;
        } else if (strcmp(buffer, source) == 0) {
            found = 1;
        }
    }

    fclose(file);
    if (!found) {
        return NULL;
    }
    *numWords = count;
    return words;
}

// print stack
void printReversedStack(StackNode *top) {
    // Stack'i ters çevir
    StackNode *current = top;
    StackNode *prev = NULL;
    while (current != NULL) {
        StackNode *nextNode = current->next;
        current->next = prev;
        prev = current;
        current = nextNode;
    }
    top = prev;

    // Ters çevrilmiş stack'i yazdır
    while (top->next != NULL) {
        printf("%s -> ", top->data);
        top = top->next;
    }
    printf("%s\n", top->data);
}

void freeStack(Stack *stack) {
    while (!isStackEmpty(stack)) {
        char *data = pop(stack);
        free(data);
    }
}

int main() {
    // get 2 words from user
    char source[MAXLENGTH], destination[MAXLENGTH];

    printf("Source word: ");
    scanf("%s", source);
    printf("Destination word: ");
    scanf("%s", destination);
    if (strlen(source) != strlen(destination)) {
        printf("Words must be the same length.\n");
        return 1;
    }
    // Sözlükteki aynı uzunluktaki kelimeleri diziye atıyoruz
    int numWords = 0, similarWordsCount = 0, i, found = 0;
    char **words = getWords("dictionary.txt", &numWords, strlen(source), source), **similarWords = NULL;
    if (words == NULL) {
        printf("Source word could not be found in the dictionary.\n");
        return 1;
    }
    // tek harfi farklı olan kelimeleri buluyoruz.
    // algoritmayı çalıştırıyoruz.
    Queue queue;
    createQueue(&queue);
    Stack stack;
    createStack(&stack);
    push(&stack, source);
    enqueue(&queue, &stack);

    while (!isQueueEmpty(&queue) && !found) {
        Stack *node = dequeue(&queue);
        StackNode *temp = node->top;
        if (strcmp(temp->data, destination) == 0) {
            printReversedStack(temp);
            found = 1;  // Hedef kelime bulundu, döngü sonlandırılacak
        } else {
            similarWords = findSimilarWords(words, &numWords, temp->data, &similarWordsCount);
            if (similarWords != NULL) {
                for (i = 0; i < similarWordsCount; i++) {
                    Stack *stack = copyStack(node);
                    push(stack, similarWords[i]);
                    enqueue(&queue, stack);
                    printReversedStack(stack->top);
                }
            }
        }
    }
    if (isQueueEmpty(&queue) && !found) {
        printf("There is no such way.\n");
    }

    return 0;
}