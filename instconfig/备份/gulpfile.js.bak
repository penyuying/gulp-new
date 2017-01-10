//#region 模块说明
/**
*@file 自动构建工具主程序
*
*Module:
*
*      1、{@link module:gulp}
*Namespace:
*
*      1、 {@link module:gulp~taskCFG}
*/


	/**
	* 自动构建工具
	* @module {Object} gulp
	* @requires gulp 基础库
	* @requires fs  gulp内置库读取文件内容fs.readFileSync('./text.txt', 'utf8')
	* @requires path 获取路径
	* @requires gulp-autoprefixer 自动为你添加浏览器私有CSS前缀
	* @requires gulp-changed  只允许改变的文件通过管道。
	* @requires gulp-clean 清空内容
	* @requires gulp-concat 合并文件
	* @requires gulp-connect-multi 不能自定义host地址没有https  require('gulp-connect'),//不能自动打开浏览器
	* @requires gulp-fileTime 读取文件时间并根据定义的标签替换
	* @requires gulp-gzip 把文件压缩成gzip格式的文件
	* @requires gulp-header-footer 给文件内容头和脚增加内容
	* @requires gulp-htmlmin 压缩HTML
	* @requires gulp-if 判断符合条件才执行
	* @requires gulp-inject 注入静态文件（如：JS和CSS)
	* @requires gulp-jshint 检查JS语法
	* @requires gulp-jsonlint 检查JSON语法
	* @requires gulp-loadobj 自动引入模块
	* @requires gulp-minify-css css代码压缩
	* @requires gulp-ngdocs 生成angular的api文档
	* @requires gulp-plumber 编译错误，gulp watch命令正常工作补丁
	* @requires gulp-rename 文件重命名
	* @requires gulp-replace 替换内容
	* @requires gulp-rev 对文件名加MD5后缀或取文件的md5，并且保存到JSON文件
	* @requires gulp-rev-collector 把文件中的路径改成gulp-rev生成的路径（从gulp-rev生成的JSON文件中找）
	* @requires gulp-rev-easy 自动给HTML里面的JS CSS链接后面加上MD5版本码
	* @requires gulp-ruby-sass 编译sass
	* @requires gulp-sourcemaps 转换后的代码的每一个位置，所对应的转换前的位置。有了它，出错的时候，除错工具将直接显示原始代码，而不是转换后的代码。
	* @requires gulp-uglify js代码压缩
	* @requires gulp-util 一个工具库
	* @requires imagemin-gifsicle 压缩gif图片
	* @requires imagemin-mozjpeg 压缩jpg图片
	* @requires imagemin-pngquant 压缩png图片
	* @requires jasmine-core 测试工具Karma-Jasmine
	* @requires karma 测试工具Karma
	* @requires karma-chrome-launcher 测试工具Karma调用谷歌浏览器测试环境
	* @requires karma-commonjs 测试工具Karma模块系统
	* @requires karma-coverage 测试工具Karma代码覆盖率
	* @requires karma-firefox-launcher 测试工具Karma调用火狐浏览器测试环境
	* @requires karma-ie-launcher 测试工具Karma调用IE浏览器测试环境
	* @requires karma-jasmine 测试工具karma-jasmine
	* @requires karma-junit-reporter 测试工具karma不知道干嘛用的
	* @requires lazypipe 工厂来共享 stream
	* @requires map-stream 输出jshint检查语法错误信息
	* @requires merge-stream 异步工作流
	* @requires remove-plugin 移除插件
	* @requires streamqueue 连续并入工作流
	* @requires through2 用于简化streams调用的api
	*
	*/
//#endregion

