#include <stdio.h>
#define MAX 50

void getParams(int n, int matrix[][3]) {
    int i, j;
    char workCode;
    for (i = 0; i < n; i++) {
        printf("\nIs kodu: ");
        scanf(" %c", &workCode);
        for (j = 0; j < i; j++) {
            if ((char)matrix[j][0] == workCode) {
                printf("\nAyni is kodu zaten var. Lutfen farkli bir is kodu girin.\nIs kodu: ");
                scanf(" %c", &workCode);
                j = -1;
            }
        }
        matrix[i][0] = (int)workCode;
        printf("\nTamamlanma suresi: ");
        scanf("%d", &matrix[i][1]);
        while (matrix[i][1] <= 0) {
            printf("\nTamamlanma suresi 0'dan buyuk olmalidir. Lutfen tekrar girin.\nTamamlanma suresi: ");
            scanf("%d", &matrix[i][1]);
        }
        matrix[i][2] = 0;
    }
}

void printTimeLine(int n, int head, int matris[][3]) {
    int current = head, i;
    while (current != -1) {
        for (i = 0; i < matris[current][1]; i++) {
            printf("%c ", (char)matris[current][0]);
        }
        current = matris[current][2];
    }
}

int main() {
    int matrix[MAX][3];
    int n, i, head;
    int flag = 0;

    do {
        printf("\nIs sayisini giriniz: ");
        scanf("%d", &n);
        if (n > 0)
            flag = 1;
        else
            printf("\nHatali giris yaptiniz. Lutfen tekrar deneyiniz.");
    } while (flag == 0);

    getParams(n, matrix);

    flag = 0;
    do {
        printf("\nBaslangic degerini giriniz: ");
        scanf("%d", &head);
        if (head >= 0 && head < n)
            flag = 1;
        else
            printf("\nHatali giris yaptiniz. Lutfen tekrar deneyiniz.");
    } while (flag == 0);

    for (i = 0; i < n; i++) {
        printf("Link Sirasi: ");
        scanf("%d", &matrix[i][2]);
    }

    printTimeLine(n, head, matrix);

    return 0;
}
