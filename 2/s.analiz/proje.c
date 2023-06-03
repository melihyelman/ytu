#include <math.h>
#include <stdio.h>
#include <stdlib.h>

void freeMemory(double** matrix, int length);
double calculateFunction(double x, double*** polynomialFunction, int* polynmoialLength);
void printPolynomials(double*** polynomialFunctionPtr, int* polynomialLengthPtr);
void getFunctionParams(double*** polynomialFunctionPntr, int* polynmoialLengthPntr);
void getMatrixParams(double*** matrixPtr, int* matrixLengthPtr);
void printMatrix(double*** matrix, int* matrixLength);
void swapRows(double** matrix, int matrixLength, double* equationMatrix, int row1, int row2);
double determinant(double*** matrixPtr, int* matrixLengthPtr);
double bisection(double*** matrixPtr, int* matrixLengthPtr, double start, double end, double epsilon, int stoppingCriterion, int maxIteration);
double regulaFalsi(double*** matrixPtr, int* matrixLengthPtr, double start, double end, double epsilon, int stoppingCriterion, int maxIteration);
double newtonRaphson(double*** matrixPtr, int* matrixLengthPtr, double x, double epsilon, int maxIteration);
void inverseMatrix(double*** matrixPtr, int* matrixLengthPtr, double*** idMatrixPtr);
void gaussElemination(double** matrixPtr, int matrixLengthPtr, double* equationMatrixPtr, double* resultMatrixPtr);
void gaussSeidel(double** matrix, int matrixLength, double* equationMatrix, double* resultMatrix, double epsilon, int maxIteration);
double numericalDifferentiation(double*** matrixPtr, int* matrixLengthPtr, int type, double xi, double h);
double trapezodial(double*** matrixPtr, int* matrixLengthPtr, double start, double end, int n);
double simpsons13(double*** matrixPtr, int* matrixLengthPtr, double start, double end, int n);
double simpsons38(double*** matrixPtr, int* matrixLengthPtr, double start, double end, int n);
double gregoryNewton(double* x, double* y, int n, double x0);

