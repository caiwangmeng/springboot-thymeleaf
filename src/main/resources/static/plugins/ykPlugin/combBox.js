function MultiCombBox(config) {
    var _this = this, _config = config, _initOption = false;

    _config.id = _config.id || ("multicombox" + yaok.createId());//设置id
    _config.bind = config.bind; //是否默认自动查询数据
    _config.placeHolder = config.placeHolder || "";
    _config.maxSelection = config.maxSelection || 10000;
    _config.maxSelection = parseInt(_config.maxSelection) + 1;
    _config.initValue = yaok.dataMapTemplate(config.initValue || "", yaok.urlArgs);
    _config.node.id = _config.id;
    _config.allowFreeEntries = eval(config.allowFreeEntries || "false");
    _config.myDisplayField = config.displayField;
    _config.displayField = config.displayField.indexOf(",") > -1 ? "combineFiled" : config.displayField;

    //必须重写的方法
    this.onLoadDs = function (e, ds) {
        _this.record = ds.currentRecord;
        _this.setValue(ds.currentRecord.get(_this.name));
    };

    //设置值
    this.setValue = function (v) {
        if (!_initOption && !_config.allowFreeEntries){
            _this.backValue = v;
            return;
        }else{
            _this.backValue = undefined;
        }

        if (v && !(v instanceof Array) ){
            v = v.split(",");
        }else{
            if (_config.myDisplayField != _config.displayField){
                v = yaok.getFieldValues(v, _config.valueField);
            }
        }

        if (!v){
            v = [];
            _this.plugin.setSelection([]);
        }
        _this.plugin.setValue(v);
    };

    this.getValue = function () {
        return _this.plugin.getValue();
    };

    this.getSecletion = function () {
        return _this.plugin.getSelection();
    };

    //下拉列表绑定的dataSet加载数据触发
    this.onLoadOptionBindData = function (e, ds) {
        var option = ds.getOriginData();
        if (!_initOption && (!option || option.length == 0)){
            return;
        }

        _this.optionBindDs = ds;
        _this.setOptionData(option);
        _this.plugin.clear();

        _initOption = true;
        if (_this.backValue !== undefined){
            _this.setValue(_this.backValue);
        }
    };

    //设置下拉列表
    this.setOptionData = function (data) {
        if (data){
            data =  MultiCombBox.addFiledToData(data, _config.myDisplayField, _config.displaySpace, _config.displayField);
            _this.plugin.setData(data);
        }else{
            _this.plugin.setData([]);
        }

        if (_initOption && !_config.allowFreeEntries){
            _this.setValue();
        }
    };

    //当更新绑定的ds触发
    this.onUpdateDsData = function (e, ds, record, name, value, origin) {
        if (origin != _this && name == _this.name){
            _this.record = record;
            _this.setValue(value);
        }
    };

    //改变值
    this.onChangeSelect = function () {
        var values = _this.getValue();
        if (!_config.allowFreeEntries && values.length == _config.maxSelection){
            values.pop();
            _this.setValue(values);
            _this.plugin.setSelection(_this.plugin.getSelection().pop());
        }
        _this.onChangeValue(values);

        var dis = _this.plugin.getSelection();
        if (dis && dis.length > 0){
            _this.onChangeValue(yaok.getFieldValues(dis, _config.displayField).join(","), _config.displayField);
        }
    };

    this.expand = function () {
        _this.plugin.expand();
    };

    this.init(config);
}

MultiCombBox.prototype.disabled = function () {
    this.plugin.disable();
};

MultiCombBox.prototype.enable = function(){
    this.plugin.enable();
};

MultiCombBox.prototype.init = function (config) {
    var _this = this;

    //初始化组件
    _this.name = config.name;
    _this.plugin = $(config.node).magicSuggest({
        placeholder : language.getLangDesc(config.placeHolder),
        allowFreeEntries: config.allowFreeEntries,
        maxSelection: config.maxSelection,
        valueField: config.valueField,
        displayField: config.displayField,
        data: []
    });

    //该组件dom结构改变
    _this.node = _this.plugin.container[0];
    _this.node.setAttribute("required", config.node.getAttribute("required"));
    $(_this.node).on("click", _this.expand);

    //下拉数据
    if (config.optionBind){
        var ds = _this.optionBindDs =  yaok.plugin.$(config.optionBind);
        ds.addEventListener(ds.eventTypes.load, _this.onLoadOptionBindData);

        var data = _this.optionBindDs.getOriginData();
        if (data !== undefined){
            this.onLoadOptionBindData([], this.optionBindDs);
        }
    }

    //增加侦听事件
    $(this.plugin).on("selectionchange", _this.onChangeSelect);

    //设置value
    if (config.initValue){
        _this.setValue(config.initValue);
    }

    //继承插件属性
    YaokPlugin.call(this, config);

    //是否需需要禁用
    if (config.disabled){
        this.disabled();
        this.status = "disabled";
    }
};

MultiCombBox.addFiledToData = function(data, keys, space, key){
    if (YaokPlugin.checkApi.isNull(data) || data[0][key] || !keys || keys.indexOf(",") == -1){
        return data;
    }else{
        var o, temp;
        space = space || ":";
        keys = keys.split(",");
        for (var i = 0, l = data.length; i < l; i++) {
            o = data[i];
            for (var j = 0, h = keys.length; j < h; j++) {
                temp = o[keys[j]];

                if (temp){
                    if (o[key]){
                        o[key] += space + temp;
                    }else{
                        o[key] = temp;
                    }
                }
            }
        }
        return data;
    }
};

