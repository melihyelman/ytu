package com.moviesearch.gui;

import com.moviesearch.ingest.DatasetConverter;
import com.moviesearch.model.FileMeta;
import org.apache.hadoop.fs.Path;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JSplitPane;
import javax.swing.JTable;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.JToolBar;
import javax.swing.JTree;
import javax.swing.event.TreeExpansionEvent;
import javax.swing.event.TreeWillExpandListener;
import javax.swing.table.DefaultTableModel;
import javax.swing.tree.DefaultMutableTreeNode;
import javax.swing.tree.DefaultTreeModel;
import javax.swing.tree.TreePath;
import javax.swing.tree.TreeSelectionModel;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

public final class HDFSFileManagerPanel extends JPanel {

    private final AppContext ctx;
    private final JTextField pathField = new JTextField();
    private final DefaultTableModel model;
    private final JTable table;
    private final DefaultMutableTreeNode treeRoot;
    private final DefaultTreeModel treeModel;
    private final JTree tree;
    private List<FileMeta> rows = java.util.Collections.emptyList();
    private String currentPath;
    private String rootPath;

    public HDFSFileManagerPanel(AppContext ctx) {
        super(new BorderLayout(6, 6));
        this.ctx = ctx;

        model = new DefaultTableModel(new Object[]{
                "Name", "Type", "Size", "Repl", "Blocks", "Block size",
                "Modified", "Owner", "Perms"}, 0) {
            @Override
            public boolean isCellEditable(int r, int c) {
                return false;
            }
        };
        table = new JTable(model);
        table.setAutoResizeMode(JTable.AUTO_RESIZE_LAST_COLUMN);
        table.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    openSelected();
                }
            }
        });

        rootPath = new Path(ctx.config().rawDir()).getParent().toString();
        currentPath = rootPath;
        treeRoot = new DefaultMutableTreeNode(new Node(rootPath, true));
        treeModel = new DefaultTreeModel(treeRoot);
        tree = new JTree(treeModel);
        tree.getSelectionModel().setSelectionMode(
                TreeSelectionModel.SINGLE_TREE_SELECTION);
        tree.addTreeSelectionListener(e -> {
            DefaultMutableTreeNode n = (DefaultMutableTreeNode)
                    tree.getLastSelectedPathComponent();
            if (n != null) {
                navigate(((Node) n.getUserObject()).path);
            }
        });
        tree.addTreeWillExpandListener(new TreeWillExpandListener() {
            @Override
            public void treeWillExpand(TreeExpansionEvent ev) {
                DefaultMutableTreeNode n = (DefaultMutableTreeNode)
                        ev.getPath().getLastPathComponent();
                loadChildren(n);
            }

            @Override
            public void treeWillCollapse(TreeExpansionEvent ev) {
            }
        });

        add(buildTopBar(), BorderLayout.NORTH);
        JScrollPane treeScroll = new JScrollPane(tree);
        treeScroll.setBorder(BorderFactory.createTitledBorder(
                "HDFS directory tree"));
        JScrollPane tableScroll = new JScrollPane(table);
        tableScroll.setBorder(BorderFactory.createTitledBorder(
                "Contents & metadata"));
        JSplitPane split = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT,
                treeScroll, tableScroll);
        split.setDividerLocation(280);
        add(split, BorderLayout.CENTER);

        ensureDirsThenRefresh();
    }

    private static final class Node {
        final String path;
        boolean loaded;

        Node(String path, boolean isRoot) {
            this.path = path;
        }

        @Override
        public String toString() {
            String name = new Path(path).getName();
            return name.isEmpty() ? path : name;
        }
    }

    private JPanel buildTopBar() {
        JPanel top = new JPanel(new BorderLayout(4, 4));

        JToolBar nav = new JToolBar();
        nav.setFloatable(false);
        JButton go = new JButton("Go");
        JButton up = new JButton("Up");
        JButton refresh = new JButton("Refresh");
        go.addActionListener(e -> navigate(pathField.getText().trim()));
        up.addActionListener(e -> {
            Path p = new Path(currentPath);
            if (p.getParent() != null) {
                navigate(p.getParent().toString());
            }
        });
        refresh.addActionListener(e -> refresh());
        nav.add(up);
        nav.add(go);
        nav.add(refresh);

        JToolBar ops = new JToolBar();
        ops.setFloatable(false);
        addOp(ops, "Upload Raw Dataset", this::uploadRawDataset);

        JPanel pathRow = new JPanel(new BorderLayout(4, 0));
        pathRow.add(new JLabel(" Path: "), BorderLayout.WEST);
        pathRow.add(pathField, BorderLayout.CENTER);
        pathRow.add(nav, BorderLayout.EAST);

        top.add(pathRow, BorderLayout.NORTH);
        top.add(ops, BorderLayout.SOUTH);
        return top;
    }

    private void addOp(JToolBar bar, String label, Runnable action) {
        JButton b = new JButton(label);
        b.addActionListener(e -> action.run());
        bar.add(b);
    }

    private void ensureDirsThenRefresh() {
        SwingUtil.runAsync(
                () -> {
                    ctx.hdfs().ensureProjectDirs(ctx.config().rawDir(),
                            ctx.config().tokensDir(),
                            ctx.config().indexDir(),
                            ctx.config().tfidfDir());
                    return null;
                },
                v -> {
                    loadChildren(treeRoot);
                    tree.expandPath(new TreePath(treeRoot.getPath()));
                    refresh();
                },
                err -> {
                    refresh();
                    SwingUtil.error(this, "Could not create HDFS dirs", err);
                });
    }

    private void loadChildren(DefaultMutableTreeNode parent) {
        Node node = (Node) parent.getUserObject();
        if (node.loaded) {
            return;
        }
        node.loaded = true;
        try {
            parent.removeAllChildren();
            for (FileMeta m : ctx.hdfs().list(node.path)) {
                if (m.directory) {
                    DefaultMutableTreeNode child =
                            new DefaultMutableTreeNode(
                                    new Node(m.path, false));
                    child.add(new DefaultMutableTreeNode("..."));
                    parent.add(child);
                }
            }
            treeModel.nodeStructureChanged(parent);
        } catch (Exception e) {
        }
    }

    private void navigate(String path) {
        currentPath = path;
        pathField.setText(path);
        refresh();
    }

    private void refresh() {
        ctx.status("Listing " + currentPath + " ...");
        final String path = currentPath;
        SwingUtil.runAsync(
                () -> ctx.hdfs().list(path),
                list -> {
                    rows = list;
                    model.setRowCount(0);
                    for (FileMeta m : list) {
                        model.addRow(new Object[]{
                                m.name,
                                m.directory ? "DIR" : "FILE",
                                m.directory ? "-"
                                        : SwingUtil.humanBytes(m.length),
                                m.directory ? "-" : m.replication,
                                m.directory ? "-" : m.blockCount,
                                m.directory ? "-"
                                        : SwingUtil.humanBytes(m.blockSize),
                                SwingUtil.formatTime(m.modificationTime),
                                m.owner, m.permission});
                    }
                    ctx.status(list.size() + " entries in " + path);
                },
                err -> {
                    ctx.status("List failed.");
                    SwingUtil.error(this, "List failed", err);
                });
    }

    private void openSelected() {
        int r = table.getSelectedRow();
        if (r < 0 || r >= rows.size()) {
            return;
        }
        FileMeta m = rows.get(r);
        if (m.directory) {
            navigate(m.path);
        } else {
            previewSelected();
        }
    }

    private FileMeta selected() {
        int r = table.getSelectedRow();
        if (r < 0 || r >= rows.size()) {
            JOptionPane.showMessageDialog(this, "Select a row first.",
                    "No selection", JOptionPane.INFORMATION_MESSAGE);
            return null;
        }
        return rows.get(r);
    }

    private void previewSelected() {
        FileMeta m = selected();
        if (m == null) {
            return;
        }
        if (m.directory) {
            navigate(m.path);
            return;
        }
        SwingUtil.runAsync(
                () -> ctx.hdfs().readHead(m.path, 64 * 1024),
                text -> {
                    JTextArea area = new JTextArea(text, 24, 90);
                    area.setEditable(false);
                    area.setCaretPosition(0);
                    JScrollPane scroll = new JScrollPane(area);
                    scroll.setPreferredSize(new Dimension(820, 460));
                    JOptionPane.showMessageDialog(this, scroll,
                            "Preview (first 64 KB): " + m.name,
                            JOptionPane.PLAIN_MESSAGE);
                },
                err -> SwingUtil.error(this, "Preview failed", err));
    }

    private void uploadRawDataset() {
        JFileChooser fc = new JFileChooser(System.getProperty("user.dir"));
        fc.setDialogTitle("Select raw IMDb JSON file "
                + "(part-01.json or the 10 MB sample)");
        if (fc.showOpenDialog(this) != JFileChooser.APPROVE_OPTION) {
            return;
        }
        String local = fc.getSelectedFile().getAbsolutePath();
        String target = JOptionPane.showInputDialog(this,
                "HDFS target (JSONL dataset):", ctx.config().datasetPath());
        if (target == null || target.trim().isEmpty()) {
            return;
        }
        final String dst = target.trim();
        final AtomicLong last = new AtomicLong();
        ctx.status("Ingesting dataset (streaming + JSONL conversion) ...");
        SwingUtil.runAsync(
                () -> ctx.hdfs().ingestDataset(local, dst,
                        (DatasetConverter.ProgressListener) records -> {
                            last.set(records);
                            javax.swing.SwingUtilities.invokeLater(() ->
                                    ctx.status("Ingested " + records
                                            + " reviews ..."));
                        }),
                count -> {
                    ctx.status("Ingest complete: " + count + " reviews -> "
                            + dst);
                    JOptionPane.showMessageDialog(this,
                            count + " reviews written to " + dst,
                            "Ingest complete",
                            JOptionPane.INFORMATION_MESSAGE);
                    navigate(new Path(dst).getParent().toString());
                },
                err -> {
                    ctx.status("Ingest failed.");
                    SwingUtil.error(this, "Ingest failed", err);
                });
    }
}
