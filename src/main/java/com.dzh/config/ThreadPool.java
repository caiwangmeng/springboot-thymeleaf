package com.dzh.config;

import java.util.concurrent.*;

public class ThreadPool {

    /**
     * 缓存线程池
     * 核心3
     */
    public static ExecutorService exec  = new ThreadPoolExecutor(3,Integer.MAX_VALUE,
                60L,TimeUnit.SECONDS,
                new SynchronousQueue<Runnable>());

}
