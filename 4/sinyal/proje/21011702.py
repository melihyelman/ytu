import sys
import numpy as np
import matplotlib.pyplot as plt
from PyQt5.QtWidgets import (QApplication, QWidget, QVBoxLayout, QHBoxLayout,
                             QLabel, QLineEdit, QPushButton, QGridLayout, QRadioButton, QButtonGroup)
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas

class PlotCanvas(FigureCanvas):

    def __init__(self, parent=None):
        fig, self.ax = plt.subplots(2, 1, figsize=(8, 12))
        super().__init__(fig)
        self.setParent(parent)
        self.ax[0].set_title('Individual Signals')
        self.ax[1].set_title('Synthesized Signal')
        for a in self.ax:
            a.grid(True)

    def plotSignals(self, t, signals, types):
        self.ax[0].clear()
        colors = ['r', 'g', 'b']
        for i, signal in enumerate(signals):
            if types[i] == 'sine':
                label = 'Sine Signal ' + str(i+1)
            else:
                label = 'Cosine Signal ' + str(i+1)
            self.ax[0].plot(t, signal, color=colors[i], label=label)
        self.ax[0].set_title('Individual Waves')
        self.ax[0].legend()
        self.ax[0].grid(True)
        self.draw()

    def plotSynthesized(self, t, synthesizedSignal):
        self.ax[1].clear()
        self.ax[1].plot(t, synthesizedSignal, color='m', label='Synthesized Signal')
        self.ax[1].set_title('Synthesized Signal')
        self.ax[1].legend()
        self.ax[1].grid(True)
        self.draw()

