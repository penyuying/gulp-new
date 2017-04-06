var gutil = require('gulp-util'),//异常处理
    fs = require('fs'),//文件读写
    path = require('path'); //获取路径


/**
     * 替换字符串里面的变量
     * @global
     * @function replaceItem
     * @param   {string} item    要被替换的字符串
     * @param   {String} tempPkg 从对象中查找内容
     * @param   {RegExp} reg     正则表达式
     * @returns {string} 返回替换好后的字符串
     * @example 
     * var obj={
     *    a:"abcString",
     *    b:"{#a#}  这里第一个"
     * }
     *  
     * replaceItem(obj["b"], obj, /\{\#([^}]+)\#\}/ig);
     * 
     * //返回:
     * {
     *    a:"abcString",
     *    b:"abcString  这里第一个"
     * }
     * 
     *  @example 
     *  var obj1={
     *    a:{
     *        c:"adb",
     *        d:"abcString",
     *    },
     *    b:"{#a.c#}  这里第二个"
     * }
     * 
     * replaceItem(obj1["b"], obj1, /\{\#([^}]+)\#\}/ig);
     * 
     * //返回:
     * {
     *    a:{
     *        c:"abc",
     *        d:"abcString",
     *    },
     *    b:"abc 这里第二个"
     * }
     */
