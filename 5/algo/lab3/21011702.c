#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct Table {
    char *name;
    char *type;
};

/*
@brief Checks if a given character is space or newline.

@param c the character to check

@return 1 if whitespace, 0 otherwise
*/
int checkSpace(char c) {
    // Check if character is space or newline
    if (c == ' ' || c == '\n') {
        return 1;
    }
    return 0;
}

/*
@brief Checks if a given character is alphanumeric a-z, A-Z, 0-9

@param c the character to check

@return 1 if alphanumeric, 0 otherwise
*/
int checkNumeric(char c) {
    if ((c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        (c >= '0' && c <= '9')) {
        return 1;
    }
    return 0;
}

/*
@brief Hash function

@param key the integer key to hash
@param m size

@return hash value
*/
int h1(int key, int m) {
    return key % m;
}

/*
@brief Hash function

@param key the integer key to hash
@param m2 size 

@return hash value
*/
int h2(int key, int m2) {
    return 1 + (key % m2);
}

/*
@brief Combined double hash function h.

@param key the integer key to hash
@param m size
@param m2 size
@param i the current attempt count

@return the combined hash value
*/
int h(int key, int m, int m2, int i) {
    return (h1(key, m) + i * h2(key, m2)) % m;
}

/*
@brief Computes a hash key for a string using Horner's method.

@param str the input string to hash
@param m the size of the hash table

@return the computed hash value for the given string
*/
int hornerKey(char *str, int m) {
    int h = 0, i = 0;
    int length = (int)strlen(str);
    
    while (i < length) {
        h = (h * 37 + str[i]) % m;
        i = i + 1;
    }
    return h;
}

/*
@brief Checks if a given number is prime.

@param n the number to check

@return 1 if prime, 0 otherwise
*/
int isPrime(int n) {
    if (n <= 1) return 0;

    int i = 2;
    while (i * i <= n) {
        if (n % i == 0) {
            return 0;
        }
        i = i + 1;
    }
    return 1;
}

/*
@brief Finds the next prime number greater than or equal to n.

@param n the starting number

@return the next prime number >= n
*/
int findNextPrime(int n) {
    int found = 0;
    while (found == 0) {
        if (isPrime(n) == 1) {
            found = 1;
        } else {
            n = n + 1;
        }
    }
    return n;
}

/*
@brief Creates a hash table of a given size

@param size the size of the table

@return pointer to the created table
*/
struct Table *createTable(int size) {
    struct Table *table = (struct Table *)malloc(size * sizeof(struct Table));
    if (table == NULL) {
        printf("Memory error!\n");
        return NULL; 
    }
    int i = 0;
    while (i < size) {
        table[i].name = NULL;
        table[i].type = NULL;
        i = i + 1;
    }
    return table;
}

/*
@brief Looks up a variable name in the hash table and returns its index if found.

@param table the hash table
@param size the size of the table
@param name the variable name to look up

@return index of the variable in the table, or -1 if not found
*/
int lookup(struct Table *table, int size, char *name) {
    int key = hornerKey(name, size);
    int m = size;
    int m2 = m - 3;
    int i = 0;
    while (i < m) {
        int index = h(key, m, m2, i);
        if (table[index].name == NULL) {
            return -1;
        }
        if (strcmp(table[index].name, name) == 0) {
            return index;
        }
        i = i + 1;
    }
    return -1;
}

/*
@brief Inserts a new variable with its type into the hash table if it does not already exist.

@param table the hash table
@param size the size of the table
@param name the variable name to insert
@param type the type of the variable
@param debug if 1, prints debug messages

@return the index at which the variable is inserted, or -1 if insertion fails
*/
int insert(struct Table *table, int size, char *name, char *type, int debug) {
    if (lookup(table, size, name) != -1) {
        printf("%s variable is already declared.\n", name);
        return -1;
    }

    int key = hornerKey(name, size);
    int m = size;
    int m2 = m - 3;
    int i = 0;
    while (i < m) {
        int index = h(key, m, m2, i);
        if (table[index].name == NULL) {
            table[index].name = strdup(name);
            table[index].type = strdup(type);
            if (debug == 1) {
                printf("DEBUG: %s (%s) initial=%d, placed=%d\n",
                       name, type, h(key, m, m2, 0), index);
            }
            return index;
        }
        i = i + 1;
    }

    printf("Table is full, %s variable could not be inserted.\n", name);
    return -1;
}

/*
@brief Guess the count of declared variables

@param filename the name of the file to read

@return the count of declared variables starting with '_'
*/
int calculateVariableCount(const char *filename) {
    FILE *file = fopen(filename, "r");
    if (file == NULL) {
        printf("File could not be opened!\n");
        return 0;
    }

    char *line = NULL;
    char buffer[1024];
    int count = 0;

    while (fgets(buffer, sizeof(buffer), file) != NULL) {
        free(line);
        line = strdup(buffer);

        char *tempLine = strdup(line);
        if (tempLine != NULL) {
            char *varType = NULL;
            varType = strstr(tempLine, "int ");
            if (varType == NULL) {
                varType = strstr(tempLine, "float ");
                if (varType == NULL) {
                    varType = strstr(tempLine, "char ");
                }
            }

            if (varType != NULL) {
                int offset = 0;
                if (strncmp(varType, "int ",4) == 0) offset = 3;
                else if (strncmp(varType, "float ",6) == 0) offset = 5;
                else if (strncmp(varType, "char ",5) == 0) offset = 4;

                char *startVar = varType + offset;
                while (*startVar != '\0' && checkSpace(*startVar) == 1) startVar++;

                char *endVar = strchr(startVar, ';');
                if (endVar != NULL) {
                    *endVar = '\0';
                    
                    char *savePtr = NULL;
                    char *token = strtok_r(startVar, ",", &savePtr);
                    while (token != NULL) {
                        while (*token != '\0' && checkSpace(*token) == 1) token++;

                        int tokenLength = (int)strlen(token);
                        while (tokenLength > 0 && checkSpace(token[tokenLength - 1]) == 1) {
                            token[tokenLength - 1] = '\0';
                            tokenLength--;
                        }

                        char *equationPtr = strchr(token, '=');
                        if (equationPtr != NULL) {
                            *equationPtr = '\0';
                        }

                        tokenLength = (int)strlen(token);
                        while (tokenLength > 0 && checkSpace(token[tokenLength - 1]) == 1) {
                            token[tokenLength - 1] = '\0';
                            tokenLength--;
                        }

                        if (token[0] == '_') {
                            count++;
                        }
                        token = strtok_r(NULL, ",", &savePtr);
                    }
                }
            }
            free(tempLine);
        }
    }

    free(line);
    fclose(file);
    return count;
}

/*
@brief Checks a file for variables declared and used the symbol table accordingly.

@param filename the name of the file to check
@param table the symbol table
@param size the size of the symbol table
@param debug if 1, prints debug information
*/
void checkFile(const char *filename, struct Table *table, int size, int debug) {
    FILE *file = fopen(filename, "r");
    if (file == NULL) {
        printf("File could not be opened!\n");
        return;
    }

    fseek(file, 0, SEEK_SET);

    char buffer[1024];
    char *line = NULL;

    while (fgets(buffer, sizeof(buffer), file) != NULL) {
        free(line);
        line = strdup(buffer);

        char *tempLine = strdup(line);
        if (tempLine != NULL) {
            char *varType = strstr(tempLine, "int ");
            if (varType == NULL) {
                varType = strstr(tempLine, "float ");
                if (varType == NULL) {
                    varType = strstr(tempLine, "char ");
                }
            }

            if (varType != NULL) {
                char *varTypeStr = NULL;
                if (strncmp(varType, "int ", 4) == 0) varTypeStr = strdup("int");
                else if (strncmp(varType, "float ", 6) == 0) varTypeStr = strdup("float");
                else if (strncmp(varType, "char ", 5) == 0) varTypeStr = strdup("char");

                if (varTypeStr != NULL) {
                    int offset = 0;
                    if (strcmp(varTypeStr, "int") == 0) offset = 3;
                    else if (strcmp(varTypeStr, "float") == 0) offset = 5;
                    else if (strcmp(varTypeStr, "char") == 0) offset = 4;

                    char *startVar = varType + offset;
                    while (*startVar != '\0' && checkSpace(*startVar) == 1) startVar++;

                    char *endVar = strchr(startVar, ';');
                    if (endVar != NULL) {
                        *endVar = '\0';

                        char *savePtr = NULL;
                        char *token = strtok_r(startVar, ",", &savePtr);
                        while (token != NULL) {
                            while (*token != '\0' && checkSpace(*token) == 1) token++;

                            int tokenLength = (int)strlen(token);
                            while (tokenLength > 0 && checkSpace(token[tokenLength - 1]) == 1) {
                                token[tokenLength - 1] = '\0';
                                tokenLength--;
                            }

                            char *equationPtr = strchr(token, '=');
                            if (equationPtr != NULL) {
                                *equationPtr = '\0';
                            }

                            tokenLength = (int)strlen(token);
                            while (tokenLength > 0 && checkSpace(token[tokenLength - 1]) == 1) {
                                token[tokenLength - 1] = '\0';
                                tokenLength--;
                            }

                            if (token[0] == '_') {
                                insert(table, size, token, varTypeStr, debug);
                            }

                            token = strtok_r(NULL, ",", &savePtr);
                        }
                    }
                    free(varTypeStr);
                }
            }
            free(tempLine);
        }
    }

    fseek(file, 0, SEEK_SET);
    free(line);
    line = NULL;

    while (fgets(buffer, sizeof(buffer), file) != NULL) {
        free(line);
        line = strdup(buffer);

        char *lineChar = line;
        while (*lineChar != '\0') {
            if (*lineChar == '_') {
                int varLength = 16;
                char *varName = (char*)malloc(varLength);
                if (varName == NULL) {
                    printf("Memory error!\n");
                    free(line);
                    fclose(file);
                    return;
                }
                int index = 0;

                while (*lineChar != '\0' && (checkNumeric(*lineChar) == 1 || *lineChar == '_')) {
                    if (index + 1 >= varLength) {
                        varLength *= 2;
                        char *tmp = (char*)realloc(varName, varLength);
                        if (tmp == NULL) {
                            printf("Memory error!\n");
                            free(varName);
                            free(line);
                            fclose(file);
                            return;
                        }
                        varName = tmp;
                    }
                    varName[index] = *lineChar;
                    index++;
                    lineChar++;
                }
                varName[index] = '\0';
                if (lookup(table, size, varName) == -1) {
                    printf("%s variable is not declared.\n", varName);
                }
                free(varName);
            } else {
                lineChar++;
            }
        }
    }

    free(line);
    fclose(file);
}

int main(int argc, char *argv[]) {
    if (argc < 3) {
        printf("Usage: %s [NORMAL|DEBUG] filename.c\n", argv[0]);
        return 1;
    }

    int debug = 0;
    if (strcmp(argv[1], "DEBUG") == 0) {
        debug = 1;
    } else {
        if (strcmp(argv[1], "NORMAL") == 0) {
            debug = 0;
        } else {
            printf("Invalid mode. Use NORMAL or DEBUG.\n");
            return 1;
        }
    }

    char *filename = argv[2];

    int variableCount = calculateVariableCount(filename);
    if (debug == 1) {
        printf("Declared variable count (initial estimate): %d\n", variableCount);
    }

    int m = findNextPrime(variableCount * 2 + 1);

    if (debug == 1) {
        printf("Symbol table size m = %d\n", m);
    }

    struct Table *table = createTable(m);
    checkFile(filename, table, m, debug);

    if (debug == 1) {
        printf("\nFinal Symbol Table:\n");
        int i = 0;
        while (i < m) {
            if (table[i].name != NULL) {
                printf("[%d]: %s (%s)\n", i, table[i].name, table[i].type);
            } else {
                printf("[%d]: EMPTY\n", i);
            }
            i = i + 1;
        }
    }

    int i = 0;
    while (i < m) {
        if (table[i].name != NULL) {
            free(table[i].name);
        }
        if (table[i].type != NULL) {
            free(table[i].type);
        }
        i = i + 1;
    }
    free(table);

    return 0;
}
