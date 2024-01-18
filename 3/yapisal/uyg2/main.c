#include <stdio.h>
#include <stdlib.h>
#define NROW 16
#define NCOLUMN 2

float **initializeMatrix(int nRow, int nColumn)
{
    int i;
    float **mat;
    mat = (float **)malloc(nRow * sizeof(float *));
    if (mat == NULL)
    {
        printf("Bellek ayrilamadi\n");
        exit(-1);
    }
    for (i = 0; i < nRow; i++)
    {
        mat[i] = (float *)calloc(nColumn, sizeof(float));
        mat[i][0] = i + 3;
    }
    return mat;
}
void calculateProb(float **mat)
{
    int i, j, k, sum = 0;
    for (i = 1; i < 7; i++)
    {
        for (j = 1; j < 7; j++)
        {
            for (k = 1; k < 7; k++)
            {
                sum = i + j + k;
                mat[sum - 3][1] += (float)1 / (6 * 6 * 6);
            }
        }
    }
}
void printProb(float **mat, int nRow)
{
    int i;
    printf("Toplam\t\tolasilik degeri\n");
    for (i = 0; i < nRow; i++)
    {
        printf("%f\t\t%f\n", mat[i][0], mat[i][1]);
    }
}

void freeMat(float **mat, int nRow)
{
    int i;
    for(i = 0; i < nRow;i++) {
        free(mat[i]);
    }
    free(mat);
}

int main()
{
    float **mat;
    int nRow=NROW,nColumn=NCOLUMN;
    mat = initializeMatrix(nRow,nColumn);
    calculateProb(mat);
    printProb(mat,nRow);
    freeMat(mat,nRow);

    return 0;
}