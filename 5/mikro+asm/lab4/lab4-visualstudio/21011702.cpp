#define _CRT_SECURE_NO_DEPRECATE
#include <stdio.h>
#include <stdlib.h>

// Function to print a matrix stored in a 1D array
void print_matrix(unsigned* matrix, unsigned rows, unsigned cols, FILE* file);
// Function to read matrix from a file
void read_matrix(const char* filename, unsigned** matrix, unsigned* rows, unsigned* cols);
// Function to read kernel from a file
void read_kernel(const char* filename, unsigned** kernel, unsigned* k);
// Function to write output matrix to a file
void write_output(const char* filename, unsigned* output, unsigned rows, unsigned cols);
// Initialize output as zeros.
void initialize_output(unsigned*, unsigned, unsigned);

int main() {

    unsigned n, m, k;  // n = rows of matrix, m = cols of matrix, k = kernel size
    // Dynamically allocate memory for matrix, kernel, and output
    unsigned* matrix = NULL;  // Input matrix
    unsigned* kernel = NULL;  // Kernel size 3x3
    unsigned* output = NULL;  // Max size of output matrix

    char matrix_filename[30];
    char kernel_filename[30];

    // Read the file names
    printf("Enter matrix filename: ");
    scanf("%s", matrix_filename);
    printf("Enter kernel filename: ");
    scanf("%s", kernel_filename);


    // Read matrix and kernel from files
    read_matrix(matrix_filename, &matrix, &n, &m);  // Read matrix from file
    read_kernel(kernel_filename, &kernel, &k);      // Read kernel from file

    // For simplicity we say: padding = 0, stride = 1
    // With this setting we can calculate the output size
    unsigned output_rows = n - k + 1;
    unsigned output_cols = m - k + 1;
    output = (unsigned*)malloc(output_rows * output_cols * sizeof(unsigned));
    initialize_output(output, output_rows, output_cols);

    // Print the input matrix and kernel
    printf("Input Matrix: ");
    print_matrix(matrix, n, m, stdout);

    printf("\nKernel: ");
    print_matrix(kernel, k, k, stdout);

    /******************* KODUN BU KISMINDAN SONRASINDA DEĞİŞİKLİK YAPABİLİRSİNİZ - ÖNCEKİ KISIMLARI DEĞİŞTİRMEYİN *******************/

    // Assembly kod bloğu içinde kullanacağınız değişkenleri burada tanımlayabilirsiniz. ---------------------->
    // Aşağıdaki değişkenleri kullanmak zorunda değilsiniz. İsterseniz değişiklik yapabilirsiniz.
    unsigned matrix_value;
    unsigned kernel_value = 0;    // Konvolüsyon için gerekli 1 matrix ve 1 kernel değişkenleri saklanabilir.
    unsigned sum = 0;                           // Konvolüsyon toplamını saklayabilirsiniz.
    unsigned matrix_offset = k / 2;                 // Input matrisi üzerinde gezme işleminde sınırları ayarlamak için kullanılabilir.
    unsigned tmp_si, tmp_di;                // ESI ve EDI döngü değişkenlerini saklamak için kullanılabilir.
    unsigned input_value = 0;
    unsigned input_row = 0;
    unsigned input_col = 0;
    unsigned temp = 0;
    // Assembly dilinde 2d konvolüsyon işlemini aşağıdaki blokta yazınız ----->
    __asm {
        XOR ECX, ECX; ECX = i
        i_loop :
        CMP ECX, output_rows
            JGE end_outer_loop

            XOR EBX, EBX; EBX = j
            j_loop :
        CMP EBX, output_cols
            JGE end_inner_loop

            MOV sum, 0; SUM = 0

            XOR EDI, EDI; EDI = ki
            ki_loop :
        CMP EDI, k
            JGE end_ki_loop

            XOR EDX, EDX; EDX = kj
            kj_loop :
        CMP EDX, k
            JGE end_kj_loop

            PUSH EDX; save kj
            MOV temp, EDX; temp = kj

            ; input_value = matrix[(i + ki) * m + (j + kj)]
            MOV ESI, ECX
            ADD ESI, EDI
            MOV input_row, ESI
            XOR EDX, EDX
            MOV ESI, m
            MOV EAX, input_row
            MUL ESI
            ADD EAX, EBX
            ADD EAX, temp
            SHL EAX, 2; [(i + ki) * m + (j + kj)] * 4
            MOV ESI, matrix
            ADD ESI, EAX
            MOV EAX, [ESI]
            MOV input_value, EAX

            ; kernel value = kernel[ki * k + kj]
            MOV EAX, EDI
            XOR EDX, EDX
            MOV ESI, k
            MUL ESI
            ADD EAX, temp
            SHL EAX, 2; (ki * k + kj) * 4
            MOV ESI, kernel
            ADD ESI, EAX
            MOV EAX, [ESI]
            MOV kernel_value, EAX

            ; sum += input_value * kernel_value
            MOV EAX, input_value
            MOV ESI, kernel_value
            XOR EDX, EDX
            MUL ESI
            MOV ESI, sum
            ADD ESI, EAX
            MOV sum, ESI

            POP EDX; restore kj

            INC EDX
            JMP kj_loop
            end_kj_loop :

        INC EDI
            JMP ki_loop
            end_ki_loop :

        PUSH EBX; save j

            ; output[i * output_cols + j] = sum
            MOV ESI, ECX
            MOV EAX, output_cols
            XOR EDX, EDX
            MUL ESI
            ADD EAX, EBX
            SHL EAX, 2; [i * output_cols + j] * 4
            MOV EBX, output
            MOV ESI, EBX
            ADD ESI, EAX
            MOV EAX, sum
            MOV[ESI], EAX

            POP EBX; restore j

            INC EBX
            JMP j_loop
            end_inner_loop :

        INC ECX
            JMP i_loop
            end_outer_loop :
    }
    /******************* KODUN BU KISMINDAN ÖNCESİNDE DEĞİŞİKLİK YAPABİLİRSİNİZ - SONRAKİ KISIMLARI DEĞİŞTİRMEYİN *******************/


    // Write result to output file
    write_output("./output.txt", output, output_rows, output_cols);

    // Print result
    printf("\nOutput matrix after convolution: ");
    print_matrix(output, output_rows, output_cols, stdout);

    // Free allocated memory
    free(matrix);
    free(kernel);
    free(output);

    return 0;
}

