package com.moviesearch.hdfs;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.moviesearch.ingest.DatasetConverter;
import com.moviesearch.model.DocRecord;
import com.moviesearch.model.FileMeta;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FSDataInputStream;
import org.apache.hadoop.fs.FSDataOutputStream;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;

import java.io.BufferedReader;
import java.io.Closeable;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public final class HDFSClient implements Closeable {

    private final FileSystem fs;
    private final ObjectMapper mapper = new ObjectMapper();

    public HDFSClient(Configuration conf) throws IOException {
        this.fs = FileSystem.get(conf);
    }


    public void mkdirs(String path) throws IOException {
        fs.mkdirs(new Path(path));
    }

    public void delete(String path, boolean recursive) throws IOException {
        fs.delete(new Path(path), recursive);
    }

    public void rename(String from, String to) throws IOException {
        if (!fs.rename(new Path(from), new Path(to))) {
            throw new IOException("Rename/move failed: " + from + " -> " + to);
        }
    }

    public void ensureProjectDirs(String... dirs) throws IOException {
        for (String d : dirs) {
            fs.mkdirs(new Path(d));
        }
    }

    public void downloadToLocal(String hdfsPath, String localPath)
            throws IOException {
        fs.copyToLocalFile(false, new Path(hdfsPath),
                new Path(localPath), true);
    }

    public List<FileMeta> list(String path) throws IOException {
        List<FileMeta> rows = new ArrayList<>();
        Path p = new Path(path);
        if (!fs.exists(p)) {
            return rows;
        }
        for (FileStatus st : fs.listStatus(p)) {
            rows.add(toMeta(st));
        }
        return rows;
    }


    private FileMeta toMeta(FileStatus st) {
        long blockSize = st.getBlockSize();
        long blockCount = 0;
        if (st.isFile() && blockSize > 0) {
            blockCount = (st.getLen() + blockSize - 1) / blockSize;
        }
        return new FileMeta(
                st.getPath().getName(),
                st.getPath().toString(),
                st.isDirectory(),
                st.getLen(),
                st.getReplication(),
                blockSize,
                blockCount,
                st.getModificationTime(),
                st.getOwner(),
                st.getGroup(),
                st.getPermission() == null ? "" : st.getPermission().toString());
    }

    public String readHead(String path, int maxBytes) throws IOException {
        try (FSDataInputStream in = fs.open(new Path(path))) {
            byte[] buf = new byte[maxBytes];
            int total = 0;
            int r;
            while (total < maxBytes
                    && (r = in.read(buf, total, maxBytes - total)) != -1) {
                total += r;
            }
            return new String(buf, 0, total, StandardCharsets.UTF_8);
        }
    }

    public long ingestDataset(String localRawFile, String hdfsJsonlTarget,
                              DatasetConverter.ProgressListener listener)
            throws IOException {
        Path target = new Path(hdfsJsonlTarget);
        Path parent = target.getParent();
        if (parent != null) {
            fs.mkdirs(parent);
        }
        DatasetConverter converter = new DatasetConverter();
        try (InputStream in = java.nio.file.Files.newInputStream(
                java.nio.file.Paths.get(localRawFile));
             FSDataOutputStream out = fs.create(target, true)) {
            DatasetConverter.ProgressListener tick = records -> {
                try {
                    out.hflush();
                } catch (IOException ignored) {
                }
                if (listener != null) {
                    listener.onRecords(records);
                }
            };
            return converter.convert(in, out, tick);
        }
    }

    public void copyFromLocal(String localFile, String hdfsTarget)
            throws IOException {
        fs.copyFromLocalFile(false, true,
                new Path(localFile), new Path(hdfsTarget));
    }

    public DocRecord getDocument(String datasetPath, String docId)
            throws IOException {
        try (BufferedReader reader = openReader(new Path(datasetPath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.isEmpty() || !line.contains(docId)) {
                    continue;
                }
                JsonNode n = mapper.readTree(line);
                if (docId.equals(n.path("docId").asText())) {
                    return new DocRecord(
                            n.path("docId").asText(),
                            n.path("movie").asText(),
                            n.path("rating").asText(),
                            n.path("summary").asText(),
                            n.path("review").asText());
                }
            }
        }
        return null;
    }

    public java.util.Map<String, DocRecord> getDocuments(
            String datasetPath, java.util.Set<String> ids) throws IOException {
        java.util.Map<String, DocRecord> out = new java.util.HashMap<>();
        if (ids == null || ids.isEmpty()) {
            return out;
        }
        try (BufferedReader reader = openReader(new Path(datasetPath))) {
            String line;
            while ((line = reader.readLine()) != null && out.size() < ids.size()) {
                if (line.isEmpty()) {
                    continue;
                }
                JsonNode n = mapper.readTree(line);
                String id = n.path("docId").asText();
                if (ids.contains(id) && !out.containsKey(id)) {
                    out.put(id, new DocRecord(
                            id,
                            n.path("movie").asText(),
                            n.path("rating").asText(),
                            n.path("summary").asText(),
                            n.path("review").asText()));
                }
            }
        }
        return out;
    }

    public List<Path> listPartFiles(String dirOrFile) throws IOException {
        List<Path> parts = new ArrayList<>();
        Path p = new Path(dirOrFile);
        if (!fs.exists(p)) {
            return parts;
        }
        FileStatus root = fs.getFileStatus(p);
        if (root.isFile()) {
            parts.add(p);
            return parts;
        }
        for (FileStatus st : fs.listStatus(p)) {
            String name = st.getPath().getName();
            if (st.isFile() && (name.startsWith("part-")
                    || name.startsWith("part"))) {
                parts.add(st.getPath());
            }
        }
        return parts;
    }

    public BufferedReader openReader(Path path) throws IOException {
        return new BufferedReader(new InputStreamReader(
                fs.open(path), StandardCharsets.UTF_8), 1 << 20);
    }

    @Override
    public void close() throws IOException {
        fs.close();
    }
}
