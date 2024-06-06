#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Node yapısı
typedef struct Node {
    char vertex;
    int weight;
    struct Node* next;
} Node;

// Adjacency list yapısı
typedef struct {
    char vertex;
    Node* head;
} AdjList;

// Graf yapısı
typedef struct {
    int numVertices;
    AdjList* adjLists;
    char* vertices;  // Haritalama için eklenen dizi
} Graph;

// Şekilleri saklamak için liste yapısı
typedef struct CycleList {
    char* cycle;
    int weight;
    int* visitedCount;  // Düğümlerin ziyaret sayısını saklamak için dizi
    struct CycleList* next;
} CycleList;

/*
@brief Yeni bir düğüm oluşturma fonksiyonu
@param v: Düğümün adı, weight: Düğümün ağırlığı

@return: Oluşturulan düğümün pointer'ı
*/
Node* createNode(char v, int weight) {
    Node* newNode = malloc(sizeof(Node));  // Bellekten yer ayır
    newNode->vertex = v;                   // Düğüm adını ata
    newNode->weight = weight;              // Düğüm ağırlığını ata
    newNode->next = NULL;                  // Sonraki düğümü NULL yap
    return newNode;
}

/*
@brief Yeni bir graf oluşturma fonksiyonu
@param vertices: Grafın düğüm sayısı

@ return: Oluşturulan grafın pointer'ı
*/
Graph* createGraph(int vertices) {
    int i;
    Graph* graph = malloc(sizeof(Graph));                  // Graf için bellekten yer ayır
    graph->numVertices = vertices;                         // Düğüm sayısını ata
    graph->adjLists = malloc(vertices * sizeof(AdjList));  // Düğümler için bellekten yer ayır
    graph->vertices = malloc(vertices * sizeof(char));     // Haritalama için bellekten yer ayır

    for (i = 0; i < vertices; i++) {  // Düğümleri başlangıçta NULL yap
        graph->adjLists[i].head = NULL;
    }

    return graph;
}

/*
@brief Grafın düğümünün indeksini döndüren fonksiyon
@param graph: Grafın pointer'ı, vertex: Düğümün adı

@return: Düğümün indeksi
*/
int getIndex(Graph* graph, char vertex) {
    int i;
    for (i = 0; i < graph->numVertices; i++) {  // Düğümü ara
        if (graph->vertices[i] == vertex) {     // Düğüm bulunduysa indeksi döndür
            return i;
        }
    }
    return -1;  // Bulunamazsa
}

/*
@brief Graf yapısına kenar ekleyen fonksiyon
@param graph: Grafın pointer'ı, src: Kaynak düğüm, dest: Hedef düğüm, weight: Kenar ağırlığı

*/
void addEdge(Graph* graph, char src, char dest, int weight) {
    int srcIndex = getIndex(graph, src);    // Kaynak düğümünün indeksini al
    int destIndex = getIndex(graph, dest);  // Hedef düğümünün indeksini al

    if (srcIndex == -1 || destIndex == -1) {  // Düğümler bulunamazsa
        printf("Geçersiz düğüm isimleri.\n");
        return;
    }

    // Kaynak düğümünden hedef düğümüne kenar ekle
    Node* newNode = createNode(dest, weight);
    newNode->next = graph->adjLists[srcIndex].head;
    graph->adjLists[srcIndex].head = newNode;

    // Hedef düğümünden kaynak düğümüne kenar ekle (yönsüz graf)
    newNode = createNode(src, weight);
    newNode->next = graph->adjLists[destIndex].head;
    graph->adjLists[destIndex].head = newNode;
}

