/**
 * Created by ThinkPad on 2016/11/30.
 *
 * 用于封装bootstrapTable
 * 编辑器
 * 下拉
 * 联动表格
 *
 * 如果没有uniqueId 将无法编辑
 */

function BootstrapGrid(config) {
    var _this = this,
         _editContainer = yaok.$e("div", "bootstrap-grid-edit-con"); //渲染的模板

    _this.config = config;
    _this.$node = $(config.node);
    _this.currentRow = null;

    //加入全局索引
    config.id = config.id || (config.node.id = "grid" + yaok.createId());
    yaok.plugin.all[config.id] = this;

    //datePicker
    _this.currentEdit = {
        field: null,
        input: null
    };

    _editContainer.appendChild(yaok.$e("input", "form-control bootstrap-grid-edit"));


    var _datePickerTplt = yaok.$e("div", "", '<div class="datePicker-dom" style="position: relative;"><input class="form-control bootstrap-grid-edit"><span class="add-on"><i class="fa-calendar"></i></span></div>');
    var _selectTplt = yaok.$e("div", "", '<div class="select-dom" style="position: relative;"><input class="form-control bootstrap-grid-edit"><span class="add-on"><i class="fa-sort-down"></i></span></div>');

    //设置查询
    this.queryPara = function (para) {
        para = para || {};
        para.pageSize = para.limit;
        para.pageNum = 1 + Math.ceil(para.offset / para.limit);
        var temp = _this.queryBind || {};

        if (this.url) {
            temp.url = _this.url;
        }

        if (temp instanceof DataSet){
            temp = temp.getOriginData();
        }

        if (_this.config.pagination){
            if (temp){
                temp = yaok.combine(temp, para);
            }else{
                temp = para;
            }
        }

        if (_this.queryParaData){
            temp = yaok.combine(temp, _this.queryParaData);
        }
        return temp;
    };

    this.geRefreshPara = function (para) {
        var refreshPara = {};
        para = para || {};
        var temp = _this.queryBind || {};

        if (temp instanceof DataSet){
            temp = temp.getOriginData();
        }

        if (_this.config.pagination){
            if (temp){
                temp = yaok.combine(temp, para);
            }else{
                temp = para;
            }
        }

        if (this.queryParaData){
            temp = yaok.combine(temp, this.queryParaData);
        }

        refreshPara.query = temp;

        return refreshPara;
    };


    this.formatter = function (v, row, index) {
        var t = _this.formatterTimes,
            column = _this.config.columns[t],
            field = column.field,
            dv;

        //根据渲染次数获得field
        v = v || "";
        _this.formatterTimes = (t + 1) % _this.columnLength;

        dv = _this.getFormatterValue(field || t, v, row, index);


        if (!column.editable){
            return dv;
        }else{

            var input, editType = column.editType;

            if (editType == "datePicker"){
                input = _datePickerTplt.children[0].children[0];
                setInputAttr(input, v, dv, editType, field);
                return _datePickerTplt.innerHTML;
            }else if (editType == "select"){
                input = _selectTplt.children[0].children[0];
                setInputAttr(input, v, dv, editType, field);
                return _selectTplt.innerHTML;
            }else if(editType == "checkbox"){
                //checkbox特殊
                setInputAttr(_editContainer.firstChild, v, dv, editType, field, column);
                return _editContainer.innerHTML;
            }else{
                input = _editContainer.firstChild;
                setInputAttr(input, v, dv, editType, field);
                return _editContainer.innerHTML;
            }
        }
        
        function setInputAttr(input, v, dv, type, field, column) {
            if (type != "checkbox"){
                input.setAttribute("type", "text");
            }else{
                var p = input.parentNode;
                p.removeChild(input);
                input = yaok.$e("input", "form-control bootstrap-grid-edit");
                p.appendChild(input);
                input.setAttribute("type", "checkbox");

                if (column.editCheckedValue == v){
                    input.setAttribute("checked", "checked");
                }
            }

            input.setAttribute("data-real-value", v);
            input.setAttribute("data-edit-type", editType);
            input.setAttribute("data-edit-field", field);
            input.setAttribute("value", dv);
            input.value = dv;

            return input;
        }
    };

    _this.onFocusEditInput = function (e) {
        var input = $(this);
        var editType = input.attr("data-edit-type"),
            v = input.attr("data-real-value");

        _this.currentUniqueId = _this.getUniqueidByInput(input[0]);
        var tr=yaok.getParentNode(input[0], "tr");
        _this.currentRow = _this.getData()[tr.getAttribute("data-index")];
        _this.currentEdit.field = input.attr("data-edit-field");
        _this.currentEdit.input = input[0];

        switch (editType){
            case "text":
                input.val(v);
                break;
            case "number":
                input.val(v);
                input.attr("type", "number");
                break;
            case "checkbox":
                break;
            case "money":
                input.val(v);
                input.attr("type", "number");
                break;
            case "datePicker":
                input.val(v);
                _this.getDatePickerEditor(input[0], v);
                break;
            case "select":
                input = input[0];
                var select = input.yaokSelect;
                if (!select){
                    var column = _this.fieldConfig[_this.currentEdit.field];
                    select = input.yaokSelect = _this.getSelectEditor(input, v, column.editDisplayField, column.editValueField, column.editOptionBind);
                    select.addEventListener(select.eventTypes.change, _this.onChangeSelectValue);
                }
                select.show();
                break;
        }
    };

    //失去焦点可能做得事情
    _this.onBlurEidtInput = function () {
        var input = $(this),
            editType = input.attr("data-edit-type"),
            field = input.attr("data-edit-field"),
            editConfig = _this.fieldConfig[field];

        switch (editType){
            case "text":
                input.attr("type", "text");
               _this.updateCellByInput(input[0], field);
                break;
            case "number":
                input.attr("type", "text");
                _this.updateCellByInput(input[0], field);
                break;
            case "select":
                input.attr("type", "text");
                break;
            case "checkbox":
                input = input[0];
                if (input.checked ){
                    _this.currentRow[field] = editConfig.editCheckedValue;
                }else{
                    _this.currentRow[field] = editConfig.editUncheckedValue;
                }
        }
    };

    _this.onUpdateField = function (v) {
        if (typeof v == "object"){
            if (v.format){
                v = v.format();
            }
        }

        var input = _this.currentEdit.input;
        input.value = v;
        _this.updateCellByInput(input, _this.currentEdit.field);
    };

    _this.onChangeSelectValue = function (e, select, value, display) {
        var edit = _this.currentEdit,
            input = edit.input;

        input.value = value;
        _this.updateCellByInput(edit.input, edit.field);
        input.value = display;
    };

    _this.onClickRow = function (row) {
        _this.currentRow = row;
    };
    _this.onLoadSuccess = function (data) {
        if (data.items){
            data = data.items;
        }
        _this.data = data;
        $('.dropdown-toggle').dropdown();
    };

    //初始化表格参数
    _this.init();
}

