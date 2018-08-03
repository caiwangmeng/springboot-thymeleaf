package com.dzh.extra.utils;

import com.dzh.config.ThreadPool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.Callable;
import java.util.concurrent.FutureTask;

public class LoggerUtil {

    public static Logger getLogger(Object obj){
        return LoggerFactory.getLogger(obj.getClass());
    }

    public static void info(Object obj, String msg){
        ThreadPool.exec.submit(new FutureTask<>(new Callable<Object>() {
            @Override
            public Object call() throws Exception {
                Logger logger = getLogger(obj);
                if (logger.isInfoEnabled())
                    logger.info(msg);
                return null;
            }
        }));
    }

    public static void infoSync(Object obj, String msg){
        Logger logger = getLogger(obj);
        if (logger.isInfoEnabled())
            logger.info(msg);
    }

    public static void warn(Object obj, String msg){
        ThreadPool.exec.submit(new FutureTask<>(new Callable<Object>() {
            @Override
            public Object call() throws Exception {
                Logger logger = getLogger(obj);
                if (logger.isWarnEnabled())
                    logger.warn(msg);
                return null;
            }
        }));
    }

    public static void error(Object obj, String msg){
        ThreadPool.exec.submit(new FutureTask<>(new Callable<Object>() {
            @Override
            public Object call() throws Exception {
                Logger logger = getLogger(obj);
                if (logger.isErrorEnabled())
                    logger.error(msg);
                return null;
            }
        }));
    }
}
