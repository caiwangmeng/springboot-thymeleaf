/*
 * 这是dataSet 
 * 数据容器
 * 包含所有的功能
 * 包括增删查改
 *
 * config class为yk-data-set自动编译为dataSet
 * dataSource: node.getAttribute("data-source"), 数据源
 * currentPage: node.getAttribute("current-page"),
 * pageSize: node.getAttribute("page-size"),
 * autoQuery: node.getAttribute("auto-query"), 是否自动查询 默认true
 * queryPara: node.getAttribute("query-para"), 查询的参数 支持默认的url参数替换 json字符串
 * parseData: node.getAttribute("parse-data"), ajax查询数据的映射关系
 * bindParent: node.getAttribute("bind-parent"), 绑定的父dataSet
 * bindField: node.getAttribute("bind-field"), 绑定的字段 默认 父dataSet 的currentRecord
 * bindFieldParaKey: node.getAttribute("bind-field-para-key"), 绑定字段映射的参数名字
 * bindType: node.getAttribute("bind-type"), remote 或者 local 的方式 远程（查询）/本地（过滤）
 * autoCreate: node.getAttribute("auto-create") 是否自动创建 默认false
 * dom: node
 *
 */

function DataSet(config) {
	EventListener.call(this); //继承消息机制

	var _this = this,
		_config = this.config = config;

	_config.id = _config.id || ("ds" + yaok.createId());//设置id
	_config.autoQuery = eval(config.autoQuery || "true"); //是否默认自动查询数据
	yaok.plugin.all[_config.id] = this; //加入索引中

	this.loadAjaxData = function(res){
		if (res.status == "ERROR"){
			this.dispatch(this.eventTypes.failed, res);
			console.log(res.message);
		}else{
			var parseData = _this.parseData;
			var func = yaok.getValueByKeys(window, parseData);
			if (typeof func == 'function'){
				_this.setData(func(res));
			}else {
                _this.setData(yaok.getValueByKeys(res, parseData));
			}
		}

	};

	this.onChangeParentRecord = function (e, ds, record, name, value, origin) {
		var obj, key;
		key = _config.bindFieldParaKey || _config.bindField;

		if (_config.bindField){
			if (_config.bindField){
				obj = {};

				var v = record.data;
				v = !v ?  null : v[_config.bindField];
				if (v){
					obj[key] = v;
				}
			}
		}else{
			obj = record.data;
		}

		if (!!_this.queryPara && (!!_config.bindField && obj[key] == _this.queryPara[key] || obj == _this.queryPara)){
			return;
		}
		_this.setQueryPara(obj);

		if (_this.checkIsNull(obj)){
			_this.clearData();
			return;
		}

		if (_this.bindType == "remote"){
			_this.getRemoteData();
		}else{
			if (!_this.localData){
				_this.localData = _this.getOriginData();
			}
			_this.loadAjaxData(yaok.getDataByAttr(_this.localData, _config.bindField, record.data[_config.bindField]));
		}
	};

	this.bindType = _config.bindType || "remote";
	this.initQueryPara(config);

	//初始化数据源
	_this.parseData = _config.parseData || "data";
	this.queryUrl = _config.queryUrl || _config.dataSource;
	this.updateUrl = _config.updateUrl || "";
	this.executeUrl = _config.executeUrl || "";
	this.insertUrl = _config.insertUrl || "";

	if (_config.autoPage){
		this.infoPara = {
			currentPage: config.currentPage || 1, //默认第一页
			pageSize: config.pageSize || 1000, //默认每页20条数据
			limit: config.pageSize
		};
	}else{
		this.infoPara = {};
	}

	this.initDataSource(config);
	this.initBind(_config);
}

DataSet.prototype.setInsertUrl = function (url) {
	this.insertUrl = url;
};
DataSet.prototype.setUpdateUrl = function (url) {
	this.updateUrl = url;
};
DataSet.prototype.setQueryUrl = function (url) {
	this.queryUrl = url;
};

