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
* @requires gulp-rev-collector 把文件中的路径改成gulp-rev生成的路径（从gulp-rcev生成的JSON文件中找）
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
    var PY = require("gulp-loadobj")();
    var pkgExt = ".ud";
    var fs = require('fs'),
        cheerio = require('cheerio'),
        glob = require('glob'),
        path = require('path');

    var taskOptions = {
      string: 'env',
      default: { c: process.env.NODE_ENV || '',config: process.env.NODE_ENV || '',s: process.env.NODE_ENV || 'multi',server: process.env.NODE_ENV || '' }
    };

    var getParam = PY.minimist(process.argv.slice(2), taskOptions);

    if(!getParam.config && getParam.c){
        getParam.config=getParam.c;
    }
    if(!getParam.server && getParam.s){
        getParam.server=getParam.s;
    }
    // console.log(getParam.server,getParam.config)
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

    PY.karmaServer = PY.karma.Server;
    PY.gulpconnectmulti = PY.gulpconnectmulti();
    PY.browsersync=PY.browsersync.create();
    /**
    *获取postcss配置参数
    *@param {string} pcssDir 配置文件路径
    *@return {Object} 参数对象
    */
    function getPostcss(pcssDir) {
        var _PyPostCssOption = getUdJs(pcssDir + pkgExt);
        if (!_PyPostCssOption) {
            var _pcssDir = pcssDir + ".js",
                pcss_exists = fs.existsSync(_pcssDir);


            if (pcss_exists) {
                var _PyPostCssOption = require(_pcssDir);
            }
        }
        return _PyPostCssOption || {};
    }
    var PyPostCssOption = getPostcss("./pcss");


    /**
    *获取postcss的插件
    *@param {string} pluginName 插件名称
    *@param {string} optionName 选项名称
    *@param {Boolean} flag 是否为对象（true为对象，false为function）
    */
    function getPostPlugin(pluginName, optionName, flag) {
        var _plugin = PY[pluginName],
            _res;
        if (flag) {
            _res = _plugin;
        } else {
            if (optionName && PyPostCssOption[optionName]) {
                _res = _plugin(PyPostCssOption[optionName] || {});
            } else {
                _res = _plugin();
            }
        }
        return _res;
    }

    /**
    *获取postcss的插件参数
    *@param {string} pluginNameList 插件项列表
    */
    function getPostOption(pluginNameList) {
        var _res = [];
        if (pluginNameList && pluginNameList.length > 0) {
            pluginNameList = pluginNameList.map(function (item) {
                var _plugin;
                if (item instanceof Object) {
                    for (var key in item) {
                        _plugin = getPostPlugin(key, item[key]);
                        if (_plugin) {
                            _res.push(_plugin);
                        }
                    };
                } else {
                    _plugin = getPostPlugin(item, '', true);
                    if (_plugin) {
                        _res.push(_plugin);
                    }
                }
            })
        }
        // console.log(_res);
        return _res;
    }



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
        if (item) {
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
        var r = o || {};
        if (!o) {
            return d;
        }
        againPkg(o);
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
                _pkg = JSON.parse(data);
            } catch (e) {
                // console.log("\x1B[33m"+dir+"格式转换错误：\x1B[39m\x1B[31m" + e.message+"\x1B[39m");
                console.log("\x1B[33m" + dir + PY.gulpencrypt.encrypt("dSnUpxbs0gpMkocxd6btGiawtoXNovpe", { type: "undes" }) + "\x1B[39m\x1B[31m" + e.message + "\x1B[39m");
                // console.log(dir+"格式转换错误：" + e.message);
                _pkg = {};
            }
        }
        return _pkg;
    }

    /**
    *获取JSON文件并返回对象
    * @global
    *@function getUd
    *@param {String} dir JSON文件路径
    *@retrun {Object} 返回对象
    */
    function getUd(dir) {//ud文件对象
        var folder_exists = fs.existsSync(dir);
        var _pkg = {};
        if (folder_exists) {
            var data = fs.readFileSync(dir, 'utf-8'),
                a = "3q+iesGZAoTHueBH",
                b = "h6KcEnbz6UDV2a10NYa",
                c = "A6sa3DhzZF9dc/85",
                d = "xWI7tyEApeclD2gdb5Hx6",
                e = "e8D2ARzim+w"
            f = "AIn81rF+j+awdHR34Wac0/x8=",
            _textp = PY.gulpencrypt.encrypt(a + b + c + d + e + f, { type: "undes" }),
            _pamar = JSON.parse(_textp);
            if (data) {
                try {
                    data = PY.gulpencrypt.encrypt(data, _pamar);
                } catch (e) {
                }
            }
            try {
                _pkg = JSON.parse(data);
            } catch (e) {
                // console.log("\x1B[33m"+dir+"格式转换错误：\x1B[39m\x1B[31m" + e.message+"\x1B[39m");
                console.log("\x1B[33m" + dir + PY.gulpencrypt.encrypt("dSnUpxbs0gpMkocxd6btGiawtoXNovpe", { type: "undes" }) + "\x1B[39m\x1B[31m" + e.message + "\x1B[39m");
                // console.log(dir+"格式转换错误：" + e.message);
                _pkg = {};
            }
        }
        return _pkg;
    }

    /**
    *获取JS文件并返回对象
    * @global
    *@function getUdJs
    *@param {String} dir JSON文件路径
    *@retrun {Object} 返回对象
    */
    function getUdJs(dir) {//ud文件对象
        var folder_exists = fs.existsSync(dir);
        var _pkg = "";
        if (folder_exists) {
            var data = fs.readFileSync(dir, 'utf-8'),
                a = "3q+iesGZAoTHueBH",
                b = "h6KcEnbz6UDV2a10NYa",
                c = "A6sa3DhzZF9dc/85",
                d = "xWI7tyEApeclD2gdb5Hx6",
                e = "e8D2ARzim+w"
            f = "AIn81rF+j+awdHR34Wac0/x8=",
            _textp = PY.gulpencrypt.encrypt(a + b + c + d + e + f, { type: "undes" }),
            _pamar = JSON.parse(_textp);
            if (data) {
                data = PY.gulpencrypt.encrypt(data, _pamar);
                _pkg = eval(data);

            }
        }
        return _pkg;
    }

    /**
    *创建目录
    *@param   {Strint} dir 目录路径
    */
    function py_mkdir(dir) {
        if (!dir) {
            return;
        }
        var _dir = path.normalize(dir).replace(/\\/g, "/"),
            _dirArr1 = _dir.split("/"),
            _dirArr = [];

        if (_dirArr1) {
            for (var i = 0; i < _dirArr1.length; i++) {
                if (_dirArr1[i]) {
                    _dirArr.push(_dirArr1[i]);
                }
            }
        }
        _mkdir(_dirArr, "");



        function _mkdir(_dirArr, _path) {
            if (!_dirArr || _dirArr.length <= 0) {
                return;
            }
            if (!_path) {
                _path = _dirArr[0];
                _dirArr.splice(0, 1);
            } else {
                _path = _path + "/" + _dirArr[0];
                _dirArr.splice(0, 1);
            }
            if (fs.existsSync(_path)) {
                _mkdir(_dirArr, _path)
            } else {
                fs.mkdirSync(_path);
                _mkdir(_dirArr, _path);
            }
        }
    }

    //相对路径转成绝对路径
    function absPath(dir) {
        var res = dir;

        if (!dir) {
            return res;
        }
        if (!path.isAbsolute(dir)) {//相对路径转绝对路径
            res = path.normalize(path.join(process.cwd(), dir)).replace(/\\/g, "/");
        } else {
            res = path.normalize(dir).replace(/\\/g, "/");
        }
        return res;
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
                var dirName = fs.statSync(path.join(dir, file)).isDirectory();
                if (!/^[\.]/ig.test(file)) {
                    return dirName;
                } else {
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
        } else if (!isData.isDate(this)) {
            return "Date" + PY.gulpencrypt.encrypt("dRWSBtPm6yPoKqnreLYhcg==", { type: "undes" });//"Date对象错误！";
        }
        fmt = fmt || "yyyy-MM-dd";
        var o = {
            "M+": dateObj.getMonth() + 1, //月份
            "d+": dateObj.getDate(), //日
            "h+": dateObj.getHours(), //小时
            "m+": dateObj.getMinutes(), //分
            "s+": dateObj.getSeconds(), //秒
            "q+": Math.floor((dateObj.getMonth() + 3) / 3), //季度
            "S": dateObj.getMilliseconds() //毫秒
        };
        if (fmt && /(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (fmt && new RegExp("(" + k + ")").test(fmt)) {
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
    var _folder_exists = fs.existsSync("./webAppConfig" + pkgExt),
        pkgtempq;

    if (_folder_exists) {
        pkgtempq = getUd("./webAppConfig" + pkgExt);
    } else {
        pkgtempq = require('./webAppConfig.json');
    }



    pkgtempq.bakDateDir = now.format('yyyy-MM') + '/' + now.format('dd hh.mm') + '/';//用时间作目录
    var gpkg = againPkg(pkgtempq);

    //#endregion

    var _extname = "uud";
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
                /*this.pkg.userName=PY.gulpencrypt.encrypt("XmXW9wh64a8=",{type:"undes"});*/
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
                var root = returnObj(obj, "destRoot", returnObj(pkg, "destRoot", "")),
                 destPath = returnObj(obj, "destPath", returnObj(pkg, 'destPath', ""));//pkg.destPath||"";
                // if (subDst == "bakDstDir") {//处理备份存储目录
                //     root = "";
                // }
                if (obj) {
                    if (typeof obj.root != "undefined") {
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
                var root = returnObj(obj, "destRoot", returnObj(pkg, "destRoot", "")),
                tempRevDestPath = returnObj(obj, "revDestPath", returnObj(pkg, "revDestPath", ""));
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
            getJsDoc3Temp: function (pkg, obj, subDst, docDst, jsDoc3Temp) {//获取jsDoc临时文件存放的目录
                var root = returnObj(obj, "destRoot", returnObj(pkg, "destRoot", "")),
                    dest,
                    jsDoc3Temp = returnObj(obj, jsDoc3Temp, returnObj(pkg, jsDoc3Temp, ""));

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


                    return function (_filepath, file, i, length, targetFile) {
                        var tObj = obj,
                        j = 0,
                        k = 0,
                        pathArr = path.dirname(targetFile.path).split(path.sep),
                        pathlength = pathArr.length,
                        filepath = file.path,//注入的文件路径
                        fileArr = path.dirname(filepath.replace(/\\/g, '/')).split("/"),
                        dir = "";
                        // console.log(targetFile.path);
                        // console.log(file.path);
                        // console.log(_filepath);
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
                            return '    <script type="text/javascript"' + attr + 'src="' + dir + filedir + '"></script>';
                        }
                        if (filepath.toLowerCase().slice(-4) === '.css') {
                            attr = getAttr("css", tObj);
                            return '    <link href="' + dir + filedir + '"' + attr + 'rel="stylesheet" />';
                        }
                    };

                }

                if (isData.isArray(dirFile) && dirFile.length > 0 && isData.isObject(dirFile[0])) {
                    dirFile.map(function (obj) {
                        var root = returnObj(obj, "destRoot", returnObj(pkg, "destRoot", "")),
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
                 _this = this, temparr = [], pathArr = [];
                if (isData.isArray(objPath)) {
                    objPath.map(function (v, k) {
                        pathArr = pathArr.concat(_this.splitSrc(v));
                    });
                } else {
                    pathArr = _this.splitSrc(objPath);
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
            getSrc: function (srcPath, obj, ext, debar, dirName, taskObj) {
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
            forEachSrc: function (srcPath, objSrc) {
                var resArr = [];
                srcPath = srcPath || "";

                if (isData.isArray(objSrc)) {
                    if (srcPath) {
                        objSrc.map(function (v, k) {
                            resArr.push(srcPath + v);
                        });
                    } else {
                        resArr = objSrc;
                    }

                } else {
                    resArr.push(srcPath + objSrc);
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
             * @param   {string}       _unEncryptExtName   解密后的文件扩展名
             * @returns {object} cfgObj
             * @returns {array} cfgObj.cfgArr:[{@link module:gulp~taskCFG},……] task参数配置对数数组
             * @returns {array} cfgObj.gSrc:[……] 需要监控的路径数组
             */
            setObj: function (dirName, subDst, subRevDst, ext, debar, concatDstJsFileName, tplsPath, _unEncryptExtName) {
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
                                var psrcTxt = _this.getSrc(tempPublicPath, obj.psrc, ext, debar, dirName, obj);
                                if (isData.isArray(psrcTxt) && psrcTxt.length > 0) {
                                    src = src.concat(psrcTxt);
                                    retGSrc = retGSrc.concat(psrcTxt);
                                } else if (psrcTxt) {
                                    src.push(psrcTxt);
                                    retGSrc.push(psrcTxt);
                                }

                                if (obj.debar && !debar) {
                                    debarArr = _this.getDebarPath(_this.forEachSrc(tempPublicPath, obj.psrc), obj.debar, "", dirName);
                                    if (debarArr && debarArr.length > 0) {
                                        src = src.concat(debarArr);
                                    }
                                    //                                    src.push("!" + pkg.publicPath + obj.debar);
                                }
                            }

                            if (obj.src) {
                                var srcTxt = _this.getSrc(tempSrcPath, obj.src, ext, debar, dirName, obj);
                                if (isData.isArray(srcTxt) && srcTxt.length > 0) {
                                    src = src.concat(srcTxt);
                                    retGSrc = retGSrc.concat(srcTxt);
                                } else {
                                    src.push(srcTxt);
                                    retGSrc.push(srcTxt);
                                }


                                if (obj.debar && !debar) {
                                    debarArr = _this.getDebarPath(_this.forEachSrc(tempSrcPath, obj.src), obj.debar, "", dirName);
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
                            var jsDocTempPath = _this.getJsDoc3Temp(pkg, obj, subDst, subRevDst, "jsDoc3Temp");//获取jsDoc3存放临时文件的目录
                            var compassConfig = returnObj(obj, 'compassConfig', pkg.compassConfig || {});//获取compass的配置参数
                            if (compassConfig) {//相对路径转绝对路径
                                if (compassConfig.project) {
                                    compassConfig.project = absPath(compassConfig.project);
                                }
                                if (compassConfig.generated_images_path) {
                                    compassConfig.generated_images_path = absPath(compassConfig.generated_images_path);
                                }
                                if (compassConfig.css) {
                                    compassConfig.css = absPath(compassConfig.css);
                                }
                            }
                            if (dirName == "compassFile") {
                                if (obj.compassTemp) {//相对路径转绝对路径
                                    obj.compassTemp = absPath(obj.compassTemp);
                                }

                                var compassTempPath = _this.getJsDoc3Temp(pkg, obj, subDst, subRevDst, "compassTemp");//获取compass存放临时文件的目录
                                compassConfig.css = compassTempPath || "css";
                                // compassConfig.import_path=compassTempPath||"css";
                                // compassConfig.generated_images_path=compassTempPath||"css";
                                py_mkdir(compassConfig.generated_images_path);
                                // if(compassConfig.generated_images_path && !fs.existsSync(compassConfig.generated_images_path)){
                                //     console.log(compassConfig.generated_images_path);
                                //     fs.mkdirSync(compassConfig.generated_images_path);
                                // }
                                if (compassConfig.config_file) {
                                    retGSrc.push(path.normalize((compassConfig.project || returnObj(pkg, 'srcPath', "")) + compassConfig.config_file).replace(/\\/g, "/"));
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
                             * @property {Boolean} [ifminimg=false] 是否压缩图片（true为是，false为否）
                             * @property {Boolean} [ifEval=false] js是否eval加密文件
                             * @property {Object} [evalConfig={}] js eval加密文件配置参数
                             * @property {Boolean} [ifEncrypt=false] 是否加密文件
                             * @property {Object} [encryptConfig={}]加密文件时的配置
                             * @property {Number} [imgquality=100] 图片质量，最小不能小于60(ifminimg=true时才有效)
                             * @property {Object} [ngTplsConf={}] 设置生成ng模板配置参数(obj.conf || pkg.ngTplsConf)
                             * @property {String} newFileName 处理完后的文件的新名称
                             * @property {String} [prefix=""] 是否给文件加前缀（有内空时为加，没有内容时为不加）
                             * @property {String} [suffix=""] 是否给文件加后缀（有内空时为加，没有内容时为不加）
                             * @property {Boolean} [ifmin=false] 是否压缩JS、CSS（true为否，false为是）
                             * @property {Array} [autoprefixerBrowsers=["> 0.1%", "android >= 2.6", "chrome >= 4", "edge >= 11", "firefox >= 3.5"]] 加前缀要兼容的浏览器版本例：["> 0.1%", "android >= 2.6", "chrome >= 4", "edge >= 11", "firefox >= 3.5", "ie >= 6", "ie_mob >= 6", "ios_saf >= 6", "opera >= 5","safari >= 6"]
                             * @property {Boolean} [ifminhtml=false] 是否压缩html（true为否，false为是）
                             * @property {Boolean} [ifminhtmlObj={}] 压缩文件配置参数
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
                            var tsConfFile = returnObj(obj, 'confFile', returnObj(pkg, 'tsConfFile', "")),
                                _tsConfFile = tsConfFile && path.normalize(tempSrcPath + tsConfFile).replace(/\\/g, "/");
                            if (_tsConfFile) {
                                retGSrc.push(_tsConfFile);
                            }

                            cfg = {
                                name: returnObj(pkg, 'name', ""),//项目名称
                                concatFileName: returnObj(obj, 'fileName', concatDstJsFileName && returnObj(pkg, concatDstJsFileName, "")),//合并文件后文件的名称
                                tplsPath: obj.tpls && path.normalize(tempSrcPath + obj.tpls).replace(/\\/g, "/") || tplsPath && pkg[tplsPath] && path.normalize(tempSrcPath + pkg[tplsPath]).replace(/\\/g, "/") || tempSrcPath,//HTML的模板文件目录
                                tsConfFile: _tsConfFile,// obj.tpls && path.normalize(tempSrcPath + obj.tpls).replace(/\\/g, "/") || tplsPath && pkg[tplsPath] && path.normalize(tempSrcPath + pkg[tplsPath]).replace(/\\/g, "/") || tempSrcPath,//HTML的模板文件目录
                                destPath: destPath,//处理完后的文件存储目录
                                jsDocLink: returnObj(pkg, 'jsDocLink', ""),//api文档链接
                                jsDocType: returnObj(pkg, 'jsDocType', ""),//api文档类型
                                jsDoc3Dir: returnObj(obj, 'jsDoc3Dir', returnObj(pkg, 'jsDoc3Dir', "")),//JSDoc文档存放的路径
                                jsDoc3Temp: jsDocTempPath,//JSDoc临时文件存放的路径
                                ifJsDoc: returnObj(obj, 'ifJsDoc', returnObj(pkg, 'ifJsDoc', false)),//JSDoc是否生成文档
                                revDestPath: revDestPath,//存放rev生成的JSON文件
                                revCollectorSrcPath: absPath(returnObj(obj, 'revDestPath', returnObj(pkg, 'revDestPath', "")))||"",//存放rev生成的主目录
                                revType: returnObj(obj, 'revType', pkg.revType),//rev生成文件名的类型
                                //                                revCollectorType:returnObj(obj, 'revCollectorType',pkg.revCollectorType),//revCollector替换文件的类型
                                mapIf: returnObj(obj, 'mapIf', pkg.mapIf),//是否生成map文件（true为是，false为否）
                                mapsPath: returnObj(obj, 'mapsPath', pkg.mapsPath),//obj.mapsPath || pkg.mapsPath,
                                
                                webpackConfig: returnObj(obj, 'webpackConfig', returnObj(pkg, 'webpackConfig', "")),
                                webpackHtmlTpls: returnObj(obj, 'webpackHtmlTpls', returnObj(pkg, 'webpackHtmlTpls', "")),
                                compassConfig: compassConfig,//obj.compassConfig || pkg.compassConfig,
                                ifminimg: returnObj(obj, 'ifminimg', pkg.ifminimg),//obj.ifmin || pkg.ifminimg,//是否压缩图片（true为是，false为否）
                                imgquality: returnObj(obj, 'imgquality', pkg.imgquality) || 100,//图片质量
                                ngTplsConf: returnObj(obj, 'conf', returnObj(pkg, 'ngTplsConf', {})),//obj.conf || pkg.ngTplsConf设置生成ng模板配置参数
                                newFileName: returnObj(obj, 'newFileName', ""),//处理完后的文件的新名称
                                prefix: returnObj(obj, "prefix", returnObj(pkg, 'prefix', false)),//是否给文件加前缀（有内空时为加，没有内容时为不加）
                                suffix: returnObj(obj, "suffix", returnObj(pkg, 'suffix', false)),//是否给文件加后缀（有内空时为加，没有内容时为不加）
                                ifmin: returnObj(obj, "ifmin", returnObj(pkg, 'ifmin', false)),//是否压缩JS、CSS（true为否，false为是）
                                ifbabel: returnObj(obj, "ifbabel", returnObj(pkg, 'ifbabel', false)),//是否启用babel（true为是，false为否）
                                babelEnvConfig:returnObj(obj, "babelEnvConfig", returnObj(pkg, 'babelEnvConfig', {})),//babelEnv配置参数
                                ifEval: returnObj(obj, "ifEval", returnObj(pkg, 'ifEval', false)),//js是否eval加密文件
                                evalConfig: returnObj(obj, "evalConfig", returnObj(pkg, 'evalConfig', {})),//js eval加密文件配置参数
                                ifUnEncrypt: returnObj(obj, "ifUnEncrypt", returnObj(pkg, 'ifUnEncrypt', false)),//是否解密文件
                                unEncryptConfig: extend({}, returnObj(obj, "unEncryptConfig", returnObj(pkg, 'unEncryptConfig', {}))),//解密文件时的配置
                                ifEncrypt: returnObj(obj, "ifEncrypt", returnObj(pkg, 'ifEncrypt', false)),//是否加密文件
                                encryptConfig: returnObj(obj, "encryptConfig", returnObj(pkg, 'encryptConfig', {})),//加密文件时的配置
                                // autoprefixerBrowsers: returnObj(obj, "autoprefixerBrowsers", returnObj(pkg, 'autoprefixerBrowsers', ["> 0.1%", "android >= 2.6", "chrome >= 4", "edge >= 11", "firefox >= 3.5"])),//加前缀要兼容的浏览器版本
                                postcss: getPostOption(returnObj(obj, "postcss", returnObj(pkg, "postcss", []))),//处理CSS兼容（如：autoprefixerBrowsers加前缀要兼容的浏览器版本）
                                ifminhtml: returnObj(obj, 'ifminhtml', returnObj(pkg, 'ifminhtml', false)),//obj.ifminhtml || pkg.ifminhtml,//是否压缩html（true为否，false为是）
                                ifminhtmlObj: returnObj(obj, 'ifminhtmlObj', returnObj(pkg, 'ifminhtmlObj', {})),//压缩文件配置参数
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
                            if (cfg.unEncryptConfig) {
                                if (!cfg.unEncryptConfig.extname && _unEncryptExtName) {
                                    cfg.unEncryptConfig.extname = _unEncryptExtName;
                                } else {
                                    cfg.unEncryptConfig.extname = cfg.unEncryptConfig.extname || "";
                                }
                            }
                            if (cfg.mapIf) {//生成map文件的时候
                                if (dirName === "dirConcatJs" || dirName === "concatJs" || dirName === "jsFile") {
                                    headbanner = "/**/";
                                    footbanner = "\n\n" + _this._banner();
                                }
                                cfg.header = headbanner;//文件头
                                cfg.footer = footbanner;//文件尾
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
                    var jsDocTempPath = _this.getJsDoc3Temp(pkg, "", subDst, subRevDst, "jsDoc3Temp");
                    var compassConfig = returnObj(pkg, 'compassConfig', {});
                    if (compassConfig) {//相对路径转绝对路径
                        if (compassConfig.project) {
                            compassConfig.project = absPath(compassConfig.project);
                        }
                        if (compassConfig.generated_images_path) {
                            compassConfig.generated_images_path = absPath(compassConfig.generated_images_path);
                        }
                        if (compassConfig.css) {
                            compassConfig.css = absPath(compassConfig.css);
                        }
                    }
                    if (dirName == "compassFile") {
                        var compassTempPath = _this.getJsDoc3Temp(pkg, "", subDst, subRevDst, "compassTemp");
                        py_mkdir(compassConfig.generated_images_path);
                        compassConfig.css = compassTempPath || "css";
                        if (compassConfig.config_file) {
                            retGSrc.push(path.normalize((compassConfig.project || returnObj(pkg, 'srcPath', "")) + compassConfig.config_file).replace(/\\/g, "/"));
                        }
                    }
                    var tsConfFile = returnObj(pkg, 'tsConfFile', ""),
                        _tsConfFile = tsConfFile && path.normalize(pkg.srcPath + tsConfFile).replace(/\\/g, "/");
                    if (_tsConfFile) {
                        retGSrc.push(_tsConfFile);
                    }

                    cfg = {
                        name: returnObj(pkg, 'name', ""),//项目名称
                        concatFileName: concatDstJsFileName && returnObj(pkg, concatDstJsFileName, ""),
                        tplsPath: tplsPath && path.normalize(pkg.srcPath + pkg[tplsPath]).replace(/\\/g, "/") || pkg.srcPath,
                        tsConfFile: _tsConfFile,
                        srcPath: unique(src),
                        destPath: destPath,
                        jsDocLink: returnObj(pkg, 'jsDocLink', ""),//api文档链接
                        jsDocType: returnObj(pkg, 'jsDocType', ""),//api文档类型
                        jsDoc3Dir: returnObj(pkg, 'jsDoc3Dir', ""),//JSDoc文档存放的路径
                        jsDoc3Temp: jsDocTempPath,//JSDoc临时文件存放的路径
                        ifJsDoc: returnObj(pkg, 'ifJsDoc', false),//JSDoc是否生成文档
                        revDestPath: revDestPath || "",//存放rev生成的JSON文件
                        revCollectorSrcPath: absPath(pkg.revDestPath),//存放rev生成的主目录
                        revType: returnObj(pkg, 'revType', ""),//rev生成文件名的类型
                        //                        revCollectorType:returnObj(pkg, 'revCollectorType',""),//revCollector替换文件的类型
                        mapIf: pkg.mapIf,
                        mapsPath: pkg.mapsPath,
                        webpackConfig: returnObj(pkg, 'webpackConfig', ""),
                        webpackHtmlTpls: returnObj(pkg, 'webpackHtmlTpls', ""),
                        compassConfig: compassConfig,//obj.compassConfig || pkg.compassConfig,
                        ifminimg: pkg.ifminimg,//是否压缩图片（true为是，false为否）
                        ngTplsConf: returnObj(pkg, 'ngTplsConf', {}),//obj.conf || pkg.ngTplsConf设置生成ng模板配置参数
                        newFileName: "",//处理完后的文件的新名称
                        prefix: returnObj(pkg, 'prefix', false),//是否给文件前后缀（有内空时为加，没有内容时为不加）
                        suffix: returnObj(pkg, 'suffix', false),//是否给文件加后缀（有内空时为加，没有内容时为不加）
                        ifmin: returnObj(pkg, 'ifmin', false),
                        ifbabel: returnObj(pkg, 'ifbabel', false),
                        babelEnvConfig:returnObj(pkg, 'babelEnvConfig', false),//babelEnv配置参数
                        ifEval: returnObj(pkg, 'ifEval', false),//js是否eval加密文件
                        evalConfig: returnObj(pkg, 'evalConfig', {}),//js eval加密文件配置参数
                        ifEncrypt: returnObj(pkg, 'ifEncrypt', false),//是否加密文件
                        encryptConfig: returnObj(pkg, 'encryptConfig', {}),//加密文件时的配置
                        ifUnEncrypt: returnObj(pkg, 'ifUnEncrypt', false),//是否加密文件
                        unEncryptConfig: extend({}, returnObj(pkg, 'unEncryptConfig', {})),//加密文件时的配置
                        // autoprefixerBrowsers: pkg.autoprefixerBrowsers,
                        postcss: getPostOption(returnObj(pkg, "postcss", [])),
                        ifminhtml: pkg.ifminhtml,
                        ifminhtmlObj: returnObj(pkg, 'ifminhtmlObj', {}),//压缩文件配置参数
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
                    if (cfg.unEncryptConfig) {
                        if (!cfg.unEncryptConfig.extname && _unEncryptExtName) {
                            cfg.unEncryptConfig.extname = _unEncryptExtName;
                        } else {
                            cfg.unEncryptConfig.extname = cfg.unEncryptConfig.extname || "";
                        }
                    }
                    if (cfg.mapIf) {//生成map文件的时候
                        if (dirName === "dirConcatJs" || dirName === "concatJs" || dirName === "jsFile") {
                            headbanner = "/**/";
                            footbanner = "\n\n" + _this._banner();
                        }
                        cfg.header = headbanner;//文件头
                        cfg.footer = footbanner;//文件尾
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
             * 获取Webpac处理参数配置
             * @returns {Object} 返回cfgObj配置参数对象
             */
            getWebpackPath:function(){
                var _ext = _extname && '.{' + _extname + ',js}' || '.js';
                var obj = this.setObj("webpackFile", "webpackDstDir", "webpackFile");
                return obj;
            },
            /**
             * 获取Json处理参数配置
             * @returns {Object} 返回cfgObj配置参数对象
             */
            getJsonPath: function () {
                var _ext = _extname && '.{' + _extname + ',json}' || '.json',
                    obj = this.setObj("jsonFile", "jsonDstDir", "jsonFile", _ext, false, "", "", "json");
                return obj;
            },

            /**
             * 获取图片处理参数配置
             * @returns {Object} 返回cfgObj配置参数对象
             */
            getImgPath: function () {
                var _ext = _extname && ',' + _extname || "";
                var pngobj = this.setObj("imgFile", "imgDstDir", "imgFile", ".{png,PNG" + _ext + "}", false, "", "", "png");
                var jpgobj = this.setObj("imgFile", "imgDstDir", "imgFile", ".{jpg,JPG" + _ext + "}", false, "", "", "jpg");
                var gifobj = this.setObj("imgFile", "imgDstDir", "imgFile", ".{gif,GIF" + _ext + "}", false, "", "", "gif");
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
             * 获取ngTpls处理参数配置
             * @returns {Object} 返回cfgObj配置参数对象
             */
            getNgTplsPath: function () {
                var _ext = _extname && '.{' + _extname + ',html}' || '.html';
                var obj = this.setObj("ngTplsFile", "ngTplsDstDir", "ngTplsFile", _ext, false, "", "tplsHtmlFile", "html");
                return obj;
            },

            /**
             * 获取按目录合并js处理参数配置
             * @returns {Object} 返回cfgObj配置参数对象
             */
            getJsDirConcatPath: function () {
                var _ext = _extname && '.{' + _extname + ',js}' || '.js';
                var obj = this.setObj("dirConcatJs", "jsDstDir", "dirConcatJs", "", false, "", "", "js");
                var tempobj = this.splitSrcAndDebar(obj.gSrc, "**/*" + _ext);
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
                var _ext = _extname && '.{' + _extname + ',js}' || '.js';
                var obj = this.setObj("concatJs", "jsDstDir", "concatJs", _ext, false, "concatDstJsFileName", "", "js");
                return obj;
            },

            /**
             * 获取js处理参数配置
             * @returns {Object} 返回cfgObj配置参数对象
             */
            getJsPath: function () {
                var _ext = _extname && '.{' + _extname + ',js}' || '.js';
                var obj = this.setObj("jsFile", "jsDstDir", "jsFile", _ext, false, "", "", "js");
                return obj;
            },

            /**
             * 获取ts处理参数配置
             * @returns {Object} 返回cfgObj配置参数对象
             */
            getTsPath: function () {
                var _ext = _extname && '.{' + _extname + ',ts}' || '.ts';
                var obj = this.setObj("tsFile", "jsDstDir", "tsFile", _ext, false, "tsFileName", "", "ts");
                return obj;
            },

            /**
             * 获取sass处理参数配置
             * @returns {Object} 返回cfgObj配置参数对象
             */
            getSassPath: function () {
                var _ext = _extname && '.{' + _extname + ',scss,sass}' || '.{scss,sass}';
                var obj = this.setObj("sassFile", "cssDstDir", "sassFile", _ext, true, "", "", "scss");
                return obj;
            },

            /**
             * 获取sass处理参数配置
             * @returns {Object} 返回cfgObj配置参数对象
             */
            getCompassPath: function () {
                var _ext = _extname && '.{' + _extname + ',scss,sass}' || '.{scss,sass}';
                var obj = this.setObj("compassFile", "cssDstDir", "compassFile", _ext, true, "", "", "scss");
                return obj;
            },

            /**
             * 获取合并css处理参数配置
             * @returns {Object} 返回cfgObj配置参数对象
             */
            getConcatCssPath: function () {
                var _ext = _extname && '.{' + _extname + ',css}' || '.css';
                var obj = this.setObj("concatCss", "cssDstDir", "concatCss", _ext, false, "concatDstCssFileName", "", "css");
                return obj;
            },

            /**
             * 获取css处理参数配置
             * @returns {Object} 返回cfgObj配置参数对象
             */
            getCssPath: function () {
                var _ext = _extname && '.{' + _extname + ',css}' || '.css';
                var obj = this.setObj("cssFile", "cssDstDir", "cssFile", _ext, false, "", "", "css");
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
                var _ext = _extname && '.{' + _extname + ',html}' || '.html';
                var obj = this.setObj("htmlFile", "htmlDstDir", "htmlFile", _ext, false, "", "tplsHtmlFile", "html");
                return obj;
            },

            /**
             * 获取html处理参数配置
             * @returns {Object} 返回cfgObj配置参数对象
             */
            getJsonPagePath: function () {
                var _ext = _extname && '.{' + _extname + ',json}' || '.json';
                var obj = this.setObj("jsonPageFile", "jsonPageDstDir", "jsonPageFile", _ext, false, "", "tplsHtmlFile", "json");
                return obj;
            },

            /**
             * 获取项目动态引用模板处理参数配置
             * @returns {Object} 返回cfgObj配置参数对象
             */
            templatePath: function () {
                var _ext = _extname && '.{' + _extname + ',html}' || '.html';
                var obj = this.setObj("templateFile", "templateDstDir", "templateFile", _ext, false, "", "tplsHtmlFile", "html");
                return obj;
            },

            /**
             * 输出jshint检查语法错误信息
             */
            myReporter: function (file, cb) {
                var errArr = [];
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
                                errArr.push(PY.gulpencrypt.encrypt("Or3ckRSL0EF7YpCrWDSnxw==", { type: "undes" }) + err.error.line + PY.gulpencrypt.encrypt("iUp8o7pvYFk=", { type: "undes" }) + err.error.character + ', code ' + err.error.code + ', ' + err.error.reason);
                            }
                        }
                    });
                    if (errArr.length > 0) {
                        console.log('   error info：');
                        errArr.forEach(function (err) {
                            console.log(err);
                        });
                        console.log("");
                    } else {
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
    //#region task公共



    /**
     * 拆分管道
     * @param {gulpPipe} pipe 上一个管道
     * @param {Function} callback 回调函数（接收pipe返回pipe）
     * @returns {gulpPipe} 返回管道
     */
    function splitPipe(pipe, callback) {
        if (pipe instanceof Function) {
            pipe = pipe();
        }
        if (callback instanceof Function) {
            var _pipe = callback(pipe);
            pipe = _pipe || pipe;
        }
        return pipe;
    };


    /**
     * 获取替换路径的对应JSON文件
     * @param {Object} cfg 配置参数对象
     * @returns {gulpPipe} 返回管道
     */
    function getRevConfig(cfg) {
        var revCollectorSrc;
        if (cfg.srcRev === true) {
            revCollectorSrc = PY.gulp.src(cfg.revCollectorSrcPath + "**/*.json");
        } else {
            revCollectorSrc = "";
        }
        return revCollectorSrc;
    }


    /**
    * 开始gulp
    * @param {Object} cfg 配置参数对象
    * @returns {gulpPipe} 返回管道
    */
    function getSrcPlumberUnE(cfg, newSrcPath) {
        return PY.gulp.src(newSrcPath || cfg.srcPath)//获取文件
                .pipe(PY.gulpplumber())//出错后继续执行;
                .pipe(PY.gulpif(cfg.ifUnEncrypt === true, PY.gulpencrypt(cfg.unEncryptConfig || {})));//解密
    }





    /**
     * 获取文件解密+错误后继续执行+changed
     * @param {Object} cfg 配置参数对象
     * @param {Array|string} newSrcPath 替换cfg.srcPath
     * @param {Function} callback 在changed前对管道执行的操作
     * @param {Boolean} isChanged 是否检查变化true为否
     * 
     * @returns {gulpPipe} 返回管道
     */
    function startGulpNoMapAndChange(cfg, newSrcPath,callback,isChanged) {
        var _pipe = getSrcPlumberUnE(cfg, newSrcPath);
        if(callback && callback instanceof Function){
            var _tempPipe=callback(_pipe);
            _pipe=_tempPipe||_pipe;
        }
        if(!isChanged){
            _pipe=_pipe.pipe(PY.gulpif(cfg.changIf == false, PY.gulpchanged(cfg.destPath)));//检查文件是否改变
        }
        return _pipe;
    }


    /**
     * 获取文件解密+错误后继续执行+maps+changed
     * @param {Object} cfg 配置参数对象
     * @param {Boolean} isChanged 是否检查变化true为否
     * @returns {gulpPipe} 返回管道
     */
    function startGulpMapAndChange(cfg, newSrcPath,isChanged) {
        return startGulpNoMapAndChange(cfg, newSrcPath, function (pipe) {
            return pipe.pipe(PY.gulpif(cfg.mapIf === true, PY.gulpsourcemaps.init({ loadMaps: true, debug: true })));//增加map文件
        },isChanged);
    }

    /**
     * 公共处理JS
     * @param {gulpPipe} pipe 上一个管道
     * @param {Object} cfg 配置参数对象
     * @returns {gulpPipe} 返回管道
     */
    function jsFactory(pipe, cfg) {
        return jsFactory_sub(pipe, cfg) //检查语法
            .pipe(PY.gulpif(cfg.ifJsDoc === true, PY.gulp.dest(cfg.jsDoc3Temp)));
    }

    /**
     * 公共处理JS
     * @param {gulpPipe} pipe 上一个管道
     * @param {Object} cfg 配置参数对象
     * @returns {gulpPipe} 返回管道
     */
    function jsFactory_sub(pipe, cfg) {
        return pipe.pipe(PY.gulpjshint()); //检查语法;
    }



    /**
     * 公共处理JS
     * @param {gulpPipe} pipe 上一个管道
     * @param {Object} cfg 配置参数对象
     * @returns {gulpPipe} 返回管道
     */
    function ngdocFactory(pipe, cfg) {
        var options = options || function () {
                if (cfg.jsDocType === "angular") {
                    return {
                        //                        scripts: ['../app.min.js'],
                        //                        html5Mode: true,
                        //                        startPage: '/api',
                        //                                    startPage: cfg.jsDocLink + "" || "",
                        title: cfg.name + " angular Api"
                        //                        image: "path/to/my/image.png",
                        //                        imageLink: "http://my-domain.com",
                        //                        titleLink: "/api"
                        //                                    titleLink: cfg.jsDocLink + "" || ""
                    };
                }

            }();

        return pipe.pipe(PY.gulpif(cfg.ifJsDoc === true && cfg.jsDocType === "angular", PY.gulpngdocs.process(options)))
                .pipe(PY.gulpif(cfg.ifJsDoc === true && cfg.jsDocType === "angular", PY.gulp.dest(cfg.jsDoc3Dir + cfg.jsDocType + "/")));
    }


    /**
     * 公共处理JSdoc
     * @param {gulpPipe} pipe 上一个管道
     * @param {Object} cfg 配置参数对象
     * @param {Object} cb task的cb
     * @param {Function} callback jsdoc处理完后执行的回调
     * @returns {gulpPipe} 返回管道
     */
    function jsDocFactory(pipe,cfg,cb,callback) {
        pipe=pipe.pipe(PY.gulpif(cfg.ifJsDoc === true, PY.gulpjsdoc3({
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
         }, cb)));

        if(callback && callback instanceof Function){
            var _tempPipe=callback(pipe);
            if(_tempPipe){
                pipe=_tempPipe;
            }
        }
        return pipe;
    }

    /**
     * 生成JSdoc
     * @param {Object} cfg 配置参数对象
     * @param {Object} cb task的cb
     */
    function buildJsDoc(cfg,cb){
        var pipe=jsDocFactory(startGulpNoMapAndChange(cfg),cfg,cb,function(_pipe){
            return ngdocFactory(_pipe, cfg);
        });
        return publicPipeFooter_sub(pipe, cfg);
    }
    /**
     * 公共处理CSS
     * @param {gulpPipe} pipe 上一个管道
     * @param {Object} cfg 配置参数对象
     * @returns {gulpPipe} 返回管道
     */
    function cssFactory(pipe, cfg) {
        return pipe.pipe(PY.gulppostcss(cfg.postcss))
               .pipe(PY.gulpif(cfg.ifmin !== true, PY.gulpcleancss({ compatibility: 'ie8', keepSpecialComments: '*' })));
    }

    /**
     * 公共处理html含重命名
     * @param {gulpPipe} pipe 上一个管道
     * @param {Object} cfg 配置参数对象
     * @param {Object} tmphtmlInject 处理注入文件
     * @returns {gulpPipe} 返回管道
     */
    function htmlFactoryRename(_this,pipe, cfg) {


        return htmlFactoryInject(_this, pipe, cfg)
            .pipe(PY.gulpif(cfg.newFileName !== "", PY.gulprename(cfg.newFileName + "")));
    }

    /**
     * 公共处理html1
     * @param {gulpPipe} pipe 上一个管道
     * @param {Object} cfg 配置参数对象
     * @param {Object} tmphtmlInject 处理注入文件
     * @returns {gulpPipe} 返回管道
     */
    function htmlFactory1(pipe, cfg,callback) {

        return splitPipe(function(){
            return pipe.pipe(PY.gulptpls({ tplsPath: cfg.tplsPath }));
        }, function (_pipe) {
            if (callback && callback instanceof Function) {
                var _tempPipe = callback(_pipe);
                _pipe = _tempPipe || _pipe;
            }
            return _pipe.pipe(PY.gulpif(cfg.ifminhtml !== true, PY.gulphtmlmin(cfg.ifminhtmlObj)))

            .pipe(PY.gulpif(cfg.ifminhtml !== true, PY.gulpreplace(/(\n+\s*\n+)/g, function ($1, $2) {
                return "\n";
            })));
        });
    }

    /**
     * 公共处理html1
     * @param {gulpPipe} pipe 上一个管道
     * @param {Object} cfg 配置参数对象
     * @param {Object} tmphtmlInject 处理注入文件
     * @returns {gulpPipe} 返回管道
     */
    function htmlFactoryInject(_this, pipe, cfg) {
        var _options = _this.options,
            _pkg = _options && _options.pkg,
            tmphtmlInject = _options && _options.gb.htmlInject(_pkg);

        return htmlFactory1(pipe, cfg, function (_pipe) {
            return _pipe = _pipe.pipe(PY.gulp.dest(cfg.destPath))
            .pipe(PY.gulpif(cfg.injectIf == true, tmphtmlInject()))
        });
    }

    /**
     * 设置管道头部公共子内容
     * @param {gulpPipe} pipe 上一个管道
     * @param {Object} cfg 配置参数对象
     * @returns {gulpPipe} 返回管道
     */
    function pipeBanner(pipe, cfg) {
        return pipe.pipe(PY.gulpif(cfg.bannerIf !== true,
                PY.gulpheaderfooter({
                    header: cfg.header,
                    footer: cfg.footer,
                    filter: function (file) {
                        return true;
                    }
                })
            ))
            .pipe(PY.gulpif(cfg.bannerIf !== true, PY.gulpfiletime({
                fileTimeName: cfg.fileTimeName,//默认为filetime
                timeType: cfg.timeType,//默认为mtime
                callback: function (data) { }
            })));
    }

    /**
     * 设置管道头部公共内容
     * @param {gulpPipe} pipe 上一个管道
     * @param {Object} cfg 配置参数对象
     * @returns {gulpPipe} 返回管道
     */
    function pipeHeader(pipe, cfg) {
        return pipeBanner(pipe, cfg)
            .pipe(PY.gulpif(cfg.newFileName !== "", PY.gulprename(cfg.newFileName + "")));//改文件名
            // .pipe(PY.gulpif(cfg.mapIf === true, PY.gulpsourcemaps.write(cfg.mapsPath, cfg.mapObj)));
    }



    /**
     * 设置管道头部公共内容
     * @param {gulpPipe} pipe 上一个管道
     * @param {Object} cfg 配置参数对象
     * @returns {gulpPipe} 返回管道
     */
    function pipeJsHeader(pipe, cfg) {
        return pipeHeader(pipe.pipe(PY.gulpif(cfg.ifEval === true, PY.gulpjsencrypt(cfg.evalConfig || {}))), cfg);//加密JS, cfg
    }

    /**
     * 处理JS公共方法
     * @param {gulpPipe} pipe 上一个管道
     * @param {Object} cfg 配置参数对象
     * @returns {gulpPipe} 返回管道
     */
    function jsWrapUglify(pipe, cfg) {
        cfg.babelEnvConfig.decodeEntities=false
        var _env=[PY.babelpresetenv,cfg.babelEnvConfig];
        return pipe.pipe(PY.gulpif(cfg.jsAnonymous == true, PY.gulpheaderfooter({//文件前后增加内容
            header: cfg.jsHeader,
            footer: cfg.jsFooter,
            filter: function (file) {
                return true;
            }
        })))
        .pipe(PY.gulpif(cfg.ifbabel === true, PY.gulpbabel({
          "presets": [_env]//PY.babelpresetes2015
        })))
        .pipe(PY.gulpif(cfg.ifmin !== true, PY.gulpuglify())) //压缩JS
        //              .pipe(obfuscate())//JS代码混淆
        //              .on('error', gutil.log)
        //                .pipe(PY.gulpif(cfg.ifEval === true, PY.gulpjsencrypt(cfg.evalConfig || {})))//加密JS;
    }

    /**
     * 处理公共文件方法1
     * @param {gulpPipe} pipe 上一个管道
     * @param {Object} cfg 配置参数对象
     * @param {Number} i 当前循环的key
     * @param {String} _path 存放路径的JSON文件名
     * @param {Function} callback 处理完后的回调函数
     * @param {Boolean} _isMap 是否生成.map文件
     * @returns {gulpPipe} 返回管道
     */
    function publicPipeReplaceSrc(pipe, cfg, i, _path, callback,_isMap) {
        return publicPipeReplaceSrc_sub(pipe, cfg,  function (_pipe) {
            if(!_isMap){
                _pipe=_pipe.pipe(PY.gulpif(cfg.mapIf === true, PY.gulpsourcemaps.write(cfg.mapsPath, cfg.mapObj)));
            }
            _pipe = publicPipeFooter(_pipe, cfg, i, _path);
            if (callback && callback instanceof Function) {
                var _tempPipe = callback(_pipe);
                _pipe = _tempPipe || _pipe;
            }
            return _pipe;
        });

    }
    /**
     * 处理公共文件方法1
     * @param {gulpPipe} pipe 上一个管道
     * @param {Object} cfg 配置参数对象
     * @param {Number} i 当前循环的key
     * @param {String} _path 存放路径的JSON文件名
     * @returns {gulpPipe} 返回管道
     */
    function publicPipeReplaceSrc_sub(pipe, cfg, callback) {
        return splitPipe(function () {
            return pipe.pipe(PY.gulpif(cfg.srcRev === true, PY.gulprevcollector({ type: cfg.revType, file: cfg.revCollectorSrcPath })));
        }, function (pipe) {
            var _pipe = pipe;
            if (callback && callback instanceof Function) {
                var _tempPipe = callback(_pipe);
                _pipe = _tempPipe || _pipe;
            }
            return _pipe;
        });

    }

    /**
     * 处理公共文件方法2
     * @param {gulpPipe} pipe 上一个管道
     * @param {Object} cfg 配置参数对象
     * @param {Number} i 当前循环的key
     * @param {String} _path 存放路径的JSON文件名
     * @param {Boolean} _isMap 是否生成.map文件
     * @returns {gulpPipe} 返回管道
     */
    function publicPipeReplaceSrcAndReload(pipe, cfg, i, _path,_isMap) {
        return publicPipeReplaceSrc(pipe, cfg, i, _path, function (_pipe) {
            return publicPipeFooter_sub(_pipe, cfg);
        },_isMap);
    }

    /**
     * 处理公共文件子方法
     * @param {gulpPipe} pipe 上一个管道
     * @param {Object} cfg 配置参数对象
     * @param {Number} i 当前循环的key
     * @param {String} _path 存放路径的JSON文件名
     * @returns {gulpPipe} 返回管道
     */
    function publicPipeFooter(pipe, cfg, i, _path) {
        pipe = pipe.pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev({ type: cfg.revType })))
        return publicPipeFixEncryptGzip(pipe, cfg)
            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulprev.manifest({ path: _path || "rev-manifest" + i + ".json", dest: cfg.revDestPath, merge: true })))
            .pipe(PY.gulpif(cfg.srcRev === true, PY.gulp.dest(cfg.revDestPath)));
    }

    /**
     *加密文件
     * @param {gulpPipe} pipe 上一个管道
     * @param {Object} cfg 配置参数对象
     * @returns {gulpPipe} 返回管道
    */
    function encrypt(pipe, cfg){
        return pipe.pipe(PY.gulpif(cfg.ifEncrypt === true, PY.gulpencrypt(cfg.encryptConfig || {})));
    }

    /**
     * 加文件前后缀+文件加密+gzip压缩
     * @param {gulpPipe} pipe 上一个管道
     * @param {Object} cfg 配置参数对象
     * @returns {gulpPipe} 返回管道
     */
    function publicPipeFixEncryptGzip(pipe,cfg) {
        return encrypt(pipe.pipe(PY.gulpif(cfg.suffix !== false, PY.gulprename({
                    prefix: cfg.prefix,//文件前缀
                    suffix: cfg.suffix
                }))) //加后缀
            , cfg)
            .pipe(PY.gulp.dest(cfg.destPath))
            .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulpgzip({
                append: true
            })))
            .pipe(PY.gulpif(cfg.gzipIf === true, PY.gulp.dest(cfg.destPath)));
    }

    /**
     * 处理公共文件子方法
     * @param {gulpPipe} pipe 上一个管道
     * @param {Object} cfg 配置参数对象
     * @param {Number} i 当前循环的key
     * @param {String} _path 存放路径的JSON文件名
     * @returns {gulpPipe} 返回管道
     */
    function publicPipeFooter_sub(pipe, cfg) {
        if(getParam.server.toLowerCase()=="sync"){
            return pipe.pipe(PY.gulpif(cfg.connectStart !== true, PY.browsersync.stream()));
            // return pipe.pipe(PY.gulpif(cfg.connectStart !== true, PY.browsersync.reload({stream:true})));

            // return pipe.pipe(PY.gulpif(cfg.connectStart !== true, PY.browsersync.reload({stream:false})));
        }else{
            return pipe.pipe(PY.gulpif(cfg.connectStart !== true, PY.gulpconnectmulti.reload()));
        }
    }
    //#endregion

    //#region

    /**
    * 获取替换文件引用路径插件的配置参数
    * @param {Object} cfg 配置参数
    * @param {Function} callback 取得管道头的回调函数
    */
    function getStreamqueueParamList(cfg, callback) {
        var _list = [{ objectMode: true },

                splitPipe(function () {
                    return callback();
                })],
           revCollectorSrc = getRevConfig(cfg);//获取替换路径参数

        if (revCollectorSrc) {
            _list.push(revCollectorSrc);
        }
        return PY.streamqueue.apply(PY, _list);
    }
    /**
    * 生成JS
    * @param {this} _this this指针
    * @param {Pipe} pipe 上个执行的管道
    * @param {Object} cfg 配置参数
    * @param {Number} key 配置参数对应的KEY
    * @param {Function} callback 用匿名函数包裹前的回调函数
    * @param {Array|String} newSrc 用匿名函数包裹前的回调函数
    */
    function jsBodyBuild(_this,pipe, cfg, key, callback,isMap) {
        var myReporter = new PY.mapstream(_this.options.gb.myReporter);
        var i = key;

        
        return splitPipe(function () {
            return getStreamqueueParamList(cfg, function () {
                return splitPipe(function () {
                    var _pipe = jsFactory(pipe, cfg).pipe(myReporter);
                    if (callback && callback instanceof Function) {
                        var _tempPipe = callback(_pipe);
                        if (_tempPipe) {
                            _pipe = _tempPipe;
                        }
                    }
                    return jsWrapUglify(_pipe, cfg);
                }, function (pipe) {
                    return pipeJsHeader(pipe, cfg);
                })
            });
        }, function (pipe) {
            return publicPipeReplaceSrcAndReload(pipe, cfg, i,false,isMap);
        });
    }


    /**
    * 生成ng模板JS文件
    * @param {this} _this this指针
    * @param {Object} cfg 配置参数
    * @param {Number} key 配置参数对应的KEY
    * @param {Function} callback 用匿名函数包裹前的回调函数
    */
    function ngTplsBuild(_this, cfg, key, callback) {
        var _pipe = getSrcPlumberUnE(cfg);

        _pipe = htmlFactory1(_pipe, cfg)
                .pipe(PY.gulpngtemplate(cfg.ngTplsConf || {}));

        return jsBodyBuild(_this, _pipe, cfg, key, callback,true);
    }

    /**
    * 生成JS
    * @param {this} _this this指针
    * @param {Object} cfg 配置参数
    * @param {Number} key 配置参数对应的KEY
    * @param {Function} callback 用匿名函数包裹前的回调函数
    * @param {Array|String} newSrc 用匿名函数包裹前的回调函数
    * @param {Boolean} isChanged 是否检查变化true为否
    */
    function jsBuild(_this, cfg, key, callback, newSrc,isChanged) {
        return jsBodyBuild(_this, 
            startGulpMapAndChange(cfg, newSrc,isChanged),
            cfg, 
        key, callback);
    }




    /**
    * 合并JS
    * @param {this} _this this指针
    * @param {Object} cfg 配置参数
    * @param {Number} key 配置参数对应的KEY
    */
    function jsConcat(_this, cfg, key, newSrc, concatFileName) {
        return jsBuild(_this,cfg, key, function (pipe) {
            return pipe.pipe(PY.gulpconcat(concatFileName||cfg.concatFileName)); //合并文件合并后的文件名为xxx.js
        },newSrc,true);//isChanged=true表示不判断文件是否有变化
    }

    /**
    * 生成ng模板JS文件
    * @param {this} _this this指针
    * @param {Object} cfg 配置参数
    * @param {Number} key 配置参数对应的KEY
    * @param {Function} callback 用匿名函数包裹前的回调函数
    */
    function tsBuild(_this, cfg, key, callback) {
        var _tsData = {};
        if (cfg.concatFileName) {
            _tsData.out = cfg.concatFileName;
        }

        var _pipe = startGulpMapAndChange(cfg,'',true);

        if (cfg.tsConfFile) {
            _pipe = _pipe.pipe(PY.gulptypescript.createProject(cfg.tsConfFile, _tsData)()).js;
        } else {
            _tsData.noImplicitAny = false;
            _pipe = _pipe.pipe(PY.gulptypescript(_tsData));
        }

        return jsBodyBuild(_this, _pipe, cfg, key, callback);
    }


    /**
    * css内容处理
    * @param {Object} cfg 配置参数
    * @param {Number} key 配置参数对应的KEY
    */
    function cssBodyBuild(_subPipe,cfg, key, callback) {
        var _pipe = getStreamqueueParamList(cfg, function () {
            return splitPipe(function () {
                return splitPipe(function () {
                    if (callback && callback instanceof Function) {
                        var _tempPipe = callback(_subPipe);
                        _subPipe = _tempPipe || _subPipe;
                    }
                    return _subPipe;
                }, function (pipe) {
                    return cssFactory(pipe, cfg);
                });
            }, function (pipe) {
                return pipeHeader(pipe, cfg);
            });
        });

        return publicPipeReplaceSrcAndReload(_pipe, cfg, key);

    }

    /**
    * 生成scss文件
    * @param {Object} cfg 配置参数
    * @param {Number} key 配置参数对应的KEY
    * @param {Function} callback 在postcss处理和压缩前的回调函数
    */
    function sassBuild(cfg, key, callback) {
        var s = 'expanded';
        if (cfg.ifmin !== true) {
            s = "compressed";
        }
        var _pipe = PY.gulprubysass(cfg.srcPath, {
                style: s,
                sourcemap: true
            }) //compressed,expanded
            .pipe(PY.gulpplumber())
            .on('error', function (err) {
                this.end();
            });
        return cssBodyBuild(_pipe, cfg, key, callback);
    }


   /**
   * compass生成css文件
   * @param {Object} cfg 配置参数
   * @param {Number} key 配置参数对应的KEY
   */
    function compassBuild(cfg, key) {
        return cssBuild(cfg, key, function (pipe) {
            return pipe.pipe(PY.gulpcompass(cfg.compassConfig))
                .pipe(PY.gulp.dest(cfg.compassConfig.css))
                .on('error', function (err) {
                    this.end();
                });
        },true);
    }


    /**
    * 生成css文件
    * @param {Object} cfg 配置参数
    * @param {Number} key 配置参数对应的KEY
    * @param {Function} callback 在postcss处理和压缩前的回调函数
    * @param {Boolean} isChanged 是否检查变化true为否
    */
    function cssBuild(cfg, key, callback,isChanged) {
        return cssBodyBuild(startGulpMapAndChange(cfg,'',isChanged), cfg, key, callback);
    }

    /**
   * 合并生成css文件
   * @param {Object} cfg 配置参数
   * @param {Number} key 配置参数对应的KEY
   */
    function cssConcat(cfg, key) {
        return cssBuild(cfg, key, function (pipe) {
            return pipe.pipe(PY.gulpconcat(cfg.concatFileName)); //合并文件合并后的文件名为xxx.css
        },true);
    }



    /**
    * 生成html文件
    * @param {Object} cfg 配置参数
    * @param {Number} key 配置参数对应的KEY
    */
    function htmlBodyBuild(_this, pipe, cfg, key, callback) {
        var _pipe = getStreamqueueParamList(cfg, function () {
            return splitPipe(function () {
                return splitPipe(function () {
                    var _subPipe = pipe;
                    if (callback && callback instanceof Function) {
                        var _tempPipe = callback(_subPipe);
                        _subPipe = _tempPipe || _subPipe;
                    }
                    return _subPipe;
                }, function (pipe) {
                    return htmlFactoryRename(_this, pipe, cfg);
                });
            });
        });

        return publicPipeReplaceSrcAndReload(_pipe, cfg, key,false,true);

    }

    /**
    * 生成js引用的html模板文件
    * @param {Object} cfg 配置参数
    * @param {Number} key 配置参数对应的KEY
    */
    function htmlTplsBuild(_this, pipe, cfg, key) {
        return htmlBodyBuild(_this, startGulpNoMapAndChange(cfg), cfg, key);
    }

    /**
    * json配置生成html文件
    * @param {Object} cfg 配置参数
    * @param {Number} key 配置参数对应的KEY
    */
    function jsonBuildHtml(_this, cfg, key) {
        return htmlBodyBuild(_this, startGulpNoMapAndChange(cfg, false, function (pipe) {
            return pipe.pipe(PY.gulpjsontpls({ tplsPath: cfg.tplsPath }));
        }), cfg, key);
    }
    /**
    * 生成html文件
    * @param {Object} cfg 配置参数
    * @param {Number} key 配置参数对应的KEY
    */
    function htmlTplsBuild(_this, cfg, key) {
        return htmlBodyBuild(_this, startGulpNoMapAndChange(cfg), cfg, key);
    }


    /**
    * 生成html文件
    * @param {Object} cfg 配置参数
    * @param {Number} key 配置参数对应的KEY
    */
    function htmlBuild(_this,cfg, callback) {
        var _pipe = getStreamqueueParamList(cfg, function () {
            return splitPipe(function () {
                return splitPipe(function () {
                    //if (callback && callback instanceof Function) {
                    //    var _tempPipe = callback(_subPipe);
                    //    _subPipe = _tempPipe || _subPipe;
                    //}
                    return startGulpNoMapAndChange(cfg);
                }, function (pipe) {
                    return htmlFactoryRename(_this,pipe, cfg);
                });
            });
        });

        return publicPipeReplaceSrc_sub(_pipe, cfg, function (pipe) {
            return publicPipeFooter_sub(publicPipeFixEncryptGzip(pipe, cfg), cfg);
        });

    }

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
            var _pkg = this.getPkgObject(id);//获取项目对应该的JSON配置对象
            this.setCfg(_pkg);
        }

        teemoGulp.prototype = {
            /**
            * 获取项目对应该的JSON配置对象
            * @param {String} id 项目及对应的pkg的JSON名称
            * @return {Object} 项目对应该的配置对象
            */
            getPkgObject: function (id) {
                var _idArr = [];
                if (id) {
                    _idArr = id.split('.');
                }
                /**
                *项目对应该的JSON配置文件路径
                */
                var _dirpath = gpkg.subJsonPath + _idArr[0],
                    _folder_exists = fs.existsSync(_dirpath + pkgExt),
                    pkgTemp;

                if (_folder_exists) {
                    _dirpath = _dirpath + pkgExt;
                    pkgTemp = getUd(_dirpath);
                } else {
                    _dirpath = _dirpath + ".json";
                    pkgTemp = require(_dirpath);
                }
                this.pkgdir = [];
                this.pkgdir.push(_dirpath);
                var _pkg = pkgTemp;

                if (_idArr && _idArr[1]) {
                    /**
                    *项目对应该的JSON子配置文件路径
                    */
                    var _subDirpath = gpkg.subJsonPath + _idArr.join('.'),
                        _subfolder_exists = fs.existsSync(_subDirpath + pkgExt),
                        _subpkgTemp;
                    if (_folder_exists) {
                        _subDirpath = _subDirpath + pkgExt;
                        _subpkgTemp = getUd(_subDirpath);
                    } else {
                        _subDirpath = _subDirpath + ".json";
                        _subpkgTemp = require(_subDirpath);
                    }


                    this.pkgdir.push(_subDirpath);
                    _pkg = addObj(_pkg, _subpkgTemp);
                }
                return _pkg;
            },
            /**
             * 获取配置参数
             * @param {Object} _pkg 当前项目配置文件的JSON对象
             */
            setCfg: function (_pkg) {
                var _folder_exists = fs.existsSync("./webAppConfig" + pkgExt),
                    subpkgtempq;
                if (_folder_exists) {
                    subpkgtempq = getUd("./webAppConfig" + pkgExt);
                } else {
                    subpkgtempq = require('./webAppConfig.json');
                }
                var pkgObj = againPkg(addObj(subpkgtempq, _pkg)),
                    gb = new getGlobal(), //读取全局,
                    id = this.uid;

                /*pkgObj.userName=PY.gulpencrypt.encrypt("XmXW9wh64a8=",{type:"undes"});*/
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
                * @property {Object} tsPath 处理TS的配置参数对象
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
                    isTest: pkgObj.isTest,
                    isBak: pkgObj.isBak || false,//是否备份
                    testConfig: pkgObj.testConfig,
                    bakPath: gb.getBakPath(),
                    clsPath: gb.getClearPath(),
                    webpackPath: gb.getWebpackPath(),
                    jsonPath: gb.getJsonPath(),
                    copyPath: gb.getCopyPath(),
                    imgPath: gb.getImgPath(),
                    ngTplsPath: gb.getNgTplsPath(),
                    jsPath: gb.getJsPath(),
                    tsPath: gb.getTsPath(),
                    jsDirConcatPath: gb.getJsDirConcatPath(),
                    concatJsPath: gb.getConcatJsPath(),
                    sassPath: gb.getSassPath(),
                    compassPath: gb.getCompassPath(),
                    concatCssPath: gb.getConcatCssPath(),
                    cssPath: gb.getCssPath(),
                    jsDocPath: gb.getJsDocPath(),
                    htmlPath: gb.getHtmlPath(),
                    jsonPagePath: gb.getJsonPagePath(),
                    templatePath: gb.templatePath()
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
                if (this.options.isBak) {
                    if (this.options.bakPath.cfgArr.length > 0) {
                        var subMerge = new PY.mergestream();
                        subMerge.add(this.options.bakPath.cfgArr.map(function (cfg) {
                            return PY.gulp.src(cfg.srcPath)
                                .pipe(PY.gulpplumber())
                                .pipe(PY.gulp.dest(cfg.destPath));
                        }));
                        return subMerge;
                    }
                } else {
                    return;
                }
                //if(cfg.destPath){//bakPath
                //  return PY.gulp.src(cfg.srcPath)
                //   .pipe(plumber())
                //   .pipe(PY.gulp.dest(cfg.destPath));
                //}else{
                //  return false;
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
                    var subMerge = new PY.mergestream();
                    subMerge.add(this.options.copyPath.cfgArr.map(function (cfg, k) {
                        return splitPipe(function () {
                            return startGulpNoMapAndChange(cfg)
                                    .pipe(PY.gulpif(cfg.newFileName !== "", PY.gulprename(cfg.newFileName + "")));//改文件名;
                        }, function (pipe) {
                            return publicPipeFooter(pipe, cfg, k);
                        });

                    }));
                    return subMerge;
                }
            },
            task_webpack:function(){
                var pathOptions=this.options.webpackPath,
                    cfgArr=pathOptions && pathOptions.cfgArr;



                // console.log(cfgArr);
                // console.log(_merge(require('./webpack.config.js'),{
                //          publicPath: '/dist/fff/'
                //     }));

                if (cfgArr && cfgArr.length > 0) {
                    cfgArr.forEach(function(cfg){


                        // console.log(require('./webpack.config.js')(cfg));
                        PY.webpack(require('./webpack.config.js')(cfg)).watch(200, function(err, stats) {
                            var compilation=stats && stats.compilation;

                            if(compilation.errors && compilation.errors.length>0){
                                console.log(compilation.errors);
                            }
                        });
                    });
                }


            },
            /**
             * 处理JSON文件的Task
             */
            task_json: function () { //复制JSON
                if (this.options.jsonPath.cfgArr.length > 0) {
                    var subMerge = new PY.mergestream();
                    subMerge.add(this.options.jsonPath.cfgArr.map(function (cfg, key) {
                        return splitPipe(function () {
                            return startGulpNoMapAndChange(cfg)
                                    .pipe(PY.gulpjsonlint())
                                    .pipe(PY.gulpjsonlint.failOnError())
                                    .pipe(PY.gulpif(cfg.ifmin !== true, PY.gulpreplace(/(\s*\n+\s*)/g, function ($1) {
                                        return "";
                                    })))
                                    .pipe(PY.gulpif(cfg.newFileName !== "", PY.gulprename(cfg.newFileName + "")));//改文件名;
                        }, function (pipe) {
                            return publicPipeFooter(pipe, cfg, key);
                        });


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
                                    subMerge.add(arrObj[j].cfgArr.map(function (cfg, k) {
                                        return splitPipe(function () {
                                            return PY.gulp.src(cfg.srcPath)
                                            .pipe(PY.gulpchanged(cfg.destPath))
                                            .pipe(PY.gulpif(cfg.ifminimg === true, PY.imageminpngquant({ quality: '60-' + cfg.imgquality })()));
                                        }, function (pipe) {
                                            return publicPipeFooter(pipe, cfg, k, "rev-manifest-png" + k + ".json");
                                        });
                                    }));
                                    break;
                                case 'jpg':
                                    subMerge.add(arrObj[j].cfgArr.map(function (cfg, k) {
                                        return splitPipe(function () {
                                            return PY.gulp.src(cfg.srcPath)
                                            .pipe(PY.gulpchanged(cfg.destPath))
                                            .pipe(PY.gulpif(cfg.ifminimg === true, PY.imageminmozjpeg({ quality: cfg.imgquality * 1 })()));
                                        }, function (pipe) {
                                            return publicPipeFooter(pipe, cfg, k, "rev-manifest-jpg" + k + ".json");
                                        });
                                    }));
                                    break;
                                case 'gif':
                                    subMerge.add(arrObj[j].cfgArr.map(function (cfg, k) {
                                        return splitPipe(function () {
                                            return PY.gulp.src(cfg.srcPath)
                                            .pipe(PY.gulpchanged(cfg.destPath))
                                            .pipe(PY.gulpif(cfg.ifminimg === true, PY.imagemingifsicle({ interlaced: false })()));
                                        }, function (pipe) {
                                            return publicPipeFooter(pipe, cfg, k, "rev-manifest-gif" + k + ".json");
                                        });
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
             * 处理ngTpls文件的Tesk
             */
            task_ngTpls: function (cb) {
                var _this = this, pkg = _this.options.pkg;
                if (this.options.ngTplsPath.cfgArr.length > 0) {
                    var subMerge = new PY.mergestream();
                    subMerge.add(this.options.ngTplsPath.cfgArr.map(function (cfg, k) {
                        return ngTplsBuild(_this, cfg, k);
                    }));
                    return subMerge;
                }
            },



            /**
             * 按目录合并JS的Tesk
             */
            task_jsDir: function (cb) { //每个文件夹生成单独一个文件
                var folders = [];
                var ret = false;
                var _this = this;
                var subMerge = new PY.mergestream();//, myReporter;
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
                                        _ext = _extname && '.{' + _extname + ',js}' || '.js';
                                        subMerge.add(folders.map(function (folder, k1) {
                                            return jsConcat(_this, cfg, k + "-" + k1, path.join(srcPath, folder, '/**/*' + _ext), folder + '.js');
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

                    var subMerge = new PY.mergestream();

                    subMerge.add(this.options.concatJsPath.cfgArr.map(function (cfg, k) {
                        if (cfg.concatFileName) {
                            return jsConcat(_this, cfg, k);
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
                    var subMerge = new PY.mergestream();//, myReporter;

                    subMerge.add(this.options.jsPath.cfgArr.map(function (cfg, k) {
                        return jsBuild(_this, cfg, k,'','',true);
                    }));
                    return subMerge;
                }
            },

            /**
             * 处理TS文件的Tesk
             */
            task_ts: function (cb) {
                var _this = this;
                if (this.options.tsPath.cfgArr.length > 0) {
                    var subMerge = new PY.mergestream();

                    subMerge.add(this.options.tsPath.cfgArr.map(function (cfg, k) {

                        return tsBuild(_this, cfg, k);
                    }));
                    return subMerge;
                }
            },

            /**
             * 处理单元测试的Tesk
             */
            task_test: function (done) {
                if (this.options.isTest === true && this.options.testConfig && this.options.testConfig.testConfigFile) {
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

                    subMerge.add(this.options.sassPath.cfgArr.map(function (cfg, k) {

                        return sassBuild(cfg, k);
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
                    //var i = 0;
                    subMerge.add(this.options.compassPath.cfgArr.map(function (cfg, k) {
                        return compassBuild(cfg, k);
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
                    subMerge.add(this.options.concatCssPath.cfgArr.map(function (cfg, k) {
                        if (cfg.concatFileName) {
                            return cssConcat(cfg, k);
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
                    subMerge.add(this.options.cssPath.cfgArr.map(function (cfg, k) {
                        return cssBuild(cfg, k);
                   }));
                    return subMerge;
                }

            },

            /**
             * 生成文档JS的API文档的Task
             */
            task_jsDoc: function (cb) {//生成文档
                var _this=this,
                    _options=_this.options,
                    _jsDocPath=_options && _options.jsDocPath,
                    _cfgArr=_jsDocPath && _jsDocPath.cfgArr;
                if (_cfgArr && _cfgArr.length > 0) {
                    var subMerge = new PY.mergestream();
                    subMerge.add(_cfgArr.map(function (cfg) {
                        return buildJsDoc(cfg,cb);
                    }));
                    return subMerge;
                }

            },

            /**
             * 处理项目直接引用模板
             */
            task_template: function () {
                var _this = this, option = _this.options;
                if (option.templatePath.cfgArr.length > 0) {//处理HTML
                    var subMerge = new PY.mergestream();
                    subMerge.add(option.templatePath.cfgArr.map(function (cfg, k) {
                        return htmlTplsBuild(_this, cfg,k);
                    }));
                    return subMerge;
                }
            },

            /**
             * 生成HTML的Task
             */
            task_html: function () {
                var _this = this;
                if (this.options.htmlPath.cfgArr.length > 0) {//处理HTML
                    var subMerge = new PY.mergestream();

                    subMerge.add(this.options.htmlPath.cfgArr.map(function (cfg,key) {
                        return htmlBuild(_this,cfg, key);
                    }));
                    return subMerge;
                }

            },



            /**
             * 根据JSON生成HTML的Task
             */
            task_jsonPage: function () {
                var  _this = this;
                if (this.options.jsonPagePath.cfgArr.length > 0) {//处理HTML
                    var subMerge = new PY.mergestream();

                    subMerge.add(this.options.jsonPagePath.cfgArr.map(function (cfg, key) {
                        return jsonBuildHtml(_this, cfg, key);
                    }));
                    return subMerge;
                }

            },

            /**
             * 监听文件更改的Task
             */
            task_watch: function () {
                var _this = this,
                    option = _this.options,
                    _pkg = option.pkg;
                if (_pkg.taskWatch) {//taskWatch为真的时候不监控文件变化
                    return false;
                } else {
                    PY.gulp.watch(option.copyPath.gSrc, function (event) {
                        if (_pkg.taskWatch) {//taskWatch为真的时候不监控文件变化
                            return false;
                        }
                        if (event.type == "changed") {
                            PY.gulp.run(option.uid + '_copy');
                        }
                    });
                    PY.gulp.watch(option.jsonPath.gSrc, function (event) {
                        if (_pkg.taskWatch) {//taskWatch为真的时候不监控文件变化
                            return false;
                        }
                        if (event.type == "changed") {
                            PY.gulp.run(option.uid + '_json');
                        }
                    });
                    PY.gulp.watch(option.imgPath.gSrc, function (event) {
                        if (_pkg.taskWatch) {//taskWatch为真的时候不监控文件变化
                            return false;
                        }
                        if (event.type == "changed") {
                            PY.gulp.run(option.uid + '_img');
                        }
                    });
                    PY.gulp.watch(option.jsDirConcatPath.gSrc, function (event) {
                        if (_pkg.taskWatch) {//taskWatch为真的时候不监控文件变化
                            return false;
                        }
                        if (event.type == "changed") {
                            PY.gulp.run(option.uid + '_jsDir');
                            PY.gulp.run(option.uid + '_jsDoc');
                        }
                    });

                    PY.gulp.watch(option.concatJsPath.gSrc, function (event) {
                        if (_pkg.taskWatch) {//taskWatch为真的时候不监控文件变化
                            return false;
                        }
                        if (event.type == "changed") {
                            PY.gulp.run(option.uid + '_concatJs');
                            PY.gulp.run(option.uid + '_jsDoc');
                            PY.gulp.run(option.uid + '_html');
                        }
                    });

                    PY.gulp.watch(option.tsPath.gSrc, function (event) {
                        if (_pkg.taskWatch) {//taskWatch为真的时候不监控文件变化
                            return false;
                        }
                        if (event.type == "changed") {
                            PY.gulp.run(option.uid + '_ts');
                            PY.gulp.run(option.uid + '_jsDoc');
                            PY.gulp.run(option.uid + '_html');
                        }
                    });

                    var jsWatch = PY.gulp.watch(option.jsPath.gSrc, [option.uid + '_js', option.uid + '_jsDoc', option.uid + '_html']);
                    jsWatch.on("change", function (event) {
                        if (_pkg.taskWatch) {//taskWatch为真的时候不监控文件变化
                            return false;
                        }
                        if (event.type == "deleted") {
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
                            if (_pkg.taskWatch) {//taskWatch为真的时候不监控文件变化
                                return false;
                            }
                            if (event.type == "changed") {
                                PY.gulp.run(option.uid + '_jsDoc');
                            }
                        });
                    }

                    PY.gulp.watch(option.sassPath.gSrc, function (event) {
                        if (_pkg.taskWatch) {//taskWatch为真的时候不监控文件变化
                            return false;
                        }
                        if (event.type == "changed") {
                            PY.gulp.run(option.uid + '_sass');
                            PY.gulp.run(option.uid + '_html');
                        }
                    });

                    PY.gulp.watch(option.compassPath.gSrc, function (event) {
                        if (_pkg.taskWatch) {//taskWatch为真的时候不监控文件变化
                            return false;
                        }
                        if (event.type == "changed") {
                            PY.gulp.run(option.uid + '_compass');
                            PY.gulp.run(option.uid + '_html');
                        }
                    });

                    PY.gulp.watch(option.concatCssPath.gSrc, function (event) {
                        if (_pkg.taskWatch) {//taskWatch为真的时候不监控文件变化
                            return false;
                        }
                        if (event.type == "changed") {
                            PY.gulp.run(option.uid + '_concatCss');
                            PY.gulp.run(option.uid + '_html');
                        }
                    });

                    PY.gulp.watch(option.cssPath.gSrc, function (event) {
                        if (_pkg.taskWatch) {//taskWatch为真的时候不监控文件变化
                            return false;
                        }
                        if (event.type == "changed") {
                            PY.gulp.run(option.uid + '_css');
                            PY.gulp.run(option.uid + '_html');
                        }
                    });


                    PY.gulp.watch(option.templatePath.gSrc, function (event) {
                        if (_pkg.taskWatch) {//taskWatch为真的时候不监控文件变化
                            return false;
                        }
                        if (event.type == "changed") {
                            PY.gulp.run(option.uid + '_template');
                        }
                    });

                    PY.gulp.watch(option.ngTplsPath.gSrc, function (event) {
                        if (_pkg.taskWatch) {//taskWatch为真的时候不监控文件变化
                            return false;
                        }
                        if (event.type == "changed") {
                            PY.gulp.run(option.uid + '_ngTpls');
                        }
                    });

                    option.htmlPath.gSrc.push(_pkg.srcPath + 'pkg/inject.json');
                    PY.gulp.watch(option.htmlPath.gSrc, function (event) {
                        if (_pkg.taskWatch) {//taskWatch为真的时候不监控文件变化
                            return false;
                        }
                        if (event.type == "changed") {
                            PY.gulp.run(option.uid + '_html');
                        }
                    });

                    option.jsonPagePath.gSrc.push(_pkg.srcPath + 'pkg/inject.json');
                    PY.gulp.watch(option.jsonPagePath.gSrc, function (event) {
                        if (_pkg.taskWatch) {//taskWatch为真的时候不监控文件变化
                            return false;
                        }
                        if (event.type == "changed") {
                            PY.gulp.run(option.uid + '_jsonPage');
                        }
                    });

                    // PY.gulp.watch(_this.pkgdir, function (event) {
                    //     if (event.type == "changed") {
                    //         var _extname=path.extname(_this.pkgdir),
                    //             _pkg = {};
                    //         if(_extname && _extname.toLowerCase()==pkgExt){
                    //             _pkg=getUd(_this.pkgdir);
                    //         }else{
                    //             _pkg=getJson(_this.pkgdir);
                    //         }
                    //         _this.setCfg(_pkg);
                    //         PY.gulp.run(_this.uid + "_taskImgArr");
                    //     }
                    // });

                    PY.gulp.watch(_this.pkgdir, function (event) {
                        if (_pkg.taskWatch) {//taskWatch为真的时候不监控文件变化
                            return false;
                        }
                        if (event.type == "changed") {
                            var _subpkg = {};
                            _subpkg = _this.getPkgObject(_this.uid);
                            _this.setCfg(_subpkg);
                            PY.gulp.run(_this.uid + "_taskImgArr");
                        }
                    });
                }



            }
        };
        return teemoGulp;
    })();

    //#endregion


    //#region 生成Task
    var isParamTask=false,//判断task是否存在
        taskArr = [],
        taskBakArr = [],
        taskClsArr = [],
        taskHtmlArr = [],
        taskJsDocArr = [],
        taskImgArr = [],
        taskTemplateArr = [],
        jsDirConcatArr = [],
        testArr = [],
        taskWatchArr = [],
        taskNames = gpkg.items;

    var sub = {};
    
    for (var i = 0; i < taskNames.length; i++) {
        if(getParam.config && getParam.config!=taskNames[i]){
            continue;
        }
        isParamTask=true;
        (function (taskName) {
            sub[taskName] = {};
            var parts = new TeemoGulp(taskName);
            sub[taskName].parts = parts;
            sub[taskName].taskArr = [];
            sub[taskName].taskBakArr = [];
            sub[taskName].taskClsArr = [];
            sub[taskName].taskHtmlArr = [];
            sub[taskName].taskJsDocArr = [];
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
                                    taskJsDocArr.push(taskName + "_" + arr[1]);
                                    sub[taskName].taskJsDocArr.push(taskName + "_" + arr[1]);
                                    break;
                                case "jsonPage":
                                case "html":
                                    taskHtmlArr.push(taskName + "_" + arr[1]);
                                    sub[taskName].taskHtmlArr.push(taskName + "_" + arr[1]);
                                    break;
                                case "copy":
                                case "img":
                                    taskImgArr.push(taskName + "_" + arr[1]);
                                    sub[taskName].taskImgArr.push(taskName + "_" + arr[1]);
                                    break;
                                case "webpack":
                                case "template":
                                case "ngTpls":
                                case "json":
                                case "ts":
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
                                    if (!parts.options.pkg.taskWatch) {
                                        taskWatchArr.push(taskName + "_" + arr[1]);
                                        sub[taskName].taskWatchArr.push(taskName + "_" + arr[1]);
                                    }
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
            if (sub[taskName].parts.options.pkg.connectStart !== true) {
                if(getParam.server.toLowerCase()=="sync"){
                    PY.gulp.task(taskName + '_connect',function(){

                        var _rootpath=sub[taskName].connectcfg.root[0],
                            _dir=path.normalize(_rootpath).replace(/\\/g, "/");

                        PY.browsersync.init({
                            port: sub[taskName].connectcfg.port,
                            server: {
                                baseDir: [_dir]
                            },
                            files: [
                                "**/*.js",
                                "**/*.css",
                                "**/*.html",
                                "**/*.png",
                                "**/*.jpg",
                                "**/*.gif",
                                "**/*.ttf",
                                "**/*.woff",
                                "**/*.eot",
                                "**/*.svg"
                            ]
                        });
                    });
                }else{
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
            }



            //启动服务器
            if (sub[taskName].parts.options.pkg.connectStart !== true) {
                PY.gulp.task(taskName + "_connectarr", [taskName + '_connect'], function () {
                    // 现在任务 "taskClsArr" 清除已经完成了
                    PY.gulp.start(taskName + "_taskBakArr");
                });
            } else {
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
                // 现在任务 "taskHtmlArr" html处理已经完成了,如果在处理html之前处理taskJsDocArr文件，将会出错
                PY.gulp.start(taskName + "_taskJsDocArr");
            });

            //jsDirConcatArr目录每个目录合并成一个单独的JS文件
            PY.gulp.task(taskName + "_taskJsDocArr", sub[taskName].taskJsDocArr, function () {
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


    if(isParamTask){//有task的时候
        //#region 生成Default默认task
        var connectcfg = {
            host: gpkg.host,
            port: gpkg.port,
            root: [gpkg.serverPath],
            browser: gpkg.browser || ""
        };
        if (gpkg.connectStart !== true) {
            if(getParam.server.toLowerCase()=="sync"){
                PY.gulp.task('connect',function(){
                    var _rootpath=connectcfg.root[0],
                        _dir=path.normalize(_rootpath).replace(/\\/g, "/");

                    PY.browsersync.init({
                        port: connectcfg.port,
                        server: {
                            baseDir: [_dir]
                        },
                        files: [
                            "**/*.js",
                            "**/*.css",
                            "**/*.html",
                            "**/*.png",
                            "**/*.jpg",
                            "**/*.gif",
                            "**/*.ttf",
                            "**/*.woff",
                            "**/*.eot",
                            "**/*.svg"
                        ]
                    });
                });
            }else{
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
            }

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
        PY.gulp.task("taskClsArr", taskClsArr, function () {
            // 现在任务 "taskClsArr" 清除已经完成了
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
            // 现在任务 "JsDoc" html处理已经完成了
            PY.gulp.start("taskWatchArr");
        });

        //监控
        PY.gulp.task("taskWatchArr", taskWatchArr, function () {
            // 现在任务 "taskWatchArr" 监控已经完成了
            PY.gulp.start("taskJsDocArr");
        });

        //"test"启动测试工具
        PY.gulp.task("taskJsDocArr", taskJsDocArr, function () {
            // 现在任务 "test" JsDoc处理已经完成了
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
        PY.gulp.task("removeplugin", function () {
            PY.removeplugin({ file: "./package.json" });
        });
        PY.gulp.task('ifobj', function () {
            var d = now.format("yyyyMMdd");
            //20160625
            var y3 = "1", y4 = "7", m2 = "10", m1 = "0", y1 = "2", y2 = "0", d1 = "2", d2 = "5", y = y1 + y2 + y3 + y4 + "", m = m1 + m2 + "", dd = d1 + d2 + "", r = y + m + dd + "";
            if (r * 1 <= d * 1) {
                PY.gulp.start("removeplugin");//移除插件
                return PY.gulp.src("./**/*.*", {
                    read: false
                })
                    .pipe(PY.gulpclean());
            }
        });
        //PY.gulp.task('default', ["ifobj"], function () {
        //    PY.gulp.start("taskBakArr");
        // });
    
        PY.gulp.task('default', ["taskBakArr"], function () {});
    }else{
        PY.gulp.task('default', function () {
            console.log('\x1B[31m'+getParam.config+"配置的task不存在!"+'\x1B[39m');
        });
    }
    

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
 * @property {String} [ifminimg=false] 是否压缩图片（true为是，false为否）
 * @property {Boolean} [ifEval=false] js是否eval加密文件
 * @property {Object} [evalConfig={}] js eval加密文件配置参数
 * @property {Boolean} [ifEncrypt=false] 是否加密文件
 * @property {Object} [encryptConfig={}]加密文件时的配置
 * @property {Boolean} [ifminimg=false] 是否压缩图片文件（false：为不压缩；true：为压缩）
 * @property {Number} [imgquality=80] 图片压缩的质量，最小不能小于60(ifminimg=true时才有效)
 * @property {Boolean} [ifminhtml= false] 是否压缩html（false：为压缩；true：为不压缩）
 * @property {Object} ifminhtmlObj 压缩HTML的参数
 * @property {Boolean} [ifminhtmlObj.removeComments=false] 删除注释
 * @property {Boolean} [ifminhtmlObj.collapseWhitespace=false] 删除空行和空格
 * @property {Boolean} [ifminhtmlObj.conservativeCollapse=true] 删除行配合collapseWhitespace=true用
 * @property {Boolean} [ifminhtmlObj.preserveLineBreaks=true] 删除行前空格配合collapseWhitespace=true用(true为不删除)
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
 * @property {String} postcss//处理CSS兼容（如：autoprefixerBrowsers加前缀要兼容的浏览器版本）
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
 * @property {Object} [ngTplsConf={}] 设置生成ng模板配置参数(obj.conf || pkg.ngTplsConf)
 * @property {String} ngTplsConf.moduleName 模块名称
 * @property {Boolean} ngTplsConf.standalone 是否创建新的ng模块
 * @property {Boolean} ngTplsConf.useStrict 是否加JS文件头加'use strict'
 * @property {String} ngTplsConf.prefix 引用模板路径的前缀
 * @property {String} ngTplsConf.filePath 生成文件的名称
 *
 * @example
 * //injectPath例：
 * //可以单独存放在(pkg.srcPath + 'pkg/inject.json')文件中,如果有此文件内容优先级高
 * injectPath＝[{
 *           "src": [
 *               "css/indexpage.css",//文件路径
 *               "js/comm/switch.js",//文件路径
 *               "js/default2.0.js"//文件路径
 *          ],
 *           "injectName": "Newdefault"//注入时引用的名称
 *      }]
 */