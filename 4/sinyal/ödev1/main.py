
def myConvx(x,y):
    conv = [0]*(len(x)+len(y)-1)
    for i in range(len(x)):
        for j in range(len(y)):
            conv[i+j] += x[i]*y[j]
    return conv

import numpy as np
def system_response(M):
    h = [0] * (3000 * M + 1)  # h[n] dizisi oluştur
    h[0] = 1
    A = 2

    # h[n] değerlerini hesapla
    for k in range(1, M + 1):
        h[3000 * k] = A ** (-k) * k

    return h

h = system_response(5)
print(f"h[n] = {h}")
print(h[0],h[3000], h[6000], h[9000], h[12000],h[15000])
