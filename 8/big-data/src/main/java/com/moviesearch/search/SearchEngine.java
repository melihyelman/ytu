package com.moviesearch.search;

import com.moviesearch.hdfs.HDFSClient;
import com.moviesearch.text.TextAnalyzer;
import org.apache.hadoop.fs.Path;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Consumer;

public final class SearchEngine {

    private static final int MAX_POSTINGS_PER_TERM = 500;

    private final Map<String, List<Posting>> index = new HashMap<>();
    private volatile boolean loaded = false;

    public boolean isLoaded() {
        return loaded;
    }

    public int termCount() {
        return index.size();
    }

    public synchronized void loadIndex(HDFSClient hdfs, String job3Output,
                                       Consumer<String> log)
            throws IOException {
        index.clear();
        loaded = false;
        List<Path> parts = hdfs.listPartFiles(job3Output);
        if (parts.isEmpty()) {
            throw new IOException(
                    "No index files found under " + job3Output
                    + " - run the MapReduce pipeline first.");
        }
        long lines = 0;
        for (Path part : parts) {
            if (log != null) {
                log.accept("Loading " + part.getName() + " ...");
            }
            try (BufferedReader r = hdfs.openReader(part)) {
                String line;
                while ((line = r.readLine()) != null) {
                    if (parseLine(line)) {
                        lines++;
                    }
                }
            }
        }
        loaded = true;
        if (log != null) {
            log.accept("Index loaded: " + lines + " terms in memory.");
        }
    }

    private boolean parseLine(String line) {
        int tab = line.indexOf('\t');
        if (tab <= 0) {
            return false;
        }
        String term = line.substring(0, tab);
        List<Posting> list = new ArrayList<>(
                Math.min(MAX_POSTINGS_PER_TERM, 16));
        int start = tab + 1;
        int len = line.length();
        while (start < len && list.size() < MAX_POSTINGS_PER_TERM) {
            int comma = line.indexOf(',', start);
            int end = comma < 0 ? len : comma;
            int colon = line.lastIndexOf(':', end - 1);
            if (colon > start) {
                try {
                    list.add(new Posting(
                            line.substring(start, colon),
                            Double.parseDouble(
                                    line.substring(colon + 1, end))));
                } catch (NumberFormatException ignored) {
                }
            }
            if (comma < 0) {
                break;
            }
            start = comma + 1;
        }
        if (list.isEmpty()) {
            return false;
        }
        index.put(term, list);
        return true;
    }

    public SearchResponse search(String query, int topK) {
        long t0 = System.nanoTime();
        List<SearchResult> results = new ArrayList<>();
        List<String> terms = (loaded && query != null)
                ? TextAnalyzer.analyze(query)
                : new ArrayList<>();

        List<String> present = new ArrayList<>();
        for (String term : terms) {
            if (index.containsKey(term)) {
                present.add(term);
            }
        }
        if (!present.isEmpty()) {
            Set<String> common = null;
            Map<String, Double> score = new HashMap<>();
            for (String term : present) {
                Set<String> docs = new LinkedHashSet<>();
                for (Posting p : index.get(term)) {
                    docs.add(p.docId);
                    score.merge(p.docId, p.score, Double::sum);
                }
                if (common == null) {
                    common = docs;
                } else {
                    common.retainAll(docs);
                }
            }
            List<Map.Entry<String, Double>> ranked = new ArrayList<>();
            for (String doc : common) {
                ranked.add(new java.util.AbstractMap.SimpleEntry<>(
                        doc, score.get(doc)));
            }
            ranked.sort((a, b) -> Double.compare(b.getValue(),
                    a.getValue()));
            int limit = Math.min(topK, ranked.size());
            for (int i = 0; i < limit; i++) {
                Map.Entry<String, Double> e = ranked.get(i);
                results.add(new SearchResult(i + 1, e.getKey(),
                        e.getValue()));
            }
        }
        long elapsed = (System.nanoTime() - t0) / 1_000_000;
        return new SearchResponse(results, elapsed, present.size(),
                terms.size());
    }
}
