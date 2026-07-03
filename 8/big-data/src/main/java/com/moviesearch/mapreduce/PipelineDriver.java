package com.moviesearch.mapreduce;

import com.moviesearch.config.AppConfig;
import com.moviesearch.hdfs.HDFSClient;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.TaskCounter;

import java.util.concurrent.atomic.AtomicBoolean;

public final class PipelineDriver {

    private final AppConfig cfg;
    private final AtomicBoolean cancelled = new AtomicBoolean(false);

    public PipelineDriver(AppConfig cfg) {
        this.cfg = cfg;
    }

    public void cancel() {
        cancelled.set(true);
    }

    private void ensureDirs() throws Exception {
        try (HDFSClient hdfs = new HDFSClient(cfg.toHadoopConfiguration())) {
            hdfs.ensureProjectDirs(cfg.rawDir(), cfg.tokensDir(),
                    cfg.indexDir(), cfg.tfidfDir());
        }
    }

    public boolean runAll(JobProgressListener l, boolean overwrite)
            throws Exception {
        cancelled.set(false);
        ensureDirs();
        if (!runJob1(l, 1, 3, overwrite)) {
            return false;
        }
        long n = lastTotalDocs;
        if (!runJob2(l, 2, 3, overwrite)) {
            return false;
        }
        return runJob3(l, 3, 3, overwrite, n);
    }

    public boolean runSingle(int jobNo, JobProgressListener l,
                             boolean overwrite) throws Exception {
        cancelled.set(false);
        ensureDirs();
        switch (jobNo) {
            case 1:
                return runJob1(l, 1, 1, overwrite);
            case 2:
                return runJob2(l, 1, 1, overwrite);
            case 3:
                long n = countDatasetDocs();
                return runJob3(l, 1, 1, overwrite, n);
            default:
                throw new IllegalArgumentException("Job no must be 1..3");
        }
    }

    private long lastTotalDocs = 1;

    private boolean runJob1(JobProgressListener l, int idx, int total,
                            boolean overwrite) throws Exception {
        if (overwrite) {
            deleteDir(cfg.tokensDir());
        }
        Job job = TokenizationJob.configure(
                cfg.toHadoopConfiguration(), cfg.datasetPath(),
                cfg.tokensDir());
        boolean ok = submitAndWait(job, "Job1-Tokenization", idx, total, l);
        if (ok) {
            lastTotalDocs = job.getCounters().findCounter(
                    TokenizationJob.COUNTER_GROUP,
                    TokenizationJob.DOC_COUNT).getValue();
            long bad = job.getCounters().findCounter(
                    TokenizationJob.COUNTER_GROUP,
                    TokenizationJob.MALFORMED).getValue();
            l.onLog("Documents indexed = " + lastTotalDocs
                    + " (skipped/malformed = " + bad + ")");
            if (lastTotalDocs <= 0) {
                l.onLog("ERROR: zero valid documents.");
                return false;
            }
        }
        return ok;
    }

    private boolean runJob2(JobProgressListener l, int idx, int total,
                            boolean overwrite) throws Exception {
        if (overwrite) {
            deleteDir(cfg.indexDir());
        }
        Job job = InvertedIndexJob.configure(
                cfg.toHadoopConfiguration(), cfg.tokensDir(),
                cfg.indexDir());
        return submitAndWait(job, "Job2-InvertedIndex", idx, total, l);
    }

    private boolean runJob3(JobProgressListener l, int idx, int total,
                            boolean overwrite, long totalDocs)
            throws Exception {
        if (overwrite) {
            deleteDir(cfg.tfidfDir());
        }
        l.onLog("Using N = " + totalDocs + " documents for IDF.");
        Job job = TFIDFJob.configure(
                cfg.toHadoopConfiguration(), cfg.indexDir(),
                cfg.tfidfDir(), totalDocs);
        return submitAndWait(job, "Job3-TFIDF", idx, total, l);
    }

    private boolean submitAndWait(Job job, String name, int idx, int total,
                                  JobProgressListener l) throws Exception {
        long start = System.currentTimeMillis();
        l.onJobStart(name, idx, total, start);
        job.submit();
        while (!job.isComplete()) {
            if (cancelled.get()) {
                job.killJob();
                l.onJobComplete(name, false, start,
                        System.currentTimeMillis(), 0, 0,
                        "Cancelled by user.");
                return false;
            }
            l.onProgress(name, job.mapProgress(), job.reduceProgress(),
                    String.valueOf(job.getStatus().getState()));
            Thread.sleep(600);
        }
        long end = System.currentTimeMillis();
        l.onProgress(name, 1.0, 1.0, "COMPLETE");
        boolean ok = job.isSuccessful();
        long in = counter(job, TaskCounter.MAP_INPUT_RECORDS);
        long out = job.getNumReduceTasks() > 0
                ? counter(job, TaskCounter.REDUCE_OUTPUT_RECORDS)
                : counter(job, TaskCounter.MAP_OUTPUT_RECORDS);
        if (!ok) {
            reportFailure(job, l);
        }
        l.onJobComplete(name, ok, start, end, in, out,
                ok ? "Succeeded." : "Failed - see diagnostics above.");
        return ok;
    }

    private void reportFailure(Job job, JobProgressListener l) {
        try {
            String info = job.getStatus().getFailureInfo();
            if (info != null && !info.trim().isEmpty()) {
                l.onLog("FAILURE: " + info.trim());
            }
            l.onLog("Tracking URL: " + job.getTrackingURL());
            int shown = 0;
            for (org.apache.hadoop.mapreduce.TaskCompletionEvent ev
                    : job.getTaskCompletionEvents(0, 50)) {
                if (ev.getStatus()
                        == org.apache.hadoop.mapreduce.TaskCompletionEvent
                                .Status.SUCCEEDED) {
                    continue;
                }
                String[] diags =
                        job.getTaskDiagnostics(ev.getTaskAttemptId());
                for (String d : diags) {
                    String s = d == null ? "" : d.trim();
                    if (!s.isEmpty()) {
                        l.onLog("TASK DIAG: " + firstLines(s, 6));
                        if (++shown >= 3) {
                            return;
                        }
                    }
                }
            }
            if (shown == 0) {
                l.onLog("No task diagnostics");
            }
        } catch (Exception e) {
            l.onLog("Could not fetch diagnostics: " + e);
        }
    }

    private static String firstLines(String s, int max) {
        String[] lines = s.split("\\R");
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < Math.min(max, lines.length); i++) {
            sb.append(lines[i]).append(" | ");
        }
        return sb.toString();
    }

    private long counter(Job job, TaskCounter c) {
        try {
            return job.getCounters().findCounter(c).getValue();
        } catch (Exception e) {
            return 0;
        }
    }

    private void deleteDir(String path) throws Exception {
        try (FileSystem fs = FileSystem.get(cfg.toHadoopConfiguration())) {
            Path p = new Path(path);
            if (fs.exists(p)) {
                fs.delete(p, true);
            }
        }
    }

    private long countDatasetDocs() throws Exception {
        long n = 0;
        try (HDFSClient hdfs = new HDFSClient(cfg.toHadoopConfiguration())) {
            for (Path part : hdfs.listPartFiles(cfg.tokensDir())) {
                try (java.io.BufferedReader r = hdfs.openReader(part)) {
                    while (r.readLine() != null) {
                        n++;
                    }
                }
            }
        }
        return n > 0 ? n : 1;
    }
}
