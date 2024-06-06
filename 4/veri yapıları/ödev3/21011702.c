#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/*
@brief swap fonksiyonu, iki elemaninin yerlerini degistirir

@param a, b degistirilecek elemanlar
*/
void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

/*
@brief heapify fonksiyonu, bir diziyi max-heap yapar

@param arr, dizi
@param n, dizi boyutu
@param i, dugum indeksi
*/
void heapify(int *arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2; 

    if (left < n && arr[left] > arr[largest]) // sol cocukla karsilastir 
        largest = left;

    if (right < n && arr[right] > arr[largest]) // sag cocukla karsilastir
        largest = right;

    if (largest != i) { // eger en buyuk cocuk dugumden buyukse yer degistir
        swap(&arr[i], &arr[largest]); // yer degistir
        heapify(arr, n, largest); // en buyuk cocuk dugum icin tekrar heapify cagir
    }
}

/*
@brief createHeap fonksiyonu, matrix dizisindeki her bir kuyrugu max-heap yapar

@param arr, dizi
@param n, dizi boyutu
@param i, dugum indeksi
*/
void createHeap(int *arr, int n) {
    int i;
    for (i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i); // her bir dugum icin heapify cagir
}

/*
@brief printMatrix fonksiyonu, matrix dizisini ekrana yazdirir

@param matrix, matrix
@param N, satir sayisi
@param M, sutun sayisi
*/
void printMatrix(int** matrix, int N, int M) {
    int i, j;
    for (i = 0; i < N; i++) {
        for (j = 0; j < M; j++) {
            if (matrix[i][j] == -1)
                printf(" -1 ");
            else
                printf("%3d ", matrix[i][j]);
        }
        printf("\n");
    }
}

/*
@brief extractMax fonksiyonu, bir diziden en buyuk elemani cikarir

@param heap, dizi
@param heapSize, dizi boyutu
@param M, maksimum eleman sayisi

@return en buyuk eleman
*/
int extractMax(int *heap, int* heapSize, int M) {
    if (*heapSize == 0)
        return -1;

    int max = heap[0]; // en buyuk eleman
    heap[0] = heap[*heapSize - 1]; // en son elemani en basa al
    heap[*heapSize - 1] = -1; // en son elemani -1 yap
    (*heapSize)--; // heap boyutunu azalt
    heapify(heap, *heapSize, 0); // heapify cagir
    return max; // en buyuk elemani dondur
}

/*
@brief createRandomNumbers fonksiyonu, K adet rastgele tekrar etmeyen sayi olusturur

@param K, maksimum eleman sayisi

@return rastgele sayilar
*/
int* createRandomNumbers(int K) {
    int i,j;
    int* numbers = (int*)malloc(K * sizeof(int)); // K elemanli dizi olustur
    for (i = 0; i < K; i++) {
        numbers[i] = i + 1; // 1'den K'ya kadar sayilari diziye yerlestir
    }

    for (i = K - 1; i > 0; i--) {
        j = rand() % (i + 1); // 0 ile i arasinda rastgele bir sayi sec
        swap(&numbers[i], &numbers[j]); // i ve j elemanlarini yer degistir
    }
    return numbers; // rastgele sayilari dondur
}

/*
@brief process fonksiyonu, kuyruklardan eleman cikarir ve biten kuyruklari belirler

@param N, satir sayisi
@param M, sutun sayisi
@param capacities, kuyruklarin kapasiteleri
@param matrix, matrix
*/
void process(int N, int M, int* capacities, int** matrix) {
    int i,j;
    int finishedQueues[N], finishedQueueCount = 0, orderFinished[N], orderIndx = 0;
    for (i = 0; i < N; i++) {
        finishedQueues[i] = 0; // biten kuyrukları sifirla
    }

    while (finishedQueueCount < N) { // tum kuyruklar bitene kadar
        int maxVal = -1, maxIndx = -1;
        for (i = 0; i < N; i++) {
            if (capacities[i] > 0 && matrix[i][0] > maxVal) { // kapasitesi varsa ve en buyuk eleman maxVal'dan buyukse
                maxVal = matrix[i][0]; // en buyuk eleman
                maxIndx = i; // en buyuk elemanin bulundugu kuyruk
            }
        }

        if (maxIndx != -1) { // en buyuk eleman bulunduysa
            extractMax(matrix[maxIndx], &capacities[maxIndx], M); // en buyuk elemani cikar
            printf("\n%d extracted from queue %d:\n", maxVal, maxIndx + 1); 
            printMatrix(matrix, N, M);
        }

        for (i = 0; i < N; i++) {
            if (capacities[i] == 0 && finishedQueues[i] == 0) { // kapasitesi bitti ve kuyruk bitmediyse
                finishedQueues[i] = 1; // kuyruk bitti
                orderFinished[orderIndx++] = i + 1; // kuyruklarin bitis sirasi
                finishedQueueCount++; // biten kuyruk sayisi
                printf("\nQueue %d done!\n", i + 1);
            }
        }
    }

    printf("\nOrder finished queue: ");
    for (i = 0; i < N; i++) {
        printf("%d ", orderFinished[i]); // kuyruklarin bitis sirasi
    }
    printf("\n");
}

int main() {
    srand(time(NULL));
    int N, M;
    do {
        printf("Enter (N M): ");
        scanf("%d %d", &N, &M);
        if (N <= 0 || M <= 0) {
            printf("Both N and M must be greater than 0.\n");
        }
    } while (N <= 0 || M <= 0); // N ve M 0'dan buyuk olana kadar

    int K = N * M + 2;
    int i, j, indx;
    int* capacities = (int*)malloc(N * sizeof(int));
    int** matrix = (int**)malloc(N * sizeof(int*));
    int* numbers;

    for (i = 0; i < N; i++) {
        do {
            printf("Enter the capacity for queue %d (1 to %d): ", i + 1, M);
            scanf("%d", &capacities[i]);
            if (capacities[i] > M || capacities[i] < 1) { // kapasite 1 ile M arasinda degilse
                printf("Capacity must be between 1 and %d.\n", M);
            }
        } while (capacities[i] > M || capacities[i] < 1); // kapasite 1 ile M arasinda olana kadar

        matrix[i] = (int*)malloc(M * sizeof(int)); // M elemanli dizi olustur
        if (matrix[i] == NULL) { 
            printf("Memory allocation failed.\n");
            return 1; 
        }
        for (j = 0; j < M; j++) {
            matrix[i][j] = -1; // -1 ile doldur
        }
    }

    numbers = createRandomNumbers(K); // rastgele sayilar olustur

    for (i = 0, indx = 0; i < N; i++) {
        for (j = 0; j < capacities[i] && indx < K; j++) {
            matrix[i][j] = numbers[indx++]; // rastgele sayilari kuyruklara yerlestir
        }
    }

    printf("\nRandomly generated matrix:\n");
    printMatrix(matrix, N, M);

    for (i = 0; i < N; i++) {
        createHeap(matrix[i], capacities[i]); // kuyruklari sirasiyla max-heap yap
    }

    printf("\nMatrix after max-heaps:\n");
    printMatrix(matrix, N, M);

    process(N, M, capacities, matrix); // islemi gerceklestir

    // Free memory
    free(numbers);
    for (i = 0; i < N; i++) {
        free(matrix[i]);
    }
    free(matrix);
    free(capacities);
    return 0;
}
