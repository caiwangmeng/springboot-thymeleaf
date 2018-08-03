package com.dzh.extra.utils;

public class BusinessException {

    private static final String STRING_BLANK_MSG = "String is blank.";

    public static void throwException(String errorMsg){
        throw new RuntimeException(errorMsg);
    }

    public static void mustNotNull(Object object, String errorMsg){
        if (null == object){
            throw new RuntimeException(errorMsg);
        }
    }

    public static void mustNotBlank(String target, String errorMsg){
        if (StringUtil.isBlank(target)){
            throw new RuntimeException(errorMsg);
        }
    }

    public static void mustNotBlank(String target){
        if (StringUtil.isBlank(target)){
            throw new RuntimeException(STRING_BLANK_MSG);
        }
    }

}
