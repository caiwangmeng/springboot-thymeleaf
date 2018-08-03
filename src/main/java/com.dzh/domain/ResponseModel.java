package com.dzh.domain;

import java.util.HashMap;

public class ResponseModel {

    private static final String ERROR_MSG = "操作失败";

    private static final String SUCCESS_MSG = "操作成功";

    private static HashMap<String, Object> model = null;

    public static final Integer ERROR_CODE = -1;

    public static final String CODE = "code";

    public static final String MSG = "msg";

    public static final String DATA = "data";


    private ResponseModel(){}

    /**
     * 成功
     */
    public static HashMap<String, Object> success(Object data){
        if(model == null){
            synchronized (HashMap.class) {
                if(model == null)
                    model = new HashMap<>();
            }
        }
        model.put(CODE, 0);
        model.put(MSG, SUCCESS_MSG);
        if(data != null)
            model.put(DATA, data);
        return model;
    }

    /**
     * 成功
     */
    public static HashMap<String, Object> success(Object data, String msg){
        HashMap<String, Object> success = success(data);
        if(success != null)
            model.put(MSG, msg);
        return model;
    }

    /**
     * 成功
     */
    public static HashMap<String, Object> successMsg(String msg){
        return success(null, msg);
    }

    /**
     * 成功
     */
    public static HashMap<String, Object> success(){
        return success("");
    }

    /**
     * 失败
     */
    public static HashMap<String, Object> error(){
        if(model == null){
            synchronized (HashMap.class) {
                if(model==null)
                    model = new HashMap<>();
            }
        }
        model.put(CODE, -1);
        model.put(MSG, ERROR_MSG);
        return model;
    }

    // TODO: 2018/4/2  测试msg为空的时候
    public static HashMap<String, Object> error(String errorMsg){
        if(model == null){
            synchronized (HashMap.class) {
                if(model==null)
                    model = new HashMap<>();
            }
        }
        model.put(CODE, -1);
        model.put(MSG, errorMsg);
        return model;
    }

    public static HashMap<String, Object> error(Integer code, String errorMsg){
        if(model == null){
            synchronized (HashMap.class) {
                if(model==null)
                    model = new HashMap<>();
            }
        }
        model.put(CODE, code);
        model.put(MSG, errorMsg);
        return model;
    }

}

