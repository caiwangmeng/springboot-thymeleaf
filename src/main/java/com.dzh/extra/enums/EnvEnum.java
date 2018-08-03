package com.dzh.extra.enums;

import java.util.Arrays;
import java.util.List;

public enum EnvEnum {

    TEST,

    UAT,

    PROSH,

    PROBJ,

    PRO_HUAWEI_CLOUD,
    ;

    public static List<EnvEnum> allEnv = null;

    public static List<EnvEnum> getAllEnv(){
        if (allEnv == null){
            List<EnvEnum> envEnums = Arrays.asList(TEST, UAT, PROSH, PROBJ, PRO_HUAWEI_CLOUD);
            allEnv = envEnums;
        }
        return allEnv;
    }

}
