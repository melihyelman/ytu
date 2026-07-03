package com.moviesearch;

import com.moviesearch.gui.MainFrame;

import javax.swing.SwingUtilities;
import javax.swing.UIManager;

public final class Main {

    public static void main(String[] args) {
        try {
            UIManager.setLookAndFeel(
                    UIManager.getSystemLookAndFeelClassName());
        } catch (Exception ignored) {
        }
        SwingUtilities.invokeLater(() -> new MainFrame().setVisible(true));
    }
}
