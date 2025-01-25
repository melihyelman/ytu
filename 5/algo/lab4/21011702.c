#include <stdio.h>
#include <stdlib.h>
#include <time.h>

void swap(int* a, int* b){
    int temp = *a;
    *a = *b;
    *b = temp;
}

void printBoard(int** board, int N) {
    int i, j;
    for(i = 0; i < N; i++){
        for(j = 0; j < N; j++){
            printf("%c ", board[i][j] ? 'Q' : '-');
        }
        printf("\n");
    }
    printf("\n");
}

void resetBoard(int** board, int N){
    int i, j;
    for(i = 0; i < N; i++){
        for(j = 0; j < N; j++){
            board[i][j] = 0;
        }
    }
}

void freeArray(int* arr){
    free(arr);
}

void freeBoard(int** board, int N){
    int i;
    for(i = 0; i < N; i++){
        freeArray(board[i]);
    }
    free(board);
}

/*
@brief Check if the board is valid for the N-Queens problem

@param board pointer to the board, N size of the board,

@return 1 if the board is valid, 0 otherwise
*/
int checkBoard(int** board, int N) {
    int* rowPositions = (int*)malloc(N * N * sizeof(int));
    int* colPositions = (int*)malloc(N * N * sizeof(int));
    int queenCount = 0, i, j, k, m;
    
    for(i = 0; i < N; i++){
        for(j = 0; j < N; j++){
            if(board[i][j] == 1){
                rowPositions[queenCount] = i;
                colPositions[queenCount] = j;
                queenCount++;
            }
        }
    }
    if(queenCount != N) { // queens count should be N
        freeArray(rowPositions); freeArray(colPositions);
        return 0;
    }
    
    for(k = 0; k < queenCount; k++){
        for(m = k + 1; m < queenCount; m++){
            if(rowPositions[k] == rowPositions[m]){ // same row?
                freeArray(rowPositions); freeArray(colPositions);
                return 0;
            }
            if(colPositions[k] == colPositions[m]){ // same column?
                freeArray(rowPositions); freeArray(colPositions);
                return 0;
            }
            if(abs(rowPositions[k] - rowPositions[m]) == // same diagonal?
               abs(colPositions[k] - colPositions[m])){
                freeArray(rowPositions); freeArray(colPositions);
                return 0;
            }
        }
    }
    
    freeArray(rowPositions); freeArray(colPositions);
    return 1;
}

/*
@brief Solve the N-Queens problem using brute force to try all possible configurations

@param board pointer to the board, N size of the board,
       row current row, col current column, placed number of queens placed,
       solutionCount pointer to the count of solutions

@return void
*/
void bruteForceAll(int** board, int N, int row, int col, int* solutionCount) {
    if(row == N){
        if(checkBoard(board, N)){
            (*solutionCount)++;
            printf("Cozum %d:\n", *solutionCount);
            printBoard(board, N);
        }
        return;
    }
    
    int nextRow = row;
    int nextCol = col + 1;
    if(nextCol == N){
        nextCol = 0;
        nextRow++;
    }

    board[row][col] = 0;
    bruteForceAll(board, N, nextRow, nextCol, solutionCount);
    
    board[row][col] = 1;
    bruteForceAll(board, N, nextRow, nextCol, solutionCount);
    
    board[row][col] = 0;
}

/*
@brief Solve the N-Queens problem by placing one queen in each row sequentially

@param board pointer to the board, N size of the board,
       row current row, solutionCount pointer to the count of solutions

@return void
*/
void optimized1(int** board, int N, int row, int* solutionCount) {
    if(row == N){
        if(checkBoard(board, N)){
            (*solutionCount)++;
            printf("Cozum %d:\n", *solutionCount);
            printBoard(board, N);
        }
        return;
    }
    int col;
    
    // each row has exactly one queen
    for(col = 0; col < N; col++){
        board[row][col] = 1;         
        optimized1(board, N, row + 1, solutionCount); 
        board[row][col] = 0;         
    }
}

/*
@brief Solve the N-Queens problem using permutations of columns for each row

@param board pointer to the board, arr array of column indices,
       start start index for permutation, end end index for permutation, N size of the board,
       solutionCount pointer to the count of solutions

@return void
*/
void optimized2(int** board, int* arr, int start, int end, int N, int* solutionCount) {
    int i;
    if(start == end){
        resetBoard(board, N);

        // arr[i] column index for row i
        for(i = 0; i < N; i++){
            board[i][arr[i]] = 1;
        }

        if(checkBoard(board, N)){
            (*solutionCount)++;
            printf("Cozum %d:\n", *solutionCount);
            printBoard(board, N);
        }
        return;
    }
    
    // Create all permutations of the columns
    for(i = start; i <= end; i++){
        swap(&arr[start], &arr[i]); 
        optimized2(board, arr, start + 1, end, N, solutionCount);
        swap(&arr[start], &arr[i]); // 
    }
}

