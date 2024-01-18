#include <stdio.h>

void bubbleSort(int arr[], int n)
{
    int temp, i, j;
    for (i = 0; i < n - 1; i++)
    {
        for (j = 0; j < n - i - 1; j++)
        {
            if (arr[j] > arr[j + 1])
            {
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

int countElement(int arr[], int n, int target)
{
    int count = 0, i;
    for (i = 0; i < n; i++)
    {
        if (arr[i] == target)
        {
            count++;
        }
    }
    return count;
}

void findElementIndices(int arr[], int n, int target, int indices[])
{
    int count = 0, i;
    for (i = 0; i < n; i++)
    {
        if (arr[i] == target)
        {
            indices[count] = i;
            count++;
        }
    }
}

int main()
{
    int n;
    printf("Dizinin boyunu giriniz:");
    scanf("%d", &n);

    int arr[n];
    printf("Dizinin elemanlarini giriniz:");

    int i;
    for (i = 0; i < n; i++)
    {
        scanf("%d", &arr[i]);
    }
    int choice, target, indices[n], count;
    while (1)
    {
        printf("\nMENU\n\n1. diziyi sirala\n2. girilen elemanin kac kez gectigini bul\n3. elemanin indesklerini bul\n4. cikis\nSecim giriniz:");
        scanf("%d", &choice);
        switch (choice)
        {
        case 1:
            bubbleSort(arr, n);
            printf("Siralanan dizi: \n");
            for (i = 0; i < n; i++)
                printf("%d", arr[i]);
            break;
        case 2:
            printf("\nAranan elemani giriniz: ");
            scanf("%d", &target);
            count = countElement(arr, n, target);
            printf("\n %d, dizide %d kez bulundu", target, count);
            break;
        case 3:
            printf("\nAranan elemani giriniz: ");
            scanf("%d", &target);
            count = countElement(arr, n, target);
            if (count > 0)
            {
                findElementIndices(arr, n, target, indices);
                printf("\n%d elemanin dizideki indisleri ", target);
                for (i = 0; i < count; i++)
                {
                    printf("%d,", indices[i]);
                }
            }
            else
            {
                printf("%d dizide bulunamadi", target);
            }
            break;
        case 4:
            printf("\nProgramdan cikiliyor.");
            return 0;
        default:
            printf("\nGecersiz tekrar deneyin!");
            break;
        }
    }
    return 0;
}
