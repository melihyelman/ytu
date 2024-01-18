#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>

typedef struct
{
    char userName[100];
    char name[100];
    char surname[100];
    char password[100];
} User;

typedef struct {
    int startX;
    int startY;
    int currentX;
    int currentY;
    int score;
    double time;
    char **elements;
    int elementsSize;
    int elementsCapacity;
} GameData;

typedef struct {
    char userName[100];
    int score;
    double time;
} Score;

typedef struct {
    int x;
    int y;
} Move;

typedef struct {
    Move *moves;
    int size;
    int capacity;
} MoveList;

void addElement(GameData *gameData, char element);
int nextMove(char ***playground, int n, int m, GameData *gameData, char movement);
int checkMovement(char ***playground, int n, int m, char movement, GameData *gameData);
GameData *getStartPosition(char ***playground, int n, int m);
void getExistPosition(char ***playground, int n, int m, int *position);
void printPlayground(char ***playground, int n, int m);
void playWithManuel(User *user, char ***playground, int n, int m);
char ***readPlaygroundFromFile(char *fileName, int *n, int *m);
int createNewPlaygroundFile(char ***playground, int n, int m);
User *isUserExist(char *fileName, User *newUser);
int createUser(char *fileName);
void loadPlaygroundMenu();
void initializeMoveList(MoveList *list);
void addMove(MoveList *list, int x, int y);
void deleteMove(MoveList *list);
void freeMoveList(MoveList *list);
int isValid(char ***playground, int x, int y, int n, int m);
int dfs(char ***playground, int n, int m, int x, int y, int endX, int endY, MoveList *moveList);
char calculateMovement(int prevX, int prevY, int currentX, int currentY);
void playWithAuto(User *user, char ***playground, int n, int m);
void startGameMenu(User *user);
void clearScreen();
int addScore(GameData *gameData, User *user);
int calculateScore(GameData *gameData, int antimatterCount);
int calculateAntimatterCount(GameData *gameData);
void listTopFiveScores();

void addElement(GameData *gameData, char element) {
    if (gameData->elementsSize == gameData->elementsCapacity) {
        // Kapasiteyi artır
        gameData->elementsCapacity = (gameData->elementsCapacity == 0) ? 1 : gameData->elementsCapacity * 2;
        gameData->elements = realloc(gameData->elements, gameData->elementsCapacity * sizeof(char *));
        if (!gameData->elements) {
            printf("Bellek tahsis edilemedi!\n");
            return;
        }
    }

    // Bellek tahsis et
    gameData->elements[gameData->elementsSize] = (char *)malloc(sizeof(char));
    if (!gameData->elements[gameData->elementsSize]) {
        printf("Bellek tahsis edilemedi!\n");
        return;
    }

    // Veriyi kopyala
    gameData->elements[gameData->elementsSize][0] = element;
    gameData->elementsSize++;
}

int nextMove(char ***playground, int n, int m, GameData *gameData, char movement) {
    int nextX = gameData->currentX;
    int nextY = gameData->currentY;

    if (movement == 'w') {  // w
        nextX--;
    } else if (movement == 's') {  // s
        nextX++;
    } else if (movement == 'a') {  // a
        nextY--;
    } else if (movement == 'd') {  // d
        nextY++;
    };

    playground[gameData->currentX][gameData->currentY][0] = '0';

    if (gameData->currentX == gameData->startX && gameData->currentY == gameData->startY) {
        playground[gameData->startX][gameData->startY][0] = 'G';
    }

    if (playground[nextX][nextY][0] == 'K' || playground[nextX][nextY][0] == 'k') {
        playground[nextX][nextY][0] = 'X';
        return 0;
    } else if (playground[nextX][nextY][0] == 'C' || playground[nextX][nextY][0] == 'c') {
        playground[nextX][nextY][0] = 'X';
        return 1;
    } else if (playground[nextX][nextY][0] != '0' && playground[nextX][nextY][0] != 'G') {
        addElement(gameData, playground[nextX][nextY][0]);
    }
    playground[nextX][nextY][0] = 'X';

    gameData->currentX = nextX;
    gameData->currentY = nextY;
    return 2;
}

