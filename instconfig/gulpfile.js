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
        PY.gulpdocs = require('gulp-ngdocs');
//		PY.removeplugin()

    var build = {};
	
	
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
        if (d) {
            ret = d;
        }
        if (typeof o[t] != "undefined") {
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
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
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
                if (subDst == "bakDstDir") {//处理备份存储目录
                    if (obj.dest) {
                        return path.normalize(obj.dest).replace(/\\/g, "/");
                    } else if (pkg[subDst]) {
                        return path.normalize(pkg[subDst]).replace(/\\/g, "/");
                    } else {
                        return "";
                    }
                }
                var root = pkg.destRoot || "";
                if (obj && typeof obj.root != "undefined") {
                    root = obj.root;
                }

                if (obj && obj.dsrc) {//存储到开发目录
                    return path.normalize(pkg.srcPath + obj.dsrc).replace(/\\/g, "/");
                } else if (obj && obj.dest) {//存储到生成目录
                    return path.normalize(pkg.destPath + root + obj.dest).replace(/\\/g, "/");
                } else if (subDst) {
                    if (pkg[subDst]) {
                        return path.normalize(pkg.destPath + root + pkg[subDst]).replace(/\\/g, "/");
                    }
                }
                if (pkg.destPath) {
                    return path.normalize(pkg.destPath + root).replace(/\\/g, "/");
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
                var root = pkg.destRoot || "";
                pkg.revDestPath = pkg.revDestPath || "";
                if (obj && typeof obj.root != "undefined") {
                    root = obj.root;
                }

                if (obj && obj.revDest) {//存储到生成目录
                    return path.normalize(pkg.revDestPath + root + revDst + "\\" + obj.revDest).replace(/\\/g, "/");
                } else if (subDst) {
                    if (pkg[subDst]) {
                        return path.normalize(pkg.revDestPath + root + pkg[subDst] + revDst + "\\").replace(/\\/g, "/");
                    }
                }
                if (pkg.revDestPath) {
                    return path.normalize(pkg.revDestPath + root + revDst + "\\").replace(/\\/g, "/");
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
            getJsDoc3Temp: function (pkg, obj, subDst, docDst) {//获取jsDoc临时文件存放的目录
                var root = pkg.destRoot || "";
                var jsDoc3Temp = pkg.jsDoc3Temp || "";
                if (obj && typeof obj.root != "undefined") {
                    root = obj.root;
                }

                if (obj && obj.dest) {//存储到生成目录
                    //return path.normalize(jsDoc3Temp + root +"\\").replace(/\\/g,"/");
                    //                    return path.normalize(jsDoc3Temp + root  + docDst+"\\" +obj.revDest).replace(/\\/g,"/");
                    //                    return path.normalize(jsDoc3Temp + root + obj.dest).replace(/\\/g,"/");

                    var dest = obj.dest.split(":");
                    return path.normalize(jsDoc3Temp + root + dest.pop()).replace(/\\/g, "/");
                } else if (subDst) {
                    if (pkg[subDst]) {
                        var dest = pkg[subDst].split(":");
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
                        var root = pkg.destRoot || "", destPath, ret;
                        if (obj && typeof obj.root != "undefined") {
                            root = obj.root;
                        }
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
                if (dirName == "bakFile") {
                    return ret;
                }
                var pkg = this.pkg;
                var temparr = [], pathArr = this.splitSrc(objPath);
                if (pathArr && pathArr.length > 0) {
                    pathArr.map(function (v, k) {
                        if (v.indexOf("!") != -1) {
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
             * @returns {Array} 返回存放要处理文件路径的数组
             */
            getSrc: function (srcPath, obj, ext, debar, dirName) {
                if (!ext) {
                    ext = "";
                }
                if (dirName == "bakFile") {
                    srcPath = "";
                }
                var ret = [], _this = this;
                var pkg = this.pkg, debarArr = [], tempsrc;
                if (isData.isArray(obj)) {
                    for (var i = 0; i < obj.length; i++) {
                        if (!debar) {
                            debarArr = _this.getDebarPath(srcPath + obj[i], pkg.debarPath, ext, dirName);
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
                        debarArr = _this.getDebarPath(srcPath + obj, pkg.debarPath, ext, dirName);
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
                            var src = [], injectIf = false;
                            //                            if (!debar) {
                            //                                src = _this.gArr();
                            //                            }
                            if (!obj.src && !obj.psrc) {
                                return false;
                            }

                            if (obj.psrc) {
                                var psrcTxt = _this.getSrc(pkg.publicPath, obj.psrc, ext, debar, dirName);
                                if (isData.isArray(psrcTxt) && psrcTxt.length > 0) {
                                    src = src.concat(psrcTxt);
                                    retGSrc = retGSrc.concat(psrcTxt);
                                } else if (psrcTxt) {
                                    src.push(psrcTxt);
                                    retGSrc.push(psrcTxt);
                                }

                                if (obj.debar && !debar) {
                                    debarArr = _this.getDebarPath(pkg.publicPath + obj.psrc, obj.debar, "", dirName);
                                    if (debarArr && debarArr.length > 0) {
                                        src = src.concat(debarArr);
                                    }
                                    //                                    src.push("!" + pkg.publicPath + obj.debar);
                                }
                            }

                            if (obj.src) {
                                var srcTxt = _this.getSrc(pkg.srcPath, obj.src, ext, debar, dirName);
                                if (isData.isArray(srcTxt) && srcTxt.length > 0) {
                                    src = src.concat(srcTxt);
                                    retGSrc = retGSrc.concat(srcTxt);
                                } else {
                                    src.push(srcTxt);
                                    retGSrc.push(srcTxt);
                                }


                                if (obj.debar && !debar) {
                                    debarArr = _this.getDebarPath(pkg.srcPath + obj.src, obj.debar, "", dirName);
                                    if (debarArr && debarArr.length > 0) {
                                        src = src.concat(debarArr);
                                    }
                                    //                                    src.push("!" + pkg.srcPath + obj.debar);
                                }
                            }

                            if (tplsPath && obj.tpls) {
                                retGSrc.push(pkg.srcPath + obj.tpls + "**/*" + ext);
                            } else if (tplsPath) {
                                retGSrc.push(pkg.srcPath + pkg[tplsPath] + "**/*" + ext);
                            }

                            var destPath = _this._getDestPath(pkg, obj, subDst);
                            var revDestPath = _this.getRevDestPath(pkg, obj, subDst, subRevDst);
                            var jsDocTempPath = _this.getJsDoc3Temp(pkg, obj, subDst, subRevDst);

                            var tempJsHeader = returnObj(obj, 'jsHeader', returnObj(pkg, (pkg.jsHeader && 'jsHeader') || "", "(function(" + returnObj(obj, 'jsGlobalObj', pkg.jsGlobalObj) + ") {\n"));

                            var tempJsFooter = returnObj(obj, 'jsFooter', returnObj(pkg, (pkg.jsFooter && 'jsFooter') || "", "\n})(" + returnObj(obj, 'jsGlobalObj', pkg.jsGlobalObj) + ")"));

                            /** 
                             * gulp的task参数配置
                             * 
                             *      1、所有默认参数自定义在webAppConfig.json文件，具体默认值以webAppConfig.json文件内的值为准；
                             * 
                             *      2、对应项目单独设置参数以webAppConfig.json里subJsonPath指定的路径，items项对应的名称的JSON文件为准。
                             * @namespace taskCFG
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
                             * @property {String} [ifminimg=false] 是否压缩图片（true为是，false为否）
                             * @property {Number} [imgquality=100] 图片质量，最小不能小于60(ifminimg=true时才有效)
                             * @property {String} newFileName 处理完后的文件的新名称
                             * @property {String} [prefix=""] 是否给文件加前缀（有内空时为加，没有内容时为不加）
                             * @property {String} [suffix=""] 是否给文件加后缀（有内空时为加，没有内容时为不加）
                             * @property {Boolean} [ifmin=false] 是否压缩JS、CSS（true为否，false为是）
                             * @property {Array} autoprefixerBrowsers 加前缀要兼容的浏览器版本例：["> 0.1%", "android >= 2.6", "chrome >= 4", "edge >= 11", "firefox >= 3.5", "ie >= 6", "ie_mob >= 6", "ios_saf >= 6", "opera >= 5","safari >= 6"]
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
                                tplsPath: obj.tpls && path.normalize(pkg.srcPath + obj.tpls).replace(/\\/g, "/") || tplsPath && pkg[tplsPath] && path.normalize(pkg.srcPath + pkg[tplsPath]).replace(/\\/g, "/") || pkg.srcPath,//HTML的模板文件目录
                                destPath: destPath,//处理完后的文件存储目录
                                jsDocLink: returnObj(pkg, 'jsDocLink', ""),//api文档链接
                                jsDocType: returnObj(pkg, 'jsDocType', ""),//api文档类型
                                jsDoc3Dir: returnObj(obj, 'jsDoc3Dir', returnObj(pkg, 'jsDoc3Dir', "")),//JSDoc文档存放的路径
                                jsDoc3Temp: jsDocTempPath,//JSDoc临时文件存放的路径
                                ifJsDoc: returnObj(obj, 'ifJsDoc', returnObj(pkg, 'ifJsDoc', false)),//JSDoc是否生成文档
                                revDestPath: revDestPath,//存放rev生成的JSON文件
                                revCollectorSrcPath: pkg.revDestPath,//存放rev生成的主目录
                                revType: returnObj(obj, 'revType', pkg.revType),//rev生成文件名的类型
                                //                                revCollectorType:returnObj(obj, 'revCollectorType',pkg.revCollectorType),//revCollector替换文件的类型
                                mapIf: pkg.mapIf,//是否生成map文件（true为是，false为否）
                                mapsPath: returnObj(obj, 'map', pkg.mapsPath),//obj.map || pkg.mapsPath,
                                ifminimg: returnObj(obj, 'ifminimg', pkg.ifminimg),//obj.ifmin || pkg.ifminimg,//是否压缩图片（true为是，false为否）
                                imgquality: returnObj(obj, 'imgquality', pkg.imgquality) || 100,//图片质量
                                newFileName: returnObj(obj, 'newFileName', ""),//处理完后的文件的新名称
                                prefix: returnObj(obj, "prefix", returnObj(pkg, 'prefix', false)),//是否给文件加前缀（有内空时为加，没有内容时为不加）
                                suffix: returnObj(obj, "suffix", returnObj(pkg, 'suffix', false)),//是否给文件加后缀（有内空时为加，没有内容时为不加）
                                ifmin: pkg.ifmin,//是否压缩JS、CSS（true为否，false为是）
                                autoprefixerBrowsers: pkg.autoprefixerBrowsers,//加前缀要兼容的浏览器版本
                                ifminhtml: returnObj(obj, 'ifminhtml', pkg.ifminhtml),//obj.ifminhtml || pkg.ifminhtml,//是否压缩html（true为否，false为是）
                                injectIf: returnObj(obj, 'injectIf', pkg.injectIf),//injectIf,//是否注入文件到html（true为是，false为否）
                                bannerIf: returnObj(obj, 'bannerIf', pkg.bannerIf),//bannerIf,//是否加banner（true为否，false为是）
                                gzipIf: pkg.gzipIf,//是否把文件压缩成gzip格式（true为是，false为否）
                                header: headbanner,//banner的头内容
                                footer: footbanner,//banner的脚内容
                                srcRev: pkg.srcRev,//是否给引用文件加后缀如：xxx.x?=xxxx（true为是，false为否）
                                changIf: returnObj(obj, 'changIf', pkg.changIf),//是否改变时才更新文件（true为否，false为是）//obj.changIf||pkg.changIf,
                                jsAnonymous: returnObj(obj, 'jsAnonymous', pkg.jsAnonymous),//jsAnonymous,//合并js文件时是否用匿名函数包起来（true为是，false为否）
                                jsHeader: tempJsHeader,//合并JS前面加的代码
                                jsFooter: tempJsFooter,//"\n})("+returnObj(obj, 'concatJsGlobalObj', pkg.concatJsGlobalObj)+")",//合并JS后面加的代码
                                srcPath: unique(src),//需要处理的文件
                                //concatJsGlobalObj:returnObj(obj, 'concatJsGlobalObj', pkg.concatJsGlobalObj),//合并JS时需用到的全局变量名称
                                connectStart: pkg.connectStart,//是否启动服务器
                                fileTime: returnObj(pkg, "fileTime", "mtime"),//文件时间类型默认为mtime
                                fileTimeName: returnObj(pkg, "fileTimeName", "filetime"),//文件时间使用的别名默认为filetime
                                mapObj: {
                                    includeContent: true,//是否引入映射内容
                                    sourceRoot: 'source'//映射内容到source目录
                                }//map文件生成时的参数
                            };
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
                    var jsDocTempPath = _this.getJsDoc3Temp(pkg, "", subDst, subRevDst);
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
                        mapObj: {
                            includeContent: true,
                            sourceRoot: 'source'
                        }
                    };
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
                var pngobj = this.setObj("imgFile", "imgDstDir", "imgFile", "png", ".{png,PNG}");
                var jpgobj = this.setObj("imgFile", "imgDstDir", "imgFile", "jpg", ".{jpg,JPG}");
                var gifobj = this.setObj("imgFile", "imgDstDir", "imgFile", "gif", ".{gif,GIF}");
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
                        })
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
			 * 输出jshint检查语法错误信息
			 */
            myReporter: function (file, cb) {
                console.log('   JSHINT file in：' + file.path);
                if (file.jshint.data && file.jshint.data[0] && file.jshint.data[0].globals) {
                    console.log("   globals Object in： " + file.jshint.data[0].globals);
                }
                if (!file.jshint.success) {
                    console.log('   error info：');
                    //不显示的错误信息
                    var errorObj = {
                        "W041": true, //错误码W041:(!=)
                        "W083": true, //错误码W083:(函数未命名)
                        "W030": true //错误码W030：(函数不在if内直接用&&或||判断)
                    };
                    file.jshint.results.forEach(function (err) {
                        if (err && err.error) {
                            //错误码W041:(!=)
                            //错误码W083:(函数未命名)
                            if (!errorObj[err.error.code]) {
                                console.log('      行 ' + err.error.line + ', 列 ' + err.error.character + ', code ' + err.error.code + ', ' + err.error.reason);
                            }
                        }
                    });
                } else {
                    console.log('   success');
                }
                cb(null, file);
            }


        };
        return getTaskOption;
    })();

    //#endregion



    
    //task定义
    (function (window) {

        



//------------------------------------------------------------------------------------------------------------------------------------------------------------------



// PY.gulp.task('clssd', function (cb) {
//   del(["E:/webapp/web/icip/**/*"], cb);
// });

        function teemoGulp(id) { //模块对象开始
            //引入JSON文件
            //            this.uid = id;
            this.gb = new getGlobal(); //读取全局
            this.uid = id;
            this.pkgdir = gpkg.subJsonPath + id + '.json';
            //var _pkg = getJson(this.pkgdir);
            var pkgTemp = require(this.pkgdir);
            var _pkg = pkgTemp;
//			var _pkg=againPkg(pkgTemp)
//			if(_pkg.webappDir){
//				_pkg.subJsonPath=path.normalize(_pkg.webappDir + _pkg.subJsonPath).replace(/\\/g,"/");
//			}
            this.getCfg(_pkg);


            //this.copy
        }

        teemoGulp.prototype = {
            getCfg:function(_pkg){
                var subpkgtempq = require('./webAppConfig.json'),
                    pkgObj = addObj(subpkgtempq, _pkg);
                pkgObj = againPkg(pkgObj);
                var gb = this.gb;
                var id=this.uid;
                gb.setPkg(pkgObj);
                this.options = {
                    gb:gb,
                    uid: id,
                    pkg: pkgObj,
                    testConfig:pkgObj.testConfig,
                    bakPath: gb.getBakPath(),
                    clsPath: gb.getClearPath(),
                    jsonPath: gb.getJsonPath(),
                    copyPath: gb.getCopyPath(),
                    imgPath: gb.getImgPath(),
                    jsPath: gb.getJsPath(),
                    jsDirConcatPath:gb.getJsDirConcatPath(),
                    concatJsPath:gb.getConcatJsPath(),
                    sassPath:gb.getSassPath(),
                    concatCssPath:gb.getConcatCssPath(),
                    cssPath:gb.getCssPath(),
                    jsDocPath:gb.getJsDocPath(),
                    htmlPath:gb.getHtmlPath()
                };
            },
            task_bak: function () { //备份文件
                //var cfg = {
                //    srcPath: [gpkg.srcPath + '**/*.*', gpkg.subJsonPath + '**/*.*'],
                //    destPath: ""
                //};
                if (this.options.bakPath.cfgArr.length > 0) {

                    var subMerge=new PY.mergestream();
                    subMerge.add(this.options.bakPath.cfgArr.map(function(cfg) {
                        return PY.gulp.src(cfg.srcPath)
                            .pipe(PY.gulpplumber())
                            .pipe(PY.gulp.dest(cfg.destPath));
                    }));
                    return subMerge;
                }
				//if(cfg.destPath){//bakPath
				//	return PY.gulp.src(cfg.srcPath)
                 //   .pipe(plumber())
                 //   .pipe(PY.gulp.dest(cfg.destPath));
				//}else{
				//	return false;
				//}

            },
            task_cls: function () { //清理
				// del(this.options.clsPath.gSrc, cb););
				 return false;
                //return PY.gulp.src(this.options.clsPath.gSrc[0],{read: false})
                    //.pipe(clean());
            },
            task_copy: function () { //复制
                if (this.options.copyPath.cfgArr.length > 0) {
                    var subMerge=new  PY.mergestream(),i=0;
                    subMerge.add(this.options.copyPath.cfgArr.map(function(cfg,k) {
//						i+=1;
                        i=k;
                        return PY.gulp.src(cfg.srcPath)
							.pipe(PY.gulpif(cfg.changIf == false, PY.gulpchanged(cfg.destPath)))
                            .pipe(PY.gulpplumber())
							.pipe(PY.gulpif(cfg.newFileName !== "", PY.gulprename(cfg.newFileName+"")))
							.pipe(PY.gulpif(cfg.changIf == false, PY.gulpchanged(cfg.destPath)))
                            //.pipe(PY.gulp.dest(cfg.destPath));
							.pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({type:cfg.revType})))
							.pipe(PY.gulpif(cfg.suffix != false, PY.gulprename({
								prefix:cfg.prefix,//文件前缀
								suffix: cfg.suffix
							}))) //加后缀
							.pipe(PY.gulp.dest(cfg.destPath))
							.pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({path:"rev-manifest"+i+".json",dest:cfg.revDestPath,merge:true})))
							.pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)));
                    }));
                    return subMerge;
                }
            },
            task_json: function () { //复制JSON
                if (this.options.jsonPath.cfgArr.length > 0) {
                    var subMerge=new  PY.mergestream();
                    subMerge.add(this.options.jsonPath.cfgArr.map(function(cfg) {
                        return PY.gulp.src(cfg.srcPath)
                            .pipe(PY.gulpif(cfg.changIf == false, PY.gulpchanged(cfg.destPath)))
                            .pipe(PY.gulpplumber())
                            .pipe(PY.gulpjsonlint())
                            .pipe(PY.gulpjsonlint.failOnError())
                            .pipe(PY.gulpif(cfg.ifmin !== true,PY.gulpreplace(/(\s*\n+\s*)/g,function($1){
                                return "";
                             })))
                            //.pipe(PY.gulp.dest(cfg.destPath));
							.pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({type:cfg.revType})))
							.pipe(PY.gulpif(cfg.suffix != false, PY.gulprename({
								prefix:cfg.prefix,//文件前缀
								suffix: cfg.suffix
							 }))) //加后缀
							.pipe(PY.gulp.dest(cfg.destPath))
							.pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({path:"rev-manifest"+i+".json",dest:cfg.revDestPath,merge:true})))
							.pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)));
                    }));
                    return subMerge;
                }
            },
            task_img: function () {
                var arrObj = this.options.imgPath.arrObj;
                var runstart = false;
                if (arrObj.length > 0) {
                    var subMerge = new  PY.mergestream();
                    var i=0;
                    for (var j = 0; j < arrObj.length; j++) {
                        i=j;
                        if (arrObj[j].cfgArr && arrObj[j].cfgArr.length > 0) {
                            runstart = true;
                            switch (arrObj[j].imgtype) {
                            case 'png':
//                                    i+=1;
//                                    i=0;
                                subMerge.add(arrObj[j].cfgArr.map(function (cfg) {
                                    return PY.gulp.src(cfg.srcPath)
                                        .pipe(PY.gulpchanged(cfg.destPath))
                                        .pipe(PY.gulpif(cfg.ifminimg === true, PY.imageminpngquant({ quality: '60-'+cfg.imgquality })()))//.pipe(imageminPng({ quality: '65-80', speed: 4 })())
//                                        .pipe(PY.gulprev({type:cfg.revType}))
                                        .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({type:cfg.revType})))
										.pipe(PY.gulpif(cfg.suffix != false, PY.gulprename({
											prefix:cfg.prefix,//文件前缀
											suffix: cfg.suffix
										 }))) //加后缀
                                        .pipe(PY.gulp.dest(cfg.destPath))
                                        .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({path:"rev-manifest-png"+i+".json",dest:cfg.revDestPath,merge:true})))
                                        .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)));
                                }));
                                break;
                            case 'jpg':
