package com.moviesearch.ingest;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;

public final class DatasetConverter {

    public interface ProgressListener {
        void onRecords(long records);
    }

    private static final long REPORT_EVERY = 25_000L;

    private final JsonFactory factory = new JsonFactory();
    private final ObjectMapper mapper = new ObjectMapper();

    public long convert(InputStream rawJsonArray, OutputStream jsonlOut,
                         ProgressListener listener) throws IOException {
        long records = 0;
        try (JsonParser parser = factory.createParser(rawJsonArray);
             BufferedWriter writer = new BufferedWriter(
                     new OutputStreamWriter(jsonlOut, StandardCharsets.UTF_8),
                     1 << 20)) {

            JsonToken first = parser.nextToken();
            if (first != JsonToken.START_ARRAY) {
                if (first == JsonToken.START_OBJECT) {
                    do {
                        JsonNode node = mapper.readTree(parser);
                        writer.write(normalize(node, records));
                        writer.write('\n');
                        records++;
                    } while (parser.nextToken() == JsonToken.START_OBJECT);
                    return records;
                }
                throw new IOException(
                        "Unexpected JSON: expected an array, got " + first);
            }

            while (parser.nextToken() == JsonToken.START_OBJECT) {
                JsonNode node = mapper.readTree(parser);
                writer.write(normalize(node, records));
                writer.write('\n');
                records++;
                if (records % REPORT_EVERY == 0 && listener != null) {
                    listener.onRecords(records);
                }
            }
            writer.flush();
        }
        if (listener != null) {
            listener.onRecords(records);
        }
        return records;
    }

    private String normalize(JsonNode in, long seq)
            throws com.fasterxml.jackson.core.JsonProcessingException {
        ObjectNode out = mapper.createObjectNode();
        String id = text(in, "review_id");
        if (id.isEmpty()) {
            id = "gen_" + seq;
        }
        out.put("docId", id);
        out.put("movie", text(in, "movie"));
        out.put("rating", text(in, "rating"));
        out.put("summary", text(in, "review_summary"));
        out.put("review", text(in, "review_detail"));
        return mapper.writeValueAsString(out);
    }

    private static String text(JsonNode node, String field) {
        JsonNode v = node.get(field);
        if (v == null || v.isNull()) {
            return "";
        }
        return v.asText("");
    }
}
