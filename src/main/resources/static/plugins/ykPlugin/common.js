//.skirt-combox
function YaokPlugin(config) {
    this.node = this.node || config.node;
    yaok.plugin.all[config.id] = this; //加入索引中

    //消息改变
    this.onChangeValue = function (v, name) {
        if (this.bind && this.bind.currentRecord){
            this.bind.currentRecord.set(name || this.name, v, this);
        }
    };

    //获取绑定的ds并且侦听消息
    var ds = typeof config.bind === "object" ? (this.bind = config.bind) : (this.bind = yaok.plugin.$(config.bind));
    if (ds){
        ds.addEventListener(ds.eventTypes.indexChange, function(e){
            this.onLoadDs(e, ds);
        }.bind(this));

        ds.addEventListener(ds.eventTypes.update, function(e, ds, record, name, value, origin){
            this.onUpdateDsData(e, ds, record, name, value, origin);
        }.bind(this));

        ds.addEventListener(ds.eventTypes.check, YaokPlugin.onDsCheckData, this);

        yaok.bind(this.node, "click", YaokPlugin.removeError);

        this.record = ds.currentRecord;
        if (this.record && this.record.get(config.name)){
            this.setValue(this.record.get(config.name)); //先设置value
        }
    }
}
YaokPlugin.onDsCheckData = function (e, ds) {
    var _this = e.para, v = _this.getValue();
    if (YaokPlugin.checkApi.isNull(v) && _this.node.getAttribute("required") === "true"){
        yaok.addClass(_this.node, "ds-error");
        ds.setCheckResult(_this.name, _this.node.getAttribute("error-text") || "null");
    }else if (_this.node.getAttribute("data-valid") === "isMoney" && !YaokPlugin.checkApi.isMoney(v)){
        yaok.addClass(_this.node, "ds-error");
        ds.setCheckResult(_this.name, _this.node.getAttribute("error-text") || language.getLangDesc("货币不能为负数"));
    }
};
YaokPlugin.removeError = function (e) {
    var tgr = e.currentTarget || e.target;
    while (tgr.tagName.toLowerCase() !== "body" && tgr.className.indexOf("ds-error") === -1){
        tgr = tgr.parentNode;
    }
    yaok.removeClass(tgr, "ds-error");
};

YaokPlugin.checkApi = {
    isNull: function (v) {
        var r = true;
        if (typeof v === "object"){
            for (var key in v){
                r = false;
                break;
            }
        }else{
            if (!!v || v === 0){
                r = false;
            }
        }
        return r;
    },
    isMoney: function (v) {
        if (isNaN(v) || v < 0){
            return false;
        }else{
            return true;
        }
    }
};