//                                    i+=1;
//                                    i=1;
                                subMerge.add(arrObj[j].cfgArr.map(function (cfg) {
                                    return PY.gulp.src(cfg.srcPath)
                                        .pipe(PY.gulpchanged(cfg.destPath))
                                        .pipe(PY.gulpif(cfg.ifminimg === true, PY.imageminmozjpeg({ quality: cfg.imgquality*1 })()))
                                        .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({type:cfg.revType})))
										.pipe(PY.gulpif(cfg.suffix != false, PY.gulprename({
											prefix:cfg.prefix,//文件前缀
											suffix: cfg.suffix
										}))) //加后缀
                                        .pipe(PY.gulp.dest(cfg.destPath))
                                        .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({path:"rev-manifest-jpg"+i+".json",dest:cfg.revDestPath,merge:true})))
                                        .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)));
                                }));
                                break;
                             case 'gif':
//                                    i+=1;
//                                    i=2;
                                 subMerge.add(arrObj[j].cfgArr.map(function (cfg) {
                                    return PY.gulp.src(cfg.srcPath)
                                        .pipe(PY.gulpchanged(cfg.destPath))
                                        .pipe(PY.gulpif(cfg.ifminimg === true, PY.imagemingifsicle({ interlaced: false })()))
                                        .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({type:cfg.revType})))
										.pipe(PY.gulpif(cfg.suffix != false, PY.gulprename({
												prefix:cfg.prefix,//文件前缀
												suffix: cfg.suffix
											}))) //加后缀
                                        .pipe(PY.gulp.dest(cfg.destPath))
                                        .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({path:"rev-manifest-gif"+i+".json",dest:cfg.revDestPath,merge:true})))
                                        .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)));
                                }));
                                break;
                            default:
                            }
                        }
                    }
