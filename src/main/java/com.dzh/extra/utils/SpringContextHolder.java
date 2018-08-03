package com.dzh.extra.utils;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
/***
 * 该类被spring注册后，可拿到 applicationContext对象
 * 以及从applicationContext获得bean
 * 
 * @author XiaZhengsheng
 * @version $Id: SpringContextHolder.java, v 0.1 2016年12月27日 下午2:58:19 XiaZhengsheng Exp $
 */
public class SpringContextHolder implements ApplicationContextAware {
    final static org.slf4j.Logger     logger = org.slf4j.LoggerFactory.getLogger(SpringContextHolder.class);
    private static ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        SpringContextHolder.applicationContext = applicationContext;
    }

    public static ApplicationContext getApplicationContext() {
        return applicationContext;
    }

    @SuppressWarnings("unchecked")
    public static <T> T getBean(String beanName) {
        Object bean = null;
        try {
            bean = applicationContext.getBean(beanName);
        } catch (BeansException e) {
            logger.error(new StringBuffer("在运行时产生错误信息,此错误信息表示该相应方法已将相关错误catch了，请尽快修复!\n以下是具体错误产生的原因:").append(e.getMessage()).append(" \n")
                .toString(), e);
        }
        return (T) bean;
    }

    @SuppressWarnings("unchecked")
    public static <T> T getBean(String beanName, Object... agrs) {
        Object bean = null;
        try {
            bean = applicationContext.getBean(beanName, agrs);
        } catch (BeansException e) {
            logger.error(new StringBuffer("在运行时产生错误信息,此错误信息表示该相应方法已将相关错误catch了，请尽快修复!\n以下是具体错误产生的原因:").append(e.getMessage()).append(" \n")
                .toString(), e);
        }
        return (T) bean;
    }

    @SuppressWarnings("unchecked")
    public static <T> T getBean(Class<T> clazz) {
        Object bean = null;
        try {
            bean = applicationContext.getBean(clazz);
        } catch (BeansException e) {
            logger.error(new StringBuffer("在运行时产生错误信息,此错误信息表示该相应方法已将相关错误catch了，请尽快修复!\n以下是具体错误产生的原因:").append(e.getMessage()).append(" \n")
                    .toString(), e);
        }
        return (T) bean;
    }

}