/*
 * 日期编辑器
 *
 */
BootstrapGrid.prototype.getDatePickerEditor = function (input, v, format) {
    if (!input.getAttribute("data-init-editor")){
        var plugin = $(input).datepicker({
            format: format || "yyyy-mm-dd",
            autoclose: true,
            pickerPosition: "bottom-left",
            enableOnReadonly: "true", //如果input为readyonly即不会显示datePicker
            todayBtn: true,
            minuteStep: 10,
            clearBtn: false,
            todayHighlight: "true",
            multidate: false,
            multidateSeparator: "~"
        });
        input.setAttribute("data-init-editor", "true");
        plugin.on('changeDate', this.onUpdateField);
    }
    input.focus();
};
BootstrapGrid.prototype.getSelectEditor = function (input, v, displayField, valueField, optionBind) {
    return $(input).yaokSelect = new YaokSelect({
        optionBind: optionBind,
        node: input,
        initValue: v,
        displayField: displayField,
        valueField: valueField,
        autoShow: true
    });
};

BootstrapGrid.prototype.getUniqueidByInput = function (input) {
    var tr = yaok.getParentNode(input, "tr");
    if (tr){
        return tr.getAttribute("data-uniqueid");
    }
};

BootstrapGrid.prototype.init = function () {
    var config = this.config || {}, //配置
        temp; //临时变量

    config.id = config.id || ("grid" + yaok.createId()); //创建id
    yaok.plugin.all[config.id] = this; //加入索引中

    //查询绑定的ds的id
    this.setQueryBind(config.queryBind);

    //初始化url
    temp = config.url || "";
    temp = temp.replace("{basePath}", basePath);

    if (temp && temp.indexOf("dataCenter") > -1){
        temp = yaok.getValueByKeys(window, temp);
        if (temp && temp.item){
            config.url = basePath + temp.item.url;
        }
    }else{
        config.url = temp;
    }


    config.checkbox="true";
    config.method = config.method || "post";
    //config.contentType = config.contentType	|| 'application/json';
    config.contentType = "application/x-www-form-urlencoded; charset=UTF-8";

    config.pageSize = config.pageSize || 10;
    config.pagination = config.pagination || false;

    if (config.pagination){
        if (config.url){
            config.sidePagination = config.sidePagination || "server";
            this.url = config.url;
        }else{
            config.sidePagination = config.sidePagination || "client";
        }
    }

    config.pageList = [10, 20, 40, 100, 500];

    //初始化服务器数据配置
    config.responseHandler = config.responseHandler || getServiceData;

    //设置查询参数
    config.queryParams = config.queryParams || this.queryPara;

    config.columns = this.handleColumns(config.columns);
    config.onClickRow = this.onClickRow;

    config.onLoadSuccess = this.onLoadSuccess;

    if (config.autoQuery == "false"){
        this.url = config.url;
        delete config.url;
        this.$node.attr("data-url", "");
    }
    this.$node.bootstrapTable(config);

    //添加事件 编辑核心
    this.$node.on("focus", ".bootstrap-grid-edit", this.onFocusEditInput);
    this.$node.on("blur", ".bootstrap-grid-edit", this.onBlurEidtInput);
};

