
package com.dzh.extra.utils;

import java.util.Comparator;

/**
 * The Class StringComparetor.
 * 通用string 比较器
 * @version $Id: StringComparetor.java, v 0.1 2015-12-28 20:15:28 xiazhengsheng Exp $
 */
public class StringComparetor  implements Comparator<String>{

    /** 
     * @see Comparator#compare(Object, Object)
     */
    public int compare(String str1, String str2) {
        if (StringUtil.isEmpty(str1)) {
            if (StringUtil.isEmpty(str2)){
                return 0;
            } else {
                return -1;
            }
        } else {
            if (StringUtil.isEmpty(str2)){
                return -1;
            } else {
                return str1.compareTo(str2);
            }
        }
    }
}
