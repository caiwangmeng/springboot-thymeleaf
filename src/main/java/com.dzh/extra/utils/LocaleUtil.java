package com.dzh.extra.utils;

import org.springframework.util.StringUtils;

import java.util.Locale;


public class LocaleUtil {
    /***en_US*/
    public final static Locale locale_US_supported=Locale.US;
    
    /***zh_CN*/
    public final static Locale locale_CHINA_supported=Locale.CHINA;
    
    public static Locale getSupportLocale(String locale){
        Locale destLocale=null;
        if (StringUtil.isNotBlank(locale) ){
            destLocale=StringUtils.parseLocaleString(locale);
        }
        return getSupportLocale(destLocale); 
    }

    public static Locale getSupportLocale(Locale destLocale) {
        Locale theLocale  =null ;
        if (destLocale!=null){
            if (destLocale.getLanguage().equals(locale_CHINA_supported.getLanguage())){
                theLocale= locale_CHINA_supported;
            } else if (destLocale.getLanguage().equals(locale_US_supported.getLanguage())){
                theLocale= locale_US_supported;
            } 
        }
        
        if (theLocale==null){
            theLocale=locale_US_supported;
        }
        return theLocale;
    }
    
    public static String getSupportedLocale(String locale){
        return getSupportLocale(locale).toString();
    }
    
    public static boolean getIsEnglish(Locale locale){
        return locale_US_supported.equals(getSupportLocale(locale));
    }

}
