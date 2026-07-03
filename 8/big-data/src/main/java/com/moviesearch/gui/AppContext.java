package com.moviesearch.gui;

import com.moviesearch.config.AppConfig;
import com.moviesearch.hdfs.HDFSClient;
import com.moviesearch.search.SearchEngine;

import java.io.IOException;

public interface AppContext {

    AppConfig config();

    HDFSClient hdfs() throws IOException;

    SearchEngine searchEngine();

    void status(String message);
}