void print_matrix(unsigned* matrix, unsigned rows, unsigned cols, FILE* file) {
    if (file == stdout) {
        printf("(%ux%u)\n", rows, cols);
    }
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            fprintf(file, "%u ", matrix[i * cols + j]);
        }
        fprintf(file, "\n");
    }
}

void read_matrix(const char* filename, unsigned** matrix, unsigned* rows, unsigned* cols) {
    FILE* file = fopen(filename, "r");
    if (!file) {
        printf("Error opening file %s\n", filename);
        exit(1);
    }

    // Read dimensions
    fscanf(file, "%u %u", rows, cols);
    *matrix = (unsigned*)malloc(((*rows) * (*cols)) * sizeof(unsigned));

    // Read matrix elements
    for (int i = 0; i < (*rows); i++) {
        for (int j = 0; j < (*cols); j++) {
            fscanf(file, "%u", &(*matrix)[i * (*cols) + j]);
        }
    }

    fclose(file);
}

void read_kernel(const char* filename, unsigned** kernel, unsigned* k) {
    FILE* file = fopen(filename, "r");
    if (!file) {
        printf("Error opening file %s\n", filename);
        exit(1);
    }

    // Read kernel size
    fscanf(file, "%u", k);
    *kernel = (unsigned*)malloc((*k) * (*k) * sizeof(unsigned));

    // Read kernel elements
    for (int i = 0; i < (*k); i++) {
        for (int j = 0; j < (*k); j++) {
            fscanf(file, "%u", &(*kernel)[i * (*k) + j]);
        }
    }

    fclose(file);
}

void write_output(const char* filename, unsigned* output, unsigned rows, unsigned cols) {
    FILE* file = fopen(filename, "w");
    if (!file) {
        printf("Error opening file %s\n", filename);
        exit(1);
    }

    // Write dimensions of the output matrix
    fprintf(file, "%u %u\n", rows, cols);

    // Write output matrix elements
    print_matrix(output, rows, cols, file);

    fclose(file);
}

void initialize_output(unsigned* output, unsigned output_rows, unsigned output_cols) {
    int i;
    for (i = 0; i < output_cols * output_rows; i++)
        output[i] = 0;
    
}

