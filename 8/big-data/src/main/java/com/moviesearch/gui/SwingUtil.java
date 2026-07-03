package com.moviesearch.gui;

import javax.swing.JOptionPane;
import javax.swing.SwingWorker;
import java.awt.Component;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.Callable;
import java.util.function.Consumer;

public final class SwingUtil {

    private static final SimpleDateFormat TS =
            new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    private SwingUtil() {
    }

    public static <T> void runAsync(Callable<T> bg, Consumer<T> onDone,
                                    Consumer<Throwable> onError) {
        new SwingWorker<T, Void>() {
            @Override
            protected T doInBackground() throws Exception {
                return bg.call();
            }

            @Override
            protected void done() {
                try {
                    onDone.accept(get());
                } catch (Throwable t) {
                    Throwable cause = t.getCause() != null ? t.getCause() : t;
                    onError.accept(cause);
                }
            }
        }.execute();
    }

    public static void error(Component parent, String title, Throwable t) {
        StringWriter sw = new StringWriter();
        t.printStackTrace(new PrintWriter(sw));
        String msg = t.getMessage() == null ? t.toString() : t.getMessage();
        JOptionPane.showMessageDialog(parent,
                msg + "\n\n" + sw, title, JOptionPane.ERROR_MESSAGE);
    }

    public static String humanBytes(long bytes) {
        if (bytes < 1024) {
            return bytes + " B";
        }
        String[] u = {"KB", "MB", "GB", "TB"};
        double v = bytes;
        int i = -1;
        do {
            v /= 1024.0;
            i++;
        } while (v >= 1024 && i < u.length - 1);
        return String.format("%.1f %s", v, u[i]);
    }

    public static String formatTime(long epochMillis) {
        if (epochMillis <= 0) {
            return "-";
        }
        return TS.format(new Date(epochMillis));
    }
}