function replaceItem(item, tempPkg, reg) {
        if(item){
            item = item.replace(reg, function ($1, $2) {
                var ret = $1, tempObj = tempPkg, $2Arr = $2.split("."), jl = false;
                for (var i = 0; i < $2Arr.length; i++) {
                    if (typeof tempObj[$2Arr[i]] != "undefined") {
                        tempObj = tempObj[$2Arr[i]];
                        jl = true;
                    } else {
                        jl = false;
                        break;
                    }
                }
                if (jl) {
                    //ret=tempObj;
                    ret = replaceItem(tempObj, tempPkg, reg);
                }
                return ret;
            });
        }
        
        return item;
    }
    
    /**
     * 替换对象里面变量
     *@global
     * @function againPkg
     * @param   {Object} pkgObj  要替换的对象
     * @param   {Object} tempPkg 从此对象中取得对应的内容如果为空则默认为pkgObj
     * @return {Object} 返回替换好的对象
     *                          
     * @example 
     * var obj={"a":"fff","b":"{#a#}/eee"};
     * 
     * againPkg(obj);
     * 
     * //返回：
     * {
     *     "a":"fff",
     *     "b":"fff/eee"
     * }
     */
    function againPkg(pkgObj, tempPkg) {
        if (!tempPkg) {
            tempPkg = pkgObj;
        }
        if (pkgObj instanceof Object) {
            for (var key in pkgObj) {
                if (typeof pkgObj[key] == "string") {
                    pkgObj[key] = replaceItem(pkgObj[key], tempPkg, /\{\#([^}]+)\#\}/ig);
                } else {
                    pkgObj[key] = againPkg(pkgObj[key], tempPkg);
                }
            }
        }
        return pkgObj;
    }

var JsonBuildHtml=(function(){

    /**
     * 根据JSON生成HTML文件
     * @class
     */
    function BuildHtml(){

    }

    BuildHtml.prototype = {

        /**
         * 读取磁盘上的文件的文本内容
         * @param {String} src 文件路径
         * @returns {String} 返回文件的文本内容
         */
        _getFileText: function (src) {
            if (!src) {
                return "";
            }
            var _src = path.normalize(src).replace(/\\/g, "/"),
                folder_exists,
                content = "";
            try {
                folder_exists = fs.existsSync(_src);
                if (folder_exists) {
                    content = fs.readFileSync(_src).toString();
                } else {
                    console.log("\x1B[33m引用" + (_src) + "文件不存在\x1B[39m");
                }
            } catch (e) {
                console.log("\x1B[33m读取文件" + _src + "错误：\x1B[39m\x1B[31m" + e.message + "\x1B[39m");
            }
            return content;
        },

        /**
         * 文件内容转成文本
         * @param {Object} file 文件对象
         * @returns {String} 文件内容文本
         */
        _contentToJosn:function(file){
            return file.contents.toString();
        },

        /**
         * JSON文本转换成JSON对象
         * @param {String} data JSON文本数据
         * @return {Object} 返回转换好的对象或空对象 
         */
        _jsonParse:function(data,dir){
            var _pkg={};
            try {
                _pkg = JSON.parse(data);
            } catch (e) {
                console.log("\x1B[33m"+ (dir||"") +"JSON文件格式转换错误：\x1B[39m\x1B[31m" + e.message + "\x1B[39m");
                _pkg = {};
            }
            
            
            try{
                if(_pkg){
                    _pkg=againPkg(_pkg);
                }
            } catch (e){
                console.log("\x1B[33m"+ (dir||"") +"JSON文件引用参数错误：\x1B[39m\x1B[31m" + e.message + "\x1B[39m");
                _pkg = {};
            }
            return _pkg;
        },

        /**
         * 注入文件HTML标题
         * @param {String} tplstxt 需处理的模板文本
         * @param {Object} _fileObj 当前的文件对应的JSON数据
         * @returns {String} 返回处理好的模板文本
         */
        _injectTitle: function (tplstxt, _fileObj) {
            var _tagName = _fileObj && _fileObj.title || "标题";
            if (!tplstxt || !_tagName) {
                return tplstxt;
            }

             var _regExp = new RegExp("(\\s*)\<\!\-\-page-title\-\-\>", "ig");

            tplstxt = tplstxt.replace(_regExp, function (content, spaces) {
                return _tagName || "";
            });
            return tplstxt || "";
        },

        /**
         * 替换视图
         * @param {String} tplstxt 需处理的模板文本
         * @param {Array} _views 视图列表
         * @param {Object} options 插件入口参数
         * @returns {String}  返回处理好的模板文本
         */
        _replaceView: function (tplstxt, _views, options) {
            var _this = this;
                    
            if (!tplstxt || !_views || _views.length<=0) {
                return tplstxt;
            }
            for (var i = 0; i < _views.length; i++) {
                var _view = _views[i];
                if (_view && _view.tagName) {
                    var _regExp = new RegExp("(\\s*)\<\!\-\-view-" + _view.tagName + "\-\-\>", "ig");
                    if (_view.tplsFile) {
                        var _fileDir = options && options.tplsPath || "",
                            _fileTxt = _this._getFileText(_fileDir + _view.tplsFile);

                        tplstxt = tplstxt.replace(_regExp, function (content, spaces) {
                            var _fileTxtArr = _fileTxt && _fileTxt.split("\n"),
                                spaces = spaces && spaces.replace(/^\r\n|^\n/, "");

                            _fileTxtArr = _fileTxtArr.map(function(value, key) {
                                return spaces + value;
                            });
                            return "\r\n" + _fileTxtArr.join("\n");
                        });
                        if (_view.views) {
                            tplstxt = _this._replaceView(tplstxt, _view.views, options);
                        }
                    } else {
                        tplstxt = tplstxt.replace(_regExp, function (content, spaces) {
                            return "";
                        });
                    }

                }
                
            }
            return tplstxt;
        },

        /**
         * 处理公共视图
         * @param {String} tplstxt 需处理的模板文本
         * @param {Object} _json  当前的pageJSON文件的JSON数据
         * @param {Object} options 插件入口参数
         * @returns {String} 返回处理好的模板文本
         */
        _handleCommViews: function (tplstxt, _json, options) {
            var _this = this,
                _views = _json && _json.commViews;

            tplstxt = _this._replaceView(tplstxt, _views, options);
            return tplstxt;
        },

        /**
         * 处理视图
         * @param {String} tplstxt 需处理的模板文本
         * @param {Object} _fileObj  当前的文件对应的JSON数据
         * @param {Object} options 插件入口参数
         * @returns {String} 返回处理好的模板文本
         */
        _handleViews: function (tplstxt, _fileObj, options) {
            var _this = this,
                _views = _fileObj && _fileObj.views;

            tplstxt = _this._replaceView(tplstxt, _views, options);
            return tplstxt;
        },

        /**
         * 替换模块标签
         * @param {String} tplstxt 需处理的模板文本
         * @param {Array} _modules 模块列表
         * @returns {String} 返回处理好的模板文本
         */
        _replaceMod: function (tplstxt, _modules) {
            var _moduleList,
                _regExp,
                _module,
                _tagName;

            if (!tplstxt || !_modules || _modules && _modules.length <= 0) {
                return tplstxt;
            }
            for (var i = 0; i < _modules.length; i++) {
                _module = _modules[i];
                _tagName = _module && _module.tagName;
                
                _moduleList = _module && _module.list;

                if (_tagName) {//模块名称
                    _tagName = _tagName.replace(/^\s|\s$/g, "");
                    _regExp = new RegExp("(\\s*)\<\!\-\-module-" + _tagName + "\-\-\>", "ig");
                }

                //注入的模块存在
                if (_moduleList && _moduleList.length > 0 && _tagName) {
                    tplstxt = tplstxt.replace(_regExp, function (content, spaces) {
                        spaces = spaces && spaces.replace(/^\r\n|^\n/, "");
                        _moduleList = _moduleList.map(function (value, key) {
                            value = spaces + value;
                            return value;
                        });
                        return "\r\n" + _moduleList.join("\r\n") || "";
                    });

                } else {//注入的模块不存在
                    tplstxt = tplstxt.replace(_regExp, function (content, spaces) {
                        return "";
                    });
                }
            }
            return tplstxt;
        },

        /**
         * 注入公共模块
         * @param {String} tplstxt 需处理的模板文本
         * @param {Object} _json 当前的pageJSON文件的JSON数据
         * @returns {String} 返回处理好的模板文本
         */
        _injectCommMod: function (tplstxt, _json) {
            var _this = this,
                _modules = _json && _json.commModules;


            tplstxt = _this._replaceMod(tplstxt, _modules);

            return tplstxt || "";
        },

        /**
         * 注入模块
         * @param {String} tplstxt 需处理的模板文本
         * @param {Object} _fileObj 当前的文件对应的JSON数据
         * @returns {String} 返回处理好的模板文本
         */
        _injectMod: function (tplstxt, _fileObj) {
            var _this = this,
                _modules = _fileObj && _fileObj.modules;


            tplstxt = _this._replaceMod(tplstxt, _modules);
            
            return tplstxt || "";
        },

        /**
         * 处理模板主入口
         * @param {Object} options 插件入口参数
         * @param {Object} _fileObj 当前的文件对应的JSON数据
         * @param {Object} _json 当前的pageJSON文件的JSON数据
         * @returns {String} 返回模板内容文本
         */
        _getContent: function (options, _fileObj, _json) {

            var _this=this,
                _fileDir = options && options.tplsPath||"",
                _tplsFile = _fileObj && _fileObj.tplsFile,
                _contents=[];
                if(_tplsFile){
                    var _tplstxt = _this._getFileText(_fileDir+_tplsFile);
                    if (_tplstxt) {
                        _tplstxt = _this._handleViews(_tplstxt, _fileObj, options);//处理视图
                        _tplstxt = _this._handleCommViews(_tplstxt, _json, options);//处理公共视图
                        _tplstxt = _this._injectTitle(_tplstxt, _fileObj);//注入标题
                        _tplstxt = _this._injectMod(_tplstxt, _fileObj);//注入模块
                        _tplstxt = _this._injectCommMod(_tplstxt, _json);//注入公共模块
                        _contents.push(_tplstxt);
                    }
                }
                

            return _contents.join("\r\n");
        },

        /**
         * 生成HTML文件
         * @param {Object} options 插件入口参数
         * @param {this} thisObj 当前处理流对象
         * @param {Object} file 当前处理流文件
         * @returns {this} 返回当前处理流对象
         */
        buildFile: function (options,thisObj, file) {
            var _this=this,
                _filepath=file.path,
                _dir=path.dirname(_filepath),
                _relative=file.relative,
                _json = _this._jsonParse(_this._contentToJosn(file),_filepath||""),
                _pageList = _json && _json.pageList,
                _contents="",
                _srcPath="";

            if (_pageList) {
                for (var item in _pageList) {
                    var _file = file.clone(),
                        _fileObj = _pageList[item],
                        _fileName = _fileObj && _fileObj.fileName;

                    _file.sourceMap = _file.sourceMap || {};
                    _file.sourceMap.relative = _relative;
                    _file.sourceMap.path = _filepath;


                    if (_fileName) {
                        _srcPath = path.join(_dir || "", _fileName);

                        _contents = _this._getContent(options, _fileObj, _json);

                        //if(_contents){
                        _file.contents = new Buffer(_contents || "");
                        _file.path = _srcPath;
                        thisObj.push(_file);
                        //}
                    }
                }
            }
            

            return thisObj;
        }
    };

    return BuildHtml;
}());


var buildHtmlFile=new JsonBuildHtml();


module.exports=buildHtmlFile;