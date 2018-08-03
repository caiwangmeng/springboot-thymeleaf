package com.dzh.extra.utils;

import java.util.UUID;

public class PasswordUtil {
    
    
    public static String calcuMd5Password(String password,String passwordRandom){
        StringBuffer sb =new StringBuffer().append(password);
        if (StringUtil.isNotBlank(passwordRandom)){
            sb.append(passwordRandom);
        }
        return MD5Util.md5(sb.toString());
    }
    
    public static String getPasswordRandom(){
        String randomUUID = UUID.randomUUID().toString();
        randomUUID = randomUUID.replaceAll("-", "");
        randomUUID=randomUUID.substring(0,16);
        return randomUUID;
    }
    
}