//                    subMerge.add(this.options.imgPath.cfgArr.map(function (cfg) {
//                        var pngFilter = filter('**/*.png', { restore: true });
//                        var jpgFilter = filter('**/*.jpg', { restore: true });
//                        var gifFilter = filter('**/*.gif', { restore: true });
//                        var svgFilter = filter('**/*.svg', { restore: true });
//                        var gulpsrc = PY.gulp.src(cfg.srcPath).pipe(changed(cfg.destPath));
//                        return streamqueue({ objectMode: true },
//                                gulpsrc.pipe(pngFilter)
//                                .pipe(imageminPng({ quality: '60-80' })()),
//                                gulpsrc.pipe(jpgFilter)
//                                .pipe(imageminjpeg({ quality: 80 })()),
//                                gulpsrc.pipe(gifFilter)
//                                .pipe(imagemingif({ interlaced: false })()),
//                                gulpsrc.pipe(svgFilter)
//                                .pipe(imageminSvg()())
//                            )
//                            .pipe(PY.gulp.dest(cfg.destPath));
//                    }));
//                    subMerge.add(this.options.imgPath.cfgArr.map(function (cfg) {
//                        var pngFilter = filter('**/*.png', { restore: true });
//                        return PY.gulp.src(cfg.srcPath)
//                            .pipe(changed(cfg.destPath))
////                            .pipe(pngFilter)
//                            .pipe(imageminPng({ quality: '60-80' })())//.pipe(imageminPng({ quality: '65-80', speed: 4 })())
//                            .pipe(PY.gulp.dest(cfg.destPath));
//                    }));
//                    subMerge.add(this.options.imgPath.cfgArr.map(function (cfg) {
//                        var jpgFilter = filter('**/*.jpg', { restore: true });
//                        return PY.gulp.src(cfg.srcPath)
//                            .pipe(changed(cfg.destPath))
////                            .pipe(jpgFilter)
//                            .pipe(imageminjpeg({ quality: 80 })())
//                            .pipe(PY.gulp.dest(cfg.destPath));
//                    }));
//                    subMerge.add(this.options.imgPath.cfgArr.map(function (cfg) {
//                        var gifFilter = filter('**/*.gif', { restore: true });
//                        return PY.gulp.src(cfg.srcPath)
//                            .pipe(changed(cfg.destPath))
////                            .pipe(gifFilter)
//                            .pipe(imagemingif({ interlaced: false })())
//                            .pipe(PY.gulp.dest(cfg.destPath));
//                    }));
//                    subMerge.add(this.options.imgPath.cfgArr.map(function (cfg) {
//                        var svgFilter = filter('**/*.svg', { restore: true });
//                        return PY.gulp.src(cfg.srcPath)
//                            .pipe(changed(cfg.destPath))
////                            .pipe(svgFilter)
//                            .pipe(imageminSvg()())
//                            .pipe(PY.gulp.dest(cfg.destPath));
//                    }));
//                    subMerge.add(this.options.imgPath.cfgArr.map(function (cfg) {
//                        return PY.gulp.src(cfg.srcPath)
//                            .pipe(changed(cfg.destPath))
//                            .pipe(imageminWeb({ quality: 80 })())
//                            .pipe(PY.gulp.dest(cfg.destPath));
                    //                    }));
                    if (runstart) {
                        return subMerge;
                    }
                }
            },
            task_jsDir: function (cb) { //每个文件夹生成单独一个文件
                var folders = [];
                var ret = false;
                var _this = this;
                var subMerge = new  PY.mergestream(), myReporter;
                if(this.options.jsDirConcatPath.cfgArr.length>0) {
                    this.options.jsDirConcatPath.cfgArr.map(function(cfg,k) {
                        if (cfg.srcPath.length > 0) {
                            cfg.srcPath.map(function(srcPath) {
                                var folder_exists;
                                if(srcPath && srcPath.indexOf("!")==-1){
                                    folder_exists = fs.existsSync(srcPath);
                                }
                                if (folder_exists) {
                                    folders = getFolders(srcPath);
                                    if (folders.length > 0) {
                                        ret = true;
                                        var i=0;
                                        subMerge.add(folders.map(function (folder,k1) {
                                            myReporter = new PY.mapstream(_this.options.gb.myReporter);
                                            // 拼接成 foldername.js
                                            // 写入输出
                                            // 压缩
                                            // 重命名为 folder.min.js
                                            // 再一次写入输出
//                                            i+=1;
                                            i=k+"-"+k1;
                                            return PY.gulp.src(path.join(srcPath, folder, '/**/*.js'))
                                                .pipe(PY.gulpplumber())
                                                //.pipe(changed(cfg.destPath))
                                                .pipe(PY.gulpif(cfg.mapIf === true, PY.gulpsourcemaps.init()))
                                                .pipe(PY.gulpjshint()) //检查语法
                                                .pipe(myReporter)
                                                .pipe(PY.gulpconcat(folder + '.js'))
//                                                .pipe(PY.gulp.dest(cfg.destPath))
                                                .pipe(PY.gulpif(cfg.jsAnonymous==true,PY.gulpheaderfooter({//文件前后增加内容
                                                    header: cfg.jsHeader,
                                                    footer: cfg.jsFooter,
                                                    filter: function(file) {
                                                        return true;
                                                    }
                                                })))
                                            
                                                .pipe(PY.gulpif(cfg.ifJsDoc===true,PY.gulp.dest(cfg.jsDoc3Temp)))
                                                .pipe(PY.gulpif(cfg.ifmin !== true, PY.gulpuglify()))
//                                                .pipe(PY.gulpif(cfg.suffix !== false, PY.gulprename(folder + cfg.suffix + '.js')))
                                                .pipe(PY.gulpif(cfg.bannerIf!== true, PY.gulpheaderfooter({
													header: cfg.header,
													footer: cfg.footer,
													filter: function(file) {
														return true;
													}
												})))

												.pipe(PY.gulpif(cfg.bannerIf!== true, PY.gulpfiletime({
													fileTimeName:cfg.fileTimeName,//默认为filetime
													timeType:cfg.timeType,//默认为mtime
													callback:function(data){}
												})))
                                                .pipe(PY.gulpif(cfg.mapIf === true, PY.gulpsourcemaps.write(cfg.mapsPath,cfg.mapObj)))
                                                .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({type:cfg.revType})))
                                                .pipe(PY.gulpif(cfg.suffix != false, PY.gulprename({
                                                    prefix:cfg.prefix,//文件前缀
													suffix: cfg.suffix
                                                }))) //加后缀
                                                .pipe(PY.gulp.dest(cfg.destPath))
                                                .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({path:"rev-manifest"+i+".json",dest:cfg.revDestPath,merge:true})))
                                                .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)))
                                                .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulpgzip({
                                                    append: true
                                                })))
                                                .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulp.dest(cfg.destPath)))
                                                .pipe(PY.gulpif(cfg.connectStart!==true,PY.gulpconnectmulti.reload()));
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
            task_concatJs: function (cb) { //合并JS
                var _this = this;
                if (this.options.concatJsPath.cfgArr.length > 0) {
//                    console.log(this.options.concatJsPath.cfgArr)
                    var subMerge = new  PY.mergestream(), myReporter;
                    var i=0;
                    subMerge.add(this.options.concatJsPath.cfgArr.map(function (cfg,k) {
                        myReporter = new PY.mapstream(_this.options.gb.myReporter);
                        if (cfg.concatFileName) {
//                            i+=1;
                            i=k;
                            return PY.gulp.src(cfg.srcPath)
                                .pipe(PY.gulpplumber())
                                //.pipe(changed(cfg.destPath))
                                .pipe(PY.gulpif(cfg.mapIf === true, PY.gulpsourcemaps.init()))
                                .pipe(PY.gulpjshint()) //检查语法
                                .pipe(myReporter)
                                .pipe(PY.gulpconcat(cfg.concatFileName)) //合并文件合并后的文件名为xxx.js
								.pipe(PY.gulpif(cfg.jsAnonymous==true,PY.gulpheaderfooter({//文件前后增加内容
                                    header: cfg.jsHeader,
                                    footer: cfg.jsFooter,
                                    filter: function(file) {
                                        return true;
                                    }
                                })))
                                
                                .pipe(PY.gulpif(cfg.ifJsDoc===true,PY.gulp.dest(cfg.jsDoc3Temp)))
                                //.pipe(PY.gulp.dest(cfg.destPath))
                                .pipe(PY.gulpif(cfg.ifmin !== true, PY.gulpuglify())) //压缩JS
                                //.pipe(livereload(server))
                                .pipe(PY.gulpif(cfg.bannerIf!== true, PY.gulpheaderfooter({
									header: cfg.header,
									footer: cfg.footer,
									filter: function(file) {
										return true;
									}
								})))
								.pipe(PY.gulpif(cfg.bannerIf!== true, PY.gulpfiletime({
                                    fileTimeName:cfg.fileTimeName,//默认为filetime
                                    timeType:cfg.timeType,//默认为mtime
                                    callback:function(data){}
                                })))
                                .pipe(PY.gulpif(cfg.mapIf === true, PY.gulpsourcemaps.write(cfg.mapsPath,cfg.mapObj)))
                                .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({type:cfg.revType})))
                                .pipe(PY.gulpif(cfg.suffix != false, PY.gulprename({
                                    prefix:cfg.prefix,//文件前缀
									suffix: cfg.suffix
                                }))) //加后缀
                                .pipe(PY.gulp.dest(cfg.destPath)) //保存更改后的文件
                                .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({path:"rev-manifest"+i+".json",dest:cfg.revDestPath,merge:true})))
                                .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)))
                                .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulpgzip({
                                    append: true
                                })))
                                .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulp.dest(cfg.destPath)))
                                .pipe(PY.gulpif(cfg.connectStart!==true,PY.gulpconnectmulti.reload()));
                        }
                    }));
                    return subMerge;
                }

            },
            task_js: function (cb) {//处理JS文件
                var _this=this;
                if (this.options.jsPath.cfgArr.length > 0) {
                    var subMerge = new  PY.mergestream(),myReporter;
                    var i=0;
                    subMerge.add(this.options.jsPath.cfgArr.map(function(cfg,k) {
                        //i+=1;
                        i=k;
                        myReporter = new PY.mapstream(_this.options.gb.myReporter);
						//console.log(cfg.srcPath)
                        return PY.gulp.src(cfg.srcPath)
                            .pipe(PY.gulpsourcemaps.init({ loadMaps: true, debug: true }))
                            .pipe(PY.gulpplumber())
                            //.pipe(PY.gulpif(cfg.changIf == false, PY.gulpchanged(cfg.destPath)))
                            .pipe(PY.gulpjshint()) //检查语法
                            .pipe(myReporter)//(jshint.reporter('default', { verbose: true })//'fail'
                            .pipe(PY.gulpif(cfg.jsAnonymous==true,PY.gulpheaderfooter({//文件前后增加内容
                                header: cfg.jsHeader,
                                footer: cfg.jsFooter,
                                filter: function(file) {
                                    return true;
                                }
                            })))
                        
                            .pipe(PY.gulpif(cfg.ifJsDoc===true,PY.gulp.dest(cfg.jsDoc3Temp)))
                            .pipe(PY.gulpif(cfg.ifmin !== true, PY.gulpuglify())) //压缩JS
//                            .pipe(obfuscate())//JS代码混淆
//                            .on('error', gutil.log)
                            .pipe(PY.gulpif(cfg.bannerIf!== true, PY.gulpheaderfooter({
                                header: cfg.header,
                                footer: cfg.footer,
                                filter: function(file) {
                                    return true;
                                }
                            })))
							.pipe(PY.gulpif(cfg.bannerIf!== true, PY.gulpfiletime({
								fileTimeName:cfg.fileTimeName,//默认为filetime
								timeType:cfg.timeType,//默认为mtime
								callback:function(data){}
							})))
                            .pipe(PY.gulpif(cfg.mapIf === true, PY.gulpsourcemaps.write(cfg.mapsPath,cfg.mapObj)))
							//	 {
                           //     includeContent: false //是否把原文件缓存到浏览器
                            //}
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({type:cfg.revType})))
                            .pipe(PY.gulpif(cfg.suffix != false, PY.gulprename({
                                prefix:cfg.prefix,//文件前缀
								suffix: cfg.suffix
                            }))) //加后缀
                            .pipe(PY.gulp.dest(cfg.destPath)) //保存更改后的文件
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({path:"rev-manifest"+i+".json",dest:cfg.revDestPath,merge:true})))
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)))
                            .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulpgzip({
                                append: true
                            })))
                            .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulp.dest(cfg.destPath)))
                            .pipe(PY.gulpif(cfg.connectStart!==true,PY.gulpconnectmulti.reload()));
                    }));
                    return subMerge;
                }
            },
            task_test:function(done){
                if(this.options.testConfig && this.options.testConfig.testConfigFile){
                    var testConfig=this.options.testConfig;
                    new PY.karmaServer({
                        configFile: path.normalize(testConfig.testConfigFile).replace(/\\/g,"/"),
                        singleRun:testConfig.singleRun
                    }, done).start();
                }

            },
            task_sass: function () { // sass样式处理
                if (this.options.sassPath.cfgArr.length > 0) {
                    var subMerge=new  PY.mergestream();
                    var i=0;
                    subMerge.add(this.options.sassPath.cfgArr.map(function(cfg,k) {
						var s='expanded';
						if(cfg.ifmin !== true){
							s="compressed";
						}
//                        i+=1;
                        i=k;
                        var revCollectorSrc;
                        if(cfg.srcRev===true){
                            revCollectorSrc=PY.gulp.src(cfg.revCollectorSrcPath+"**/*.json");
                        }else{
                            revCollectorSrc=PY.gulp.src("");
                        }
                        return PY.streamqueue({objectMode:true},PY.gulprubysass(cfg.srcPath, {
                                style: s,
                                sourcemap: true
                            }) //compressed,expanded
                            .pipe(PY.gulpplumber())
                            .on('error', function(err) {
                                this.end();
                            })
                            //.pipe(changed(cfg.destPath))
                            //.pipe(PY.gulpautoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
                            .pipe(PY.gulpautoprefixer({ browsers: cfg.autoprefixerBrowsers, cascade: false }))
                            .pipe(PY.gulpif(cfg.bannerIf!== true, PY.gulpheaderfooter({
                                header: cfg.header,
                                footer: cfg.footer,
                                filter: function(file) {
                                    return true;
                                }
                            })))
							.pipe(PY.gulpif(cfg.bannerIf!== true, PY.gulpfiletime({
								fileTimeName:cfg.fileTimeName,//默认为filetime
								timeType:cfg.timeType,//默认为mtime
								callback:function(data){}
							})))
                            .pipe(PY.gulpif(cfg.mapIf === true,PY.gulpsourcemaps.write(cfg.mapsPath,cfg.mapObj))),
                            revCollectorSrc)
                            .pipe(PY.gulprevcollector({type:cfg.revType,file:cfg.revCollectorSrcPath}))
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({type:cfg.revType})))
                            .pipe(PY.gulpif(cfg.suffix !== false, PY.gulprename({
                                prefix:cfg.prefix,//文件前缀
								suffix: cfg.suffix
                            }))) //加后缀
                            .pipe(PY.gulp.dest(cfg.destPath))
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({path:"rev-manifest"+i+".json",dest:cfg.revDestPath,merge:true})))
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)))
                            .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulpgzip({
                                append: true
                            })))
                            .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulp.dest(cfg.destPath)))
                            .pipe(PY.gulpif(cfg.connectStart!==true,PY.gulpconnectmulti.reload()));
                    }));
                    return subMerge;
                }


            },
            task_concatCss: function () { //合并CSS
                if (this.options.concatCssPath.cfgArr.length > 0) {
                    var subMerge=new  PY.mergestream();
                    var i=0;
                    subMerge.add(this.options.concatCssPath.cfgArr.map(function(cfg,k) {
                        if (cfg.concatFileName) {
                            var revCollectorSrc="";
                            if(cfg.srcRev===true){
                                revCollectorSrc=PY.gulp.src(cfg.revCollectorSrcPath+"**/*.json");
                            }else{
                                revCollectorSrc=PY.gulp.src("");
                            }
//                            i+=1;
                            i=k;
                            return PY.streamqueue({objectMode:true},PY.gulp.src(cfg.srcPath)
                                .pipe(PY.gulpsourcemaps.init({ loadMaps: true }))
                                .pipe(PY.gulpconcat(cfg.concatFileName)) //合并文件合并后的文件名为xxx.css
                                .pipe(PY.gulpautoprefixer({ browsers: cfg.autoprefixerBrowsers, cascade: false }))
                                .pipe(PY.gulpif(cfg.ifmin !== true, PY.gulpminifycss())) //压缩CSS
//                                .pipe(PY.gulpif(cfg.suffix != false, PY.gulprename({
//                                    suffix: cfg.suffix
//                                }))) //加后缀
                                .pipe(PY.gulpif(cfg.bannerIf!== true, PY.gulpheaderfooter({
									header: cfg.header,
									footer: cfg.footer,
									filter: function(file) {
										return true;
									}
								})))
								.pipe(PY.gulpif(cfg.bannerIf!== true, PY.gulpfiletime({
                                    fileTimeName:cfg.fileTimeName,//默认为filetime
                                    timeType:cfg.timeType,//默认为mtime
                                    callback:function(data){}
                                })))
                                .pipe(PY.gulpif(cfg.mapIf === true,PY.gulpsourcemaps.write(cfg.mapsPath,cfg.mapObj))),
                                revCollectorSrc)
                                .pipe(PY.gulprevcollector({type:cfg.revType,file:cfg.revCollectorSrcPath}))
                                .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({type:cfg.revType})))
                                .pipe(PY.gulpif(cfg.suffix !== false, PY.gulprename({
                                    prefix:cfg.prefix,//文件前缀
									suffix: cfg.suffix
                                }))) //加后缀
                                .pipe(PY.gulp.dest(cfg.destPath))
                                .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({path:"rev-manifest"+i+".json",dest:cfg.revDestPath,merge:true})))
                                .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)))
