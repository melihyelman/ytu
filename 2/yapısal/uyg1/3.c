#include <stdio.h>
#define MAX 50
// bir dizinin elemanlarını dışarıdan girilen bir x sayısına göre
// küçükleri dizinin baş tarafına, büyükleri ise son tarafına yerleştiren.
int main() {
    int numbers[MAX], x, i, n, begin = 0, end, tmp;

    printf("Eleman sayisi = ");
    scanf("%d", &n);

    for (i = 0; i < n; i++) {
        printf("%d elemani giriniz: ", i + 1);
        scanf("%d", &numbers[i]);
    }

    printf("X = ");
    scanf("%d", &x);

    end = n - 1;
    while (begin < end) {
        if (numbers[begin] > x) {
            tmp = numbers[begin];
            numbers[begin] = numbers[end];
            numbers[end] = tmp;
            end--;
        } else {
            begin++;
        }
    }

    for(i = 0; i <n; i++) {
        printf("%d ", numbers[i]);
    }

    return 0;
}