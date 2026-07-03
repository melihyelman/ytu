package com.moviesearch.search;

import java.util.List;

public final class SearchResponse {
    public final List<SearchResult> results;
    public final long elapsedMillis;
    public final int termsMatched;
    public final int termsTotal;

    public SearchResponse(List<SearchResult> results, long elapsedMillis,
                          int termsMatched, int termsTotal) {
        this.results = results;
        this.elapsedMillis = elapsedMillis;
        this.termsMatched = termsMatched;
        this.termsTotal = termsTotal;
    }
}
