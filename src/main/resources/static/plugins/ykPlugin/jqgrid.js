function YaokJqTable(config) {
    var _this = this;

    this.beforeSelectRow = function () {
        var $myGrid = $(this),
            i = $.jgrid.getCellIndex($(e.target).closest('td')[0]),
            cm = $myGrid.jqGrid('getGridParam', 'colModel');
        return (cm[i].name === 'cb');
    };
    this.config = config || {};

}

YaokJqTable.prototype.initConfig = function (config) {
    //url: "http://localhost:8080/vendor/item/getItemsByQueryParams",
    //config.node = config.node;
    //colModel
    config.dataBind = !!config.dataBind ? yaok.plugin.$(config.dataBind) : null; //绑定查询的数据
    config.queryBind = !!config.queryBind ? yaok.plugin.$(config.queryBind) : null; //绑定查询的数据
    config.showpage = this.getDefaultValue(config.showpage, "false"); //是否显示分页
    config.viewrecords = this.getDefaultValue(config.viewrecords, "true"); //是否显示总记录数
    config.datatype = config.datatype || "json"; //数据类型
    config.mtype = config.mtype || "post";
    config.postData = !!config.postData ? JSON.parse(yaok.dataMapTemplate(config.postData, yaok.urlArgs)) : ""; //初始化参数值
    config.rowList = !!config.rowList ? JSON.parse(config.rowList) : [10, 20, 40];
    config.rowNum = config.rowNum || 10; //每页显示的条数
    config.rownumbers = JSON.parse(config.rownumbers || "false"); //是否显示行号
    config.height = config.height || "auto";
    config.width = config.width || "auto";
    config.multiselect = this.getDefaultValue(config.multiselect || "true"); //是否显示checkbox
    //其他配置
    config.cellEdit = this.getDefaultValue(config.cellEdit, "true");
    config.cellurl = this.getDefaultValue(config.cellurl, "clientArray", "text"); //编辑本地 或者远程
    config.prmNames = config.prmNames || { //映射查询语句
            page:"pageNum",
            rows: "pageSize",
            sort: "sidx",
            order: "sord",
            search: "search",
            nd: "nd",
            npage: null
    };
    config.jsonReader = config.jsonReader || {
            root: "data.items", //页面数据
            page: "data.pageNum", //当前第几页
            rows: "data.pageSize", //页面记录条数
            total: "data.totalPages", //总共多少页
            records: "data.totalCount", //总记录数
            repeatitems: false
    };

    //config.colModel = {};
    /*此处可以添加对查询数据的合法验证
    var orderId = $("#orderId").val(); 设置查询条件
    $("#list4").jqGrid('setGridParam',{
        datatype:'json',
        postData:{'orderId':orderId}, //发送数据
        page:1
    }).trigger("reloadGrid"); //重新载入
    */
    this.jqGrid = $(config.node).jqGrid(config).jqGrid;
};

YaokJqTable.prototype.getDefaultValue = function (v, d, type) {
    type = type || "js";
    v = v || d;
    return type == "js" ? JSON.parse(v) : v;
};

//避免单击选中行
YaokJqTable.prototype.avoidClickRowSelect = function (rowid, e) {
    var g = $(this),
        i = $.jgrid.getCellIndex($(e.target).closest('td')[0]),
        cm = g.jqGrid('getGridParam', 'colModel');

    return (cm[i].name === 'cb');
};

YaokJqTable.prototype.setRowEdit = function (rowid) {
    var g = this.jqGrid;
    if (rowid != this.currentRow){
        g('editRow', rowid, {
            keys:true,
            focusField: 4
        });

        if (this.currentRow){
            g('restoreRow', this.currentRow);
        }
        this.currentRow = rowid;
    }
};

YaokJqTable.prototype.addRow = function (data, position, rowid) {
    var g = this.jqGrid;
    rowid = rowid || yaok.createId();
    position = position || this.getAllData.length;
    g("addRowData", rowid, data, position);
    this.setRowEdit(rowid);
};

YaokJqTable.prototype.removeRow = function (rowid) {
    var row = this.getRowData(rowid);
    this.jqGrid("delRowData", rowid);
    return row;
};

YaokJqTable.prototype.getAllData = function () {
    return this.getRowData();
};

YaokJqTable.prototype.getRowData = function (rowid) {
    return this.jqGrid("getRowData", rowid);
};

YaokJqTable.prototype.getSelectRow = function () {
    var g = this.jqGrid;
    var rowKey = g('getGridParam', "selrow");

    if (rowKey)
        alert("Selected row primary key is: " + rowKey);
    else
        alert("No rows are selected");

};

