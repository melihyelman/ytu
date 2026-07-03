package com.moviesearch.search;

public final class SearchResult {
    public final int rank;
    public final String docId;
    public final double score;

    public SearchResult(int rank, String docId, double score) {
        this.rank = rank;
        this.docId = docId;
        this.score = score;
    }
}
