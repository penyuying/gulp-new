var fs = require('fs'),
	path = require('path');
var parentDir = path.dirname(module.parent.filename);
var exec = require('child_process').exec;
var isData={};
['String', 'Function', 'Array', 'Number', 'RegExp', 'Object', 'Date', 'Window'].map(function (v) {//判断数据类型
        isData['is' + v] = function (obj) {
            if (v == "Window") {
                return obj != null && obj == obj.window;
            } else {
                return Object.prototype.toString.apply(obj) == '[object ' + v + ']';
            }
        };
    });
function unique(arr) {
	/// <summary>
	/// 去除数组重复项
	/// </summary>
	/// <param name="arr">数组</param>
	/// <returns type="Array">返回处理好的数组</returns>
	var result = [], isRepeated;
	for (var i = 0, len = arr.length; i < len; i++) {
		isRepeated = false;
		for (var j = 0, len1 = result.length; j < len1; j++) {
			if (arr[i] == result[j]) {
				isRepeated = true;
				break;
			}
		}
		if (!isRepeated) {
			result.push(arr[i]);
		}
	}
	return result;
}
function getPluginKey(option,deft){
	//读取插件所在的key
	var ret=[];
	if(isData.isArray(option) || isData.isObject(option)){
		for(var i in option){
			if(isData.isString(option[i])){
				ret.push(option[i]);
			}else{
				ret=ret.concat(getPluginKey(option[i],[]));
			}
		}
	}else if(isData.isString(option)){
		ret.push(option);
	}
	if(ret.length==0){
		ret=deft;
	}
	return unique(ret);
}
function getJson(dir) {//取JSON文件对象
	/// <summary>
	/// 取JSON文件对象
	/// </summary>
	/// <param name="dir">JSON文件路径</param>
	/// <returns type="obj">返回对象</returns>
	var folder_exists = fs.existsSync(dir);
	var _pkg = {};
	if (folder_exists) {
		var data = fs.readFileSync(dir, 'utf-8');
		try {
			_pkg=JSON.parse(data);
		} catch (e) {
			console.log(dir+"格式转换错误：" + e.message);
			_pkg = {};
		}
	}
	return _pkg;
}
function getPluginNameArr(configJson,pluginKey){
	var ret=[];
	if(!configJson){
		return ret;
	}
	pluginKey.map(function(v,k){
		var obj=configJson[v];
		if(isData.isArray(obj)){
			ret=ret.concat(obj)
		}else if(isData.isObject(obj)){
			for(var i in obj){
				ret.push(i);
			}
		}else if(isData.isString(obj)){
			ret.push(obj);
		}
	});
	return unique(ret);
}
function getFolders(dir) {
	/// <summary>
	/// 取得目录下子目录名
	/// </summary>
	/// <param name="dir">目录</param>
	/// <returns type="array">子目录名数组</returns>
	return fs.readdirSync(dir)
		.filter(function (file) {
			var dirName=fs.statSync(path.join(dir, file)).isDirectory()
			if(!/^[\.]/ig.test(file)){
				return dirName;
			}else{
				return false;
			}
		});
}
module.exports = function(options) {
	options = options || {};
	var obj={};
	var configFile=options.file||parentDir+"/package.json";
	var dirName=getFolders(parentDir+"/node_modules/")||[];//取得modules目录下所有子文件目录名
	configFile=configFile&&path.normalize(configFile).replace(/\\/g,"/")||"";
	var pluginKey=getPluginKey(options.pluginArray,['dependencies', 'devDependencies', 'peerDependencies','userPlugin']);
	var configJson=getJson(configFile)
	if(options.configObj){
		configJson=options.configObj;
	}
	var pluginNameArr=getPluginNameArr(configJson,pluginKey);
	pluginNameArr=pluginNameArr.concat(dirName);//合并和package.json文件件里取来的模块名
    pluginNameArr=unique(pluginNameArr);//去除重复
	pluginNameArr.map(function(name,k){
		if(name!=="remove-plugin"){
			try {
				exec('call npm uninstall --save-dev '+name,function (error, stdout, stderr) {
					  if (error !== null) {
						//console.log('exec error: ' + error);
					  }
					 
				  });
			} catch (e) {}
		}
	});
	return obj
};