function CommonBind(config) {
    var _this = this, _config = config, _node = config.node, _tagName;

    _config.id = _config.id || ("common" + yaok.createId());//设置id
    _config.bind = config.bind; //是否默认自动查询数据
    _config.initValue = config.initValue || config.node.value;
    _config.nullValue = config.nullValue || "";
    _config.formatter = !!config.formatter ? yaok.getValueByKeys(window, config.formatter) : "";

    // checkedValue: node.getAttribute("data-checked-value"),
    // uncheckedValue: node
    _config.checkedValue = (_config.checkedValue !== undefined && _config.checkedValue !== null) ? _config.checkedValue : true;
    _config.uncheckedValue = (_config.uncheckedValue !== undefined && _config.uncheckedValue !== null) ? _config.uncheckedValue : false;

    _node.id = _config.id;
    _tagName = _node.tagName.toLowerCase();

    if (_tagName == 'input' && _node.getAttribute("type") == 'checkbox'){
        _tagName = "checkbox";
    }

    //必须重写的方法
    _this.onLoadDs  =function (e, ds) {
        _this.record = ds.currentRecord;

        if (_this.record){
            _this.setValue(_this.record.get(_this.name));
        }
    };

    //设置值
    _this.setValue = function (v) {
        var render = v;
        if(typeof v !== "number"){
            v = v || "";
        }
        if (!v && v !== 0){
            render = _config.nullValue;
        }
        if (typeof _config.formatter == "function"){
            render = _config.formatter(render);
        }

        if (_tagName  == "input" || _tagName == "select"){
            _node.value = render;
        }else if ( _tagName == "checkbox"){
            if (v == _config.checkedValue){
                _node.checked = true;
            }else{
                _node.checked = false;
            }
        }else{
            _node.innerHTML = render;
        }
    };

    _this.getValue = function () {
        if (_tagName  == "input" || _tagName == "select" || _tagName == "textarea"){
            return _node.value;
        }else if ( _tagName == "checkbox"){
            if (_node.checked){
               return  _config.checkedValue;
            }else{
                return _config.uncheckedValue;
            }
        }{
            return _node.innerHTML;
        }
    };

    _this.onUpdateDsData = function (e, ds, record, name, value, origin) {
        if (origin != _this && name == _this.name){
            _this.record = record;
            _this.setValue(value);
        }
    };

    _this.name = config.name;

    //下拉数据
    if (_config.optionBind){
        _this.optionBindDs =  yaok.plugin.$(_config.optionBind);
        _this.optionBindDs.addEventListener(_this.optionBindDs.eventTypes.load, _this.onLoadOptionBindData);
        _this.setOptionData(_this.optionBindDs.getOriginData());
    }

    if (_tagName  == "input" || _tagName == "textarea"){
        yaok.bind(_node, "keyup", function () {
            _this.onChangeValue(_node.value);
        });
        yaok.bind(_node, "change", function () {
            _this.onChangeValue(_node.value);
        });
    }else if (_tagName == "select"){
        yaok.bind(_node, "change", function () {
            _this.onChangeValue(_node.value);
        });
    }else if (_tagName  == "checkbox" ){
        yaok.bind(_node, "change", function () {
            _this.onChangeValue(_node.checked ? _config.checkedValue : _config.uncheckedValue);
        });
    }

    //继承插件属性
    YaokPlugin.call(this, _config);

    if (_config.initValue){
        _this.setValue(_config.initValue);
        _this.onChangeValue(_this.getValue());
    }
}

/*
 * datePicker 组件
 * 写法
 *   <div>
 <label class="col-sm-12 control-label"><span th:text="#{活动期间}">活动期间</span><span style="color: red">*</span></label>
 <div class="col-sm-5">
 <input class=" yk-date-picker form-control " th:attr="placeholder=#{开始日期}" placeholder="开始日期" th:value="${activity.beginExpireTime}" name="beginExpireTime" id="start" data-bind="form_activity_ds_id"/>
 </div>
 <label class="col-sm-1 dt-between">--</label>
 <div class="col-sm-5">
 <input class="yk-date-picker" data-bind="ds" placeholder="结束日期" name="endExpireTime" value="" id="end"/>
 </div>
 </div>

 formate: yyyy-mm-dd yyyy-mm-dd hh:ii yyyy-mm-ddThh:ii yyyy-mm-dd hh:ii:ss yyyy-mm-ddThh:ii:ssZ
 *
 *
 */
function YaokDatePicker(config) {
    var _this = this, _config = config, _node = config.node, _tagName;

    _config.id = _config.id || ("datepicker" + yaok.createId());//设置id
    _config.bind = config.bind; //是否默认自动查询数据
    _config.initValue = config.initValue || config.node.value || "";
    _config.format = config.format || "yyyy-mm-dd";

    _node.id = _config.id;
    _node.parentNode.appendChild(yaok.$e("span", "add-on", '<i class="fa-calendar"></i>'));
    _node.parentNode.style.position = "relative";

    //必须重写的方法
    _this.onLoadDs  =function (e, ds) {
        _this.record = ds.currentRecord;
        _this.setValue(_this.record.get(_this.name));
    };

    //设置值
    _this.setValue = function (v) {
        v = $.isNumeric(v) ? new Date(v) : v;
        $(_node).datepicker("setDate", v);
    };

    _this.getValue = function () {
        return _this.value;
    };

    _this.onUpdateDsData = function (e, ds, record, name, value, origin) {
        if (origin != _this && name == _this.name){
            _this.record = record;
            _this.setValue(value);
        }
    };

    _this.name = config.name;
    _this.plugin =  $(_node).datepicker({
        format: _config.format,
        autoclose: true,
        //pickerPosition: "bottom-left",
        enableOnReadonly: "true", //如果input为readyonly即不会显示datePicker
        todayBtn: true,
        minuteStep: 10,
        clearBtn: false,
        todayHighlight: "true",
        multidate: false,
        multidateSeparator: "~"
    });

    //startDate setStartDate
    if (_config.initValue){
        _this.setValue(_config.initValue);
    }

    $(_node).on("change",function () {
        if(!$(_node).val().trim()){
            _this.onChangeValue("")
        }
    });

    this.plugin.on('changeDate', function(date){
        _this.value = date.format();
        _this.onChangeValue(_this.value);
    });

    this.show = function () {
        this.plugin.show();
    };

    this.hide = function () {
        this.plugin.hide();
    };

    //继承插件属性
    YaokPlugin.call(this, _config);
}