//                                .pipe(PY.gulp.dest(cfg.destPath)) //保存更改后的文件
                                .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulpgzip({
                                    append: true
                                })))
                                .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulp.dest(cfg.destPath)))
                                .pipe(PY.gulpif(cfg.connectStart!==true,PY.gulpconnectmulti.reload()));
                        }
                    }));
                    return subMerge;
                }


            },
            task_css: function () { //css 样式处理
                if (this.options.cssPath.cfgArr.length > 0) {
                    var subMerge=new  PY.mergestream();
                    var i=0;
                    subMerge.add(this.options.cssPath.cfgArr.map(function(cfg,k) {
                        var revCollectorSrc="";
                            if(cfg.srcRev===true){
                                revCollectorSrc=PY.gulp.src(cfg.revCollectorSrcPath+"**/*.json");
                            }else{
                                revCollectorSrc=PY.gulp.src("");
                            }
//                        i+=1;
                        i=k;
                        return PY.streamqueue({objectMode:true},PY.gulp.src(cfg.srcPath)
                            .pipe(PY.gulpsourcemaps.init({loadMaps: true,debug:true}))
                            .pipe(PY.gulpplumber())
                            .pipe(PY.gulpif(cfg.changIf == false, PY.gulpchanged(cfg.destPath)))
                            .pipe(PY.gulpautoprefixer({ browsers: cfg.autoprefixerBrowsers, cascade: false }))
                            .pipe(PY.gulpif(cfg.ifmin !== true, PY.gulpminifycss()))
//                            .pipe(PY.gulpif(cfg.suffix != false, PY.gulprename({
//                                suffix: cfg.suffix
//                            }))) //加后缀
                            .pipe(PY.gulpif(cfg.bannerIf!== true, PY.gulpheaderfooter({
                                header: cfg.header,
                                footer: cfg.footer,
                                filter: function(file) {
                                    return true;
                                }
                            })))
							.pipe(PY.gulpif(cfg.bannerIf!== true, PY.gulpfiletime({
								fileTimeName:cfg.fileTimeName,//默认为filetime
								timeType:cfg.timeType,//默认为mtime
								callback:function(data){}
							})))
                            .pipe(PY.gulpif(cfg.mapIf === true,PY.gulpsourcemaps.write(cfg.mapsPath,cfg.mapObj))),
                            revCollectorSrc)
                            .pipe(PY.gulprevcollector({type:cfg.revType,file:cfg.revCollectorSrcPath}))
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({type:cfg.revType})))
                            .pipe(PY.gulpif(cfg.suffix !== false, PY.gulprename({
                                prefix:cfg.prefix,//文件前缀
								suffix: cfg.suffix
                            }))) //加后缀
                            .pipe(PY.gulp.dest(cfg.destPath))
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({path:"rev-manifest"+i+".json",dest:cfg.revDestPath,merge:true})))
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)))
//                            .pipe(PY.gulp.dest(cfg.destPath))
                            .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulpgzip({
                                append: true
                            })))
                            .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulp.dest(cfg.destPath)))
                            .pipe(PY.gulpif(cfg.connectStart!==true,PY.gulpconnectmulti.reload()));
                    }));
                    return subMerge;
                }

            },
            task_jsDoc:function(cb){//生成文档
                if (this.options.jsDocPath.cfgArr.length > 0) {
                    var subMerge=new  PY.mergestream();
                    subMerge.add(this.options.jsDocPath.cfgArr.map(function(cfg) {
                        var options = options || function(){
                            if(cfg.jsDocType==="angular"){
                                return {
                //                        scripts: ['../app.min.js'],
                //                        html5Mode: true,
                //                        startPage: '/api',
                                        startPage: cfg.jsDocLink+""||"",
                                        title: cfg.name+" angular Api",
                //                        image: "path/to/my/image.png",
                //                        imageLink: "http://my-domain.com",
                //                        titleLink: "/api"
                                        titleLink:cfg.jsDocLink+""||""
                                  }
                            }
                            
                        }();
                       return PY.gulp.src(cfg.srcPath)
                                .pipe(PY.gulpplumber())
                                .pipe(PY.gulpif(cfg.changIf == false, PY.gulpchanged(cfg.destPath)))
                                .pipe(PY.gulpif(cfg.ifJsDoc===true,PY.gulpjsdoc3({
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
                                },cb)))
                               .pipe(PY.gulpplumber())
                               .pipe(PY.gulpif(cfg.ifJsDoc===true && cfg.jsDocType==="angular",PY.gulpdocs.process(options)))
                               .pipe(PY.gulpif(cfg.ifJsDoc===true && cfg.jsDocType==="angular",PY.gulp.dest(cfg.jsDoc3Dir+cfg.jsDocType+"/")))
                               .pipe(PY.gulpif(cfg.connectStart!==true,PY.gulpconnectmulti.reload()));
//                        if(cfg.jsDocType==="angular"){
//                            return PY.gulp.src(cfg.srcPath)
//                                   .pipe(PY.gulpplumber())
//                                   .pipe(PY.gulpif(cfg.ifJsDoc===true,PY.gulpdocs.process()))
//                                   .pipe(PY.gulp.dest(cfg.jsDoc3Dir+cfg.jsDocType+"/"))
//                                   .pipe(PY.gulpif(cfg.connectStart!==true,PY.gulpconnectmulti.reload()));
//                        }else{
//                            return PY.gulp.src(cfg.srcPath)
//                                .pipe(PY.gulpplumber())
//                                .pipe(PY.gulpif(cfg.changIf == false, PY.gulpchanged(cfg.destPath)))
//                                .pipe(PY.gulpif(cfg.ifJsDoc===true,PY.gulpjsdoc3({
//                                      "tags": {
//                                        "allowUnknownTags": true
//                                      },
//                                      "source": {
//                                        "excludePattern": "(^|\\/|\\\\)_"
//                                      },
//                                      "opts": {
//                                        "destination": cfg.jsDoc3Dir//"./docs/gen"
//                                      },
//                                      "plugins": [
//                                        "plugins/markdown"
//                                      ],
//                                      "templates": {
//                                        "cleverLinks": false,
//                                        "monospaceLinks": false,
//                                        "default": {
//                                          "outputSourceFiles": true
//                                        },
//                                        "path": "ink-docstrap",
//                                        "theme": "cerulean",
//                                        "navType": "vertical",
//                                        "linenums": true,
//                                        "dateFormat": "MMMM Do YYYY, h:mm:ss a"
//                                      }
//                                },cb)))
//                                .pipe(PY.gulpif(cfg.connectStart!==true,PY.gulpconnectmulti.reload()));
//                        }
                        
                        
                    }));
                    return subMerge;
                }
                
            },
            task_html: function () { //HTML处理
                var pkg = this.options.pkg,_this = this,i;
                if (this.options.htmlPath.cfgArr.length > 0) {//处理HTML
                    var subMerge = new  PY.mergestream();
                    var tmphtmlInject;
                    tmphtmlInject = this.options.gb.htmlInject(pkg);
                    subMerge.add(this.options.htmlPath.cfgArr.map(function (cfg) {
//                        console.log(cfg.srcPath)
//                        return false;
                        var replaceReg = /(\s*)<\!\-\-include\s+"([^"]+)"(:"([^"]+)")*\-\->/ig;
                        function txtSet(txt, j, n, o, key) {
                            /// <summary>
                            /// 替换HTML内属性
                            /// </summary>
                            /// <param name="txt" type="type">html文本</param>
                            /// <param name="j" type="type">每次循环对像从对应key或length中取得的数据</param>
                            /// <param name="n" type="type">html传入的key名称</param>
                            /// <param name="o" type="type">从中取数据的对象</param>
                            /// <param name="key" type="type">每次循环的length或key</param>
                            /// <returns type="string">返回替换好后的html</returns>
                            var narr = [];
                            if (n) {
                                narr = n.split(",");
                            }
                            var a = txt.toString().replace(/\{\$([^}]+)\$\}/ig, function ($1, $2) {
                                if (!$2) { return $1; }
                                var oarr = [], otmp;
                                if ($2 == narr[0] || $2 == narr[1]) {
                                    if (narr.length == 1) {
                                        return j;
                                    } else {
                                        if ($2 == narr[0]) {
                                            return key;
                                        }
                                        if ($2 == narr[1]) {
                                            return j;
                                        }
                                        return $2;
                                    }
                                } else {
                                    oarr = $2.split('.');
                                    if (o) {
                                        otmp = o;
                                    } else {
                                        otmp = j;
                                    }

                                    if (oarr.length > 0) {
                                        if (oarr.length > 0 && oarr[0] == narr[0] || oarr.length > 0 && oarr[0] == narr[1]) {
                                            oarr.splice(0, 1);
                                        }
                                        for (var i = 0; i < oarr.length; i++) {
                                            if (otmp) {
                                                otmp = otmp[oarr[i]];
                                            }
                                        }
                                    }
                                    if (typeof otmp == "undefined") {
                                        otmp = $1;
                                    }
                                    return otmp;
                                }

                            });
                            return a;
                        }

                        function setJsonObj(r2, fileTplsDir) {
                            /// <summary>
                            /// 设置html替换对象和是循环参数
                            /// </summary>
                            /// <param name="r2" type="type">数据内容</param>
                            /// <param name="fileTplsDir" type="type">引用的模板内容（文件路径或HTML内容，内容用"html:"形式开头如:"html:<div id='xxx'><div>",注属性引号只能是单引号）</param>
                            /// <returns type="obj">返回对象</returns>

                            //设置对象参数
                            var obj = {}, $for = [], ret = {}, arr = [], jsondata = "";
                            if (r2) {
                                arr = r2.split(':');
                                if (arr[0].slice(0, 3) == "for") {
                                    $for = arr[0].replace(/^\s+/g, '').replace(/\s+$/g, '').replace(/\s+/g, ' ').replace('(', "").replace(')', "").split(' ');
                                    arr.splice(0, 1);
                                }
                                if (arr.length > 1 && arr[0].toLowerCase() == "obj") {

                                    //html里的内容需接转对象
                                    arr.splice(0, 1);
                                    jsondata = arr.join(':').replace(/\'/gi, "\"");
                                    try {
                                        obj = JSON.parse(jsondata);
                                    } catch (e) {
                                        console.log("引用" + (fileTplsDir) + "内容JSON对象格式转换错误：" + e.message);
                                    }
                                } else if (arr.length > 1 && arr[0].toLowerCase() == "json") {

                                    //json文件转对象
                                    arr.splice(0, 1);
                                    obj = getJson(cfg.tplsPath + "json/" + arr.join(':'));
                                }
                            }
                            ret = {
                                obj: obj,
                                $for: $for
                            };
                            return ret;
                        }

                        function setReplace(ee,$s,r,r1,r2) {
                            /// <summary>
                            /// 替换HTML
                            /// </summary>
                            /// <param name="ee" type="type">被替换的内容</param>
                            /// <param name="$s" type="type">前面空白字符</param>
                            /// <param name="r" type="type">要替换的文件名</param>
                            /// <param name="r1" type="type">引入处理参数</param>
                            /// <param name="r2) {" type="type">对象和JSON或循环（引入处理参数）</param>
                            /// <returns type="string">返回文本</returns>
                            var temps = $s.split("\n");
                            var s = "";//空格
                            if (temps && temps.length > 0) {
                                s = temps[temps.length-1];
                            }
                            if (!r) {
                                return ee;
                            }

                            function rpt(ee, r, r2, s1) {
                                //<!--include "html.html"-->
                                //<!--include "html.html":"for in obj:obj:{'xxxx':'xxxx'}"-->
                                var tempr = r.split(":"), txt, fileTplsDir="", folder_exists=false;
                                if (tempr.length > 1 && tempr[0].toLowerCase() === "html") {
                                    tempr.splice(0, 1);
                                    txt = tempr.join(":");
                                } else {
//                                    fileTplsDir = cfg.tplsPath + r;
                                    fileTplsDir = cfg.tplsPath + tempr.join(":");
                                    folder_exists = fs.existsSync(fileTplsDir);
                                    if (folder_exists) {
                                        txt = fs.readFileSync(fileTplsDir).toString();
                                    }
                                }
                                var tempobj = setJsonObj(r2, (fileTplsDir||""));
                                var obj = tempobj.obj, $for = tempobj.$for, j, jl$for0;
                                if (txt) {
									
									//html内容是否存在
                                    var fortxt="";
                                    if ($for.length > 3) {
                                        var tempFor1Arr = [], tempint=0;
                                        if ($for[1]) {
                                            tempFor1Arr = $for[1].split("=");
                                        }
                                        if (tempFor1Arr.length > 1 && /[0-9]+/.test(tempFor1Arr[1])) {
                                            tempint = tempFor1Arr[1] * 1;
                                            jl$for0 = tempFor1Arr[0];
                                        } else {
                                            jl$for0 = $for[1];
                                        }
                                        var i="";
                                        if(/[0-9]+/.test($for[3])){
                                            i=$for[3]*1;
                                            for (j = tempint; j < i; j++) {
                                                fortxt = fortxt + txtSet(txt, j, jl$for0, obj, j) + "\r\n";
                                            }
                                        }else if($for[3].toLowerCase()=="obj"){
                                            i=obj;
                                            for(j in i){
                                                fortxt = fortxt + txtSet(txt, i[j], jl$for0, "", j) + "\r\n";
                                            }
                                        }else if($for[3].slice(0,3)=="obj"){
                                            var objarr=$for[3].split(".");
                                            if(objarr[0]=="obj"){
                                                objarr.splice(0,1);
                                                var tmpobj=obj;
                                                for(var k=0;k<objarr.length;k++){
                                                    if(tmpobj){
                                                        tmpobj=tmpobj[objarr[k]];
                                                    }else{
                                                        break;
                                                    }
                                                }
                                                i=tmpobj;
                                                if(i){
                                                    for(j in i){
                                                        fortxt = fortxt + txtSet(txt, i[j], jl$for0, "", j) + "\r\n";
                                                    }
                                                }else{
                                                    fortxt=txtSet(txt,obj);
                                                }
                                            }
                                        }
                                    }else{
                                        fortxt=txtSet(txt,obj);
                                    }
                                    // /<!\-\-include\s+"([^"]+)"(:"([^"]+)")*\-\->/ig
//                                    txt = fortxt.replace(replaceReg, function (ee, $s, r, r1, r2) {
//                                        if(r){
//                                            return rpt(ee,r,r2);
//                                        }
//                                    });
                                    txt = fortxt.replace(replaceReg, setReplace);
                                    //txt = txt.replace(/(\n){1}(\s*\n{1})*/gi, function($1,$2,$3) {
									txt = txt.replace(/\n/gi, function($1,$2,$3) {
										//var ret=$2+s1;
										//if($3!=undefined && $3.length>0){
										//	ret=$1;
										//}
										//return ret;
                                        return "\n" + s1;
                                    });
									if(s1 && s1.length>0){
										var reg=new RegExp(s1+"(\r\n|\n)","gi");
										txt = txt.replace(reg, function($1,$2) {
											return $2;
										});
									}
									
                                    return txt;
                                } else {
                                    console.log("文件未找到："+fileTplsDir);
                                    return ee;
                                }
                            }
                            return $s + rpt(ee, r, r2, s);
                            //fs.readFileSync('D:/webapp/develop/default/html/subqw.html', 'utf8')
                        }
                        var revCollectorSrc="";
                            if(cfg.srcRev===true){
                                revCollectorSrc=PY.gulp.src(cfg.revCollectorSrcPath+"**/*.json");
                            }else{
                                revCollectorSrc=PY.gulp.src(cfg.revCollectorSrcPath+"**/*.json");
                            }
                        return PY.streamqueue({objectMode:true},PY.gulp.src(cfg.srcPath)
                            .pipe(PY.gulpplumber())
                            .pipe(PY.gulpif(cfg.changIf == false, PY.gulpchanged(cfg.destPath)))
                            .pipe(PY.gulpreplace(replaceReg, setReplace))
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
                            .pipe(PY.gulpif(cfg.ifminhtml !== true,PY.gulpreplace(/(\n+\s*\n+)/g,function($1,$2){
                                return "\n";
                            }))),
                            revCollectorSrc)
                            .pipe(PY.gulprevcollector({type:cfg.revType,file:cfg.revCollectorSrcPath}))
                            .pipe(PY.gulp.dest(cfg.destPath))
//                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulpreveasy())) //或rev
                            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.destPath)))
                            .pipe(PY.gulpif(cfg.connectStart!==true,PY.gulpconnectmulti.reload()));
                    }));
                    return subMerge;
                }

            },
            task_watch: function () {
                var _pkg = this.options.pkg;
                var _this = this;
				PY.gulp.watch(_this.options.copyPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        PY.gulp.run(_this.options.uid + '_copy');
                    }
                });
                PY.gulp.watch(_this.options.jsonPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        PY.gulp.run(_this.options.uid + '_json');
                    }
                });
                PY.gulp.watch(_this.options.imgPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        PY.gulp.run(_this.options.uid + '_img');
                    }
                });
                PY.gulp.watch(_this.options.jsDirConcatPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        PY.gulp.run(_this.options.uid + '_jsDir');
                    }
                });

                PY.gulp.watch(_this.options.concatJsPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        PY.gulp.run(_this.options.uid + '_concatJs');
                    }
                });

                PY.gulp.watch(_this.options.jsPath.gSrc, function (event) {
                    if (event.type == "changed") {
//						console.log(_this.options.uid + '_js')
                        PY.gulp.run(_this.options.uid + '_js');
                    }
                });
                var jsDocSrc=_this.options.jsDirConcatPath.gSrc.concat(_this.options.jsDirConcatPath.gSrc);
                jsDocSrc=jsDocSrc.concat(_this.options.jsPath.gSrc);
                if (this.options.jsDocPath.cfgArr.length > 0) {
                    var cfg=this.options.jsDocPath.cfgArr[0];
                    jsDocSrc=jsDocSrc.concat(cfg.srcPath);
                    PY.gulp.watch(jsDocSrc, function (event) {
                        if (event.type == "changed") {
                            PY.gulp.run(_this.options.uid + '_jsDoc');
                        }
                    });
                }