int main() {
    double** polynomialFunction = NULL;
    double** matrix = NULL;
    int matrixLength = 0;
    int polynmoialLength = 0;
    int method;

    do {
        printf("\n\nQuit: 0\nBisection: 1\nRegula-Falsi: 2\nNewton Raphson: 3\nInverse Matris: 4\nGauss Elemination: 5\nGauss Seidal: 6\nNumerical Differantiation: 7\nSimpson's Rule: 8\nTrapezodial Rule:9\nGregory-Newton: 10\nChoice: ");
        scanf(" %d", &method);
        if (method == 1) {
            system("cls");
            double start, end, epsilon, result;
            int maxIteration, stoppingCriterion;
            printf("Bisection\n");
            getFunctionParams(&polynomialFunction, &polynmoialLength);

            printf("\nStart: ");
            scanf("%lf", &start);
            printf("End: ");
            scanf("%lf", &end);
            printf("Epsilon: ");
            scanf("%lf", &epsilon);
            printf("Stopping criterion: \nf(x) <= epsilon: 1\n(end-start)/2^n <= epsilon: 2\nChoice: ");
            scanf("%d", &stoppingCriterion);
            printf("Max Iteration: ");
            scanf("%d", &maxIteration);
            result = bisection(&polynomialFunction, &polynmoialLength, start, end, epsilon, stoppingCriterion, maxIteration);
            if (result != -99.99) {
                printf("\nRoot: %lf", result);
            }

            freeMemory(polynomialFunction, polynmoialLength);

        } else if (method == 2) {
            system("cls");
            double start, end, epsilon, result;
            int maxIteration, stoppingCriterion;
            printf("Regula-Falsi\n");
            getFunctionParams(&polynomialFunction, &polynmoialLength);

            printf("\nStart: ");
            scanf("%lf", &start);
            printf("End: ");
            scanf("%lf", &end);
            printf("Epsilon: ");
            scanf("%lf", &epsilon);
            printf("Stopping criterion: \nf(x) <= epsilon: 1\n(end-start)/2^n <= epsilon: 2\nChoice: ");
            scanf("%d", &stoppingCriterion);
            printf("Max Iteration: ");
            scanf("%d", &maxIteration);

            result = regulaFalsi(&polynomialFunction, &polynmoialLength, start, end, epsilon, stoppingCriterion, maxIteration);
            if (result != -99.99) {
                printf("\nRoot: %lf", result);
            }

            freeMemory(polynomialFunction, polynmoialLength);
        } else if (method == 3) {
            system("cls");
            double x, epsilon, result;
            int maxIteration;
            printf("Newton Raphson\n");
            getFunctionParams(&polynomialFunction, &polynmoialLength);

            printf("\nStart: ");
            scanf("%lf", &x);
            printf("Epsilon: ");
            scanf("%lf", &epsilon);
            printf("Max Iteration: ");
            scanf("%d", &maxIteration);

            result = newtonRaphson(&polynomialFunction, &polynmoialLength, x, epsilon, maxIteration);
            if (result != -99.99) {
                printf("\nRoot: %lf", result);
            }

            freeMemory(polynomialFunction, polynmoialLength);
        } else if (method == 4) {
            system("cls");
            double** idMatrix = NULL;
            int i, j;
            printf("Inverse Matrix\n");

            getMatrixParams(&matrix, &matrixLength);

            idMatrix = (double**)malloc(matrixLength * sizeof(double*));

            for (i = 0; i < matrixLength; i++) {
                idMatrix[i] = (double*)malloc(matrixLength * sizeof(double));
                for (j = 0; j < matrixLength; j++) {
                    if (i == j) {
                        idMatrix[i][j] = 1;
                    } else {
                        idMatrix[i][j] = 0;
                    }
                }
            }

            if (determinant(&matrix, &matrixLength) == 0) {
                printf("Determinant cannot be 0!\n");
            } else {
                inverseMatrix(&matrix, &matrixLength, &idMatrix);
                printf("Inverse Matrix: [\n");
                printMatrix(&idMatrix, &matrixLength);
                printf("]\n");
            }

            freeMemory(matrix, matrixLength);
        } else if (method == 5) {
            system("cls");
            int i;
            double* equationMatrix = NULL;
            double* resultMatrix = NULL;
            printf("Gauss Elemination\nFirstly, enter the coefficients matrix then enter the equation matrix.\n");

            getMatrixParams(&matrix, &matrixLength);

            equationMatrix = (double*)malloc(matrixLength * sizeof(double));
            resultMatrix = (double*)malloc(matrixLength * sizeof(double));
            printf("Equation Matrix: \n");
            for (i = 0; i < matrixLength; i++) {
                printf("c%d: ", i + 1);
                scanf("%lf", &equationMatrix[i]);
            }

            gaussElemination(matrix, matrixLength, equationMatrix, resultMatrix);

            printf("Result Matrix: [\n");
            for (i = 0; i < matrixLength; i++) {
                printf("%lf\n", resultMatrix[i]);
            }
            printf("]\n");

            freeMemory(matrix, matrixLength);
            free(equationMatrix);
            free(resultMatrix);

        } else if (method == 6) {
            system("cls");
            printf("Gauss Seidell\n");
            system("cls");
            int i;
            double* equationMatrix = NULL;
            double* resultMatrix = NULL;
            double epsilon;
            int maxIteration;
            printf("Gauss Seidel\nFirstly, enter the coefficients matrix then enter the equation matrix.\n");

            getMatrixParams(&matrix, &matrixLength);

            equationMatrix = (double*)malloc(matrixLength * sizeof(double));
            resultMatrix = (double*)malloc(matrixLength * sizeof(double));

            printf("\nEquation Matrix: \n");
            for (i = 0; i < matrixLength; i++) {
                printf("c%d: ", i + 1);
                scanf("%lf", &equationMatrix[i]);
            }

            printf("\nInitial Variables: \n");
            for (i = 0; i < matrixLength; i++) {
                printf("Variable %d: ", i + 1);
                scanf("%lf", &resultMatrix[i]);
            }

            printf("\nEpsilon: ");
            scanf("%lf", &epsilon);
            printf("Max Iteration: ");
            scanf("%d", &maxIteration);

            gaussSeidel(matrix, matrixLength, equationMatrix, resultMatrix, epsilon, maxIteration);

            printf("\nResult Matrix: [\n");
            for (i = 0; i < matrixLength; i++) {
                printf("%lf\n", resultMatrix[i]);
            }
            printf("]\n");

            freeMemory(matrix, matrixLength);
            free(equationMatrix);
            free(resultMatrix);
        } else if (method == 7) {
            system("cls");
            double backward, forward, center, xi, h;

            printf("Numerical Differantiation\n");
            getFunctionParams(&polynomialFunction, &polynmoialLength);
            printf("\nXi: ");
            scanf("%lf", &xi);
            printf("\nh: ");
            scanf("%lf", &h);

            forward = numericalDifferentiation(&polynomialFunction, &polynmoialLength, 1, xi, h);
            backward = numericalDifferentiation(&polynomialFunction, &polynmoialLength, 2, xi, h);
            center = numericalDifferentiation(&polynomialFunction, &polynmoialLength, 3, xi, h);

            printf("\nCalculation of forward differencing: %lf\nCalculation of backward differencing: %lf\nCalculation of center differencing: %lf\n", forward, backward, center);

            freeMemory(polynomialFunction, polynmoialLength);
        } else if (method == 8) {
            system("cls");
            double start, end, result13, result38, h;
            int i, n;

            printf("Simpson's Rule\n");
            getFunctionParams(&polynomialFunction, &polynmoialLength);

            printf("\nStart: ");
            scanf("%lf", &start);
            printf("\nEnd: ");
            scanf("%lf", &end);
            printf("\nThe Count of Fields: ");
            scanf("%d", &n);

            result13 = simpsons13(&polynomialFunction, &polynmoialLength, start, end, n);
            result38 = simpsons38(&polynomialFunction, &polynmoialLength, start, end, n);
            if (result13 != -999.999) {
                printf("\nSimpson's 1/3 calculation result is: %lf", result13);
            } else {
                printf("\nSimpson methods require even number of fields");
            }
            if (result38 != -999.999) {
                printf("\nSimpson's 3/8 calculation result is: %lf", result38);
            } else {
                printf("\nSimpson (3/8) methods require number of fields that is divisible by 3");
            }

            freeMemory(polynomialFunction, polynmoialLength);
        } else if (method == 9) {
            system("cls");
            double start, end, result = 0;
            int n;

            printf("Trapezodial Rule\n");
            getFunctionParams(&polynomialFunction, &polynmoialLength);

            printf("\nStart: ");
            scanf("%lf", &start);
            printf("\nEnd: ");
            scanf("%lf", &end);
            printf("\nThe Count of Fields: ");
            scanf("%d", &n);
            result = trapezodial(&polynomialFunction, &polynmoialLength, start, end, n);

            printf("\nTrapezodial calculation result is: %lf", result);

            freeMemory(polynomialFunction, polynmoialLength);
        } else if (method == 10) {
            system("cls");
            int n, i;
            double x0, result;
            double* x = NULL;
            double* y = NULL;
            printf("Gregory-Newton\n");

            printf("N: ");
            scanf("%d", &n);

            x = (double*)malloc(n * sizeof(double));
            y = (double*)malloc(n * sizeof(double));

            for (i = 0; i < n; i++) {
                printf("x%d: ", i + 1);
                scanf("%lf", &x[i]);
                printf("y%d: ", i + 1);
                scanf("%lf", &y[i]);
            }

            printf("X0: ");
            scanf("%lf", &x0);

            result = gregoryNewton(x, y, n, x0);

            printf("The interpolated value at %lf is %lf\n", x0, result);

        } else if (method != 0) {
            system("cls");
            printf("Out of range\n");
        }
    } while (method != 0);

    return 0;
}

