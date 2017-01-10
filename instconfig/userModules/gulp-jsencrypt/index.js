var evalcode=require("./evalcode/evalcode"),//加解密方法
    gutil = require('gulp-util'),//异常处理
    through = require('through2'),
    fs = require('fs'),//文件读写
    path = require('path'); //获取路径

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
    defaultObj = defaultObj||{};
    for (var item in addobj) {
        if(addobj[item]){
            defaultObj[item]=addobj[item];
        }
    }
    return defaultObj;
}

function _encrypt(text,options) {
    if(!text){
        return text;
    }
    var res="",
        _type=options && options.type;
        _type=_type+"";

    switch (_type.toLowerCase()) {
        case "decode":
            res=evalcode.decode(text);
            break;
        case "evalcode":
            res=evalcode.evalcode(text,options.codeType);
            break;
        default:
            res=evalcode.encode(text);
            break;
    }
    
    return res;
}

module.exports = jsEncrypt;
module.exports.jsEncrypt=_encrypt;
module.exports.beautify=evalcode.beautify;
function jsEncrypt(options){
    options=extend({
        type:"encode",
        codeType:"js"//代码类型
    }, options);
    
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

        var content=_encrypt(file.contents.toString(),options);
        
        file.contents = new Buffer(content);
        // 下面这两句基本是标配啦，可以参考下 through2 的API
        this.push(file);
        cb();
    });

    return ret;
}