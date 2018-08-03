
package com.dzh.extra.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * The Class StringUtil.
 * 处理String的工具类
 */
public class StringUtil {

    final static Logger logger = LoggerFactory.getLogger(StringUtil.class);
    
    public static final String emptyString="";

    /**
     * Equals.
     *
     * @param source the source
     * @param dest the dest
     * @return true, if successful
     */
    public static boolean equals(String source, String dest) {
        return (source != null) && (source.equals(dest));
    }

    /**
     * Not equals.
     *
     * @param source the source
     * @param dest the dest
     * @return true, if successful
     */
    public static boolean notEquals(String source, String dest) {
        return !equals(source, dest);
    }

    /**
     * Checks if is empty.
     *
     * @param str the str
     * @return true, if is empty
     */
    public static boolean isEmpty(String str) {
        return str == null || str.length() == 0;
    }

    /**
     * <p>Checks if a ConstString is not empty ("") and not null.</p>
     *
     * <pre>
     * isNotEmpty(null)      = false
     * isNotEmpty("")        = false
     * isNotEmpty(" ")       = true
     * isNotEmpty("bob")     = true
     * isNotEmpty("  bob  ") = true
     * </pre>
     *
     * @param str  the ConstString to check, may be null
     * @return <code>true</code> if the ConstString is not empty and not null
     */
    public static boolean isNotEmpty(String str) {
        return !isEmpty(str);
    }

    /**
     * <p>Checks if a ConstString is whitespace, empty ("") or null.</p>
     *
     * <pre>
     * isBlank(null)      = true
     * isBlank("")        = true
     * isBlank(" ")       = true
     * isBlank("bob")     = false
     * isBlank("  bob  ") = false
     * </pre>
     *
     * @param str  the ConstString to check, may be null
     * @return <code>true</code> if the ConstString is null, empty or whitespace
     */
    public static boolean isBlank(String str) {
        int strLen;
        if (str == null || (strLen = str.length()) == 0) {
            return true;
        }
        for (int i = 0; i < strLen; i++) {
            if ((Character.isWhitespace(str.charAt(i)) == false)) {
                return false;
            }
        }
        return true;
    }

    /**
     * <p>Checks if a ConstString is not empty (""), not null and not whitespace only.</p>
     * 
     * <pre>
     * isNotBlank(null)      = false
     * isNotBlank("")        = false
     * isNotBlank(" ")       = false
     * isNotBlank("bob")     = true
     * isNotBlank("  bob  ") = true
     * </pre>
     *
     * @param str the str
     * @return true, if is not blank
     */
    public static boolean isNotBlank(String str) {
        return !isBlank(str);
    }

    /**
     * Starts with ignore case.
     *
     * @param str the str
     * @param prefix the prefix
     * @return true, if successful
     */
    public static boolean startsWithIgnoreCase(String str, String prefix) {
        return startsWith(str, prefix, true);
    }

    /**
     * <p>Check if a ConstString starts with a specified prefix (optionally case insensitive).</p>
     *
     * @param str  the ConstString to check, may be null
     * @param prefix the prefix to find, may be null
     * @param ignoreCase inidicates whether the compare should ignore case
     *  (case insensitive) or not.
     * @return <code>true</code> if the ConstString starts with the prefix or
     *  both <code>null</code>
     * @see String#startsWith(String)
     */
    private static boolean startsWith(String str, String prefix, boolean ignoreCase) {
        if (str == null || prefix == null) {
            return (str == null && prefix == null);
        }
        if (prefix.length() > str.length()) {
            return false;
        }
        return str.regionMatches(ignoreCase, 0, prefix, 0, prefix.length());
    }

    /**
     * Ends with ignore case.
     *
     * @param str the str
     * @param suffix the suffix
     * @return true, if successful
     */
    public static boolean endsWithIgnoreCase(String str, String suffix) {
        return endsWith(str, suffix, true);
    }