int checkMovement(char ***playground, int n, int m, char movement, GameData *gameData) {
    int nextX = gameData->currentX;
    int nextY = gameData->currentY;

    if (movement == 'w') {  // w
        nextX--;
    } else if (movement == 's') {  // s
        nextX++;
    } else if (movement == 'a') {  // a
        nextY--;
    } else if (movement == 'd') {  // d
        nextY++;
    } else if (movement == 'q') {  // q
        return 0;                  // Quit
    } else {
        return 0;
    }

    if (nextX < 0 || nextX >= n || nextY < 0 || nextY >= m || playground[nextX][nextY][0] == '1') {
        return 0;
    }

    return 1;
}

GameData *getStartPosition(char ***playground, int n, int m) {
    int i, j;
    GameData *gameData = (GameData *)malloc(sizeof(GameData));
    if (gameData == NULL) {
        printf("Bellek tahsis etme hatasi!");
        return NULL;
    }
    for (i = 0; i < n; i++) {
        for (j = 0; j < m; j++) {
            if (playground[i][j][0] == 'X' || playground[i][j][0] == 'x') {
                gameData->currentX = i;
                gameData->currentY = j;
                gameData->startX = i;
                gameData->startY = j;
            }
        }
    }
    return gameData;
}

void getExistPosition(char ***playground, int n, int m, int *position) {
    int i, j;
    for (i = 0; i < n; i++) {
        for (j = 0; j < m; j++) {
            if (playground[i][j][0] == 'c' || playground[i][j][0] == 'C') {
                position[0] = i;
                position[1] = j;
            }
        }
    }
}

void printPlayground(char ***playground, int n, int m) {
    int i, j;
    printf("\n");

    for (i = 0; i < n; i++) {
        for (j = 0; j < m; j++) {
            if (j + 1 == m) {
                printf("%c", playground[i][j][0]);
            } else {
                printf("%c   ", playground[i][j][0]);
            }
        }
        if (i + 1 != n) {
            printf("\n\n");
        }
    }
    printf("\n");
}

void printElements(GameData *gameData) {
    int i;
    printf("\nToplanan atom alti parcaciklar: \n");
    for (i = 0; i < gameData->elementsSize; i++) {
        if (gameData->elements[i][0] == 'p') {
            printf("P- ");
        } else if (gameData->elements[i][0] == 'P') {
            printf("P+ ");
        } else if (gameData->elements[i][0] == 'e') {
            printf("E- ");
        } else if (gameData->elements[i][0] == 'E') {
            printf("E+ ");
        }
    }
    printf("\n");
}

void listTopFiveScores() {
    FILE *fp = fopen("scores.txt", "r");
    if (fp == NULL) {
        printf("Dosya okuma hatasi!");
        return;
    }

    int scoreCount = 0;

    while (!feof(fp)) {
        char c = fgetc(fp);
        if (c == '\n') {
            scoreCount++;
        }
    }

    // Dosyayı tekrar başa alalım
    rewind(fp);

    Score *scores = (Score *)malloc(scoreCount * sizeof(Score));
    int i, j;
    for (i = 0; i < scoreCount; i++) {
        if (fscanf(fp, "%s %d %lf", scores[i].userName, &scores[i].score, &scores[i].time) != 3) {
            printf("Skor okuma hatasi!\n");
            free(scores);
            fclose(fp);
            return;
        }
    }
    fclose(fp);

    for (i = 0; i < scoreCount - 1; i++) {
        for (j = 0; j < scoreCount - i - 1; j++) {
            if (scores[j].score < scores[j + 1].score) {
                Score temp = scores[j];
                scores[j] = scores[j + 1];
                scores[j + 1] = temp;
            }
        }
    }
    int displayCount = scoreCount < 5 ? scoreCount : 5;
    printf("Sira\tUsername\tScore\tTime\n");
    for (i = 0; i < displayCount; i++) {
        printf("%d\t%s\t\t%d\t%lf\n", i + 1, scores[i].userName, scores[i].score, scores[i].time);
    }
    sleep(5);
    free(scores);
}

