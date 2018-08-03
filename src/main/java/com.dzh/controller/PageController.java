package com.dzh.controller;

import com.dzh.extra.consts.Pages;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 控制所有页面跳转
 */
@Controller
@RequestMapping("/")
public class PageController {

    /**
     * 启动跳转
     */
    @RequestMapping("/")
    public Object index(){
        return "manager/list";
    }

    @RequestMapping("/page/manager/list")
    public Object managerList(){
        return Pages.MANAGER_LIST;
    }

}