    /**
     * <p>Check if a ConstString ends with a specified suffix (optionally case insensitive).</p>
     *
     * @param str  the ConstString to check, may be null
     * @param suffix the suffix to find, may be null
     * @param ignoreCase inidicates whether the compare should ignore case
     *  (case insensitive) or not.
     * @return <code>true</code> if the ConstString starts with the prefix or
     *  both <code>null</code>
     * @see String#endsWith(String)
     */
    private static boolean endsWith(String str, String suffix, boolean ignoreCase) {
        if (str == null || suffix == null) {
            return (str == null && suffix == null);
        }
        if (suffix.length() > str.length()) {
            return false;
        }
        int strOffset = str.length() - suffix.length();
        return str.regionMatches(ignoreCase, strOffset, suffix, 0, suffix.length());
    }

    /**
     * To upper case.
     * <pre>如果str为null 将为null</pre>
     *
     * @param str the str
     * @return the string
     */
    public static String toUpperCase(String str) {
        if (str != null) {
            return str.toUpperCase();
        }
        return null;
    }

    /**
     * To lower case.
     *<pre>如果str为null 将为null</pre>
     * @param str the str
     * @return the string
     */
    public static String toLowerCase(String str) {
        if (str != null) {
            return str.toLowerCase();
        }
        return null;
    }

    /**
     * Checks if is string.
     *
     * @param obj the obj
     * @return true, if is string
     */
    public static boolean isString(Object obj) {
        return (obj != null) && (obj instanceof String);
    }

    /**
     * Checks if is object.
     *
     * @param obj the obj
     * @return true, if is object
     */
    public static boolean isObject(Object obj) {
        return (obj != null) && !(obj instanceof String);
    }

    /**
     * To string blank.
     *
     * @param dest the dest
     * @return the string
     */
    public static String toStringBlank(String dest) {
        if (dest == null) {
            return "";
        }
        return dest;
    }

    /**
     * Parser to list.
     *
     * @param dest the dest
     * @return the list
     */
    public static List<String> parserToList(String dest) {
        List<String> result = new ArrayList<String>();
        if (isNotEmpty(dest)) {
            String[] dests = dest.split("\n");
            for (String sub1 : dests) {
                sub1 = sub1.trim();
                if (isNotBlank(sub1)) {
                    String[] subDests = sub1.split(" ");
                    for (String sub2 : subDests) {
                        sub2 = sub2.trim();
                        if (isNotEmpty(sub2)) {
                            result.add(sub2);
                        }
                    }
                }
            }
        }
        return result;
    }

    public static String toParamsString(Object[] params) {
        if (CollectionUtil.isEmpty(params)) {
            return "";
        }

        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < params.length; i++) {
            sb.append(params[i]);
            if (i < params.length - 1) {
                sb.append(',');
            }
        }
        return sb.toString();
    }

    public static String[] toStringArray(Object[] params) {
        String[] result = null;
        if (CollectionUtil.isNotEmpty(params)) {
            result = new String[params.length];
            for (int i = 0; i < params.length; i++) {
                Object obj = params[i];
                if (obj == null) {
                    result[i] = "";
                } else {
                    result[i] = obj.toString();
                }
            }
        }
        return result;
    }

    public static int indexOf(String source, String dest) {
        if (isEmpty(source) || isEmpty(dest)) {
            return -1;
        }
        return source.indexOf(dest);
    }

    public static String succCn(Boolean dest) {
        if (dest == null || !dest) {
            return "失败";
        }
        return "成功";
    }
    
    /***
     * 截取字符串,从idx位置截取 ,截取的部分用replaceBy代替，获取最大的长度为
     * */
    public static String abbr(String source ,char replaceChar,int fromIdx, int times,int resultLen){
        if (isEmpty(source)){
            return source;
        }
        
        if (replaceChar==0){
            return source;
        }
        
        if (fromIdx<0){
            return source;
        }
        
        if (times<=0){
            return source;
        }
        
        StringBuffer sb =new StringBuffer();
        sb.append(source.subSequence(0, fromIdx));
        for (int i = 0; i < times; i++) {
           sb.append(replaceChar);
        }
        
        int last =resultLen-(fromIdx+times);
        if (last>0){
            sb.append(source.substring(source.length()-last));
        }
        return sb.toString();
    }

    
