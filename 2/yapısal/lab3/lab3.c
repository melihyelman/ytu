#include <stdio.h>
#define MAX 10
void getMatrix(int n, int matrix[MAX][MAX]);
void drawMatrix(int n, int matrix[MAX][MAX]);
int dfs(int n, int count, int row, int col, int routes[MAX * 2][2], int matrix[MAX][MAX]);
void drawRoute(int count, int routes[MAX * 2][2]);

int main() {
    int n, matrix[MAX][MAX], routes[MAX * 2][2], result;

    printf("\nN: ");
    scanf("%d", &n);

    getMatrix(n, matrix);
    drawMatrix(n, matrix);

    result = dfs(n, 0, 0, 0, routes, matrix);
    printf("\n%d tane yol bulundu.\n", result);

    return 0;
}
void getMatrix(int n, int matrix[MAX][MAX]) {
    int i, j;
    printf("Matris elemanlarini giriniz:\n");
    for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
            printf("[%d][%d]: ", i, j);
            scanf("%d", &matrix[i][j]);
        }
    }
}
void drawMatrix(int n, int matrix[MAX][MAX]) {
    int i, j;
    printf("Matris:\n");
    for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
            printf("%d ", matrix[i][j]);
        }
        printf("\n");
    }
}
int dfs(int n, int count, int row, int col, int routes[MAX * 2][2], int matrix[MAX][MAX]) {
    if (matrix[row][col] == 0) {
        return 0;
    }

    if (row == n - 1 && col == n - 1) {
        drawRoute(count, routes);
        return 1;
    }

    int right = 0, down = 0;
    if (col < n - 1) {
        routes[count][0] = row;
        routes[count][1] = col + 1;
        ;
        right = dfs(n, count + 1, row, col + 1, routes, matrix);
    }
    if (row < n - 1) {
        routes[count][0] = row + 1;
        routes[count][1] = col;
        down = dfs(n, count + 1, row + 1, col, routes, matrix);
    }
    return right + down;
}
void drawRoute(int count, int routes[MAX * 2][2]) {
    int i;
    printf("\n");
    for (i = 0; i < count; i++) {
        printf("(%d, %d) ", routes[i][0], routes[i][1]);
    }
    printf("\n");
}
