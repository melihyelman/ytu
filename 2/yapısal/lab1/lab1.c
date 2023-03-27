#include <stdio.h>
#define MAX 100
int main() {
    char flag;

    do {
        char str[MAX];
        int length = 0, i = 0;

        printf("\nKelime: ");
        scanf("%s", str);
        // girilen str değerinin uzunluğunu alıyorum.
        do {
            length++;
        } while (str[length] != '\0');

        // girilen uzunluk kadar bir kelime dizisi belirliyorum.
        char word[length];
        i = 0;

        // kelime dizisine girilen değeri atıyorum
        do {
            word[i] = str[i];
            i++;
        } while (i < length);

        // kelime dizisinin son elemanına bitiş karakterini atıyorum.
        word[length] = '\0';
        i = 0;

        do {
            // bizden istenilen en baştaki elemani sona atıp, diğer elemanların indisini bir azaltmak.
            // bu yüzden ilk elemanı elimde tutuyorum. diğer elemanları do while döngüsünde bir azaltıyorum.
            // Bu işlemleri kelime uzunluğu kadar yapıyorum çünkü kelime eski haline geliyor.
            char first = word[0];
            int j = 0;

            do {
                word[j] = word[j + 1];
                j++;
            } while (j < (length - 1));
            // son elemanı almıyorum çünkü oranın değeri, first değişkeninde saklı
            word[length - 1] = first;

            printf("%d. Adim: %s\n", i + 1, word);
            i++;
        } while (i < length);

        printf("\nDevam etmek istiyorsaniz e veya E ye basiniz: ");
        scanf(" %c", &flag);
    } while (flag == 'e' || flag == 'E');

    return 0;
}