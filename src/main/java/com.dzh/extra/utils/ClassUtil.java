package com.dzh.extra.utils;

import com.dzh.extra.consts.ConstStringCommon;

public class ClassUtil {

    /*** 转义过的 . */
    private static final String ROUND_DOT_ESCAPE = "\\.";

    /**
     * 大class 名 -> 类名
     * com.dzh.domain.City -> City
     */
    public static String className2DomainName(String className){
        if (StringUtil.isBlank(className))
            return null;
        String[] splitStrArray = className.split(ROUND_DOT_ESCAPE);
        if (CollectionUtil.isEmpty(splitStrArray))
            return null;
        int length = splitStrArray.length;
        return splitStrArray[length - 1];
    }

    /**
     * 大class 名 -> 类名
     * com.dzh.domain.City -> City
     */
    public static String getClassName(Object obj){
        if (obj == null)
            return null;
        String referenceName;
        String className = null;
        if (obj instanceof Class){
            referenceName = ((Class) obj).getName();
            System.out.println("===" + referenceName);
            String[] split = referenceName.split(ROUND_DOT_ESCAPE);
            if (split.length >= 1)
                className = split[split.length - 1];
        } else {
            Class<?> clazz = obj.getClass();
            String pkgName = clazz.getPackage().getName();
            referenceName = clazz.getName();
            String[] split = referenceName.split(pkgName + ConstStringCommon.SPOT);
            if (split.length < 2)
                return null;
            className = split[1];
        }
        return className;
    }

    /**
     * 大class 名 -> 类名 首字母小写
     * com.dzh.domain.City -> city
     */
    public static String getClassNameFirstStr2Lower(Object obj){
        String className = getClassName(obj);
        return StringUtil.firstStr2LowerCase(className);
    }

    /**
     * 获取对象全称
     * @param obj   对象
     * @return      com.dzh.domain.City
     */
    public static String getReferenceName(Object obj){
        if (obj == null)
            return null;
        String referenceName;
        if (obj instanceof Class)
            referenceName = ((Class) obj).getName();
        else
            referenceName = obj.getClass().getName();
        return referenceName;
    }

}
