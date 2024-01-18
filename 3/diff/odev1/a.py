import matplotlib.pyplot as plt

def readData(file_path):
    # Dosyadan verileri oku ve epochs, times, losses listelerine ayır
    with open(file_path, 'r') as file:
        lines = file.readlines()
        epochs, times, losses = [], [], []
        for line in lines:
            epoch, time, loss = map(float, line.split())
            epochs.append(epoch)
            times.append(time)
            losses.append(loss)
    return epochs, times, losses

def timeVsLoss(ax, algorithmName, epochs, times, losses):
    # Time vs Loss grafiğini çiz
    ax.plot(times, losses, label=algorithmName)
    ax.set_xlabel('Time')
    ax.set_ylabel('Loss')
    ax.legend()

def epochVsLoss(ax, algorithmName, epochs, losses):
    # Epoch vs Loss grafiğini çiz
    ax.plot(epochs, losses, label=algorithmName)
    ax.set_xlabel('Epoch')
    ax.set_ylabel('Loss')
    ax.legend()

# Algoritmaların listesi
algorithms = ['gd', 'sgd', 'adam']

# 3 satır, 2 sütunlu bir subplot oluştur
fig, axs = plt.subplots(3, 2, figsize=(15, 12))  # 3 satır, 2 sütun

# Her bir wIndex için her bir algoritmanın grafiğini çiz
for wIndex in range(1, 6):
    for i, algorithm in enumerate(algorithms):
        filePath = f"{algorithm}_data_w{wIndex}.txt"
        epochs, times, losses = readData(filePath)

        # Time vs Loss grafiği
        timeVsLoss(axs[i][0], f'{algorithm} - w{wIndex}', epochs, times, losses)

        # Epoch vs Loss grafiği
        epochVsLoss(axs[i][1], f'{algorithm} - w{wIndex}', epochs, losses)

# Başlık ve düzenleme
plt.suptitle('Time and Epoch vs Loss for GD, SGD, and Adam')
plt.tight_layout(rect=[0, 0, 1, 0.96])  
plt.show()
