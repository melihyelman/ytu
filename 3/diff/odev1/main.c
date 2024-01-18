#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <time.h>

#define MAX_LINE_LENGTH 1000
#define MAX_WORD_LENGTH 150
#define MAX_SAMPLES 750 * 2
#define TRAIN_PERCENTAGE 80
#define LEARNING_RATE 0.01
#define EPOCHS 1000
#define BETA1 0.9
#define BETA2 0.999
#define EPSILON 1e-5
#define WSIZE 5

// Fonksiyon prototipleri
void readTextFromFile(char *filename, char texts[][MAX_LINE_LENGTH], int *textCount);
void createDictionary(char *text[MAX_SAMPLES], int sampleSize, char ***dictionary, int *dictionarySize);
void createOneHotVectors(char *text[MAX_SAMPLES], char *dictionary[MAX_SAMPLES], int sampleSize, int dictionarySize, int ***oneHotVectors);
double lossFunction(int **trainOneHotVectors, double *w, int sampleSize, int dictionarySize);
void trainGD(int **trainOneHotVectors, int sampleSize, int dictionarySize, double *w, int epochs, int wIndex, clock_t startTime);
void trainSGD(int **trainOneHotVectors, int sampleSize, int dictionarySize, double *w, int epochs, int wIndex, clock_t startTime);
void trainAdam(int **trainOneHotVectors, int sampleSize, int dictionarySize, double *w, int epochs, int wIndex, clock_t startTime);
void testGD(int **testOneHotVectors, int sampleSize, int dictionarySize, double *w);
void testSGD(int **testOneHotVectors, int sampleSize, int dictionarySize, double *w);
void testADAM(int **testOneHotVectors, int sampleSize, int dictionarySize, double *w);

