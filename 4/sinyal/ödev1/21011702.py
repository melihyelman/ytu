import numpy as np
import matplotlib.pyplot as plt
import sounddevice as sd
import soundfile as sf

def audioRecord(time,fileName):
    print(f"{time} seconds audio recording started.")
    record = sd.rec(int(time * 8000), samplerate=8000, channels=1, dtype='float32')
    sd.wait()
    sf.write(fileName, record, 8000)
    print(f"{time} seconds audio recording completed.")
    return np.array(record).flatten().tolist() 

def playRecord(data, fileName):
    sf.write(fileName, data, 8000)
    sd.play(data, 8000)
    sd.wait()

def myConv(x, y):
    M = len(x)
    N = len(y)
    
    conv_length = M + N - 1
    conv = [0] * conv_length

    for i in range(M):
        for j in range(N):
            conv[ i + j] += x[i] * y[j]
    
    return conv

def systemResponse(M):
    h = [0] * (3000 * M + 1)   
    h[0] = 1
    A = 2

    for k in range(1, M + 1):
        h[3000 * k] = A ** (-k) * k

    return h

x = list(map(float, input("Enter the elements of the array x (separated by commas): ").split(',')))
y = list(map(float, input("Enter the elements of the array y (separated by commas): ").split(',')))

x0 = int(input("Enter the 0th point index of the array x: "))
y0 = int(input("Enter the 0th point index of the array y: "))

startIndex = x0 + y0
myConvelve = myConv(x, y)
convelve = np.convolve(x, y)
print(f"My convulation: {myConvelve} 0 position: {startIndex} ")
print(f"NumPy convulation: {convelve} 0 position: {startIndex} ")

plt.subplot(2, 2, 1) 
plt.stem(range(-x0, -x0+len(x)), x)
plt.xlabel('Index')
plt.ylabel('Value')
plt.title('X[n]')
plt.grid(True)

plt.subplot(2, 2, 2) 
plt.stem(range(-y0, -y0+len(y)), y)
plt.xlabel('Index')
plt.ylabel('Value')
plt.title('Y[n]')
plt.grid(True)

plt.subplot(2, 2, 3) 
plt.stem(range(-startIndex, -startIndex+len(myConvelve)), myConvelve)
plt.xlabel('Index')
plt.ylabel('Value')
plt.title('My Convolution Result')
plt.grid(True)

plt.subplot(2, 2, 4) 
plt.stem(range(-startIndex, -startIndex+len(convelve)), convelve)
plt.xlabel('Index')
plt.ylabel('Value')
plt.title('Nump Convolution Result')
plt.grid(True)

plt.tight_layout()  
plt.show()

fSecond = audioRecord(5,'5second.wav')
tSecond = audioRecord(10, '10second.wav')

m = [3,4,5]
for i in range(len(m)):
    h = systemResponse(m[i])
    convMy5s = myConv(fSecond, h)
    convNp5s = np.convolve(fSecond, h)
    convMy10s = myConv(tSecond, h)
    convNp10s = np.convolve(tSecond, h)
    
    print(f"My convolution completed for {m[i]} and 5 seconds.")
    playRecord(convMy5s, f'm{m[i]}_myconv_5second.wav')
    print(f"Numpy convolution completed for {m[i]} and 5 seconds.")
    playRecord(convNp5s, f'm{m[i]}_conv_5second.wav')
    print(f"My convolution completed for {m[i]} and 10 seconds.")
    playRecord(convMy10s, f'm{m[i]}_myconv_10second.wav')
    print(f"Numpy convolution completed for {m[i]} and 10 seconds.")
    playRecord(convNp10s, f'm{m[i]}_conv_10second.wav')
    
    plt.figure(figsize=(12, 8))

    plt.subplot(2, 4, 1)
    plt.stem(range(len(fSecond)), fSecond)
    plt.xlabel('Index')
    plt.ylabel('Value')
    plt.title('fSecond')
    plt.grid(True)

    plt.subplot(2, 4, 2)
    plt.stem(range(len(tSecond)), tSecond)
    plt.xlabel('Index')
    plt.ylabel('Value')
    plt.title('tSecond')
    plt.grid(True)

    plt.subplot(2, 4, 3)
    plt.stem(range(len(h)), h)
    plt.xlabel('Index')
    plt.ylabel('Value')
    plt.title('h')
    plt.grid(True)

    plt.subplot(2, 4, 4)
    plt.stem(range(len(convMy5s)), convMy5s)
    plt.xlabel('Index')
    plt.ylabel('Value')
    plt.title('My Convolution Result (5s)')
    plt.grid(True)

    plt.subplot(2, 4, 5)
    plt.stem(range(len(convNp5s)), convNp5s)
    plt.xlabel('Index')
    plt.ylabel('Value')
    plt.title('Numpy Convolution Result (5s)')
    plt.grid(True)

    plt.subplot(2, 4, 6)
    plt.stem(range(len(convMy10s)), convMy10s)
    plt.xlabel('Index')
    plt.ylabel('Value')
    plt.title('My Convolution Result (10s)')
    plt.grid(True)

    plt.subplot(2, 4, 7)
    plt.stem(range(len(convNp10s)), convNp10s)
    plt.xlabel('Index')
    plt.ylabel('Value')
    plt.title('Numpy Convolution Result (10s)')
    plt.grid(True)

    plt.tight_layout()
    plt.show()