void playWithManuel(User *user, char ***playground, int n, int m) {
    GameData *gameData = getStartPosition(playground, n, m);
    if (gameData == NULL) return;
    time_t start, end;
    char movement;
    time(&start);
    do {
        printElements(gameData);
        printPlayground(playground, n, m);
        printf("\nBir sonraki hamle: ");
        scanf(" %c", &movement);
        time(&end);
        double time = difftime(end, start);

        if (!checkMovement(playground, n, m, movement, gameData)) {
            printf("Gecersiz hamle!\n");
        } else {
            int status = nextMove(playground, n, m, gameData, movement);
            if (status == 0) {
                system("clear");
                printf("Karadelige girip kaybettiniz!\n");
                printPlayground(playground, n, m);
                movement = 'q';
                sleep(5);
            } else if (status == 1) {
                system("clear");
                gameData->time = time;
                int antimatterCount = calculateAntimatterCount(gameData);
                gameData->score = calculateScore(gameData, antimatterCount);
                addScore(gameData, user);
                printf("Tebrikler cikisa ulastiniz!\n");
                printf("%d adet karsit madde üretildi!\n", antimatterCount);
                printPlayground(playground, n, m);
                movement = 'q';
                sleep(5);
            }
        }
        system("clear");
    } while (movement != 'q');
    free(gameData);
}

char ***readPlaygroundFromFile(char *fileName, int *n, int *m) {
    FILE *fp;
    int i, j, k, l;

    fp = fopen(fileName, "r");

    if (fp == NULL) {
        return NULL;
    }

    if (fscanf(fp, "%d %d", n, m) != 2) {
        fclose(fp);
        return NULL;
    }

    char ***playground = (char ***)malloc(*n * sizeof(char **));
    for (i = 0; i < *n; i++) {
        playground[i] = (char **)malloc(*m * sizeof(char *));
        for (j = 0; j < *m; j++) {
            playground[i][j] = (char *)malloc(sizeof(char));
        }
    }

    for (i = 0; i < *n; i++) {
        for (j = 0; j < *m; j++) {
            // Eğer satır sona ermediyse, bir sonraki elemanın okunması için bir boşluk bırakılır
            if (fscanf(fp, " %c", &playground[i][j][0]) != 1) {
                fclose(fp);

                // Belleği serbest bırak
                for (k = 0; k < i; k++) {
                    for (l = 0; l < *m; l++) {
                        free(playground[k][l]);
                    }
                    free(playground[k]);
                }
                free(playground);

                return NULL;
            }
        }
    }

    fclose(fp);
    return playground;
}

int createNewPlaygroundFile(char ***playground, int n, int m) {
    FILE *fp;
    char fileName[100];
    int i, j;
    printf("Dosya adini giriniz (uzantisiyla birlikte): ");
    scanf("%99s", fileName);
    fp = fopen(fileName, "w");

    if (fp == NULL) {
        return 0;
    }

    fprintf(fp, "%d %d\n", n, m);

    for (i = 0; i < n; i++) {
        for (j = 0; j < m; j++) {
            if (j + 1 == m) {
                fprintf(fp, "%c", playground[i][j][0]);
            } else {
                fprintf(fp, "%c ", playground[i][j][0]);
            }
        }
        if (i + 1 != n) {
            fprintf(fp, "\n");
        }
    }

    fclose(fp);
    return 1;
}

int calculateAntimatterCount(GameData *gameData) {
    int *elements = (int *)malloc(4 * sizeof(int));
    int i;
    for (i = 0; i < 4; i++) {
        elements[i] = 0;
    };
    for (i = 0; i < gameData->elementsSize; i++) {
        if (gameData->elements[i][0] == 'p') {
            elements[0]++;
        } else if (gameData->elements[i][0] == 'P') {
            elements[1]++;
        } else if (gameData->elements[i][0] == 'e') {
            elements[2]++;
        } else if (gameData->elements[i][0] == 'E') {
            elements[3]++;
        }
    }

    int minPCount = elements[0] < elements[1] ? elements[0] : elements[1];
    int minECount = elements[2] < elements[3] ? elements[2] : elements[3];

    elements[0] = elements[0] - minPCount < 0 ? 0 : elements[0] - minPCount;
    elements[1] = elements[1] - minPCount < 0 ? 0 : elements[1] - minPCount;
    elements[2] = elements[2] - minECount < 0 ? 0 : elements[2] - minECount;
    elements[3] = elements[3] - minECount < 0 ? 0 : elements[3] - minECount;
    return elements[0] < elements[3] ? elements[0] : elements[3];
}

