package com.dzh.extra.utils;
import java.util.Locale;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * 系统bean帮助类
 */
@Component
public class SpringContextUtil implements ApplicationContextAware  {

    private static ApplicationContext context;

    @Override
    @SuppressWarnings("static-access" )
    public void setApplicationContext(ApplicationContext contex)
            throws BeansException {
        // TODO Auto-generated method stub
        this.context = contex;
    }
    public static Object getBean(String beanName){
        return context.getBean(beanName);
    }

    public static<T> T getBean(String beanName, Class<T> objClass){
        T bean = (T) context.getBean(beanName);
        return bean;
    }

    public static String getMessage(String key){
        return context.getMessage(key, null, Locale.getDefault());
    }
}