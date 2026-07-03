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
import java.util.LinkedHashMap;
import java.util.Map;

public final class InvertedIndexJob {

    private InvertedIndexJob() {
    }

    public static class EmitMapper
            extends Mapper<Text, Text, Text, Text> {

        private final Text word = new Text();
        private final Text doc = new Text();

        @Override
        protected void map(Text key, Text value, Context context)
                throws IOException, InterruptedException {
            String docId = key.toString();
            String tokens = value.toString();
            if (tokens.isEmpty()) {
                return;
            }
            doc.set(docId);
            int start = 0;
            int len = tokens.length();
            for (int i = 0; i <= len; i++) {
                if (i == len || tokens.charAt(i) == ' ') {
                    if (i > start) {
                        word.set(tokens.substring(start, i));
                        context.write(word, doc);
                    }
                    start = i + 1;
                }
            }
        }
    }

    public static class GroupReducer
            extends Reducer<Text, Text, Text, Text> {

        private final Text outVal = new Text();

        @Override
        protected void reduce(Text key, Iterable<Text> values, Context context)
                throws IOException, InterruptedException {
            Map<String, Integer> tf = new LinkedHashMap<>();
            for (Text v : values) {
                tf.merge(v.toString(), 1, Integer::sum);
            }
            StringBuilder postings = new StringBuilder();
            for (Map.Entry<String, Integer> e : tf.entrySet()) {
                if (postings.length() > 0) {
                    postings.append(',');
                }
                postings.append(e.getKey()).append(':').append(e.getValue());
            }
            outVal.set(postings.toString());
            context.write(key, outVal);
        }
    }

    public static Job configure(Configuration conf, String input,
                                String output) throws IOException {
        Job job = Job.getInstance(conf, "Job2-InvertedIndex");
        job.setJarByClass(InvertedIndexJob.class);
        job.setInputFormatClass(KeyValueTextInputFormat.class);
        job.setMapperClass(EmitMapper.class);
        job.setReducerClass(GroupReducer.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(Text.class);
        FileInputFormat.addInputPath(job, new Path(input));
        FileOutputFormat.setOutputPath(job, new Path(output));
        return job;
    }
}