/*
 * 上传图片附件
 * autoView 是否是上传之后立即展示的组件
 * callBack 上传成功回调函数
 * node 上传的容器
 * accessMulti 是否允许上传多张
 * accessBatch 是否允许皮上传
 */

function UploadImg(config) {
    config.autoView = eval(config.autoView || "false");

    this.name = config.name;
    this.node = config.node;
    this.status = "enable";

    //创建按钮 初始化设置
    this.maxUpload = config.maxUpload || 20;
    this.autoView = eval(config.autoView || "false");
    this.accessMulti = JSON.parse(config.accessMulti || "false");
    this.id = config.id || ("upload" + yaok.createId());//设置id
    this.class = config.class || "yk-upload-btn";
    this.beforeChange = config.beforeChange ? yaok.getValueByKeys(window, config.beforeChange) : null;

    //上传回调
    this.callBack = !!config.callBack ? yaok.getValueByKeys(window, config.callBack) : null;

    //按钮text
    this.btnText = !config.autoView ? this.node.innerHTML : '<span class="line-h u-line"></span><span class="line-v u-line"></span><div class="progress-bar"></div>';

    //渲染的视图容器dom
    this.viewList = yaok.$e("ul", "img-view-list");

    //存放图片数据
    this.imgList = [];

    //上传按钮
    this.uploadBtn = this.setUploadBtn();

    //进度条
    this.progressBar = $(this.uploadBtn).find(".progress-bar")[0];

    //初始化upLoader
    this.uploaderPlugin = this.initUploader(this.uploadBtn, config);

    //是否需需要禁用
    if (config.disabled){
        this.disabled();
    }

    //为了防止uploader无法清空导致无法上传了
    $(this.uploadBtn).mousedown(function () {
        this.onLoadComplete();
    }.bind(this));

    YaokPlugin.call(this, config);

    //初始化view
    this.initView(config);

    //初始化uploader的事件
    this.initEvents();

    this.setAssignId(config.assignId, false);
}

UploadImg.prototype.setUploadBtn = function () {
    var container = this.node;
    var uploadBtn = yaok.$e("span", this.class, this.btnText);
    container.innerHTML = "";
    container.appendChild(uploadBtn);
    return uploadBtn;
};

UploadImg.prototype.initUploader = function (btn, config) {
    var  uploader = this.createUploader(btn, config);
    uploader.reset();
    uploader._this = this;
    return uploader;
};

UploadImg.prototype.initEvents = function () {
    var _uploader = this.uploaderPlugin;

    _uploader.on("beforeFileQueued", function (file) {
        var type = file.type;
        var _this = this._this;
        var imgNum = _this.imgNum;
        var imgList = _this.imgList;

        if (_this.accessMulti && imgNum + imgList.length > _this.maxUpload - 2){
            _this.uploadLimt();
            return false;
        }if (type != "image/jpg" && type != "image/jpeg" && type != "image/png"){
            return false;
        }else{
            _this.imgNum ++;
        }
    });

    //侦听上传事件
    _uploader.on("uploadAccept", function (o, res){
        this._this.onLoadAccept(o, res);
    });

    //上传进度
    _uploader.on("uploadProgress", function (file, progress) {
        this._this.setUploadProgress(progress);
    });

    // 文件上传失败，显示上传出错。
    _uploader.on( 'uploadError', function() {
        layer.msg(language.getLangDesc("上传失败"));
    });

    // 文件上传失败，显示上传出错。
    _uploader.on( 'uploadComplete', function() {

    });

    _uploader.on( 'startUpload', function() {
        var  progressBar = this.progressBar;
        if (progressBar){
            progressBar.style.display = "block";
        }
    });

    // 文件上传失败，显示上传出错。
    _uploader.on( 'error', function(type) {
        //Q_EXCEED_NUM_LIMIT 在设置了fileNumLimit且尝试给uploader添加的文件数量超出这个值时派送。
        //Q_EXCEED_SIZE_LIMIT 在设置了Q_EXCEED_SIZE_LIMIT且尝试给uploader添加的文件总大小超出这个值时派送。
        //Q_TYPE_DENIED 当文件类型不满足时触发
        switch (type){
            case "Q_EXCEED_NUM_LIMIT":
                this._this.uploadLimt();
                break;
            case "Q_TYPE_DENIED":
                yaok.message({
                    type: "error",
                    msg: language.getLangDesc("文件类型不对")
                });
                break;
        }
    });
};

