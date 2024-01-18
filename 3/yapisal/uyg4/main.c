#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct DATA
{
    int id;
    char name[40];
    char department[40];
    struct DATA *next;
} data;

void splitData(data *holder, char buff[255], char delimiter[2])
{
    char *token;
    token = strtok(buff, delimiter);
    holder->id = atoi(token);

    token = strtok(NULL, delimiter);
    strcpy(holder->name, token);

    token = strtok(NULL, delimiter);
    token[strlen(token) - 1] = '\0';
    strcpy(holder->department, token);
}

data *fileRead(char *fileName, char delimiter[2])
{
    FILE *fp = fopen(fileName, "r");
    char buff[255];

    data *head = (data *)malloc(sizeof(data));
    data *current = NULL;
    data *prev = NULL;

    if (fgets(buff, 255, fp) != NULL)
    {
        printf("%s", buff);
        splitData(head, buff, delimiter);
    }
    else
    {
        return NULL;
    }
    prev = head;
    while (fgets(buff, 255, fp) != NULL)
    {
        printf("%s", buff);
        current = (data *)malloc(sizeof(data));
        prev->next = current;
        splitData(current, buff, delimiter);
        prev = current;
    }
    prev->next = NULL;
    fclose(fp);
    return head;
}

void printList(data *head)
{
    data *tmp = head;
    while (tmp != NULL)
    {
        printf("ID:%d Name:%s Department:%s\n", tmp->id, tmp->name, tmp->department);
        tmp = tmp->next;
    }
}

data *sortData(data *head, int (*sortCondition)(int, int))
{
    if (head == NULL || head->next == NULL)
    {
        return head;
    }

    int max = head->id;
    data *prev = head;
    data *move = NULL;
    data *tmp = head->next;

    while (tmp != NULL)
    {
        if (sortCondition(tmp->id, max))
        {
            max = tmp->id;
            move = prev;
        }

        prev = tmp;
        tmp = tmp->next;
    }

    if (move == NULL)
    {
        head->next = sortData(head->next, sortCondition);
        return head;
    }

    prev = move;
    move = prev->next;
    prev->next = prev->next->next;
    
    move->next = sortData(head, sortCondition);
    return move;
}

int sortAscending(int first, int second)
{
    return first < second;
}

int sortDescending(int first, int second)
{
    return first > second;
}

void fileWrite(data *head, char *fileName, char delimiter)
{
    FILE *fp = fopen(fileName, "w");
    char tmp[20];
    data *tmpData = head;
    while (tmpData != NULL)
    {
        sprintf(tmp, "%d", tmpData->id);
		fputs(tmp, fp);
		fputc(delimiter, fp);
		fputs(tmpData->name, fp);
		fputc(delimiter, fp);
		fputs(tmpData->department, fp);
		fputc('\n', fp);

        tmpData = tmpData->next;
    }
    fclose(fp);
}

void fileWriteWithFpf(data *head, char *fileName, char delimiter)
{
    FILE *fp = fopen(fileName, "w");
    char tmp[20];
    data *tmpData = head;
    while (tmpData != NULL)
    {
        fprintf(fp,"%d,%s,%s\n", tmpData->id, tmpData->name, tmpData->department);

        tmpData = tmpData->next;
    }
    fclose(fp);
}

int main()
{
    data *head;
    head = fileRead("Dataset.txt", ",\0");
    printList(head);
    head = sortData(head, sortDescending);
    printf("Descending\n");
    printList(head);
    fileWrite(head, "newdataset.txt", ',');

    head = sortData(head, sortAscending);
    printf("Ascending\n");
    printList(head);
    fileWriteWithFpf(head, "newdataset_2.txt", ',');

    return 0;
}