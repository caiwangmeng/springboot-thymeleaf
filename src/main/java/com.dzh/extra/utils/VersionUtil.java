package com.dzh.extra.utils;

/**
 * Created by liuxingwen on 17/3/28.
 */
public class VersionUtil {

    /**
     * 返回
     * 0  相等
     * 1  requestVersion大
     * -1 checkVersion 大
     * @param requestVersion
     * @param checkVersion
     * @return
     */
    public static int compareVersion(String requestVersion, String checkVersion){
        if(StringUtil.isEmpty(requestVersion)||StringUtil.isEmpty(checkVersion)) {
            return 0;
        }
        int compareValue = 0;
        if(requestVersion.equals(checkVersion)){
            return compareValue;
        }
        String[] requestSplit = requestVersion.split("\\.");
        String[] lastSplit = checkVersion.split("\\.");
        int requestLen = requestSplit.length;
        int lastLeh = lastSplit.length;
        String[] longest = lastLeh > requestLen ? lastSplit : requestSplit;
        int length = longest.length;
        for (int i = 0; i < length; i++) {
            Integer requestNum = i< requestLen ? Integer.parseInt(requestSplit[i]) : 0;
            Integer checkNum = i< lastLeh ? Integer.parseInt(lastSplit[i]) : 0;
            if(checkNum == requestNum){
                continue;
            }
            if(checkNum > requestNum){
                compareValue = -1;
                break;
            }else {
                compareValue = 1;
                break;
            }
        }
        return compareValue;
    }

}