UploadImg.prototype.initView = function (config) {
    var _node = this.node;
    var _uploadBtn = this.uploadBtn;

    //是否需要自动展示
    if (config.autoView){
        this.viewList = yaok.$e("ul", "img-view-list");
        this.viewItemTemplate = '<span class="close-con"><i class="fa-close"></i></span><div class="img-view-o-con"><img onclick="yaok.fullViewImg(this);" class="img-view-o" src="${@src}" /></div>';
        _node.insertBefore(this.viewList, _uploadBtn);

        yaok.bind(this.viewList, "click", function (e) {
            this.onClickRemove(e);
        }.bind(this));
    }
};


UploadImg.prototype.addImgData = function (data, ifInit) {
    if (typeof this.beforeChange === "function"){
        this.beforeChange(data, this);
    }
    var v = yaok.deepCopy(this.valueFormat);
    v.path  = data.path;
    v.attachId  = data.attachId;
    v.attachType  = data.attachType;

    var url = data.path,
        imgList = this.imgList;
    //放入值列表
    if (this.accessMulti){
        imgList.push(v);
    }else{
        imgList[0] = v;
    }

    //开始渲染
    if (this.viewList) {
        if (this.accessMulti) {
            this.viewList.appendChild(yaok.$e("li", "img-view-item", this.viewItemTemplate.replace("${@src}", url)));
        }else{
            var child = this.viewList.children[0];
            if (child){
                child.children[1].children[0].src = url;
            }else{
                this.viewList.appendChild(yaok.$e("li", "img-view-item", this.viewItemTemplate.replace("${@src}", url)));
            }
        }
    }

    // callBack
    if (!ifInit && typeof this.callBack === "function"){
        this.callBack(url, imgList);
    }

    //更新assignId
    if (!ifInit || !this.getAssignId()) {   
        this.updateAssignId(imgList);
    }
};

UploadImg.prototype.onLoadComplete = function () {
    this.imgNum = 0;
    this.uploaderPlugin.reset();
};

UploadImg.prototype.onClickRemove = function (e) {
    var node = e.target;
    while (node.tagName.toLowerCase() !== "ul"){
        if (node.className === "close-con"){
            var img = $(node.parentNode).find("img");
            if (img.length > 0){
                img = img[0];
                this.deleteImg(img.src, img);
            }
            break;
        }
        node = node.parentNode
    }
};

//根据url 删除图片
UploadImg.prototype.deleteImg = function (url, img) {
    if (!img){
        img = $("img-view-o[src=" + url + "]")[0];
    }

    //根据父节点查找li的父级
    if (img){
        var li = yaok.getParentNode(img, "li");
        li.parentNode.removeChild(li);
    }

    var imgItem, imgList = this.imgList;
    for(var i = 0, l = imgList.length; i < l; i++){
        imgItem = imgList[i];
        if (imgItem.path === url){
            imgList.splice(i, 1);
            break;
        }
    }
    this.updateAssignId(imgList);
};

UploadImg.prototype.setUploadProgress = function (progress) {
    var  progressBar = this.progressBar;
    if (!progressBar)return;
    progressBar.style.width = parseFloat(progress) * 100 + "%";
    if (progress == 1){
        this.clearProgressBar();
    }
};

UploadImg.prototype.clearProgressBar = function () {
    var progressBar = this.progressBar;
    progressBar.style.display = "none";
    progressBar.style.width = "0%";
};

