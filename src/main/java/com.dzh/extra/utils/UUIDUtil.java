package com.dzh.extra.utils;

public class UUIDUtil {

    /**
     * 根据时间戳获取主键
     * @return
     */
    public static String getUUID(){
        long timeNow = System.currentTimeMillis();
        long id = timeNow + RandomUtil.getRandom();
        return NumericalUtil.decimalToDestBase(id, 16);
    }

}