void freeMemory(double** matrix, int length) {
    int i;
    for (i = 0; i < length; i++) {
        free(matrix[i]);
    }
    free(matrix);
}

double calculateFunction(double x, double*** polynomialFunction, int* polynmoialLength) {
    double sum = 0;
    int i;
    for (i = 0; i < (*polynmoialLength); i++) {
        sum += (*polynomialFunction)[i][0] * pow(x, (*polynomialFunction)[i][1]);
    }
    return sum;
}

void printPolynomials(double*** polynomialFunctionPtr, int* polynomialLengthPtr) {
    int i;
    for (i = 0; i < (*polynomialLengthPtr); i++) {
        double coefficient = (*polynomialFunctionPtr)[i][0];
        double exponent = (*polynomialFunctionPtr)[i][1];
        if (coefficient < 0) {
            printf("- ");
            coefficient *= -1;
        } else if (i != 0) {
            printf("+ ");
        }
        if (exponent == 0) {
            printf("%lf ", coefficient);
        } else if (exponent == 1) {
            printf("%lf* x ", coefficient);
        } else {
            printf("%lf* x ^%lf ", coefficient, exponent);
        }
    }
    printf("\n");
}

void getFunctionParams(double*** polynomialFunctionPtr, int* polynomialLengthPtr) {
    int i;
    printf("Enter the length of the polynomial function: ");
    scanf("%d", polynomialLengthPtr);

    *polynomialFunctionPtr = (double**)malloc((*polynomialLengthPtr) * sizeof(double*));

    for (i = 0; i < (*polynomialLengthPtr); i++) {
        (*polynomialFunctionPtr)[i] = (double*)malloc(2 * sizeof(double));
    }

    for (i = 0; i < (*polynomialLengthPtr); i++) {
        printf("\npolynomial: x_coef * x ^ x_exp\n");
        printf("Enter the coefficient: ");
        scanf("%lf", &((*polynomialFunctionPtr)[i][0]));

        printf("Enter the power: ");
        scanf("%lf", &((*polynomialFunctionPtr)[i][1]));

        printf("Added: %lf * x ^ %lf\n", (*polynomialFunctionPtr)[i][0], (*polynomialFunctionPtr)[i][1]);
    }
    printf("Function: ");
    printPolynomials(polynomialFunctionPtr, polynomialLengthPtr);
}

