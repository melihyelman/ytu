#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main() {
    int N, M, foodCount, i, j, k, moveCount = 0, snakeLength = 1, gameState = 0, isEat = 0, history[200][2];
    printf("Satir sayisini giriniz: ");
    scanf("%d", &N);
    printf("Sutun sayisini giriniz: ");
    scanf("%d", &M);
    char game[N][M], tempGame[N][M], direction;

    srand(time(NULL));

    for (i = 0; i < N; i++) {
        for (j = 0; j < M; j++) {
            game[i][j] = ' ';
        }
    }

    while (gameState == 0) {
        printf("Yem sayisini giriniz: ");
        scanf(" %d", &foodCount);
        if (foodCount > N * M - 1) {
            printf("Yem sayisi oyun alanindan fazla olamaz!\n");
        } else {
            gameState = 1;
        }
    }
    gameState = 0;
    while (gameState != foodCount) {
        i = rand() % N;
        j = rand() % M;
        if (game[i][j] == ' ') {
            game[i][j] = '0';
            gameState++;
        }
    }
    while (gameState != 1) {
        i = rand() % N;
        j = rand() % M;
        if (game[i][j] == ' ') {
            history[0][0] = i;
            history[0][1] = j;
            gameState = 1;
        }
    }

    gameState = 0;
    while (gameState == 0 && snakeLength != foodCount+1) {
        for (i = 0; i < N; i++) {
            for (j = 0; j < M; j++) {
                tempGame[i][j] = game[i][j];
            }
        }
        for (i = 0; i < N; i++) {
            for (j = 0; j < M; j++) {
                for (k = moveCount; k > (moveCount - snakeLength); k--) {
                    if (history[k][0] == i && history[k][1] == j) {
                        tempGame[i][j] = (moveCount - k + 1) + '0';
                        if (game[i][j] == '0') {
                            game[i][j] = ' ';
                        }
                    }
                }
                if (j == 0) {
                    printf("| %c |", tempGame[i][j]);
                } else {
                    printf(" %c |", tempGame[i][j]);
                }
            }
            printf("\n");
        }

        if (isEat == 1) {
            snakeLength++;
        }

        printf("\nHamle: ");
        scanf(" %c", &direction);
        int currentRow = history[moveCount][0];
        int currentCol = history[moveCount][1];
        if (direction == 'u') {
            moveCount++;
            if (currentRow - 1 < 0) {
                gameState = 1;
            } else {
                history[moveCount][0] = currentRow - 1;
                history[moveCount][1] = currentCol;
                if (game[currentRow - 1][currentCol] == '0') {
                    isEat = 1;
                } else {
                    isEat = 0;
                }
            }
        } else if (direction == 'd') {
            moveCount++;
            if (currentRow + 1 >= N) {
                gameState = 1;
            } else {
                history[moveCount][0] = currentRow + 1;
                history[moveCount][1] = currentCol;
                if (game[currentRow + 1][currentCol] == '0') {
                    isEat = 1;
                } else {
                    isEat = 0;
                }
            }
        } else if (direction == 'l') {
            moveCount++;
            if (currentCol - 1 < 0) {
                gameState = 1;
            } else {
                history[moveCount][0] = currentRow;
                history[moveCount][1] = currentCol - 1;
                if (game[currentRow][currentCol - 1] == '0') {
                    isEat = 1;
                } else {
                    isEat = 0;
                }
            }
        } else if (direction == 'r') {
            moveCount++;
            if (currentCol + 1 >= M) {
                gameState = 1;
            } else {
                history[moveCount][0] = currentRow;
                history[moveCount][1] = currentCol + 1;
                if (game[currentRow][currentCol + 1] == '0') {
                    isEat = 1;
                } else {
                    isEat = 0;
                }
            }
        }
    }
    if (gameState == 1) {
        printf("Kaybettiniz!");
    } else {
        printf("%d hamlede oyunu bitirdiniz!", moveCount-1);
    }

    return 0;
}


/*

•	Oyun tahtası oluştururken yılanın ilk hali “1”, ile yemekler “0” ile, diğer alanlar boşluk karakteri ile temsil edilmelidir. Yılan yemek yedikçe boyutu büyümelidir. Örnek: 1 boyutundaki yılan ilk yemekten sonra 1-2, ikinci yemekten sonra 1-2-3 olarak oyun alanında yer almalıdır (Rakamlar matrisin farklı gözlerinde yer almalıdır).
•	Yılan yemek yediğinde arkaya doğru büyümelidir. Bunun için, büyüme bir adım sonraki hareket ile oluşmalıdır (örneği inceleyiniz). 
•	Oyun tahtasının boyutları (satır ve sütun) sayısı kullanıcıdan alınmalıdır.
•	Oyun alanındaki yemek sayısı kullanıcıdan alınmalıdır.
o	Tahtaya sığabilecek yemek sayısı kontrol edilmeli, hata varsa girdi tekrar istenmelidir. 
•	Oyun tahtası (yılanın başlangıç pozisyonu ve yemeklerin pozisyonları) oyun başlangıcında rastgele oluşturulmalıdır.
o	Rasgele sayı üretmek için stdlib.h içindeki rand() ve srand() fonksiyonlarını kullanabilirsiniz. Ayrıntılı bilgiye internet araması ile kolaylıkla ulaşabilirsiniz. 
•	Her adımda (kullanıcının hareket yönü girdiği her iterasyonda) oyun tahtasının o anki hali ve yapılan hamle sayısı kullanıcıya gösterilmelidir.
•	Kullanıcıdan oyunun her adımında yılanın hareket etmesi istenen yön için bilgi alınmalıdır. “U” yukarı, “D” aşağı, “L” sol, “R” sağ için kullanılabilir (“u”, “d”, “l”, “r” de kabul edilebilir).
•	Oyun tamamlandığında oyuncunun kaç hamle sonunda yılanı en büyük hale getirdiği ekrana yazdırılmalıdır.
•	Yılan, oyun alanını terk ettiğinde (kafası bir kenara komşuyken o kenara doğru hareket komutu girildiğinde, bir başka deyişle duvara çarptığında) oyun sonlanmalı ve kullanıcıya “Kaybettiniz” benzeri mesaj yazdırılmalıdır. O ana kadar yapılan hamle sayısı, yılanın büyüklüğü ve geriye kalan yemek sayısı ekrana yazdırılmalıdır.
•	Oyun tahtası ekrana düzgün ve okunaklı bir şekilde yazdırılmalıdır.
•	Yılan yemek bulunan göze geldiğinde değil, o gözden başka bir göze verilen komut ile geçtiğinde büyütülmelidir.
*/