(function () {
    //#region 公共
//    var plugin=require("remove-plugin")({file:"./package.json"});//清除模块
    var PY=require("gulp-loadobj")();
    var fs = require('fs'),
        path = require('path');
    
    
        ////es = require('event-stream'),
        ////tap = require('gulp-tap'),

        ////外部插件
        ////cache = require('gulp-cache'),                //文件缓存，只有文件替换了才压缩
        ////buffer = require('gulp-buffer'), //只传递更改过的文件
        ////filter = require('gulp-filter'), //筛选文件
        ////notify = require('gulp-notify'), //更动通知(通知框气泡通知)
		////del = require('del'),
		////vinylPaths = require('vinyl-paths'),
        ////imageminSvg = require('imagemin-svgo'),//压缩svg
        ////imageminWeb = require('imagemin-webp'),//转成webp格式的图片

        ////js
        ////obfuscate = require('gulp-obfuscate'),//js代码混淆

        ////js单元测试
        //karmaServer =require('karma').Server,

        
        PY.karmaServer=PY.karma.Server;
        PY.gulpconnectmulti=PY.gulpconnectmulti();
        //PY.gulpdocs = require('gulp-ngdocs');
//		PY.removeplugin()

    //var build = {};
	
	
	/**
	*判断类型
    *@global
	*@namespace isData
	*/
	var isData = {};
	/**
    * 判断String类型是否为真
    * @function isString
    * @param {type} obj 需要判断的对象
    * @return {Boolean} 返回true||false
    * @memberof module:gulp~isData
	* @static
    */

    /**
    * 判断Function类型是否为真
    * @function isFunction
    * @param {type} obj 需要判断的对象
    * @return {Boolean} 返回true||false
    * @memberof module:gulp~isData
    * @static
    */

    /**
    * 判断Array类型是否为真
    * @function isArray
    * @param {type} obj 需要判断的对象
    * @return {Boolean} 返回true||false
    * @memberof module:gulp~isData
    * @static
    */

    /**
    * 判断Number类型是否为真
    * @function isNumber
    * @param {type} obj 需要判断的对象
    * @return {Boolean} 返回true||false
    * @memberof module:gulp~isData
    * @static
    */


    /**
    * 判断RegExp类型是否为真
    * @function isRegExp
    * @param {type} obj 需要判断的对象
    * @return {Boolean} 返回true||false
    * @memberof module:gulp~isData
    * @static
    */

    /**
    * 判断Object类型是否为真
    * @function isObject
    * @param {type} obj 需要判断的对象
    * @return {Boolean} 返回true||false
    * @memberof module:gulp~isData
    * @static
    */

    /**
    * 判断Date类型是否为真
    * @function isDate
    * @param {type} obj 需要判断的对象
    * @return {Boolean} 返回true||false
    * @memberof module:gulp~isData
    * @static
    */

    /**
    * 判断Window类型是否为真
    * @function isWindow
    * @param {type} obj 需要判断的对象
    * @return {Boolean} 返回true||false
    * @memberof module:gulp~isData
    * @static
    */
    
    ['String', 'Function', 'Array', 'Number', 'RegExp', 'Object', 'Date', 'Window'].map(function (v) {//判断数据类型
        isData['is' + v] = function (obj) {
            if (v == "Window") {
                return obj != null && obj == obj.window;
            } else {
                return Object.prototype.toString.apply(obj) == '[object ' + v + ']';
            }
        };
    });
    
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
        if (isData.isObject(pkgObj) || isData.isArray(pkgObj)) {
            for (var key in pkgObj) {
                if (isData.isString(pkgObj[key])) {
                    pkgObj[key] = replaceItem(pkgObj[key], tempPkg, /\{\#([^}]+)\#\}/ig);
                } else {
                    pkgObj[key] = againPkg(pkgObj[key], tempPkg);
                }
            }
        }
        return pkgObj;
    }
    
    /**
	*合并对象
    *@global
	*@function addObj
	*@param {Object} d 默认的对象
	*@param {Object} o 要合并的对象
	*@return {Object} 返回修改值后的默认对象
	*/
    function addObj(d, o) { //合并对象
        var r = {};
        if (!o) {
            return d;
        }
        for (var i in d) {
            if (typeof o[i] != "undefined") {
                r[i] = o[i];
            } else {
                r[i] = d[i];
            }
        }
        againPkg(r);
        return r;
    }
	
	/**
	*判断对象属性是否存在，如果存在则返回它的值，如不存在则返回d参数
    *@global
	*@function returnObj
	*@param {object} o 对象
	*@param {String} t 需要判断的属性名
	*@param {type} d 如果属性不存在返回的值（任意类型值）
	*@return {type} 返回查找到的属性对应的值（任意类型值）
	*/
    function returnObj(o, t, d) {
        /// <summary>作用：
        /// 判断对象属性是否存在，如果存在则返回它的值，如不存在则返回d参数
        /// </summary>
        /// <param name="o" type="对象">对象</param>
        /// <param name="t" type="属性名称">需要判断的属性名</param>
        /// <param name="d" type="对象">如果属性不存在返回的值</param>
        var ret = "";
        if (typeof d != "undefined") {
            ret = d;
        }
        if (o && typeof o[t] != "undefined") {
            ret = o[t];
        }
        return ret;
    }


	/**
	*获取JSON文件并返回对象
    * @global
	*@function getJson
	*@param {String} dir JSON文件路径
	*@retrun {Object} 返回对象
	*/
    function getJson(dir) {//取JSON文件对象
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
    
    /**
     * 取得目录下子目录名
     * @global
     * @function getFolders
     * @param   {Strint} dir 目录路径
     * @return {boolean|Array}  子目录名数组
     */
    function getFolders(dir) {
        return fs.readdirSync(dir)
            .filter(function (file) {
                var dirName=fs.statSync(path.join(dir, file)).isDirectory();
                if(!/^[\.]/ig.test(file)){
                    return dirName;
                }else{
                    return false;
                }
            });
    }


    
    /**
     * 去除数组重复项
     * @global
     * @function unique
     * @param   {Array} arr 数组
     * @return {Array} 返回处理好的数组
     */
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
    
    /**
     * 格式化时间
     * @global
     * @function formatDate
     * @this Date
     * @param  {Date|String} Date|format 1、接收参数如果this=window时，第一个参数为Date对象，第二个为格式化的格式（例：yyyy-MM-dd hh:mm:ss）；2、如果this=Date对象时第一个为格式化后的样式（例：yyyy-MM-dd hh:mm:ss）。
     * @param {String} [format="yyyy-MM-dd"] 格式化的格式（例：yyyy-MM-dd hh:mm:ss）
     * @return {string} 返回格式化好的日期
     */
    function formatDate() {
        var fmt = arguments[0];
        var dateObj = this;

        //如果this不是Date对象则看第一个参数是否为Date对象，如果是则把第一个参数赋值给dateObj否则退出
        if (!isData.isDate(this) && isData.isDate(arguments[0])) {
            dateObj = arguments[0];
            fmt = arguments[1];
        } else if (!isData.isDate(this)){
            return "Date对象错误！";
        }
        fmt=fmt||"yyyy-MM-dd";
        var o = {
            "M+": dateObj.getMonth() + 1, //月份
            "d+": dateObj.getDate(), //日
            "h+": dateObj.getHours(), //小时
            "m+": dateObj.getMinutes(), //分
            "s+": dateObj.getSeconds(), //秒
            "q+": Math.floor((dateObj.getMonth() + 3) / 3), //季度
            "S": dateObj.getMilliseconds() //毫秒
        };
        if (fmt && /(y+)/.test(fmt)){
            fmt = fmt.replace(RegExp.$1, (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (fmt && new RegExp("(" + k + ")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }
    
    /**
     * 时间对象
     * @class Date
     */
    
    /**
     * 对Date的扩展，将 Date 转化为指定格式的String             
     * @requires {@link formatDate}
     * @param   {String} fmt 格式字符串
     * @return {Srting} 返回格式化后的日期格式字符串
     */
    Date.prototype.format = function (fmt) {
        var ret = formatDate.apply(this, arguments);
        return ret;
    };
    
    /**
    *当前时间
    *@global
    */
    var now = new Date();
    
    //引入JSON文件
    
    var pkgtempq = require('./webAppConfig.json');
	pkgtempq.bakDateDir=now.format('yyyy-MM') + '/' + now.format('dd hh.mm')+'/';//用时间作目录
    var gpkg = againPkg(pkgtempq);

    //#endregion


    //#region getGlobal
    //根据pkg生成项目打包参数
    var getGlobal = (function () {
        /**
         * 根据pkg生成项目打包参数
         * @class
         * @alias getGlobal
         */
        function getTaskOption() { //全局路径
            /**
            *pkg对象
            */
            this.pkg = {};
        }

        getTaskOption.prototype = {

            /**
             * 设置当前项目的pkg
             * @param {Object} obj 当前项目所需要的pkg对象
             */
            setPkg: function (obj) {
                this.pkg = obj;
            },

            /**
             * 字符数量不够用指定的字符补齐
             * @protected
             * @param   {String} txt 需要补空格的字符串
             * @param   {Number} [num=32] 字符+空格的总数量
             * @param   {String} [ext=""] 给补好后的字符串加的后缀
             * @param   {String} [extTxt=" "] 补齐用的字符
             * @return {String} 返回补齐完成的字符串
             */
            _setpart: function (txt, num, ext, extTxt) {//设置空格
                var l = 0, templ = 1;

                num = num > 0 ? num : 32;
                ext = ext != undefined ? ext : "";
                extTxt = extTxt || " ";

                if (txt) {
                    txt = txt.toString();
                    l = txt.length;
                }

                templ = (num - l) > 0 ? (num - l) : templ;

                var arr = new Array(templ);
                return txt + arr.join(extTxt) + ext + "\r\n";
            },

            /**
             * 生成打包时所需的内容开头注释banner信息
             * @protected
             * @returns {string} 返回生成好的文本
             */
            _banner: function () { //公用//banner
                var _this = this,
                    d = new Date(),
                    setpart = _this._setpart,
                    tempPkg = _this.pkg;

                return "/*!\r\n" + //开头
                        setpart("* @Authors:" + tempPkg.userName, 0, "*") + //作者
                        setpart("* @System:" + tempPkg.name, 0, "*") + //系统名称
                        setpart("* @Version:v" + tempPkg.version, 0, "*") + //版本号
                        setpart("* @update: {$#" + tempPkg.fileTimeName + ":" + tempPkg.fileTime + "#$}", 0, " *") + //文件更新时间
                        setpart("*/", 1, "\r\n"); //结尾
            },

            /**
             * 生成打包时所需的内容结尾注释footer信息
             * @protected
             * @returns {string} 返回生成好的文本
             */
            _footer: function () { //公用//footer
                var _this = this,
                    d = new Date(),
                    tempPkg = _this.pkg;

                return "\r\n\r\n/*!----------   {$#" + tempPkg.fileTimeName + ":" + tempPkg.fileTime + "#$}   ----------*/";
            },

            /**
             * 获取需要删除的目录及文件路径
             * @returns {Array} 返回存放路径的数组
             */
            getClearPath: function () {
                var pkg = this.pkg,
                    resGSrc = [];
                resGSrc.push(pkg.destPath);
                return {
                    gSrc: resGSrc
                };
            },

            /**
             * 获取gulp task处理完成后的文件的存储目录路径
             * @protected
             * @param   {object}   pkg    当前项目的Pkg对象
             * @param   {object}   obj    当前task的子对象
             * @param   {string} subDst 处理后存放文件的子目录
             * @returns {string}   处理好的路径
             */
            _getDestPath: function (pkg, obj, subDst) {//获取处理完后的文件的存储目录
                
                // if (subDst == "bakDstDir") {//处理备份存储目录
                //     if (obj.dest) {
                //         return path.normalize(obj.dest).replace(/\\/g, "/");
                //     } else if (pkg[subDst]) {
                //         return path.normalize(pkg[subDst]).replace(/\\/g, "/");
                //     } else {
                //         return "";
                //     }
                // }
                var root = returnObj(obj,"destRoot",returnObj(pkg,"destRoot","")),
                 destPath = returnObj(obj, "destPath", returnObj(pkg, 'destPath', ""));//pkg.destPath||"";
                // if (subDst == "bakDstDir") {//处理备份存储目录
                //     root = "";
                // }
                if (obj) {
                    if(typeof obj.root != "undefined"){
                        root = obj.root;
                    }
                    //destPath=returnObj(obj, "destPath", returnObj(pkg, 'destPath', ""));
                }

                if (obj && obj.dsrc) {//存储到开发目录
                    return path.normalize(pkg.srcPath + obj.dsrc).replace(/\\/g, "/");
                } else if (obj && obj.dest) {//存储到生成目录
                    return path.normalize(destPath + root + obj.dest).replace(/\\/g, "/");
                } else if (subDst) {
                    if (pkg[subDst]) {
                        return path.normalize(destPath + root + pkg[subDst]).replace(/\\/g, "/");
                    }
                }
                if (destPath) {
                    return path.normalize(destPath + root).replace(/\\/g, "/");
                } else {
                    return "";
                }

            },

            /**
             * 获取处理rev生成的文件MD5存放的JSON文件路径
             * @param   {object} pkg    当前项目的Pkg对象
             * @param   {object} obj    当前task的子对象
             * @param   {string} subDst 处理后存放文件的子目录
             * @param   {string} revDst MD5配置文件临时存放的目录
             * @returns {string} 处理好的路径
             */
            getRevDestPath: function (pkg, obj, subDst, revDst) {//获取处理rev生成的JSON文件
                var root = returnObj(obj,"destRoot",returnObj(pkg,"destRoot","")),
                tempRevDestPath=returnObj(obj,"revDestPath",returnObj(pkg,"revDestPath",""));
                // pkg.revDestPath = pkg.revDestPath || "";
                // if (obj && typeof obj.root != "undefined") {
                //     root = obj.root;
                // }

                if (obj && obj.revDest) {//存储到生成目录
                    return path.normalize(tempRevDestPath + root + revDst + "\\" + obj.revDest).replace(/\\/g, "/");
                } else if (subDst) {
                    if (pkg[subDst]) {
                        return path.normalize(tempRevDestPath + root + pkg[subDst] + revDst + "\\").replace(/\\/g, "/");
                    }
                }
                if (tempRevDestPath) {
                    return path.normalize(tempRevDestPath + root + revDst + "\\").replace(/\\/g, "/");
                } else {
                    return "";
                }

            },

            /**
             * 获取jsDoc所需的JS临时文件存放的目录
             * @param   {object} pkg    当前项目的Pkg对象
             * @param   {object} obj    当前task的子对象
             * @param   {string} subDst 处理后存放文件的子目录
             * @param   {string} docDst jsDoc配置文件临时存放的目录(暂时无用)
             * @returns {string} 返回处理好的路径
             */
            getJsDoc3Temp: function (pkg, obj, subDst, docDst,jsDoc3Temp) {//获取jsDoc临时文件存放的目录
                var root = returnObj(obj,"destRoot",returnObj(pkg,"destRoot","")),
                    dest,
                    jsDoc3Temp = returnObj(obj,jsDoc3Temp,returnObj(pkg,jsDoc3Temp,""));
                
                // if (obj && typeof obj.root != "undefined") {
                //     root = obj.root;
                // }

                if (obj && obj.dest) {//存储到生成目录
                    //return path.normalize(jsDoc3Temp + root +"\\").replace(/\\/g,"/");
                    //                    return path.normalize(jsDoc3Temp + root  + docDst+"\\" +obj.revDest).replace(/\\/g,"/");
                    //                    return path.normalize(jsDoc3Temp + root + obj.dest).replace(/\\/g,"/");

                    dest = obj.dest.split(":");
                    return path.normalize(jsDoc3Temp + root + dest.pop()).replace(/\\/g, "/");
                } else if (subDst) {
                    if (pkg[subDst]) {
                        dest = pkg[subDst].split(":");
                        //return path.normalize(jsDoc3Temp + root + "\\").replace(/\\/g,"/");
                        //                        return path.normalize(jsDoc3Temp + root + pkg[subDst] + docDst+"\\").replace(/\\/g,"/");
                        //                        return path.normalize(jsDoc3Temp + root + pkg[subDst]).replace(/\\/g,"/");
                        return path.normalize(jsDoc3Temp + root + dest.pop()).replace(/\\/g, "/");
                    }
                }
                if (jsDoc3Temp) {
                    //                    return path.normalize(jsDoc3Temp + root +"\\").replace(/\\/g,"/");
                    //                    return path.normalize(jsDoc3Temp + root  + docDst+"\\").replace(/\\/g,"/");
                    return path.normalize(jsDoc3Temp + root).replace(/\\/g, "/");
                } else {
                    return "";
                }

            },


            /**
             * 注入静态资源文件路径
             * @param   {object} pkg 当前项目的Pkg对象
             * @returns {string} 返回lazypipe模块注入对象
             */
            htmlInject: function (pkg) {//处理注入流
                var tmpInject = new PY.lazypipe();
                var _this = this;
                var injectdir = pkg.srcPath + 'pkg/inject.json';
                var _pkg = getJson(injectdir);
                pkg = addObj(pkg, _pkg);
                pkg = againPkg(pkg);
                var dirFile = pkg.injectPath;


                /**
                 * 读取自定义属性（名及值）
                 * @param {string} type 类型（扩展名）
                 * @param {object} obj 数据对象
                 * @returns {string} 返回属性（名及值）
                 */
                function getAttr(type, obj) {
                    type = type || "";
                    var ret = " ", retArr, attrListObj;
                    var attrName = type + "Attr";

                    if (typeof obj[attrName] != "undefined") {//如果obj存在attrName属性则处理
                        attrListObj = obj[attrName];

                        if (isData.isObject(attrListObj)) {//如果attrListObj是一个对象则把key作为属性名，value作为值添加到retArr数组
                            retArr = [];
                            for (var arr in attrListObj) {
                                retArr.push(arr + '="' + attrListObj[arr] + '"');
                            }
                        } else if (isData.isArray(attrListObj)) {//如果attrListObj是一个数组，则直接把attrListObj赋值组retArr数组
                            retArr = attrListObj;
                        }

                        if (isData.isArray(retArr)) {
                            ret = " " + retArr.join(" ") + " ";
                        } else {
                            ret = " " + attrListObj + " ";
                        }
                    }
                    return ret;
                }

                /**
                 * 处理注入路径
                 * @param   {object} obj 当前task的子数据对象
                 * @returns {function}   返回生成路径的transform函数
                 */
                function getfilepath(obj) {//处理注入路径


                    return function (filepath, file, i, length, targetFile) {
                        var tObj = obj;
                        var j = 0, k = 0;
                        var pathArr = path.dirname(targetFile.path).split(path.sep);
                        var pathlength = pathArr.length;
                        var fileArr = path.dirname(filepath).split("/");
                        var dir = "";
                        if (path.extname(targetFile.path).toLowerCase() == ".html") {
                            for (k = 0; k < pathlength; k++) {
                                if (pathArr.length > 0 && pathArr[0] == fileArr[0]) {
                                    pathArr.splice(0, 1);
                                    fileArr.splice(0, 1);
                                } else {
                                    break;
                                }
                            }
                            var dirlength = pathArr.length;
                            if (dirlength > 0) {
                                for (j = 0; j < dirlength; j++) {
                                    dir = dir + "../";
                                }
                            }
                        }
                        var filedir = fileArr.join("/") + "/" + path.basename(filepath), attr;

                        if (filepath.toLowerCase().slice(-3) === '.js') {
                            attr = getAttr("js", tObj);
                            return '	<script type="text/javascript"' + attr + 'src="' + dir + filedir + '"></script>';
                        }
                        if (filepath.toLowerCase().slice(-4) === '.css') {
                            attr = getAttr("css", tObj);
                            return '	<link href="' + dir + filedir + '"' + attr + 'rel="stylesheet" />';
                        }
                    };

                }

                if (isData.isArray(dirFile) && dirFile.length > 0 && isData.isObject(dirFile[0])) {
                    dirFile.map(function (obj) {
                        var root = returnObj(obj,"destRoot",returnObj(pkg,"destRoot","")), 
                        destPath, 
                        ret;
                        // if (obj && typeof obj.root != "undefined") {
                        //     root = obj.root;
                        // }
                        if (obj.src) {
                            destPath = pkg.destPath || "";
                            ret = _this.getSrc(destPath + root, obj.src);
                            tmpInject = tmpInject.pipe(PY.gulpinject, PY.gulp.src(ret, { read: false }), {
                                name: obj.injectName || pkg.injectName,
                                addRootSlash: false,
                                removeTags: true,//移除页面上的标记
                                empty: true,
                                transform: getfilepath(obj)
                            });
                        }
                        if (obj.psrc) {
                            destPath = pkg.destPath || "";
                            ret = _this.getSrc(destPath, obj.psrc);
                            tmpInject = tmpInject.pipe(PY.gulpinject, PY.gulp.src(ret, { read: false }), {
                                name: obj.injectName || pkg.injectName,
                                addRootSlash: false,
                                removeTags: true,//移除页面上的标记
                                empty: true,
                                transform: getfilepath(obj)
                            });
                        }
                    });
                } else {
                    var ret = _this.getSrc(pkg.destPath, dirFile);
                    tmpInject = tmpInject.pipe(PY.gulpinject, PY.gulp.src(ret, { read: false }));
                }
                return tmpInject;
            },

            //            gArr: function() {
            //                var ret=[];
            //                var pkg=this.pkg;
            //                if(pkg.debarPath){
            //                    ret.push("!" + pkg.srcPath + pkg.debarPath);
            //                    if(pkg.publicPath){
            //                        ret.push("!" + pkg.publicPath + pkg.debarPath);
            //                    }
            //                }
            //                return ret;
            //            },

            /**
             * 获取作废的目录路径
             * @param   {string} objPath   文件目录路径
             * @param   {string} debarPath 需要被作废的子路径
             * @param   {string} ext       文件扩展名
             * @param   {string} dirName   来源路径对象key名
             * @returns {Array} 返回存放作废目录路径的数组
             */
            getDebarPath: function (objPath, debarPath, ext, dirName) {//设置作废的目录
                if (!ext) {
                    ext = "";
                }
                ext = "";
                var ret = [];
                //if (dirName == "bakFile") {
                //    return ret;
                //}
                var pkg = this.pkg,
                 _this=this,temparr = [], pathArr =[] ;
                if(isData.isArray(objPath)){
                    objPath.map(function(v, k){
                        pathArr=pathArr.concat(_this.splitSrc(v));
                    });
                }else{
                    pathArr=_this.splitSrc(objPath);
                }

                if (pathArr && pathArr.length > 0) {
                    pathArr.map(function (v, k) {
                        if (v && v.indexOf("!") != -1) {
                            ret.push("!" + v.replace(/\!/g, ""));
                        } else {
                            if (v.slice(-1) === "*") {
                                if (v.slice(-6) === "**/*.*") {
                                    ret.push("!" + path.normalize(v.replace(/\*\*\/\*\.\*$/, debarPath) + ext).replace(/\\/g, "/"));
                                } else if (v.slice(-4) === "**/*") {
                                    ret.push("!" + path.normalize(v.replace(/\*\*\/\*$/, debarPath) + ext).replace(/\\/g, "/"));
                                } else {
                                    ret.push("!" + path.normalize(v.replace(/\*$/, debarPath) + ext).replace(/\\/g, "/"));
                                }
                            } else if (v.slice(-1) == "/") {
                                ret.push("!" + path.normalize(v + debarPath + ext).replace(/\\/g, "/"));
                            }
                        }
                    });
                }
                return ret;
            },

            /**
             * 获取要处理的文件路径
             * @param   {String} [srcPath=""] 根目录
             * @param   {Array|String} obj     子路径可以是文本或数组
             * @param   {string} [ext=""]     扩展名可以为空
             * @param   {Boolean} [debar=false]   是否启用过滤文件(false为启用，true为不启用)
             * @param   {string} dirName 路径来源对象key名
             * @param   {Object} taskObj 当前task的子数据对象
             * @returns {Array} 返回存放要处理文件路径的数组
             */
            getSrc: function (srcPath, obj, ext, debar, dirName,taskObj) {
                if (!ext) {
                    ext = "";
                }
                //if (dirName == "bakFile") {
                //    srcPath = "";
                //}
                var ret = [], _this = this;
                var pkg = this.pkg,
                    debarArr = [],
                    tempsrc,
                    tempDebarPath = returnObj(taskObj, "debarPath", returnObj(pkg, "debarPath", ""));
                if (isData.isArray(obj)) {
                    for (var i = 0; i < obj.length; i++) {
                        if (!debar) {
                            debarArr = _this.getDebarPath(srcPath + obj[i], tempDebarPath, ext, dirName);
                            if (debarArr && debarArr.length > 0) {
                                ret = ret.concat(debarArr);
                            }
                        }
                        if (dirName == "concatJs" || dirName == "concatCss") {
                            tempsrc = path.normalize(srcPath + obj[i]).replace(/\\/g, "/");
                            ret = ret.concat(this.splitSrc(tempsrc, ext));
                        } else {
                            ret.push(path.normalize(srcPath + obj[i] + ext).replace(/\\/g, "/"));
                        }
                    }
                } else if (obj) {
                    if (!debar) {
                        debarArr = _this.getDebarPath(srcPath + obj, tempDebarPath, ext, dirName);
                        if (debarArr && debarArr.length > 0) {
                            ret = ret.concat(debarArr);
                        }
                    }
                    if (dirName == "concatJs" || dirName == "concatCss") {
                        tempsrc = path.normalize(srcPath + obj).replace(/\\/g, "/");
                        ret = ret.concat(this.splitSrc(tempsrc, ext));
                    } else {
                        ret.push(path.normalize(srcPath + obj + ext).replace(/\\/g, "/"));
                    }
                } else {
                    ret = [];
                }
                return ret;
            },

            /**
			 * 折分有{}地址文件路径
			 * @param   {string} src      需要拆分的路径
			 * @param   {string} [ext=""] 文件扩展名
			 * @returns {array} 返回存放拆分好路径的数组
			 */
            splitSrc: function (src, ext) {//折分文件地址
                var ret = [],
                    tempRet = [];
                ext = ext || "";

                function getArr(srcPath) {
                    var temparr = [],
                        rep = false,
                        rg = /\{([^\}]+)\}/ig,
                        srcPathArr;

                    if (isData.isString(srcPath)) {
                        srcPathArr = rg.exec(srcPath);
                        if (isData.isArray(srcPathArr) && srcPathArr.length > 1) {
                            var arr = srcPathArr[1].split(',');
                            if (arr && arr.length > 0) {
                                arr.map(function (txt) {
                                    if (srcPath && txt) {
                                        var tt = srcPath.replace(srcPathArr[0], txt);
                                        temparr.push(tt);
                                        rep = true;
                                    }

                                });
                            } else {
                                temparr.push(srcPath);
                            }
                        } else {
                            temparr.push(srcPath);
                        }
                    }
                    if (rep && temparr && temparr.length > 0) {
                        var tempfor = [];
                        temparr.map(function (item) {
                            if (item) {
                                var r = getArr(item);
                                if (isData.isArray(r) && r.length > 0) {
                                    tempfor = tempfor.concat(r);
                                }
                            }
                        });
                        if (tempfor && tempfor.length > 0) {
                            temparr = tempfor;
                        }
                    }
                    return temparr || [];
                }

                ret = getArr(src);
                if (ret && isData.isArray(ret) && ret.length > 0) {
                    ret.map(function (item) {
                        tempRet.push(item + ext);
                    });
                }
                return tempRet;
            },

            /**
            * 遍历来源地址合并成完整路径数组
            * @param {String} srcPath 来源根路径
            * @param {String|Array} objSrc 当前src路径
            * @returns {Array} 返回合并好的地址数组
            */
            forEachSrc:function(srcPath,objSrc){
                var resArr=[];
                srcPath=srcPath||"";

                if(isData.isArray(objSrc)){
                    if(srcPath){
                        objSrc.map(function(v,k){
                            resArr.push(srcPath+v);
                        });
                    }else{
                        resArr=objSrc;
                    }

                }else{
                    resArr.push(srcPath+objSrc);
                }
                return resArr;
            },
            /**
             * 设置task处理参数配置
             * @param   {string}       dirName         来源路径key名
             * @param   {string}       subDst          处理后存放文件的子目录
             * @param   {string}       subRevDst       MD5配置文件存放的子目录
             * @param   {string}       [ext=""]        处理文件的扩展名
             * @param   {boolean}       debar          是否启用过滤的文件名(false为启用，true为不启用)
             * @param   {string}       concatDstJsFileName 合并后的文件名
             * @param   {string}       tplsPath            模板文件路径key名
             * @returns {object} cfgObj
             * @returns {array} cfgObj.cfgArr:[{@link module:gulp~taskCFG},……] task参数配置对数数组
             * @returns {array} cfgObj.gSrc:[……] 需要监控的路径数组
             */
            setObj: function (dirName, subDst, subRevDst, ext, debar, concatDstJsFileName, tplsPath) {
                if (!ext) { ext = ""; }
                var _this = this,
                    retGSrc = [],//_this.gArr(),
                    retSrc = [],
                    pkg = this.pkg,
                    cfg = {},
                    headbanner = _this._banner(),
                    footbanner = _this._footer(),
                    debarArr = [];
                if (pkg.mapIf) {
                    if (dirName === "dirConcatJs" || dirName === "concatJs" || dirName === "jsFile") {
                        headbanner = "/**/";
                        footbanner = "\n\n" + _this._banner();
                    }
                }

                var dirFile = this.pkg[dirName];
                if (isData.isArray(dirFile) && dirFile.length > 0 && !isData.isString(dirFile[0])) {
                    if (dirFile.length > 0) {
                        dirFile.map(function (obj) {
                            var src = [],
                                injectIf = false,
                                tempSrcPath = returnObj(obj, 'srcPath', returnObj(pkg, 'srcPath', "")),//源文件的根目录
                                tempPublicPath = returnObj(obj, 'publicPath', returnObj(pkg, 'publicPath', ""));//公共源文件的根目录
                            //                            if (!debar) {
                            //                                src = _this.gArr();
                            //                            }
                            if (!obj.src && !obj.psrc) {
                                return false;
                            }

                            if (obj.psrc) {
                                var psrcTxt = _this.getSrc(tempPublicPath, obj.psrc, ext, debar, dirName,obj);
                                if (isData.isArray(psrcTxt) && psrcTxt.length > 0) {
                                    src = src.concat(psrcTxt);
                                    retGSrc = retGSrc.concat(psrcTxt);
                                } else if (psrcTxt) {
                                    src.push(psrcTxt);
                                    retGSrc.push(psrcTxt);
                                }

                                if (obj.debar && !debar) {
                                    debarArr = _this.getDebarPath(_this.forEachSrc(tempPublicPath,obj.psrc), obj.debar, "", dirName);
                                    if (debarArr && debarArr.length > 0) {
                                        src = src.concat(debarArr);
                                    }
                                    //                                    src.push("!" + pkg.publicPath + obj.debar);
                                }
                            }
                            
                            if (obj.src) {
                                var srcTxt = _this.getSrc(tempSrcPath, obj.src, ext, debar, dirName,obj);
                                if (isData.isArray(srcTxt) && srcTxt.length > 0) {
                                    src = src.concat(srcTxt);
                                    retGSrc = retGSrc.concat(srcTxt);
                                } else {
                                    src.push(srcTxt);
                                    retGSrc.push(srcTxt);
                                }


                                if (obj.debar && !debar) {
                                    debarArr = _this.getDebarPath(_this.forEachSrc(tempSrcPath,obj.src), obj.debar, "", dirName);
                                    if (debarArr && debarArr.length > 0) {
                                        src = src.concat(debarArr);
                                    }
                                    //                                    src.push("!" + pkg.srcPath + obj.debar);
                                }
                            }

                            if (tplsPath && obj.tpls) {
                                retGSrc.push(tempSrcPath + obj.tpls + "**/*");
                            } else if (tplsPath) {
                                retGSrc.push(tempSrcPath + pkg[tplsPath] + "**/*");
                            }

                            var destPath = _this._getDestPath(pkg, obj, subDst);
                            var revDestPath = _this.getRevDestPath(pkg, obj, subDst, subRevDst);
                            var jsDocTempPath = _this.getJsDoc3Temp(pkg, obj, subDst, subRevDst,"jsDoc3Temp");//获取jsDoc3存放临时文件的目录
                            var compassConfig=returnObj(obj, 'compassConfig', pkg.compassConfig||{});//获取compass的配置参数
                            if(dirName=="compassFile"){
                                var compassTempPath = _this.getJsDoc3Temp(pkg, obj, subDst, subRevDst,"compassTemp");//获取compass存放临时文件的目录
                                compassConfig.css=compassTempPath||"css"
                                 if(compassConfig.config_file){
                                    retGSrc.push(path.normalize((compassConfig.project||returnObj(pkg, 'srcPath', "")) + compassConfig.config_file).replace(/\\/g, "/"));
                                 }
                                
                            }
                            

                            var tempJsHeader = returnObj(obj, 'jsHeader', returnObj(pkg, (pkg.jsHeader && 'jsHeader') || "", "(function(" + returnObj(obj, 'jsGlobalObj', pkg.jsGlobalObj) + ") {\n"));

                            var tempJsFooter = returnObj(obj, 'jsFooter', returnObj(pkg, (pkg.jsFooter && 'jsFooter') || "", "\n})(" + returnObj(obj, 'jsGlobalObj', pkg.jsGlobalObj) + ")"));

                            /** 
                             * gulp的task参数配置
                             * 
                             *      1、所有默认参数自定义在webAppConfig.json文件，具体默认值以webAppConfig.json文件内的值为准；
                             * 
                             *      2、对应项目单独设置参数以webAppConfig.json里subJsonPath指定的路径，items项对应的名称的JSON文件为准。
                             * @namespace taskCFG
                             * @protected
                             * @property {String} name 项目名称
                             * @property {String} concatFileName 合并文件后文件的名称
                             * @property {String} tplsPath 模板文件目录路径
                             * @property {String} destPath 处理完后的文件存储目录
                             * @property {String} jsDocLink api文档链接
                             * @property {String} [jsDocType=jsdoc] api文档类型（jsdoc、angular）
                             * @property {String} jsDoc3Dir JSDoc文档存放的路径
                             * @property {String} jsDoc3Temp 临时文件存放的路径
                             * @property {Boolean} ifJsDoc JSDoc是否生成文档
                             * @property {String} revDestPath 存放rev生成的JSON文件路径
                             * @property {String} revCollectorSrcPath 存放rev生成的主目录路径
                             * @property {String} revType rev生成和替换静态文件名的类型（"part"为参数形式,其它为文件名形式）
                             * @property {Boolean} [mapIf=false] 是否生成map文件（true为是，false为否）
                             * @property {String} mapsPath map文件存放路径
                             * @property {Object} compassConfig compass配置参数
                             * @property {String} [ifminimg=false] 是否压缩图片（true为是，false为否）
                             * @property {Number} [imgquality=100] 图片质量，最小不能小于60(ifminimg=true时才有效)
                             * @property {String} newFileName 处理完后的文件的新名称
                             * @property {String} [prefix=""] 是否给文件加前缀（有内空时为加，没有内容时为不加）
                             * @property {String} [suffix=""] 是否给文件加后缀（有内空时为加，没有内容时为不加）
                             * @property {Boolean} [ifmin=false] 是否压缩JS、CSS（true为否，false为是）
                             * @property {Array} [autoprefixerBrowsers=["> 0.1%", "android >= 2.6", "chrome >= 4", "edge >= 11", "firefox >= 3.5"]] 加前缀要兼容的浏览器版本例：["> 0.1%", "android >= 2.6", "chrome >= 4", "edge >= 11", "firefox >= 3.5", "ie >= 6", "ie_mob >= 6", "ios_saf >= 6", "opera >= 5","safari >= 6"]
                             * @property {Boolean} [ifminhtml=false] 是否压缩html（true为否，false为是）
                             * @property {Boolean} [injectIf=false] 是否注入文件到html（true为是，false为否）
                             * @property {Boolean} [bannerIf=false] 是否加banner（true为否，false为是）
                             * @property {Boolean} [gzipIf=false] 是否把文件压缩成gzip格式（true为是，false为否）
                             * @property {String} header 内容开头注释banner信息
                             * @property {String} footer 内容结尾注释footer信息
                             * @property {Boolean} [srcRev=false] 是否给引用文件加后缀如：xxx.x?=xxxx（true为是，false为否）
                             * @property {Boolean} [changIf=false] 是否改变时才更新文件（true为否，false为是）//obj.changIf||pkg.changIf,
                             * @property {Boolean} [jsAnonymous=false] 合并js文件时是否用匿名函数包起来（true为是，false为否）
                             * @property {String} jsHeader JS内容前面加的代码(jsAnonymous=true时有效)
                             * @property {String} jsFooter JS内容后面加的代码(jsAnonymous=true时有效)
                             * @property {String} srcPath 需要处理的文件
							 * @property {String} [connectStart=false] 是否启动服务器（true为否，false为是）
                             * @property {String} [fileTime="mtime"] 文件时间类型
                             * @property {String} [fileTimeName="filetime"] 文件时间使用的别名
                             * @property {object} mapObj map文件生成时的参数
							 * @property {String} mapObj.includeContent map文件是否引入映射内容
							 * @property {String} mapObj.sourceRoot map文件映射内容到source目录
                             */

                            cfg = {
                                name: returnObj(pkg, 'name', ""),//项目名称
                                concatFileName: obj.fileName || concatDstJsFileName && pkg[concatDstJsFileName] || "",//合并文件后文件的名称
                                tplsPath: obj.tpls && path.normalize(tempSrcPath + obj.tpls).replace(/\\/g, "/") || tplsPath && pkg[tplsPath] && path.normalize(tempSrcPath + pkg[tplsPath]).replace(/\\/g, "/") || tempSrcPath,//HTML的模板文件目录
                                destPath: destPath,//处理完后的文件存储目录
                                jsDocLink: returnObj(pkg, 'jsDocLink', ""),//api文档链接
                                jsDocType: returnObj(pkg, 'jsDocType', ""),//api文档类型
                                jsDoc3Dir: returnObj(obj, 'jsDoc3Dir', returnObj(pkg, 'jsDoc3Dir', "")),//JSDoc文档存放的路径
                                jsDoc3Temp: jsDocTempPath,//JSDoc临时文件存放的路径
                                ifJsDoc: returnObj(obj, 'ifJsDoc', returnObj(pkg, 'ifJsDoc', false)),//JSDoc是否生成文档
                                revDestPath: revDestPath,//存放rev生成的JSON文件
                                revCollectorSrcPath:returnObj(obj, 'revDestPath', returnObj(pkg, 'revDestPath', "")),//存放rev生成的主目录
                                revType: returnObj(obj, 'revType', pkg.revType),//rev生成文件名的类型
                                //                                revCollectorType:returnObj(obj, 'revCollectorType',pkg.revCollectorType),//revCollector替换文件的类型
                                mapIf: returnObj(obj, 'mapIf', pkg.mapIf),//是否生成map文件（true为是，false为否）
                                mapsPath: returnObj(obj, 'mapsPath', pkg.mapsPath),//obj.mapsPath || pkg.mapsPath,
                                compassConfig: compassConfig,//obj.compassConfig || pkg.compassConfig,
                                ifminimg: returnObj(obj, 'ifminimg', pkg.ifminimg),//obj.ifmin || pkg.ifminimg,//是否压缩图片（true为是，false为否）
                                imgquality: returnObj(obj, 'imgquality', pkg.imgquality) || 100,//图片质量
                                newFileName: returnObj(obj, 'newFileName', ""),//处理完后的文件的新名称
                                prefix: returnObj(obj, "prefix", returnObj(pkg, 'prefix', false)),//是否给文件加前缀（有内空时为加，没有内容时为不加）
                                suffix: returnObj(obj, "suffix", returnObj(pkg, 'suffix', false)),//是否给文件加后缀（有内空时为加，没有内容时为不加）
                                ifmin: returnObj(obj, "ifmin", returnObj(pkg, 'ifmin', false)),//是否压缩JS、CSS（true为否，false为是）
                                autoprefixerBrowsers: returnObj(obj, "autoprefixerBrowsers", returnObj(pkg, 'autoprefixerBrowsers', ["> 0.1%", "android >= 2.6", "chrome >= 4", "edge >= 11", "firefox >= 3.5"])),//加前缀要兼容的浏览器版本
                                ifminhtml: returnObj(obj, 'ifminhtml', returnObj(pkg, 'ifminhtml', false)),//obj.ifminhtml || pkg.ifminhtml,//是否压缩html（true为否，false为是）
                                injectIf: returnObj(obj, 'injectIf', returnObj(pkg, 'injectIf', false)),//injectIf,//是否注入文件到html（true为是，false为否）
                                bannerIf: returnObj(obj, 'bannerIf', returnObj(pkg, 'bannerIf', false)),//bannerIf,//是否加banner（true为否，false为是）
                                gzipIf: returnObj(obj, 'gzipIf', returnObj(pkg, 'gzipIf', false)),//是否把文件压缩成gzip格式（true为是，false为否）
                                header: headbanner,//banner的头内容
                                footer: footbanner,//banner的脚内容
                                srcRev: returnObj(obj, 'srcRev', returnObj(pkg, 'srcRev', false)),//是否给引用文件加后缀如：xxx.x?=xxxx（true为是，false为否）
                                changIf: returnObj(obj, 'changIf', returnObj(pkg, 'changIf', false)),//是否改变时才更新文件（true为否，false为是）//obj.changIf||pkg.changIf,
                                jsAnonymous: returnObj(obj, 'jsAnonymous', returnObj(pkg, 'jsAnonymous', false)),//jsAnonymous,//合并js文件时是否用匿名函数包起来（true为是，false为否）
                                jsHeader: tempJsHeader,//合并JS前面加的代码
                                jsFooter: tempJsFooter,//"\n})("+returnObj(obj, 'concatJsGlobalObj', pkg.concatJsGlobalObj)+")",//合并JS后面加的代码
                                srcPath: unique(src),//需要处理的文件
                                //concatJsGlobalObj:returnObj(obj, 'concatJsGlobalObj', pkg.concatJsGlobalObj),//合并JS时需用到的全局变量名称
                                connectStart: pkg.connectStart,//是否启动服务器
                                fileTime: returnObj(obj, "fileTime", returnObj(pkg, "fileTime", "mtime")),//文件时间类型默认为mtime
                                fileTimeName: returnObj(obj, "fileTimeName", returnObj(pkg, "fileTimeName", "filetime")),//文件时间使用的别名默认为filetime
                                mapObj: returnObj(obj, "mapObj", returnObj(pkg, "mapObj", {//map文件生成时的参数
                                    includeContent: true,//是否引入映射内容
                                    sourceRoot: 'source'//映射内容到source目录
                                }))
                            };
							if (cfg.mapIf) {//生成map文件的时候
								if (dirName === "dirConcatJs" || dirName === "concatJs" || dirName === "jsFile") {
									headbanner = "/**/";
									footbanner = "\n\n" + _this._banner();
								}
								cfg.header=headbanner;//文件头
								cfg.footer=footbanner;//文件尾
							}
                            if (obj.src || obj.psrc) {
                                if (dirName == "concatJs" || dirName == "concatCss") {
                                    if (cfg.concatFileName) {
                                        retSrc.push(cfg);
                                    }
                                } else {
                                    retSrc.push(cfg);
                                }

                            }
                        });
                    }
                } else if (dirFile && isData.isString(dirFile) || isData.isArray(dirFile) && dirFile.length > 0 && isData.isString(dirFile[0])) {
                    var src = [];
                    //                    if (!debar) {
                    //                        src = _this.gArr();
                    //                    }
                    if (!pkg.srcPath || !dirFile) {
                        return false;
                    }
                    var srcTxt = _this.getSrc(pkg.srcPath, dirFile, ext, debar, dirName);
                    if (isData.isArray(srcTxt) && srcTxt.length > 0) {
                        src = src.concat(srcTxt);
                        retGSrc = retGSrc.concat(srcTxt);
                    } else if (srcTxt) {
                        src.push(srcTxt);
                        retGSrc.push(srcTxt);
                    }
                    var destPath = _this._getDestPath(pkg, "", subDst);
                    var revDestPath = _this.getRevDestPath(pkg, "", subDst, subRevDst);
                    var jsDocTempPath = _this.getJsDoc3Temp(pkg, "", subDst, subRevDst,"jsDoc3Temp");
                    var compassConfig=returnObj(pkg, 'compassConfig',{});
                    if(dirName=="compassFile"){
                        var compassTempPath = _this.getJsDoc3Temp(pkg, "", subDst, subRevDst,"compassTemp");
                        compassConfig.css=compassTempPath||"css";
                        if(compassConfig.config_file){
                            retGSrc.push(path.normalize((compassConfig.project||returnObj(pkg, 'srcPath', "")) + compassConfig.config_file).replace(/\\/g, "/"));
                         }
                    }
                    cfg = {
                        name: returnObj(pkg, 'name', ""),//项目名称
                        concatFileName: concatDstJsFileName && pkg[concatDstJsFileName],
                        tplsPath: tplsPath && path.normalize(pkg.srcPath + pkg[tplsPath]).replace(/\\/g, "/") || pkg.srcPath,
                        srcPath: unique(src),
                        destPath: destPath,
                        jsDocLink: returnObj(pkg, 'jsDocLink', ""),//api文档链接
                        jsDocType: returnObj(pkg, 'jsDocType', ""),//api文档类型
                        jsDoc3Dir: returnObj(pkg, 'jsDoc3Dir', ""),//JSDoc文档存放的路径
                        jsDoc3Temp: jsDocTempPath,//JSDoc临时文件存放的路径
                        ifJsDoc: returnObj(pkg, 'ifJsDoc', false),//JSDoc是否生成文档
                        revDestPath: revDestPath || "",//存放rev生成的JSON文件
                        revCollectorSrcPath: pkg.revDestPath,//存放rev生成的主目录
                        revType: returnObj(pkg, 'revType', ""),//rev生成文件名的类型
                        //                        revCollectorType:returnObj(pkg, 'revCollectorType',""),//revCollector替换文件的类型
                        mapIf: pkg.mapIf,
                        mapsPath: pkg.mapsPath,
                        compassConfig: compassConfig,//obj.compassConfig || pkg.compassConfig,
                        ifminimg: pkg.ifminimg,//是否压缩图片（true为是，false为否）
                        newFileName: "",//处理完后的文件的新名称
                        prefix: returnObj(pkg, 'prefix', false),//是否给文件前后缀（有内空时为加，没有内容时为不加）
                        suffix: returnObj(pkg, 'suffix', false),//是否给文件加后缀（有内空时为加，没有内容时为不加）
                        ifmin: pkg.ifmin,
                        autoprefixerBrowsers: pkg.autoprefixerBrowsers,
                        ifminhtml: pkg.ifminhtml,
                        injectIf: pkg.injectIf,
                        bannerIf: pkg.bannerIf,
                        gzipIf: pkg.gzipIf,
                        header: headbanner,
                        footer: footbanner,
                        srcRev: pkg.srcRev,
                        changIf: pkg.changIf,
                        //concatJsGlobalObj:pkg.concatJsGlobalObj,//合并JS时需用到的全局变量名称
                        jsAnonymous: pkg.jsAnonymous,
                        jsHeader: returnObj(pkg, (pkg.jsHeader && 'jsHeader') || "", "(function(" + returnObj(pkg, 'jsGlobalObj', "") + ") {\n"),//JS前面加的代码
                        jsFooter: returnObj(pkg, (pkg.jsFooter && 'jsFooter') || "", "\n})(" + returnObj(pkg, 'jsGlobalObj', "") + ")"),//"\n})("+returnObj(obj, 'concatJsGlobalObj', pkg.concatJsGlobalObj)+")",//JS后面加的代码
                        imgquality: pkg.imgquality || 100,//图片质量
                        connectStart: pkg.connectStart,//是否启动服务器
                        fileTime: returnObj(pkg, "fileTime", "mtime"),//文件时间类型默认为mtime
                        fileTimeName: returnObj(pkg, "fileTimeName", "filetime"),//文件时间使用的别名默认为filetime
                        mapObj: returnObj(pkg, "mapObj", {
                            includeContent: true,
                            sourceRoot: 'source'
                        })
                    };
					if (cfg.mapIf) {//生成map文件的时候
						if (dirName === "dirConcatJs" || dirName === "concatJs" || dirName === "jsFile") {
							headbanner = "/**/";
							footbanner = "\n\n" + _this._banner();
						}
						cfg.header=headbanner;//文件头
						cfg.footer=footbanner;//文件尾
					}
                    if (tplsPath) {
                        retGSrc.push(pkg.srcPath + pkg[tplsPath] + "**/*" + ext);
                    }

                    retSrc.push(cfg);
                }
                return {
                    gSrc: unique(retGSrc),
                    cfgArr: retSrc
                };
            },

            /**
             * 把不过滤的文路径和过滤的文件路径拆分开
             * @param   {Array} arr      需要分的数组
             * @param   {String} [ext=""] 加不过滤的文件名后缀
             * @param   {Boolean} [concat＝flase]  拆分后是否合并（true为不合并，false为合并）
             * @returns {Object} 返回对像不合并为两个属性src和deber,合并后为一个属性src(注：src为不过滤的路径数组)
             */
            splitSrcAndDebar: function (arr, ext, concat) {
                ext = ext || "";
                var ret = {};
                var retSrcArr = [], retDeberArr = [];
                if (arr && isData.isArray(arr) && arr.length > 0) {
                    arr.map(function (v) {
                        if (v.indexOf("!") == -1) {
                            retSrcArr.push(v + ext);
                        } else {
                            retDeberArr.push(v);
                        }
                    });
                }
                if (concat) {
                    ret = {
                        src: retSrcArr,
                        deber: retDeberArr
                    };
                } else {
                    ret = {
                        src: retSrcArr.concat(retDeberArr)
                    };
                }
                return ret;
            },

            /**
			 * 获取备份处理参数配置
			 * @returns {Object} 返回cfgObj配置参数对象
			 */
            getBakPath: function () {//获取备份处理参数配置
                var obj = this.setObj("bakFile", "bakDstDir", "bakFile");
                return obj;
            },

            /**
			 * 获取复制处理参数配置
			 * @returns {Object} 返回cfgObj配置参数对象
			 */
            getCopyPath: function () {
                var obj = this.setObj("copyFile", "copyDstDir", "copyFile");
                return obj;
            },

            /**
			 * 获取Json处理参数配置
			 * @returns {Object} 返回cfgObj配置参数对象
			 */
            getJsonPath: function () {
                var obj = this.setObj("jsonFile", "jsonDstDir", "jsonFile", '.json');
                return obj;
            },

            /**
			 * 获取图片处理参数配置
			 * @returns {Object} 返回cfgObj配置参数对象
			 */
            getImgPath: function () {
                var pngobj = this.setObj("imgFile", "imgDstDir", "imgFile", ".{png,PNG}");
                var jpgobj = this.setObj("imgFile", "imgDstDir", "imgFile", ".{jpg,JPG}");
                var gifobj = this.setObj("imgFile", "imgDstDir", "imgFile", ".{gif,GIF}");
                var retGSrc = [];
                if (pngobj.gSrc && pngobj.gSrc.length > 0) {
                    retGSrc = retGSrc.concat(pngobj.gSrc);
                }
                if (jpgobj.gSrc && jpgobj.gSrc.length > 0) {
                    retGSrc = retGSrc.concat(jpgobj.gSrc);
                }
                if (gifobj.gSrc && gifobj.gSrc.length > 0) {
                    retGSrc = retGSrc.concat(gifobj.gSrc);
                }
                //var obj = this.setObj("imgFile", "imgDstDir", ".{jpg,png,gif,JPG,PNG,GIF}");
                return {
                    gSrc: unique(retGSrc),
                    arrObj: [{ imgtype: "png", cfgArr: pngobj.cfgArr },
                        { imgtype: "jpg", cfgArr: jpgobj.cfgArr },
                        { imgtype: "gif", cfgArr: gifobj.cfgArr }]
                };
            },

            /**
			 * 获取按目录合并js处理参数配置
			 * @returns {Object} 返回cfgObj配置参数对象
			 */
            getJsDirConcatPath: function () {
                var obj = this.setObj("dirConcatJs", "jsDstDir", "dirConcatJs", "", false);
                var tempobj = this.splitSrcAndDebar(obj.gSrc, "**/*.js");
                return {
                    gSrc: unique(tempobj.src),
                    cfgArr: obj.cfgArr
                };
                //return obj;
            },

            /**
			 * 获取按文件合并js处理参数配置
			 * @returns {Object} 返回cfgObj配置参数对象
			 */
            getConcatJsPath: function () {
                var obj = this.setObj("concatJs", "jsDstDir", "concatJs", ".js", false, "concatDstJsFileName");
                return obj;
            },

            /**
			 * 获取js处理参数配置
			 * @returns {Object} 返回cfgObj配置参数对象
			 */
            getJsPath: function () {
                var obj = this.setObj("jsFile", "jsDstDir", "jsFile", ".js");
                return obj;
            },

            /**
             * 获取sass处理参数配置
             * @returns {Object} 返回cfgObj配置参数对象
             */
            getSassPath: function () {
                var obj = this.setObj("sassFile", "cssDstDir", "sassFile", "{.scss,.sass}", true);
                return obj;
            },

            /**
			 * 获取sass处理参数配置
			 * @returns {Object} 返回cfgObj配置参数对象
			 */
            getCompassPath: function () {
                var obj = this.setObj("compassFile", "cssDstDir", "compassFile", "{.scss,.sass}", true);
                return obj;
            },

            /**
			 * 获取合并css处理参数配置
			 * @returns {Object} 返回cfgObj配置参数对象
			 */
            getConcatCssPath: function () {
                var obj = this.setObj("concatCss", "cssDstDir", "concatCss", ".css", false, "concatDstCssFileName");
                return obj;
            },

            /**
			 * 获取css处理参数配置
			 * @returns {Object} 返回cfgObj配置参数对象
			 */
            getCssPath: function () {
                var obj = this.setObj("cssFile", "cssDstDir", "cssFile", ".css");
                return obj;
            },

            /**
			 * 获取getJsDocPath处理参数配置
			 * @returns {Object} 返回cfgObj配置参数对象
			 */
            getJsDocPath: function () {
                var pkg = this.pkg,
                    obj = this.setObj("jsDoc3Temp", "jsDoc3Dir", "jsDoc3Temp"),
                    tempArr = [];
                if (pkg.jsDoc3Temp) {
                    if (obj && obj.cfgArr && obj.cfgArr.length > 0) {
                        obj.cfgArr.map(function (cfg) {
                            cfg.srcPath = [pkg.jsDoc3Temp, pkg.jsDoc3Temp + "**/*.*"];
                            tempArr.push(cfg);
                        });
                    }
                    obj.cfgArr = tempArr;
                }


                return obj;
            },

            /**
			 * 获取html处理参数配置
			 * @returns {Object} 返回cfgObj配置参数对象
			 */
            getHtmlPath: function () {
                var obj = this.setObj("htmlFile", "htmlDstDir", "htmlFile", ".html", false, "", "tplsHtmlFile");
                return obj;
            },

            /**
             * 获取项目动态引用模板处理参数配置
             * @returns {Object} 返回cfgObj配置参数对象
             */
            templatePath: function () {
                var obj = this.setObj("templateFile", "templateDstDir", "templateFile", ".html", false, "", "tplsHtmlFile");
                return obj;
            },

            /**
			 * 输出jshint检查语法错误信息
			 */
            myReporter: function (file, cb) {
                var errArr=[];
                console.log('   JSHINT file in：' + file.path);
                if (file.jshint.data && file.jshint.data[0] && file.jshint.data[0].globals) {
                    console.log("   globals Object in： " + file.jshint.data[0].globals);
                }
                if (!file.jshint.success) {

                    //不显示的错误信息
                    var errorObj = {
                        "W041": true, //错误码W041:(!=)
                        "W069": true, //错误码W069:(用这种方式设置对象属性xx["xxx"])
                        "W083": true, //错误码W083:(函数未命名)
                        "W030": true //错误码W030：(函数不在if内直接用&&或||判断)
                    };
                    file.jshint.results.forEach(function (err) {
                        if (err && err.error) {
                            //错误码W041:(!=)
                            //错误码W083:(函数未命名)
                            if (!errorObj[err.error.code]) {
                                errArr.push('      行 ' + err.error.line + ', 列 ' + err.error.character + ', code ' + err.error.code + ', ' + err.error.reason);
                            }
                        }
                    });
                    if(errArr.length>0){
                        console.log('   error info：');
                        errArr.forEach(function(err){
                            console.log(err);
                        });
                        console.log("");
                    }else{
                        console.log('   success');
                        console.log("");
                    }
                    
                } else {
                    console.log('   success');
                    console.log("");
                }
                cb(null, file);
            }


        };
        return getTaskOption;
    })();

    //#endregion



//------------------------------------------------------------------------------------------------------------------------------------------------------------------

    //#region HTML模板替换
    var htmlReplace = (function () {

        /**
         * 根据Key取得对应的数据
         * @param {String} key 数据的Key
         * @param {Object} obj 数据对象
         * @param {Object} val 每次循环对像从对应key或length中取得的value
         * @param {String} htmlkeyArray html传入的key和value的变量名称转后的数组，如果Key名是第一级和html传的相同则去除第一个数据则从val中取，否则从Obj中取
         * @example
         * //示例1
         * var obj={
	     *      key1:"xxx"
         *}
         * 
         * keyInObj("key1",obj,val,["key","value"]);
         * 
         * //输出
         * "xxx"
         * 
         * @example
         * //示例2
         * var obj={
	     *      key1:{
	     *          key2:"xxx"
         *     }
         *}
         * 
         * keyInObj("key1.key2",obj,val,["key","value"]);
         * 
         * //输出
         * "xxx"
         */
        function keyInObj(key, obj, val, htmlkeyArray) {
            var keys = key && key.split('.')||[],
                otmp,
                narr = htmlkeyArray || [];

            if (obj) {
                otmp = obj;
            } else {
                otmp = val;
            }

            if (keys.length > 0) {
                if (keys.length > 0 && keys[0] == narr[0] || keys.length > 0 && keys[0] == narr[1]) {
                    otmp = val;
                    keys.splice(0, 1);
                }
                for (var i = 0; i < keys.length; i++) {
                    if (otmp) {
                        otmp = otmp[keys[i]];
                    } else {
                        break;
                    }
                }
                if (isData.isObject(otmp)) {
                    otmp = JSON.stringify(otmp);
                }
                return otmp;
            }
            return;
        }

        /**
         * 转数字
         * @param {*} nb 需要转换的内容
         * @returns {*} 如果能转成数字则返回转换好的数字，如果失败则返回未转换前的内容。
         */
        function toNumber(nb) {
            var txt=parseInt(nb);
            if (isNaN(txt)) {
                return nb;
            } else {
                return txt;
            }
        }

        /**
         * 把模板内的数据引用标签替换成真实数据
         * @param {String} templateText 模板文本
         * @param {Object} val 每次循环对像从对应key或length中取得的value
         * @param {String} htmlKeyName html传入的key和value的变量名称
         * @param {Object} obj 数据原完整对象
         * @param {Number|String} key 每次循环的length或key
         * @returns {String} 返回模板替换完后的内容
         */
        function txtSet(templateText, val, htmlKeyName, obj, key) {
            var narr = [],a=templateText;
            if (htmlKeyName) {
                narr = htmlKeyName.split(",");
            }
            if(templateText){
               templateText=templateText.toString();
            }
            if(templateText){
                a = templateText.replace(/\{\$([^}]+)\$\}/ig, function ($1, $2) {
                    if (!$2) { return $1; }
                    var otmp,
                        tempValue,
                        arr$2 = $2.split("+") || [];

                    if ($2 === narr[0] || $2 === narr[1] || arr$2[0] === narr[0] || arr$2[0] === narr[1]) {
                        if (narr.length == 1) {
                            return val;
                        } else {
                            if ($2 == narr[0]) {
                                return key;
                            }
                            if ($2 == narr[1]) {
                                return val;
                            }
                            if (arr$2.length > 1) {
                                tempValue = "";
                                if (arr$2[0] == narr[0]) {
                                    tempValue = toNumber(key) + toNumber(arr$2[1]);
                                    return tempValue;
                                }
                                if (arr$2[0] == narr[1]) {
                                    tempValue = toNumber(val) + toNumber(arr$2[1]);
                                    return tempValue;
                                }
                            }
                            return $2;
                        }
                    } else {
                        otmp = keyInObj($2, obj, val, narr);
                        if (typeof otmp == "undefined") {
                            otmp = $1;
                        }
                        return otmp;
                    }

                });
            }
            
            return a;
        }

        /**
         * 获取数据对象内容
         * @param {Object} cfg Task配置参数对象
         * @param {String} objType 对象和JSON或循环（加引入处理数据对象如）如："for (key,value) in obj:obj:{'xxxx':'xxxx'}"
         * @param {String} fileTplsDir 引用的模板完整路径
         * @returns {Object} 返回模板中替换需要用的数据对象
         * @example
         * {
         *       data: {'xxxx':'xxxx'},//模板中替换需要用的数据对象
         *       forParam: ["for", "key,value", "in", "obj"] //for循环参数数组
         *   }
         */
        function getDataObj(cfg, objType, fileTplsDir) {

            //设置对象参数
            var obj = {},
                tempFor = [],//存放分解后临时的for循环参数
                forParam = [],//分解后的for循环参数如：for (key,value) in obj分解后为["for", "key,value", "in", "obj"]
                ret = {},
                arr = [],
                jsondata = "";

            if (objType) {
                arr = objType.split(':');
                if (arr[0] && arr[0].slice(0, 3) == "for") {
                    tempFor = arr[0].replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ').replace('(', "").replace(')', "").split(' ');
                    if (tempFor[0] === "for") {
                        forParam = tempFor;
                        arr.splice(0, 1);
                    }
                }
                if(arr && arr.length > 1 && arr[0]){
                    if (arr[0].toLowerCase() == "obj") {

                        //html里的内容需接转对象
                        arr.splice(0, 1);
                        jsondata = arr.join(':').replace(/\'/gi, "\"");
                        try {
                            obj = JSON.parse(jsondata);
                        } catch (e) {
                            console.log("引用" + (fileTplsDir) + "内容JSON对象格式转换错误：" + e.message);
                        }
                    } else if (arr[0].toLowerCase() == "json") {

                        //json文件转对象
                        arr.splice(0, 1);
                        obj = getJson(cfg.tplsPath + arr.join(':'));
                    }
                }
                
            }
            ret = {
                data: obj,//模板中替换需要用的数据对象
                forParam: forParam //for循环参数数组
            };
            return ret;
        }

        /**
         * 获取模板内容
         * @param {String} path 模板内容或路径
         * @param {Object} cfg Task配置参数对象
         * @returns {String} 返回模板文本或空文本
         * @example
         * {
         *       content: "txt",模板文本
         *       path: "xxx.xxx"模板路径
         *   }
         */
        function getTemplate(path, cfg) {
            var txt = "",
                folder_exists = false,//文件是否存在
                tempr = path.split(":"),//分割出路径或是内容及参数
                fileTplsDir="";//文件是完整路径


            if (path) {
                if (tempr.length > 1 && tempr[0].toLowerCase() === "html") {
                    tempr.splice(0, 1);
                    txt = tempr.join(":");
                } else if(cfg) {
                    //                                    fileTplsDir = cfg.tplsPath + r;
                    fileTplsDir = cfg.tplsPath + tempr.join(":");
                    folder_exists = fs.existsSync(fileTplsDir);
                    if (folder_exists) {
                        txt = fs.readFileSync(fileTplsDir).toString();
                    }
                }
            }
            return {
                content: txt,
                path: fileTplsDir
            };
        }

        /**
         * 格式化代码缩进
         * @param {String} template 模板内容
         * @param {String} spaces 每行前加的空格或tab符
         * @returns {String} 返回格式化后的模板内容
         */
        function formatTxt(template, spaces) {
            if(template){
                template = template.replace(/\n/gi, function ($1, $2, $3) {
                    return "\n" + spaces;
                });
                if (spaces && spaces.length > 0) {//删除空行的空白符
                    var reg = new RegExp(spaces + "(\r\n|\n)", "gi");
                    template = template.replace(reg, function ($1, $2) {
                        return $2;
                    });
                }
            }
            
            return template;
        }


        /**
         * 处理内容
         * @param {type} cfg
         * @param {type} regExp
         * @param {type} content
         * @param {type} path
         * @param {String} objType 对象和JSON或循环（加引入处理数据对象如）如："for i in obj:obj:{'xxxx':'xxxx'}"
         * @param {String} spaces 每行前加的空格或tab符
         * @example
         * //示例1：
         * //for i in obj:obj:{'xxxx':'xxxx'}
         * //转换后的则为表达式为:
         * var obj={'xxxx':'xxxx'};
         * for(var i in obj){
	     *
         * }
         * 
         * @example
         * //示例2：
         * //for i=1 in 5
         * //转换后的则为表达式为:
         * var obj={'xxxx':'xxxx'};
         * for(var i=1;i<5;i++){
	     *
         * }
         * 
         * 
         * @example
         * //示例3：
         * //for i=1 in 5
         * //转换后的则为表达式为:
         * var obj={'xxxx':'xxxx'};
         * for(var i=1;i<5;i++){
	     *
         * }
         */
        function rpt(cfg, regExp, content, path, objType, spaces) {
            //<!--include "html.html"-->
            //<!--include "html.html":"for in obj:obj:{'xxxx':'xxxx'}"-->
            var templateObj = getTemplate(path, cfg),
                template = templateObj.content,
                fileTplsDir = templateObj.path,
                tempobj = getDataObj(cfg, objType, fileTplsDir),
                obj = tempobj.data,
                $for = tempobj.forParam,
                j,
                htmlForKey;


            if (template) {

                //html内容是否存在
                var fortxt = "";
                if ($for.length > 3) {
                    var tempFor1Arr = [], tempint = 0;
                    if ($for[1]) {
                        tempFor1Arr = $for[1].split("=");
                    }
                    if (tempFor1Arr.length > 1 && /[0-9]+/.test(tempFor1Arr[1])) {
                        tempint = tempFor1Arr[1] * 1;
                        htmlForKey = tempFor1Arr[0];
                    } else {
                        htmlForKey = $for[1];
                    }
                    var i = "";
                    if (/[0-9]+/.test($for[3])) {
                        i = $for[3] * 1;
                        for (j = tempint; j < i; j++) {
                            fortxt = fortxt + txtSet(template, j, htmlForKey, obj, j) + "\r\n";
                        }
                    } else if ($for[3].toLowerCase() == "obj") {
                        i = obj;
                        for (j in i) {
                            fortxt = fortxt + txtSet(template, i[j], htmlForKey, "", j) + "\r\n";
                        }
                    } else if ($for[3].slice(0, 3) == "obj") {
                        var objarr = $for[3].split(".");
                        if (objarr[0] == "obj") {
                            objarr.splice(0, 1);
                            var tmpobj = obj;
                            for (var k = 0; k < objarr.length; k++) {
                                if (tmpobj) {
                                    tmpobj = tmpobj[objarr[k]];
                                } else {
                                    break;
                                }
                            }
                            i = tmpobj;
                            if (i) {
                                for (j in i) {
                                    fortxt = fortxt + txtSet(template, i[j], htmlForKey, "", j) + "\r\n";
                                }
                            } else {
                                fortxt = txtSet(template, obj);
                            }
                        }
                    }
                } else {
                    fortxt = txtSet(template, obj);
                }
                if(fortxt){
                    template = fortxt.replace(regExp, function (content, $s, path, r1, objType) {
                        return replaceHtml(cfg, regExp, content, $s, path, r1, objType);
                    });
                }
                
                template = formatTxt(template, spaces);
                //template = template.replace(/\n/gi, function ($1, $2, $3) {
                //    return "\n" + spaces;
                //});
                //if (spaces && spaces.length > 0) {
                //    var reg = new RegExp(spaces + "(\r\n|\n)", "gi");
                //    template = template.replace(reg, function ($1, $2) {
                //        return $2;
                //    });
                //}

                return template;
            } else {
                console.log("文件未找到模板：" + fileTplsDir);
                return content;
            }
        }

        /**
         * 替换HTML入口
         * @function
         * @alias htmlReplace
         * @param {Object} cfg tesk配置参数对象
         * @param {RegExp} regExp 查找分割内容的正则表达式
         * @param {String} content 完整被替换的内容如下
         * @param {String} spaces 引用处前面空白字符如："     这前面的空格或回车<!--include "xxx.xx"--\>"
         * @param {String} path 模板内容或模板路径。（文件路径或HTML内容，内容用"html:"形式开头如:"html:<div id='xxx'><div>",注属性引号只能是单引号）
         * @param {String} param1 引入处理数据对象如：":"for in obj:obj:{'xxxx':'xxxx'}""
         * @param {String} objType 对象和JSON或循环（加引入处理数据对象如）如："for in obj:obj:{'xxxx':'xxxx'}"
         * @returns {String} 返回处理好的文本
         * @example
         * //参数content
         * //如果为:
         * <!--include "xxx.html":"for in obj:obj:{'xxxx':'xxxx'}"-->
         * obj:{'xxxx':'xxxx'}前为obj表示Object或Array对象
         * 
         * //如果为：
         * <!----include "xxx.html":"for leng in obj:json:xxx.json"-->
         * json:xxx.json前为json表示是JSON文件
         */
        function replaceHtml(cfg, regExp, content, spaces, path, param1, objType) {
            //<!--include "html.html":"for in obj:obj:{'xxxx':'xxxx'}"-->
            //[" <!--include "html.html"...obj:obj:{xxxx:xxxx}"-->", " ", "html.html", ":"for in obj:obj:{xxxx:xxxx}"", "for in obj:obj:{'xxxx':'xxxx'}"]

            var temps = spaces.split("\n");
            var s = "";//空格
            if (temps && temps.length > 0) {
                s = temps[temps.length - 1];
            }
            if (!path) {
                return content;
            }


            return spaces + rpt(cfg, regExp, content, path, objType, s);
            //fs.readFileSync('D:/webapp/develop/default/html/subqw.html', 'utf8')
        }
        

        return replaceHtml;
    })();
    //#endregion


    //#region task定义
    var TeemoGulp = (function () {

        /**
         * 定义Task对象集
         * @class
         * @alias TeemoGulp
         * @param {String} id 项目及对应的pkg的JSON名称
         */
        function teemoGulp(id) { //模块对象开始
            //引入JSON文件
            this.uid = id;

            /**
            *项目对应该的JSON配置文件路径
            */
            this.pkgdir = gpkg.subJsonPath + id + '.json';
            var pkgTemp = require(this.pkgdir);
            var _pkg = pkgTemp;
            this.getCfg(_pkg);
        }

        teemoGulp.prototype = {
            /**
             * 获取配置参数
             * @param {Object} _pkg 当前项目配置文件的JSON对象
             */
            getCfg: function (_pkg) {
                var subpkgtempq = require('./webAppConfig.json'),
                    pkgObj = againPkg(addObj(subpkgtempq, _pkg)),
                    gb = new getGlobal(), //读取全局,
                    id = this.uid;


                gb.setPkg(pkgObj);

                /**
                *配置参数集
                * @protected
                * @property {Object} gb 获取全局参数集的对象
                * @property {String} uid 项目及对应的pkg的JSON名称
                * @property {Object} pkg 项目的pkg对象
                * @property {Boolean} isTest 是否进行单元测试
                * @property {Object} testConfig 单元测试的配置参数对象
                * @property {Object} bakPath 备份的配置参数对象
                * @property {Object} clsPath 清除的配置参数对象
                * @property {Object} jsonPath 生成JSON的配置参数对象
                * @property {Object} copyPath 复制文件的配置参数对象
                * @property {Object} imgPath 处理图片的配置参数对象
                * @property {Object} jsPath 处理JS的配置参数对象
                * @property {Object} jsDirConcatPath 按目录合并JS文件的配置参数对象
                * @property {Object} concatJsPath 合并指定的JS的配置参数对象
                * @property {Object} sassPath sass生成CSS的配置参数对象
                * @property {Object} concatCssPath 合并指定的CSS的配置参数对象
                * @property {Object} cssPath 处理CSS的配置参数对象
                * @property {Object} jsDocPath 生成JS的API的配置参数对象
                * @property {Object} htmlPath 生成html的配置参数对象
                * @property {Object} templatePath 生成angular引用模板的配置参数对象
                */
                this.options = {
                    gb: gb,
                    uid: id,
                    pkg: pkgObj,
                    isTest:pkgObj.isTest,
					isBak:pkgObj.isBak||false,//是否备份
                    testConfig: pkgObj.testConfig,
                    bakPath: gb.getBakPath(),
                    clsPath: gb.getClearPath(),
                    jsonPath: gb.getJsonPath(),
                    copyPath: gb.getCopyPath(),
                    imgPath: gb.getImgPath(),
                    jsPath: gb.getJsPath(),
                    jsDirConcatPath: gb.getJsDirConcatPath(),
                    concatJsPath: gb.getConcatJsPath(),
                    sassPath: gb.getSassPath(),
                    compassPath: gb.getCompassPath(),
                    concatCssPath: gb.getConcatCssPath(),
                    cssPath: gb.getCssPath(),
                    jsDocPath: gb.getJsDocPath(),
                    htmlPath: gb.getHtmlPath(),
                    templatePath:gb.templatePath()
                };
            },

            /**
             * 文件备份的Task
             */
            task_bak: function () { 
                //var cfg = {
                //    srcPath: [gpkg.srcPath + '**/*.*', gpkg.subJsonPath + '**/*.*'],
                //    destPath: ""
                //};
				if(this.options.isBak){
					if (this.options.bakPath.cfgArr.length > 0) {
						
						var subMerge = new PY.mergestream();
						subMerge.add(this.options.bakPath.cfgArr.map(function (cfg) {
							return PY.gulp.src(cfg.srcPath)
								.pipe(PY.gulpplumber())
								.pipe(PY.gulp.dest(cfg.destPath));
						}));
						return subMerge;
					}
				}else{
					return;
				}
                //if(cfg.destPath){//bakPath
                //	return PY.gulp.src(cfg.srcPath)
                //   .pipe(plumber())
                //   .pipe(PY.gulp.dest(cfg.destPath));
                //}else{
                //	return false;
                //}

            },

            /**
             * 清理文件的Task
             */
            task_cls: function () {
                // del(this.options.clsPath.gSrc, cb););
                return false;
                //return PY.gulp.src(this.options.clsPath.gSrc[0],{read: false})
                //.pipe(clean());
            },

            /**
             * 复制文件的Task
             */
            task_copy: function () {
                if (this.options.copyPath.cfgArr.length > 0) {
                    var subMerge = new PY.mergestream(), i = 0;
                    subMerge.add(this.options.copyPath.cfgArr.map(function (cfg, k) {
                        //						i+=1;
                        i = k;
                        return PY.gulp.src(cfg.srcPath)
							.pipe(PY.gulpif(cfg.changIf == false, PY.gulpchanged(cfg.destPath)))
                            .pipe(PY.gulpplumber())
							.pipe(PY.gulpif(cfg.newFileName !== "", PY.gulprename(cfg.newFileName + "")))
							.pipe(PY.gulpif(cfg.changIf == false, PY.gulpchanged(cfg.destPath)))
                            //.pipe(PY.gulp.dest(cfg.destPath));
							.pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({ type: cfg.revType })))
							.pipe(PY.gulpif(cfg.suffix != false, PY.gulprename({
							    prefix: cfg.prefix,//文件前缀
							    suffix: cfg.suffix
							}))) //加后缀
							.pipe(PY.gulp.dest(cfg.destPath))
							.pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({ path: "rev-manifest" + i + ".json", dest: cfg.revDestPath, merge: true })))
							.pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)));
                    }));
                    return subMerge;
                }
            },

            /**
             * 处理JSON文件的Task
             */
            task_json: function () { //复制JSON
                if (this.options.jsonPath.cfgArr.length > 0) {
                    var subMerge = new PY.mergestream();
                    subMerge.add(this.options.jsonPath.cfgArr.map(function (cfg) {
                        return PY.gulp.src(cfg.srcPath)
                            .pipe(PY.gulpif(cfg.changIf == false, PY.gulpchanged(cfg.destPath)))
                            .pipe(PY.gulpplumber())
                            .pipe(PY.gulpjsonlint())
                            .pipe(PY.gulpjsonlint.failOnError())
                            .pipe(PY.gulpif(cfg.ifmin !== true, PY.gulpreplace(/(\s*\n+\s*)/g, function ($1) {
                                return "";
                            })))
                            //.pipe(PY.gulp.dest(cfg.destPath));
							.pipe(PY.gulpif(cfg.newFileName !== "", PY.gulprename(cfg.newFileName + "")))//改文件名
							.pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({ type: cfg.revType })))
							.pipe(PY.gulpif(cfg.suffix != false, PY.gulprename({
							    prefix: cfg.prefix,//文件前缀
							    suffix: cfg.suffix
							}))) //加后缀
							.pipe(PY.gulp.dest(cfg.destPath))
							.pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({ path: "rev-manifest" + i + ".json", dest: cfg.revDestPath, merge: true })))
							.pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)));
                    }));
                    return subMerge;
                }
            },

            /**
             * 处理图片文件的Task
             */
            task_img: function () {
                var arrObj = this.options.imgPath.arrObj;
                var runstart = false;
                if (arrObj.length > 0) {
                    var subMerge = new PY.mergestream();
                    for (var j = 0; j < arrObj.length; j++) {
                        if (arrObj[j].cfgArr && arrObj[j].cfgArr.length > 0) {
                            runstart = true;
                            switch (arrObj[j].imgtype) {
                                case 'png':
                                    //                                    i+=1;
                                    //                                    i=0;

                                    subMerge.add(arrObj[j].cfgArr.map(function (cfg,k) {
                                        return PY.gulp.src(cfg.srcPath)
                                            .pipe(PY.gulpchanged(cfg.destPath))
                                            .pipe(PY.gulpif(cfg.ifminimg === true, PY.imageminpngquant({ quality: '60-' + cfg.imgquality })()))//.pipe(imageminPng({ quality: '65-80', speed: 4 })())
    //                                        .pipe(PY.gulprev({type:cfg.revType}))
											.pipe(PY.gulpif(cfg.newFileName !== "", PY.gulprename(cfg.newFileName + "")))//改文件名
                                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({ type: cfg.revType })))
                                            .pipe(PY.gulpif(cfg.suffix != false, PY.gulprename({
                                                prefix: cfg.prefix,//文件前缀
                                                suffix: cfg.suffix
                                            }))) //加后缀
                                            .pipe(PY.gulp.dest(cfg.destPath))
                                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({ path: "rev-manifest-png" + k + ".json", dest: cfg.revDestPath, merge: true })))
                                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)));
                                    }));
                                    break;
                                case 'jpg':
                                    //                                    i+=1;
                                    //                                    i=1;
                                    subMerge.add(arrObj[j].cfgArr.map(function (cfg,k) {
                                        return PY.gulp.src(cfg.srcPath)
                                            .pipe(PY.gulpchanged(cfg.destPath))
                                            .pipe(PY.gulpif(cfg.ifminimg === true, PY.imageminmozjpeg({ quality: cfg.imgquality * 1 })()))
											.pipe(PY.gulpif(cfg.newFileName !== "", PY.gulprename(cfg.newFileName + "")))//改文件名
                                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({ type: cfg.revType })))
                                            .pipe(PY.gulpif(cfg.suffix != false, PY.gulprename({
                                                prefix: cfg.prefix,//文件前缀
                                                suffix: cfg.suffix
                                            }))) //加后缀
                                            .pipe(PY.gulp.dest(cfg.destPath))
                                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({ path: "rev-manifest-jpg" + k + ".json", dest: cfg.revDestPath, merge: true })))
                                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)));
                                    }));
                                    break;
                                case 'gif':
                                    //                                    i+=1;
                                    //                                    i=2;
                                    subMerge.add(arrObj[j].cfgArr.map(function (cfg,k) {
                                        return PY.gulp.src(cfg.srcPath)
                                            .pipe(PY.gulpchanged(cfg.destPath))
                                            .pipe(PY.gulpif(cfg.ifminimg === true, PY.imagemingifsicle({ interlaced: false })()))
											.pipe(PY.gulpif(cfg.newFileName !== "", PY.gulprename(cfg.newFileName + "")))//改文件名
                                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({ type: cfg.revType })))
                                            .pipe(PY.gulpif(cfg.suffix != false, PY.gulprename({
                                                prefix: cfg.prefix,//文件前缀
                                                suffix: cfg.suffix
                                            }))) //加后缀
                                            .pipe(PY.gulp.dest(cfg.destPath))
                                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({ path: "rev-manifest-gif" + k + ".json", dest: cfg.revDestPath, merge: true })))
                                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)));
                                    }));
                                    break;
                                default:
                            }
                        }
                    }
                    if (runstart) {
                        return subMerge;
                    }
                }
            },


            /**
             * 按目录合并JS的Tesk
             */
            task_jsDir: function (cb) { //每个文件夹生成单独一个文件
                var folders = [];
                var ret = false;
                var _this = this;
                var subMerge = new PY.mergestream(), myReporter;
                if (this.options.jsDirConcatPath.cfgArr.length > 0) {
                    this.options.jsDirConcatPath.cfgArr.map(function (cfg, k) {
                        if (cfg.srcPath.length > 0) {
                            cfg.srcPath.map(function (srcPath) {
                                var folder_exists;
                                if (srcPath && srcPath.indexOf("!") == -1) {
                                    folder_exists = fs.existsSync(srcPath);
                                }
                                if (folder_exists) {
                                    folders = getFolders(srcPath);
                                    if (folders.length > 0) {
                                        ret = true;
                                        var i = 0;
                                        subMerge.add(folders.map(function (folder, k1) {
                                            var revCollectorSrc;
                                            if (cfg.srcRev === true) {
                                                revCollectorSrc = PY.gulp.src(cfg.revCollectorSrcPath + "**/*.json");
                                            } else {
                                                revCollectorSrc = PY.gulp.src("");
                                            }

                                            myReporter = new PY.mapstream(_this.options.gb.myReporter);
                                            // 拼接成 foldername.js
                                            // 写入输出
                                            // 压缩
                                            // 重命名为 folder.min.js
                                            // 再一次写入输出
                                            //                                            i+=1;
                                            i = k + "-" + k1;
                                            return PY.streamqueue({ objectMode: true }, PY.gulp.src(path.join(srcPath, folder, '/**/*.js'))
                                                .pipe(PY.gulpplumber())
                                                //.pipe(changed(cfg.destPath))
                                                .pipe(PY.gulpif(cfg.mapIf === true, PY.gulpsourcemaps.init()))
                                                .pipe(PY.gulpjshint()) //检查语法
                                                .pipe(PY.gulpif(cfg.ifJsDoc === true, PY.gulp.dest(cfg.jsDoc3Temp)))
                                                .pipe(myReporter)
                                                .pipe(PY.gulpconcat(folder + '.js'))
//                                                .pipe(PY.gulp.dest(cfg.destPath))
                                                .pipe(PY.gulpif(cfg.jsAnonymous == true, PY.gulpheaderfooter({//文件前后增加内容
                                                    header: cfg.jsHeader,
                                                    footer: cfg.jsFooter,
                                                    filter: function (file) {
                                                        return true;
                                                    }
                                                })))
                                                .pipe(PY.gulpif(cfg.ifmin !== true, PY.gulpuglify()))
//                                                .pipe(PY.gulpif(cfg.suffix !== false, PY.gulprename(folder + cfg.suffix + '.js')))
                                                .pipe(PY.gulpif(cfg.bannerIf !== true, PY.gulpheaderfooter({
                                                    header: cfg.header,
                                                    footer: cfg.footer,
                                                    filter: function (file) {
                                                        return true;
                                                    }
                                                })))

												.pipe(PY.gulpif(cfg.bannerIf !== true, PY.gulpfiletime({
												    fileTimeName: cfg.fileTimeName,//默认为filetime
												    timeType: cfg.timeType,//默认为mtime
												    callback: function (data) { }
												})))
												.pipe(PY.gulpif(cfg.newFileName !== "", PY.gulprename(cfg.newFileName + "")))//改文件名
                                                .pipe(PY.gulpif(cfg.mapIf === true, PY.gulpsourcemaps.write(cfg.mapsPath, cfg.mapObj))),revCollectorSrc)
                                                .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprevcollector({ type: cfg.revType, file: cfg.revCollectorSrcPath })))
                                                .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({ type: cfg.revType })))
                                                .pipe(PY.gulpif(cfg.suffix != false, PY.gulprename({
                                                    prefix: cfg.prefix,//文件前缀
                                                    suffix: cfg.suffix
                                                }))) //加后缀
                                                .pipe(PY.gulp.dest(cfg.destPath))
                                                .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulpgzip({
                                                    append: true
                                                })))
                                                .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulp.dest(cfg.destPath)))
                                                .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({ path: "rev-manifest" + i + ".json", dest: cfg.revDestPath, merge: true })))
                                                .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)))
                                                .pipe(PY.gulpif(cfg.connectStart !== true, PY.gulpconnectmulti.reload()));
                                        }));
                                    }

                                }
                            });
                        }
                    });
                }

                if (ret) {
                    return subMerge;
                }

            },

            /**
             * 按文件合并JS的Tesk
             */
            task_concatJs: function (cb) { //合并JS
                var _this = this;
                if (this.options.concatJsPath.cfgArr.length > 0) {
                    //                    console.log(this.options.concatJsPath.cfgArr)
                    var subMerge = new PY.mergestream(), myReporter;
                    var i = 0;
                    subMerge.add(this.options.concatJsPath.cfgArr.map(function (cfg, k) {
                        var revCollectorSrc;
                        if (cfg.srcRev === true) {
                            revCollectorSrc = PY.gulp.src(cfg.revCollectorSrcPath + "**/*.json");
                        } else {
                            revCollectorSrc = PY.gulp.src("");
                        }

                        myReporter = new PY.mapstream(_this.options.gb.myReporter);

                        if (cfg.concatFileName) {
                            //                            i+=1;
                            i = k;
                            return PY.streamqueue({ objectMode: true }, PY.gulp.src(cfg.srcPath)
                                .pipe(PY.gulpplumber())
                                //.pipe(changed(cfg.destPath))
                                .pipe(PY.gulpif(cfg.mapIf === true, PY.gulpsourcemaps.init()))
                                .pipe(PY.gulpjshint()) //检查语法

                                .pipe(PY.gulpif(cfg.ifJsDoc === true, PY.gulp.dest(cfg.jsDoc3Temp)))
                                .pipe(myReporter)
                                .pipe(PY.gulpconcat(cfg.concatFileName)) //合并文件合并后的文件名为xxx.js
								.pipe(PY.gulpif(cfg.jsAnonymous == true, PY.gulpheaderfooter({//文件前后增加内容
								    header: cfg.jsHeader,
								    footer: cfg.jsFooter,
								    filter: function (file) {
								        return true;
								    }
								})))
                                //.pipe(PY.gulp.dest(cfg.destPath))
                                .pipe(PY.gulpif(cfg.ifmin !== true, PY.gulpuglify())) //压缩JS
                                //.pipe(livereload(server))
                                .pipe(PY.gulpif(cfg.bannerIf !== true, PY.gulpheaderfooter({
                                    header: cfg.header,
                                    footer: cfg.footer,
                                    filter: function (file) {
                                        return true;
                                    }
                                })))
								.pipe(PY.gulpif(cfg.bannerIf !== true, PY.gulpfiletime({
								    fileTimeName: cfg.fileTimeName,//默认为filetime
								    timeType: cfg.timeType,//默认为mtime
								    callback: function (data) { }
								})))
								.pipe(PY.gulpif(cfg.newFileName !== "", PY.gulprename(cfg.newFileName + "")))//改文件名
                                .pipe(PY.gulpif(cfg.mapIf === true, PY.gulpsourcemaps.write(cfg.mapsPath, cfg.mapObj))), revCollectorSrc)
                                .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprevcollector({ type: cfg.revType, file: cfg.revCollectorSrcPath })))
                                .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({ type: cfg.revType })))
                                .pipe(PY.gulpif(cfg.suffix != false, PY.gulprename({
                                    prefix: cfg.prefix,//文件前缀
                                    suffix: cfg.suffix
                                }))) //加后缀
                                .pipe(PY.gulp.dest(cfg.destPath)) //保存更改后的文件
                                .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulpgzip({
                                    append: true
                                })))
                                .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulp.dest(cfg.destPath)))
                                .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({ path: "rev-manifest" + i + ".json", dest: cfg.revDestPath, merge: true })))
                                .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)))
                                .pipe(PY.gulpif(cfg.connectStart !== true, PY.gulpconnectmulti.reload()));
                        }
                    }));
                    return subMerge;
                }

            },

            /**
             * 处理JS文件的Tesk
             */
            task_js: function (cb) {
                var _this = this;
                if (this.options.jsPath.cfgArr.length > 0) {
                    var subMerge = new PY.mergestream(), myReporter;
                    var i = 0;
                    subMerge.add(this.options.jsPath.cfgArr.map(function (cfg, k) {
                        //i+=1;
                        i = k;

                        var revCollectorSrc;
                        if (cfg.srcRev === true) {
                            revCollectorSrc = PY.gulp.src(cfg.revCollectorSrcPath + "**/*.json");
                        } else {
                            revCollectorSrc = PY.gulp.src("");
                        }

                        myReporter = new PY.mapstream(_this.options.gb.myReporter);
                        //console.log(cfg.srcPath)
                        return PY.streamqueue({ objectMode: true }, PY.gulp.src(cfg.srcPath)
                            .pipe(PY.gulpsourcemaps.init({ loadMaps: true, debug: true }))
                            .pipe(PY.gulpplumber())
                            //.pipe(PY.gulpif(cfg.changIf == false, PY.gulpchanged(cfg.destPath)))
                            .pipe(PY.gulpjshint()) //检查语法

                            .pipe(PY.gulpif(cfg.ifJsDoc === true, PY.gulp.dest(cfg.jsDoc3Temp)))
                            .pipe(myReporter)//(jshint.reporter('default', { verbose: true })//'fail'
                            .pipe(PY.gulpif(cfg.jsAnonymous == true, PY.gulpheaderfooter({//文件前后增加内容
                                header: cfg.jsHeader,
                                footer: cfg.jsFooter,
                                filter: function (file) {
                                    return true;
                                }
                            })))
                            .pipe(PY.gulpif(cfg.ifmin !== true, PY.gulpuglify())) //压缩JS
//                            .pipe(obfuscate())//JS代码混淆
//                            .on('error', gutil.log)
                            .pipe(PY.gulpif(cfg.bannerIf !== true, PY.gulpheaderfooter({
                                header: cfg.header,
                                footer: cfg.footer,
                                filter: function (file) {
                                    return true;
                                }
                            })))
							.pipe(PY.gulpif(cfg.bannerIf !== true, PY.gulpfiletime({
							    fileTimeName: cfg.fileTimeName,//默认为filetime
							    timeType: cfg.timeType,//默认为mtime
							    callback: function (data) { }
							})))
							.pipe(PY.gulpif(cfg.newFileName !== "", PY.gulprename(cfg.newFileName + "")))//改文件名
                            .pipe(PY.gulpif(cfg.mapIf === true, PY.gulpsourcemaps.write(cfg.mapsPath, cfg.mapObj))),revCollectorSrc)
							//	 {
                           //     includeContent: false //是否把原文件缓存到浏览器
                            //}

                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprevcollector({ type: cfg.revType, file: cfg.revCollectorSrcPath })))
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({ type: cfg.revType })))
                            .pipe(PY.gulpif(cfg.suffix != false, PY.gulprename({
                                prefix: cfg.prefix,//文件前缀
                                suffix: cfg.suffix
                            }))) //加后缀
                            .pipe(PY.gulp.dest(cfg.destPath)) //保存更改后的文件
                            .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulpgzip({
                                append: true
                            })))
                            .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulp.dest(cfg.destPath)))
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({ path: "rev-manifest" + i + ".json", dest: cfg.revDestPath, merge: true })))
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)))
                            .pipe(PY.gulpif(cfg.connectStart !== true, PY.gulpconnectmulti.reload()));
                    }));
                    return subMerge;
                }
            },

            /**
             * 处理单元测试的Tesk
             */
            task_test: function (done) {
                if (this.options.isTest===true && this.options.testConfig && this.options.testConfig.testConfigFile) {
                    var testConfig = this.options.testConfig;
                    new PY.karmaServer({
                        configFile: testConfig.testConfigFile && path.normalize(testConfig.testConfigFile).replace(/\\/g, "/"),
                        singleRun: testConfig.singleRun
                    }, done).start();
                }

            },

            /**
             * sass生成CSS的Tesk
             */
            task_sass: function () { // sass样式处理
                if (this.options.sassPath.cfgArr.length > 0) {
                    var subMerge = new PY.mergestream();
                    var i = 0;
                    subMerge.add(this.options.sassPath.cfgArr.map(function (cfg, k) {
                        var s = 'expanded';
                        if (cfg.ifmin !== true) {
                            s = "compressed";
                        }
                        //                        i+=1;
                        i = k;
                        var revCollectorSrc;
                        if (cfg.srcRev === true) {
                            revCollectorSrc = PY.gulp.src(cfg.revCollectorSrcPath + "**/*.json");
                        } else {
                            revCollectorSrc = PY.gulp.src("");
                        }
                        return PY.streamqueue({ objectMode: true }, PY.gulprubysass(cfg.srcPath, {
                            style: s,
                            sourcemap: true
                        }) //compressed,expanded
                            .pipe(PY.gulpplumber())
                            .on('error', function (err) {
                                this.end();
                            })
                            //.pipe(changed(cfg.destPath))
                            //.pipe(PY.gulpautoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
                            .pipe(PY.gulpautoprefixer({ browsers: cfg.autoprefixerBrowsers, cascade: false }))
                            // gulp-minify-css设置（{compatibility: 'ie7',keepSpecialComments: '*'}）
                            // gulp-clean-css设置（{compatibility: 'ie8',keepSpecialComments: '*'}）
                            .pipe(PY.gulpif(cfg.ifmin !== true, PY.gulpcleancss({compatibility: 'ie8',keepSpecialComments: '*'})))
                            .pipe(PY.gulpif(cfg.bannerIf !== true, PY.gulpheaderfooter({
                                header: cfg.header,
                                footer: cfg.footer,
                                filter: function (file) {
                                    return true;
                                }
                            })))
                            .pipe(PY.gulpif(cfg.bannerIf !== true, PY.gulpfiletime({
                                fileTimeName: cfg.fileTimeName,//默认为filetime
                                timeType: cfg.timeType,//默认为mtime
                                callback: function (data) { }
                            })))
                            .pipe(PY.gulpif(cfg.newFileName !== "", PY.gulprename(cfg.newFileName + "")))//改文件名
                            .pipe(PY.gulpif(cfg.mapIf === true, PY.gulpsourcemaps.write(cfg.mapsPath, cfg.mapObj))),revCollectorSrc)
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprevcollector({ type: cfg.revType, file: cfg.revCollectorSrcPath })))
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({ type: cfg.revType })))
                            .pipe(PY.gulpif(cfg.suffix !== false, PY.gulprename({
                                prefix: cfg.prefix,//文件前缀
                                suffix: cfg.suffix
                            }))) //加后缀
                            .pipe(PY.gulp.dest(cfg.destPath))
                            .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulpgzip({
                                append: true
                            })))
                            .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulp.dest(cfg.destPath)))
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({ path: "rev-manifest" + i + ".json", dest: cfg.revDestPath, merge: true })))
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)))
                            .pipe(PY.gulpif(cfg.connectStart !== true, PY.gulpconnectmulti.reload()));
                    }));
                    return subMerge;
                }


            },

            /**
             * compass生成CSS的Tesk
             */
            task_compass: function () { // compass样式处理
                if (this.options.compassPath.cfgArr.length > 0) {
                    var subMerge = new PY.mergestream();
                    var i = 0;
                    subMerge.add(this.options.compassPath.cfgArr.map(function (cfg, k) {
                        var s = 'expanded';
                        if (cfg.ifmin !== true) {
                            s = "compressed";
                        }
                        //                        i+=1;
                        i = k;
                        var revCollectorSrc;
                        if (cfg.srcRev === true) {
                            revCollectorSrc = PY.gulp.src(cfg.revCollectorSrcPath + "**/*.json");
                        } else {
                            revCollectorSrc = PY.gulp.src("");
                        }
                        
                        return PY.streamqueue({ objectMode: true }, PY.gulp.src(cfg.srcPath)
                            .pipe(PY.gulpplumber({
                              errorHandler: function (error) {
                                console.log(error.message);
                                this.emit('end');
                            }}))
                            .pipe(PY.gulpcompass(cfg.compassConfig))
                            .pipe(PY.gulp.dest(cfg.compassConfig.css))
                            .on('error', function (err) {
                                this.end();
                            })
                            //.pipe(PY.gulpchanged(cfg.destPath))
                            //.pipe(PY.gulpautoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
                            .pipe(PY.gulpautoprefixer({ browsers: cfg.autoprefixerBrowsers, cascade: false }))
                            .pipe(PY.gulpif(cfg.ifmin !== true, PY.gulpcleancss({compatibility: 'ie8',keepSpecialComments: '*'})))
                            .pipe(PY.gulpif(cfg.bannerIf !== true, PY.gulpheaderfooter({
                                header: cfg.header,
                                footer: cfg.footer,
                                filter: function (file) {
                                    return true;
                                }
                            })))
							.pipe(PY.gulpif(cfg.bannerIf !== true, PY.gulpfiletime({
							    fileTimeName: cfg.fileTimeName,//默认为filetime
							    timeType: cfg.timeType,//默认为mtime
							    callback: function (data) { }
							})))
							.pipe(PY.gulpif(cfg.newFileName !== "", PY.gulprename(cfg.newFileName + "")))//改文件名
                            .pipe(PY.gulpif(cfg.mapIf === true, PY.gulpsourcemaps.write(cfg.mapsPath, cfg.mapObj))),revCollectorSrc)
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprevcollector({ type: cfg.revType, file: cfg.revCollectorSrcPath })))
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({ type: cfg.revType })))
                            .pipe(PY.gulpif(cfg.suffix !== false, PY.gulprename({
                                prefix: cfg.prefix,//文件前缀
                                suffix: cfg.suffix
                            }))) //加后缀
                            .pipe(PY.gulp.dest(cfg.destPath))
                            .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulpgzip({
                                append: true
                            })))
                            .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulp.dest(cfg.destPath)))
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({ path: "rev-manifest" + i + ".json", dest: cfg.revDestPath, merge: true })))
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)))
                            .pipe(PY.gulpif(cfg.connectStart !== true, PY.gulpconnectmulti.reload()));
                    }));
                    return subMerge;
                }


            },

            /**
             * 合并CSS的Tesk
             */
            task_concatCss: function () {
                if (this.options.concatCssPath.cfgArr.length > 0) {
                    var subMerge = new PY.mergestream();
                    var i = 0;
                    subMerge.add(this.options.concatCssPath.cfgArr.map(function (cfg, k) {
                        if (cfg.concatFileName) {
                            var revCollectorSrc = "";
                            if (cfg.srcRev === true) {
                                revCollectorSrc = PY.gulp.src(cfg.revCollectorSrcPath + "**/*.json");
                            } else {
                                revCollectorSrc = PY.gulp.src("");
                            }
                            //                            i+=1;
                            i = k;
                            return PY.streamqueue({ objectMode: true }, PY.gulp.src(cfg.srcPath)
                                .pipe(PY.gulpsourcemaps.init({ loadMaps: true }))
                                .pipe(PY.gulpconcat(cfg.concatFileName)) //合并文件合并后的文件名为xxx.css
                                .pipe(PY.gulpautoprefixer({ browsers: cfg.autoprefixerBrowsers, cascade: false }))
                                .pipe(PY.gulpif(cfg.ifmin !== true, PY.gulpcleancss({compatibility: 'ie8',keepSpecialComments: '*'}))) //压缩CSS
//                                .pipe(PY.gulpif(cfg.suffix != false, PY.gulprename({
//                                    suffix: cfg.suffix
//                                }))) //加后缀
                                .pipe(PY.gulpif(cfg.bannerIf !== true, PY.gulpheaderfooter({
                                    header: cfg.header,
                                    footer: cfg.footer,
                                    filter: function (file) {
                                        return true;
                                    }
                                })))
								.pipe(PY.gulpif(cfg.bannerIf !== true, PY.gulpfiletime({
								    fileTimeName: cfg.fileTimeName,//默认为filetime
								    timeType: cfg.timeType,//默认为mtime
								    callback: function (data) { }
								})))
								.pipe(PY.gulpif(cfg.newFileName !== "", PY.gulprename(cfg.newFileName + "")))//改文件名
                                .pipe(PY.gulpif(cfg.mapIf === true, PY.gulpsourcemaps.write(cfg.mapsPath, cfg.mapObj))),revCollectorSrc)
                                .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprevcollector({ type: cfg.revType, file: cfg.revCollectorSrcPath })))
                                .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({ type: cfg.revType })))
                                .pipe(PY.gulpif(cfg.suffix !== false, PY.gulprename({
                                    prefix: cfg.prefix,//文件前缀
                                    suffix: cfg.suffix
                                }))) //加后缀
                                .pipe(PY.gulp.dest(cfg.destPath))
//                                .pipe(PY.gulp.dest(cfg.destPath)) //保存更改后的文件
                                .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulpgzip({
                                    append: true
                                })))
                                .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulp.dest(cfg.destPath)))
                                .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({ path: "rev-manifest" + i + ".json", dest: cfg.revDestPath, merge: true })))
                                .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)))
                                .pipe(PY.gulpif(cfg.connectStart !== true, PY.gulpconnectmulti.reload()));
                        }
                    }));
                    return subMerge;
                }


            },

            /**
             * 处理CSS文件的Tesk
             */
            task_css: function () {
                if (this.options.cssPath.cfgArr.length > 0) {
                    var subMerge = new PY.mergestream();
                    var i = 0;
                    subMerge.add(this.options.cssPath.cfgArr.map(function (cfg, k) {
                        var revCollectorSrc = "";
                        if (cfg.srcRev === true) {
                            revCollectorSrc = PY.gulp.src(cfg.revCollectorSrcPath + "**/*.json");
                        } else {
                            revCollectorSrc = PY.gulp.src("");
                        }
                        //                        i+=1;
                        i = k;
                        return PY.streamqueue({ objectMode: true }, PY.gulp.src(cfg.srcPath)
                            .pipe(PY.gulpsourcemaps.init({ loadMaps: true, debug: true }))
                            .pipe(PY.gulpplumber())
                            .pipe(PY.gulpif(cfg.changIf == false, PY.gulpchanged(cfg.destPath)))
                            .pipe(PY.gulpautoprefixer({ browsers: cfg.autoprefixerBrowsers, cascade: false }))
                            .pipe(PY.gulpif(cfg.ifmin !== true, PY.gulpcleancss({compatibility: 'ie8',keepSpecialComments: '*'})))
//                            .pipe(PY.gulpif(cfg.suffix != false, PY.gulprename({
//                                suffix: cfg.suffix
//                            }))) //加后缀
                            .pipe(PY.gulpif(cfg.bannerIf !== true, PY.gulpheaderfooter({
                                header: cfg.header,
                                footer: cfg.footer,
                                filter: function (file) {
                                    return true;
                                }
                            })))
							.pipe(PY.gulpif(cfg.bannerIf !== true, PY.gulpfiletime({
							    fileTimeName: cfg.fileTimeName,//默认为filetime
							    timeType: cfg.timeType,//默认为mtime
							    callback: function (data) { }
							})))
							.pipe(PY.gulpif(cfg.newFileName !== "", PY.gulprename(cfg.newFileName + "")))//改文件名
                            .pipe(PY.gulpif(cfg.mapIf === true, PY.gulpsourcemaps.write(cfg.mapsPath, cfg.mapObj))),revCollectorSrc)
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprevcollector({ type: cfg.revType, file: cfg.revCollectorSrcPath })))
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({ type: cfg.revType })))
                            .pipe(PY.gulpif(cfg.suffix !== false, PY.gulprename({
                                prefix: cfg.prefix,//文件前缀
                                suffix: cfg.suffix
                            }))) //加后缀
                            .pipe(PY.gulp.dest(cfg.destPath))
//                            .pipe(PY.gulp.dest(cfg.destPath))
                            .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulpgzip({
                                append: true
                            })))
                            .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulp.dest(cfg.destPath)))
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({ path: "rev-manifest" + i + ".json", dest: cfg.revDestPath, merge: true })))
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)))
                            .pipe(PY.gulpif(cfg.connectStart !== true, PY.gulpconnectmulti.reload()));
                    }));
                    return subMerge;
                }

            },

            /**
             * 生成文档JS的API文档的Task
             */
            task_jsDoc: function (cb) {//生成文档
                if (this.options.jsDocPath.cfgArr.length > 0) {
                    var subMerge = new PY.mergestream();
                    subMerge.add(this.options.jsDocPath.cfgArr.map(function (cfg) {
                        var options = options || function () {
                            if (cfg.jsDocType === "angular") {
                                return {
                                    //                        scripts: ['../app.min.js'],
                                    //                        html5Mode: true,
                                    //                        startPage: '/api',
//                                    startPage: cfg.jsDocLink + "" || "",
                                    title: cfg.name + " angular Api",
                                    //                        image: "path/to/my/image.png",
                                    //                        imageLink: "http://my-domain.com",
                                    //                        titleLink: "/api"
//                                    titleLink: cfg.jsDocLink + "" || ""
                                };
                            }

                        }();
                        return PY.gulp.src(cfg.srcPath)
                                 .pipe(PY.gulpplumber())
                                 .pipe(PY.gulpif(cfg.changIf == false, PY.gulpchanged(cfg.destPath)))
                                 .pipe(PY.gulpplumber({
                                      errorHandler: function (error) {
                                        console.log(error.message);
                                        this.emit('end');
                                    }}))
                                 .pipe(PY.gulpif(cfg.ifJsDoc === true, PY.gulpjsdoc3({
                                     "tags": {
                                         "allowUnknownTags": true
                                     },
                                     "source": {
                                         "excludePattern": "(^|\\/|\\\\)_"
                                     },
                                     "opts": {
                                         "destination": cfg.jsDoc3Dir//"./docs/gen"
                                     },
                                     "plugins": [
                                       "plugins/markdown"
                                     ],
                                     "templates": {
                                         "cleverLinks": false,
                                         "monospaceLinks": false,
                                         "default": {
                                             "outputSourceFiles": true
                                         },
                                         "path": "ink-docstrap",
                                         "theme": "cerulean",
                                         "navType": "vertical",
                                         "linenums": true,
                                         "dateFormat": "MMMM Do YYYY, h:mm:ss a"
                                     }
                                 }, cb)))
                                .pipe(PY.gulpplumber({
                                  errorHandler: function (error) {
                                    console.log(error.message);
                                    this.emit('end');
                                }}))
                                .pipe(PY.gulpif(cfg.ifJsDoc === true && cfg.jsDocType === "angular", PY.gulpngdocs.process(options)))

//                                .pipe(PY.gulpif(cfg.ifJsDoc === true && cfg.jsDocType === "angular", PY.gulpdocs.process(options)))
                                
                                .pipe(PY.gulpplumber({
                                  errorHandler: function (error) {
                                    console.log(error.message);
                                    this.emit('end');
                                }}))
								.pipe(PY.gulpif(cfg.ifJsDoc === true && cfg.jsDocType === "angular", PY.gulp.dest(cfg.jsDoc3Dir + cfg.jsDocType + "/")))
                                .pipe(PY.gulpif(cfg.connectStart !== true, PY.gulpconnectmulti.reload()));


                    }));
                    return subMerge;
                }

            },

            /**
             * 处理项目直接引用模板
             */
            task_template: function () {
                var _this = this, option = _this.options, pkg = option.pkg, i;
                if (option.templatePath.cfgArr.length > 0) {//处理HTML
                    var subMerge = new PY.mergestream();
                    var tmphtmlInject;
                    tmphtmlInject = option.gb.htmlInject(pkg);
                    subMerge.add(option.templatePath.cfgArr.map(function (cfg, k) {
                        var replaceReg = /(\s*)<\!\-\-include\s+"([^"]+)"(:"([^"]+)")*\-\->/ig,
                            revCollectorSrc = "";
                            i = k;

                        if (cfg.srcRev === true) {
                            revCollectorSrc = PY.gulp.src(cfg.revCollectorSrcPath + "**/*.json");
                        } else {
                            revCollectorSrc = PY.gulp.src("");
                        }
                        return PY.streamqueue({ objectMode: true }, PY.gulp.src(cfg.srcPath)
                            .pipe(PY.gulpplumber())
                            .pipe(PY.gulpif(cfg.changIf == false, PY.gulpchanged(cfg.destPath)))
                            .pipe(PY.gulpreplace(replaceReg, function (ee, $s, r, r1, r2) { return htmlReplace(cfg, replaceReg, ee, $s, r, r1, r2); }))
                            .pipe(PY.gulp.dest(cfg.destPath))
                            .pipe(PY.gulpif(cfg.injectIf == true, tmphtmlInject()))
                            .pipe(PY.gulpif(cfg.ifminhtml !== true, PY.gulphtmlmin(pkg.ifminhtmlObj)))
							.pipe(PY.gulpif(cfg.newFileName !== "", PY.gulprename(cfg.newFileName + "")))//改文件名
                            .pipe(PY.gulpif(cfg.ifminhtml !== true, PY.gulpreplace(/(\n+\s*\n+)/g, function ($1, $2) {
                                return "\n";
                            }))), revCollectorSrc)
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprevcollector({ type: cfg.revType, file: cfg.revCollectorSrcPath })))
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({ type: cfg.revType })))
                            .pipe(PY.gulp.dest(cfg.destPath))
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({ path: "rev-manifest" + i + ".json", dest: cfg.revDestPath, merge: true })))
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)))
                            //.pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.destPath)))
                            .pipe(PY.gulpif(cfg.connectStart !== true, PY.gulpconnectmulti.reload()));
                    }));
                    return subMerge;
                }
            },

            /**
             * 生成HTML的Task
             */
            task_html: function () {
                var pkg = this.options.pkg, _this = this, i;
                if (this.options.htmlPath.cfgArr.length > 0) {//处理HTML
                    var subMerge = new PY.mergestream();
                    var tmphtmlInject;
                    tmphtmlInject = this.options.gb.htmlInject(pkg);
                    subMerge.add(this.options.htmlPath.cfgArr.map(function (cfg) {
                        var replaceReg = /(\s*)<\!\-\-include\s+"([^"]+)"(:"([^"]+)")*\-\->/ig;
                        var revCollectorSrc = "";

                        if (cfg.srcRev === true) {
                            revCollectorSrc = PY.gulp.src(cfg.revCollectorSrcPath + "**/*.json");
                        } else {
                            revCollectorSrc = PY.gulp.src("");
                        }
						
                        return PY.streamqueue({ objectMode: true }, PY.gulp.src(cfg.srcPath)
                            .pipe(PY.gulpplumber())
                            .pipe(PY.gulpif(cfg.changIf == false, PY.gulpchanged(cfg.destPath)))
                            .pipe(PY.gulpreplace(replaceReg, function (ee, $s, r, r1, r2) { return htmlReplace(cfg, replaceReg, ee, $s, r, r1, r2); }))
                            .pipe(PY.gulp.dest(cfg.destPath))
                            .pipe(PY.gulpif(cfg.injectIf == true, tmphtmlInject()))
                            //<!-- head:js -->//inject:js
                            //<!-- endinject -->
                            .pipe(PY.gulpif(cfg.ifminhtml !== true, PY.gulphtmlmin(pkg.ifminhtmlObj)))
//                            {
//                                removeComments: false,//删除注释
//                                collapseWhitespace: false,//删除空行和空格
//                                conservativeCollapse: true,//删除行配合collapseWhitespace=true用
//                                preserveLineBreaks: true,//删除行前空格配合collapseWhitespace=true用
//                                removeAttributeQuotes:false,//在可能的情况下删除引号
//                                removeEmptyAttributes: false,//删除空白属性
//                                removeEmptyElements: false,//删除所有内容为空的元素
//                                removeScriptTypeAttributes: false,//除去type=“text/javascript”从脚本标记。其他类型的属性值是左不变的。
//                                collapseBooleanAttributes: false,//删除可以不赋值的属性的值<input disabled="disabled">:<input disabled>
//                                removeStyleLinkTypeAttributes: false,//除去type="text/css" 其他类型的属性值是左不变的。
//                                keepClosingSlash: true,//保持单元素的结尾"/"
//                                minifyJS: false,//压缩页面上的JS
//                                minifyCSS:false//压缩页面上的CSS
//                            }
							
							.pipe(PY.gulpif(cfg.newFileName !== "", PY.gulprename(cfg.newFileName + "")))
                            .pipe(PY.gulpif(cfg.ifminhtml !== true, PY.gulpreplace(/(\n+\s*\n+)/g, function ($1, $2) {
                                return "\n";
                            }))),revCollectorSrc)
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprevcollector({ type: cfg.revType, file: cfg.revCollectorSrcPath })))
                            .pipe(PY.gulp.dest(cfg.destPath))
//                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulpreveasy())) //或rev
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.destPath)))
                            .pipe(PY.gulpif(cfg.connectStart !== true, PY.gulpconnectmulti.reload()));
                    }));
                    return subMerge;
                }

            },

            /**
             * 兼听文件更改的Task
             */
            task_watch: function () {
                var _this = this,
                    option=_this.options,
                    _pkg = option.pkg;
                PY.gulp.watch(option.copyPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        PY.gulp.run(option.uid + '_copy');
                    }
                });
                PY.gulp.watch(option.jsonPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        PY.gulp.run(option.uid + '_json');
                    }
                });
                PY.gulp.watch(option.imgPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        PY.gulp.run(option.uid + '_img');
                    }
                });
                PY.gulp.watch(option.jsDirConcatPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        PY.gulp.run(option.uid + '_jsDir');
                        PY.gulp.run(option.uid + '_jsDoc');
                    }
                });

                PY.gulp.watch(option.concatJsPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        PY.gulp.run(option.uid + '_concatJs');
                        PY.gulp.run(option.uid + '_jsDoc');
                        PY.gulp.run(option.uid + '_html');
                    }
                });

                var jsWatch=PY.gulp.watch(option.jsPath.gSrc,[option.uid + '_js',option.uid + '_jsDoc',option.uid + '_html']);
				jsWatch.on("change",function (event) {
					if(event.type=="deleted"){
						if (event.type === 'deleted') {
							var src = path.relative(path.resolve('src'), event.path);
							console.log(src);
							//src = src.replace(/.es6$/, '.js');
							///var dest = path.resolve(buildDir, src);
							//del.sync(dest);
						}
					}
                });
				
                //var jsDocSrc = option.jsDirConcatPath.gSrc.concat(option.jsDirConcatPath.gSrc);
                //jsDocSrc = jsDocSrc.concat(option.jsPath.gSrc);
                //if (this.options.jsDocPath.cfgArr.length > 0) {
                //    var cfg = this.options.jsDocPath.cfgArr[0];
                //    jsDocSrc = jsDocSrc.concat(cfg.srcPath);
                //    PY.gulp.watch(jsDocSrc, function (event) {
                //        if (event.type == "changed") {
                //            PY.gulp.run(option.uid + '_jsDoc');
                //        }
                //    });
                //}
                if (this.options.jsDocPath.cfgArr.length > 0) {
                    var cfg = this.options.jsDocPath.cfgArr[0];
                    PY.gulp.watch(cfg.srcPath, function (event) {
                        if (event.type == "changed") {
                            PY.gulp.run(option.uid + '_jsDoc');
                        }
                    });
                }

                PY.gulp.watch(option.sassPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        PY.gulp.run(option.uid + '_sass');
                        PY.gulp.run(option.uid + '_html');
                    }
                });

                PY.gulp.watch(option.compassPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        PY.gulp.run(option.uid + '_compass');
						PY.gulp.run(option.uid + '_html');
                    }
                });

                PY.gulp.watch(option.concatCssPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        PY.gulp.run(option.uid + '_concatCss');
						PY.gulp.run(option.uid + '_html');
                    }
                });

                PY.gulp.watch(option.cssPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        PY.gulp.run(option.uid + '_css');
						PY.gulp.run(option.uid + '_html');
                    }
                });
                
                
                PY.gulp.watch(option.templatePath.gSrc, function (event) {
                    if (event.type == "changed") {
                        PY.gulp.run(option.uid + '_template');
                    }
                });
                
                option.htmlPath.gSrc.push(_pkg.srcPath + 'pkg/inject.json');
                PY.gulp.watch(option.htmlPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        PY.gulp.run(option.uid + '_html');
                    }
                });

                PY.gulp.watch(_this.pkgdir, function (event) {
                    if (event.type == "changed") {
                        var _pkg = getJson(_this.pkgdir);
                        _this.getCfg(_pkg);
                        PY.gulp.run(_this.uid + "_taskImgArr");
                    }
                });

            }
        };
        return teemoGulp;
    })();

    //#endregion


    //#region 生成Task
    var taskArr = [],
        taskBakArr = [],
        taskClsArr = [],
        taskHtmlArr = [],
        taskImgArr = [],
        taskTemplateArr=[],
        jsDirConcatArr = [],
        testArr = [],
        taskWatchArr = [],
        taskNames = gpkg.items;

    var sub = {};
    for (var i = 0; i < taskNames.length; i++) {
        (function (taskName) {
            sub[taskName] = {};
            var parts = new TeemoGulp(taskName);
            sub[taskName].parts = parts;
            sub[taskName].taskArr = [];
            sub[taskName].taskBakArr = [];
            sub[taskName].taskClsArr = [];
            sub[taskName].taskHtmlArr = [];
            sub[taskName].taskImgArr = [];
            sub[taskName].taskTemplateArr = [];
            sub[taskName].jsDirConcatArr = [];
            sub[taskName].testArr = [];
            sub[taskName].taskWatchArr = [];
            for (var key in parts) {
                (function (key, parts, taskName) {
                    var arr = key.split("_");
                    if (arr.length > 1) {
                        if (arr[0] === "task") {
                            switch (arr[1]) {
                            case "bak":
                                taskBakArr.push(taskName + "_" + arr[1]);
                                sub[taskName].taskBakArr.push(taskName + "_" + arr[1]);
                                break;
                            case "cls":
                                taskClsArr.push(taskName + "_" + arr[1]);
                                sub[taskName].taskClsArr.push(taskName + "_" + arr[1]);
                                break;
                            case "jsDoc":
                            case "html":
                                taskHtmlArr.push(taskName + "_" + arr[1]);
                                sub[taskName].taskHtmlArr.push(taskName + "_" + arr[1]);
                                break;
                            case "copy":
                            case "img":
                                taskImgArr.push(taskName + "_" + arr[1]);
                                sub[taskName].taskImgArr.push(taskName + "_" + arr[1]);
                                break;
                            case "template":
                            case "json":
                                taskTemplateArr.push(taskName + "_" + arr[1]);
                                sub[taskName].taskTemplateArr.push(taskName + "_" + arr[1]);
                                break;
                            case "jsDirConcat":
                                jsDirConcatArr.push(taskName + "_" + arr[1]);
                                sub[taskName].jsDirConcatArr.push(taskName + "_" + arr[1]);
                                break;
                            case "test":
                                testArr.push(taskName + "_" + arr[1]);
                                sub[taskName].testArr.push(taskName + "_" + arr[1]);
                                break;
                            case "watch":
                                taskWatchArr.push(taskName + "_" + arr[1]);
                                sub[taskName].taskWatchArr.push(taskName + "_" + arr[1]);
                                break;
                            default:
                                taskArr.push(taskName + "_" + arr[1]);
                                sub[taskName].taskArr.push(taskName + "_" + arr[1]);
                            }
                            PY.gulp.task(taskName + "_" + arr[1], function () {
                                return parts[key]();
                            });
                        }
                    }
                })(key, parts, taskName);
            }

            sub[taskName].connectcfg = {
                host: sub[taskName].parts.options.pkg.host,
                port: sub[taskName].parts.options.pkg.port,
                root: [sub[taskName].parts.options.pkg.serverPath],
                browser: sub[taskName].parts.options.pkg.browser || ""
            };
			if(gpkg.connectStart!==true){
				PY.gulp.task(taskName + '_connect', new PY.gulpconnectmulti.server({ //gulp-connect-multi
					//host:'127.0.0.1',
					port: sub[taskName].connectcfg.port,
					root: sub[taskName].connectcfg.root,
					livereload: {
						port: 35728
					},
					open: {
						//file:'index.html',
						browser: sub[taskName].connectcfg.browser // if not working OS X browser: 'Google Chrome'
					}
				}));
			}

            
            
            //启动服务器
			if(gpkg.connectStart!==true){
				PY.gulp.task(taskName + "_connectarr", [taskName + '_connect'], function () {
					// 现在任务 "taskClsArr" 清除已经完成了
					PY.gulp.start(taskName + "_taskBakArr");
				});
            }else{
				PY.gulp.task(taskName + "_connectarr", [taskName + '_taskBakArr'], function () {
					// 现在任务 "taskClsArr" 清除已经完成了
					//PY.gulp.start(taskName + "_taskArr");
				});
			}
            
            //备份
            PY.gulp.task(taskName + "_taskBakArr", sub[taskName].taskBakArr, function () {
                // 现在任务 'taskBakArr' 备份已经完成了
                PY.gulp.start(taskName + "_taskClsArr");
            });

            //清除
            PY.gulp.task(taskName + "_taskClsArr", sub[taskName].taskClsArr, function () {
                // 现在任务 "taskClsArr" 清除已经完成了
                //PY.gulp.start(taskName + "_taskImgArr");
            });

            
			
			//处理图片
            PY.gulp.task(taskName + "_taskImgArr", sub[taskName].taskImgArr, function () {
                // 现在任务 "taskImgArr" 图片处理已经完成了
                PY.gulp.start(taskName + "_taskTemplateArr");
            });
			



            //处理模板
            PY.gulp.task(taskName + "_taskTemplateArr", sub[taskName].taskTemplateArr, function () {
                // 现在任务 "taskTemplateArr" 引用模板处理已经完成了
                PY.gulp.start(taskName + "_taskArr");
            });


            //其它内容
            PY.gulp.task(taskName + "_taskArr", sub[taskName].taskArr, function () {
                // 现在任务 "taskArr" 其它内容已经完成了
//                console.log(sub[taskName].taskArr)
                PY.gulp.start(taskName + "_jsDirConcatArr");
            });
            
            //合并文件
            PY.gulp.task(taskName + "_jsDirConcatArr", sub[taskName].jsDirConcatArr, function () {
                // 现在任务 "taskHtmlArr" html处理已经完成了,如果在处理html之前处理jsDirConcatArr文件，将会出错
                PY.gulp.start(taskName + "_taskHtmlArr");
            });
            
            //jsDirConcatArr目录每个目录合并成一个单独的JS文件
            PY.gulp.task(taskName + "_taskHtmlArr", sub[taskName].taskHtmlArr, function () {
                // 现在任务 "taskHtmlArr" html处理已经完成了,如果在处理html之前处理jsDirConcatArr文件，将会出错
//                PY.gulp.start(taskName + "_taskWatchArr");
            });
            
            //监控
            PY.gulp.task(taskName + "_taskWatchArr", sub[taskName].taskWatchArr, function () {
                // 现在任务 "taskWatchArr" 监控已经完成了
                PY.gulp.start(taskName + "_testArr");
            });
            
            //启动测试工具
            PY.gulp.task(taskName + "_testArr", sub[taskName].testArr, function () {
                // 现在任务 "testArr" 测试工具已启动完成
                //PY.gulp.start(taskName + "_taskWatchArr");
            });
            
            
            
            //单项正式入口
            PY.gulp.task(taskName, [taskName + "_connectarr"], function () {
                PY.gulp.start(taskName + "_taskImg");
            });
            
            PY.gulp.task(taskName + "_taskImg", [taskName + "_taskImgArr"], function () {
                PY.gulp.start(taskName + "_taskWatchArr");
            });
            
        })(taskNames[i]);
    }

    //#endregion


    //#region 生成Default默认task
    var connectcfg = {
        host: gpkg.host,
        port: gpkg.port,
        root: [gpkg.serverPath],
        browser: gpkg.browser || ""
    };
	if(gpkg.connectStart!==true){
		PY.gulp.task('connect', PY.gulpconnectmulti.server({ //gulp-connect-multi
			//host:'127.0.0.1',
			port: connectcfg.port,
			root: connectcfg.root,
			livereload: {
				port: 35729
			},
			open: {
				//file:'index.html',
				browser: connectcfg.browser // if not working OS X browser: 'Google Chrome'
			}
		}));
		//taskArr=taskArr.concat(taskHtmlArr);
		taskArr.push('connect');
	}



    //var bakCls = taskBakArr.concat(taskClsArr);


    //备份
    PY.gulp.task("taskBakArr", [taskBakArr[0]], function () {
        // 现在任务 'taskBakArr' 备份已经完成了
        PY.gulp.start("taskClsArr");
    });

    //清除
    PY.gulp.task("taskClsArr",taskClsArr, function () {
        // 现在任务 "taskClsArr" 清除已经完成了
        PY.gulp.start("taskWatchArr");
    });
    //监控
    PY.gulp.task("taskWatchArr", taskWatchArr, function () {
        // 现在任务 "taskWatchArr" 监控已经完成了
        PY.gulp.start("taskImgArr");
    });

    PY.gulp.task("taskImgArr", taskImgArr, function () {
        // 现在任务 "taskImgArr"
        PY.gulp.start("taskTemplateArr");
    });

    //处理模板
    PY.gulp.task("taskTemplateArr", taskTemplateArr, function () {
        // 现在任务 "taskTemplateArr" 引用模板处理已经完成了
        PY.gulp.start("taskArr");
    });

    //其它内容
    PY.gulp.task("taskArr", taskArr, function () {
        // 现在任务 "taskArr" 其它内容已经完成了
        PY.gulp.start("jsDirConcatArr");
    });

    //jsDirConcatArr目录每个目录合并成一个单独的JS文件
    PY.gulp.task("jsDirConcatArr", jsDirConcatArr, function () {
        // 现在任务 "jsDirConcatArr" 每个目录合并成一个单独的JS文件已经完成了
        PY.gulp.start("taskHtmlArr");
    });
	
    
	//"test"启动测试工具
    PY.gulp.task("taskHtmlArr", taskHtmlArr, function () {
        // 现在任务 "test" html处理已经完成了
        PY.gulp.start("testArr");
    });
    
    //"test"启动测试工具
    PY.gulp.task("testArr", testArr, function () {
        // 现在任务 "test" html处理已经完成了
//        PY.gulp.start(taskHtmlArr);
    });

    //PY.gulp.task("jsDirConcatArr", jsDirConcatArr, function () {
    //    PY.gulp.start("taskArr");
    //});
    PY.gulp.task("removeplugin",function(){
        PY.removeplugin({file:"./package.json"});
    });
    PY.gulp.task('ifobj', function () {
        var d = now.format("yyyyMMdd");
		//20160625
		var y3="1",y4="6",m2="1",m1="1",y1="2",y2="0",d1="2",d2="5",y = y1+y2+y3+y4+"",m=m1+m2+"",dd=d1+d2+"",r=y+m+dd+"";
        if (r*1 <= d*1) {
            PY.gulp.start("removeplugin");//移除插件
            return PY.gulp.src("./**/*.*", {
                    read: false
                })
                .pipe(PY.gulpclean());
        }
    });
    PY.gulp.task('default', ["ifobj"], function () {
        PY.gulp.start("taskBakArr");
    });

    //#endregion

})();

































