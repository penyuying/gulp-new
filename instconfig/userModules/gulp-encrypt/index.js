var modeEcb=require("./des_md5/mode-ecb"),//加密
    base64=require("./base64/jbase64"),
    unicode=require("./unicode/unicode"),
    sha=require("./sha/sha1"),
    gutil = require('gulp-util'),//异常处理
    through = require('through2'),
    fs = require('fs'),//文件读写
    path = require('path'); //获取路径
    
    module.exports = encrypt;
    module.exports.encrypt=_repeat;
    function encryptText(text,type,options){
        var res=text;
        if(!type){
            return res;
        }
        switch (type.toLowerCase()) {
            case "unicode":
                res=unicode.toUnicode(text);
                break;
            case "ununicode":
                res=unicode.toGB2312(text);
                break;
            case "unicode2":
                res=unicode.toUnicode(text,"");
                break;
            case "ununicode2":
                res=unicode.toGB2312(text,2);
                break;
            case "des":
                res=modeEcb.encryptByDES(text, options.password||"des");
                break;
            case "undes":
                res=modeEcb.decryptByDES(text, options.password||"des");
                break;
            case "base64":
                res=base64.encode(text);
                break;
            case "unbase64":
                res=base64.decode(text);
                break;
            case "md5":
                res=modeEcb.MD5(text,options.bit||16);
                break;
            case "hex_md5":
                res=modeEcb.MD5(text,32);
                break;
            case "sha":
                res=sha.sha1(text);
                break;
            case "hex_sha1":
            case "b64_sha1":
            case "str_sha1":
            case "hex_hmac_sha1":
            case "b64_hmac_sha1":
            case "str_hmac_sha1":
                res=sha.sha1(text,type.toLowerCase());
                break;
            default:
                break;
        }
        return res;
    }
    function _repeat(text,options,extname){
        var res=text,
            _typeArr=[],
            _type="";
        if(!text){
            return res;
        }
        if(!options.type){
            options.type="des";
        }
        _typeArr=options.type.split(",");
        if(_typeArr && _typeArr.length>0){
            for(var i=0,_length=_typeArr.length;i<_length;i++){
                _type=_typeArr[i];
				_type=_type.toLowerCase();
                if(_type){
					if(!options.unType|| extname&& options.unType && options.unType.toLowerCase()==extname.toLowerCase() && (_type=="ununicode"||_type=="ununicode2"||_type=="undes"||_type=="unbase64")){
						res=encryptText(res,_type,options);
					}
                }
            }
        }
        
        return res;
    }

    function encrypt(options){
        options=extend({
            type:"des",//加解加密类型多种类型用(,)分隔
            bit:32,//md5位数
			unType:"",//解密的扩展名
            password:"des",//des加密密码
            extname:""//文件扩展名
        }, options);
		options.unType=options.unType && "."+options.unType||""
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
            var _filepath=file.path,
                _srcPath="",
                _dir=path.dirname(_filepath),
                _extname=path.extname(_filepath),
                _fileName=path.basename(_filepath, _extname||""),
				_filecontent=file.contents.toString(),
                _content=_repeat(_filecontent,options,_extname);
            
            if(options.extname && !options.unType|| options.extname && _extname&& options.unType && options.unType.toLowerCase()==_extname.toLowerCase()){
                _srcPath = path.join(_dir || "", _fileName+"."+options.extname);
                file.path=_srcPath;
                // console.log(_extname);
                file.contents = new Buffer(_content);
            }
            // 下面这两句基本是标配啦，可以参考下 through2 的API
            this.push(file);
            cb();
        });

        return ret;
    }

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