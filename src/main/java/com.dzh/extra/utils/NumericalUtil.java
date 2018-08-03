package com.dzh.extra.utils;

/****
 * 数字工具,进行42以下的任意进制转换
 * @author dgmislrh
 */
public class NumericalUtil {

    /**
     * 十进制数转为任意其他进制
     * 转为32进制以上可能有问题
     * 浮点数也可能有问题
     */
    public static String decimalToDestBase(long decimal, int destBase) {
        if (destBase == 10)
            return String.valueOf(decimal);
        String res = "";
        while(decimal != 0) {
            long remainder = decimal % destBase;
            res = toDestBaseChar(remainder) + res;
            decimal = decimal / destBase;
        }
        return res;
    }

    public static char toDestBaseChar(long remainder) {
        if(remainder <= 9 && remainder >= 0)
            return (char)(remainder + '0');
        else
            return (char)(remainder - 10 + 'A');
    }

}
