#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#define MAX 50

int main() {
    int n, i, j, temp, round, player1, player2;
    char flag;
    int matris[MAX][MAX] = {0};
    do {
        player1 = 0;
        player2 = 0;
        round = 0;
        i=0;
        j=0;
        printf("Matrisin boyutunu giriniz: ");
        scanf("%d", &n);
        srand(time(NULL));

        for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) {
                matris[i][j] = rand() % (n * n) + 1;
            }
        }

        printf("Ornek \n");

        for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) {
                printf("%d\t", matris[i][j]);
            }
            printf("\n");
        }

        for (round = 0; round < 6; round++) {
            int sum = 0;
            for (i = 0; i < (n / 2); i++) {
                for (j = i; j < (n - i - 1); j++) {
                    temp = matris[i][j];
                    matris[i][j] = matris[n - j - 1][i];
                    matris[n - j - 1][i] = matris[n - i - 1][n - j - 1];
                    matris[n - i - 1][n - j - 1] = matris[j][n - i - 1];
                    matris[j][n - i - 1] = temp;
                }
            }
            for (i = 0; i < n; i++) {
                sum += matris[n - 1][i];
            }
            if (round % 2 == 0) {
                player1 += sum;
            } else {
                player2 += sum;
            }
            printf("\n90derece donmus hali:\n");
            for (i = 0; i < n; i++) {
                for (j = 0; j < n; j++) {
                    printf("%d\t", matris[i][j]);
                }
                printf("\n");
            }
            printf("Betul: %d \t Ayse: %d \n", player1, player2);
        }
        if (player1 > player2) {
            printf("\nBetul kazandi\n");
        } else if (player2 > player1) {
            printf("\nAyse kazandi\n");
        }else {
            printf("\n Berabere \n");
        }

        printf("\nTekrar oynamak ister misiniz: ");
        scanf(" %c", &flag);
    } while (flag == 'e' || flag == 'E');

    return 0;
}