int calculateScore(GameData *gameData, int antimatterCount) {
    int score = 0;
    score += antimatterCount * 10;

    if (gameData->time > 0 && gameData->time < 30) {
        score += 20;
    } else if (gameData->time < 60) {
        score += 15;
    } else if (gameData->time < 90) {
        score += 10;
    } else if (gameData->time < 120) {
        score += 5;
    }

    return score;
}

int addScore(GameData *gameData, User *user) {
    FILE *fp = fopen("scores.txt", "a");

    if (fp == NULL) {
        printf("Dosya acilma hatasi!\n");
        return 0;
    }
    if (fprintf(fp, "%s %d %lf\n", user->userName, gameData->score, gameData->time) < 0) {
        printf("Dosya yazilma hatasi!\n");
        fclose(fp);
        return 0;
    } else {
        printf("Bilgiler basariyla kaydedildi!\n");
    }
    fclose(fp);
    return 1;
}

User *isUserExist(char *fileName, User *newUser) {
    FILE *fp;
    fp = fopen(fileName, "rb");

    User *data = (User *)malloc(sizeof(User));

    while (fread(data, sizeof(User), 1, fp) == 1) {
        if (strcasecmp(data->userName, newUser->userName) == 0) {
            fclose(fp);
            return data;
        }
    }

    fclose(fp);
    return 0;
}

int createUser(char *fileName) {
    FILE *fp = fopen(fileName, "ab");

    User *newUser = (User *)malloc(sizeof(User));
    printf("Kullanici Adiniz: ");
    scanf("%s", newUser->userName);

    if (fp == NULL) {
        printf("Dosya acilma hatasi!");
        return 0;
    }

    if (!isUserExist(fileName, newUser)) {
        printf("Adiniz: ");
        scanf("%s", newUser->name);
        printf("Soyadiniz: ");
        scanf("%s", newUser->surname);
        printf("Parolaniz: ");
        scanf("%s", newUser->password);

        if (fwrite(newUser, sizeof(User), 1, fp) != 1) {
            fclose(fp);
            free(newUser);
            printf("Kullanici kaydedilirken bir hata olustu!\n");
            return 0;
        } else {
            printf("Kullanici basariyla olusturuldu.\n");
        }
        free(newUser);
        fclose(fp);
        return 1;
    } else {
        printf("Bu kullanici adi zaten var. Baska bir kullanici adi deneyin.\n");
        free(newUser);
        fclose(fp);
        return 0;
    }
    free(newUser);
    fclose(fp);
    return 1;
}

void loadPlaygroundMenu() {
    int n, m, i, j;
    printf("\nSatir sayisi giriniz: ");
    scanf("%d", &n);
    printf("\nSütün sayisi giriniz: ");
    scanf("%d", &m);
    char ***playground = (char ***)malloc(n * sizeof(char **));

    for (i = 0; i < n; i++) {
        playground[i] = (char **)malloc(m * sizeof(char *));

        printf("%d. satiri giriniz: ", i + 1);

        for (j = 0; j < m; j++) {
            playground[i][j] = (char *)malloc(sizeof(char));
            scanf(" %c", &playground[i][j][0]);
        }
    }
    if (createNewPlaygroundFile(playground, n, m) == 0) {
        printf("Dosya olusturulamadi!\n");
    } else {
        printf("Dosya olusturuldu!\n");
    }

    for (i = 0; i < n; i++) {
        if (playground[i] != NULL) {
            for (j = 0; j < m; j++) {
                free(playground[i][j]);
            }
            free(playground[i]);
        }
    }

    free(playground);
}

void initializeMoveList(MoveList *list) {
    list->moves = NULL;
    list->size = 0;
    list->capacity = 0;
}

void addMove(MoveList *list, int x, int y) {
    if (list->size == list->capacity) {
        // Kapasiteyi artır
        list->capacity = (list->capacity == 0) ? 1 : list->capacity * 2;
        list->moves = realloc(list->moves, list->capacity * sizeof(Move));
        if (!list->moves) {
            printf("Bellek tahsis edilemedi!\n");
        }
    }

    list->moves[list->size].x = x;
    list->moves[list->size].y = y;
    list->size++;
}

void deleteMove(MoveList *list) {
    if (list->size > 0) {
        list->size--;
    }
}

void freeMoveList(MoveList *list) {
    free(list->moves);
    list->moves = NULL;
    list->size = 0;
    list->capacity = 0;
}

