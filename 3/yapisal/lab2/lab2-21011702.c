#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void getWord(char **words, int wordIndex)
{
    printf("Kelime %d: ", wordIndex + 1);
    scanf("%s", words[wordIndex]);
}
int maxLength(char **words, int wordCount)
{
    int maxLen = 0, i;
    for (i = 0; i < wordCount; i++)
    {
        int len = strlen(words[i]);
        if (len > maxLen)
        {
            maxLen = len;
        }
    }
    return maxLen;
}
void freeWords(char **words, int wordCount)
{
    for (int i = 0; i < wordCount; i++)
    {
        free(words[i]);
    }
    free(words);
}
void copyString(char *dest, char *src, int length)
{
    int i;
    for (i = 0; i < length && src[i] != '\0'; i++)
    {
        dest[i] = src[i];
    }
    while (i < length)
    {
        dest[i] = '*';
        i++;
    }
}
void printWords(char **words, int wordCount)
{
    for (int i = 0; i < wordCount; i++)
    {
        printf("%s\n", words[i]);
    }
}
int main()
{
    int wordCount, i;
    printf("Kelime sayisini giriniz:");
    scanf("%d", &wordCount);

    char **words = (char **)malloc(wordCount * sizeof(char *));
    for (i = 0; i < wordCount; i++)
    {
        words[i] = (char *)malloc(51 * sizeof(char));
        getWord(words, i);
    }
    int colCount = maxLength(words, wordCount);

    char **words2 = (char **)malloc(wordCount * sizeof(char *));
    for (i = 0; i < wordCount; i++)
    {
        words2[i] = (char *)malloc((colCount + 1) * sizeof(char));
        copyString(words2[i], words[i], colCount);
    }
    printWords(words2,wordCount);
    freeWords(words2,wordCount);
    freeWords(words,wordCount);
}