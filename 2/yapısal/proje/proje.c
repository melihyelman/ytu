#include <limits.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

void readFromFile(int **pairs, char *fileName);
void readRandom(int **pairs, int N);
void drawGiven(int **pairs, int **temp, int N, int sourceX, int sourceY, int destinationX, int destinationY, int undo);
void drawBoard(int **pairs, int **board, int N);
int dfs(int **board, int N, int num, int x, int y, int x2, int y2, int absolutePath);
int calculateScore(double time, int isRandom, int isManuel, int undoCount, int matrisLength);
int playSelf(int N, int **board, int **pairs, int gameStatus, int initialFlag, int *undoCount, int **history, int *gameLength);
int playAuto(int **board, int **pairs, int n, int pairIndex, int x, int y, int *undoCount, int **history, int *gameLength, int *pairLengths);

/* menülerin oluştuğu, kullanıcıdan girdilerin alındığı ve oyunun başlatıldığı ana fonksiyon*/
int main() {
    int i, j, **board = NULL, flag;
    char **userNames = malloc(100 * sizeof(char *));
    int *scores = malloc(100 * sizeof(int));
    int userCount = 0;
    clock_t start, end;
    srand(time(NULL));

    do {
        printf("\n\nRastgele Olustur: 1\nDosyadan Olustur: 2\nKullanicilarin Skorlarini Goster: 3\nCikis: 4\nSecenek: ");
        scanf("%d", &flag);

        if (flag == 1) {
            char userName[20];
            printf("\nKullanici Adi: ");
            scanf("%s", userName);
            int initialFlag = 0;
            do {
                printf("\n\nManuel Modda Oyna: 1\nOtomatik Modda Oyna: 2\nAna Menuye Don: 3\nSecenek: ");
                scanf("%d", &initialFlag);
                if (initialFlag == 1) {
                    printf("\nManuel Modda Oyna\n");
                    int gameStatus = -1, N, result, undoCount = 0, gameLength = 0;

                    printf("\nN: ");
                    scanf("%d", &N);

                    int **pairs = (int **)malloc(N * sizeof(int *));
                    for (i = 0; i < N; i++) {
                        pairs[i] = (int *)malloc(4 * sizeof(int));
                    }

                    for (i = 0; i < N; i++)
                        for (j = 0; j < 4; j++)
                            pairs[i][j] = -1;

                    readRandom(pairs, N);

                    int **board = (int **)malloc(N * sizeof(int *));
                    for (i = 0; i < N; i++)
                        board[i] = (int *)malloc(N * sizeof(int));
                    for (i = 0; i < N; i++)
                        for (j = 0; j < N; j++)
                            board[i][j] = 0;

                    int **history = malloc(1000 * sizeof(int *));
                    for (i = 0; i < 1000; i++) {
                        history[i] = malloc(4 * sizeof(int));
                    }

                    drawBoard(pairs, board, N);

                    start = clock();
                    result = playSelf(N, board, pairs, gameStatus, initialFlag, &undoCount, history, &gameLength);
                    end = clock();
                    if (result != 0) {
                        double time = (double)(end - start) / CLOCKS_PER_SEC;
                        int score = calculateScore(time, 1, 1, undoCount, N);

                        userNames[userCount] = malloc(strlen(userName) + 1);
                        strcpy(userNames[userCount], userName);
                        scores[userCount] = score;
                        userCount++;
                    } else {
                        printf("\nBu oyun iptal oldu! Skor kaydedilmemistir!\n");
                    }

                    for (i = 0; i < N; i++) {
                        free(pairs[i]);
                        free(board[i]);
                    }
                    for (i = 0; i < 1000; i++)
                        free(history[i]);
                    free(history);
                    free(pairs);
                    free(board);
                } else if (initialFlag == 2) {
                    printf("\nOtomatik Modda Oyna\n");
                    int gameStatus = -1, N, score, undoCount = 0, result, gameLength = 0;
                    char fileName[20];
                    printf("\nN: ");
                    scanf("%d", &N);

                    int *pairLengths = malloc(N * sizeof(int));
                    memset(pairLengths, 0, N * sizeof(int));

                    int **pairs = (int **)malloc(N * sizeof(int *));
                    for (i = 0; i < N; i++) {
                        pairs[i] = (int *)malloc(4 * sizeof(int));
                    }

                    for (i = 0; i < N; i++)
                        for (j = 0; j < 4; j++)
                            pairs[i][j] = -1;

                    readRandom(pairs, N);

                    int **board = (int **)malloc(N * sizeof(int *));
                    for (i = 0; i < N; i++) {
                        board[i] = (int *)malloc(N * sizeof(int));
                    }
                    for (i = 0; i < N; i++)
                        for (j = 0; j < N; j++)
                            board[i][j] = 0;
                    for (i = 0; i < N; i++) {
                        board[pairs[i][0]][pairs[i][1]] = i + 1;
                        board[pairs[i][2]][pairs[i][3]] = i + 1;
                    }

                    int **history = malloc(1000000 * sizeof(int *));
                    for (i = 0; i < 1000000; i++) {
                        history[i] = malloc(3 * sizeof(int));
                    }

                    drawBoard(pairs, board, N);

                    start = clock();
                    result = playAuto(board, pairs, N, 0, pairs[0][0], pairs[0][1], &undoCount, history, &gameLength, pairLengths);
                    end = clock();

                    if (result == 1) {
                        double time = (double)(end - start) / CLOCKS_PER_SEC;

                        score = calculateScore(time, 0, 0, undoCount, N);
                        userNames[userCount] = malloc(strlen(userName) + 1);
                        strcpy(userNames[userCount], userName);
                        scores[userCount] = score;
                        userCount++;
                        if (N <= 5) {
                            printf("\nIlk 5 adim ornek olarak gosterilmistir: \n");
                            for (i = 0; i < 5; i++) {
                                printf("(%d,%d):%d\t", history[i][0], history[i][1], history[i][2]);
                            }
                        }
                        drawBoard(pairs, board, N);
                    } else {
                        printf("\nBu oyun cozulemez! Skor kaydedilmemistir!\n");
                    }

                    for (i = 0; i < N; i++) {
                        free(pairs[i]);
                        free(board[i]);
                    }
                    for (i = 0; i < 1000000; i++) {
                        free(history[i]);
                    }
                    free(history);
                    free(pairs);
                    free(board);
                } else if (initialFlag != 3) {
                    printf("\nHatali Giris Yaptiniz!\n");
                }
            } while (initialFlag != 3);

        } else if (flag == 2) {
            char userName[20];
            printf("\nKullanici Adi: ");
            scanf("%s", userName);
            int initialFlag = 0;
            do {
                printf("\n\nManuel Modda Oyna: 1\nOtomatik Modda Oyna: 2\nAna Menuye Don: 3\nSecenek: ");
                scanf("%d", &initialFlag);
                if (initialFlag == 1) {
                    printf("\nManuel Modda Oyna");
                    int gameStatus = -1, N, result, undoCount = 0, gameLength = 0;
                    char fileName[20];
                    printf("\nN: ");
                    scanf("%d", &N);

                    int **pairs = (int **)malloc(N * sizeof(int *));
                    for (i = 0; i < N; i++) {
                        pairs[i] = (int *)malloc(4 * sizeof(int));
                    }

                    for (i = 0; i < N; i++)
                        for (j = 0; j < 4; j++)
                            pairs[i][j] = -1;

                    printf("\nDosya Adini Giriniz: ");
                    scanf("%s", fileName);

                    readFromFile(pairs, fileName);

                    int **board = (int **)malloc(N * sizeof(int *));
                    for (i = 0; i < N; i++)
                        board[i] = (int *)malloc(N * sizeof(int));
                    for (i = 0; i < N; i++)
                        for (j = 0; j < N; j++)
                            board[i][j] = 0;

                    int **history = malloc(1000 * sizeof(int *));
                    for (i = 0; i < 1000; i++) {
                        history[i] = malloc(4 * sizeof(int));
                    }

                    drawBoard(pairs, board, N);

                    start = clock();
                    result = playSelf(N, board, pairs, gameStatus, initialFlag, &undoCount, history, &gameLength);
                    end = clock();
                    if (result != 0) {
                        double time = (double)(end - start) / CLOCKS_PER_SEC;
                        int score = calculateScore(time, 0, 1, undoCount, N);

                        userNames[userCount] = malloc(strlen(userName) + 1);
                        strcpy(userNames[userCount], userName);
                        scores[userCount] = score;
                        userCount++;
                    } else {
                        printf("\nBu oyun iptal oldu! Skor kaydedilmemistir!\n");
                    }

                    for (i = 0; i < N; i++) {
                        free(pairs[i]);
                        free(board[i]);
                    }
                    for (i = 0; i < 1000; i++)
                        free(history[i]);
                    free(history);
                    free(pairs);
                    free(board);
                } else if (initialFlag == 2) {
                    printf("\nOtomatik Modda Oyna\n");
                    int gameStatus = -1, N, score, result = 0, gameLength = 0, undoCount = 0;

                    char fileName[20];
                    printf("\nN: ");
                    scanf("%d", &N);

                    int *pairLengths = malloc(N * sizeof(int));
                    memset(pairLengths, 0, N * sizeof(int));

                    int **pairs = (int **)malloc(N * sizeof(int *));
                    for (i = 0; i < N; i++) {
                        pairs[i] = (int *)malloc(4 * sizeof(int));
                    }

                    for (i = 0; i < N; i++)
                        for (j = 0; j < 4; j++)
                            pairs[i][j] = -1;

                    printf("\nDosya Adini Giriniz: ");
                    scanf("%s", fileName);

                    readFromFile(pairs, fileName);
                    int **board = (int **)malloc(N * sizeof(int *));
                    for (i = 0; i < N; i++) {
                        board[i] = (int *)malloc(N * sizeof(int));
                    }
                    for (i = 0; i < N; i++)
                        for (j = 0; j < N; j++)
                            board[i][j] = 0;
                    for (i = 0; i < N; i++) {
                        board[pairs[i][0]][pairs[i][1]] = i + 1;
                        board[pairs[i][2]][pairs[i][3]] = i + 1;
                    }

                    int **history = malloc(1000000 * sizeof(int *));
                    for (i = 0; i < 1000000; i++) {
                        history[i] = malloc(3 * sizeof(int));
                    }

                    drawBoard(pairs, board, N);

                    start = clock();
                    result = playAuto(board, pairs, N, 0, pairs[0][0], pairs[0][1], &undoCount, history, &gameLength, pairLengths);
                    end = clock();

                    if (result == 1) {
                        double time = (double)(end - start) / CLOCKS_PER_SEC;

                        score = calculateScore(time, 0, 0, undoCount, N);
                        userNames[userCount] = malloc(strlen(userName) + 1);
                        strcpy(userNames[userCount], userName);
                        scores[userCount] = score;
                        userCount++;
                        if (N <= 5) {
                            printf("\nIlk 5 adim ornek olarak gosterilmistir: \n");
                            for (i = 0; i < 5; i++) {
                                printf("(%d,%d):%d\t", history[i][0], history[i][1], history[i][2]);
                            }
                        }
                        drawBoard(pairs, board, N);

                    } else {
                        printf("\nBu oyun cozulemez! Skor kaydedilmemistir!\n");
                    }

                    for (i = 0; i < N; i++) {
                        free(pairs[i]);
                        free(board[i]);
                    }
                    for (i = 0; i < 1000000; i++) {
                        free(history[i]);
                    }
                    free(history);
                    free(pairs);
                    free(board);
                } else if (initialFlag != 3) {
                    printf("Hatali Giris Yaptiniz!");
                }
            } while (initialFlag != 3);
        } else if (flag == 3) {
            printf("\nSkor Tablosu\n");
            for (i = 0; i < userCount; i++) {
                printf("%s: %d\n", userNames[i], scores[i]);
            }
        } else if (flag != 4) {
            printf("Hatali Giris Yaptiniz!");
        }
    } while (flag != 4);

    return 0;
}
/* Dosyadan pairleri okur */
void readFromFile(int **pairs, char *fileName) {
    int i, j, temp;
    FILE *data = fopen(fileName, "r");
    if (!data) {
        printf("Dosya Acilamadi!");
        return;
    }
    while (!feof(data)) {
        fscanf(data, "%d %d %d\n", &i, &j, &temp);
        if (pairs[temp - 1][0] == -1 && pairs[temp - 1][1] == -1) {
            pairs[temp - 1][0] = i;
            pairs[temp - 1][1] = j;
        } else {
            pairs[temp - 1][2] = i;
            pairs[temp - 1][3] = j;
        }
    }
    fclose(data);
}
/* Random pairleri olusturur */
void readRandom(int **pairs, int N) {
    int i;
    int *positions = (int *)malloc(N * N * sizeof(int));
    for (i = 0; i < N * N; i++) {
        positions[i] = i;
    }
    int remaining = N * N;
    for (i = 1; i <= N; i++) {
        int index1 = rand() % remaining;
        int x1 = positions[index1] / N;
        int y1 = positions[index1] % N;
        pairs[i - 1][0] = x1;
        pairs[i - 1][1] = y1;

        positions[index1] = positions[remaining - 1];
        remaining--;
        int index2 = rand() % remaining;
        int x2 = positions[index2] / N;
        int y2 = positions[index2] % N;
        pairs[i - 1][2] = x2;
        pairs[i - 1][3] = y2;
        positions[index2] = positions[remaining - 1];
        remaining--;
    }
    free(positions);
}
/* Verilen iki nokta arasını kontrol eder, eğer doğruysa board üzerine ilgili değeri çizer.*/
void drawGiven(int **pairs, int **board, int N, int sourceX, int sourceY, int destinationX, int destinationY, int undo) {
    int big = 0, small = 0, i;
    int **temp = (int **)malloc(N * sizeof(int *));
    for (i = 0; i < N; i++) {
        temp[i] = (int *)malloc(N * sizeof(int));
    }
    for (i = 0; i < N; i++) {
        memcpy(temp[i], board[i], N * sizeof(int));
    }
    for (i = 0; i < N; i++) {
        temp[pairs[i][0]][pairs[i][1]] = i + 1;
        temp[pairs[i][2]][pairs[i][3]] = i + 1;
    }
    if (sourceX >= N || sourceX < 0 || sourceY >= N || sourceY < 0 || destinationX >= N || destinationX < 0 || destinationY >= N || destinationY < 0) {
        printf("\nGecersiz Hamle! Lutfen oyun alani disina cikmayan konumlar giriniz.");
        return;
    }
    if (sourceX != destinationX && sourceY != destinationY) {
        printf("\nGecersiz Hamle! Lutfen ayni yatay veya dikeyde olan bir cift konum giriniz.");
        return;
    }
    if (temp[sourceX][sourceY] == 0 && temp[destinationX][destinationY] == 0) {
        printf("\nGecersiz Hamle! Lutfen baslangic ve bitis degeri 0 olan konumlar girmeyiniz!.");
        return;
    }
    if (temp[sourceX][sourceY] != temp[destinationX][destinationY] && temp[sourceX][sourceY] != 0 && temp[destinationX][destinationY] != 0) {
        printf("\nGecersiz Hamle! Lutfen baslangic ve bitis degeri farkli olan konum girmeyiniz!.");
        return;
    }
    int number = 0;
    if (board[sourceX][sourceY] != 0) {
        number = board[sourceX][sourceY];
    } else if (board[destinationX][destinationY] != 0) {
        number = board[destinationX][destinationY];
    }

    for (i = 0; i < N && number == 0; i++) {
        if ((sourceX == pairs[i][0] && sourceY == pairs[i][1]) || (sourceX == pairs[i][2] && sourceY == pairs[i][3])) {
            number = i + 1;
        } else if ((destinationX == pairs[i][2] && destinationY == pairs[i][3]) || (destinationX == pairs[i][0] && destinationY == pairs[i][1])) {
            number = i + 1;
        }
    }

    if (sourceX == destinationX) {
        if (sourceY > destinationY) {
            big = sourceY;
            small = destinationY;
        } else {
            big = destinationY;
            small = sourceY;
        }
        for (i = small + 1; i < big; i++) {
            if (temp[sourceX][i] != 0 && temp[sourceX][i] != number) {
                printf("\nGecersiz Hamle! Lutfen cizilecek yol uzerinde baska sayilar olmadigindan emin olunuz.");
                return;
            }
        }
        for (i = small; i <= big; i++) {
            if (undo == 1) {
                board[sourceX][i] = 0;
            } else if (board[sourceX][i] == 0 || board[sourceX][i] == number) {
                board[sourceX][i] = number;
            }
        }
    } else if (sourceY == destinationY) {
        if (sourceX > destinationX) {
            big = sourceX;
            small = destinationX;
        } else {
            big = destinationX;
            small = sourceX;
        }
        for (i = small + 1; i < big; i++) {
            if (temp[i][sourceY] != 0 && temp[i][sourceY] != number) {
                printf("\nGecersiz Hamle! Lutfen cizilecek yol uzerinde baska sayilar olmadigindan emin olunuz.");
                return;
            }
        }
        for (i = small; i <= big; i++) {
            if (undo == 1) {
                board[i][sourceY] = 0;
            } else if (board[i][sourceY] == 0 || board[i][sourceY] == number) {
                board[i][sourceY] = number;
            }
        }
    }
}
/* Oyun alanını ekrana çizer. */
void drawBoard(int **pairs, int **board, int N) {
    int i, j, k, found;
    printf("\n\n   ");
    for (j = 0; j < N; j++) {
        if (j == 0)
            printf("     %2d      ", j);
        else
            printf("     %2d      ", j);
    }
    for (i = 0; i < N; i++) {
        printf("\n");
        for (k = 0; k < N; k++)
            if (k == 0)
                printf("   -------------");
            else
                printf("-------------");
        printf("\n");
        printf("%2d ", i);
        for (j = 0; j < N; j++) {
            found = 0;
            for (k = 0; k < N; k++) {
                if (i == pairs[k][0] && j == pairs[k][1]) {
                    found = k + 1;
                    break;
                }
                if (i == pairs[k][2] && j == pairs[k][3]) {
                    found = k + 1;
                    break;
                }
            }
            if (found != 0) {
                if (j == 0) {
                    printf("|    %2d     |", found);
                } else {
                    printf("     %2d     |", found);
                }
            } else {
                if (board[i][j] != 0)
                    if (j == 0) {
                        printf("|    %2d     |", board[i][j]);
                    } else {
                        printf("     %2d     |", board[i][j]);
                    }
                else {
                    if (j == 0) {
                        printf("|           |", board[i][j]);
                    } else {
                        printf("            |", board[i][j]);
                    }
                }
            }
        }
    }
    printf("\n");
    for (k = 0; k < N; k++)
        if (k == 0)
            printf("   -------------");
        else
            printf("-------------");
}
/* Oyun alanında çizilen yolun geçerli olup olmadığını kontrol eder. */
int dfs(int **board, int N, int num, int x, int y, int x2, int y2, int absolutePath) {
    if (x < 0 || x >= N || y < 0 || y >= N || board[x][y] == -1) {
        return 0;
    }
    if (x == x2 && y == y2) {
        if (absolutePath == 1) {
            if (board[x][y] != num) {
                return 0;
            } else {
                return 1;
            }
        } else {
            return 1;
        }
    }
    if (absolutePath == 1) {
        if (board[x][y] != num) {
            return 0;
        }
    } else {
        if (board[x][y] != 0 && board[x][y] != num) {
            return 0;
        }
    }
    board[x][y] = -1;
    int up = dfs(board, N, num, x - 1, y, x2, y2, absolutePath);
    int down = dfs(board, N, num, x + 1, y, x2, y2, absolutePath);
    int left = dfs(board, N, num, x, y - 1, x2, y2, absolutePath);
    int right = dfs(board, N, num, x, y + 1, x2, y2, absolutePath);

    if (up == 1 || down == 1 || left == 1 || right == 1) {
        return 1;
    }
    return 0;
}
/* Manuel oyun alanının bulunduğu fonksiyon. */
int playSelf(int N, int **board, int **pairs, int gameStatus, int initialFlag, int *undoCount, int **history, int *gameLength) {
    int historyLength = 0, i, j, *succes = (int *)malloc(N * sizeof(int)), isFull, length;

    memset(succes, 0, N * sizeof(int));

    int **temp = (int **)malloc(N * sizeof(int *));
    for (i = 0; i < N; i++) {
        temp[i] = (int *)malloc(N * sizeof(int));
    }
    do {
        int backFlag = 0;

        if (gameLength > 0 && historyLength > 0) {
            printf("\nHamle geri almak icin 1, oyunu iptal etmek icin 2, devam etmek icin 0 giriniz: ");
            scanf("%d", &backFlag);
        }

        if (backFlag == 0) {
            printf("\nKaynak X: ");
            scanf("%d", &history[historyLength][0]);
            printf("\nKaynak Y: ");
            scanf("%d", &history[historyLength][1]);
            printf("\nHedef X: ");
            scanf("%d", &history[historyLength][2]);
            printf("\nHedef Y: ");
            scanf("%d", &history[historyLength][3]);

            drawGiven(pairs, board, N, history[historyLength][0], history[historyLength][1], history[historyLength][2], history[historyLength][3], 0);
            historyLength++;
            (*gameLength)++;

            for (i = 0; i < N; i++) {
                memcpy(temp[i], board[i], N * sizeof(int));
            }
            for (i = 0; i < N; i++) {
                if (succes[i] == 0) {
                    if (dfs(temp, N, i + 1, pairs[i][0], pairs[i][1], pairs[i][2], pairs[i][3], 1) == 1) {
                        succes[i] = 1;
                        printf("\n%d Cifti Eslestirildi!\n", i + 1);
                    }
                }
            }

        } else if (backFlag == 1) {
            historyLength--;
            (*undoCount)++;
            (*gameLength)++;
            drawGiven(pairs, board, N, history[historyLength][0], history[historyLength][1], history[historyLength][2], history[historyLength][3], 1);
            for (i = 0; i < N; i++) {
                memcpy(temp[i], board[i], N * sizeof(int));
            }
            for (i = 0; i < N; i++) {
                if (succes[i] == 1) {
                    if (dfs(temp, N, i + 1, pairs[i][0], pairs[i][1], pairs[i][2], pairs[i][3], 1) == 0) {
                        succes[i] = 0;
                        printf("\n%d Cifti Eslestirilmesi Geri Alindi!\n", i + 1);
                    }
                }
            }
        } else if (backFlag == 2) {
            return 0;
        }

        drawBoard(pairs, board, N);

        isFull = 1;
        length = 0;
        for (i = 0; i < N; i++)
            for (j = 0; j < N; j++)
                if (board[i][j] == 0)
                    isFull = 0;
        for (i = 0; i < N; i++) {
            if (succes[i] == 1)
                length += 1;
        }

        if (length == N && isFull == 1) {
            printf("\nOyunun sonucu : Kazandiniz!");
            initialFlag = 0;
            gameStatus = 1;
            return gameStatus;
        }
    } while (gameStatus == -1);
}
/* Oyunun skorunu hesaplayan fonksiyon. */
int calculateScore(double time, int isRandom, int isManuel, int undoCount, int matrisLength) {
    int score = matrisLength * 1000;
    printf("\n\n\nBaslangic skoru (N * 1000): %d", score);
    if (isRandom == 1) {
        score = score + matrisLength * 500;
        printf("\nRandom modda oynadiginiz icin skorunuz 1.5 katina cikarildi: %d", score);
    }
    if (isManuel == 1) {
        score = score + matrisLength * 200;
        printf("\nManuel modda oynadiginiz icin skorunuz 1.2 katina cikarildi: %d", score);
    } else {
        score = score - matrisLength * 200;
        printf("\nOtomatik modda oynadiginiz icin skorunuz 0.8 katina dusuruldu: %d", score);
    }
    if (undoCount > 0 && isManuel == 1) {
        score = score - (undoCount * 25);
        printf("\n%d adet geri almanizdan dolayi skorunuzdan (25 * %d) puan dusuruldu: %d", undoCount, undoCount, score);
    } else if (undoCount > 0) {
        score = score - (undoCount * 2);
        printf("\n%d adet geri almanizdan dolayi skorunuzdan (2 * %d) puan dusuruldu: %d", undoCount, undoCount, score);
    }
    if (time > 0 && isManuel == 1) {
        int roundTime = round(time);
        score = score - (roundTime * 5);
        printf("\n%f saniye surenizden dolayi skorunuzdan (5 * %d) puan dusuruldu: %d", time, roundTime, score);
    } else if (time >= 0) {
        int roundTime = round(time);
        score = score - (roundTime * 10);
        printf("\n%f saniye surenizden dolayi skorunuzdan (10 * %d) puan dusuruldu: %d", time, roundTime, score);
    }
    printf("\n\n");
    return score;
}
/* Konumun oyun alanına çıkıp çıkmadığını kontrol eder */
int isValid(int x, int y, int N) {
    return x >= 0 && x < N && y >= 0 && y < N;
}
/* Oyunun otomatik olarak oynandığı fonksiyon. */
int playAuto(int **board, int **pairs, int n, int pairIndex, int x, int y, int *undoCount, int **history, int *gameLength, int *pairLengths) {
    int i;
    if (pairIndex == n) {
        return 1;
    }
    if (pairLengths[pairIndex] >= n * n / 2) {
        return 0;
    }

    int endX = pairs[pairIndex][2];
    int endY = pairs[pairIndex][3];

    if (x == endX && y == endY) {
        if (pairIndex + 1 < n) {
            return playAuto(board, pairs, n, pairIndex + 1, pairs[pairIndex + 1][0], pairs[pairIndex + 1][1], undoCount, history, gameLength, pairLengths);
        } else {
            return 1;
        }
    }

    int directions[4][2] = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
    for (i = 0; i < 4; i++) {
        int newX = x + directions[i][0];
        int newY = y + directions[i][1];

        if (isValid(newX, newY, n) && (board[newX][newY] == 0 || (newX == endX && newY == endY))) {
            board[newX][newY] = pairIndex + 1;
            pairLengths[pairIndex]++;
            if (n <= 5) {
                history[*gameLength][0] = newX;
                history[*gameLength][1] = newY;
                history[*gameLength][2] = pairIndex + 1;
                (*gameLength)++;
            }
            if (playAuto(board, pairs, n, pairIndex, newX, newY, undoCount, history, gameLength, pairLengths)) {
                return 1;
            }
            board[newX][newY] = 0;
            pairLengths[pairIndex]--;
            if (n <= 5) {
                history[*gameLength][0] = newX;
                history[*gameLength][1] = newY;
                history[*gameLength][2] = 0;
                (*gameLength)++;
            }
            (*undoCount)++;
        }
    }
    return 0;
}