void getMatrixParams(double*** matrixPtr, int* matrixLengthPtr) {
    int i, j;
    printf("Enter the length of the matrix: ");
    scanf("%d", matrixLengthPtr);

    *matrixPtr = (double**)malloc((*matrixLengthPtr) * sizeof(double*));

    for (i = 0; i < (*matrixLengthPtr); i++) {
        (*matrixPtr)[i] = (double*)malloc((*matrixLengthPtr) * sizeof(double));
    }
    for (i = 0; i < (*matrixLengthPtr); i++) {
        for (j = 0; j < (*matrixLengthPtr); j++) {
            printf("\nMatrix[%d][%d]: ", i, j);
            scanf("%lf", &((*matrixPtr)[i][j]));
        }
    }
    printf("\nOriginal Matrix: [\n");
    printMatrix(matrixPtr, matrixLengthPtr);
    printf("]\n");
}

void printMatrix(double*** matrixPtr, int* matrixLengthPtr) {
    int i, j;
    for (i = 0; i < (*matrixLengthPtr); i++) {
        for (j = 0; j < (*matrixLengthPtr); j++) {
            printf("%lf\t", (*matrixPtr)[i][j]);
        }
        printf("\n");
    }
}

double determinant(double*** matrixPtr, int* matrixLengthPtr) {
    int i, j, k;
    double det = 1, factor;
    double** tempArray = (double**)malloc((*matrixLengthPtr) * sizeof(double*));

    for (i = 0; i < (*matrixLengthPtr); i++) {
        tempArray[i] = (double*)malloc((*matrixLengthPtr) * sizeof(double));
    }

    for (i = 0; i < (*matrixLengthPtr); i++) {
        for (j = 0; j < (*matrixLengthPtr); j++) {
            tempArray[i][j] = (*matrixPtr)[i][j];
        }
    }

    for (i = 0; i < (*matrixLengthPtr); i++) {
        if (tempArray[i][i] == 0) {
            for (j = i + 1; j < (*matrixLengthPtr); j++) {
                if (tempArray[j][i] != 0) {
                    for (k = 0; k < (*matrixLengthPtr); k++) {
                        float temp = tempArray[i][k];
                        tempArray[i][k] = tempArray[j][k];
                        tempArray[j][k] = temp;
                    }
                    det *= -1;
                }
            }
        }
        for (j = i + 1; j < (*matrixLengthPtr); j++) {
            factor = tempArray[j][i] / tempArray[i][i];
            for (k = i; k < (*matrixLengthPtr); k++) {
                tempArray[j][k] -= factor * tempArray[i][k];
            }
        }
    }

    for (i = 0; i < (*matrixLengthPtr); i++) {
        det *= tempArray[i][i];
    }

    printf("\nDeterminant: %lf\n", det);
    freeMemory(tempArray, *matrixLengthPtr);
    return det;
}

