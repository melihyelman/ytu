/*
NxN'lik bir kare matris olarak verilen 8-bit gri seviye resmi kullanıcıdan alınan
bilgiye göre 90 sağa veya sola döndürüp yeni resmi elde eden, saklayan ve bu
yeni resmi matris formunda ekran yazdırın
*/

#include <stdio.h>
int main() {
    int i, j, n;

    printf("Matrisin boyutunu giriniz: ");
    scanf("%d", &n);
    int main[n][n],rotated[n][n];
    char rotation[10];

    printf("Matrisi hangi yone dondurmek istiyorsunuz: ");
    scanf("%s", rotation);

    for(i = 0; i < n; i++) {
        for(j = 0; j < n; j++) {
            printf("Matrisin %d. satir %d. sutun elemanini giriniz: ", i+1, j+1);
            scanf("%d", &main[i][j]);
        }
    }

    if(rotation[0] == 'r') {
        for(i = 0; i < n; i++) {
            for(j = 0; j < n; j++) {
                rotated[i][j] = main[n-j-1][i];
            }
        }
    } else if(rotation[0] == 'l') {
        for(i = 0; i < n; i++) {
            for(j = 0; j < n; j++) {
                rotated[i][j] = main[j][n-i-1];
            }
        }
    }

    printf("Matrisin yeni hali: \n");

    for(i = 0; i < n; i++) {
        for(j = 0; j < n; j++){
            printf("%d ", rotated[i][j]);
        }
        printf("\n");
    }

    return 0;
}