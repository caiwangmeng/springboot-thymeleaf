
$(function () {
    // 动态设置样式
    if (screen.width <= 1680 && screen.width > 1280) {
        $(".container").css({"width": "90%", "margin-left": "3%"});
    } else if(screen.width <= 1280){
        $(".container").css({"width": "95%", "margin-left": "2%"});
    } else if (screen.width <= 2080 && screen.width > 1680) {
        $(".container").css({"width": "80%", "margin-left": "4%"});
    } else {
        $(".container").css({"width": "75%", "margin-left": "7%"});
    }
});


//设置参数
function queryParams(params) {
    params.index = $("#index").val();
    params.scanResult = $("#scanResult").val();
    params.ip = $("#ip").val();
    params.envEnum = $("#env").val();
    params.syncCount = $("#syncCount").val();
    return params;
}

function getServiceData(res) {
    if (isEmpty(res))
        return res;
    if (isEmpty(res.rows[0])){
        $("#scan_time").html("");
        $("#compare_time").html("");
        return res;
    }
    var scanTime = res.rows[0].scanTime;
    var scanCompareTime = res.rows[0].scanCompareTime;
    // 类型问题
    $("#scan_time").html(formatTableDate2(Math.round(scanTime)));
    $("#compare_time").html(formatTableDate2(Math.round(scanCompareTime)));
    return res;
}

function queryData() {
    refresh(basePath + "/manager/list");
}

function clearTable() {
    $("#table").bootstrapTable("removeAll");
    refresh(basePath + "/manager/list");
}

// 格式化
function scanResultFormat(v, row) {
    if ("true" == v){
        return "<span style='color: green'>成功</span>";
    }
    if (Math.abs(row.esCount - row.dbCount) <= 100){
        return "<span style='color: #ffa5ff'>失败</span>";
    }
    return "<span style='color:red;'>失败</span>";
}

// 菜单
function nameFormatter(v, row, index) {
    var operate =
        "<a href='javascript:void(0)' class='mangerDetail'>" + "详情" +"</a>" + "&nbsp;&nbsp;" +
    "<a href='javascript:void(0)' class='mangerDelete'>" + "删除" +"</a><br/>" +
    "<a href='javascript:void(0)' class='mangerDownload'>" + "下载" +"</a>" + "&nbsp;&nbsp;";
    if (row.noticeFlag)
        operate += "<a href='javascript:void(0)' class='mangerNotice'>" + "已通知" +"</a><br/>";
    else
        operate += "<a href='javascript:void(0)' class='mangerNotice'>" + "未通知" +"</a><br/>";
    if ((row.esCount && row.dbCount && Math.abs(row.esCount - row.dbCount) != 0)){
       operate += "<a href='javascript:void(0)' class='mangerCompare'>" + "比对" +"</a>"  + "&nbsp;&nbsp;";
    }
    return operate;
}

// 绑定查询条件
window.inputEvents = {
    'click .mangerDetail': function (e, value, row, index) {
        open(basePath + "/page/manager/detail?primary=" + row.primary + "&env=" + row.env, "配置详情");
    },
    'click .mangerDelete': function (e, value, row, index) {
        deleteObject(row.primary);
    },
    'click .mangerDownload': function (e, value, row, index) {
        download(row.index);
    },
    'click .mangerNotice': function (e, value, row, index) {
        mangerNotice(row.index, row);
    },
    'click .mangerCompare': function (e, value, row, index) {
        compareTmStamp(row.index, row);
    }
};

function download(index) {
    window.open(basePath + "/esApi/queryAndDownload?fields=ID&index=" + index + "&downloadFileName=" + index + "&envEnum=" + $("#env").val(), "下载");
}

function mangerNotice(index, row) {
    var primary = row.primary;
    var noticeFlag = row.noticeFlag;
    if (noticeFlag)
        noticeFlag = 'false';
    else
        noticeFlag = 'true';

    var url = basePath + "/mongoScanSync/update";
    $.ajax({
        url: url,
        data: {
            "primary" : primary,
            "noticeFlag": noticeFlag
        },
        type: "POST",
        dataType : "json",
        success: function (res) {
            layResMsg(res);
            refresh(basePath + "/manager/list");
        }
    });
}

function compareTmStamp(index, row) {
    var url = basePath + "/manager/compareTmStamp?index=" + index+ "&envEnum=" + $("#env").val();
    var layerIndex = layer.load();
    $.ajax({
        url: url,
        type: "POST",
        dataType : "json",
        success: function (res) {
            layer.close(layerIndex);
            if (res.code == 0){
                var alertMsg = '时间戳: ' + res.data;
                layer.alert(alertMsg, {
                    skin: 'layui-layer-lan'
                    ,closeBtn: 0
                    ,anim: 4 //动画类型
                });
            } else {
                layer.msg("比对失败");
            }
        }
    });
}

// 暂未使用
function compare(index, row) {
    var url = basePath + "/manager/compareId?index=" + index+ "&envEnum=" + $("#env").val();
    if ((row.esCount && row.dbCount && Math.abs(row.esCount - row.dbCount) >= 10000)){
        window.open(url, "比对");
        return;
    }
    var layerIndex = layer.load();
    var xhr = new XMLHttpRequest();
    // xhr.timeout(10000);
    xhr.timer = setTimeout(function () {
        layer.close(layerIndex);
        layer.msg("请求超时");
    }, 1200000);
    xhr.open('GET', url, true);        // 也可以使用POST方式，根据接口
    xhr.responseType = "blob";    // 返回类型blob
    // 发送ajax请求
    xhr.send();
    // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
    xhr.onload = function () {
        layer.close(layerIndex);
        // 请求完成
        if (this.status === 201) {
            // 返回200
            var blob = this.response;
            var reader = new FileReader();
            reader.readAsDataURL(blob);    // 转换为base64，可以直接放入a表情href
            reader.onload = function (e) {
                // 转换完成，创建一个a标签用于下载
                var a = document.createElement('a');
                a.download = index + '.xlsx';
                a.href = e.target.result;
                $("body").append(a);    // 修复firefox中无法触发click
                a.click();
                $(a).remove();
                layer.msg("比对成功");
            }
        } else if (this.status === 200) {
            layer.msg("数据暂时没有差异!");
        } else {
            layer.close(layerIndex);
            // layer.msg("请求超时");
        }
    };
}

function deleteObject(primary) {
    // 询问框
    layer.confirm(
        '确定要删除吗？',
        {btn: ['确定','取消']},
        function(){
            var url = basePath + "/mongoScanSync/delete";
            var data  = {};
            data.primary = primary;
            $.ajax({
                url: url,
                data: data,
                type: "POST",
                dataType : "json",
                success:function (res) {
                    layResMsg(res);
                    refresh(basePath + "/manager/list");
                }
            });
        }
    );
}