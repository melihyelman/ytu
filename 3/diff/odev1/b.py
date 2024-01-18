import numpy as np
import re
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt

def loadValues(filePath):
    # Belirtilen dosyadan W değerlerini oku
    with open(filePath, 'r') as file:
        lines = file.readlines()

        # Her bir satırdaki sayıları oku ve bir diziye dönüştür
        values = [list(map(float, line.strip().split())) for line in lines]

    return np.array(values)

def tsneMultiple(valuesList, titles):
    perplexity = 10
    plt.figure(figsize=(8, 6))

    # Her bir W değerleri listesi ve başlık için t-SNE görselleştirmesi yap
    for values, title in zip(valuesList, titles):
        tsne = TSNE(n_components=2, random_state=42, perplexity=perplexity)
        wTsne = tsne.fit_transform(values)

        # 2D t-SNE uzayında scatter plot çiz
        plt.scatter(wTsne[:, 0], wTsne[:, 1], label=title)

    # Grafiği düzenle
    plt.title(f'Optimization Process Visualization in 2D')
    plt.legend()
    plt.show()

def main():
    # Her bir optimizasyon algoritması için W değerlerinin dosya adlarını belirle
    gdFiles = ["gd_w1.txt", "gd_w2.txt", "gd_w3.txt", "gd_w4.txt", "gd_w5.txt"]
    sgdFiles = ["sgd_w1.txt", "sgd_w2.txt", "sgd_w3.txt", "sgd_w4.txt", "sgd_w5.txt"]
    adamFiles = ["adam_w1.txt", "adam_w2.txt", "adam_w3.txt", "adam_w4.txt", "adam_w5.txt"]

    # Her bir optimizasyon algoritması için W değerlerini yükle
    gdValuesList = [loadValues(gdFile) for gdFile in gdFiles]
    sgdValuesList = [loadValues(sgdFile) for sgdFile in sgdFiles]
    adamValuesList = [loadValues(adamFile) for adamFile in adamFiles]

    # Her bir optimizasyon algoritması için t-SNE görselleştirmesi yap
    tsneMultiple(gdValuesList, titles=[f'GD - {i}' for i in range(1, 6)])
    tsneMultiple(sgdValuesList, titles=[f'SGD - {i}' for i in range(1, 6)])
    tsneMultiple(adamValuesList, titles=[f'Adam - {i}' for i in range(1, 6)])

if __name__ == "__main__":
    main()