UploadImg.prototype.onLoadAccept = function (o, res) {
    if (res.code != 0 ){
        parent.layer.msg(language.getLangDesc("上传失败"));
    }else {
        this.addImgData(res.data);

        if (this.accessMulti) {
            this.imgNum--;
            if (this.imgNum <= 0){
                this.onLoadComplete();
            }
        }else{
            this.onLoadComplete();
        }
    }
};

UploadImg.prototype.onUpdateDsData = function (e, ds, record, name, value, origin) {
    if (origin != this && name == this.name){
        this.record = record;
        this.setValue(value);
    }
};

UploadImg.prototype.onLoadDs = function (e, ds) {
    this.record = ds.currentRecord;
    this.setValue(this.record.get(this.name));
};

UploadImg.prototype.getValue = function () {
    return this.getAssignId();
};

UploadImg.prototype.setValue = function (assignId, list, ifReset) {
    this.setAssignId(assignId, false, list, ifReset);
};

UploadImg.prototype.updateAssignId = function (imgList) {
    imgList = imgList || this.imgList;
    var list = yaok.getFieldValues(imgList, "attachId", ",");
    yaok.ajax({
        url: UploadImg.maintainAsignIdUrl,
        data: {
            attachList: list,
            attachAssignId: this.getAssignId()
        },
        success: function (res) {
            this.setAssignId(res.data, true);
        }.bind(this)
    });
};

UploadImg.prototype.setAssignId = function (id, ifInner, list, ifReset) {
    if (!!ifReset || (!!id && this.assignId != id)){
        this.assignId = id;

        //如果不是内部设置就会查询
        if (!ifInner && id) {
            this.queryAttachList(id);
        }

        this.onChangeValue(this.getValue());
    }
};

UploadImg.prototype.getAssignId = function () {
    return this.assignId;
};
UploadImg.prototype.queryAttachList = function (id) {
    yaok.ajax({
        url: UploadImg.queryFilesURL,
        data: {
            attachAssignId: this.getAssignId()
        },
        success: function (res) {
            var list = res.data;
            for (var i = 0, l = list.length; i < l; i++) {
                this.addImgData(list[i], true);
            }
        }.bind(this)
    });
};

//禁用
UploadImg.prototype.disabled = function () {
    this.node.setAttribute("disabled", "true");
    this.status = "disabled";
};
//启用
UploadImg.prototype.enable = function () {
    this.node.setAttribute("disabled", "");
    this.status = "enable";
};
//超出限制抛出异常
UploadImg.prototype.uploadLimt = function () {
    layer.msg(language.getLangDesc("文件数量超出"));
};
//本机放开
UploadImg.baseURL = (function(){
    return location.host.indexOf("yaok.com") > -1 ? "/uploadapi/attach/" : "http://apptestv2.yaok.com/uploadapi/attach/";
})();

UploadImg.maintainAsignIdUrl = UploadImg.baseURL + "saveOrUpdateReturnAssignId";
UploadImg.uploadURL = UploadImg.baseURL + "upload";
UploadImg.queryFilesURL = UploadImg.baseURL + "queryByAttachAssignId";

UploadImg.prototype.createUploader = function(btn, config){
    return WebUploader.create({
        auto: true, //选完文件后，是否自动上传。
        swf: null, //basePath + 'js/plugins/webuploader/webuploader.min.js',
        server: UploadImg.uploadURL, // 文件接收服务端。
        fileVal: "file",
        formData: {
            source: (config.source || "user").toUpperCase(), //资源类型 user //来源:USER(用户,/user); ORDER(订单,/order); ITEM(商品,/item); BRAND(品牌,/brand); RICH_TEXT(富文本,/rich_text); OUTSIDE(外部,/OUTSIDE)
            attachType: (config.attachType || "img").toUpperCase() //IMG video file
        },
        pick: btn,
        compress: false,
        fileNumLimit: config.maxUpload || "10",
        accept: {
            title: 'Images',
            extensions: 'jpg,jpeg,png',
            mimeTypes: 'image/jpg,image/jpeg,image/png'   //只允许选择图片文件。
        }
    });
};

UploadImg.prototype.valueFormat = {
    path: "",
    attachId: "",
    sort : 0,
    attachType: "image/gif, image/jpeg, image/png", //文件格式 img: "image/gif, image/jpeg, image/png", "video/mp4,video/mpg,video/avi"
    source: "" //资源类型 user //来源:USER(用户,/user); ORDER(订单,/order); ITEM(商品,/item); BRAND(品牌,/brand); RICH_TEXT(富文本,/rich_text); OUTSIDE(外部,/OUTSIDE)
};