BootstrapGrid.prototype.insert = function (datas, index) {
    var _this = this;

    index = parseInt(index);
    index = isNaN(index) ? this.$node.bootstrapTable("getData").length : index;

    if (datas && datas.length > 0 && datas[0]){
        var data;
        for (var i = 0; i < datas.length; i++) {
            insert(datas[i]);
        }
    }else{
        insert(datas);
    }

    function insert(data){
        data = data || {};

        var key, fields = _this.fieldConfig, f;
        for (key in fields){
            f = fields[key];
            if (f.defaultValue){
                data[key] = data[key] === undefined ? f.defaultValue : data[key];
            }
        }

        _this.$node.bootstrapTable('insertRow', {
            index: index,
            row: data
        });
        index ++;
    }
};

BootstrapGrid.prototype.getRowByUniqueId = function (ids) {
    if (!ids){
        return;
    }
    var $table = this.$node;
    if (typeof ids == "string" || typeof ids == "number"){
        return $table.bootstrapTable("getRowByUniqueId", ids);
    }else {
        var row = [];
        for (var i = 0, l = ids.length; i < l; i ++){
            row.push($table.bootstrapTable("getRowByUniqueId", ids[i]));
        }
        return row;
    }
};

BootstrapGrid.prototype.setData = function (data) {
    this.$node.bootstrapTable("load", data);
};

BootstrapGrid.prototype.getSelectedData = function () {
    return this.$node.bootstrapTable("getSelections");
};

BootstrapGrid.prototype.unSelectAll = function () {
    this.$node.bootstrapTable("uncheckAll");
};

BootstrapGrid.prototype.updateCellByInput = function (input, field) {
    var tr = yaok.getParentNode(input, "tr"),
        v = input.value,
        dv,
        index = tr.getAttribute("data-index");

    //设置value
    this.currentRow[field] = v;
    input.setAttribute("data-real-value", v);

    //格式化数据
    dv = this.getFormatterValue(field, v, this.currentRow, index);

    //设置input
    input.setAttribute("value", dv);
    input.value = dv;
};

//设置格式化值
BootstrapGrid.prototype.getFormatterValue = function (field, v, row, index) {
    var formatter = this.columnFormatter[field];

    if (formatter){
        if (typeof formatter != "function"){
            formatter = yaok.getValueByKeys(window, formatter);
            if (typeof formatter == "function"){
                v = formatter(v, row, index);
                this.columnFormatter[field] = formatter;
            }
        }else{
            v = formatter(v, row, index);
        }
    }
    return v;
};

