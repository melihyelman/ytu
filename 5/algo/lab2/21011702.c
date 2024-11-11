#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

// @brief Rastgele benzersiz bir dizi oluşturur
// @param arr Diziyi tutan gösterici
// @param N Dizi boyutu
void generateArray(int arr[], int N) {
    // 1'den N'ye kadar sayıları diziye ekle
    int i;
    for (i = 0; i < N; i++) {
        arr[i] = i + 1;
    }

    for (i = N - 1; i > 0; i--) {  // Diziyi karıştır
        int j = rand() % (i + 1);  // Rastgele bir indeks seç
        // Elemanları değiştir
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}

// @brief Bir diziyi başka bir diziye kopyalar
// @param source Kaynak dizi
// @param dest Hedef dizi
// @param N Dizi boyutu
void arrayCopy(int source[], int dest[], int N) {
    int i;
    for (i = 0; i < N; i++) {
        dest[i] = source[i];
    }
}

// @brief k-way merge işlemi gerçekleştirir
// @param arr Sıralanacak ana dizi
// @param start Alt dizilerin başlangıç indeksleri
// @param end Alt dizilerin bitiş indeksleri
// @param k Alt dizi sayısı
// @param temp Geçici dizi
void kWayMerge(int arr[], int start[], int end[], int k, int temp[]) {
    int *indices = (int *)malloc(k * sizeof(int));  // Alt dizilerin indekslerini tutar
    int i;
    for (i = 0; i < k; i++) {
        indices[i] = start[i];  // Başlangıç indeksleri
    }

    int tempIndex = 0;  // Geçici dizi indexi
    int minVal, minIndex;

    // Toplam eleman sayısını hesapla
    int totalElements = 0;
    for (i = 0; i < k; i++) {
        totalElements += end[i] - start[i] + 1;
    }

    // Tüm elemanlar birleştirilene kadar döngü
    while (tempIndex < totalElements) {
        minVal = INT_MAX;
        minIndex = -1;

        // En küçük elemanı bul
        for (i = 0; i < k; i++) {
            if (indices[i] <= end[i]) {
                if (arr[indices[i]] < minVal) {
                    minVal = arr[indices[i]];
                    minIndex = i;
                }
            }
        }

        temp[tempIndex++] = minVal;  // En küçük elemanı geçici diziye ekle
        indices[minIndex]++;         // İlgili alt dizinin indeksini artır
    }

    free(indices);  // Bellek temizliği
}

// @brief k-way merge sort işlemi gerçekleştirir
// @param arr Sıralanacak dizi
// @param left Başlangıç indeksi
// @param right Bitiş indeksi
// @param k Alt dizi sayısı
void kWayMergeSort(int arr[], int left, int right, int k) {
    if (left >= right)  // Çıkış koşulu
        return;

    int size = right - left + 1;
    int segmentSize = size / k;
    int remainder = size % k;
    int i;

    int *start = (int *)malloc(k * sizeof(int));  // Alt dizilerin başlangıç indeksleri
    int *end = (int *)malloc(k * sizeof(int));    // Alt dizilerin bitiş indeksleri

    int current = left;
    for (i = 0; i < k; i++) {
        start[i] = current;           // Alt dizinin başlangıcı
        int increment = segmentSize;  // artan eleman sayısı
        if (i < remainder) {
            increment = segmentSize + 1;
        }
        current += increment;
        end[i] = current - 1;  // Alt dizinin sonu

        kWayMergeSort(arr, start[i], end[i], k);  // Alt diziyi sıralama
    }

    int *temp = (int *)malloc(size * sizeof(int));  // Geçici dizi

    kWayMerge(arr, start, end, k, temp);  // K-way merge işlemi

    for (i = 0; i < size; i++) {  // Sonucu orijinal diziye kopyala
        arr[left + i] = temp[i];
    }

    free(start);
    free(end);
    free(temp);
}

// @brief k-way merge sort için süre hesaplar
// @param arr Sıralanacak dizi
// @param N Dizi boyutu
// @param k Alt dizi sayısı
// @return Toplam sıralama süresi
double calcSortTime(int arr[], int N, int k) {
    clock_t startTime = clock();

    kWayMergeSort(arr, 0, N - 1, k);

    clock_t endTime = clock();
    double totalTime = ((double)(endTime - startTime)) / CLOCKS_PER_SEC;
    return totalTime;
}

int main() {
    srand(time(NULL));
    int choice;

    do {
        printf("1. Rastgele dizi olustur ve sırala\n");
        printf("2. Dosyaya deney sonuçlarını kaydet\n");
        printf("3. Cikis\n");
        printf("Seciminizi girin: ");
        scanf("%d", &choice);

        if (choice == 1) {
            int N, i,k;
            printf("Dizi boyutunu (n) girin: ");
            scanf("%d", &N);
            printf("k değerini girin: ");
            scanf("%d", &k);
            

            int *array = (int *)malloc(N * sizeof(int));
            generateArray(array, N);

            printf("Olusturulan dizi:\n");
            for (i = 0; i < N; i++) {
                printf("%d ", array[i]);
            }
            printf("\n");

            double time = calcSortTime(array, N, k);
            printf("Sirali dizi:\n");
            for (i = 0; i < N; i++) {
                printf("%d ", array[i]);
            }
            printf("\nTotal süre: %.6f saniye\n", time);

            free(array);

        } else if (choice == 2) {
            int nValues[] = {100, 1000, 10000, 100000, 1000000, 10000000};
            int sizeOfNValues = sizeof(nValues) / sizeof(nValues[0]);
            int i, k, run;

            FILE *fp = fopen("results.txt", "w");
            if (fp == NULL) {
                fprintf(stderr, "Dosya olusturulamadi.\n");
                return 1;
            }
            fprintf(fp, "N\t\t\t\tk\t\t\t\tOrtalama Süre (saniye)\n");

            for (i = 0; i < sizeOfNValues; i++) {
                int N = nValues[i];
                for (k = 2; k <= 10; k++) {
                    double totalTime = 0.0;
                    for (run = 0; run < 10; run++) {
                        int *array = (int *)malloc(N * sizeof(int));
                        generateArray(array, N);

                        int *copyArray = (int *)malloc(N * sizeof(int));
                        arrayCopy(array, copyArray, N);

                        double time = calcSortTime(copyArray, N, k);
                        totalTime += time;

                        fprintf(fp, "%d\t\t\t\t%d\t\t\t\t%.6f\n", N, k, time);

                        free(copyArray);
                        free(array);
                    }
                    double averageTime = totalTime / 10.0;
                    fprintf(fp, "%d\t\t\t\t%d\t\t\t\t%.6f---Ortalama\n", N, k, averageTime);
                }
            }

            fclose(fp);
            printf("Deneyler tamamlandi. Sonuclar 'results.txt' dosyasina kaydedildi.\n");

        } else if (choice == 3) {
            printf("Program sonlandiriliyor.\n");
        } else {
            printf("Gecersiz secim. Tekrar deneyin.\n");
        }

    } while (choice != 3);

    return 0;
}