void swapRows(double** matrix, int matrixLength, double* equationMatrix, int row1, int row2) {
    double* tempRow = (double*)malloc(matrixLength * sizeof(double));
    double tempValue;
    int i;

    for (i = 0; i < matrixLength; i++) {
        tempRow[i] = matrix[row1][i];
        matrix[row1][i] = matrix[row2][i];
        matrix[row2][i] = tempRow[i];
    }

    tempValue = equationMatrix[row1];
    equationMatrix[row1] = equationMatrix[row2];
    equationMatrix[row2] = tempValue;

    free(tempRow);
}

double bisection(double*** matrixPtr, int* matrixLengthPtr, double start, double end, double epsilon, int stoppingCriterion, int maxIteration) {
    int flag = 1;
    if (calculateFunction(start, matrixPtr, matrixLengthPtr) * calculateFunction(end, matrixPtr, matrixLengthPtr) > 0) {
        printf("\nBisection method cannot give a result for the given interval.\n");
        flag = 0;
    }
    if (flag == 1) {
        double mid = (start + end) / 2;
        int iteration = 1;
        double myEpsilon = 1;
        printf("\nstart: %lf\nend: %lf\nmid: %lf\nf(start): %lf\nf(end): %lf\nf(mid): %lf\niteration: %d\n", start, end, mid, calculateFunction(start, matrixPtr, matrixLengthPtr), calculateFunction(end, matrixPtr, matrixLengthPtr), calculateFunction(mid, matrixPtr, matrixLengthPtr), iteration);
        while (myEpsilon >= epsilon && iteration < maxIteration) {
            if (calculateFunction(start, matrixPtr, matrixLengthPtr) * calculateFunction(mid, matrixPtr, matrixLengthPtr) < 0) {
                end = mid;
            } else {
                start = mid;
            }

            mid = (start + end) / 2;
            if (stoppingCriterion == 1) {
                myEpsilon = fabs(calculateFunction(mid, matrixPtr, matrixLengthPtr));
            } else {
                myEpsilon = fabs((end - start) / pow(2, iteration));
            }
            printf("\nstart: %lf\nend: %lf\nmid: %lf\nf(start): %lf\nf(end): %lf\nf(mid): %lf\niteration: %d\n", start, end, mid, calculateFunction(start, matrixPtr, matrixLengthPtr), calculateFunction(end, matrixPtr, matrixLengthPtr), calculateFunction(mid, matrixPtr, matrixLengthPtr), (iteration + 1));
            iteration++;
        }
        return mid;
    }
    return -99.99;
}

