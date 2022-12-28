/*

Kelime Üretme Oyunu:

Verilen harflerden kelime üretmek için bir oyun programı yazmanız beklenmektedir. Harfler oyun için sabittir ve bir dizide (D dizisi) tutulmaktadır. Üretilebilecek olan kelimeler ise başka bir dizide (kelimeler dizisi) tutulmaktadır. Sadece kelimeler dizisinde var olan kelimeler geçerli cevaplardır.

Oyun başladığında kullanılabilecek olan harfler kullanıcıya gösterilecektir.

Kullanıcı kelime tahmin etmek istiyorsa kelimeyi girecektir veya kelime girmek istemiyorsa 0’a basacaktır.

Kullanıcı her yeni kelimeyi girdiğinde
-	Kelimenin doğru harflerden oluşup oluşmadığı kontrol edilecektir. Eğer yanlış harf (D içinde olmayan) kullanıldıysa, hatalı harf kullanımı uyarısı verilecek ve girilen harf sayısı kadar eksi puan alınacaktır.
-	Kelime doğru harflerden oluşuyorsa ve türetilebilecek kelime listesinde var ise kelimenin harf sayısı kadar puan kazanılacaktır.
-	Kelime doğru harflerden oluşuyorsa fakat türetilebilecek kelime listesinde yok ise girilen kelimenin harf sayısı kadar eksi puan kazanılacaktır.
-	Her harf bir kez kullanılabilecektir.
-	Her adımda kazanılan puan ekrana yazdırılacaktır.
-	Kullanıcının küçük harflerle giriş yaptığı varsayılabilir. 
-	Aynı kelime sadece bir kere tahmin edilmelidir. Eğer ikinci kez aynı kelime tahmin edilirse girilen kelimenin harf sayısı kadar eksi puan almalıdır.
-	Girilen tahminler minimum 2 uzunluğunda olacaktır. Tek harfli kelimeler kabul edilmeyecektir.
-	Tüm kelimeler girildikten ve 0 ile tahminler tamamlandıktan sonra toplam puan ekrana yazdırılacaktır.

Sadece stdio.h kütüphanesini kullanmanız gerekmektedir.

Aşağıda örnek D ve kelimeler dizileri verilmiştir:

D dizisindeki karakterler 'k','a','m','n','e','r','i' olacaktır.

char kelimeler[][7]={"anemik","kameri","marine","minare", "makine","anemi","mekan","krema","kerim", "inmek", "imkan","imren", "imran","erkan", "ekran", "mera","krem","mine","mira","name","ekim", "erik","kim","nem","nam","ani","kin","kir"};

Örnek çıktı:

Kullanabileceğiniz karakterler: k a m n e r i
Tahmininizi giriniz: kerim
Puanınız:5
Tahmininizi giriniz: kenar
Puanınız:-5
Tahmininizi giriniz: kanar
Hatalı harf kullanımı, Puanınız:-5
Tahmininizi giriniz: marine
Puanınız:6
Tahmininizi giriniz: 0
Oyun bitmiştir. Tebrikler! Toplam puanınız: 1


*/


#include <stdio.h>

