#include <stdio.h>
#include <stdlib.h>

#define MAX_LINE_LENGTH 256

int main() {
    FILE *dosya;
    char buffer[MAX_LINE_LENGTH];
    int length;

    dosya = fopen("input.txt", "r");
    if (dosya == NULL) {
        perror("Dosya acilamadi");
        return 1;
    }

    while ((length = fread(buffer, 1, MAX_LINE_LENGTH, dosya)) > 0) {
        // Satır sonu kontrolü yap
        for (int i = 0; i < length; ++i) {
            if (buffer[i] == '\n') {
                // Satır sonu bulundu, buffer'ı ekrana yazdır ve işlemi tekrarla
                buffer[i] = '\0';
                printf("%s\n", buffer);
                fseek(dosya, i - length + 1, SEEK_CUR);
                break;
            }
        }
    }

    // Dosyayı kapat
    fclose(dosya);

    return 0;
}