/*
 * select
 * optionBind
 * name
 */
function YaokSelect(config) {
    EventListener.call(this);
    this.config = config;
    this.config.node.yaokSelect = this;
    this.optionList = this.getOptionList(config.optionBind);
    this.config.hasInit = true;
    this.bindNodeEvent(config.node);

    if (config.autoShow == true){
        this.show();
    }
}

YaokSelect.prototype.bindNodeEvent = function (node) {
    $(node).on("keydown", this.onKeyDown);
    $(node).on("click", this.clickNode);
    $(node).on("focus", this.clickNode);
};

YaokSelect.prototype.show = function () {
    var node = this.config.node,
        position = $(node).offset(),
        optionList = this.optionList;

    //判断当前是否已选择
    this.initListView();

    //计算坐标
    optionList.style.left = position.left + "px";
    optionList.style.top = (position.top + node.offsetHeight) + "px";
    optionList.style.display = "block";

    YaokSelect.currentSelect = this;
    this.status = YaokSelect.staticValues.showStatus;
};

YaokSelect.prototype.hide = function () {
    this.optionList.style.display = "none";
    this.status = YaokSelect.staticValues.hideStatus;
};

YaokSelect.prototype.initListView = function () {
    var options = this.optionList.children,
        li,
        v = this.value;
    for (var i = 0, l = options.length; i < l; i++) {
        li = options[i];
        if(li.getAttribute(YaokSelect.staticValues.value) == v){
            yaok.addClass(li, YaokSelect.staticValues.selected);
        }else{
            yaok.removeClass(li, YaokSelect.staticValues.selected);
        }
    }
};

YaokSelect.prototype.eventTypes = {
    change: "change",
    reset: "reset"
};
YaokSelect.staticValues = {
    showStatus: "show",
    hideStatus: "hide",
    focus: "yk-select-focus",
    selected: "yk-selected",
    value: "data-value",
    item: "yaok-select-item"
};
YaokSelect.prototype.onKeyDown = function (e) {
    var select = YaokSelect.currentSelect,
        item = $(select.optionList).find("." + YaokSelect.staticValues.focus)[0];

    if(e.keyCode == 13){
        if (YaokSelect.staticValues.hideStatus == select.status){
            select.show();
            return;
        }
        select.select($(item));
    }else if(e.keyCode == 40){
        if (YaokSelect.staticValues.hideStatus == select.status){
            select.show();
            return;
        }
        if (!item){
            $(select.optionList.firstChild).addClass(YaokSelect.staticValues.focus);
        }else{
            $(item).removeClass(YaokSelect.staticValues.focus);
            $($(item).next()[0] || select.optionList.firstChild).addClass(YaokSelect.staticValues.focus);
        }
    }else if(e.keyCode == 38){
        if (YaokSelect.staticValues.hideStatus == select.status){
            select.show();
            return;
        }
        if (!item){
            $(select.optionList.lastChild).addClass(YaokSelect.staticValues.focus);
        }else{
            $(item).removeClass(YaokSelect.staticValues.focus);
            $($(item).prev()[0] || select.optionList.lastChild).addClass(YaokSelect.staticValues.focus);
        }
    }else if (e.keyCode == 9 || e.keyCode == 27){
        YaokSelect.currentSelect.hide();
    }
};

YaokSelect.prototype.onClickItem = function (e) {
    YaokSelect.currentSelect.select($(this));
    yaok.stopPropagation(e);
};

YaokSelect.prototype.select = function (item) {
    if (!item){
        return;
    }
    var select = this;
    if (item != select.selected){
        var v = item.attr(YaokSelect.staticValues.value);
        select.value = v;
        select.config.node.value = item.innerHTML;

        //移除类标记
        if (select.selected){
            $(select.selected).removeClass(YaokSelect.staticValues.selected);
        }
        item.addClass(YaokSelect.staticValues.selected);
        select.selected = item;
        select.dispatch(select.eventTypes.change, select, v, item.html());
    }
    select.hide();
};

YaokSelect.prototype.clickNode = function (e) {
    var input = $(this)[0];
    input.yaokSelect.show();
    yaok.stopPropagation(e);
};