int isValid(char ***playground, int x, int y, int n, int m) {
    if (x < 0 || x >= n || y < 0 || y >= m || playground[x][y][0] == '1' || playground[x][y][0] == 'k' || playground[x][y][0] == 'K' || playground[x][y][0] == 'X') {
        return 0;
    }
    return 1;
}

int dfs(char ***playground, int n, int m, int x, int y, int endX, int endY, MoveList *moveList) {
    int i;
    if (x == endX && y == endY) return 1;

    int directions[4][2] = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
    for (i = 0; i < 4; i++) {
        int newX = x + directions[i][0];
        int newY = y + directions[i][1];

        if (isValid(playground, newX, newY, n, m)) {
            char oldValue = playground[newX][newY][0];

            playground[newX][newY][0] = 'X';
            addMove(moveList, newX, newY);

            if (dfs(playground, n, m, newX, newY, endX, endY, moveList)) {
                return 1;
            }

            playground[newX][newY][0] = oldValue;
            deleteMove(moveList);
        }
    }
    return 0;
}

char calculateMovement(int prevX, int prevY, int currentX, int currentY) {
    if (prevX == currentX + 1) {
        return 'w';  // Up
    } else if (prevX == currentX - 1) {
        return 's';  // Down
    } else if (prevY == currentY + 1) {
        return 'a';  // Left
    } else if (prevY == currentY - 1) {
        return 'd';  // Right
    } else {
        return '0';  // No movement or invalid
    }
}

void playWithAuto(User *user, char ***playground, int n, int m) {
    MoveList moveList;
    int i, j;

    char ***copyPlayground = (char ***)malloc(n * sizeof(char **));

    for (i = 0; i < n; i++) {
        copyPlayground[i] = (char **)malloc(m * sizeof(char *));
        for (j = 0; j < m; j++) {
            copyPlayground[i][j] = (char *)malloc(sizeof(char));
            strcpy(copyPlayground[i][j], playground[i][j]);
        }
    }

    initializeMoveList(&moveList);
    int *position = (int *)malloc(2 * sizeof(int));
    GameData *gameData = getStartPosition(playground, n, m);
    getExistPosition(playground, n, m, position);
    int status = dfs(copyPlayground, n, m, gameData->startX, gameData->startY, position[0], position[1], &moveList);

    if (status) {
        char movement;
        int prevX = gameData->startX;
        int prevY = gameData->startY;
        int currentX = moveList.moves[0].x;
        int currentY = moveList.moves[0].y;

        for (i = 1; i <= moveList.size; i++) {
            sleep(1);
            system("clear");
            movement = calculateMovement(prevX, prevY, currentX, currentY);

            // Hareketi işle ve ekrana bastır
            nextMove(playground, n, m, gameData, movement);
            printElements(gameData);
            printPlayground(playground, n, m);
            prevX = moveList.moves[i - 1].x;
            prevY = moveList.moves[i - 1].y;
            currentX = moveList.moves[i].x;
            currentY = moveList.moves[i].y;
        }
        int antimatterCount = calculateAntimatterCount(gameData);
        gameData->score = antimatterCount * 10;
        addScore(gameData, user);
        printf("Tebrikler cikisa ulastiniz!\n");
        printf("%d adet karsit madde üretildi!\n", antimatterCount);
        sleep(5);
    } else {
        printf("Oyun cozulemedi!\n");
    }
    // Belleği serbest bırak
    for (i = 0; i < n; i++) {
        if (copyPlayground[i] != NULL) {
            for (j = 0; j < m; j++) {
                free(copyPlayground[i][j]);
            }
            free(copyPlayground[i]);
        }
    }
    free(position);
    free(gameData);
    free(copyPlayground);
    freeMoveList(&moveList);
}

