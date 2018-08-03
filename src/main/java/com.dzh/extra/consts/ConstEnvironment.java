package com.dzh.extra.consts;

public class ConstEnvironment {

    public static String CURRENT_ENV = null;

    public static final String TEST_ENV = "TEST";

    public static final String CLUSTER_NAME = "cluster.name";

    //索引名称（数据库名）
    public static final String ES_INDEX_FIRST = "customer";

    //类型名称（表名）
    public static final String ES_TYPE_FIRST = "external";

    //索引名称（数据库名）
    public static final String ES_INDEX_SECOND= "tst0633";

    //类型名称（表名）
    public static final String ES_TYPE_SECOND = "person";

    public static final String URL_ALL_INDEX = "http://esHost:9200/_cat/indices?v";

    public static final String ES_HOST = "esHost";

    public static final String ES = "es";

}