YaokSelect.prototype.initEvent = function (list) {
    $(list).on("click", "." + YaokSelect.staticValues.item, this.onClickItem);
    this.addHideEvent();
};

/*
 * 存放所有select的下拉内容
 */
YaokSelect.prototype.listDictionary = {

};

YaokSelect.prototype.addHideEvent = function () {
    if (!YaokSelect.windEvent){
        var func = YaokSelect.windEvent = function () {
            if (select = YaokSelect.currentSelect){
                select.hide();
            }
        };
        yaok.bind(window, "click", func);
    }
};

YaokSelect.prototype.getOptionList = function (url) {
    var list = this.listDictionary[url];
    if (!list){
        list = yaok.$e("ul", "select-option-list dropdown-menu");
        list.style.width = this.config.node.offsetWidth + 10 + "px";
        document.body.appendChild(list);

        this.optionList = list;
        this.listDictionary[url] = list;
        this.getRemoteData(url);
        this.initEvent(list);
    }
    return list;
};

YaokSelect.prototype.getRemoteData = function (url) {
    var _this = this;
    if (!url){
        return;
    }

    var para = {};
    var queryPara = this.queryPara;
    if (queryPara){
        para.data = queryPara;
    }


    if (url.indexOf("dataCenter") == "0"){

        var dataController = yaok.getValueByKeys(window, url);
        if (typeof dataController == "function"){
            dataController(para);
            dataCenter.addEventListener(dataController.event, function (e, res) {
                _this.setOptionData(res.data);
            }, _this);
        }
    }else if (url.indexOf("[") == "0"){
        try{
            var data = eval(url);
            _this.setOptionData(data);
        }catch(e){
            console.log("加载失败");
        }
    }else if (url.indexOf("http") == 0 && url.indexOf("{basePath}") == 0){
        para.url = url;
        para.success = function (res) {
            _this.setOptionData(res.data);
        };
        yaok.ajax(para);
    }else{
        var ds = yaok.plugin.$(url);
        if (ds.getOriginData()){
            _this.setOptionData(ds.getOriginData());
        }
        ds.addEventListener(ds.eventTypes.load, function (e, ds) {
            _this.setOptionData(ds.getOriginData());
        });
    }
};

YaokSelect.prototype.setOptionData = function (data) {
    var li,
        option,
        optionList = this.optionList,
        displayField = this.config.displayField,
        valueField = this.config.valueField,
        value = this.config.initValue;

    for (var i = 0, l = data.length; i < l; i++) {
        option = data[i];
        li = yaok.$e("li", YaokSelect.staticValues.item, option[displayField]);
        li.setAttribute(YaokSelect.staticValues.value, option[valueField]);
        optionList.appendChild(li);

        if (option[valueField] == value){
            this.config.node.value = option[displayField];
        }
    }
};

/****************************clockPicker***********************/
(function () {
    var YaokClockPicker = window.YaokClockPicker = function (config) {
        this.config = config;
        this.config.hasInit = true;
        this.name = config.name;
        this.node = config.node;
        this.id = config.id || ("clock-picker" + yaok.createId());//设置id
        this.bind = config.bind; //是否默认自动查询数据
        this.initValue = config.initValue || config.node.value;
        this.nullValue = config.nullValue || "";
        this.formatter = !!config.formatter ? yaok.getValueByKeys(window, config.formatter) : "";

        EventListener.call(this);

        this.init(config);
    };

    YaokClockPicker.prototype.init = function (config) {
        var _this = this;
        //继承插件属性
        YaokPlugin.call(this, config);

        $(yaok.getParentNode(config.node, ".clockpicker")).clockpicker({
            init: function() {
                console.log("colorpicker initiated");
            },
            beforeShow: function() {
                console.log("before show");
            },
            afterShow: function() {
                console.log("after show");
            },
            beforeHide: function() {
                console.log("before hide");
            },
            afterHide: function() {
                console.log("after hide");
            },
            beforeHourSelect: function() {
                console.log("before hour selected");
            },
            afterHourSelect: function() {
                console.log("after hour selected");
            },
            beforeDone: function() {
                console.log("before done");
            },
            afterDone: function(v) {
                console.log("after done");
                _this.setValue(_this.node.value);
                _this.dispath(_this.getValue());
            }
        });

        var temp  = config.initValue || config.node.value;
        if (temp){
            this.setValue(temp);
            this.dispath(temp);
        }
    };

    YaokClockPicker.prototype.dispath = function (v) {
        if (this.bind && this.bind.currentRecord){
            this.bind.currentRecord.set(this.name, v, this);
        }
    };

    YaokClockPicker.prototype.setValue = function (v) {
        this.node.value = v;
        this.value  = v;
    };

    YaokClockPicker.prototype.getValue = function () {
        return this.value;
    };

    YaokClockPicker.prototype.onLoadDs = function (e, ds) {
        this.record = ds.currentRecord;
        if (this.record){
            this.setValue(this.record.get(this.name));
        }
    };
    
    YaokClockPicker.prototype.onUpdateDsData = function (e, ds, record, name, value, origin) {
        if (origin != this && name == this.name){
            this.setValue(value);
        }
    };
})();


