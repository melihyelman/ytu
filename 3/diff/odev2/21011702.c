#include <stdio.h>
#include <stdlib.h>
#include <math.h>

#define H 0.1

struct Equation
{
    int n;
    double *coefficients;
    double *forces;
    double coefficientOfDerivativeY;
    double coefficientOfY;
};

double calculateSumOfT(struct Equation equation, double t)
{
    int i;
    double sum = 0.0;
    for (i = 0; i < equation.n; ++i)
    {
        sum += equation.coefficients[i] * pow(t, equation.forces[i]);
    }
    return sum;
}

double rungeKutta(struct Equation equation, double t, double y)
{
    double k1, k2, k3, k4;

    double sum = calculateSumOfT(equation, t);
    k1 = H * ((sum - (equation.coefficientOfY * y)) / equation.coefficientOfDerivativeY);

    sum = calculateSumOfT(equation, t + 0.5 * H);
    k2 = H * ((sum - (equation.coefficientOfY * (y + 0.5 * k1))) / equation.coefficientOfDerivativeY);

    sum = calculateSumOfT(equation, t + 0.5 * H);
    k3 = H * ((sum - (equation.coefficientOfY * (y + 0.5 * k2))) / equation.coefficientOfDerivativeY);

    sum = calculateSumOfT(equation, t + H);
    k4 = H * ((sum - (equation.coefficientOfY * (y + k3))) / equation.coefficientOfDerivativeY);

    return y + (k1 + 2 * k2 + 2 * k3 + k4) / 6.0;
}

int main()
{
    struct Equation equation;
    int i;
    double y, t, targetT;

    printf("Program Ay' + By = P(t) girdileri için tasarlanmistir.\nTerim sayisini giriniz: ");
    scanf("%d", &equation.n);

    equation.coefficients = (double *)malloc(equation.n * sizeof(double));
    equation.forces = (double *)malloc(equation.n * sizeof(double));

    for (i = 0; i < equation.n; ++i)
    {
        printf("Katsayi %d: ", i + 1);
        scanf("%lf", &equation.coefficients[i]);

        printf("Kuvvet %d: ", i + 1);
        scanf("%lf", &equation.forces[i]);
    }

    printf("Türev fonksiyonun katsayisini giriniz: ");
    scanf("%lf", &equation.coefficientOfDerivativeY);

    printf("Fonksiyonun katsayisini giriniz: ");
    scanf("%lf", &equation.coefficientOfY);

    printf("Baslangic degerini giriniz: ");
    scanf("%lf", &t);

    printf("y(%lf) degerini giriniz: ", t);
    scanf("%lf", &y);

    printf("Hedef t degerini giriniz: ");
    scanf("%lf", &targetT);

    printf("\nIterasyonlar ve Yaklasik Cozum:\n");
    printf("t\t\t\t\tY(t)\n");
    printf("-----------------------------------\n");

    if (t < targetT)
    {
        while (t <= targetT)
        {
            printf("%lf\t\t%lf\n", t, y);
            y = rungeKutta(equation, t, y);
            t += H;
        }
    }
    else
    {
        printf("Bitis degeri baslangictan buyuk olmalidir!");
    }
    printf("%lf\t\t%lf\n", t, y);
    free(equation.coefficients);
    free(equation.forces);

    return 0;
}
