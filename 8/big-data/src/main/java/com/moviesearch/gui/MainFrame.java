package com.moviesearch.gui;

import com.moviesearch.config.AppConfig;
import com.moviesearch.hdfs.HDFSClient;
import com.moviesearch.search.SearchEngine;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTabbedPane;
import javax.swing.SwingUtilities;
import java.awt.BorderLayout;
import java.io.IOException;

public final class MainFrame extends JFrame implements AppContext {

    private final AppConfig appConfig = new AppConfig();
    private final SearchEngine searchEngine = new SearchEngine();
    private HDFSClient hdfsClient;

    private final JLabel statusBar = new JLabel(" Ready.");
    private final JTabbedPane tabs = new JTabbedPane();

    public MainFrame() {
        super("Movie Review Search");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1100, 760);
        setLocationRelativeTo(null);

        add(buildConnectionBar(), BorderLayout.NORTH);
        add(tabs, BorderLayout.CENTER);
        statusBar.setBorder(BorderFactory.createEmptyBorder(3, 6, 3, 6));
        add(statusBar, BorderLayout.SOUTH);

        buildTabs();
    }

    private JPanel buildConnectionBar() {
        JPanel bar = new JPanel(new java.awt.FlowLayout(
                java.awt.FlowLayout.LEFT));
        bar.add(new JLabel("Cluster: " + appConfig.fsDefaultFS()
                + "   ·   YARN: "
                + appConfig.get("yarn.resourcemanager.address",
                        "resourcemanager:8032")));
        JButton reconnect = new JButton("Reconnect");
        reconnect.addActionListener(e -> reconnect());
        bar.add(reconnect);
        return bar;
    }

    private void buildTabs() {
        tabs.removeAll();
        tabs.addTab("HDFS File Manager", new HDFSFileManagerPanel(this));
        tabs.addTab("MapReduce Job Monitor", new JobMonitorPanel(this));
        tabs.addTab("Search", new SearchPanel(this));
    }

    private void reconnect() {
        closeHdfs();
        try {
            hdfs();
            buildTabs();
            status("Reconnected to " + appConfig.fsDefaultFS() + ".");
        } catch (IOException ex) {
            SwingUtil.error(this, "Reconnect failed", ex);
        }
    }

    private void closeHdfs() {
        if (hdfsClient != null) {
            try {
                hdfsClient.close();
            } catch (IOException ignored) {
                // best effort
            }
            hdfsClient = null;
        }
    }


    @Override
    public AppConfig config() {
        return appConfig;
    }

    @Override
    public synchronized HDFSClient hdfs() throws IOException {
        if (hdfsClient == null) {
            hdfsClient = new HDFSClient(appConfig.toHadoopConfiguration());
        }
        return hdfsClient;
    }

    @Override
    public SearchEngine searchEngine() {
        return searchEngine;
    }

    @Override
    public void status(String message) {
        SwingUtilities.invokeLater(() -> statusBar.setText(" " + message));
    }
}
