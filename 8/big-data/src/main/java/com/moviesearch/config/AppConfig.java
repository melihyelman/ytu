package com.moviesearch.config;

import org.apache.hadoop.conf.Configuration;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

public final class AppConfig {

    private final Properties props = new Properties();

    public AppConfig() {
        load();
    }

    private void load() {
        Path local = Paths.get("config.properties");
        if (Files.isReadable(local)) {
            try (InputStream in = Files.newInputStream(local)) {
                props.load(in);
                return;
            } catch (IOException ignored) {
            }
        }
        try (InputStream in = AppConfig.class.getClassLoader()
                .getResourceAsStream("config.properties")) {
            if (in != null) {
                props.load(in);
            }
        } catch (IOException ignored) {
        }
    }

    public String get(String key, String def) {
        return props.getProperty(key, def);
    }

    public void set(String key, String value) {
        props.setProperty(key, value);
    }

    public String fsDefaultFS() {
        return get("fs.defaultFS", "hdfs://namenode:9000");
    }

    public String rawDir() {
        return abs(get("path.raw", "raw"));
    }

    public String datasetPath() {
        return abs(get("path.dataset", "raw/dataset.jsonl"));
    }

    public String tokensDir() {
        return abs(get("path.tokens", "tokens"));
    }
    public String indexDir() {
        return abs(get("path.index", "index"));
    }

    public String tfidfDir() {
        return abs(get("path.tfidf", "tfidf"));
    }

    private String abs(String path) {
        return path.startsWith("/") ? path : "/" + path;
    }

    public int topK() {
        try {
            return Integer.parseInt(get("search.topK", "50"));
        } catch (NumberFormatException e) {
            return 50;
        }
    }

    public Configuration toHadoopConfiguration() {
        Configuration conf = new Configuration();
        conf.set("fs.defaultFS", fsDefaultFS());
        conf.set("mapreduce.framework.name", "yarn");
        conf.set("yarn.resourcemanager.hostname", "resourcemanager");
        conf.set("mapreduce.jobhistory.address", "historyserver:10020");
        conf.set("dfs.replication", "2");

        conf.set("fs.hdfs.impl.disable.cache", "true");
        conf.set("dfs.client.use.datanode.hostname", "true");
        conf.set("mapreduce.app-submission.cross-platform", "true");

        String h = get("hadoop.mapred.home", "/opt/hadoop-3.2.1");
        String env = "HADOOP_MAPRED_HOME=" + h;
        conf.set("yarn.app.mapreduce.am.env",
                get("yarn.app.mapreduce.am.env", env));
        conf.set("mapreduce.map.env", get("mapreduce.map.env", env));
        conf.set("mapreduce.reduce.env", get("mapreduce.reduce.env", env));

        String cp = get("mapreduce.application.classpath",
                h + "/etc/hadoop"
                + ":" + h + "/share/hadoop/common/*"
                + ":" + h + "/share/hadoop/common/lib/*"
                + ":" + h + "/share/hadoop/hdfs/*"
                + ":" + h + "/share/hadoop/hdfs/lib/*"
                + ":" + h + "/share/hadoop/mapreduce/*"
                + ":" + h + "/share/hadoop/mapreduce/lib/*"
                + ":" + h + "/share/hadoop/yarn/*"
                + ":" + h + "/share/hadoop/yarn/lib/*");
        conf.set("mapreduce.application.classpath", cp);

        conf.set("yarn.app.mapreduce.am.job.client.port-range",
                get("yarn.app.mapreduce.am.job.client.port-range",
                        "50100-50120"));
        return conf;
    }
}
