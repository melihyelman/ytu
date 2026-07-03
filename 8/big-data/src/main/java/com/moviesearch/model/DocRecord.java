package com.moviesearch.model;

public final class DocRecord {
    public final String docId;
    public final String movie;
    public final String rating;
    public final String summary;
    public final String review;

    public DocRecord(String docId, String movie, String rating,
                      String summary, String review) {
        this.docId = docId;
        this.movie = movie;
        this.rating = rating;
        this.summary = summary;
        this.review = review;
    }
}