/*
@brief Dosyadan graf okuyan fonksiyon
@param graph: Grafın pointer'ı, filename: Dosya adı
*/
void readGraphFromFile(Graph* graph, char* filename) {
    FILE* file = fopen(filename, "r");
    if (file == NULL) {
        printf("Dosya acilamadi.\n");
        return;
    }

    // Düğümleri haritalama
    char vertices[graph->numVertices];

    int vertexCount = 0;

    char src, dest;
    int weight;
    while (fscanf(file, " %c %c %d", &src, &dest, &weight) != EOF) {
        if (strchr(vertices, src) == NULL) {  // Düğüm haritada yoksa ekle
            vertices[vertexCount++] = src;
        }
        if (strchr(vertices, dest) == NULL) {  // Düğüm haritada yoksa ekle
            vertices[vertexCount++] = dest;
        }
    }

    fseek(file, 0, SEEK_SET);  // Dosyayı başa sar

    // Haritaları graf yapısına kopyalama
    memcpy(graph->vertices, vertices, vertexCount * sizeof(char));

    while (fscanf(file, " %c %c %d", &src, &dest, &weight) != EOF) {
        addEdge(graph, src, dest, weight);
    }

    fclose(file);
}

/*
@brief İki döngünün aynı olup olmadığını kontrol eden fonksiyon
@param visited1: İlk döngünün ziyaret edilen düğümleri, visited2: İkinci döngünün ziyaret edilen düğümleri, size: Düğüm sayısı

@return: Döngüler aynıysa 1, değilse 0
*/
int sameCycle(int* visited1, int* visited2, int size) {
    int i;
    for (i = 0; i < size; i++) {           // Düğümleri karşılaştır
        if (visited1[i] != visited2[i]) {  // Eğer farklıysa
            return 0;
        }
    }
    return 1;
}

/*
@brief Döngü listesine yeni bir döngü ekleyen fonksiyon
@param head: Döngü listesinin başlangıç pointer'ı, cycle: Döngü, weight: Döngünün ağırlığı,
visitedCount: Döngüdeki düğümlerin ziyaret sayısı, size: Düğüm sayısı
*/
void addCycle(CycleList** head, char* cycle, int weight, int* visitedCount, int size) {
    // Aynı döngüleri kontrol et ve sadece alfabetik olanı sakla
    CycleList* temp = *head;
    CycleList* prev = NULL;
    CycleList* toDelete = NULL;
    CycleList* toDeletePrev = NULL;

    while (temp != NULL) {
        if (sameCycle(temp->visitedCount, visitedCount, size)) {
            if (strcmp(temp->cycle, cycle) > 0) {  // Aynı döngü bulunduğunda alfabetik karşılaştırma yap
                // Yeni döngü daha küçükse eskiyi işaretle ve yeniyi eklemeye devam et
                toDelete = temp;
                toDeletePrev = prev;
            } else {
                // Eski döngü daha küçükse yeni döngüyü eklemeyin
                return;
            }
        }
        prev = temp;
        temp = temp->next;
    }

    if (toDelete != NULL) {
        // İşaretlenen döngüyü sil
        if (toDeletePrev != NULL) {
            toDeletePrev->next = toDelete->next;
        } else {
            *head = toDelete->next;
        }
        free(toDelete->cycle);
        free(toDelete->visitedCount);
        free(toDelete);
    }

    // Yeni döngüyü ekle
    CycleList* newCycle = malloc(sizeof(CycleList));
    newCycle->cycle = strdup(cycle);  // Döngüyü kopyala
    newCycle->weight = weight;
    newCycle->visitedCount = malloc(size * sizeof(int));
    memcpy(newCycle->visitedCount, visitedCount, size * sizeof(int));  // Ziyaret sayılarını kopyala
    newCycle->next = *head;
    *head = newCycle;
}

