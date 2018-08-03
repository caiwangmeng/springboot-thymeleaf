// base-path 加载的根目录
// no-sys-css 配置是否需要加载系统组件css
// no-sys-js 配置是否需要加载系统js
// need-plugin table,upload

var basePath = document.documentElement.getAttribute("basePath") || "/app/";
var baseConfig = {
	pageVersion: document.documentElement.getAttribute("version"),
	version: getLocalStorage("base-version") || "1.23",
	prefix: "", //资源目录
	paths: {
		baseCss: {
			url: "css/base.css"
		},
		bootstrapCss: {
			url: "plugins/bootstrap-3.3.0-dist/dist/css/bootstrap.min.css"
		},
		bootstrapThemeCss: {
			url: "plugins/bootstrap-3.3.0-dist/dist/css/bootstrap-theme.min.css"
		},
		jquery: {
			url: "lib/jquery-2.1.4.min.js"
		},
		yaok: {
			url: "lib/yaok.js"
		},
		dzh: {
			url: "plugins/dzh.js"
		},
		bootstrapJs: {
			url: "plugins/bootstrap-3.3.0-dist/dist/js/bootstrap.min.js"
		},
		dataSetJs: {
			url: "plugins/ykPlugin/dataSet.js"
		},
		commonBind: {
			url: "plugins/ykPlugin/common.js"
		},
		combBox: {
			url: "plugins/ykPlugin/combBox.js"
		}
	},
	plugins: {
		bootstrapGrid: [
			"plugins/bootstrap-table/bootstrap-table.min.css",
			"plugins/bootstrap-table/bootstrap-table.min.js",
			"plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js",
			"plugins/ykPlugin/bootstrapGrid.js"
		],
		bootstrapTable: [
			"plugins/bootstrap-table/bootstrap-table.min.css",
			"plugins/bootstrap-table/bootstrap-table.min.js",
			"plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js",
			"plugins/bootstrap-table/edit/css/bootstrap-editable.min.css",
			"plugins/bootstrap-table/edit/js/bootstrap-editable.min.js",
			"plugins/bootstrap-table/edit/js/bootstrap-table-edittable.js"
		],
		ykPlugin: [
			"plugins/ykPlugin/yaok-brand.js"
		],
		bootstrapDateTimePicker:[
			"plugins/bootstrap-datetimepicker/moment/min/moment-with-locales.min.js",
			"plugins/bootstrap-datetimepicker/moment/locale/fr.js",
			"plugins/bootstrap-3.3.0-dist/dist/js/bootstrap.min.js",
			"plugins/bootstrap-3.3.0-dist/dist/css/bootstrap.css",
			"plugins/bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css",
			"plugins/bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js"
		]
	},
	service: {
		use: basePath
	},
	defaultImg: "img/common/logo.png",
	staticValue: {
		locale: "locale",
		user: "user",
		name: "name",
		token: "token",
		zhs: "zh_CN",
		eng: "en_US",
		needLogin: "need-login",
		pageCss: "page-css",
		pageJs: "page-js",
		cssBathPath: "css/",
		jsBathPath: "js/"
	}
};

function loadFile(path, type, sync) {
	type = type || (path.indexOf(".css") > -1 ? "css" : "js");

	if (sync) {
		var head = document.getElementsByTagName('head')[0];
		var node;

		if (type == "css") {
			node = document.createElement('link');
			node.href = path;
			node.rel = 'stylesheet';
			node.type = 'text/css';
		} else {
			node = document.createElement('script');
			node.src = path;
			node.type = 'text/javascript';
		}
		head.appendChild(node);
	} else {
		var str;
		if (type == "css") {
			str = '<link type="text/css" rel="stylesheet" href="' + path + '" />';
		} else {
			str = '<script type="text/javascript" src="' + path + '" ></script>';
		}
		document.write(str);
	}
}

function getLocalStorage(key) {
	if (window.localStorage) {
		return window.localStorage.getItem(key);
	}
}

