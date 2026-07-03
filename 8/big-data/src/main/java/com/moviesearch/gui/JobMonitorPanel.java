package com.moviesearch.gui;

import com.moviesearch.mapreduce.JobProgressListener;
import com.moviesearch.mapreduce.PipelineDriver;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.SwingUtilities;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GridLayout;
import java.text.SimpleDateFormat;
import java.util.Date;

public final class JobMonitorPanel extends JPanel {

    private final AppContext ctx;
    private final JLabel[] stats = new JLabel[3];
    private final String[] startedAt = {"-", "-", "-"};
    private final JTextArea logArea = new JTextArea();
    private final JButton[] jobBtns = new JButton[3];
    private final JButton fullBtn = new JButton("Run Full Pipeline");
    private final JButton cancelBtn = new JButton("Cancel");
    private final JCheckBox overwrite =
            new JCheckBox("Overwrite previous outputs", true);
    private final SimpleDateFormat clock = new SimpleDateFormat("HH:mm:ss");
    private PipelineDriver driver;

    public JobMonitorPanel(AppContext ctx) {
        super(new BorderLayout(8, 8));
        this.ctx = ctx;
        setBorder(BorderFactory.createEmptyBorder(8, 8, 8, 8));
        add(buildHeader(), BorderLayout.NORTH);
        add(buildJobStatus(), BorderLayout.CENTER);

        logArea.setEditable(false);
        logArea.setFont(new Font("Monospaced", Font.PLAIN, 12));
        JScrollPane sp = new JScrollPane(logArea);
        sp.setPreferredSize(new Dimension(100, 220));
        sp.setBorder(BorderFactory.createTitledBorder(
                "Execution log / errors"));
        add(sp, BorderLayout.SOUTH);

        cancelBtn.setEnabled(false);
        for (int i = 0; i < 3; i++) {
            final int jobNo = i + 1;
            jobBtns[i].addActionListener(e -> launch(jobNo));
        }
        fullBtn.addActionListener(e -> launch(0));
        cancelBtn.addActionListener(e -> {
            if (driver != null) {
                driver.cancel();
                appendLog("Cancellation requested ...");
            }
        });
    }

    private JPanel buildHeader() {
        JPanel controls = new JPanel(new FlowLayout(FlowLayout.LEFT));
        String[] names = {"Run Job 1", "Run Job 2", "Run Job 3"};
        for (int i = 0; i < 3; i++) {
            jobBtns[i] = new JButton(names[i]);
            controls.add(jobBtns[i]);
        }
        controls.add(fullBtn);
        controls.add(cancelBtn);
        controls.add(overwrite);
        return controls;
    }

    private JPanel buildJobStatus() {
        JPanel grid = new JPanel(new GridLayout(3, 1, 6, 10));
        String[] titles = {"Job 1 - Tokenization",
                "Job 2 - Inverted Index", "Job 3 - TF-IDF Scoring"};
        for (int i = 0; i < 3; i++) {
            stats[i] = new JLabel("idle");
            stats[i].setFont(new Font("Monospaced", Font.PLAIN, 12));
            JPanel row = new JPanel(new BorderLayout(8, 2));
            JLabel l = new JLabel(titles[i]);
            l.setPreferredSize(new Dimension(180, 22));
            row.add(l, BorderLayout.WEST);
            row.add(stats[i], BorderLayout.CENTER);
            grid.add(row);
        }
        JPanel wrap = new JPanel(new BorderLayout());
        wrap.setBorder(BorderFactory.createTitledBorder("MapReduce jobs"));
        wrap.add(grid, BorderLayout.NORTH);
        return wrap;
    }

    private void launch(int jobNo) {
        setBusy(true);
        if (jobNo == 0) {
            for (int i = 0; i < 3; i++) {
                resetRow(i);
            }
            logArea.setText("");
        } else {
            resetRow(jobNo - 1);
        }
        driver = new PipelineDriver(ctx.config());
        JobProgressListener listener = buildListener();
        SwingUtil.runAsync(
                () -> jobNo == 0
                        ? driver.runAll(listener, overwrite.isSelected())
                        : driver.runSingle(jobNo, listener,
                                overwrite.isSelected()),
                ok -> {
                    setBusy(false);
                    ctx.status(ok ? "MapReduce finished successfully."
                            : "MapReduce failed.");
                    appendLog(ok
                            ? "DONE - open Search and click 'Load Index'."
                            : "FAILED - see log above.");
                },
                err -> {
                    setBusy(false);
                    ctx.status("Pipeline error.");
                    SwingUtil.error(this, "Pipeline error", err);
                });
    }

    private JobProgressListener buildListener() {
        return new JobProgressListener() {
            @Override
            public void onJobStart(String n, int idx, int total,
                                   long startMillis) {
                int i = jobIndex(n);
                ui(() -> {
                    appendLog("--- " + n + " started at "
                            + clock.format(new Date(startMillis)) + " ---");
                    if (i >= 0) {
                        startedAt[i] = clock.format(new Date(startMillis));
                        stats[i].setText("running ...   start: "
                                + startedAt[i]);
                    }
                    ctx.status("Running " + n + " ...");
                });
            }

            @Override
            public void onProgress(String n, double map, double reduce,
                                   String status) {
                int i = jobIndex(n);
                ui(() -> {
                    if (i >= 0) {
                        stats[i].setText(String.format(
                                "running   map %.0f%%  reduce %.0f%%"
                                + "   start: %s",
                                map * 100, reduce * 100, startedAt[i]));
                    }
                });
            }

            @Override
            public void onLog(String message) {
                ui(() -> appendLog(message));
            }

            @Override
            public void onJobComplete(String n, boolean success,
                                      long start, long end, long in,
                                      long out, String summary) {
                int i = jobIndex(n);
                ui(() -> {
                    if (i >= 0) {
                        stats[i].setText(String.format(
                                "%s   start: %s   end: %s   "
                                + "records in/out: %d / %d",
                                success ? "DONE" : "FAILED",
                                clock.format(new Date(start)),
                                clock.format(new Date(end)), in, out));
                    }
                    appendLog(n + " -> " + (success ? "OK" : "FAIL")
                            + " (in=" + in + ", out=" + out + ") "
                            + summary);
                });
            }
        };
    }

    private void setBusy(boolean busy) {
        for (JButton b : jobBtns) {
            b.setEnabled(!busy);
        }
        fullBtn.setEnabled(!busy);
        cancelBtn.setEnabled(busy);
    }

    private void resetRow(int i) {
        startedAt[i] = "-";
        stats[i].setText("idle");
    }

    private int jobIndex(String n) {
        if (n.startsWith("Job1")) {
            return 0;
        }
        if (n.startsWith("Job2")) {
            return 1;
        }
        if (n.startsWith("Job3")) {
            return 2;
        }
        return -1;
    }

    private void appendLog(String line) {
        logArea.append(line + "\n");
        logArea.setCaretPosition(logArea.getDocument().getLength());
    }

    private void ui(Runnable r) {
        SwingUtilities.invokeLater(r);
    }
}