/*
@brief Graf yapısındaki iki düğüm arasındaki kenarın ağırlığını döndüren fonksiyon
@param graph: Grafın pointer'ı, src: Kaynak düğüm, dest: Hedef düğüm

@return: Kenar ağırlığı, yoksa -1
*/
int getEdgeWeight(Graph* graph, char src, char dest) {
    int srcIndex = getIndex(graph, src);    // Kaynak düğümünün indeksini al
    int destIndex = getIndex(graph, dest);  // Hedef düğümünün indeksini al

    Node* temp = graph->adjLists[srcIndex].head;  // Kaynak düğümün kenarlarını dolaş
    while (temp) {
        if (temp->vertex == dest) {  // Hedef düğümü bulduysa ağırlığı döndür
            return temp->weight;
        }
        temp = temp->next;
    }
    return -1;  // Kenar bulunamadığında
}

/*
@brief Döngüleri bulan recursive fonksiyon
@param graph: Grafın pointer'ı, start: Döngü başlangıç düğümü, current: Şu anki düğüm, path: Döngü yolu,
pathIndex: Döngü yolu indeksi, visited: Ziyaret edilen düğümler, cycleList: Döngü listesi, visitedCount: Düğümlerin ziyaret sayısı
*/
void findCycles(Graph* graph, char start, char current, char* path, int* pathIndex, int* visited, CycleList** cycleList, int* visitedCount) {
    int currentIndex = getIndex(graph, current);  // Şu anki düğümün indeksini al
    int i;
    visited[currentIndex] = 1;     // Düğümü ziyaret et
    visitedCount[currentIndex]++;  // Düğümün ziyaret sayısını artır
    path[*pathIndex] = current;    // Döngü yolu dizisine düğümü ekle
    (*pathIndex)++;                // Döngü yolu indeksini artır
    path[*pathIndex] = '\0';

    Node* temp = graph->adjLists[currentIndex].head;  // Şu anki düğümün kenarlarını dolaş

    while (temp) {                                                  // Kenarlar bitene kadar
        int tempIndex = getIndex(graph, temp->vertex);              // Kenarın hedef düğümünün indeksini al
        if (temp->vertex == start && *pathIndex > 2) {              // Potansiyel bir döngü bulunduğunda
            char* cycle = malloc((*pathIndex + 2) * sizeof(char));  // Döngüyü saklamak için bellekten yer ayır
            strncpy(cycle, path, *pathIndex);                       // Döngüyü kopyala
            cycle[*pathIndex] = start;                              // Döngüyü tamamla
            cycle[(*pathIndex) + 1] = '\0';

            // Döngü ağırlığını hesapla
            int weight = 0;
            for (i = 0; i < *pathIndex; i++) {
                weight += getEdgeWeight(graph, cycle[i], cycle[i + 1]);
            }

            addCycle(cycleList, cycle, weight, visitedCount, graph->numVertices);  // Döngüyü döngü listesine ekle
            free(cycle);
        } else if (!visited[tempIndex]) {// Düğüm ziyaret edilmediyse
            findCycles(graph, start, temp->vertex, path, pathIndex, visited, cycleList, visitedCount);  // Döngüyü devam ettir
        }
        temp = temp->next;  // Sonraki kenara geç
    }

    visited[currentIndex] = 0;     // Düğümü ziyaret etme işaretini kaldır
    visitedCount[currentIndex]--;  // Düğümün ziyaret sayısını azalt
    (*pathIndex)--;
}

