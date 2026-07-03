package com.moviesearch.gui;

import com.moviesearch.model.DocRecord;
import com.moviesearch.search.SearchEngine;
import com.moviesearch.search.SearchResponse;
import com.moviesearch.search.SearchResult;

import javax.swing.BorderFactory;
import javax.swing.Box;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JSplitPane;
import javax.swing.JTable;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.ListSelectionModel;
import javax.swing.table.DefaultTableModel;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public final class SearchPanel extends JPanel {

    private final AppContext ctx;
    private final JTextField queryField = new JTextField();
    private final JButton searchBtn = new JButton("Search");
    private final JButton loadBtn = new JButton("Load Index");
    private final JLabel indexStatus = new JLabel("Index not loaded.");
    private final DefaultTableModel model;
    private final JTable table;
    private final JTextArea detail = new JTextArea();
    private List<SearchResult> current = Collections.emptyList();

    private final Map<String, DocRecord> cache =
            new LinkedHashMap<String, DocRecord>(128, 0.75f, true) {
                @Override
                protected boolean removeEldestEntry(
                        Map.Entry<String, DocRecord> e) {
                    return size() > 64;
                }
            };

    public SearchPanel(AppContext ctx) {
        super(new BorderLayout(8, 8));
        this.ctx = ctx;
        setBorder(BorderFactory.createEmptyBorder(8, 8, 8, 8));

        add(buildTop(), BorderLayout.NORTH);

        model = new DefaultTableModel(
                new Object[]{"Rank", "Doc ID", "Score", "Movie"}, 0) {
            @Override
            public boolean isCellEditable(int r, int c) {
                return false;
            }
        };
        table = new JTable(model);
        table.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        table.setAutoResizeMode(JTable.AUTO_RESIZE_LAST_COLUMN);
        table.getColumnModel().getColumn(0).setMaxWidth(50);
        table.getColumnModel().getColumn(2).setMaxWidth(80);
        table.getColumnModel().getColumn(3).setPreferredWidth(360);
        table.getSelectionModel().addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting()) {
                showSelectedDocument();
            }
        });

        detail.setEditable(false);
        detail.setLineWrap(true);
        detail.setWrapStyleWord(true);

        JScrollPane top = new JScrollPane(table);
        top.setBorder(BorderFactory.createTitledBorder("Ranked results"));
        JScrollPane bottom = new JScrollPane(detail);
        bottom.setBorder(BorderFactory.createTitledBorder(
                "Original review (fetched from HDFS on click)"));
        JSplitPane split = new JSplitPane(JSplitPane.VERTICAL_SPLIT,
                top, bottom);
        split.setResizeWeight(0.45);
        split.setPreferredSize(new Dimension(100, 480));
        add(split, BorderLayout.CENTER);
    }

    private JPanel buildTop() {
        JPanel p = new JPanel();
        p.setLayout(new javax.swing.BoxLayout(p, javax.swing.BoxLayout.Y_AXIS));

        JPanel idxRow = new JPanel(new BorderLayout(6, 0));
        idxRow.add(loadBtn, BorderLayout.WEST);
        idxRow.add(indexStatus, BorderLayout.CENTER);
        loadBtn.addActionListener(e -> loadIndex());

        JPanel qRow = new JPanel(new BorderLayout(6, 0));
        qRow.add(new JLabel("Query: "), BorderLayout.WEST);
        qRow.add(queryField, BorderLayout.CENTER);
        qRow.add(searchBtn, BorderLayout.EAST);
        searchBtn.addActionListener(e -> doSearch());
        queryField.addActionListener(e -> doSearch());

        p.add(idxRow);
        p.add(Box.createVerticalStrut(4));
        p.add(qRow);
        return p;
    }

    private void loadIndex() {
        loadBtn.setEnabled(false);
        indexStatus.setText("Loading index from "
                + ctx.config().tfidfDir() + " ...");
        SearchEngine engine = ctx.searchEngine();
        SwingUtil.runAsync(
                () -> {
                    engine.loadIndex(ctx.hdfs(), ctx.config().tfidfDir(),
                            msg -> javax.swing.SwingUtilities.invokeLater(
                                    () -> ctx.status(msg)));
                    return engine.termCount();
                },
                terms -> {
                    loadBtn.setEnabled(true);
                    indexStatus.setText("Index loaded: " + terms
                            + " terms in memory.");
                    ctx.status("Index ready (" + terms + " terms).");
                },
                err -> {
                    loadBtn.setEnabled(true);
                    indexStatus.setText("Index not loaded.");
                    SwingUtil.error(this, "Load index failed", err);
                });
    }

    private void doSearch() {
        SearchEngine engine = ctx.searchEngine();
        if (!engine.isLoaded()) {
            JOptionPane.showMessageDialog(this,
                    "Load the index first (click 'Load Index').",
                    "Index not loaded", JOptionPane.WARNING_MESSAGE);
            return;
        }
        String q = queryField.getText().trim();
        if (q.isEmpty()) {
            return;
        }
        SearchResponse resp = engine.search(q, ctx.config().topK());
        current = resp.results;
        model.setRowCount(0);
        for (SearchResult r : current) {
            model.addRow(new Object[]{r.rank, r.docId,
                    String.format("%.4f", r.score), "..."});
        }
        detail.setText(current.isEmpty()
                ? "No documents contain all matched keywords." : "");
        ctx.status(current.size() + " results for \"" + q
                + "\"  -  query time: " + resp.elapsedMillis + " ms");
        if (!current.isEmpty()) {
            fillMovieColumn();
        }
    }

    private void fillMovieColumn() {
        final List<SearchResult> snapshot = current;
        final Set<String> ids = new HashSet<>();
        for (SearchResult r : snapshot) {
            ids.add(r.docId);
        }
        SwingUtil.runAsync(
                () -> ctx.hdfs().getDocuments(ctx.config().datasetPath(), ids),
                docs -> {
                    if (current != snapshot) {
                        return; // a newer search replaced these results
                    }
                    for (int i = 0; i < snapshot.size(); i++) {
                        DocRecord d = docs.get(snapshot.get(i).docId);
                        if (d == null) {
                            continue;
                        }
                        cache.put(d.docId, d);
                        model.setValueAt(d.movie, i, 3);
                    }
                },
                err -> SwingUtil.error(this, "Fetch movie names failed",
                        err));
    }

    private void showSelectedDocument() {
        int r = table.getSelectedRow();
        if (r < 0 || r >= current.size()) {
            return;
        }
        String docId = current.get(r).docId;
        DocRecord cached = cache.get(docId);
        if (cached != null) {
            render(cached);
            return;
        }
        detail.setText("Fetching " + docId + " from HDFS ...");
        SwingUtil.runAsync(
                () -> ctx.hdfs().getDocument(ctx.config().datasetPath(), docId),
                doc -> {
                    if (doc == null) {
                        detail.setText("Document " + docId
                                + " not found in dataset.");
                        return;
                    }
                    cache.put(docId, doc);
                    render(doc);
                },
                err -> SwingUtil.error(this, "Fetch failed", err));
    }

    private void render(DocRecord d) {
        StringBuilder sb = new StringBuilder();
        sb.append("Doc ID : ").append(d.docId).append('\n');
        sb.append("Movie  : ").append(d.movie).append('\n');
        sb.append("Rating : ").append(d.rating).append('\n');
        sb.append("Summary: ").append(d.summary).append('\n');
        sb.append("--------------------------------------------------\n");
        sb.append(d.review);
        detail.setText(sb.toString());
        detail.setCaretPosition(0);
    }
}
