package com.moviesearch.mapreduce;

public interface JobProgressListener {

    void onJobStart(String jobName, int index, int total, long startMillis);

    void onProgress(String jobName, double mapFraction,
                    double reduceFraction, String status);

    void onLog(String message);

    void onJobComplete(String jobName, boolean success, long startMillis,
                       long endMillis, long recordsIn, long recordsOut,
                       String summary);
}