/*
@brief Döngüleri yazdıran fonksiyon
@param cycleList: Döngü listesi
*/
void printCycles(CycleList* cycleList) {
    int shapeCount = 0;      // Toplam şekil sayısı
    int maxCycleLength = 0;  // En uzun döngü uzunluğu
    int length, i, j;        // Döngü uzunluğu, döngü sayacı, döngü içindeki düğüm sayacı
    int polygonCount;        // O uzunluktaki döngü sayısı
    int index;               // Döngü sayacı
    // Döngüleri sayma ve maksimum döngü uzunluğunu bulma
    CycleList* temp = cycleList;
    while (temp != NULL) {
        int cycleLength = strlen(temp->cycle) - 1;
        if (cycleLength > maxCycleLength) {
            maxCycleLength = cycleLength;
        }
        shapeCount++;
        temp = temp->next;
    }

    printf("\nSekil Sayisi: %d\n\n", shapeCount);

    // Her çokgen uzunluğu için döngüleri alfabetik sırayla yazdırma
    for (length = 3; length <= maxCycleLength; length++) {  // 3'ten başlayarak en uzun döngü uzunluğuna kadar
        polygonCount = 0;
        temp = cycleList;
        while (temp != NULL) {
            if (strlen(temp->cycle) - 1 == length) {  // Uzunluğu doğru olan döngüyü say
                polygonCount++;
            }
            temp = temp->next;
        }

        if (polygonCount > 0) {  // Uzunluğu doğru olan döngü varsa
            printf("%d'gen sayisi: %d\n", length, polygonCount);

            // O uzunluktaki döngüleri geçici bir diziye kopyalama
            CycleList** cycles = malloc(polygonCount * sizeof(CycleList*));
            index = 0;
            temp = cycleList;
            while (temp != NULL) {
                if (strlen(temp->cycle) - 1 == length) {  // Uzunluğu doğru olan döngüyü kopyala
                    cycles[index++] = temp;
                }
                temp = temp->next;
            }

            // Döngüleri alfabetik olarak sıralama
            for (i = 0; i < polygonCount - 1; i++) {
                for (j = i + 1; j < polygonCount; j++) {
                    if (strcmp(cycles[i]->cycle, cycles[j]->cycle) > 0) {
                        CycleList* tempCycle = cycles[i];
                        cycles[i] = cycles[j];
                        cycles[j] = tempCycle;
                    }
                }
            }

            // Sıralanan döngüleri yazdırma
            for (i = 0; i < polygonCount; i++) {
                printf("\t%d. %d'gen: ", i + 1, length);
                const char* cycle = cycles[i]->cycle;  // Orijinal pointer'ı değiştirmemek için geçici bir pointer kullanın
                while (*cycle) {
                    printf("%c", *cycle);
                    if (*(cycle + 1)) {
                        printf(" ->");
                    }
                    cycle++;
                }
                printf(" Uzunluk: %d\n", cycles[i]->weight);
            }
            free(cycles);
        }
    }
}

int main() {
    int N, M, i;
    char filename[100];
    printf("Dosya adini girin: ");
    scanf("%s", filename);
    printf("Dugumm sayisini girin: ");
    scanf("%d", &N);
    printf("Kenar sayisini girin: ");
    scanf("%d", &M);

    Graph* graph = createGraph(N);  // Graf oluştur

    readGraphFromFile(graph, filename);  // Dosyadan grafı oku

    char* path = malloc((N + 1) * sizeof(char));  // Döngü yolu için bellekten yer ayır
    int pathIndex = 0;                            // Döngü yolu indeksi
    int* visited = calloc(N, sizeof(int));        // Ziyaret edilen düğümleri saklamak için dizi
    int* visitedCount = calloc(N, sizeof(int));   // Düğümlerin ziyaret sayısını saklamak için dizi

    CycleList* cycleList = NULL;

    for (i = 0; i < N; i++) {  // Her düğüm için döngüleri bul
        findCycles(graph, graph->vertices[i], graph->vertices[i], path, &pathIndex, visited, &cycleList, visitedCount);
    }

    // Döngüleri yazdır
    printCycles(cycleList);

    // Belleği temizle
    while (cycleList != NULL) {
        CycleList* temp = cycleList;
        cycleList = cycleList->next;
        free(temp->cycle);
        free(temp->visitedCount);
        free(temp);
    }
    free(path);
    free(visited);
    free(visitedCount);
    for (i = 0; i < N; i++) {
        Node* node = graph->adjLists[i].head;
        while (node != NULL) {
            Node* temp = node;
            node = node->next;
            free(temp);
        }
    }
    free(graph->adjLists);
    free(graph->vertices);
    free(graph);

    return 0;
}