/*
@brief Check if placing a queen at a position is safe in the current board

@param board pointer to the board, N size of the board,
       row row index, col column index

@return 1 if safe, 0 otherwise
*/
int isSafeToBack(int** board, int N, int row, int col) {
    int i;
    for(i = 0; i < row; i++){
        int diff = row - i;
        if( board[i][col]                                   // same column
            || (col - diff >= 0 && board[i][col - diff])    // left upper diagonal
            || (col + diff <  N && board[i][col + diff])) { // right upper diagonal
            return 0;                                       // not safe
        }
    }
    return 1;
}

/*
@brief Solve the N-Queens problem using backtracking with immediate safety checks

@param board pointer to the board, N size of the board,
       row current row, solutionCount pointer to the count of solutions

@return void
*/
void backTracking(int** board, int N, int row, int* solutionCount) {
    if(row == N){
        (*solutionCount)++;
        printf("Cozum %d:\n", *solutionCount);
        printBoard(board, N);
        return;
    }
    int col; 
    for(col = 0; col < N; col++){
        if(isSafeToBack(board, N, row, col)){
            board[row][col] = 1;
            backTracking(board, N, row + 1, solutionCount);
            board[row][col] = 0;
        }
    }
}

int main() {
    int N, mode;
    printf("n-Queen problemi icin N degerini giriniz (ornegin 4 veya 8): ");
    scanf("%d", &N);
    
    int** board = (int**)malloc(N * sizeof(int*)), i;
    for(i = 0; i < N; i++) {
        board[i] = (int*)calloc(N, sizeof(int));
    }
    
    printf("\nCalistirilacak modu seciniz:\n");
    printf("1) BRUTE_FORCE MODU\n");
    printf("2) OPTIMIZED_1 MODU\n");
    printf("3) OPTIMIZED_2 MODU\n");
    printf("4) BACKTRACKING MODU\n");
    printf("5) TUM YAKLASIMLAR\n");
    printf("Seciminiz: ");
    scanf("%d", &mode);
    
    clock_t start, end;
    double time;
    int solutionCount = 0;
    double *allTimes = (double*)malloc(4 * sizeof(double));
    
    if(mode == 1 || mode == 5) {
        resetBoard(board, N);
        solutionCount = 0;
        
        printf("\nBRUTE_FORCE Basladi...\n");
        start = clock();
        bruteForceAll(board, N, 0, 0, &solutionCount);
        end = clock();
        
        time = ((double)(end - start)) / CLOCKS_PER_SEC;
        printf("BRUTE_FORCE Toplam %d cozum bulundu. Gecen sure: %.3f saniye\n\n", solutionCount, time);
        allTimes[0] = time;
    }
    
    if(mode == 2 || mode == 5) {
        resetBoard(board, N);
        solutionCount = 0;
        
        printf("\nOPTIMIZED_1 Basladi...\n");
        start = clock();
        optimized1(board, N, 0, &solutionCount);
        end = clock();
        
        time = ((double)(end - start)) / CLOCKS_PER_SEC;
        printf("OPTIMIZED_1 Toplam %d cozum bulundu. Gecen sure: %.3f saniye\n\n", solutionCount, time);
        allTimes[1] = time;
    }
    
    if(mode == 3 || mode == 5) {
        int* arr = (int*)malloc(N * sizeof(int));
        for(i = 0; i < N; i++){
            arr[i] = i;
        }
        
        resetBoard(board, N);
        solutionCount = 0;
        
        printf("\nOPTIMIZED_2 Basladi...\n");
        start = clock();
        optimized2(board, arr, 0, N - 1, N, &solutionCount);
        end = clock();
        
        time = ((double)(end - start)) / CLOCKS_PER_SEC;
        printf("OPTIMIZED_2 Toplam %d cozum bulundu. Gecen sure: %.3f saniye\n\n", solutionCount, time);
        allTimes[2] = time;
        
        freeArray(arr);
    }
    
    if(mode == 4 || mode == 5) {
        resetBoard(board, N);
        solutionCount = 0;
        
        printf("\nBACKTRACKING Basladi...\n");
        start = clock();
        backTracking(board, N, 0, &solutionCount);
        end = clock();
        
        time = ((double)(end - start)) / CLOCKS_PER_SEC;
        printf("BACKTRACKING Toplam %d cozum bulundu. Gecen sure: %.3f saniye\n\n", solutionCount, time);
        allTimes[3] = time;
    }

    if(mode == 5){
        printf("Modlarin calisma sureleri:\n");
        printf("1) BRUTE_FORCE: %.3f saniye\n", allTimes[0]);
        printf("2) OPTIMIZED_1: %.3f saniye\n", allTimes[1]);
        printf("3) OPTIMIZED_2: %.3f saniye\n", allTimes[2]);
        printf("4) BACKTRACKING: %.3f saniye\n", allTimes[3]);
    }
    
    freeBoard(board, N);
    
    return 0;
}
