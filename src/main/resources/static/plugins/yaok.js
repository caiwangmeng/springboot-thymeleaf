(function(w, undefined) {
	w.undefined = undefined;
	var $$ = w.yaok = w.yaok || new Object();
	var doc = w.document;
	var $ = $$.$ = function (id) {
		if (typeof(id) == "string") {
			return $q(id);
		} else {
			return id;
		}
	};

	var $q = $$.$q = function (id) {
		if (doc.querySelectorAll) {
			$q = function (id) {
				if (id.charAt(0) == "#" && id.indexOf(" ") == -1) {
					return doc.querySelector(id)
				} else {
					return doc.querySelectorAll(id);
				}
			}
		} else {
			$q = function (id) {
				var start = id.charAt(0);
				switch (start) {
					case ".":
						return $class(id.substring(1));
						break;
					case "#":
						return $id(id.substring(1));
						break;
					default:
						return $tag(id);
				}
			}
		}

		return $q(id);
	};

	//创建dom
	var $e = $$.$e = function (tagName, className, value) {
		var temp = doc.createElement(tagName);
		value = value || "";
		className = className || "";
		temp.className = className;

		if (tagName.toLowerCase() == "input") {
			temp.value = value;
		} else {
			temp.innerHTML = value;
		}

		return temp;
	};

	//获取style
	var $s = $$.$s = function (obj) {
		obj = $(obj);
		return obj.currentStyle ? obj.currentStyle : getComputedStyle(obj);
	};

	/*
	 * 客户端
	 */
	$$.client = (function () {
		//呈现引擎 
		var engine = {
			name: '', //引擎名字ie Gecko Webkit KHTML Opera
			version: '' //版本号
		};
		//浏览器
		var browser = {
			name: '',
			version: ''
		};
		//平台、设备和操作系统
		var system = {
			system: '', //操作系统 win mac xll
			device: '' //设备 iphone android ipod ipad ios nokiaN winMobile
		};
		var ua = navigator.userAgent;

		//检测浏览器
		if (window.opera) {
			engine.name = 'opera';
			engine.version = window.opera.version();
		} else if (/AppleWebKit\/(\S+)/.test(ua)) {
			engine.version = RegExp["$1"];
			engine.name = 'webkit';
			var webkit = parseFloat(engine.version);
			//确定是chrome还是safari
			if (/Chrome\/(\S+)/.test(ua)) {
				browser.name = 'chrome';
				browser.version = RegExp["$1"];
			} else if (/Version\/(\S+)/.test(ua)) {
				browser.version = RegExp["$1"];
				browser.name = 'safari';
			} else {
				var safariVersion = 1;
				if (webkit < 100) {
					safariVersion = 1;
				} else if (webkit < 312) {
					safariVersion = 1.2;
				} else if (webkit < 412) {
					safariVersion = 1.3;
				} else {
					safariVersion = 2;
				}
				browser.name = 'safari';
				browser.version = safariVersion;
			}
		} else if (/KHTML\/(\S+)/.test(ua) || /Kongqueror\/([^;]+)/.test(ua)) {
			engine.version = browser.version = RegExp["$1"];
			engine.name = 'khtml';
			browser.name = 'Kong';
		} else if (/rv:([^\)]+)\) Gecko\/d{8}/.test(ua)) {
			engine.version = RegExp["$1"];
			engine.name = 'gecko';

			//确定不是firefox
			if (/Firefox\/(\S+)/.test(ua)) {
				browser.version = RegExp["$1"];
				engine.name = 'firefox';
			}
		} else if (/MSIE([^;]+)/.test(ua)) {
			engine.name = 'ie';
			engine.version = browser.version = RegExp["$1"];
			browser.name = 'ie';
		}

		//检测设备 iPod iPad
		if (navigator.userAgent.match(/(iPhone|Android|ios|iOS|Backerry|WebOS|Symbian|Windows Phone|Phone)/i)) {
			system.device = 'phone';
		} else if (navigator.userAgent.match(/(iPod|iPad)/i)) {
			system.device = 'pad';
		} else {
			system.device = 'pc';
		}

		if (ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1) {//安卓手机
			system.name = "android";
		} else if (ua.indexOf('iPhone') > -1) {
			system.name = "ios";
		} else if (ua.indexOf('Windows Phone') > -1) {//winphone手机
			system.name = "windows phone";
		} else {
			system.name = "unknow";
		}

		var client = {engine: engine, browser: browser, system: system};
		if (typeof w.BaseClient == "function") {
			w.BaseClient(client);
		}
		return client;
	})();


	/*
	 * 日期格式化
	 * yaok.formatDate(date, "yyyy-MM-dd hh:mm:ss");
	 */
	//获取今天明天后天 昨天 前天
	$$.lastDays = (function () {
		function getDate(dDays) {
			var d = new Date();
			d.setDate(d.getDate() + dDays);
			return new Date(d);
		}

		return [
			{
				d: getDate(-2),
				name: language.getLangDesc("前天")
			},
			{
				d: getDate(-1),
				name: language.getLangDesc("昨天")
			},
			{
				d: getDate(0),
				name: language.getLangDesc("今天")
			},
			{
				d: getDate(1),
				name: language.getLangDesc("明天")
			},
			{
				d: getDate(2),
				name: language.getLangDesc("后天")
			}
		];
	})();
	$$.formatTableDate = function (date) {
		if (!date){
			return "-";
		}
		return yaok.formatDate(date, "yyyy-MM-dd hh:mm:ss");
	};
	$$.cDayNames = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
	$$.formatDate = function (date, fmt, c) {
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
	};
	$$.cDay = function (date) {
		return $$.cDayNames[date.getDay()];
	};

	/*
	 * 获取事件的信息
	 * x，y坐标
	 * 相对于页面
	 * 
	 * clientX, clientY 相对于窗口
	 * 
	 * targetX, targetY 相对于
	 * mouse是event
	 * 
	 * sign 获取事件侦听标志
	 * 类 .class
	 * id #id
	 * 默认节点名为button
	 * 
	 */
	$$.getEvent = function (e, sign) {
		e = e || window.event;

		//相对于文档
		e.pageX = e.pageX || (e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
		e.pageY = e.pageY || (e.clientY + (document.documentElement.scrollTop || document.body.scrollTop));

		//target事件源
		e.target = e.target || e.srcElement;

		//currentTarget事件侦听
		e.currentTarget = e.currentTarget || $$.getParentNode(e.target, sign || "button");

		return e;
	};

	/*
	 * 根据标志获取父节点
	 * .node 类名
	 * #node_id 节点id
	 * nodeName 默认节点名
	 */
	$$.getParentNode = function (tgr, sign) {
		if (!$$.checkIsDom(tgr)) {
			return;
		}

		var attr = "", tagName;
		sign = sign.toLowerCase();
		tagName = tgr.tagName.toLowerCase();

		switch (sign.charAt(0)) {
			case "." :
				attr = "class";
				sign = sign.substring(1);
				break;
			case "#" :
				attr = "id";
				sign = sign.substring(1);
				break;
			default:
				attr = "tagName";
		}
		;

		if (attr == "tagName") {
			while (tagName != "html" && tagName != "body") {
				if (tagName == sign) {
					return tgr;
					break;
				}

				tgr = tgr.parentNode;
				tagName = tgr.tagName.toLowerCase();
			}
		} else {
			var temp = tgr.getAttribute(attr);
			while (tagName != "html" && tagName != "body") {
				if (temp && temp.indexOf(sign) !== -1) {
					return tgr;
					break;
				}

				tgr = tgr.parentNode;
				tagName = tgr.tagName.toLowerCase();
				temp = tgr.getAttribute(attr);
			}
		}

		return;
	};

	/*
	 * 如何对象为数组，就会为每个成员进行绑定
	 * event 为添加事件模型 click blur load
	 * eventModel : true ：捕获事件  false:冒泡事件  默认 false
	 */
	$$.bind = function (target, eventName, func, eventModel) {
		target = $(target);

		//判定是否为数组
		if ($$.checkIsDom(target)) {
			doBind(target, eventName, func, eventModel);
		} else if (target && target.length) {
			//如果为数组
			var l = target.length;
			for (var i = 0; i < l; i++) {
				$$.bind(target[i], eventName, func, eventModel);
			}
		}

		function doBind(target, eventName, func, eventModel) {
			eventModel = (typeof(eventModel) == "boolean") ? eventModel : false;
			if (target.attachEvent) {
				target.attachEvent("on" + eventName, func);
			} else {
				target.addEventListener(eventName, func, eventModel);
			}
		}
	};
	$$.remove = function (target, eventName, func, eventModel) {
		if ($$.checkIsDom(target)) {
			doRemove(target, eventName, func, eventModel);
		} else if (target && target.length) {
			//如果为数组
			var l = el.length;
			for (var i = 0; i < l; i++) {
				doRemove(el[i], eventName, func, eventModel);
			}
		}

		function doRemove(target, eventName, func, eventModel) {
			target = $(target);
			eventModel = (typeof(eventModel) == "boolean") ? eventModel : false;
			if (target.detachEvent) {
				target.detachEvent("on" + eventName, func);
			} else {
				target.removeEventListener(eventName, func, eventModel);
			}
		}
	};


	/*
	 * object对象
	 * {pageWidth:1366, pageHeight:768};
	 * pageWidth：页面宽度
	 * pageHeight：页面高度 不计算滚动条的高度
	 */
	$$.getPageSize = function (win) {
		win = win || w || window;
		if (win.document.compatMode == "CSS1Compat") {
			return {
				pageWidth: win.document.documentElement.clientWidth,
				pageHeight: win.document.documentElement.clientHeight
			};
		} else if (typeof win.innerWidth == "number") {
			return {
				pageWidth: win.innerWidth,
				pageHeight: win.innerHeight
			};
		} else {
			return {
				pageWidth: win.document.body.clientWidth,
				pageHeight: win.document.body.clientHeight
			};
		}
	};

	/*
	 * 检测是否为微信
	 */
	$$.checkIsWeiXin = (function () {
		var ua = w.navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	})();

	/*
	 * 获取url后面的拼接参数
	 * www.baidu.com?a=1$b=2c=3
	 * 返回对象 {a:1, b:2, c:3};
	 */
	$$.urlArgs = (function () {
		var locationSearch = window.location.search.substr(1);
		var l = locationSearch.length;
		if (l > 0) {
			var items = locationSearch.split("&");
			var item, name, i, value, args = {};
			l = items.length;
			for (i = 0; i < l; i++) {
				item = items[i].split("=");
				name = decodeURIComponent(item[0]);
				value = decodeURIComponent(item[1]);
				if (name.length) {
					args[name] = value;
				}
			}
			return args;
		} else {
			return {};
		}
	})();

	$$.parseParas = function (paras) {
		var l = paras.length;
		if (l > 0) {
			var items = paras.split("&");
			var item, name, i, value, args = {};
			l = items.length;
			for (i = 0; i < l; i++) {
				item = items[i].split("=");
				name = decodeURIComponent(item[0]);
				value = decodeURIComponent(item[1]);
				if (name.length) {
					args[name] = value;
				}
			}
			return args;
		} else {
			return {};
		}
	};

	$$.addUrlAgrs = function (url, name, value) {
		if (url.indexOf('?') != -1) {
			return url + '&' + name + '=' + value;
		} else {
			return url + '?' + name + '=' + value;
		}
	};

	/*
	 * 增加类 判定类 移除类
	 */
	$$.hasClass = function (obj, cls) {
		return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	};

	$$.addClass = function (obj, cls) {
		if (!this.hasClass(obj, cls)) {
			obj.className += " " + cls;
		}
		return obj.className;
	};

	$$.removeClass = function (obj, cls) {
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		var reslt = reg.exec(obj.className);
		if (reslt) {
			obj.className = obj.className.replace(reg, reslt[2] || "");
		}
		return obj.className;
	};

	$$.imgloader = function (src, callback, arg) {
		var tempImg = new Image();
		tempImg.src = src;

		if (tempImg.complete) {
			if (typeof callback == "function") {
				callback(src, arg);
			}
		} else {
			tempImg.onload = function () {
				if (typeof callback == "function") {
					callback(src, arg);
				}
			};
		}
	};

	//tsrc
	$$.renderImg = function (imgs) {
		if (imgs.length) {
			var img, src;
			for (var i = 0, l = imgs.length; i < l; i++) {
				img = imgs[i];
				src = img.getAttribute("tsrc");
				if (src) {
					$$.imgloader(src, render, img);
					img.removeAttribute("tsrc");
				}
			}
		} else {
			if (imgs.nodeName && imgs.nodeName.toLocaleLowerCase() == "img") {
				var src = imgs.getAttribute("tsrc");
				if (src) {
					$$.imgloader(src, render, imgs);
					imgs.removeAttribute("tsrc");
				}
			}
		}
		function render(src, img) {
			img.src = src;
		}
	};


	/*
	 * author：画画
	 * 解决问题 映射dom节点的属性或值
	 * @dom dom节点
	 * @datas 数据 数组或者{}
	 * @auto 是否自动填充 布尔值
	 * 
	 * repeater属性标志是否重复填充
	 * ${@name||defaultValue}或者${@name} 书写格式
	 *
	 * 备注：${@repeaterSequence}为重复填充的序列 1开始  
	 * ${@repeaterSequenceChar} A/B/C/D
	 * 大小写敏感
	 *
	 * ${@repeaterFirst} 首 first
	 * ${@repeaterLast} 尾 last
	 *
	 *
	 * 
	 * **********************************************************
	 * 使用说明  
	 * data = {name:pccold};
	 * <div id="test" repeater="true">
	 * 		<p>${@name||画画}</p>
	 * </div>
	 * yaok.dataMapHtml("test", data, true);
	 *
	 * nullText 若数据为空自动填充的内容
	 *
	 * **********************************************************
	 */


	/*
	 * author：画画
	 * 解决问题 映射dom节点的属性或值
	 * @dom dom节点
	 * @datas 数据 数组或者{}
	 * @auto 是否自动填充 布尔值
	 * 
	 * repeat属性标志是否重复填充
	 * ${@name||defaultValue}或者${@name} 书写格式
	 *
	 * 备注：${@repeaterSequence}为重复填充的序列 1开始  
	 * ${@repeaterSequenceChar} A/B/C/D
	 * 大小写敏感
	 *
	 * ${@repeaterFirst} 首 first
	 * ${@repeaterLast} 尾 last
	 *
	 *
	 * 
	 * **********************************************************
	 * 使用说明  
	 * data = {name:pccold};
	 * <div id="test" repeater="true">
	 * 		<p>${@name||画画}</p>
	 * </div>
	 * yaok.dataMapHtml("test", data, true);
	 *
	 * nullText 若数据为空自动填充的内容
	 *
	 * **********************************************************
	 */

	$$.dataMapHtml = function (dom, datas, auto, nullText) {
		var result, template;

		dom = $(dom);
		template = dom.template;//读取模板
		if (!template) {
			template = dom.template = dom.innerHTML.replace(/mysrc/gi, "src");
		}

		result = $$.dataMapTemplate(template, datas) || nullText || "";
		if (auto) {
			dom.innerHTML = result;
			dom.style.visibility = "visible";
		}
		return result;
	};

	/*
	 * 渲染string 和data
	 */
	$$.dataMapTemplate = function (tplt, datas) {
		var result = "";
		if (!datas){datas = {};} //防止传入空对象引起异常

		if (datas && typeof datas != "string" && (datas.length > 0 && datas[datas.length - 1]) ){
			var l = datas.length, obj;
			for (var i = 0; i < l; i++){
				obj = datas[i];
				obj.repeaterSequence = (i + 1);
				obj.repeaterSequenceChar = String.fromCharCode(i + 65);

				if (i == 0){
					obj.repeaterFirst = "first";
				}

				if (i + 1 == l){
					obj.repeaterLast = "last";
				}
				result += $$.dataMapTemplate(tplt, obj);
			}
		}else{
			result = ctrlTemplate(tplt, datas);
		}
		return result;

		function ctrlTemplate(html, obj) {
			//渲染html
			var patt , v, str, start, attr, defaultValue, result;

			/*
			 * 去除未匹配的值
			 * 匹配任意 \$\{@[^\$\{@]*}
			 *
			 * exec: lastIndex
			 * 未找到 null
			 * 或者 []
			 */
			patt  = new RegExp("\\$\\{@[^\\$\\{@\\}]*}{1}", "g");
			result = html;

			str = patt.exec(html);
			while(str !== null){
				str = str[0];
				start = str.indexOf("||") + 2;
				defaultValue = "";

				if (start > 3){
					attr = str.substring(3, start - 2);
					defaultValue =  str.substring(start, str.length - 1);
				}else{
					attr = str.substring(3, str.length - 1);
				}

				v = $$.getValueByKeys(obj, attr);
				if (v === undefined){
					v = defaultValue;
				}

				result = result.replace(str, v);
				str = patt.exec(html);
			}

			return result;
		}

	};
	/*
	 * 获取值通过键值 例如a.b.c
	 */
	$$.getValueByKeys = function (data, keys) {
		if (typeof data == "object" && keys) {
			var arry = keys.split("."), result = data;
			for (var i = 0, l = arry.length; i < l; i++) {
				result = result[arry[i]];
				if (!result) {
					break;
				}
			}
			return result;
		}else{
			return data;
		}

	};
	/*
	 * mask
	 * 弹出的
	 * 可设置zIndex
	 */
	$$.masker = {
		dom: $e("div", "mask-container", ""),
		mask: function () {
			var back = $$.masker.dom;
			if (!back.parentNode) {
				doc.body.appendChild(back);
			}
			if ($s(back).display == "none") {
				back.style.display = "block";
			} else {
				jQuery(back).animate({
					opacity: 0.5
				}, 200, function () {
					back.style.display = "none";
				});
			}
		},
		hideMask: function () {
			var back = $$.masker.dom;
			if (!back.parentNode) {
				doc.body.appendChild(back);
			}
			jQuery(back).animate({
				opacity: 0.5
			}, 200, function () {
				back.style.display = "none";
			});
		},
		showMask: function () {
			var back = $$.masker.dom;
			back.style.height = Math.max(document.documentElement.scrollHeight, $$.getPageSize().pageHeight) + "px";
			if (!back.parentNode && back != back.parentNode) {
				doc.body.appendChild(back);
			}
			$$.masker.dom.style.display = "block";
		}
	}

	/*
	 * element 遮罩的父级元素
	 * 加载中描述
	 */
	$$.loadingDataAnimal = function () {
		//加载层
		return layer.load(2);
	};
	$$.removeLoadingAnimal = function (index) {
		if (index === undefined) {
			layer.closeAll('loading');
		} else {
			layer.close(index);
		}
	};

	/*
	 * type
	 * title
	 * msg
	 * ok
	 * cancel
	 * close
	 * btn ['按钮一', '按钮二', '按钮三']
	 */
	$$.message = function (config) {
		if (!config){
			return;
		}

		if ((!config.btn && config.cancel) || config.type == "confirm"){
			config.btn = [language.getLangDesc("确定"), language.getLangDesc("取消")];
		}

        if (config.btn && config.btn[1] && typeof config.cancel == "function"){
            config.btn2 = config.cancel;
        }

		if (!config.btn){
			config.btn = [language.getLangDesc("确定")];
		}

		//关闭弹框输出的消息
		if (config.close){
			config.cancel = config.close;
			delete config.close;
		}else{
			config.cancel = undefined;
		}

		if (config.ok){
			$$.message.config = config;
			config.yes = function(index){
				var ok = $$.message.config.ok;
				delete $$.message.config;
				if (typeof ok == "function"){
					ok();
				}
				layer.close(index);
			};
		}

		config.type = config.type || "info";
		config.content = config.msg || "";

		config.title = config.title || language.getLangDesc("提示");
		
		config.btnAlign = "c";

		config.move = ".layui-layer-title";

		config.skin = "yk-msg-contianer";
        if (config.content.length < 20){
            config.skin += " yk-msg-few";
        }

		config.content = getIcon(config.type) + config.content;

		layer.open(config);

		function getIcon(type) {
			switch (type){
				case "info":
					return "<span class='icon-con'><i class='fa-exclamation-circle'></i></span>";

				case "error":
					return "<span class='icon-con'><i class='fa-remove-sign'></i></span>";

				case "confirm":
					return "<span class='icon-con'><i class='fa-question-circle-o'></i></span>";

				case "success":
					return "<span class='icon-con'><i class='fa-check-circle'></i></span>";

			}
		}
	};

	/*
	 * console
	 */
	$$.console = function (message) {
		var div = $$.messageDom = $$.messageDom || $$.$e("div", "log-message", "");
		div.innerHTML = message;
		if (!document.body) {
			setTimeout(function () {
				$$.console(message);
			}, 100);
		} else {
			document.body.appendChild(div);
		}
	};

	/*
	 * 检查是否为
	 * HTMLElement对象
	 */
	$$.checkIsDom = function (obj) {
		//排除window document document.documentElement特殊对象
		if (obj == doc || obj == window) {
			return true;
		}
		return ( typeof HTMLElement === 'function' ) ? (obj instanceof HTMLElement) : (obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string');
	}

	//返回空的object对象防止报错
	$$.localStorage = (function (w) {
		if (w.localStorage) {
			return w.localStorage;
		} else {
			return {};
		}
	})(w);
	$$.removeLocalStorage = function (key) {
		if (w.localStorage) {
			$$.localStorage.removeItem(key);
			return true;
		} else {
			return false;
		}
	};
	$$.setLocalStorage = function (key, value) {
		if (w.localStorage) {
			if (typeof value != "object") {
				$$.localStorage.setItem(key, value);
			} else {
				$$.localStorage.setItem(key, JSON.stringify(value));
			}
			return true;
		} else {
			return false;
		}
	};
	$$.getLocalStorage = function (key) {
		if (w.localStorage) {
			return $$.localStorage.getItem(key);
		}
	};

	/*
	 *
	 */
	$$.addCSS = function (cssText) {
		var style = document.createElement('style');  //创建一个style元素
		var head = document.head || document.getElementsByTagName('head')[0]; //获取head元素
		style.type = 'text/css'; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用

		if (style.styleSheet) { //IE
			var func = function () {
				try { //防止IE中stylesheet数量超过限制而发生错误
					style.styleSheet.cssText = cssText;
				} catch (e) {

				}
			}

			//如果当前styleSheet还不能用，则放到异步中则行
			if (style.styleSheet.disabled) {
				setTimeout(func, 10);
			} else {
				func();
			}

		} else {

			//w3c浏览器中只要创建文本节点插入到style元素中就行了
			var textNode = document.createTextNode(cssText);
			style.appendChild(textNode);
		}
		head.appendChild(style); //把创建的style元素插入到head中
	};

	$$.getTimeFormat = function (t, seprator) {
		var s = "";
		//t = t % 3600;
		s += getS(Math.floor(t / 60));
		s += (seprator || ":") + getS(Math.floor(t % 60));
		return s;

		function getS(v) {
			return (v > 9) ? (v + "") : ("0" + v);
		}
	};

	$$.getCookie = function (key) {
		if (document.cookie.length > 0) {
			var start = document.cookie.indexOf(key + "=");
			var end = null;
			if (start != -1) {
				start = start + key.length + 1;
				end = document.cookie.indexOf(";", start);
				if (end == -1) {
					end = document.cookie.length;
				}
				return unescape(document.cookie.substring(start, end));
			}
		}
		return ""
	};

	$$.setCookie = function (key, value, expiredays, path) {
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + expiredays);
		path = path || "/";
		document.cookie = key + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=" + path;
	};

	$$.getRandomStr = function (len) {
		len = len || 32;
		var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
		/****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
		var maxPos = $chars.length;
		var pwd = '';
		for (var i = 0; i < len; i++) {
			pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
		}
		return pwd;
	};

	//resize时候更新尺寸 resetSize
	var resizeArray = new Array();
	$$.registerResize = function (dom) {
		resizeArray.push(dom);
		return dom;
	};
	$$.registerResize($$.masker.dom);
	$$.resetComponentsSize = function () {
		var pageSize = $$.getPageSize();
		var dom, func;
		for (var i = 0, l = resizeArray.length; i < l; i++) {
			dom = resizeArray[i];
			if (dom.ifResize) {
				func = dom.resetSize;
				if (func && typeof func == "function") {
					func(dom, pageSize);
				} else {
					dom.style.width = pageSize.pageWidth + "px";
					dom.style.height = pageSize.pageHeight + "px";
				}
			}
		}
	};
	$$.bind(w, "resize", $$.resetComponentsSize);

	/*
	 * ajax 基于jquery
	 *
	 */
	$$.ajax = function (config) {
		var func = config.success;
		var error = config.error;

		if (!config) {
			return;
		}

		if (config.mask) {
			$$.loadingDataAnimal(config.mask.dom || doc.body, config.mask.info || "");
		}

		config.type = config.type || "post";

		config.url = config.url.replace("{bathPath}", basePath);

		config.data = config.data || {};

		config.data.device = yaok.client.device;

		config.dataType = config.dataType || "json";

		config.contentType = config.contentType || 'application/x-www-form-urlencoded; charset=UTF-8';

		config.error = function (res) {
			if (config.mask) {
				$$.removeLoadingAnimal();
			}
			if (typeof error == "function") {
				func(res);
			}
			$$.ctrlAjaxError(res);
		};

		config.success = function (res) {

			if (config.mask) {
				$$.removeLoadingAnimal();
			}
			if (typeof func == "function") {
				func(res);
			}
		};

		jQuery.ajax(config);
	};

	$$.ctrlAjaxError = function (res) {
		//
		$$.message({
			msg: language.getLangDesc("服务器繁忙，请联系平台客服！"),
			type: "error"
		})
	};

	$$.getDataByAttr = function (datas, attr, value, notEqual, ifRandom) {
		var l = datas.length;
		var data, reslt = [];
		for (var i = 0; i < l; i++) {
			data = datas[i];

			if (notEqual) {
				if (data[attr] != value) {
					reslt.push(data);
				}
			} else {
				if (data[attr] == value) {
					reslt.push(data);
				}
			}

		}

		if (ifRandom) {
			return yaok.getRandomDatas(reslt);
		} else {
			return reslt;
		}
	};

	$$.getRandomDatas = function (datas) {
		var kindDatas = [];
		var l = datas.length;
		var data, mid, lmid = -1, i, last;

		//分类
		for (i = 0; i < l; i++) {
			data = datas[i];
			mid = data.material_id;

			//根据材料id 依赖于材料题连续的特性
			if (mid) {
				if (last && lmid == mid) {
					last.num++;
				} else {
					last = {
						start: i,
						num: 1
					};
					kindDatas.push(last);
				}
			} else {
				last = {
					start: i,
					num: 1
				};
				kindDatas.push(last);
			}
			lmid = mid;
		}


		//打乱分好类的数组
		var randomKindDatas = [];
		i = 0;
		l = kindDatas.length;
		while (i < l) {
			randomKindDatas.push(kindDatas.splice(Math.floor(Math.random() * (l - i)), 1)[0]);
			i++;
		}

		//读取分类数据 再读取数据
		var rslt = [];
		l = randomKindDatas.length;
		for (i = 0; i < l; i++) {
			data = randomKindDatas[i];
			for (var j = 0; j < data.num; j++) {
				rslt.push(datas[data.start + j]);
			}
		}

		return rslt;
	};

	$$.loadJs = function (url, sign, callback) {
		$$.loadFile(url, "js");

		//标志回调
		checkLoadComplete();

		function checkLoadComplete() {
			if (window[sign]) {
				if (typeof callback == "function") {
					callback();
				}
			} else {
				setTimeout(arguments.callee, 10);
			}
		}
	};

	$$.loadFile = function (path, type, sync) {
		type = type || (path.indexOf(".css") > -1 ? "css" : "js");

		if (!sync) {
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
	};

	var _$id$_ = Math.floor(Math.random() * 100000000000 + 100000000000);
	$$.createId = function () {
		return ++_$id$_;
	};

	$$.addIdToArray = function (list, sign) {
		var item, sign = sign || "$id";
		if (list instanceof Array) {
			for (var i = 0, l = list.length; i < l; i++) {
				item = list[i];
				if (!item[sign]) {
					item[sign] = $$.createId();
				}
			}
		} else {
			if (typeof list == "object") {
				if (!list[sign]) {
					list[sign] = $$.createId();
				}
			}
		}
		return list;
	};

	$$.getFieldValues = function (data, field, spaceSign) {
		var l = data.length;
		if (l < 1) {
			return;
		}

		var result = [];
		for (var i = 0; i < l; i++) {
			result.push(data[i][field]);
		}

		if (spaceSign) {
			return result.join(spaceSign);
		} else {
			return result;
		}
	};

	$$.parseFormPara = function (form, params) {
		params = params || {};

		var a = jQuery(form).serializeArray();
		jQuery.each(a, function () {
			if (params[this.name] !== undefined) {
				if (!params[this.name].push) {
					params[this.name] = [params[this.name]];
				}
				params[this.name].push(this.value || '');
			} else {
				params[this.name] = this.value || '';
			}
		});
		return params;
	};

	$$.deepCopy = function (data) {
		if (typeof data != "object") {
			return data;
		} else {
			var result;
			if (data instanceof Array) {
				result = new Array();
			} else {
				result = new Object();
			}

			for (var key in data) {
				result[key] = arguments.callee(data[key]);
			}
			return result;
		}
	};

	//预览图片 预留
	$$.fullViewImg = function (img) {
		var imgViewer = arguments.callee.imgViewer;
		if (!imgViewer){
			imgViewer = arguments.callee.imgViewer = document.body.appendChild($$.$e("img"));
			imgViewer.style.display = "none";
			jQuery(imgViewer).viewer({
				inline: false, //
				fullscreen: true,
				keyboard: true,
				movable: true,
				navbar: false,
				toolbar: false,
				zoomable: true,
				rotatable:false, //旋转
				scalable:false
			});
		}

		imgViewer.src = img.src || img.getAttribute("src");
		jQuery(imgViewer).viewer("show");
	};

	function onMouseWheel(event, delta) {
		var evt = event.originalEvent, direct;
		direct = evt.detail ? (evt.detail / 3) : (evt.wheelDelta / -120);
		$(".view-img-w .layui-layer-content")[0].scrollTop += direct * 20;
		if (evt.cancelBubble) {
			evt.cancelBubble = true;
		}
		evt.preventDefault();
		evt.stopPropagation();
	}

	$$.plugin = {
		$: function (id) {
			return $$.plugin.all[id];
		}, all:{

		}
	};

	$$.slide = function (e) {
		e = e || window.event;
		var tgr = e.target;
		tgr = yaok.getParentNode(tgr, ".part-header");
		if (tgr.getAttribute("status-content") == "hidden"){
			jQuery(tgr).attr("status-content", "visibility");
			showPart(tgr);
		}else{
			jQuery(tgr).attr("status-content", "hidden");
			hidePart(tgr);
		}
		
		function hidePart(p) {
			//jQuery(p).find(".icon-con").html('<i class="fa-caret-down"></i>');
			jQuery(p.parentNode.children[1]).slideUp(200);
		}
		
		function showPart(p) {
			//jQuery(p).find(".icon-con").html('<i class="fa-caret-up"></i>');
			jQuery(p.parentNode.children[1]).slideDown(200);
		}
	};

	$$.open = function(url, index, text) {
		if (window.parent.mainTab){
			window.parent.mainTab.open(url, index, text);
		}else{
			location.href = url;
		}
	};

	$$.close = function(url, redirect, title) {
		if (window.parent.mainTab){
			window.parent.mainTab.close(url, redirect, title);
		}else{
			window.close();
		}
	};

	$$.formatMoney = function(v) {
		if (v){
			var n = parseFloat(v).toFixed(2);
			var re = /(\d{1,3})(?=(\d{3})+(?:\.))/g;
			return n.replace(re, "$1,");
		}else{
			return "";
		}
	};

	//返利
	$$.rebateFormatter = function(v) {
		if("" == v || null == v || 0 == parseInt(v)){
			return " ";
		}
		if(v < 0 || v > 100) return " ";
		return parseInt(v) + "%";
	};
    //折扣
    $$.discountFormatter = function(v) {
        if("" == v || null == v || 0 == parseInt(v)){
            return " ";
        }
        if(v < 0 || v > 100) return " ";
        return 100 - parseInt(v) + "%";
    };
    //折扣不带%
    $$.discountFormat = function(v) {
        if("" == v || null == v || 0 == parseInt(v)){
            return "";
        }
        if(v < 0 || v > 100) return "";
        return 100 - parseInt(v);
    };
	//金额 格式化
	$$.moneyFormatter = function(s) {
		s = parseFloat((s + "").replace(/[^\d\.-]/g, ""));
		s =  (Math.floor(s*100)/100).toFixed(2)+"";

		var l = s.split(".")[0].split("").reverse(),
			r = s.split(".")[1],
		    t = "";
		for(var i = 0; i < l.length; i ++ )
		{
			t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
		}
		return t.split("").reverse().join("") + "." + r;
	};
	//东八区时间
	$$.formatChinaDate = function (date, fmt, c) {
		if (!date){
			return "";
		}
		if (typeof date != "object"){
			date += 3600000*8;
			date = new Date(date);
		}

		fmt = fmt || "yyyy-MM-dd hh:mm";

		var o = {
			"M+": date.getUTCMonth() + 1, //月份
			"d+": date.getUTCDate(), //日
			"h+": date.getUTCHours(), //小时
			"m+": date.getUTCMinutes(), //分
			"s+": date.getUTCSeconds(), //秒
			"q+": Math.floor((date.getUTCMonth() + 3) / 3), //季度
			"S": date.getUTCMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getUTCFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));

		if (c && c == "chi") {
			var lastDays = $$.lastDays;
			var d;
			for (var i = 0, l = lastDays.length; i < l; i++) {
				d = lastDays[i].d;
				if (d.getUTCFullYear() == date.getUTCFullYear() && d.getUTCMonth() == date.getUTCMonth() && d.getUTCDate() == date.getUTCDate()) {
					fmt = lastDays[i].name + fmt.substr(10);
					break;
				}
			}
		}
		return fmt;
	};
	$$.combine = function (target, source) {
		target = target || {};
		for (var key in source){
			target[key] = source[key];
		}
		return target;
	};

	$$.center = function (dom) {
		var w = $$.getPageSize();
		dom.style.left = (w.pageWidth - dom.offsetWidth) / 2 + "px";
		dom.style.top = (w.pageHeight - dom.offsetHeight) / 2 + "px";
	};

	$$.transformCamelCase = function(str){
		return str.replace(/-(\w)/g, function(){
			return arguments[1].toUpperCase();
		});
	};

	$$.stopPropagation = function (e) {
		e = e || window.event;
		if(e && e.stopPropagation){
			e.stopPropagation();
		} else{
			e.cancelBubble = true;
		}
	};

	$$.setPageView =function(urlKeyWords){
		if (urlKeyWords==null||urlKeyWords== undefined){
			urlKeyWords = "view";
		}
		var uri = location.href;
		if (uri.indexOf(urlKeyWords)!=-1){
			yaok.masker.showMask();
			var inputs = document.getElementsByTagName('input');
			if (!!inputs){
				for (var i=0;i<inputs.length;i++){
					inputs[i].setAttribute("disabled","disabled");
				}
			}

			var buttons = document.getElementsByTagName('button');
			if (!!buttons){
				for (var i=0;i<buttons.length;i++){
					buttons[i].style.display="none";
				}
			}
			//$(document).find("input,button").attr('disabled','true');
			//$(document).find("button").hide();
		}
	};

	$$.isEmpty = function(idString){
		var ds = yaok.plugin.$(idString),
			error;
		ds.check();
		error = ds.checkResult;
		if (error){
			return;
		}
	};

	/* 校验对象是否为空 支持连续校验 */
	$$.validateParam = function(obj, errorMessage, validateNum){
		if (!validateNum){
			if("" == obj || undefined == obj){
				parent.layer.msg(language.getLangDesc(errorMessage));
				validateNum = 1;
			}
		}
		return validateNum;
	};

	$$.rebuildDataByKeys = function (data, keys){
		if (!data){return;}
		keys = keys.split(",");
		var o, temp, key, result = [], h, k = keys.length;

		for (var i = 0, l = data.length; i < l; i++) {
			o = data[i];
			temp = {};
			result.push(temp);

			for (h = 0; h < k; h++) {
				key = keys[h];
				temp[key] = o[key];
			}
		}
		return result;
	};

	//防止xss攻击的手段之一
	$$.removeHtmlTag = function () {
        return tab.replace(/<[^<>]+?>/g,'');//删除所有HTML标签
    };

	// 判空
	$$.validateIsNull = function (data) {
		return data == null || data == undefined || "" == data;
	};

	// 序号
	$$.getIndex = function (v, c, i) {
		return i+1;
	};
	
	//新二维码图片显示
	$$.newEwmFormat = function (value,row) {
		var widthTmp = 300;
		if(row.width){
			widthTmp = row.width;
		}
		var logoTmp = "http://m1.yaok.com/static/img/common/logo-s.png";
		if(row.logo){
			logoTmp = row.logo;
		}
		var url=basePath + "ewm/getQRCode?width="+widthTmp+"&iconUrl="+encodeURIComponent(logoTmp)+"&content=" ;
		if(row.ewmId){
			var ewmDomainUrl=document.getElementById("ewmDomain").value;
			url=url+ewmDomainUrl+"/"+row.ewmId;
		}else{
			url="";
		}
	  return '<div class="img-view-o-con"><img onclick="yaok.fullViewImg(this);" class="img-view-o" style="height: 60px;" src="' + url+ '"/>';
	};

	// 图片格式化
	$$.imgFormat = function (value, row) {
		var obj = value ;
		if (yaok.validateIsNull(obj)){
			return "";
		}
		return '<div class="img-view-o-con"><img onclick="yaok.fullViewImg(this);" class="img-view-o" style="height: 60px;" src="' + obj[0].path+ '"/>';
	};

	/*** 非空格式化 */
	$$.nullHandleFormatter = function (v, c, i) {
		if(undefined == v || "" == v){
			return "-";
		}
		return v;
	};

})(window === undefined ? this : window);