int main() {
    char D[5] = {'a', 'e', 'r', 'k', 's'};

    char words[][6] = {"asker", "serak", "kars", "kase", "sera", "akse", "ark", "kes", "kas", "ser", "sek", "kar"};
    int i;
    int j;
    int length;
    int total_score = 0;
    int score = 0;
    int words_length = sizeof words / sizeof *words;
    int max_length = sizeof D / sizeof *D;
    char word[max_length];
    char gues_words[words_length][max_length];
    int guess_count = 0;

    printf("Kullanabileceginiz karakterler: ");
    for (i = 0; i < max_length; i++) {
        printf("%c ", D[i]);
    }

    while (word[0] != '0') {
        printf("\nTahmininizi giriniz: ");
        gets(word);
        i = 0;
        length = 0;
        while (word[length] != '\0') {
            length++;
        }
        if (length < 2 && word[0] != '0') {
            printf("\nEn az iki harf giriniz! ");
        } else if (word[0] != '0') {
            int flag = 0;
            // tekrar eden harf var mı diye kontrol var ise flag 1 olacaktır
            for (i = 0; i < length - 1; i++) {
                for (j = i + 1; j < length; j++) {
                    if (word[i] == word[j]) {
                        flag = 1;
                    }
                }
            }
            // bir kere bile flagin 1 olması durumunda tekrar eden harf var demektir.
            if (flag == 1) {
                score = -1 * length;
                total_score += score;
                printf("Tekrar eden harf kullanimi, Puaniniz: %d", score);
            } else {
                // uygun harflerle her eşleştiğinde flag değeri artacaktır
                flag = 0;
                for (i = 0; i < max_length; i++) {
                    for (j = 0; j < length; j++) {
                        if (D[i] == word[j]) {
                            flag++;
                        }
                    }
                }
                // eğer flag değeri lengthe eşit değilse uygun harflere eşleşmeyen kelime var demektir.
                if (flag != length) {
                    score = -1 * length;
                    total_score += score;
                    printf("Hatali harf kullanimi, Puaniniz: %d", score);
                } else {
                    flag = 0;
                    // dizide ki herhangi bir kelime ile girilen kelime eşleşiyor mu kontrolu
                    for (i = 0; i < words_length; i++) {
                        int compare = 0;
                        int current_word_length = 0;
                        // dizinin o an ki değerinin uzunluğunu alıyoruz
                        while (words[i][current_word_length] != '\0') {
                            current_word_length++;
                        }
                        for (j = 0; j < current_word_length; j++) {
                            // dizinin o anki değeri ve girilen değerin her elemanın eşleşme kontrolü yaparak compare değişkenini arttırıyoruz
                            if (word[j] == words[i][j]) {
                                compare++;
                            }
                        }
                        // compare ve girilen değerin uzunluğunun eşit olması ve dizinin o anki değerinin uzunluğunun girilen değerin uzunluğuna eşit olması eşleşen değer olduğunu gösteriyor
                        if (compare == length && current_word_length == length) {
                            flag = 1;
                        }
                    }
                    // eğer dizide bir kelime eşleştiyse flag 1 eşleşmediyse flag 0 olacaktır.
                    if (flag == 1) {
                        flag = 0;
                        // daha önce girilen doğru kelimelerin herhangi biri şu an girilen kelimeye eşit mi kontrolü
                        for (i = 0; i < guess_count; i++) {
                            int compare = 0;
                            int current_word_length = 0;
                            // dizinin o an ki değerinin uzunluğunu alıyoruz
                            while (gues_words[i][current_word_length] != '\0') {
                                current_word_length++;
                            }
                            for (j = 0; j < current_word_length; j++) {
                                // dizinin o anki değeri ve girilen değerin her elemanın eşleşme kontrolü yaparak compare değişkenini arttırıyoruz
                                if (word[j] == gues_words[i][j]) {
                                    compare++;
                                }
                            }
                            // compare ve girilen değerin uzunluğunun eşit olması ve dizinin o anki değerinin uzunluğunun girilen değerin uzunluğuna eşit olması eşleşen değer olduğunu gösteriyor
                            if (compare == length && current_word_length == length) {
                                flag = 1;
                            }
                        }
                        if (flag == 1) {
                            score = -1 * length;
                            total_score += score;
                            printf("Ayni degeri girdiniz, Puaniniz: %d", score);
                        } else {
                            // kelime doğru artık doğru tahmin edilen kelime dizimize atabiliriz
                            for (i = 0; i < length; i++) {
                                gues_words[guess_count][i] = word[i];
                            }
                            // tahmin edilen kelimenin sonuna karakterdizisi sonu işareti ekliyoruz
                            gues_words[guess_count][length] = '\0';
                            guess_count++;
                            score = length;
                            total_score += score;
                            printf("Tebrikler, Puaniniz: %d", score);
                        }
                    } else {
                        score = -1 * length;
                        total_score += score;
                        printf("Bu deger dizide yoktur, Puaniniz: %d", score);
                    }
                }
            }
        }
    };
    printf("Oyun bitmistir. Tebrikler! Toplam puaniniz: %d", total_score);
    return 0;
}