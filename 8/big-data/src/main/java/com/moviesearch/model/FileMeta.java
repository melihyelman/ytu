package com.moviesearch.model;

public final class FileMeta {
    public final String name;
    public final String path;
    public final boolean directory;
    public final long length;
    public final short replication;
    public final long blockSize;
    public final long blockCount;
    public final long modificationTime;
    public final String owner;
    public final String group;
    public final String permission;

    public FileMeta(String name, String path, boolean directory, long length,
                    short replication, long blockSize, long blockCount,
                    long modificationTime, String owner, String group,
                    String permission) {
        this.name = name;
        this.path = path;
        this.directory = directory;
        this.length = length;
        this.replication = replication;
        this.blockSize = blockSize;
        this.blockCount = blockCount;
        this.modificationTime = modificationTime;
        this.owner = owner;
        this.group = group;
        this.permission = permission;
    }
}