function CombBox(config) {
    var _this = this, _config = config, _node, _initOption = false;

    _config.id = _config.id || ("combox" + yaok.createId());//设置id
    _config.bind = config.bind; //是否默认自动查询数据
    _config.placeHolder = config.placeHolder || "";
    _config.initValue = yaok.dataMapTemplate(config.initValue || "", yaok.urlArgs);
    _config.node.id = _config.id;
    _config.nullValue = _config.nullValue || "请选择";
    _config.myDisplayField = config.displayField;
    _config.displayField = config.displayField.indexOf(",") > -1 ? "combineFiled" : config.displayField;
    _node = config.node;

    _this.name = config.name;
    _this.plugin = _node;

    //必须重写的方法
    _this.onLoadDs = function (e, ds) {
        _this.record = ds.currentRecord;
        _this.setValue(_this.record.get(_this.name));
    };

    //当更新绑定的ds触发
    _this.onUpdateDsData = function (e, ds, record, name, value, origin) {
        if (origin != _this && name == _this.name){
            _this.record = record;
            _this.setValue(value);
        }
    };

    //设置值
    _this.setValue = function (v) {
        if (!_initOption && !_config.allowFreeEntries){
            _this.backValue = v;
            return;
        }else{
            _this.backValue = undefined;
        }
        _node.value = v || "";
    };

    _this.getValue = function () {
        return _node.value;
    };

    //下拉列表绑定的dataSet加载数据触发
    _this.onLoadOptionBindData = function (e, ds) {
        _this.optionBindDs = ds;
        _this.setOptionData(ds.getOriginData());
    };

    //设置下拉列表
    _this.setOptionData = function (data) {
        data = MultiCombBox.addFiledToData(data, _config.myDisplayField, _config.displaySpace, _config.displayField);
        if (data && data.length > 0){
            _node.disabled = false;
            _node.innerHTML = '<option value="">' + _config.nullValue + '</option>' + yaok.dataMapTemplate('<option value="${@' + _config.valueField + '}">${@' + _config.displayField + "}</option>", data);
        }else{
            _node.innerHTML = "";
            _node.disabled = true;
        }
        _node.value = "";

        if (!_initOption){
            _initOption = true;

            if (_this.backValue){
                _this.setValue(_this.backValue);
            }
        }

        _this.onChangeSelect();
    };

    _this.onChangeSelect = function () {
        var v = _this.getValue(), dv = !!v ? yaok.getDataByAttr(_this.optionBindDs.getOriginData(), _config.valueField, v) : "";
        _this.onChangeValue(v);

        if (dv && dv.length > 0 ){
            dv = dv[0][_config.displayField];
            _this.onChangeValue(dv, _config.displayField);
        }else{
            _this.onChangeValue("", _config.displayField);
        }
    };
    yaok.bind(_node, "change", _this.onChangeSelect);

    _this.init(config);
}

CombBox.prototype.init = function (config) {
    var _this = this, temp;
    //继承插件属性
    YaokPlugin.call(this, config);

    //下拉数据
    temp = yaok.plugin.$(config.optionBind);
    if (temp){
        this.optionBindDs =  temp;
        temp.addEventListener(temp.eventTypes.load, _this.onLoadOptionBindData);

        var data = temp.getOriginData();
        if (data !== undefined){
            _this.setOptionData(data);
        }
    }

    //设置value
    temp = config.initValue;
    if (temp){
        _this.setValue(temp);
    }
};

//读取dataSet节点
(function(){
    var dataSetNodes = $(".yk-multi-combBox"), node, i, l;
    for (i = 0, l = dataSetNodes.length; i < l; i++){
        node = dataSetNodes[i];

        if (!node.getAttribute("init")){
            new MultiCombBox({
                id: node.id,
                allowFreeEntries: node.getAttribute("allow-free-entries"),
                placeHolder: node.getAttribute("place-holder"),
                bind: node.getAttribute("data-bind"),
                maxSelection: node.getAttribute("max-selection"),
                optionBind: node.getAttribute("option-bind"),
                displayField: node.getAttribute("display-field"),
                nullValue: node.getAttribute("null-value"),
                valueField: node.getAttribute("value-field"),
                initValue: node.getAttribute("init-value"),
                name: node.getAttribute("name"),
                node: node
            });
            node.setAttribute("init", "true");
        }
    }

    dataSetNodes = $(".yk-combBox"), node;
    for (i = 0, l = dataSetNodes.length; i < l; i++){
        node = dataSetNodes[i];

        if (!node.getAttribute("init")){
            new CombBox({
                id: node.id,
                placeHolder: node.getAttribute("place-holder"),
                disabled: node.getAttribute("disabled"),
                bind: node.getAttribute("data-bind"),
                optionBind: node.getAttribute("option-bind"),
                displayField: node.getAttribute("display-field"),
                displaySpace: node.getAttribute("display-space"),
                nullValue: node.getAttribute("null-value"),
                valueField: node.getAttribute("value-field"),
                initValue: node.getAttribute("init-value"),
                name: node.getAttribute("name"),
                node: node
            });
            node.setAttribute("init", "true");
        }
    }
})();