#include <stdio.h>
#define MAX 50

// kullanıcıdan tek değişkenli bir denklemin derece sayısını,
// her bir terimin katsayısını, x değişken değerini alan ve sonucu hesapla
int main() {
    // int N, i, x, tmp = 1, sum = 0, coefficient;

    // printf("N Degeri: ");
    // scanf("%d", &N);

    // printf("x Degeri: ");
    // scanf("%d", &x);

    // for (i = 0; i <= N; i++) {
    //     printf("%d dereceli terimin katsayisi", i);
    //     scanf("%d", &coefficient);
    //     sum += coefficient * tmp;
    //     tmp *= x;
    // }
    // ------------

    // versiyon 2
    int N, x, coefficient, sum = 0, i, tmp = 1;
    char flag;

    do {
        printf("N Degeri: ");
        scanf("%d", &N);

        printf("x Degeri: ");
        scanf("%d", &x);

        for (i = 0; i <= N; i++) {
            printf("%d dereceli terimin katsayisi", i);
            scanf("%d", &coefficient);
            sum += coefficient * tmp;
            tmp *= x;
        }
        printf("Sonuc: %d\n", sum);
        printf("Tekrar denemek icin e ye basiniz: ");
        scanf("%c", &flag);
    } while (flag == 'e' || flag == 'E');

    return 0;
}