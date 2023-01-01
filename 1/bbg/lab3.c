#include <stdio.h>
int main() {
    int M, N, k, i, j, m, n, sum = 0, sumFilter = 0, flag = 0;

    printf("Satır degerini giriniz: ");
    scanf("%d", &M);
    printf("Sutun degerini giriniz: ");
    scanf("%d", &N);

    int input[M][N];

    for (i = 0; i < M; i++) {
        for (j = 0; j < N; j++) {
            printf("Matrisin %d. satir %d. sutun elemanini giriniz: ", i + 1, j + 1);
            scanf("%d", &input[i][j]);
        }
    }

    while (flag == 0) {
        printf("Filtre boyutunu giriniz: ");
        scanf("%d", &k);
        if ((k > M || k > N) && k % 2 == 1) {
            printf("Filtre boyutu matris boyutundan buyuk olamaz ve tek sayi olmalidir.\n");
        } else {
            flag = 1;
        }
    }
    int filter[k][k];

    for (i = 0; i < k; i++) {
        for (j = 0; j < k; j++) {
            printf("Matrisin %d. satir %d. sutun elemanini giriniz: ", i + 1, j + 1);
            scanf("%d", &filter[i][j]);
            sumFilter += filter[i][j];
        }
    }

    int result[M - k + 1][N - k + 1];

    for (i = 0; i < M - k + 1; i++) {
        for (j = 0; j < N - k + 1; j++) {
            sum = 0;
            for (m = 0; m < k; m++) {
                for (n = 0; n < k; n++) {
                    sum += input[i + m][j + n] * filter[m][n];
                }
            }
            result[i][j] = sum / sumFilter;
        }
    }
    printf("Filtrelenmis matris: \n");
    for (i = 0; i < M - k + 1; i++) {
        for (j = 0; j < N - k + 1; j++) {
            printf("%d ", result[i][j]);
        }
        printf("\n");
    }
}

/*
Konvolüsyon işlemi bir resimdeki gürültüyü azaltmak amaçlı kullanılmaktadır.
MxN boyutunda kullanıcıdan alınan bir gri seviyeli görüntüyü içeren matrisi, yine
kullanıcıdan alınan kxk filtre matrisiyle konvolüsyon işlemine tabii tutan C
kodunu yazınız. Sonuç M-k+1xN-k+1 boyutunda yeni bir matris olacaktır. k, M ve
N sayılarından küçüktür ve tek sayıdır. Konvolüsyon işlemi, filtreyi resim üzerinde
gezdirerek filtrede sayılarla, pikselleri çarpıp toplar, toplamı filtrenin toplamına
böler ve hesaplanan değeri uygulanan orta noktaya yazar

İnput görüntü:
0 1 2 0
3 4 5 2
6 7 1 1
1 2 3 4

Filtre
0 1 0
2 3 1
0 1 2

Konvolüsyon sonucu:
0*0+1*1+0*2+2*3+3*4+1*5+0*6+1*7+2*1=33 33/(0+1+0+2+3+1+1+2)=3
1*0+2*1+0*0+4*2+5*3+2*1+7*0+1*1+1*2=30 30/10=3
3*0+4*1+5*0+6*2+7*3+1*1+1*0+2*1+2*3=46 46/10=4
4*0+5*1+2*0+7*2+1*3+1*1+2*0+3*1+4*2=34 34/10=3

Output görüntü:
3 3
4 3

*/