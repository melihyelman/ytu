#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_LEN 500

typedef struct Data
{
    int orderCode;
    int customerId;
    char customerName[MAX_LEN];
    char product[MAX_LEN];
    char date[MAX_LEN];
    struct Data *next;
} data;

void splitData(data *holder, char buff[255], char delimiter[2])
{
    char *token;
    token = strtok(buff, delimiter);
    holder->orderCode = atoi(token);

    token = strtok(NULL, delimiter);
    holder->customerId = atoi(token);

    token = strtok(NULL, delimiter);
    strcpy(holder->customerName, token);

    token = strtok(NULL, delimiter);
    strcpy(holder->product, token);

    token = strtok(NULL, delimiter);
    token[strlen(token) - 1] = '\0';
    strcpy(holder->date, token);
}

data *readFile(char *fileName)
{
    FILE *fp = fopen(fileName, "r");

    data *head = NULL;
    data *tail = NULL;
    char buffer[MAX_LEN];

     while (fgets(buffer, sizeof(buffer), fp) != NULL)
    {
        struct Data *temp = (struct Data *)malloc(sizeof(data));
        splitData(temp, buffer, " ");

        temp->next = NULL;

        if (head == NULL)
        {
            head = temp;
            tail = temp;
        }
        else
        {
            tail->next = temp;
            tail = temp;
        }
    }
    fclose(fp);
    return head;
}
void printList(data *head)
{
    data *tmp = head;
    while (tmp != NULL)
    {
        printf("%d %d %s %s %s\n", tmp->orderCode, tmp->customerId, tmp->customerName, tmp->product, tmp->date);
        tmp = tmp->next;
    }
}

data *sortData(data *head)
{
    if (head == NULL || head->next == NULL)
    {
        return head;
    }

    int max = head->orderCode;
    data *prev = head;
    data *move = NULL;
    data *tmp = head->next;

    while (tmp != NULL)
    {
        if (tmp->orderCode < max)
        {
            max = tmp->orderCode;
            move = prev;
        }

        prev = tmp;
        tmp = tmp->next;
    }

    if (move == NULL)
    {
        head->next = sortData(head->next);
        return head;
    }

    prev = move;
    move = prev->next;
    prev->next = prev->next->next;
    
    move->next = sortData(head);
    return move;
}

void createEmailFiles(struct Data* head) {
    while (head != NULL) {
        char filename[50];
        sprintf(filename, "%s.txt", head->customerName);
        FILE* file = fopen(filename, "w");
        fprintf(file, "Merhaba %s, %s günü tarafınızdan sipariş numarası %d olan müşteri id %d olan %s alışverişi gerçekleştirilmiştir. İyi Günler",
                head->customerName, head->date, head->orderCode, head->customerId, head->product);
        fclose(file);
        head = head->next;
    }
}
void createGeneralReport(struct Data* head) {
    FILE* file = fopen("rapor.txt", "w");

    int pantolonCount = 0;
    int kazakCount = 0;
    int kabanCount = 0;

    while (head != NULL)
    {
        if (strcmp(head->product, "Pantolon") == 0)
        {
            pantolonCount++;
        }
        else if (strcmp(head->product, "Kazak") == 0)
        {
            kazakCount++;
        }
        else if (strcmp(head->product, "Kaban") == 0)
        {
            kabanCount++;
        }

        head = head->next;
    }

    fprintf(file, "Pantolon sipariş sayısı %d\n", pantolonCount);
    fprintf(file, "Kazak sipariş sayısı %d\n", kazakCount);
    fprintf(file, "Kaban sipariş sayısı %d\n", kabanCount);

    fclose(file);
}

int main()
{
    data *head = NULL;
    head = readFile("input.txt");
    head = sortData(head);
    printList(head);
    createEmailFiles(head);
    createGeneralReport(head);
    return 0;
}