double regulaFalsi(double*** matrixPtr, int* matrixLengthPtr, double start, double end, double epsilon, int stoppingCriterion, int maxIteration) {
    int flag = 1;
    double fStart = calculateFunction(start, matrixPtr, matrixLengthPtr);
    double fEnd = calculateFunction(end, matrixPtr, matrixLengthPtr);
    if (fStart == 0) {
        printf("\nstart is already a root.\n");
        return start;
    }
    if (fEnd == 0) {
        printf("\nend is already a root.\n");
        return end;
    }
    if (fStart * fEnd > 0) {
        printf("\nRegula Falsi method cannot give a result for the given interval.\n");
        flag = 0;
    }

    if (flag == 1) {
        double c = (start * fEnd - end * fStart) / (fEnd - fStart);
        int iteration = 1;
        double myEpsilon = 1;
        printf("\nstart: %lf\nend: %lf\nc: %lf\nf(start): %lf\nf(end): %lf\nf(c): %lf\niteration: %d\n", start, end, c, fStart, fEnd, calculateFunction(c, matrixPtr, matrixLengthPtr), iteration);
        while (myEpsilon >= epsilon && iteration < maxIteration) {
            if (fStart * calculateFunction(c, matrixPtr, matrixLengthPtr) < 0) {
                end = c;
                fEnd = calculateFunction(end, matrixPtr, matrixLengthPtr);
            } else {
                start = c;
                fStart = calculateFunction(start, matrixPtr, matrixLengthPtr);
            }
            c = (start * fEnd - end * fStart) / (fEnd - fStart);
            iteration++;
            if (stoppingCriterion == 1) {
                myEpsilon = fabs(calculateFunction(c, matrixPtr, matrixLengthPtr));
            } else {
                myEpsilon = fabs((end - start) / pow(2, iteration));
            }
            printf("\nstart: %lf\nend: %lf\nc: %lf\nf(start): %lf\nf(end): %lf\nf(c): %lf\niteration: %d\n", start, end, c, fStart, fEnd, calculateFunction(c, matrixPtr, matrixLengthPtr), iteration);
        }
        return c;
    }
    return -99.99;
}

double newtonRaphson(double*** matrixPtr, int* matrixLengthPtr, double x, double epsilon, int maxIteration) {
    int flag = 1;

    if (flag == 1) {
        int iteration = 1;
        printf("\nx: %lf\nf(x): %lf\nf'(x): %lf\niteration: %d\n", x, calculateFunction(x, matrixPtr, matrixLengthPtr), numericalDifferentiation(matrixPtr, matrixLengthPtr, 2, x, 0.1), iteration);
        while (fabs(calculateFunction(x, matrixPtr, matrixLengthPtr)) > epsilon && iteration < maxIteration) {
            x = x - (calculateFunction(x, matrixPtr, matrixLengthPtr) / numericalDifferentiation(matrixPtr, matrixLengthPtr, 2, x, 0.1));
            iteration++;
            printf("\nx: %lf\nf(x): %lf\nf'(x): %lf\niteration: %d\n", x, calculateFunction(x, matrixPtr, matrixLengthPtr), numericalDifferentiation(matrixPtr, matrixLengthPtr, 2, x, 0.1), iteration);
        }
        return x;
    }
    return -99.99;
}

