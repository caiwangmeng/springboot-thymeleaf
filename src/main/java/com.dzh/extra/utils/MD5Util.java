package com.dzh.extra.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.MessageDigest;

/**
 * The Class MD5Util.
 *
 */
public class MD5Util {
    final static Logger logger = LoggerFactory.getLogger(MD5Util.class);
    private final static String md5="MD5";
    private final static String utf8="UTF-8";

    /***
     * 获得md5 ConstString
     * 
     * @param dest
     * @return
     */
    public static String md5(String dest) {
        try {
            MessageDigest md = MessageDigest.getInstance(md5);
            md.update(dest.getBytes(utf8));
            byte[] digest = md.digest();
            StringBuffer md5 = new StringBuffer();
            for (int i = 0; i < digest.length; i++) {
                md5.append(Character.forDigit((digest[i] & 0xF0) >> 4, 16));
                md5.append(Character.forDigit((digest[i] & 0xF), 16));
            }
            dest = md5.toString();
        } catch (Exception e) {
            logger.error(
                new StringBuffer("在运行时产生错误信息,此错误信息表示该相应方法已将相关错误catch了，请尽快修复!\n以下是具体错误产生的原因:").append(e.getMessage())
                    .append(" \n").toString(), e);
        }
        return dest;
    }

    /**
     * Md5 byte.获得md5 byte
     *
     * @param dest the encrypt str
     * @return the byte[]
     * @throws Exception the exception
     */
    public static byte[] md5Byte(String dest) throws Exception {
        MessageDigest md = MessageDigest.getInstance(md5);
        md.update(dest.getBytes("UTF-8"));
        return md.digest();
    }

}
