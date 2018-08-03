package com.dzh.extra.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.*;

/**
 * The Class ThreadUtil.
 * 简单的线程池，
 * @author Xia Zhengsheng
 * @version $Id: ThreadUtil.java, v 0.1 2016-12-26 14:30:50 Xia zhengsheng Exp $
 */
public class ThreadUtil {

    final static Logger logger = LoggerFactory.getLogger(ThreadUtil.class);
    public static ExecutorService es = null;

    
    public static ExecutorService getExecutorService() {
        if (es == null) {
            es = Executors.newCachedThreadPool();
        }
        return es;
    }


    public static  <T> List<T> invokeAll(Collection<? extends Callable<T>> tasks){
        try {
            List<Future<T>> futures = getExecutorService().invokeAll(tasks);
            List<T> list = new ArrayList<T>();
            for (Future f: futures){
                try {
                    list.add((T) f.get());
                } catch (ExecutionException e) {
                    logger.error(e.getMessage(),e);
                }
            }
            return list;
        } catch (InterruptedException e) {
            logger.error(e.getMessage(),e);
        }
        return null;
    }

}
