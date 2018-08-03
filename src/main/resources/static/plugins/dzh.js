/* 引入基础控件 */
document.write("<script language=javascript src='/app/plugins/layer/layer.js'></script>");

document.write("<script language=javascript src='/app/plugins/bootstrap/bootstrap.js'></script>");
document.write("<script language=javascript src='/app/plugins/bootstrap/bootstrap-table.js'></script>");
document.write("<link href='/app/plugins/bootstrap/bootstrap-table.css' rel='stylesheet'/>");
document.write("<link href='/app/plugins/bootstrap/bootstrap.css' rel='stylesheet'/>");

var basePath;

$(function(){
    // 初始化根目录
    basePath = getBasePath();
});

/*** 获取根目录 */
function getBasePath() {
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht = curWwwPath.substring(0, pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return (localhostPaht + projectName);
}

function getUrlParams() {
    var url = location.search; //获取url中"?"符后的字串
    var urlParams = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            urlParams[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return urlParams;
}

function getUrlFirstParam() {
    var url = location.search; //获取url中"?"符后的字串
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        return strs[0].split("=")[1];
    }
}

function getUrlSecondParam() {
    var url = location.search; //获取url中"?"符后的字串
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        if (strs.length <= 1)
            return '';
        var string = strs[1].split("=")[1];
        return string;
    }
}

function getXHR(){
    var xhr=null;
    if(window.XMLHttpRequest){
        xhr=new XMLHttpRequest();
    } else if (window.ActiveXObject){
        try{
            xhr=new ActiveXObject("Msxml2.XMLHTTP");
        } catch(e) {
            try {
                xhr=new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                alert("您的浏览器暂不支持Ajax");
            }
        }
    }
    return xhr;
}

function ajaxPost(url, data, msg, refresh) {
    $.ajax({
        url: url,
        data: data,
        type: "POST",
        dataType : "json",
        success:function (res) {
            layer.msg(msg);
            if (!refresh){
                setTimeout( function(){
                    location.reload();
                }, 1000*1.5);  // 延迟多少毫秒
            }
        }
    });
}

function open(url, index, text) {
    if (window.parent.mainTab){
        window.parent.mainTab.open(url, index, text);
    }else{
        location.href = url;
    }
}

function isEmpty(v) {
    if (v == undefined || v == null || v == ''){
        return true;
    }
    return false;
}

function refresh(url) {
    $("#table").bootstrapTable('refresh', {url : url});
}

function formatTableDate(date) {
    // string 类型转不了
    if (!date){
        return "-";
    }
    return formatDate(date, "yyyy-MM-dd hh:mm:ss");
}

function formatTableDate2(date) {
    if (!date){
        return "-";
    }
    return formatDate(date, "MM-dd hh:mm:ss");
}

function formatDate(date, fmt, c) {
    if (!date){
        return "";
    }
    if (typeof date != "object"){
        date = new Date(date);
    }

    fmt = fmt || "yyyy-MM-dd";

    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));

    if (c && c == "chi") {
        var lastDays = $$.lastDays;
        var d;
        for (var i = 0, l = lastDays.length; i < l; i++) {
            d = lastDays[i].d;
            if (d.getFullYear() == date.getFullYear() && d.getMonth() == date.getMonth() && d.getDate() == date.getDate()) {
                fmt = lastDays[i].name + fmt.substr(10);
                break;
            }
        }
    }
    return fmt;
}

function getServiceData(res) {
    return res;
}

function defaultValueLine(v) {
    if (isEmpty(v))
        return "-";
    return v;
}

function layResMsg(res) {
    if (isEmpty(res) || res.code == -1)
        layer.alert(isEmpty(res) ? "操作失败" : res.msg);
    else
        layer.msg("操作成功");
}

function numCommonFormat(v) {
    if (v == 0)
        return "0";
    if (isEmpty(v))
        return "-";
    var sv = v + "";
    if (sv.length > 0 && sv.length <= 3){
        return sv;
    } else if (sv.length > 3 && sv.length <= 6){
        var countV = sv.substr(sv.length - 3, 3);
        var countV2 = sv.substr(0, sv.length - 3);
        return countV2 + "," + countV;
    } else if (sv.length > 6 && sv.length <= 9){
        var countV = sv.substr(sv.length - 3, 3);
        var countV2 = sv.substr(sv.length - 6, 3);
        var countV3 = sv.substr(0, sv.length - 6);
        return countV3 + "," + countV2 + "," + countV;
    }  else if (sv.length > 9 && sv.length <= 12){
        var countV = sv.substr(sv.length - 3, 3);
        var countV2 = sv.substr(sv.length - 6, 3);
        var countV3 = sv.substr(sv.length - 9, 3);
        var countV4 = sv.substr(0, sv.length - 9);
        return countV4 + "," + countV3 + "," + countV2 + "," + countV;
    } else if (sv.length > 9){
        return "暂不支持此种数据";
    }
    return "-";
}