void inverseMatrix(double*** matrixPtr, int* matrixLengthPtr, double*** idMatrixPtr) {
    int i, j, k, x, y;

    for (k = 0; k < (*matrixLengthPtr); k++) {
        double pivot = (*matrixPtr)[k][k];
        if (pivot == 0) {
            for (x = k + 1; x < (*matrixLengthPtr); x++) {
                if ((*matrixPtr)[x][k] != 0) {
                    for (y = 0; y < (*matrixLengthPtr); y++) {
                        double temp = (*matrixPtr)[k][y];
                        (*matrixPtr)[k][y] = (*matrixPtr)[x][y];
                        (*matrixPtr)[x][y] = temp;
                        temp = (*idMatrixPtr)[k][y];
                        (*idMatrixPtr)[k][y] = (*idMatrixPtr)[x][y];
                        (*idMatrixPtr)[x][y] = temp;
                    }
                    pivot = (*matrixPtr)[k][k];
                }
                if (pivot != 0) {
                    x = (*matrixLengthPtr);
                }
            }
        }
        for (j = 0; j < (*matrixLengthPtr); j++) {
            (*matrixPtr)[k][j] /= pivot;
            (*idMatrixPtr)[k][j] /= pivot;
        }

        for (i = 0; i < (*matrixLengthPtr); i++) {
            if (i != k) {
                double factor = (*matrixPtr)[i][k];
                for (j = 0; j < (*matrixLengthPtr); j++) {
                    (*matrixPtr)[i][j] -= factor * (*matrixPtr)[k][j];
                    (*idMatrixPtr)[i][j] -= factor * (*idMatrixPtr)[k][j];
                }
            }
        }
    }
}

void gaussElemination(double** matrix, int matrixLength, double* equationMatrix, double* resultMatrix) {
    int i, j, k;
    double factor;
    int found;

    for (i = 0; i < matrixLength - 1; i++) {
        if (matrix[i][i] == 0) {
            found = 0;
            for (j = i + 1; j < matrixLength; j++) {
                if (matrix[j][i] != 0) {
                    swapRows(matrix, matrixLength, equationMatrix, i, j);
                    found = 1;
                }
            }
            if (!found) {
                printf("\nDeterminant cannot be 0!\n");
                exit(1);
            }
        }
        for (j = i + 1; j < matrixLength; j++) {
            factor = matrix[j][i] / matrix[i][i];
            for (k = 0; k < matrixLength; k++) {
                matrix[j][k] -= factor * matrix[i][k];
            }
            equationMatrix[j] -= factor * equationMatrix[i];
        }
    }

    for (i = matrixLength - 1; i >= 0; i--) {
        resultMatrix[i] = equationMatrix[i];
        for (j = i + 1; j < matrixLength; j++) {
            resultMatrix[i] -= matrix[i][j] * resultMatrix[j];
        }
        resultMatrix[i] /= matrix[i][i];
    }
}

void gaussSeidel(double** matrix, int matrixLength, double* equationMatrix, double* resultMatrix, double epsilon, int maxIteration) {
    int iteration = 0, i, j;
    double error = epsilon + 1;

    for (i = 0; i < matrixLength; i++) {
        int maxRow = i;
        double maxValue = fabs(matrix[i][i]);
        for (j = i + 1; j < matrixLength; j++) {
            if (fabs(matrix[j][i]) > maxValue) {
                maxRow = j;
                maxValue = fabs(matrix[j][i]);
            }
        }
        if (maxValue == 0) {
            printf("\nThere is a zero value on the diagonal of the matrix. Please check your matrix.\n");
            return;
        }
        if (maxRow != i) {
            for (j = 0; j < matrixLength; j++) {
                double temp = matrix[i][j];
                matrix[i][j] = matrix[maxRow][j];
                matrix[maxRow][j] = temp;
            }
            double temp = equationMatrix[i];
            equationMatrix[i] = equationMatrix[maxRow];
            equationMatrix[maxRow] = temp;
        }
    }

    while (error > epsilon && iteration < maxIteration) {
        iteration++;
        error = 0;
        for (i = 0; i < matrixLength; i++) {
            double sum = 0;
            for (j = 0; j < matrixLength; j++) {
                if (i != j) {
                    sum += matrix[i][j] * resultMatrix[j];
                }
            }
            double temp = (equationMatrix[i] - sum) / matrix[i][i];
            error += fabs(resultMatrix[i] - temp);
            resultMatrix[i] = temp;
        }
    }
}