//    /**
//     * 处理：手机号脱敏
//     */
//    public static ConstString desensitizeMobile(ConstString mobile) {
//        if (isEmpty(mobile)){
//            return "";
//        }
//        int length = mobile.length();
//        int fromIdx =length-5;
//        if (fromIdx<=0){
//            fromIdx =1;
//        }
//        return abbr(mobile, '*', fromIdx,4, length);
//    }
//  
    
    /**
     * 处理：手机号脱敏
     */
    public static String desensitizeMobile(String mobile) {
        if (null == mobile){
            return "";
        }
        int beginIndex = 3;
        int endIndex = 0;
        int stars = 4;
        if (mobile.length() >= 11){
            endIndex = mobile.length() - 4;
            stars = mobile.length() - 7;
        } else if (mobile.length() > 7 && mobile.length() < 11){
            endIndex = 7;
        } else if (mobile.length() > 3 && mobile.length() <= 7){
            endIndex = mobile.length();
            stars = mobile.length() - 3;
        } else {
            endIndex = mobile.length();
            beginIndex = mobile.length();
            stars = 0;
        }
        String before = mobile.substring(0, beginIndex);
        String end = mobile.substring(endIndex, mobile.length());
        String star = "";
        while (stars > 0){
            star += "*";
            stars --;
        }
        mobile = before + star + end;
        return mobile;
    }

    /**
     * 处理：首尾脱敏
     */
    public static String desensitizeBeginAndEnd(String desensitizeStr) {
        if (null == desensitizeStr || desensitizeStr.length() == 0){
            return "";
        }
        if (desensitizeStr.length() >= 2){
            String star = "";
            int stars = desensitizeStr.length() - 2;
            while (stars > 0){
                star += "*";
                stars --;
            }
            String begin = desensitizeStr.substring(0, 1);
            String end = desensitizeStr.substring(desensitizeStr.length() - 1);
            desensitizeStr = begin + star + end;
        }
        return desensitizeStr;
    }    
    /**
     * 字符串相加，null变为空.
     * 
     * @param strs
     * @return
     */
    public static String concatNoNull(String...strs){
        if (CollectionUtil.isNotEmpty(strs)){
            StringBuffer sb=new StringBuffer();
            for (String str : strs) {
                if (isNotEmpty(str)){
                    sb.append(str);
                }
            }
            return sb.toString();
        }
        return "";
    }
    
    public static String toStringIfNullThenEmpty(Object dest){
        if (dest==null){
            return "";
        }
        
        if (dest instanceof String){
            return (String)dest;
        }
        
        return dest.toString();
    }
    
    public static boolean isEqual(String str, String other) {
        if (str!=null){
            return str.equals(other);
        }
        
        if (other!=null){
            return other.equals(str);
        }
        
        return false;
    }

    /**
     *  大Class 名称转DB名称
     * @param classTotalName
     * @return
     */
    public static String getDbClassName(String classTotalName){
        // 获得类名
        String[] split = classTotalName.split("\\.");
        List<String> strings = Arrays.asList(split);
        String className = strings.get(strings.size() - 1);

        // 按照标准转换
        String[] stringArr = new String [5];  // 5个大写应该够用
        int count = 0;
        stringArr[count] = "";

        for( int i = 0; i < className.length(); i++ ){
            char a = className.charAt(i);
            String b = ""+a;
            if( a>64 && a<91 ){ //大写字母的ASCLL码取值范围
                count++;
                stringArr[count]=b;
            }else{
                stringArr[count] = stringArr[count].concat(b);
            }
        }

        StringBuffer sss = new StringBuffer();
        for(int i = 0 ; i < stringArr.length ; i++){
            if (isNotBlank(stringArr[i])) {
                sss.append(stringArr[i].toLowerCase()).append("_");
            }
        }

        int length = sss.length();
        return sss.substring(0, length-1);
    }

    /**
     * 首字母小写  "GetName" -> "getName"
     * @param strOrigin
     * @return
     */
    public static String firstStr2LowerCase(String strOrigin) {
        // TODO 首字母限制为26个大写字母之内
        if (strOrigin == null || isBlank(strOrigin))
            return strOrigin;
        String originHead = strOrigin.substring(0, 1);
        String originTail = strOrigin.substring(1, strOrigin.length());
        return originHead.toLowerCase() + originTail;
    }

}