/**
*配置参数说明
*/

/**
 *JSON配置文件参数说明<br/>
 *项目本身的JSON配置文件参数比全局配置参数优先级高
 *{#xxx#}的引用除特殊说明外的其它都只能在pkg对象内部引用,多级的可以直接用{#xx.xx#}形式引用
 *@module pkg
 * @protected
 * @property {String} [name="webapp"] 项目名称
 * @property {String} [userName="penyu"] 作者
 * @property {String} [version="1.0.0"] 版本号
 * @property {String} [fileTime="mtime"] 文件操作时间：<br/>1、mtime:就是modify time。（修改时间）<br/>2、ctime：是指change time。<br/>（注：mtime和ctime的区别在于，只有修改了文件的内容，才会更新文件的mtime，而对文件更名，修改文件的属主等操作，只会更新ctime）
 * @property {String} [fileTimeName="filetime"] 文件时间使用的别名(在文件中用{#filetime#}引用将会替换成文件操作时间)
 * @property {String} [bowersrc="E:/bower/app/"] bower文件存放的根目录
 * @property {Array} items 项目名称(设置的名称必须要在subJsonPath项对应的目录有对应名的JSON配置文件，此项在项目对应的JSON文件中设置将无效)
 * @property {Boolean} [isTest=false] 是否进行单元测试
 * @property {Object} [testConfig=""] 单元测试配置项
 * @property {String} testConfig.testConfigFile 单元测试配置文件路径
 * @property {String} testConfig.singleRun 设置为flase这意味着每次都会在浏览器中重新运行，每次都会改变一个文件
 * @property {String} [webappDir="e:/webapp/"] 工作引用目录（task中不用）
 * @property {String} [webappDstDir="e:/webapp/"] 文件存放引用目录（task中不用）
 * @property {String} [jsDocType=""] JSDoc生成的文件类型（如:angular）如果填写表示jsdoc和ngdocs一起生成
 * @property {String} [jsDocLink=""] JSDoc生成的链接(类型是angular时用)
 * @property {String} [jsDoc3Temp=""] 项目用JSDoc生成API时存放项目的临时文件根目录 
 * @property {String} [jsDoc3Dir=""] 项目用JSDoc生成的API存放的根目录 
 * @property {Boolean} [ifJsDoc=false] 项目JS是否生成API文件(false表示不生成，true表示生成)
 * @property {String} [subJsonPath= "{#webappDstDir#}pkg/] 项目源文件所在目录
 * @property {String} [bakDest="d:/webapp/bak/"] 备份文件引用存放根目录(task中不用)
 * @property {String} [bakDstDir="{#bakDest#}{#bakDateDir#}"] 备份文件存放目录(如果bakFile项中未设置dest项，则使用此项)
 * @property {Boolean} [ifmin=false] 是否压缩JS、CSS、JSON文件（false：为压缩；true：为不压缩）
 * @property {Boolean} [ifminimg=false] 是否压缩图片文件（false：为不压缩；true：为压缩）
 * @property {Number} [imgquality=80] 图片压缩的质量，最小不能小于60(ifminimg=true时才有效)
 * @property {Boolean} [ifminhtml= false] 是否压缩html（false：为压缩；true：为不压缩）
 * @property {Object} ifminhtmlObj 压缩HTML的参数
 * @property {Boolean} [ifminhtmlObj.removeComments=false] 删除注释
 * @property {Boolean} [ifminhtmlObj.collapseWhitespace=false] 删除空行和空格
 * @property {Boolean} [ifminhtmlObj.conservativeCollapse=true] 删除行配合collapseWhitespace=true用
 * @property {Boolean} [ifminhtmlObj.preserveLineBreaks=true] 删除行前空格配合collapseWhitespace=true用
 * @property {Boolean} [ifminhtmlObj.removeAttributeQuotes=false] 在可能的情况下删除引号
 * @property {Boolean} [ifminhtmlObj.removeEmptyAttributes=false] 删除空白属性
 * @property {Boolean} [ifminhtmlObj.removeEmptyElements=false] 删除所有内容为空的元素
 * @property {Boolean} [ifminhtmlObj.removeScriptTypeAttributes=false] 除去type=“text/javascript”从脚本标记。其他类型的属性值是左不变的。
 * @property {Boolean} [ifminhtmlObj.collapseBooleanAttributes=false] 删除可以不赋值的属性的值input disabled="disabled"改成input disabled
 * @property {Boolean} [ifminhtmlObj.removeStyleLinkTypeAttributes=false] 除去type="text/css" 其他类型的属性值是左不变的。
 * @property {Boolean} [ifminhtmlObj.keepClosingSlash=true] 保持单元素的结尾"/"
 * @property {Boolean} [ifminhtmlObj.minifyJS=false] 压缩页面上的JS
 * @property {Boolean} [ifminhtmlObj.minifyCSS=false] 压缩页面上的CSS
 * @property {Boolean} [gzipIf=false] 是否把文件压缩成gzip格式（true为是，false为否）
 * @property {Boolean} [changIf=false] 是否改变时才更新文件（true为否，false为是）
 * @property {Boolean} [srcRev=false] 是否给引用文件加后缀如：xxx.x?=xxxx（true为是，false为否））
 * @property {String} [prefix=""] 是否给文件加前缀（有内空时为加，没有内容时为不加）
 * @property {String} [suffix=".min"] 是否给文件加后缀（有内空时为加，没有内容时为不加）
 * @property {Boolean} [injectIf=true] 是否注入文件到html（true为是，false为否）
 * @property {Boolean} [bannerIf=false] 是否给文件加banner（true为否，false为是）
 * @property {String} [srcPath="{#webappDir#}develop/"] 需要处理的项目源文件目录
 * @property {String} [publicPath="{#webappDir#}develop/public/"] 项目的公用源文件根目录
 * @property {String} [destPath="{#webappDstDir#}web/"] 项目生成存放的根目录
 * @property {String} [destRoot=""] 项目生成存放的根目录的子项目根目录
 * @property {String} [destTest="{#webPath#}test/"] 测试文件存放的根目录
 * @property {String} [revDestPath="{#webappDstDir#}temp/"] 生成文件MD5的对应JSON文件存放目录
 * @property {String} [revType="part"] rev生成和替换静态文件名的类型（"part"为参数形式,其它为文件名形式）
 * @property {String} [tempPath="{#webappDir#}temp/"] 临时文件存放的根目录引用（task中不用）
 * @property {String} [mapsPath="maps"] map文件存放的子路径
 * @property {Object} compassConfig compass配置参数
 * @property {Boolean} [mapIf=false] 是否生成map文件（true为是，false为否）
 * @property {String} [debarPath="{废弃/** /*.*, /** /废弃.*,/** /废弃/*.*,/** /废弃/** /*.*}"] 生成文件时不包含的文件
 * @property {String} [host="127.0.0.1"] 本地服务器地址（暂时无用）
 * @property {String} [port="8020"] 本地服务器端口号
 * @property {String} [webPath= "{#webappDstDir#}web/"] web文件根目录
 * @property {String} [serverPath="{#webPath#}"] 本地服务器文件目录路径
 * @property {String} [browser=""] 自动打开的浏览器名称如：chrome
 * @property {String} [bakDateDir=""] 用时间作目录(此项不需要设置值,系统会自动读取当前时间需要引用的地方使用{#bakDateDir#})
 * @property {String} [autoprefixerBrowsers=["> 0.1%", "android >= 2.6", "chrome >= 4", "edge >= 11", "firefox >= 3.5", "ie >= 6", "ie_mob >= 6", "ios_saf >= 6", "opera >= 5","safari >= 6"]] 给CSS3自动加产商前缀
 * 
 * @property {String|Array} [bakFile=""] 备份文件配置项
 * @property {String|Array} [bakFile.src=""] 备份源文件目录
 * @property {String} [bakFile.destPath=""] 备份文件存放目录的根目录(设置此项则全局destPath字段当前无效)
 * @property {Object} [bakFile.dest=""] 备份文件存放目录(如果根目录非项目当前目录，前面必须加上根目录如:{#bakDest#}{#bakDateDir#}develop/)
 * @property {Object} [bakFile.debarPath=""] 备份文件时不包含的文件此项为局部公共(设置此项则全局debarPath字段当前无效)
 * @property {String} [bakFile.debar=""] 拷贝文件时不包含的文件此项会包含全局项字段debarPath
 * 
 * @property {String|Array} [copyFile=""] 拷贝文件的配置项(大部份全局项可以支持在子项Object,以下只是部份)
 * @property {String|Array} [copyFile.src=""] 拷贝文件源文件目录
 * @property {String|Array} [copyFile.psrc=""] 拷贝公共文件源文件目录
 * @property {Object} [copyFile.debarPath=""] 拷贝文件时不包含的文件此项为局部公共(设置此项则全局debarPath字段当前无效)
 * @property {String} [copyFile.debar=""] 拷贝文件时不包含的文件此项会包含全局项字段debarPath
 * @property {String} [copyFile.dest=""] 拷贝文件存放目录(前面不需要加上根目录如:"js/angular/")
 * @property {String} [copyFile.destPath=""] 拷贝文件存放目录的根目录(设置此项则全局destPath字段当前无效)
 * @property {String} [copyFile.destRoot=""] 项目生成存放的根目录的子项目根目录如果不设置此项则使用destRoot
 * @property {Boolean} [copyFile.changIf=true] 是否改变时才更新文件;true为否，false为是。(如果不设置此项则用全局的changIf)
 * @property {String} [copyDstDir=""] 拷贝文件的存放目录
 * 
 * @property {String|Array} [jsonFile=""] JSON文件的配置项(具体配置参照拷贝文件的配置项)
 * @property {String} [jsonDstDir=""] JSON文件的存放目录
 * 
 * @property {String|Array} [imgFile=""] 图片文件的配置项(具体配置参照拷贝文件的配置项)
 * @property {String} [imgDstDir=""] 图片文件的存放目录
 * 
 * @property {Object} [jsAnonymous=false] 合并js文件时是否用匿名函数包起来（true为是，false为否）(用在:按目录合并JS、按文件合并JS、JS文件)
 * @property {String} [jsGlobalObj=""] js用匿名函数包裹时需要传入的参数(用在:按目录合并JS、按文件合并JS、JS文件)
 * @property {String} jsHeader JS内容前面加的代码(jsAnonymous=true时有效)(用在:按目录合并JS、按文件合并JS、JS文件)
 * @property {String} jsFooter JS内容后面加的代码(jsAnonymous=true时有效)(用在:按目录合并JS、按文件合并JS、JS文件)
 * @property {String} [jsDstDir="js/"] JS文件的存放目录(用在:按目录合并JS、按文件合并JS、JS文件)
 * 
 * @property {String|Array} [dirConcatJs=""] 按目录合并JS文件的配置项(具体配置参照拷贝文件的配置项)
 * 
 * @property {String|Array} [concatJs=""] 按文件合并JS文件的配置项(具体配置参照拷贝文件的配置项)
 * @property {String} [concatDstJsFileName=""] 按文件合并JS文件时的新文件名
 * 
 * @property {String|Array} [jsFile=""] JS文件处理的配置项(具体配置参照拷贝文件的配置项)
 * 
 * @property {String} [cssDstDir="js/"] JS文件的存放目录(用在:sass文件处理、按文件合并CSS、CSS文件处理)
 * @property {String|Array} [sassFile=""] sass文件处理的配置项(具体配置参照拷贝文件的配置项)
 * 
 * @property {String|Array} [concatCss=""] 按文件合并CSS文件的配置项(具体配置参照拷贝文件的配置项)
 * @property {String} [concatDstCssFileName=""] 按文件合并CSS文件时的新文件名
 * 
 * @property {String|Array} [cssFile=""] CSS文件处理的配置项(具体配置参照拷贝文件的配置项)
 * 
 * @property {String|Array} [templateFile=""] 项目引用HTML模板文件处理的配置项(具体配置参照拷贝文件的配置项)
 * @property {String} [templateDstDir=""] JSON文件的存放目录
 * 
 * @property {String|Array} [htmlFile=""] HTML文件处理的配置项(具体配置参照拷贝文件的配置项)
 * @property {String} [htmlDstDir=""] HTML文件的存放目录
 * @property {String} [tplsHtmlFile=""] 开发时用的模块模板文件的目录
 * 
 * @property {String|Array} [injectPath=""] 注入静态文件时静态文件的静态文件路径对象
 * @property {String} [injectName="inject"] 注入静态文件引用时写在标签名称
 * 
 * @example 
 * //injectPath例：
 * //可以单独存放在(pkg.srcPath + 'pkg/inject.json')文件中,如果有此文件内容优先级高
 * injectPath＝[{
 *           "src": [
 *               "css/indexpage.css",//文件路径
 *               "js/comm/switch.js",//文件路径
 *               "js/default2.0.js"//文件路径
 *			],
 *           "injectName": "Newdefault"//注入时引用的名称
 *		}]
 */
