package com.moviesearch.search;

public final class Posting {
    public final String docId;
    public final double score;

    public Posting(String docId, double score) {
        this.docId = docId;
        this.score = score;
    }
}