int main()
{
    srand(time(NULL));
    int i, j, wIndex;

    char hamFileName[] = "ham.txt";
    char spamFileName[] = "spam.txt";

    char hamText[(MAX_SAMPLES / 2)][MAX_LINE_LENGTH];
    char spamText[(MAX_SAMPLES / 2)][MAX_LINE_LENGTH];
    int hamTextCount, spamTextCount;

    // ham metinini okuma
    readTextFromFile(hamFileName, hamText, &hamTextCount);

    // spam metinini okuma
    readTextFromFile(spamFileName, spamText, &spamTextCount);

    char **trainText = (char **)malloc((MAX_SAMPLES * TRAIN_PERCENTAGE / 100) * sizeof(char *));
    char **testText = (char **)malloc((MAX_SAMPLES * (100 - TRAIN_PERCENTAGE) / 100) * sizeof(char *));

    if (trainText == NULL || testText == NULL)
    {
        printf("Memory allocation failed\n");
        return 1;
    }
    // verileri 80 train- 20 test kısımlarına bölme
    for (i = 0; i < (MAX_SAMPLES * TRAIN_PERCENTAGE / 100) / 2; i++)
    {
        trainText[i] = strdup(hamText[i]);
        trainText[i + ((MAX_SAMPLES * TRAIN_PERCENTAGE / 100) / 2)] = strdup(spamText[i]);
    }
    for (i = 0; i < (MAX_SAMPLES * (100 - TRAIN_PERCENTAGE) / 100) / 2; i++)
    {
        testText[i] = strdup(hamText[i + ((MAX_SAMPLES * TRAIN_PERCENTAGE / 100) / 2)]);
        testText[i + ((MAX_SAMPLES * (100 - TRAIN_PERCENTAGE) / 100) / 2)] = strdup(spamText[i + ((MAX_SAMPLES * TRAIN_PERCENTAGE / 100) / 2)]);
    }
    // Sözlük oluştur
    char **dictionary = NULL;
    int dictionarySize;
    createDictionary(trainText, (MAX_SAMPLES * TRAIN_PERCENTAGE / 100), &dictionary, &dictionarySize);

    // 1-hot vektörlerini oluştur
    int **trainOneHotVectors;
    int **testOneHotVectors;
    // Oluşturulan sözlüğü kullanarak 1-hot vektörleri oluştur
    createOneHotVectors(trainText, dictionary, (MAX_SAMPLES * TRAIN_PERCENTAGE / 100), dictionarySize, &trainOneHotVectors);
    createOneHotVectors(testText, dictionary, (MAX_SAMPLES * (100 - TRAIN_PERCENTAGE) / 100), dictionarySize, &testOneHotVectors);

    // algoritmalar için w değerlerinin değişkenlerini ayarlama
    double wGD[dictionarySize];
    double wSGD[dictionarySize];
    double wADAM[dictionarySize];

    // 5 farklı başlangıç w değeri için ayrı ayrı eğitim yap
    for (wIndex = 0; wIndex < WSIZE; wIndex++)
    {
        // Başlangıç w değerleri
        for (i = 0; i < dictionarySize; i++)
        {
            double data = ((double)rand() / RAND_MAX) * 2 - 1; // -1 ile 1 arasında rastgele değerler
            wGD[i] = data;
            wSGD[i] = data;
            wADAM[i] = data;
        }
        printf("Training with Initial W%d:\n", wIndex + 1);
        // Modelleri eğit
        clock_t startTimeGD = clock();
        trainGD(trainOneHotVectors, MAX_SAMPLES * TRAIN_PERCENTAGE / 100, dictionarySize, wGD, EPOCHS, wIndex, startTimeGD);
        clock_t startTimeSGD = clock();
        trainSGD(trainOneHotVectors, MAX_SAMPLES * TRAIN_PERCENTAGE / 100, dictionarySize, wSGD, EPOCHS, wIndex, startTimeSGD);
        clock_t startTimeAdam = clock();
        trainAdam(trainOneHotVectors, MAX_SAMPLES * TRAIN_PERCENTAGE / 100, dictionarySize, wADAM, EPOCHS, wIndex, startTimeAdam);

        printf("Train ");
        testGD(trainOneHotVectors, MAX_SAMPLES * TRAIN_PERCENTAGE / 100, dictionarySize, wGD);
        testGD(testOneHotVectors, MAX_SAMPLES * (100 - TRAIN_PERCENTAGE) / 100, dictionarySize, wGD);
        printf("Train ");
        testSGD(trainOneHotVectors, MAX_SAMPLES * TRAIN_PERCENTAGE / 100, dictionarySize, wSGD);
        testSGD(testOneHotVectors, MAX_SAMPLES * (100 - TRAIN_PERCENTAGE) / 100, dictionarySize, wSGD);
        printf("Train ");
        testADAM(trainOneHotVectors, MAX_SAMPLES * TRAIN_PERCENTAGE / 100, dictionarySize, wADAM);
        testADAM(testOneHotVectors, MAX_SAMPLES * (100 - TRAIN_PERCENTAGE) / 100, dictionarySize, wADAM);

        printf("\n");
    }

    return 0;
}
// dosyaları okuma fonksiyonu
void readTextFromFile(char *filename, char texts[][MAX_LINE_LENGTH], int *textCount)
{
    FILE *file = fopen(filename, "r");
    if (file == NULL)
    {
        fprintf(stderr, "Error opening file: %s\n", filename);
        exit(EXIT_FAILURE);
    }

    *textCount = 0;
    while (fgets(texts[*textCount], MAX_LINE_LENGTH, file) != NULL)
    {
        size_t len = strlen(texts[*textCount]);
        if (len > 0 && texts[*textCount][len - 1] == '\n')
        {
            texts[*textCount][len - 1] = '\0';
        }

        (*textCount)++;
    }

    fclose(file);
}
// sözlük oluşturma fonksiyonu
void createDictionary(char *text[MAX_SAMPLES], int sampleSize, char ***dictionary, int *dictionarySize)
{
    int i, j;
    *dictionarySize = 0;
    *dictionary = NULL;

    for (i = 0; i < sampleSize; i++)
    {
        char *textCopy = strdup(text[i]);
        char *token = strtok(textCopy, " "); // Cümleyi kelimelere böler

        while (token != NULL)
        {
            int found = 0;

            // Daha önce eklenmiş mi kontrol et
            for (j = 0; j < *dictionarySize; j++)
            {
                if (strcmp((*dictionary)[j], token) == 0)
                {
                    found = 1;
                    break;
                }
            }

            // Eğer bulunamazsa sözlüğe ekle
            if (!found)
            {
                // her değer eklenmeden önce sözlük genişletiliriz
                *dictionary = realloc(*dictionary, (*dictionarySize + 1) * sizeof(char *));
                (*dictionary)[*dictionarySize] = strdup(token);
                (*dictionarySize)++;
            }

            token = strtok(NULL, " "); // Bir sonraki kelimeye geç
        }
        free(textCopy);
        free(token);
    }
}
// vektörleri oluşturma fonksiyonu
void createOneHotVectors(char *text[MAX_SAMPLES], char *dictionary[MAX_SAMPLES], int sampleSize, int dictionarySize, int ***oneHotVectors)
{
    int i, j;
    // oneHotVectors matrisini sıfırla ve dinamik olarak ayarla
    *oneHotVectors = (int **)malloc(sampleSize * sizeof(int *));
    for (i = 0; i < sampleSize; i++)
    {
        (*oneHotVectors)[i] = (int *)malloc(dictionarySize * sizeof(int));
        for (j = 0; j < dictionarySize; j++)
        {
            (*oneHotVectors)[i][j] = 0;
        }
    }

    for (i = 0; i < sampleSize; i++)
    {
        // Her satırdaki kelimeleri 1-hot vektörlere çevir
        char *textCopy = strdup(text[i]);
        char *token = strtok(textCopy, " ");
        int wordIndex = 0;

        while (token != NULL)
        {
            // Her kelimenin sözlükteki indeksini bul
            int index = -1;
            for (j = 0; j < dictionarySize; j++)
            {
                if (strcmp(dictionary[j], token) == 0)
                {
                    index = j;
                    break;
                }
            }

            // 1-hot vektör oluştur ve ilgili indeksi 1 yap
            if (index != -1)
            {
                (*oneHotVectors)[i][index] = 1;
            }

            token = strtok(NULL, " "); // Bir sonraki kelimeye geç
            wordIndex++;
        }

        free(textCopy);
        free(token);
    }
}
// mse loss fonksiyonu
double lossFunction(int **trainOneHotVectors, double *w, int sampleSize, int dictionarySize)
{
    int i, j;
    double loss = 0.0;

    for (i = 0; i < sampleSize; i++)
    {
        double dotProduct = 0.0;

        for (j = 0; j < dictionarySize; j++)
        {
            dotProduct += w[j] * trainOneHotVectors[i][j];
        }

        double output = tanh(dotProduct);
        // sınıf değerlerinin sayısal gösterimi ilk yarısı a sınıfı diğeri b olarak tanımlandı
        double target = (i < sampleSize / 2) ? 1.0 : -1.0;
        double delta = target - output;

        loss += delta * delta;
    }

    return loss / sampleSize;
}
// gd eğitim fonksiyonu
void trainGD(int **trainOneHotVectors, int sampleSize, int dictionarySize, double *w, int epochs, int wIndex, clock_t startTime)
{
    int i, j, k;

    char filename[20]; // Dosya adını saklamak için yeterli bir boyut seç
    char filename2[20];

    // Dosya adını oluştur
    snprintf(filename, sizeof(filename), "gd_data_w%d.txt", wIndex + 1);
    snprintf(filename2, sizeof(filename2), "gd_w%d.txt", wIndex + 1);

    FILE *dataFile = fopen(filename, "w");
    FILE *dataFile2 = fopen(filename2, "w");
    double elapsedTime;

    for (i = 0; i < epochs; i++)
    {
        double prevLoss = lossFunction(trainOneHotVectors, w, sampleSize, dictionarySize);

        for (j = 0; j < sampleSize; j++)
        {
            double dotProduct = 0.0;

            for (k = 0; k < dictionarySize; k++)
            {
                dotProduct += w[k] * trainOneHotVectors[j][k];
            }

            double output = tanh(dotProduct);
            // sınıf değerlerinin sayısal gösterimi ilk yarısı a sınıfı diğeri b olarak tanımlandı
            double target = (j < sampleSize / 2) ? 1.0 : -1.0;
            double delta = target - output;

            for (k = 0; k < dictionarySize; k++)
            {
                // 1-output^2 = türev
                w[k] += LEARNING_RATE * delta * (1.0 - output * output) * trainOneHotVectors[j][k];
            }
        }

        double loss = lossFunction(trainOneHotVectors, w, sampleSize, dictionarySize);

        clock_t endTime = clock();
        elapsedTime = ((double)(endTime - startTime)) / CLOCKS_PER_SEC;
        // epoch time ve loss değerlerini dosyaya kaydetme
        fprintf(dataFile, "%d %lf %lf\n", i + 1, elapsedTime, loss);
        // w değerlerini dosyaya kaydetme
        for (j = 0; j < dictionarySize; j++)
        {
            fprintf(dataFile2, "%lf ", w[j]);
        }
        fprintf(dataFile2, "\n");
        if (fabs(prevLoss - loss) < EPSILON)
        {
            break;
        }
    }
    fclose(dataFile);
    fclose(dataFile2);

    printf("Number of epoch (gd): %d\n", i);
    printf("time (gd): %lf\n", elapsedTime);
}
// sgd eğitim fonksiyonu
void trainSGD(int **trainOneHotVectors, int sampleSize, int dictionarySize, double *w, int epochs, int wIndex, clock_t startTime)
{
    int i, j, k;

    char filename[20]; // Dosya adını saklamak için yeterli bir boyut seç
    char filename2[20];

    // Dosya adını oluştur
    snprintf(filename, sizeof(filename), "sgd_data_w%d.txt", wIndex + 1);
    snprintf(filename2, sizeof(filename2), "sgd_w%d.txt", wIndex + 1);
    FILE *dataFile2 = fopen(filename2, "w");
    FILE *dataFile = fopen(filename, "w");
    double elapsedTime;

    for (i = 0; i < epochs; i++)
    {
        double prevLoss = lossFunction(trainOneHotVectors, w, sampleSize, dictionarySize);

        for (j = 0; j < sampleSize; j++)
        {
            int randomIndex = rand() % sampleSize; // SGD için her seferinde random tek bir vector seçme

            double dotProduct = 0.0;

            for (k = 0; k < dictionarySize; k++)
            {
                dotProduct += w[k] * trainOneHotVectors[randomIndex][k];
            }

            double output = tanh(dotProduct);
            // sınıf değerlerinin sayısal gösterimi ilk yarısı a sınıfı diğeri b olarak tanımlandı
            double target = (randomIndex < sampleSize / 2) ? 1.0 : -1.0;
            double delta = target - output;

            for (k = 0; k < dictionarySize; k++)
            {
                // 1-output^2 = türev
                w[k] += LEARNING_RATE * delta * (1.0 - output * output) * trainOneHotVectors[randomIndex][k];
            }
        }

        double loss = lossFunction(trainOneHotVectors, w, sampleSize, dictionarySize);

        clock_t endTime = clock();
        elapsedTime = ((double)(endTime - startTime)) / CLOCKS_PER_SEC;
        // epoch time ve loss değerlerini saklama
        fprintf(dataFile, "%d %lf %lf\n", i + 1, elapsedTime, loss);
        // w değelerini saklama
        for (j = 0; j < dictionarySize; j++)
        {
            fprintf(dataFile2, "%lf ", w[j]);
        }
        fprintf(dataFile2, "\n");

        if (fabs(prevLoss - loss) < EPSILON)
        {
            break;
        }
    }
    fclose(dataFile);
    fclose(dataFile2);

    printf("Number of epoch (sgd): %d\n", i);
    printf("Time (sgd): %lf\n", elapsedTime);
}
// adam eğitim fonksiyonu
void trainAdam(int **trainOneHotVectors, int sampleSize, int dictionarySize, double *w, int epochs, int wIndex, clock_t startTime)
{
    int i, j, k;

    char filename[20];
    snprintf(filename, sizeof(filename), "adam_data_w%d.txt", wIndex + 1);
    char filename2[20];
    snprintf(filename2, sizeof(filename2), "adam_w%d.txt", wIndex + 1);

    FILE *dataFile = fopen(filename, "w");
    FILE *dataFile2 = fopen(filename2, "w");

    double beta1Tmp = BETA1;
    double beta2Tmp = BETA2;

    double *m = (double *)malloc(dictionarySize * sizeof(double));
    double *v = (double *)malloc(dictionarySize * sizeof(double));

    double elapsedTime;
    for (k = 0; k < dictionarySize; k++)
    {
        m[k] = 0.0;
        v[k] = 0.0;
    }

    for (i = 0; i < epochs; i++)
    {
        double prev_loss = lossFunction(trainOneHotVectors, w, sampleSize, dictionarySize);

        for (j = 0; j < sampleSize; j++)
        {
            int randomIndex = rand() % sampleSize;

            double dotProduct = 0.0;
            for (k = 0; k < dictionarySize; k++)
            {
                dotProduct += w[k] * trainOneHotVectors[randomIndex][k];
            }

            double output = tanh(dotProduct);
            // sınıf değerlerinin sayısal gösterimi ilk yarısı a sınıfı diğeri b olarak tanımlandı
            double target = (randomIndex < sampleSize / 2) ? 1.0 : -1.0;
            double delta = target - output;

            // Adam güncellemelerini hesapla
            for (k = 0; k < dictionarySize; k++)
            {
                m[k] = BETA1 * m[k] + (1 - BETA1) * delta * trainOneHotVectors[randomIndex][k];
                v[k] = BETA2 * v[k] + (1 - BETA2) * delta * delta * trainOneHotVectors[randomIndex][k];

                double mHat = m[k] / (1 - pow(BETA1, beta1Tmp));
                double vHat = v[k] / (1 - pow(BETA2, beta2Tmp));
                // w güncelle
                w[k] += LEARNING_RATE * mHat / (sqrt(vHat) + EPSILON);
            }
        }

        double loss = lossFunction(trainOneHotVectors, w, sampleSize, dictionarySize);

        clock_t endTime = clock();
        elapsedTime = ((double)(endTime - startTime)) / CLOCKS_PER_SEC;
        // epoch time ve loss değelerini kaydetme
        fprintf(dataFile, "%d %lf %lf\n", i + 1, elapsedTime, loss);
        // w değerlerini kaydetme
        for (j = 0; j < dictionarySize; j++)
        {
            fprintf(dataFile2, "%lf ", w[j]);
        }
        fprintf(dataFile2, "\n");

        if (fabs(prev_loss - loss) < EPSILON)
        {
            break;
        }
        // Adam için beta değerlerini güncelle
        beta1Tmp *= BETA1;
        beta2Tmp *= BETA2;
    }

    // Dinamik bellek serbest bırakma
    free(m);
    free(v);

    fclose(dataFile);
    printf("Number of epoch (adam): %d\n", i);
    printf("Time (adam): %lf\n", elapsedTime);
}
// gd test fonksiyonu
void testGD(int **testOneHotVectors, int sampleSize, int dictionarySize, double *w)
{
    int i, j;
    double correctPredictions = 0.0;

    for (i = 0; i < sampleSize; i++)
    {
        double dotProduct = 0.0;

        for (j = 0; j < dictionarySize; j++)
        {
            dotProduct += w[j] * testOneHotVectors[i][j];
        }

        double output = tanh(dotProduct);

        // sınıf değerlerinin sayısal gösterimi ilk yarısı a sınıfı diğeri b olarak tanımlandı
        double target = (i < sampleSize / 2) ? 1.0 : -1.0;

        // tahminin hedefle eşlemesi
        if ((output > 0 && target == 1.0) || (output <= 0 && target == -1.0))
        {
            correctPredictions += 1.0;
        }
    }
    double accuracy = (correctPredictions / sampleSize) * 100.0;

    printf("Test Accuracy (GD): %lf%%\n", accuracy);
}
// sgd test fonksiyonu
void testSGD(int **testOneHotVectors, int sampleSize, int dictionarySize, double *w)
{
    int i, j;
    double correctPredictions = 0.0;

    for (i = 0; i < sampleSize; i++)
    {
        double dotProduct = 0.0;

        for (j = 0; j < dictionarySize; j++)
        {
            dotProduct += w[j] * testOneHotVectors[i][j];
        }

        double output = tanh(dotProduct);

        // sınıf değerlerinin sayısal gösterimi ilk yarısı a sınıfı diğeri b olarak tanımlandı
        double target = (i < sampleSize / 2) ? 1.0 : -1.0;

        // tahminin hedefle eşleşmesi
        if ((output > 0 && target == 1.0) || (output <= 0 && target == -1.0))
        {
            correctPredictions += 1.0;
        }
    }

    double accuracy = (correctPredictions / sampleSize) * 100.0;

    printf("Test Accuracy (SGD): %lf%%\n", accuracy);
}
// adam test fonksiyonu
void testADAM(int **testOneHotVectors, int sampleSize, int dictionarySize, double *w)
{
    int i, j;
    double correctPredictions = 0.0;

    for (i = 0; i < sampleSize; i++)
    {
        double dotProduct = 0.0;

        for (j = 0; j < dictionarySize; j++)
        {
            dotProduct += w[j] * testOneHotVectors[i][j];
        }

        double output = tanh(dotProduct);

        // sınıf değerlerinin sayısal gösterimi ilk yarısı a sınıfı diğeri b olarak tanımlandı
        double target = (i < sampleSize / 2) ? 1.0 : -1.0;

        // tahminin hedefle eşleşmesi
        if ((output > 0 && target == 1.0) || (output <= 0 && target == -1.0))
        {
            correctPredictions += 1.0;
        }
    }

    double accuracy = (correctPredictions / sampleSize) * 100.0;

    printf("Test Accuracy (Adam): %lf%%\n", accuracy);
}