DataSet.prototype.setExecuteUrl = function (url) {
	this.executeUrl = url;
};

DataSet.prototype.submit = function (data, call) {
	var _this = this;
	if (url.indexOf("dataCenter") == "0"){
		var dataController = yaok.getValueByKeys(window, url);
		if (typeof dataController == "function"){
			dataController({
				data: data,
				success: call
			});
		}
	}else {
		yaok.ajax({
			url: url,
			success: call
		});
	}
};

DataSet.prototype.pre = function () {
	this.gotoPage(this.currentPage - 1);
};

DataSet.prototype.next = function () {
	this.gotoPage(this.currentPage + 1);
};

DataSet.prototype.gotoPage = function (p) {
	var infoPara = this.infoPara;
	total = infoPara.totalPages;

	p = parseInt(p);
	if (!isNaN(p) && total && total != 0 && p >= 0 && p <= total){
		infoPara.offset = p * limit;
		this.query();
	}
};

DataSet.prototype.query = function (url) {
	this.getRemoteData(url || this.queryUrl);
};

DataSet.prototype.checkIsNull = function (o) {
	var isNull = true;
	if (!!o){
		for (var key in o){
			if (!!o[key]){
				isNull = false;
				break;
			}
		}
	}else{
		isNull = false;
	}
	return isNull;
};

DataSet.prototype.clearData = function () {
	if (this.getOriginData()){
		this.setData({});
	}
};

DataSet.prototype.initBind = function (config) {
	var p, temp;

	//获取绑定的dataSet
	temp = config.bindParent;
	if (temp){
		p = yaok.plugin.$(temp);
		if (p instanceof DataSet){
			this.bindParent = p;
			p.addEventListener(p.eventTypes.indexChange, this.onChangeParentRecord);
			p.addEventListener(p.eventTypes.update, this.onChangeParentRecord);
		}
	}
};

DataSet.prototype.setData = function (data) {
	this.data = data;
	this.records = this.initData(data);
	this.lastRecord = null;
	this.currentRecord = this.records[0];
	this.dispatch(this.eventTypes.load, this); //加载数据消息
	this.dispatch(this.eventTypes.indexChange, this, this.currentRecord);
};

DataSet.prototype.getAll = function () {
	return this.records;
};

DataSet.prototype.getOriginData = function () {
	return this.data;
};

//设置dataSource的ajax参数
DataSet.prototype.setQueryPara = function (para) {
	this.queryPara = para;
};

//初始化查询条件
DataSet.prototype.initQueryPara = function (config) {
	var temp = config.queryPara;
	if (temp){
		this.setQueryPara(JSON.parse(yaok.dataMapTemplate(temp, yaok.urlArgs)));
	}

	//是否绑定了查询的dataSet
	temp = config.queryBind;
	if (temp){
		temp = yaok.plugin.$(temp);
		if (temp instanceof DataSet){
			this.queryBind = temp;
		}
	}
};

//设置dataSource
DataSet.prototype.initDataSource = function(config){
	if (config.autoCreate){
		this.setData({});
	}else if (config.autoQuery && config.dataSource && !config.bindParent){
		this.getRemoteData(config.dataSource);
	}
};

DataSet.prototype.getRemoteData = function (url) {
	var _this = this;
	url = url || this.queryUrl;
	if (!url){
		return;
	}

	var para = {};
	if (this.config.mask){
		para.mask = {};
	}

    var queryPara = this.queryPara;
    if (queryPara){
        para.data = queryPara;
    }

	if (url.indexOf("dataCenter") == "0"){
		var dataController = yaok.getValueByKeys(window, url);
		if (typeof dataController == "function"){
            para.success = function(res){
                _this.loadAjaxData(res);
			};
            dataController(para);
		}
	}else if (url.indexOf("[") == "0"){
		try{
			var data = eval(url);
			this.setData(data);
		}catch(e){
			this.dispatch(this.eventTypes.failed, "不合法的dataSource");
		}
	}else{
		para.url = url;
		para.success = function (res) {
			_this.loadAjaxData(res);
		};
		yaok.ajax(para);
	}
};

