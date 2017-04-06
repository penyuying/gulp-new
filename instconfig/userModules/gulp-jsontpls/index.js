var gutil = require('gulp-util'),//异常处理
    through = require('through2'),
    buildHtmlFile=require("./src/JsonBuildHtml.js"); //获取路径


/**
	*合并对象
    *@global
	*@function addObj
	*@param {Object} d 默认的对象
	*@param {Object} o 要合并的对象
	*@return {Object} 返回修改值后的默认对象
	*/
function extend(defaultObj, addobj) { //合并对象
    if (!addobj) {
        return defaultObj;
    }
    defaultObj = defaultObj || {};
    for (var item in addobj) {
        if (addobj[item]) {
            defaultObj[item] = addobj[item];
        }
    }
    return defaultObj;
}




function replaceMod(options){
    options = extend({ tplsPath: "" }, options);
    
    var ret = through.obj(function (file, enc, cb) {
        // 如果文件为空，不做任何操作，转入下一个操作，即下一个 .pipe()

        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        // 插件不支持对 Stream 对直接操作，跑出异常
        if (file.isStream()) {
            //this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            this.push(file);
            return cb();
        }

        // 下面这两句基本是标配啦，可以参考下 through2 的API

        buildHtmlFile.buildFile(options,this, file, cb);

        cb();
    });

    return ret;
}

 
module.exports = replaceMod;