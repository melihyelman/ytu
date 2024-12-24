#include <stdio.h>

// Knapsack problemini çözen fonksiyon
int knapsack(int values[], int weights[], int n, int W) {
    int dp[n + 1][W + 1]; // DP tablosu: (n+1) x (W+1) boyutunda

    // DP tablosunu doldur
    for (int i = 0; i <= n; i++) {       // Eşyaları döngüyle incele
        for (int w = 0; w <= W; w++) {   // Çanta kapasitesini döngüyle incele
            if (i == 0 || w == 0) {      // İlk satır veya sütun (temel durum)
                dp[i][w] = 0;            // Kapasite veya eşya yoksa toplam değer 0
            } else if (weights[i - 1] <= w) { // Eşyanın ağırlığı çantaya sığıyorsa
                dp[i][w] = (values[i - 1] + dp[i - 1][w - weights[i - 1]] > dp[i - 1][w])
                            ? values[i - 1] + dp[i - 1][w - weights[i - 1]]
                            : dp[i - 1][w];
                // Karar:
                // 1. Eşyayı seç (values[i-1] + dp[i-1][w-weights[i-1]]).
                // 2. Eşyayı seçme (dp[i-1][w]).
                // Maksimum değeri al.
            } else {                     // Eşyanın ağırlığı çantaya sığmıyorsa
                dp[i][w] = dp[i - 1][w]; // Eşyayı seçemezsin, önceki değeri al
            }
        }
        // Mevcut DP tablosunu yazdır
        printf("Adım %d:\n", i);
        for (int x = 0; x <= n; x++) {
            for (int y = 0; y <= W; y++) {
                printf("%3d ", dp[x][y]);
            }
            printf("\n");
        }
        printf("\n");
    }

    return dp[n][W]; // DP tablosunun sağ alt köşesi, maksimum değeri içerir
}

int main() {
    int values[] = {60, 100, 120}; // Eşyaların değerleri
    int weights[] = {10, 20, 30}; // Eşyaların ağırlıkları
    int W = 50;                   // Çantanın maksimum kapasitesi
    int n = sizeof(values) / sizeof(values[0]); // Eşya sayısı

    int maxValue = knapsack(values, weights, n, W); // Knapsack fonksiyonunu çağır
    printf("Knapsack'teki maksimum değer: %d\n", maxValue); // Sonucu yazdır

    return 0;
}