double numericalDifferentiation(double*** matrixPtr, int* matrixLengthPtr, int type, double xi, double h) {
    double result;

    if (type == 1) {
        result = (calculateFunction(xi + h, matrixPtr, matrixLengthPtr) - calculateFunction(xi, matrixPtr, matrixLengthPtr)) / h;
    } else if (type == 2) {
        result = (calculateFunction(xi, matrixPtr, matrixLengthPtr) - calculateFunction(xi - h, matrixPtr, matrixLengthPtr)) / h;
    } else {
        result = (calculateFunction(xi + h, matrixPtr, matrixLengthPtr) - calculateFunction(xi - h, matrixPtr, matrixLengthPtr)) / (2 * h);
    }
    return result;
}

double trapezodial(double*** matrixPtr, int* matrixLengthPtr, double start, double end, int n) {
    double result = 0, h;
    int i;

    h = (end - start) / n;
    result += 0.5 * (calculateFunction(start, matrixPtr, matrixLengthPtr) + calculateFunction(end, matrixPtr, matrixLengthPtr));

    for (i = 1; i < n; i++) {
        result += calculateFunction((start + (h * i)), matrixPtr, matrixLengthPtr);
    }

    result *= h;
    return result;
}

double simpsons13(double*** matrixPtr, int* matrixLengthPtr, double start, double end, int n) {
    double result = 0, h;
    int i;
    double y[n + 1];

    h = (end - start) / n;

    for (i = 0; i <= n; i++) {
        y[i] = calculateFunction((start + i * h), matrixPtr, matrixLengthPtr);
    }
    for (i = 1; i < n; i += 2) {
        result += 4 * y[i];
    }
    for (i = 2; i < (n - 1); i += 2) {
        result += 2 * y[i];
    }

    result = (h / 3) * (y[0] + y[n] + result);
    if (n % 2 == 0) {
        return result;
    }
    return -999.999;
}

double simpsons38(double*** matrixPtr, int* matrixLengthPtr, double start, double end, int n) {
    double result = 0, h;
    int i;
    double y[n + 1];

    h = (end - start) / n;
    result += calculateFunction(start, matrixPtr, matrixLengthPtr) + calculateFunction(end, matrixPtr, matrixLengthPtr);

    for (i = 1; i < n; i++) {
        if (i % 3 == 0) {
            result += 2 * calculateFunction(start + (i * h), matrixPtr, matrixLengthPtr);
        } else {
            result += 3 * calculateFunction(start + (i * h), matrixPtr, matrixLengthPtr);
        }
    }

    result = (3 * h / 8) * result;
    if (n % 3 == 0) {
        return result;
    }

    return -999.999;
}

double gregoryNewton(double* x, double* y, int n, double x0) {
    int i, j;
    double result = y[0];

    double diff[n][n];
    for (i = 0; i < n; i++) {
        diff[i][0] = y[i];
    }
    for (j = 1; j < n; j++) {
        for (i = 0; i < n - j; i++) {
            diff[i][j] = diff[i + 1][j - 1] - diff[i][j - 1];
        }
    }

    double h = x[1] - x[0];

    double p = (x0 - x[0]) / h;

    for (i = 1; i < n; i++) {
        int fact = 1;
        for (j = 1; j <= i; j++) {
            fact *= j;
        }

        double prod = 1;
        for (j = 0; j < i; j++) {
            prod *= (p - j);
        }

        result += (prod * diff[0][i]) / fact;
    }

    return result;
}
