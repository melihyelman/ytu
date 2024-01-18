#include <stdio.h>

void bubbleSort(int arr[], int n)
{
    int i, j;
    for (i = 0; i < n - 1; i++)
    {
        for (j = 0; j < n - i - 1; j++)
        {
            if (arr[j] > arr[j + 1])
            {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

int main()
{
    int n, i;
    do
    {
        printf("Dizi boyutunu girin: ");
        scanf("%d", &n);
    } while (n < 6);
    int array[n];
    printf("\nDizi elemanlarini girin: \n");
    for (i = 0; i < n; i++)
    {
        scanf("%d", &array[i]);
    }

    bubbleSort(array, n);

    int max = 0, min = 0;

    for (i = 0; i < n; i++)
    {
        if (i < 3)
        {
            min += array[i];
        }
        else if (i >= n - 3)
        {
            max += array[i];
        }
    }

    printf("En buyuk 3 elemanin toplami : %d\n", max);
    printf("En buyuk 3 eleman: %d, %d, %d\n", array[n - 1], array[n - 2], array[n - 3]);
    printf("En kucuk 3 elemanin toplami : %d\n", min);
    printf("En kucuk 3 eleman: %d, %d, %d\n", array[0], array[1], array[2]);

    return 0;
}