//读取dataSet节点
$(function(){
    var dataSetNodes = $(".yk-common-bind"), node, i, l;
    for (i = 0, l = dataSetNodes.length; i < l; i++){
        node = dataSetNodes[i];

        if (!node.getAttribute("init")){
            new CommonBind({
                id: node.id,
                formatter: node.getAttribute("data-formatter"),
                nullValue: node.getAttribute("data-null-value"),
                checkedValue: node.getAttribute("data-checked-value"),
                uncheckedValue: node.getAttribute("data-unchecked-value"),
                bind: node.getAttribute("data-bind"),
                name: node.getAttribute("name"),
                initValue: node.getAttribute("init-value"),
                node: node
            });
            node.setAttribute("init", "true");
        }
    }

    //datePicker
    dataSetNodes = $(".yk-date-picker");
    for (i = 0, l = dataSetNodes.length; i < l; i++){
        node = dataSetNodes[i];

        if (!node.getAttribute("init")){
            new YaokDatePicker({
                id: node.id,
                bind: node.getAttribute("data-bind"),
                name: node.getAttribute("name"),
                initValue: node.getAttribute("init-value"),
                startDate: node.getAttribute("start-date"),
                endDate: node.getAttribute("end-date"),
                showMeridian: node.getAttribute("show-meridian"),
                format: node.getAttribute("format"),
                node: node
            });
            node.setAttribute("init", "true");
        }
    }
    //clockPicker
    dataSetNodes = $(".yk-clock-picker");
    for (i = 0, l = dataSetNodes.length; i < l; i++){
        node = dataSetNodes[i];

        if (!node.getAttribute("init")){
            new YaokClockPicker({
                id: node.id,
                bind: node.getAttribute("data-bind"),
                name: node.getAttribute("name"),
                initValue: node.getAttribute("init-value"),
                format: node.getAttribute("format"),
                node: node
            });
            node.setAttribute("init", "true");
        }
    }

    /*
     * 上传图片附件
     * yk-upload-img
     * autoView 是否是上传之后立即展示的组件
     * callBack 上传成功回调函数
     * node 上传的容器
     * accessMulti 是否允许上传多张
     * accessBatch 是否允许皮上传
     */
    //datePicker
    dataSetNodes = $(".yk-upload-img");
    for (i = 0, l = dataSetNodes.length; i < l; i++){
        node = dataSetNodes[i];

        if (!node.getAttribute("init")){
            new UploadImg({
                id: node.id,
                bind: node.getAttribute("data-bind"),
                disabled: node.getAttribute("disabled"),
                class: node.getAttribute("data-class"),
                name: node.getAttribute("name"),
                initValue: node.getAttribute("init-value"),
                autoView: node.getAttribute("auto-view"),
                callBack: node.getAttribute("call-back"),
                accessMulti: node.getAttribute("access-multi"),
                accessBatch: node.getAttribute("access-batch"),
                maxUpload: node.getAttribute("max-upload"),
                viewText: node.getAttribute("view-text"),
                btnText: node.getAttribute("btn-text"),
                requestUrl: node.getAttribute("request-url"),
                attachType: node.getAttribute("attach-type"),
                source: node.getAttribute("source"),
                assignId: node.getAttribute("assign-id"),
                beforeChange: node.getAttribute("before-change"),
                node: node
            });
            node.setAttribute("init", "true");
        }
    }
});