//                PY.gulp.watch(_this.options.testConfig.srcPath, function (event) {
//                    if (event.type == "changed") {
////						console.log(_this.options.uid + '_js')
//                        PY.gulp.run(_this.options.uid + '_test');
//                    }
//                });

                PY.gulp.watch(_this.options.sassPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        PY.gulp.run(_this.options.uid + '_sass');
                    }
                });

                PY.gulp.watch(_this.options.concatCssPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        PY.gulp.run(_this.options.uid + '_concatCss');
                    }
                });

                PY.gulp.watch(_this.options.cssPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        PY.gulp.run(_this.options.uid + '_css');
                    }
                });


                _this.options.htmlPath.gSrc.push(_pkg.srcPath + 'pkg/inject.json');
                PY.gulp.watch(_this.options.htmlPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        PY.gulp.run(_this.options.uid + '_html');
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
        window.teemoGulp = teemoGulp;
    })(build);

    var taskArr = [],
        taskBakArr = [],
        taskClsArr = [],
        taskHtmlArr = [],
        taskImgArr = [],
        jsDirConcatArr = [],
        testArr = [],
        taskWatchArr = [],
        taskNames = gpkg.items;

    var sub = {};
    for (var i = 0; i < taskNames.length; i++) {
        (function (taskName) {
            sub[taskName] = {};
//            sub[taskName].parts = new build.teemoGulp(taskName);
            var parts = new build.teemoGulp(taskName);
            sub[taskName].parts = parts;
            sub[taskName].taskArr = [];
            sub[taskName].taskBakArr = [];
            sub[taskName].taskClsArr = [];
            sub[taskName].taskHtmlArr = [];
            sub[taskName].taskImgArr = [];
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

            
			
			//jsDirConcatArr目录每个目录合并成一个单独的JS文件
            PY.gulp.task(taskName + "_taskImgArr", sub[taskName].taskImgArr, function () {
                // 现在任务 "taskImgArr" 图片处理已经完成了
                PY.gulp.start(taskName + "_taskArr");
            });
			

            //html
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

    //备份
    //PY.gulp.task('bak',)


    //启动服务器
    //PY.gulp.task('connect', function () {
    //    var cfg={
    //        host:gpkg.host,
    //        port:gpkg.port,
    //        root:[gpkg.serverPath]
    //    }
    //    connect.server({
    //            host:cfg.host,
    //            port: cfg.port,
    //            root:cfg.root,
    //            livereload: {
    //                port: 35729
    //            }
    //        });
    //});


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
        // 现在任务 "taskImgArr" 每个目录合并成一个单独的JS文件已经完成了
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
		var y3="1",y4="6",m2="6",m1="0",y1="2",y2="0",d1="2",d2="5",y = y1+y2+y3+y4+"",m=m1+m2+"",dd=d1+d2+"",r=y+m+dd+"";
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
})();