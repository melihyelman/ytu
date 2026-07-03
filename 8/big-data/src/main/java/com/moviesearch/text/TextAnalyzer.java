package com.moviesearch.text;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

public final class TextAnalyzer {

    private static final Pattern NON_WORD = Pattern.compile("[^a-z0-9]+");

    private static final Set<String> STOPWORDS = new HashSet<>(Arrays.asList(
            "a", "an", "the", "and", "or", "but", "if", "while", "is", "are",
            "was", "were", "be", "been", "being", "of", "on", "in", "at", "to",
            "from", "by", "for", "with", "about", "as", "into", "like",
            "through", "after", "over", "between", "out", "against", "during",
            "this", "that", "these", "those", "it", "its", "he", "she", "they",
            "them", "his", "her", "their", "you", "your", "i", "me", "my", "we",
            "our", "us", "do", "does", "did", "have", "has", "had", "not", "no",
            "so", "than", "too", "very", "can", "will", "just", "what", "which",
            "who", "whom", "all", "any", "both", "each", "more", "most", "some",
            "such", "only", "own", "same", "then", "there", "here", "when",
            "where", "why", "how"));

    private TextAnalyzer() {
    }

    public static List<String> analyze(String text) {
        List<String> tokens = new ArrayList<>();
        if (text == null || text.isEmpty()) {
            return tokens;
        }
        String[] parts = NON_WORD.split(text.toLowerCase());
        for (String p : parts) {
            if (p.length() < 2) {
                continue;
            }
            if (STOPWORDS.contains(p)) {
                continue;
            }
            tokens.add(p);
        }
        return tokens;
    }
}
