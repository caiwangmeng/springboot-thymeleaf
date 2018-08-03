(function(config){
	var html = document.documentElement,
		paths = config.paths,
		version = config.version,
		prefix = config.prefix,
		file,
		key,
		url,
		temp,
		ifNoNeedSystemJs;

	ifNoNeedSystemJs = document.documentElement.getAttribute("no-sys-js");
	ifNoNeedSystemJs =  (ifNoNeedSystemJs !== undefined && ifNoNeedSystemJs !== null);

	for (key in paths){
		file = paths[key];
		url = file.url;
		if (url.indexOf(".js") > -1 && !ifNoNeedSystemJs){
			if (url.indexOf("http:") > -1){
				loadFile(url, file.type);
			}else{
				loadFile(basePath + prefix + url + "?" + "version=" + version, file.type);
			}
		}
	}

	//检测是否需要额外插件
	var needPlugins = document.documentElement.getAttribute("need-plugin");
	if (needPlugins){
		needPlugins = needPlugins.split(",");
		var plugin, i, j, l, m;
		for (i = 0, l = needPlugins.length; i < l; i++) {
			plugin = baseConfig.plugins[needPlugins[i]];
			for (j = 0, m = plugin.length; j < m; j++) {
				loadFile(getPath(plugin[j]));
			}
		}
	}

	//检测是否需要pagejs
	temp = html.getAttribute("page-js");
	if (temp !== undefined && temp !== null){
		temp = temp || getPageDefault("js");
		loadFile(temp, "js");
	}


})(baseConfig);







