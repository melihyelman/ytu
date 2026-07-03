package com.moviesearch.mapreduce;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.moviesearch.text.TextAnalyzer;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import java.io.IOException;
import java.util.List;

public final class TokenizationJob {

    public static final String COUNTER_GROUP = "STATS";
    public static final String DOC_COUNT = "DOC_COUNT";
    public static final String MALFORMED = "MALFORMED";

    private TokenizationJob() {
    }

    public static class TokenizeMapper
            extends Mapper<LongWritable, Text, Text, Text> {

        private final ObjectMapper json = new ObjectMapper();
        private final Text outKey = new Text();
        private final Text outVal = new Text();

        @Override
        protected void map(LongWritable key, Text value, Context context)
                throws IOException, InterruptedException {
            String line = value.toString();
            if (line.isEmpty()) {
                return;
            }
            String docId;
            String text;
            try {
                JsonNode n = json.readTree(line);
                docId = n.path("docId").asText("");
                text = n.path("summary").asText("") + " "
                        + n.path("review").asText("");
            } catch (Exception e) {
                context.getCounter(COUNTER_GROUP, MALFORMED).increment(1);
                return;
            }
            if (docId.isEmpty()) {
                context.getCounter(COUNTER_GROUP, MALFORMED).increment(1);
                return;
            }
            docId = docId.replace(':', '_').replace(',', '_');
            context.getCounter(COUNTER_GROUP, DOC_COUNT).increment(1);

            outKey.set(docId);
            List<String> tokens = TextAnalyzer.analyze(text);
            for (String t : tokens) {
                outVal.set(t);
                context.write(outKey, outVal);
            }
        }
    }

    public static class CollectReducer
            extends Reducer<Text, Text, Text, Text> {

        private final Text outVal = new Text();

        @Override
        protected void reduce(Text key, Iterable<Text> values, Context context)
                throws IOException, InterruptedException {
            StringBuilder sb = new StringBuilder();
            for (Text v : values) {
                if (sb.length() > 0) {
                    sb.append(' ');
                }
                sb.append(v.toString());
            }
            if (sb.length() == 0) {
                return;
            }
            outVal.set(sb.toString());
            context.write(key, outVal);
        }
    }

    public static Job configure(Configuration conf, String input,
                                String output) throws IOException {
        Job job = Job.getInstance(conf, "Job1-Tokenization");
        job.setJarByClass(TokenizationJob.class);
        job.setMapperClass(TokenizeMapper.class);
        job.setReducerClass(CollectReducer.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(Text.class);
        FileInputFormat.addInputPath(job, new Path(input));
        FileOutputFormat.setOutputPath(job, new Path(output));
        return job;
    }
}
