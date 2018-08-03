package com.dzh.extra.utils;

import org.springframework.util.Base64Utils;

import java.security.Key;

public class Base64Util {
    
    public static byte[] decodeFromString(String src) {
        return Base64Utils.decodeFromString(src);
    }
    
    public static String encodeToString(byte[] src) {
        return Base64Utils.encodeToString(src);
    }
    
    public static String encode(String src) {
        src =StringUtil.toStringIfNullThenEmpty(src);
        return Base64Utils.encodeToString(src.getBytes());
    }
    
    public static String encodeKey(Key key){
        AssertUtil.mustNotNull(key);
        return encodeToString(key.getEncoded());
    }

}
