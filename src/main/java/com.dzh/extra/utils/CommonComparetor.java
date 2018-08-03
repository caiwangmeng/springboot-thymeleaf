
package com.dzh.extra.utils;

import java.util.Comparator;

/**
 * The Class StringComparetor.
 * 通用比较器
 */
public class CommonComparetor  implements Comparator<Object>{

    @Override
    public int compare(Object o1, Object o2) {
        if ((o1 instanceof Comparable) && (o2 instanceof Comparable )){
            Comparable c1 =(Comparable)o1;
            Comparable c2 =(Comparable)o2;
            return c1.compareTo(c2);
        } else {
             return o1.toString().compareTo(o2.toString());
        }
    }
}
