
#include <stdio.h>
#define MAX 50
// kullanıcıdan alınan sayıyı tersine çeviren program

int main() {
    // Versiyon 1
    // int number, reverse = 0;

    // printf("Sayiyi giriniz: ");
    // scanf("%d", &number);

    // while (number != 0) {
    //     reverse = reverse * 10 + number % 10;
    //     number /= 10;
    // }
    // printf("%d",reverse);
    // --------------------

    // Versiyon 2
    int numbers[MAX], number, reverse = 0, remainder, i = 0, j;

    printf("Sayiyi giriniz: ");
    scanf("%d", &number);

    while (number != 0) {
        remainder = number % 10;
        numbers[i] = remainder;
        // aşağıdaki foru kullamadan yapabiliriz:
        // reverse = reverse*10 + numbers[i];
        i++;
        number /= 10;
    }
    for (j = 0; j < i; j++) {
        reverse = reverse * 10 + numbers[j];
    }
    printf("%d", reverse);
    return 0;
}