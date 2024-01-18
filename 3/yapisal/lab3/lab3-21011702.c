#include <stdio.h>
#include <stdlib.h>

struct Item
{
    char name[20];
    int id;
    double pricePerUnit;
    double pricePerKg;
};

struct Discount
{
    double lowerLimit;
    double discountPercentage;
};

void printItems(struct Item items[], int itemsCount);
double calculateCost(struct Item items[], int itemsCount, int itemId, int type, int amount);
double calculateDiscount(double totalCost, struct Discount discounts[], int discountsCount);

int main()
{
    struct Item items[] = {
        {"domates", 1, 8.25, 23.75},
        {"biber", 2, 6.25, 29.50},
        {"süt", 3, 15.85, 27.15},
        {"peynir", 4, 23.00, 95.50},
        {"muz", 5, 13.45, 45.50},
        {"armut", 6, 5.50, 20.15},
    };

    struct Discount discounts[] = {
        {50, 0},
        {100, 5},
        {99999, 10}};

    int itemsCount = sizeof(items) / sizeof(items[0]);
    int discountsCount = sizeof(discounts) / sizeof(discounts[0]);

    char flag;
    double totalCost = 0;
    do
    {
        printItems(items, itemsCount);

        int itemId, type, amount;
        printf("\nUrun kodu :");
        scanf(" %d", &itemId);
        printf("\nAlis Tipi (1: Birim, 2: Kilo) :");
        scanf(" %d", &type);
        printf("\nMiktar :");
        scanf(" %d", &amount);

        if ((itemId >= 0 && itemId <= itemsCount) && (type == 1 || type == 2) && (amount > 0))
        {
            totalCost += calculateCost(items, itemsCount, itemId, type, amount);
            printf("Toplam Tutar: %.2f TL\n", totalCost);
        }
        else
        {
            printf("\nHatali giris yaptiniz!!!!\n");
        }
        printf("Devam etmek istiyor musunuz? (E/H): ");
        scanf(" %c", &flag);
    } while (flag == 'E' || flag == 'e');
    printf("Toplam Tutar: %.2f TL\n", totalCost);
    double discount = calculateDiscount(totalCost, discounts,discountsCount);
    printf("Indirimli Tutar: %.2f TL\n", discount);
    printf("Programdan cikis yapiliyor\n");

    return 0;
}

void printItems(struct Item items[], int itemsCount)
{
    printf("\nUrun kodu\tUrun adi\tBirim Fiyat\tKilo Fiyat\n");
    int i;
    for (i = 0; i < itemsCount; i++)
    {
        printf("%d\t\t%s\t\t%.2f\t\t%.2f\n", items[i].id, items[i].name, items[i].pricePerUnit, items[i].pricePerKg);
    }
}

double calculateCost(struct Item items[], int itemsCount, int itemId, int type, int amount)
{
    int i;
    for (i = 0; i < itemsCount; i++)
    {
        if (items[i].id == itemId)
        {
            if (type == 1)
            {
                return amount * items[i].pricePerUnit;
            }
            else if (type == 2)
            {
                return amount * items[i].pricePerKg;
            }
        }
    }
    return -1;
}

double calculateDiscount(double totalCost, struct Discount discounts[], int discountsCount)
{
    int i;
    for (i = 0; i < discountsCount; i++)
    {
        if (totalCost <= discounts[i].lowerLimit)
        {
            return totalCost - (totalCost * (discounts[i].discountPercentage / 100));
        }
    }
    return 0;
}