//初始化数据为record
DataSet.prototype.initData = function(datas){
	if (!(datas instanceof Array)){
		datas = [datas];
	}
	var result = [];
	for (var i = 0, l = datas.length; i < l; i++) {
		result.push(new Record(this, datas[i]));
	}
	return result;
};

//设置数据
DataSet.prototype.loadData = function(data){
	this.setData(data);
};

DataSet.prototype.eventTypes = {
	check: "check",
	indexChange: "indexChange", //ds record
	load: "load", //ds
	success: "success", // ds
	failed: "failed", //ds
	select: "select", // ds, record
	update: "update",	//ds record name value origin
	delete: "delete" //ds record
};

DataSet.prototype.getCurrentRecord = function() {
	return this.currentRecord;
};

//r 为record 或者 index
DataSet.prototype.changeIndex = function(r) {
	this.lastRecord = this.currentRecord;
	if (typeof r != "object"){
		this.currentRecord = this.records(r);
	}else{
		this.currentRecord = this.records(r);
	}
	this.dispatch(this.eventTypes.indexChange, this, record);
};

DataSet.prototype.delete = function(record, ajax){
	if (ajax){
	}else{
		delete deleteRecord(this.records, record);
	}

	function deleteRecord(records, r){
		if (typeof r != "object"){
			for (var i = 0, l = records.length; i < l; i++){
				if (records[i] == r){
					records.splice(i, 1);
					break;
				}
			}
		}else{
			records.splice(parseInt(r), 1);
		}

	}
};

//record 或者 data
DataSet.prototype.add = function(record){
	if (!this.records){
		this.records = [];//防止数据未初始化
	}

	if (record instanceof Record){
		this.records.push(record);
	}else{
		record = new Record(this, record, "new");
		this.records.push(record);
	}

	this.currentRecord = record;
	this.dispatch(this.eventTypes.indexChange, record);
};

DataSet.prototype.check = function () {
	this.checkResult = null;
	this.dispatch(this.eventTypes.check, this);
};

DataSet.prototype.setCheckResult = function (field, error) {
	this.checkResult = this.checkResult || {};
	this.checkResult[field] = error;
};

function Record(ds, data, status, verified){
	this.bind = ds;
	this.data = data;
	this.dataStatus = "clean";
	this.status = status || "old"; //标记 new old dirty
	this.verified  = verified; //校验
	this.id = "rid" + yaok.createId();
}

Record.prototype.set = function(name, value, origin){
	this.dataStatus = "dirty";
	this.data[name] = value;
	this.bind.dispatch(this.bind.eventTypes.update, this.bind, this, name, value, origin);
};

Record.prototype.get = function(name){
	return !!this.data ? yaok.getValueByKeys(this.data, name) : "";
};

Record.prototype.valid = function(name){

};

//读取dataSet节点
(function(){
	var dataSetNodes = $(".yk-data-set"), node;
	for (var i = 0, l = dataSetNodes.length; i < l; i++){
		node = dataSetNodes[i];

		if (!node.getAttribute("init")){
			new DataSet({
				id: node.id,
				dataSource: node.getAttribute("data-source"),
				mask: node.getAttribute("mask"),
				currentPage: node.getAttribute("current-page"),
				pageSize: node.getAttribute("page-size"),
				autoQuery: node.getAttribute("auto-query"),
				queryPara: node.getAttribute("query-para"),
				parseData: node.getAttribute("parse-data"),
				bindParent: node.getAttribute("bind-parent"),
				bindField: node.getAttribute("bind-field"),
				bindFieldParaKey: node.getAttribute("bind-field-para-key"),
				bindType: node.getAttribute("bind-type"),
				autoCreate: node.getAttribute("auto-create"),
				dom: node
			});
			node.setAttribute("init", "true");
		}
	}
})();