class MainWindow(QWidget):

    def __init__(self):
        super().__init__()

        self.initUI()

    def initUI(self):
        self.setWindowTitle('Signal Plotter')

        mainLayout = QVBoxLayout()

        topLayout = QHBoxLayout()

        signalsLayout = QVBoxLayout()
        fourierLayout = QVBoxLayout()

        signalsInput = QGridLayout()
        labels = ['Amplitude (A1, A2, A3):', 'Frequency (f1, f2, f3) (Hz):', 'Phase (θ1, θ2, θ3) (rad):']
        self.amplitudes = QLineEdit(self)
        self.frequencies = QLineEdit(self)
        self.phases = QLineEdit(self)

        signalsInput.addWidget(QLabel(labels[0]), 0, 0)
        signalsInput.addWidget(self.amplitudes, 0, 1)
        signalsInput.addWidget(QLabel(labels[1]), 1, 0)
        signalsInput.addWidget(self.frequencies, 1, 1)
        signalsInput.addWidget(QLabel(labels[2]), 2, 0)
        signalsInput.addWidget(self.phases, 2, 1)

        self.radioGroups = []
        for i in range(3):
            sinRadioButton = QRadioButton(f'Sine {i+1}')
            cosRadioButton = QRadioButton(f'Cosine {i+1}')
            sinRadioButton.setChecked(True)  # Default to sine

            radioButtonGroup = QButtonGroup()
            radioButtonGroup.addButton(sinRadioButton)
            radioButtonGroup.addButton(cosRadioButton)
            self.radioGroups.append(radioButtonGroup)

            signalsInput.addWidget(sinRadioButton, 3 + i, 0)
            signalsInput.addWidget(cosRadioButton, 3 + i, 1)

        self.plotSignalsButton = QPushButton('Plot Signals', self)
        self.plotSignalsButton.clicked.connect(self.plotSignals)

        signalsLayout.addLayout(signalsInput)
        signalsLayout.addWidget(self.plotSignalsButton)

        fourierInputs = QGridLayout()
        fourierLabels = ['a0:', 'ak (k=1,2,3):', 'bk (k=1,2,3):', 'w0 (rad/s):', 'T (s):']
        self.a0 = QLineEdit(self)
        self.ak = QLineEdit(self)
        self.bk = QLineEdit(self)
        self.w0 = QLineEdit(self)
        self.T = QLineEdit(self)

        fourierInputs.addWidget(QLabel(fourierLabels[0]), 0, 0)
        fourierInputs.addWidget(self.a0, 0, 1)
        fourierInputs.addWidget(QLabel(fourierLabels[1]), 1, 0)
        fourierInputs.addWidget(self.ak, 1, 1)
        fourierInputs.addWidget(QLabel(fourierLabels[2]), 2, 0)
        fourierInputs.addWidget(self.bk, 2, 1)
        fourierInputs.addWidget(QLabel(fourierLabels[3]), 3, 0)
        fourierInputs.addWidget(self.w0, 3, 1)
        fourierInputs.addWidget(QLabel(fourierLabels[4]), 4, 0)
        fourierInputs.addWidget(self.T, 4, 1)

        self.plotFourierButton = QPushButton('Plot Fourier Series', self)
        self.plotFourierButton.clicked.connect(self.plotFourier)

        fourierLayout.addLayout(fourierInputs)
        fourierLayout.addWidget(self.plotFourierButton)

        topLayout.addLayout(signalsLayout)
        topLayout.addLayout(fourierLayout)

        mainLayout.addLayout(topLayout)

        self.canvas = PlotCanvas(self)
        mainLayout.addWidget(self.canvas)

        self.setLayout(mainLayout)

    def plotSignals(self):
        try:
            AStr = self.amplitudes.text().split(',')
            fStr = self.frequencies.text().split(',')
            thetaStr = self.phases.text().split(',')

            if len(AStr) != 3 or len(fStr) != 3 or len(thetaStr) != 3:
                raise ValueError

            A = []
            f = []
            theta = []

            for val in AStr:
                A.append(float(val))
            for val in fStr:
                f.append(float(val))
            for val in thetaStr:
                theta.append(float(val))

            minFrequency = min(f)
            if minFrequency == 0:
                raise ValueError
            period = 1 / minFrequency
            t = np.linspace(-5 * period, 5 * period, 1000)
            signals = []
            types = []

            for i in range(3):
                if self.radioGroups[i].buttons()[0].isChecked():
                    signals.append(A[i] * np.sin(2 * np.pi * f[i] * t + theta[i]))
                    types.append('sine')
                else:
                    signals.append(A[i] * np.cos(2 * np.pi * f[i] * t + theta[i]))
                    types.append('cosine')

            synthesizedSignal = np.zeros_like(t)
            for signal in signals:
                synthesizedSignal += signal
            
            self.canvas.ax[0].clear()
            self.canvas.ax[1].clear()

            self.canvas.plotSignals(t, signals, types)
            self.canvas.plotSynthesized(t, synthesizedSignal)

        except ValueError:
            print("Please enter valid inputs.")

    def plotFourier(self):
        try:
            a0 = float(self.a0.text())
            akStr = self.ak.text().split(',')
            bkStr = self.bk.text().split(',')
            w0 = float(self.w0.text())
            T = float(self.T.text())

            if len(akStr) != 3 or len(bkStr) != 3:
                raise ValueError

            ak = []
            bk = []

            for val in akStr:
                ak.append(float(val))
            for val in bkStr:
                bk.append(float(val))

            t = np.linspace(-T, T, 1000)
            cosineSignals = []
            sineSignals = []

            for i in range(3):
                cosineSignals.append(ak[i] * np.cos((i+1) * w0 * t))
                sineSignals.append(bk[i] * np.sin((i+1) * w0 * t))

            synthesizedSignal = a0 + np.zeros_like(t)
            for signal in cosineSignals:
                synthesizedSignal += signal
            for signal in sineSignals:
                synthesizedSignal += signal

            self.canvas.ax[0].clear()
            self.canvas.ax[1].clear()

            colors = ['r', 'g', 'b']
            for i in range(3):
                self.canvas.ax[0].plot(t, cosineSignals[i], color=colors[i], label='Cosine Signal ' + str(i+1))
                self.canvas.ax[0].plot(t, sineSignals[i], color=colors[i], linestyle='--', label='Sine Signal ' + str(i+1))

            self.canvas.ax[0].set_title('Individual Waves')
            self.canvas.ax[0].legend()
            self.canvas.ax[0].grid(True)
            self.canvas.plotSynthesized(t, synthesizedSignal)

        except ValueError:
            print("Please enter valid inputs.")

if __name__ == '__main__':
    app = QApplication(sys.argv)
    main = MainWindow()
    main.show()
    sys.exit(app.exec_())