BootstrapGrid.prototype.updateRowsByUniqueId = function (ids, v) {
    var $table = this.$node;
    if (typeof  ids == "string" || typeof ids == "number"){
        $table.bootstrapTable("updateByUniqueId", {
            id: ids,
            row: v
        });
    }else{
        for (var i = 0, l = ids.length; i < l; i ++){
            $table.bootstrapTable("updateByUniqueId", {
                id: ids[i],
                row: v
            });
        }
    }
};

BootstrapGrid.prototype.query = function () {
    if (!this.getPlugin().bootstrapTable("getOptions").url) {
        this.getPlugin().bootstrapTable("refreshOptions", {
            url: this.url,
            pageNumber: 1
        });
    }else {
        this.getPlugin().bootstrapTable("refresh", this.geRefreshPara());
    }
};

BootstrapGrid.prototype.getPlugin = function () {
    return  this.$node;
};

BootstrapGrid.prototype.removeByUniqueId = function (ids) {
    var $table = this.$node;
    if (typeof  ids == "string" || typeof ids == "number"){
        $table.bootstrapTable("removeByUniqueId", ids);
    }else{
        for (var i = 0, l = ids.length; i < l; i ++){
            $table.bootstrapTable("removeByUniqueId", ids[i]);
        }
    }
};

//初始化数据
BootstrapGrid.prototype.handleColumns = function (columns) {
    //处理渲染逻辑 主要为打通 data-editable data-edit-type number text datePick money
    /*
     * select
     * data-edit-option-bind 下拉框绑定
     * data-edit-value-field
     * data-edit-display-field
     *
     */

    this.columnFormatter = {};
    this.fieldConfig = {};
    this.formatterTimes = 0; //根据渲染次数 计算出clumn
    this.columnLength = columns.length;

    var column, formatter;
    for (var i = 0, l = columns.length; i < l; i++) {
        column = columns[i];
        column.editType = column.editType || "text";

        if (column.editType == "checkbox"){
            column.defaultValue = column.defaultValue === undefined ? column.editUncheckedValue : column.defaultValue;
        }

        if (column.field){
            this.fieldConfig[column.field] = column;
            column.class = !!column.class ? (column.class + " {" + column.field + "}") : ("{" + column.field + "}");
        }

        formatter = column.formatter;
        if (formatter){
            this.columnFormatter[column.field || i] = formatter;
        }
        column.formatter = this.formatter;
    }

    return columns;
};

//设置查询的bind
BootstrapGrid.prototype.setQueryBind = function (ds) {
    if (ds){
        return this.queryBind = (typeof ds === "object" ? ds : yaok.plugin.$(ds));
    }
};

BootstrapGrid.prototype.setQueryPara = function(data){
    this.queryParaData = data;
};

BootstrapGrid.prototype.getData = function () {
    return this.$node.bootstrapTable("getData")
};

//设置语言环境
$.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales[getLocale("-")]);

//读取dataSet节点
(function() {
    var nodes = $(".yk-bootstrap-grid"),
        node,
        i, l, h, k, j, m,
        tr, //列个数
        th,
        column,
        attrs,
        attr,
        config,
        str = "data-"; //前缀
    for (j = 0, m = nodes.length; j < m; j++) {
        node = nodes[j];

        if (!node.getAttribute("init")) {
            config = {
                node: node
            };

            //获取表格配置
            attrs = node.attributes;
            for (i = 0, l = attrs.length; i < l; i++) {
                attr = attrs[i];
                config[yaok.transformCamelCase(attr.name.replace(str, ""))] = attr.value;
            }

            //获取列的配置
            config.columns = [];
            tr = $(node).find("tr")[0].children;
            for (h = 0, k = tr.length; h < k; h ++) {
                th = tr[h];
                column = {};

                attrs = th.attributes;
                for (i = 0, l = attrs.length; i < l; i++) {
                    attr = attrs[i];
                    column[yaok.transformCamelCase(attr.name.replace(str, ""))] = attr.value;
                }
                config.columns.push(column);
            }

            new BootstrapGrid(config);
            node.setAttribute("init", "true");
        }
    }
})();