function gotoLogin(page) {
	page = typeof page == "string" ? encodeURIComponent(page) : encodeURIComponent(location.href);
	location.href = basePath + "login?return=" + page;
}

function getServiceData(res) {
	var a = res.data;
	if (a && a.pageNum != null && a.pageNum != undefined) {
		a.rows = a.items;
		a.total = a.totalCount;
		return a;
	}
	return a;
}

function checkHasLogin() {
	if (!getCookie("_token_")) {
		gotoLogin();
	}
}

function getLocale(re) {
	var lang = getCookie("locale") || "en_US";
	if (re) {
		return lang.replace("_", re);
	} else {
		return lang;
	}
}

function getCookie(key) {
	if (document.cookie.length > 0) {
		var start = document.cookie.indexOf(key + "=");
		var end = null;
		if (start != -1) {
			start = start + key.length + 1;
			end = document.cookie.indexOf(";", start);
			if (end == -1) {
				end = document.cookie.length;
			}
			return decodeURIComponent(document.cookie.substring(start, end));
		}
	}
	return ""
}

function getPath(path, version) {
	var p;
	if (path.indexOf("http:") > -1) {
		p = path;
	} else {
		p = basePath + baseConfig.prefix + path;
	}
	p += "?version=" + (version || baseConfig.version);

	return p;
}

function getPageDefault(type) {
	var pagePath = location.pathname.replace(basePath, ""),
		pageName;

	var last = pagePath.lastIndexOf(".");
	if (last == -1) {
		last = pagePath.length;
	}

	var start = pagePath.lastIndexOf("/");
	if (start == -1 && pagePath.indexOf(".") == -1) {
		pageName = "index";
	} else {
		pageName = pagePath.substring(start + 1, last);
	}

	var folder = pagePath.substring(0, start);
	if (folder) {
		folder += "/";
	}
	if (type == "js") {
		return getPath("js/page/" + folder + pageName + ".js", baseConfig.pageVersion);
	} else {
		return getPath("css/page/" + folder + pageName + ".css", baseConfig.pageVersion);
	}
}

function EventListener() {
	var _this = this;
	_this.events = {};

	_this.addEventListener = function(type, func, para) {
		(_this.events[type] || (_this.events[type] = [])).push({
			call: func,
			para: para
		});
	};

	_this.dispatch = function(type, msg, p1, p2, p3, p4) {
		var events = this.events[type];
		if (events) {
			var event;
			for (var i = 0, l = events.length; i < l; i++) {
				event = events[i];
				if (typeof event.call == "function") {
					event.call(event, msg, p1, p2, p3, p4);
				}
			}
		}
	};
}

(function(config) {
	var html = document.documentElement,
		paths = config.paths,
		version = config.version,
		prefix = config.prefix,
		file,
		temp,
		url,
		ifNoNeedSystemCss;

	baseConfig.defaultImg = basePath + prefix + config.defaultImg;

	//加载language
	window.language = {
		items: {},
		getLangDesc: function(key) {
			return (this.items[key] || key);
		}
	};

	//loadFile(basePath + "lang/lang.js?lang=" + getLocale()+"&v="+Math.random());

	//是否需要css
	temp = html.getAttribute("page-css");

	if (temp !== undefined && temp !== null) {
		temp = temp || getPageDefault("css");
		loadFile(temp, "css");
	}

	ifNoNeedSystemCss = document.documentElement.getAttribute("no-sys-css"); //先加载css
	ifNoNeedSystemCss = (ifNoNeedSystemCss !== undefined && ifNoNeedSystemCss !== null);

	for (var key in paths) {
		file = paths[key];
		url = file.url;

		if (url.indexOf(".css") > -1 && !ifNoNeedSystemCss) {
			if (url.indexOf("http:") > -1) {
				loadFile(url, file.type);
			} else {
				loadFile(basePath + prefix + url + "?" + "version=" + version, file.type);
			}
		}
	}

})(baseConfig);