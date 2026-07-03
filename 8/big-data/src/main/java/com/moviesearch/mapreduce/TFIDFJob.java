package com.moviesearch.mapreduce;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.input.KeyValueTextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public final class TFIDFJob {

    public static final String TOTAL_DOCS = "tfidf.totalDocs";

    private TFIDFJob() {
    }

    public static class ScoreMapper
            extends Mapper<Text, Text, Text, Text> {

        private final Text word = new Text();
        private final Text posting = new Text();

        @Override
        protected void map(Text key, Text value, Context context)
                throws IOException, InterruptedException {
            word.set(key);
            for (String p : value.toString().split(",")) {
                if (!p.isEmpty()) {
                    posting.set(p);
                    context.write(word, posting);
                }
            }
        }
    }

    public static class ScoreReducer
            extends Reducer<Text, Text, Text, Text> {

        private long totalDocs;
        private final Text outVal = new Text();

        @Override
        protected void setup(Context context) {
            totalDocs = context.getConfiguration().getLong(TOTAL_DOCS, 1L);
            if (totalDocs < 1) {
                totalDocs = 1;
            }
        }

        @Override
        protected void reduce(Text key, Iterable<Text> values, Context context)
                throws IOException, InterruptedException {
            List<String[]> docTf = new ArrayList<>();
            for (Text v : values) {
                String s = v.toString();
                int c = s.lastIndexOf(':');
                if (c <= 0) {
                    continue;
                }
                try {
                    int tf = Integer.parseInt(s.substring(c + 1));
                    if (tf > 0) {
                        docTf.add(new String[]{s.substring(0, c),
                                Integer.toString(tf)});
                    }
                } catch (NumberFormatException ignored) {
                }
            }
            long df = docTf.size();
            if (df == 0) {
                return;
            }
            double idf = Math.log10((double) totalDocs / (double) df);
            if (idf < 0) {
                idf = 0;
            }

            List<double[]> scored = new ArrayList<>();
            String[] docs = new String[docTf.size()];
            for (int i = 0; i < docTf.size(); i++) {
                int tf = Integer.parseInt(docTf.get(i)[1]);
                double w = (1.0 + Math.log10(tf)) * idf;
                docs[i] = docTf.get(i)[0];
                scored.add(new double[]{i, w});
            }
            scored.sort((a, b) -> Double.compare(b[1], a[1]));

            StringBuilder sb = new StringBuilder();
            for (double[] s : scored) {
                if (sb.length() > 0) {
                    sb.append(',');
                }
                sb.append(docs[(int) s[0]]).append(':')
                        .append(String.format("%.6f", s[1]));
            }
            outVal.set(sb.toString());
            context.write(key, outVal);
        }
    }

    public static Job configure(Configuration conf, String input,
                                String output, long totalDocs)
            throws IOException {
        conf.setLong(TOTAL_DOCS, totalDocs);
        Job job = Job.getInstance(conf, "Job3-TFIDF");
        job.setJarByClass(TFIDFJob.class);
        job.setInputFormatClass(KeyValueTextInputFormat.class);
        job.setMapperClass(ScoreMapper.class);
        job.setReducerClass(ScoreReducer.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(Text.class);
        FileInputFormat.addInputPath(job, new Path(input));
        FileOutputFormat.setOutputPath(job, new Path(output));
        return job;
    }
}