void startGameMenu(User *user) {
    int n, m, i, j;
    char fileName[100];
    clearScreen();
    printf("Dosya adini giriniz (uzantisiyla birlikte): ");
    scanf("%99s", fileName);

    int gameOption = 0;
    do {
        char ***playground = readPlaygroundFromFile(fileName, &n, &m);
        if (playground != NULL) {
            clearScreen();
            printf("\nManuel Mod: 1\nOtomatik Mod: 2\nBir Ust Menü: 3\nSecenek: ");
            scanf("%d", &gameOption);

            if (gameOption == 1) {
                clearScreen();
                playWithManuel(user, playground, n, m);
            } else if (gameOption == 2) {
                playWithAuto(user, playground, n, m);
            } else if (gameOption != 3) {
                printf("Hatali secim!\n");
            }
            for (i = 0; i < n; i++) {
                for (j = 0; j < m; j++) {
                    free(playground[i][j]);
                }
                free(playground[i]);
            }
            free(playground);
        } else {
            clearScreen();
            gameOption = 3;
            printf("Dosya acilamadi veya dosya formati hatali!\n");
        }
    } while (gameOption != 3);
}

void clearScreen() {
    printf("\nEkran temizleniyor...\n");
    sleep(1);
    system("clear");
}

void howToPlay() {
    printf("Nasil Oynanir?\nOyunun amaci yon tuslari ile 4 yone ilerleyerek cikisa ulasmaktir!\nCikisa ulasirken yol uzerinde element toplayabilirisiniz!\nBu elementlerin karsit olanlari birbirini yok etmektedir!\nCikisa ulastiktan sonra elde ettiğiniz elementlerden P- ve e+ elementleri birleşerek karsit madde üretilir!\nYol üzerinde 1 rakami duvari, K harfi ise karadeligi temsil etmektedir!\nDuvarlardan gecemezsiniz, oyun alaninin kenarlarindan disari cikamazsiniz ve karadelige girerseniz oyun biter!\nESC tusuna basilirsa oyundan cikilir!\n3 dakika icinde oyunu bitiremezsiniz oyun sonlanir!\nHer ürettiginiz karsit hidrojen 10 puan degerindedir\nOyunun bitis süresi; 30 saniye 20 puan, 30-60 saniye arasi 15 puan, 60-90 arasi 10 puan, 90-120 arasi 5 puan ekstra puan kazanirsiniz!\nOtomatik oyun modunda ekstra puan kazanamazsiniz!\n\n\nYeni oyun alani olusturma\nIlk adim olarak satir ve sutun sayisini girmelisiniz!\nDaha sonra her satir degerinin icerigini aralarinda bir bosluk olacak sekilde girmelisiniz!\nBaslangic konumunu X olarak girmelisiniz!\nElementler harici girislerde büyük kücük harf duyarliligi yoktur!");
}

int main() {
    int flag = 0;
    do {
        clearScreen();
        printf("\nHesap Olustur: 1\nGiris Yap: 2\nSecenek: ");
        scanf("%d", &flag);
        if (flag == 1) {
            clearScreen();
            createUser("users.bin");
        } else if (flag == 2) {
            clearScreen();
            User *temp = (User *)malloc(sizeof(User));
            printf("Kullanici Adiniz: ");
            scanf("%s", temp->userName);
            printf("Sifreniz: ");
            scanf("%s", temp->password);
            User *user = isUserExist("users.bin", temp);
            if (user) {
                if (strcmp(user->password, temp->password) != 0) {
                    free(temp);
                    free(user);
                    printf("Hatali sifre girdiniz!\n");
                    clearScreen();
                } else {
                    int initialFlag = 0;
                    do {
                        clearScreen();
                        printf("\nMerhaba %s, iyi oyunlar!\n", user->userName);
                        printf("\nEn Yuksek 5 Skor: 1\nNasil Oynanir: 2\nHarita Yükle: 3\nOyuna Basla: 4\nBir Ust Menü: 5\nSecenek: ");
                        scanf("%d", &initialFlag);
                        if (initialFlag == 1) {
                            clearScreen();
                            listTopFiveScores();
                        } else if (initialFlag == 2) {
                            clearScreen();
                            howToPlay();
                            sleep(15);
                        } else if (initialFlag == 3) {
                            clearScreen();
                            loadPlaygroundMenu();
                        } else if (initialFlag == 4) {
                            startGameMenu(user);
                        } else if (initialFlag != 5) {
                            printf("Hatali secim!\n");
                        }
                    } while (initialFlag != 5);
                }
                free(user);
            } else {
                printf("Böyle bir kullanici adi bulunamadi!\n");
            }
        } else if (flag != 3) {
            printf("Hatali giris yaptiniz!\n");
        }
    } while (flag != 3);

    return 0;
}