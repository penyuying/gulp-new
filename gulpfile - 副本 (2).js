(function () {

    //gulp库引入
    var gulp = require('gulp'), //基础库
        fs = require('fs'), //gulp内置库读取文件内容fs.readFileSync('./text.txt', 'utf8')
        path = require('path'), //获取路径
        merge = require('merge-stream'),
        es = require('event-stream'),
        streamqueue = require('streamqueue'),
        tap = require('gulp-tap'),

        //外部插件
        clean = require('gulp-clean'), //清空内容
        //cache = require('gulp-cache'),                //文件缓存，只有文件替换了才压缩
        buffer = require('gulp-buffer'), //只传递更改过的文件
        autoprefixer = require('gulp-autoprefixer'), //自动为你添加浏览器私有CSS前缀
        rename = require('gulp-rename'), //重命名
        srcRev = require("gulp-rev-easy"), //自动给HTML里面的JS CSS链接后面加上MD5版本码
        gpIf = require('gulp-if'), //判断
        concat = require('gulp-concat'), //合并文件
        header = require('gulp-header'), //文件头部加注释
        headerfooter = require('gulp-header-footer'), //文件头和脚部加注释
        filter = require('gulp-filter'), //筛选文件
        notify = require('gulp-notify'), //更动通知(通知框气泡通知)
        changed = require('gulp-changed'), //只允许改变的文件通过管道。
        plumber = require('gulp-plumber'), //编译错误，gulp watch命令正常工作补丁
        replace = require('gulp-replace'), //替换内容
        contentIncluder = require('gulp-content-includer'), //替换模板
        gzip = require('gulp-gzip'),//压缩成gzip
        lazypipe = require('lazypipe'),//工厂来共享 stream
		del = require('del'),
		vinylPaths = require('vinyl-paths'),
		imageminPng = require('imagemin-pngquant'),//压缩png图片
        imageminjpeg = require('imagemin-mozjpeg'),//压缩jpg图片
        imagemingif = require('imagemin-gifsicle'),//require('imagemin-gifsicle'),//压缩gif图片
        imageminSvg = require('imagemin-svgo'),//压缩svg
		currenttime=require('gulp-currenttime'),//取文件当前时间
        imageminWeb = require('imagemin-webp'),//转成webp格式的图片

        htmlmin = require('gulp-htmlmin'),//压缩HTML
        jsonlint = require('gulp-jsonlint'),//检查JSON语法

        //js
        jshint = require('gulp-jshint'), //js检查
        map = require('map-stream'),
        uglify = require('gulp-uglify'), //js压缩
        obfuscate = require('gulp-obfuscate'),//js代码混淆
        sourcemaps = require('gulp-sourcemaps'), //转换后的代码的每一个位置，所对应的转换前的位置。有了它，出错的时候，除错工具将直接显示原始代码，而不是转换后的代码。
        gutil = require('gulp-util'),

        //js单元测试
        karmaServer =require('karma').Server,
        //css
        sass = require('gulp-ruby-sass'), //sass
        watch = require('gulp-watch'), //只重新编译被更改过的文件
        minifycss = require('gulp-minify-css'), //css压缩

        //server
        connect = require('gulp-connect-multi')(), //不能自定义host地址没有https  require('gulp-connect'),//不能自动打开浏览器

        //html
        inject = require('gulp-inject'); //注入JS和CSS



    var build = {};
    var isData = {};
    ['String', 'Function', 'Array', 'Number', 'RegExp', 'Object', 'Date', 'Window'].map(function (v) {//判断数据类型
        isData['is' + v] = function (obj) {
            if (v == "Window") {
                return obj != null && obj == obj.window;
            } else {
                return Object.prototype.toString.apply(obj) == '[object ' + v + ']';
            }
        };
    });
    function replaceItem(item, tempPkg, reg) {
        /// <summary>
        ///  替换字符串里面的变量
        /// </summary>
        /// <param name="item">要被替换的字符串</param>
        /// <param name="tempPkg">从对象中查找内容</param>
        /// <param name="reg">正则表达式</param>
        /// <returns type="string">返回替换好后的字符串</returns>
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
    function againPkg(pkgObj, tempPkg) {
        /// <summary>
        /// 替换JSON文件里面变量
        /// </summary>
        /// <param name="pkgObj"></param>
        /// <param name="tempPkg"></param>
        /// <returns type=""></returns>
        //重置pkg.json对象变量如{"ddd":"fff","abc":"{#ddd#}/eee"}->{"ddd":"fff","abc":"fff/eee"}
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
    function addObj(d, o) { //合并对象
        /// <summary>作用：
        /// 合并对象
        /// </summary>
        /// <param name="d" type="对象">默认的对象</param>
        /// <param name="o" type="对象">要合并的对象</param>
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
    function getFolders(dir) {
        /// <summary>
        /// 取得目录下子目录名
        /// </summary>
        /// <param name="dir">目录</param>
        /// <returns type="array">子目录名数组</returns>
        return fs.readdirSync(dir)
            .filter(function (file) {
                return fs.statSync(path.join(dir, file)).isDirectory();
            });
    }

    //时间格式化
//    Date.prototype.format = function (fmt) { //author: meizz 格式化时间
//        var o = {
//            "M+": this.getMonth() + 1, //月份
//            "d+": this.getDate(), //日
//            "h+": this.getHours(), //小时
//            "m+": this.getMinutes(), //分
//            "s+": this.getSeconds(), //秒
//            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
//            "S": this.getMilliseconds() //毫秒
//        };
//        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
//        for (var k in o) {
//            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
//        }
//        return fmt;
    //    };
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
    function formatDate() { //author: meizz 格式化时间
        /// <summary>
        /// 格式化时间
        /// 接收参数如果第一个是this=window时，第一个参数为Date对象，第二个为格式化后的样式（例：yyyy-MM-dd hh:mm:ss）
        /// 如果this=Date对象时第一个为格式化后的样式（例：yyyy-MM-dd hh:mm:ss）
        /// </summary>
        /// <returns type="string">返回格式化后的字符串</returns>
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
    Date.prototype.format = function (fmt) {
        var ret = formatDate.apply(this, arguments);
        return ret;
    };
    //当前时间
    var now = new Date();
    //引入JSON文件
    var pkgtempq = require('./webAppConfig.json');
	pkgtempq.bakDateDir=now.format('yyyy-MM') + '/' + now.format('dd hh.mm')+'/';//用时间作目录
    var gpkg = againPkg(pkgtempq);


    //模块定义
    (function (window) {


        function getGlobal() { //全局路径
            this.pkg = {};
        }

        getGlobal.prototype = {
            setPkg:function(obj){
                this.pkg=obj;
            },
            setpart:function(txt,num,ext,extTxt){//设置空格

                num=num>0?num:32;
                ext=ext!=undefined?ext:"";
                extTxt=extTxt||" ";
                var l= 0,templ=1;
                if(txt){
                    txt=txt.toString();
                    l=txt.length;
                }
                templ=(num-l)>0?(num-l):templ;
                var arr=new Array(templ);
                return txt+arr.join(extTxt)+ext+"\r\n";
            },
            banner: function() { //公用//banner
                var d = new Date();
                return "/*!\r\n"+this.setpart("* @Authors:" + this.pkg.userName,0,"*")+this.setpart("* @System:" + this.pkg.name,0,"*")+this.setpart("* @Version:v" + this.pkg.version,0,"*")+this.setpart("* @update: {$#"+this.pkg.currenttimeName+":"+ this.pkg.currenttime + "#$}",0," *")+this.setpart("*/",1,"\r\n");
                //return "/*!\r\n* @Authors:" + this.pkg.userName + "              *\r\n* @System:" + this.pkg.name + "              *\r\n* @Version:v" + this.pkg.version + "             *\r\n* @update: {$#"+this.pkg.currenttimeName+":"+ this.pkg.currenttime + "#$} *\r\n*/\r\n\r\n";
            },
            footer: function() { //公用//footer
                var d = new Date();
                return "\r\n\r\n/*!----------   {$#"+this.pkg.currenttimeName+":"+ this.pkg.currenttime + "#$}   ----------*/";
            },
            getClsPath: function() { //需要删除的目录
                var pkg = this.pkg,
                    retGSrc = []; //retGSrc = [pkg.tempPath + "**/*.*"]
                retGSrc.push(pkg.destPath);
                return {
                    gSrc: retGSrc
                };
            },
            getDestPath: function (pkg, obj, subDst) {//获取处理完后的文件的存储目录
				if(subDst=="bakDstDir"){//处理备份存储目录
					if(obj.dest){
						return path.normalize(obj.dest).replace(/\\/g,"/");
					}else if(pkg[subDst]){
						return path.normalize(pkg[subDst]).replace(/\\/g,"/");
					}else{
						return "";
					}
				}
                var root = pkg.destRoot || "";
                if (obj && typeof obj.root != "undefined") {
                    root = obj.root;
                }

                if (obj && obj.dsrc) {//存储到开发目录
                    return path.normalize(pkg.srcPath + obj.dsrc).replace(/\\/g,"/");
                } else if (obj && obj.dest) {//存储到生成目录
                    return path.normalize(pkg.destPath + root + obj.dest).replace(/\\/g,"/");
                } else if (subDst) {
                    if (pkg[subDst]) {
                        return path.normalize(pkg.destPath + root + pkg[subDst]).replace(/\\/g,"/");
                    }
                }
                if (pkg.destPath) {
                    return path.normalize(pkg.destPath + root).replace(/\\/g,"/");
                } else {
                    return "";
                }

            },
            htmlInject:function (pkg) {//处理注入流
                var tmpInject = new lazypipe();
                var _this=this;
                var injectdir = pkg.srcPath + 'pkg/inject.json';
                var _pkg=getJson(injectdir);
                pkg = addObj(pkg, _pkg);
				pkg=againPkg(pkg);
                var dirFile=pkg.injectPath;
                function getfilepath(obj) {//处理注入路径

					/**
					 * 读取自定义属性名
					 * @param type //类型（扩展名）
					 * @param obj //数据对象
					 * @returns {string}
					 */
					function getAttr(type,obj){
						type=type||"";
						var ret=" ",retArr,attrListObj;
						var attrName=type + "Attr";

						if(typeof obj[attrName]!="undefined"){//如果obj存在attrName属性则处理
							attrListObj=obj[attrName];

							if(isData.isObject(attrListObj)){//如果attrListObj是一个对象则把key作为属性名，value作为值添加到retArr数组
								retArr=[];
								for(var arr in attrListObj){
									retArr.push(arr + '="'+attrListObj[arr]+'"');
								}
							}else if(isData.isArray(attrListObj)){//如果attrListObj是一个数组，则直接把attrListObj赋值组retArr数组
								retArr=attrListObj;
							}

							if(isData.isArray(retArr)){
								ret=" "+retArr.join(" ")+" ";
							}else{
								ret=" "+attrListObj+" ";
							}
						}
						return ret;
					}

                    return function(filepath, file, i, length, targetFile){
						var tObj=obj;
						var j=0,k=0;
						var pathArr = path.dirname(targetFile.path).split(path.sep);
						var pathlength = pathArr.length;
						var fileArr = path.dirname(filepath).split("/");
						var dir = "";
						if (path.extname(targetFile.path).toLowerCase() == ".html") {
							for (k = 0; k < pathlength; k++) {
								if (pathArr.length > 0 && pathArr[0] == fileArr[0]) {
									pathArr.splice(0, 1);
									fileArr.splice(0, 1);
								}else{
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
						var filedir=fileArr.join("/")+"/"+path.basename(filepath),attr;

						if (filepath.toLowerCase().slice(-3) === '.js') {
							attr=getAttr("js",tObj);
							return '	<script type="text/javascript"'+attr+'src="' + dir + filedir+ '"></script>';
						}
						if (filepath.toLowerCase().slice(-4) === '.css') {
							attr=getAttr("css",tObj);
							return '	<link href="' + dir + filedir + '"'+attr+'rel="stylesheet" />';
						}
					};

                }

                if (isData.isArray(dirFile) && dirFile.length > 0 && isData.isObject(dirFile[0])) {
                    dirFile.map(function (obj) {
                        var root = pkg.destRoot || "",destPath,ret;
                        if (obj && typeof obj.root != "undefined") {
                            root = obj.root;
                        }
                        if (obj.src) {
                            destPath = pkg.destPath || "";
                            ret = _this.getSrc(destPath + root, obj.src);
                            tmpInject = tmpInject.pipe(inject, gulp.src(ret, { read: false }), {
                                name: obj.injectName || pkg.injectName,
                                addRootSlash: false,
                                removeTags: true,//移除页面上的标记
                                empty: true,
                                transform: getfilepath(obj)
                            });
                        }
                        if (obj.psrc) {
                            destPath = pkg.destPath || "";
                            ret = _this.getSrc(destPath,obj.psrc);
                            tmpInject = tmpInject.pipe(inject, gulp.src(ret, { read: false }), {
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
                    tmpInject = tmpInject.pipe(inject, gulp.src(ret, { read: false }));
                }
                return tmpInject;
            },

            gArr: function() {
                var ret=[];
                var pkg=this.pkg;
                if(pkg.debarPath){
                    ret.push("!" + pkg.srcPath + pkg.debarPath);
                    if(pkg.publicPath){
                        ret.push("!" + pkg.publicPath + pkg.debarPath);
                    }
                }
                return ret;
            },
            getDebarPath:function(objPath,debarPath,ext,dirName){//设置作废的目录
                if (!ext) {
                    ext = "";
                }
                ext = "";
                var ret=[];
                if(dirName=="bakFile"){
                    return ret;
                }
                var pkg=this.pkg;
                var temparr=[],pathArr=this.splitSrc(objPath);
                if(pathArr && pathArr.length>0){
                    pathArr.map(function(v,k){
                        if(v.indexOf("!")!=-1){
                            ret.push("!" + v.replace(/\!/g,""));
                        }else{
                            if(v.slice(-1)==="*"){
                                if(v.slice(-6)==="**/*.*"){
                                    ret.push("!"+path.normalize(v.replace(/\*\*\/\*\.\*$/,debarPath)+ext).replace(/\\/g,"/"));
                                }else if(v.slice(-4)==="**/*"){
                                    ret.push("!"+path.normalize(v.replace(/\*\*\/\*$/,debarPath)+ext).replace(/\\/g,"/"));
                                }else{
                                    ret.push("!"+path.normalize(v.replace(/\*$/,debarPath)+ext).replace(/\\/g,"/"));
                                }
                            }else if(v.slice(-1)=="/"){
                                ret.push("!"+path.normalize(v+debarPath+ext).replace(/\\/g,"/"));
                            }
                        }
                    });
                }
                return ret;
            },
            getSrc:function (destPath, obj, ext,debar,dirName) {
                /// <summary>作用：
                /// 获取路径
                /// </summary>
                /// <param name="destPath" type="txt">根目录</param>
                /// <param name="obj" type="对象">子路径可以是文本或数组</param>
                /// <param name="ext" type="txt">扩展名可以为空</param>
                /// <param name="debar">是否启用过滤的文件名(false为启用，true为不启用)</param>
                /// <param name="dirName">来源路径对象key名</param>
                if (!ext) {
                    ext = "";
                }
                if(dirName=="bakFile"){
                    destPath="";
                }
                var ret = [],_this=this;
                var pkg=this.pkg,debarArr=[],tempsrc;
                if (isData.isArray(obj)) {
                    for (var i = 0; i < obj.length; i++) {
                        if(!debar){
                            debarArr=_this.getDebarPath(destPath + obj[i],pkg.debarPath,ext,dirName);
                            if(debarArr && debarArr.length>0){
                                ret=ret.concat(debarArr);
                            }
                        }
						if(dirName=="concatJs" || dirName=="concatCss"){
                            tempsrc=path.normalize(destPath + obj[i]).replace(/\\/g,"/");
                            ret=ret.concat(this.splitSrc(tempsrc,ext));
						}else{
							ret.push(path.normalize(destPath + obj[i] + ext).replace(/\\/g,"/"));
						}
                    }
                } else if (obj) {
                    if(!debar){
                        debarArr=_this.getDebarPath(destPath + obj,pkg.debarPath,ext,dirName);
                        if(debarArr && debarArr.length>0){
                            ret=ret.concat(debarArr);
                        }
                    }
					if(dirName=="concatJs" || dirName=="concatCss"){
                        tempsrc=path.normalize(destPath + obj).replace(/\\/g,"/");
                        ret=ret.concat(this.splitSrc(tempsrc,ext));
					}else{
						ret.push(path.normalize(destPath + obj + ext).replace(/\\/g,"/"));
					}
                } else {
                    ret = [];
                }
//                console.log(ret)

//                    if(ext==".html"){
//                        console.log(ret)
//                    }
                return ret;
            },
			splitSrc:function(src,ext){//折分文件地址
				var ret=[];
                ext=ext||"";
				function getArr(srcPath){
					var temparr=[],rep=false;
					if(isData.isString(srcPath)){
						var rg=/\{([^\}]+)\}/ig;
						var srcPathArr=rg.exec(srcPath);

						if(isData.isArray(srcPathArr) && srcPathArr.length>1){
							var arr=srcPathArr[1].split(',');
							if(arr && arr.length>0){
								arr.map(function(txt){
									if(srcPath && txt){
										var tt=srcPath.replace(srcPathArr[0],txt);
										temparr.push(tt);
										rep=true;
									}

								});
							}else{
								temparr.push(srcPath);
							}
						}else{
							temparr.push(srcPath);
						}
						//srcPath.replace(/\{([^\}])\}/ig,function($1,$2){

						//});
					}
					if(rep && temparr && temparr.length>0){
						var tempfor=[];
						temparr.map(function(item){
							if(item){
								var r=getArr(item);
								if(isData.isArray(r) && r.length>0){
									tempfor=tempfor.concat(r);
								}
							}
						});
						if(tempfor && tempfor.length>0){
							temparr=tempfor;
						}
					}
					return temparr || [];
				}
                ret=getArr(src);
                var tempRet=[];
                if(ret && isData.isArray(ret) && ret.length>0){
                    ret.map(function(item){
                        tempRet.push(item+ext);
                    });
                }
				return tempRet;
			},
            setObj: function (dirName, subDst, ext, debar, concatDstJsFileName, tplsPath) {
                /// <summary>
                /// 设置对象处理参数配置
                /// </summary>
                /// <param name="dirName">来源路径对象key名</param>
                /// <param name="subDst">处理后存放文件的子目录</param>
                /// <param name="ext">处理文件的扩展名</param>
                /// <param name="debar">是否启用过滤的文件名(false为启用，true为不启用)</param>
                /// <param name="concatDstJsFileName">合并后的文件名</param>
                /// <param name="tplsPath">模板文件名</param>
                if (!ext) {ext = "";}
                var _this = this,
                    retGSrc = [],//_this.gArr(),
                    retSrc = [],
                    pkg = this.pkg,
                    cfg = {},
                    headbanner=_this.banner(),
                    footbanner = _this.footer(),
                    debarArr=[];
                if (pkg.mapIf) {
                    if (dirName === "dirConcatJs" || dirName === "concatJs" || dirName === "jsFile") {
                        headbanner = "/**/";
                        footbanner = "\n\n"+_this.banner();
                    }
                }
                var dirFile = this.pkg[dirName];
				if (isData.isArray(dirFile) && dirFile.length>0 && !isData.isString(dirFile[0])) {
                    if (dirFile.length > 0) {
                        dirFile.map(function (obj) {
                            var src = [],injectIf=false;
//                            if (!debar) {
//                                src = _this.gArr();
//                            }
							if(!obj.src && !obj.psrc){
								return false;
							}
                            if (obj.src) {
                                var srcTxt = _this.getSrc(pkg.srcPath, obj.src, ext,debar,dirName);
                                if (isData.isArray(srcTxt) && srcTxt.length>0) {
                                    src=src.concat(srcTxt);
                                    retGSrc=retGSrc.concat(srcTxt);
                                } else {
                                    src.push(srcTxt);
                                    retGSrc.push(srcTxt);
                                }


                                if (obj.debar && !debar) {
                                    debarArr=_this.getDebarPath(pkg.srcPath+obj.src,obj.debar,"",dirName);
                                    if(debarArr && debarArr.length>0){
                                       src=src.concat(debarArr);
                                    }
//                                    src.push("!" + pkg.srcPath + obj.debar);
                                }
                            }

                            if (obj.psrc) {
                                var psrcTxt = _this.getSrc(pkg.publicPath, obj.psrc, ext,debar,dirName);
                                if (isData.isArray(psrcTxt) && psrcTxt.length>0) {
                                    src=src.concat(psrcTxt);
                                    retGSrc=retGSrc.concat(psrcTxt);
                                } else if(psrcTxt){
                                    src.push(psrcTxt);
                                    retGSrc.push(psrcTxt);
                                }

                                if (obj.debar && !debar) {
                                    debarArr=_this.getDebarPath(pkg.publicPath+obj.psrc,obj.debar,"",dirName);
                                    if(debarArr && debarArr.length>0){
                                       src=src.concat(debarArr);
                                    }
//                                    src.push("!" + pkg.publicPath + obj.debar);
                                }
                            }
                            if (tplsPath && obj.tpls) {
                                retGSrc.push(pkg.srcPath + obj.tpls + "**/*.html");
                            } else if (tplsPath) {
                                retGSrc.push(pkg.srcPath + pkg[tplsPath]+ "**/*.html");
                            }
                            var destPath = _this.getDestPath(pkg, obj, subDst);
//                            if (obj && typeof obj.injectIf != "undefined") {
//                                injectIf = obj.injectIf;
//                            } else {
//                                injectIf = pkg.injectIf;
//                            }
//                            var jsAnonymous,bannerIf;
//							if(obj && typeof obj.jsAnonymous != "undefined"){
//								jsAnonymous = obj.jsAnonymous;
//							}else {
//                                jsAnonymous = pkg.jsAnonymous;
//                            }
//							if(obj && typeof obj.bannerIf != "undefined"){
//								bannerIf = obj.bannerIf;
//							}else {
//                                bannerIf = pkg.bannerIf;
//							}
                            var tempJsHeader=returnObj(obj, 'jsHeader',returnObj(pkg, (pkg.jsHeader &&  'jsHeader')||"", "(function("+returnObj(obj, 'jsGlobalObj', pkg.jsGlobalObj)+") {\n"));
							//if(!tempJsHeader){
							//	tempJsHeader="(function("+returnObj(obj, 'concatJsGlobalObj', pkg.concatJsGlobalObj)+") {\n"
							//}
							var tempJsFooter=returnObj(obj, 'jsFooter', returnObj(pkg, (pkg.jsFooter && 'jsFooter')||"", "\n})("+returnObj(obj, 'jsGlobalObj', pkg.jsGlobalObj)+")"));
							//if(!tempJsFooter){
							//	tempJsFooter="\n})("+returnObj(obj, 'concatJsGlobalObj', pkg.concatJsGlobalObj)+")"
							//}
                            cfg = {
                                concatFileName: obj.fileName || concatDstJsFileName && pkg[concatDstJsFileName]||"",//合并文件后文件的名称
                                tplsPath: obj.tpls && path.normalize(pkg.srcPath + obj.tpls).replace(/\\/g,"/") || tplsPath && pkg[tplsPath]  && path.normalize(pkg.srcPath + pkg[tplsPath]).replace(/\\/g,"/") || pkg.srcPath,//HTML的模板文件目录
                                destPath: destPath,//处理完后的文件存储目录
                                newFileName: returnObj(obj, 'newFileName',""),//处理完后的文件的新名称
                                mapIf: pkg.mapIf,//是否生成map文件（true为是，flase为否）
                                mapsPath: returnObj(obj, 'map', pkg.mapsPath),//obj.map || pkg.mapsPath,
                                ifminimg: returnObj(obj, 'ifminimg', pkg.ifminimg),//obj.ifmin || pkg.ifminimg,//是否压缩图片（true为是，flase为否）
                                imgquality: returnObj(obj, 'imgquality', pkg.imgquality),//图片质量
                                suffix: returnObj(pkg, 'suffix',false),//是否给文件加后缀（有内空时为加，没有内容时为不加）
                                ifmin: pkg.ifmin,//是否压缩JS、CSS（true为否，flase为是）
                                autoprefixerBrowsers:pkg.autoprefixerBrowsers,
                                ifminhtml: returnObj(obj, 'ifminhtml', pkg.ifminhtml),//obj.ifminhtml || pkg.ifminhtml,//是否压缩html（true为否，flase为是）
                                injectIf: returnObj(obj, 'injectIf', pkg.injectIf),//injectIf,//是否注入文件到html（true为是，flase为否）
                                bannerIf: returnObj(obj, 'bannerIf', pkg.bannerIf),//bannerIf,//是否加banner（true为否，flase为是）
                                gzipIf: pkg.gzipIf,//是否把文件压缩成gzip格式（true为是，flase为否）
                                header: headbanner,//banner的头内容
                                footer: footbanner,//banner的脚内容
                                srcRev: pkg.srcRev,//是否给引用文件加后缀如：xxx.x?=xxxx（true为是，flase为否）
                                changIf: returnObj(obj, 'changIf', pkg.changIf),//是否改变时才更新文件（true为否，flase为是）//obj.changIf||pkg.changIf,
                                jsAnonymous: returnObj(obj, 'jsAnonymous', pkg.jsAnonymous),//jsAnonymous,//合并js文件时是否用匿名函数包起来（true为是，flase为否）
                                jsHeader: tempJsHeader,//合并JS前面加的代码
                                jsFooter: tempJsFooter,//"\n})("+returnObj(obj, 'concatJsGlobalObj', pkg.concatJsGlobalObj)+")",//合并JS后面加的代码
                                srcPath: unique(src),//需要处理的文件
                                //concatJsGlobalObj:returnObj(obj, 'concatJsGlobalObj', pkg.concatJsGlobalObj),//合并JS时需用到的全局变量名称
								connectStart:pkg.connectStart,//是否启动服务器
                                currenttime:returnObj(pkg,"currenttime","mtime"),//文件时间类型默认为mtime
                                currenttimeName:returnObj(pkg,"currenttimeName","currenttime"),//文件时间使用的别名默认为currenttime
                                mapObj:{
								    includeContent: true,//是否引入影射内容
									sourceRoot: 'source'//影射内容到source目录
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
                } else if (dirFile && isData.isString(dirFile)||isData.isArray(dirFile) && dirFile.length>0 && isData.isString(dirFile[0])) {
                    var src = [];
//                    if (!debar) {
//                        src = _this.gArr();
//                    }
					if(!pkg.srcPath || !dirFile){
						return false;
					}
                    var srcTxt = _this.getSrc(pkg.srcPath, dirFile, ext,debar,dirName);
				    if (isData.isArray(srcTxt) && srcTxt.length>0) {
				        src=src.concat(srcTxt);
				        retGSrc=retGSrc.concat(srcTxt);
				    } else if(srcTxt) {
				        src.push(srcTxt);
				        retGSrc.push(srcTxt);
				    }
				    var destPath = _this.getDestPath(pkg, "", subDst);
                    cfg = {
                        concatFileName:concatDstJsFileName && pkg[concatDstJsFileName],
                        tplsPath: tplsPath && path.normalize(pkg.srcPath + pkg[tplsPath]).replace(/\\/g,"/") || pkg.srcPath,
                        srcPath: unique(src),
                        destPath: destPath,
                        newFileName:"",//处理完后的文件的新名称
                        mapIf: pkg.mapIf,
                        mapsPath: pkg.mapsPath,
                        ifminimg: pkg.ifminimg,//是否压缩图片（true为是，flase为否）
                        suffix: returnObj(pkg, 'suffix', false),//是否给文件加后缀（有内空时为加，没有内容时为不加）
                        ifmin: pkg.ifmin,
                        autoprefixerBrowsers: pkg.autoprefixerBrowsers,
                        ifminhtml: pkg.ifminhtml,
                        injectIf:pkg.injectIf,
                        bannerIf:pkg.bannerIf,
                        gzipIf: pkg.gzipIf,
                        header:  headbanner,
                        footer: footbanner,
                        srcRev: pkg.srcRev,
                        changIf:pkg.changIf,
                        //concatJsGlobalObj:pkg.concatJsGlobalObj,//合并JS时需用到的全局变量名称
                        jsAnonymous:pkg.jsAnonymous,
                        jsHeader: returnObj(pkg, (pkg.jsHeader && 'jsHeader')||"","(function("+returnObj(pkg, 'jsGlobalObj',"")+") {\n"),//JS前面加的代码
                        jsFooter: returnObj(pkg, (pkg.jsFooter && 'jsFooter')||"","\n})("+returnObj(pkg, 'jsGlobalObj',"")+")"),//"\n})("+returnObj(obj, 'concatJsGlobalObj', pkg.concatJsGlobalObj)+")",//JS后面加的代码
                        imgquality: pkg.imgquality,//图片质量
						connectStart:pkg.connectStart,//是否启动服务器
                        currenttime:returnObj(pkg,"currenttime","mtime"),//文件时间类型默认为mtime
                        currenttimeName:returnObj(pkg,"currenttimeName","currenttime"),//文件时间使用的别名默认为currenttime
						mapObj:{
							includeContent: true,
							sourceRoot: 'source'
						}
                    };
                    if (tplsPath) {
                        retGSrc.push(pkg.srcPath + pkg[tplsPath] + "**/*.html");
                    }

                    retSrc.push(cfg);
                }
				return {
				    gSrc: unique(retGSrc),
                    cfgArr:retSrc
                };
			},
            splitSrcAndDebar:function (arr,ext,concat){//把不过滤的文件名和过滤的文件名分开
                /// <summary>
                /// 把不过滤的文件名和过滤的文件名分开
                /// </summary>
                /// <param name="arr">需要分的数组</param>
                /// <param name="ext">加不过滤的文件名后缀</param>
                ext=ext||"";
                var ret={};
                var retSrcArr=[],retDeberArr=[];
                if(arr && isData.isArray(arr) &&  arr.length>0){
                    arr.map(function(v){
                        if(v.indexOf("!")==-1){
                            retSrcArr.push(v+ext);
                        }else{
                            retDeberArr.push(v);
                        }
                    });
                }
                if(concat){
                    ret={
                        src:retSrcArr,
                        deber:retDeberArr
                    };
                }else{
                    ret={
                        src:retSrcArr.concat(retDeberArr)
                    };
                }
                return ret;
            },
			getBakPath:function(){//获取备份处理参数配置
				var obj = this.setObj("bakFile", "bakDstDir");
                return obj;
			},
            getCopyPath: function () { //获取复制处理参数配置
                var obj = this.setObj("copyFile", "copyDstDir");
                return obj;
            },
            //getTestPath: function () { //获取测试处理参数配置
            //    var obj = this.setObj("testFile", "testDstDir");
            //    return obj;
            //},
            getJsonPath: function () { //获取Json处理参数配置
                var obj = this.setObj("jsonFile", "jsonDstDir", '.json');
                return obj;
            },
            getImgPath: function () { //获取图片处理参数配置
                var pngobj = this.setObj("imgFile", "imgDstDir", ".{png,PNG}");
                var jpgobj = this.setObj("imgFile", "imgDstDir", ".{jpg,JPG}");
                var gifobj = this.setObj("imgFile", "imgDstDir", ".{gif,GIF}");
                var retGSrc =[];
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
            getJsDirConcatPath: function () {
                var obj = this.setObj("dirConcatJs", "jsDstDir", "", false);
                var tempobj=this.splitSrcAndDebar(obj.gSrc,"**/*.js");
                return {
                    gSrc: unique(tempobj.src),
                    cfgArr: obj.cfgArr
                };
                //return obj;
            },
            getConcatJsPath: function () {
                var obj = this.setObj("concatJs", "jsDstDir", ".js",false, "concatDstJsFileName");
                return obj;
            },
            getJsPath: function () { //获取js处理参数配置
                var obj = this.setObj("jsFile", "jsDstDir", ".js");
                return obj;
            },
            getSassPath: function () { //获取sass处理参数配置
                var obj = this.setObj("sassFile", "cssDstDir", "{.scss,.sass}",true);
                return obj;
            },
            getConcatCssPath: function () {
                var obj = this.setObj("concatCss", "cssDstDir", ".css", false, "concatDstCssFileName");
                return obj;
            },
            getCssPath: function () {//获取css处理参数配置
                var obj = this.setObj("cssFile", "cssDstDir", ".css");
                return obj;
            },
            getHtmlPath: function () {//获取html处理参数配置
                var obj = this.setObj("htmlFile", "htmlDstDir", ".html", false, "", "tplsHtmlFile");
                return obj;
            },
            myReporter:function (file, cb) {//输出jshint检查语法错误信息
                  console.log('   JSHINT file in：'+file.path);
                    if(file.jshint.data && file.jshint.data[0] && file.jshint.data[0].globals){
                        console.log("   globals Object in： "+file.jshint.data[0].globals);
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
                        if(!errorObj[err.error.code]){
                            console.log('      行 ' + err.error.line + ', 列 ' + err.error.character + ', code ' + err.error.code + ', ' + err.error.reason);
                        }
                      }
                    });
                  }else{
                      console.log('   success');
                  }
                  cb(null, file);
            }


        };



//------------------------------------------------------------------------------------------------------------------------------------------------------------------



// gulp.task('clssd', function (cb) {
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
                var pkgObj = addObj(gpkg, _pkg);
                pkgObj = againPkg(pkgObj);
                var gb = this.gb;
                var id=this.uid;
                gb.setPkg(pkgObj);
                this.indexObj = {
                    gb:gb,
                    uid: id,
                    pkg: pkgObj,
                    testConfig:pkgObj.testConfig,
                    bakPath: gb.getBakPath(),
                    clsPath: gb.getClsPath(),
                    jsonPath: gb.getJsonPath(),
                    copyPath: gb.getCopyPath(),
                    imgPath: gb.getImgPath(),
                    jsPath: gb.getJsPath(),
                    jsDirConcatPath:gb.getJsDirConcatPath(),
                    concatJsPath:gb.getConcatJsPath(),
                    sassPath:gb.getSassPath(),
                    concatCssPath:gb.getConcatCssPath(),
                    cssPath:gb.getCssPath(),
                    htmlPath:gb.getHtmlPath()
                };
            },
            task_bak: function () { //备份文件
                //var cfg = {
                //    srcPath: [gpkg.srcPath + '**/*.*', gpkg.subJsonPath + '**/*.*'],
                //    destPath: ""
                //};

                if (this.indexObj.bakPath.cfgArr.length > 0) {

                    var subMerge=new merge();
                    subMerge.add(this.indexObj.bakPath.cfgArr.map(function(cfg) {
                        return gulp.src(cfg.srcPath)
                            .pipe(plumber())
                            .pipe(gulp.dest(cfg.destPath));
                    }));
                    return subMerge;
                }
				//if(cfg.destPath){//bakPath
				//	return gulp.src(cfg.srcPath)
                 //   .pipe(plumber())
                 //   .pipe(gulp.dest(cfg.destPath));
				//}else{
				//	return false;
				//}

            },
            task_cls: function () { //清理
				// del(this.indexObj.clsPath.gSrc, cb););
				 return false;
                //return gulp.src(this.indexObj.clsPath.gSrc[0],{read: false})
                    //.pipe(clean());
            },
            task_copy: function () { //复制
                if (this.indexObj.copyPath.cfgArr.length > 0) {
                    var subMerge=new merge();
                    subMerge.add(this.indexObj.copyPath.cfgArr.map(function(cfg) {
                        return gulp.src(cfg.srcPath)
							.pipe(gpIf(cfg.changIf == false, changed(cfg.destPath)))
                            .pipe(plumber())
							.pipe(gpIf(cfg.newFileName !== "", rename(cfg.newFileName+"")))
							.pipe(gpIf(cfg.changIf == false, changed(cfg.destPath)))
                            .pipe(gulp.dest(cfg.destPath));
                    }));
                    return subMerge;
                }
            },
            task_json: function () { //复制JSON
                if (this.indexObj.jsonPath.cfgArr.length > 0) {
                    var subMerge=new merge();
                    subMerge.add(this.indexObj.jsonPath.cfgArr.map(function(cfg) {
                        return gulp.src(cfg.srcPath)
                            .pipe(gpIf(cfg.changIf == false, changed(cfg.destPath)))
                            .pipe(plumber())
                            .pipe(jsonlint())
                            .pipe(jsonlint.failOnError())
                            .pipe(gpIf(cfg.ifmin !== true,replace(/(\s*\n+\s*)/g,function($1){
                                return "";
                             })))
                            .pipe(gulp.dest(cfg.destPath));
                    }));
                    return subMerge;
                }
            },
            task_img: function () {
                var arrObj = this.indexObj.imgPath.arrObj;
                var runstart = false;
                if (arrObj.length > 0) {
                    var subMerge = new merge();
                    for (var j = 0; j < arrObj.length; j++) {
                        if (arrObj[j].cfgArr && arrObj[j].cfgArr.length > 0) {
                            runstart = true;
                            switch (arrObj[j].imgtype) {
                            case 'png':
                                subMerge.add(arrObj[j].cfgArr.map(function (cfg) {
                                    return gulp.src(cfg.srcPath)
                                        .pipe(changed(cfg.destPath))
                                        .pipe(gpIf(cfg.ifminimg === true, imageminPng({ quality: '60-'+cfg.imgquality })()))//.pipe(imageminPng({ quality: '65-80', speed: 4 })())
                                        .pipe(gulp.dest(cfg.destPath));
                                }));
                                break;
                            case 'jpg':
                                subMerge.add(arrObj[j].cfgArr.map(function (cfg) {
                                    return gulp.src(cfg.srcPath)
                                        .pipe(changed(cfg.destPath))
                                        .pipe(gpIf(cfg.ifminimg === true, imageminjpeg({ quality: cfg.imgquality*1 })()))
                                        .pipe(gulp.dest(cfg.destPath));
                                }));
                                break;
                             case 'gif':
                                 subMerge.add(arrObj[j].cfgArr.map(function (cfg) {
                                    return gulp.src(cfg.srcPath)
                                        .pipe(changed(cfg.destPath))
                                        .pipe(gpIf(cfg.ifminimg === true, imagemingif({ interlaced: false })()))
                                        .pipe(gulp.dest(cfg.destPath));
                                }));
                                break;
                            default:
                            }
                        }
                    }
//                    subMerge.add(this.indexObj.imgPath.cfgArr.map(function (cfg) {
//                        var pngFilter = filter('**/*.png', { restore: true });
//                        var jpgFilter = filter('**/*.jpg', { restore: true });
//                        var gifFilter = filter('**/*.gif', { restore: true });
//                        var svgFilter = filter('**/*.svg', { restore: true });
//                        var gulpsrc = gulp.src(cfg.srcPath).pipe(changed(cfg.destPath));
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
//                            .pipe(gulp.dest(cfg.destPath));
//                    }));
//                    subMerge.add(this.indexObj.imgPath.cfgArr.map(function (cfg) {
//                        var pngFilter = filter('**/*.png', { restore: true });
//                        return gulp.src(cfg.srcPath)
//                            .pipe(changed(cfg.destPath))
////                            .pipe(pngFilter)
//                            .pipe(imageminPng({ quality: '60-80' })())//.pipe(imageminPng({ quality: '65-80', speed: 4 })())
//                            .pipe(gulp.dest(cfg.destPath));
//                    }));
//                    subMerge.add(this.indexObj.imgPath.cfgArr.map(function (cfg) {
//                        var jpgFilter = filter('**/*.jpg', { restore: true });
//                        return gulp.src(cfg.srcPath)
//                            .pipe(changed(cfg.destPath))
////                            .pipe(jpgFilter)
//                            .pipe(imageminjpeg({ quality: 80 })())
//                            .pipe(gulp.dest(cfg.destPath));
//                    }));
//                    subMerge.add(this.indexObj.imgPath.cfgArr.map(function (cfg) {
//                        var gifFilter = filter('**/*.gif', { restore: true });
//                        return gulp.src(cfg.srcPath)
//                            .pipe(changed(cfg.destPath))
////                            .pipe(gifFilter)
//                            .pipe(imagemingif({ interlaced: false })())
//                            .pipe(gulp.dest(cfg.destPath));
//                    }));
//                    subMerge.add(this.indexObj.imgPath.cfgArr.map(function (cfg) {
//                        var svgFilter = filter('**/*.svg', { restore: true });
//                        return gulp.src(cfg.srcPath)
//                            .pipe(changed(cfg.destPath))
////                            .pipe(svgFilter)
//                            .pipe(imageminSvg()())
//                            .pipe(gulp.dest(cfg.destPath));
//                    }));
//                    subMerge.add(this.indexObj.imgPath.cfgArr.map(function (cfg) {
//                        return gulp.src(cfg.srcPath)
//                            .pipe(changed(cfg.destPath))
//                            .pipe(imageminWeb({ quality: 80 })())
//                            .pipe(gulp.dest(cfg.destPath));
                    //                    }));
                    if (runstart) {
                        return subMerge;
                    }
                }
            },
            task_jsDir: function () { //每个文件夹生成单独一个文件
                var folders = [];
                var ret = false;
                var _this = this;
                var subMerge = new merge(), myReporter;
                if(this.indexObj.jsDirConcatPath.cfgArr.length>0) {
                    this.indexObj.jsDirConcatPath.cfgArr.map(function(cfg) {
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
                                        subMerge.add(folders.map(function (folder) {
                                            myReporter = new map(_this.indexObj.gb.myReporter);
                                            // 拼接成 foldername.js
                                            // 写入输出
                                            // 压缩
                                            // 重命名为 folder.min.js
                                            // 再一次写入输出
                                            return gulp.src(path.join(srcPath, folder, '/**/*.js'))
                                                .pipe(plumber())
                                                //.pipe(changed(cfg.destPath))
                                                .pipe(gpIf(cfg.mapIf === true, sourcemaps.init()))
                                                .pipe(jshint()) //检查语法
                                                .pipe(myReporter)
                                                .pipe(concat(folder + '.js'))
                                                .pipe(gulp.dest(cfg.destPath))
                                                .pipe(gpIf(cfg.jsAnonymous==true,headerfooter({//文件前后增加内容
                                                    header: cfg.jsHeader,
                                                    footer: cfg.jsFooter,
                                                    filter: function(file) {
                                                        return true;
                                                    }
                                                })))
                                                .pipe(gpIf(cfg.ifmin !== true, uglify()))
                                                .pipe(gpIf(cfg.suffix !== false, rename(folder + cfg.suffix + '.js')))
                                                .pipe(gpIf(cfg.bannerIf!== true, headerfooter({
													header: cfg.header,
													footer: cfg.footer,
													filter: function(file) {
														return true;
													}
												})))

												.pipe(gpIf(cfg.bannerIf!== true, currenttime({callback:function(data){}})))
                                                .pipe(gpIf(cfg.mapIf === true, sourcemaps.write(cfg.mapsPath,cfg.mapObj)))
                                                .pipe(gulp.dest(cfg.destPath))
                                                .pipe(gpIf(cfg.gzipIf === true, gzip({
                                                    append: true
                                                })))
                                                .pipe(gpIf(cfg.gzipIf === true, gulp.dest(cfg.destPath)))
                                                .pipe(gpIf(cfg.connectStart!==true,connect.reload()));
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
            task_concatJs: function () { //合并JS
                var _this = this;
                if (this.indexObj.concatJsPath.cfgArr.length > 0) {
//                    console.log(this.indexObj.concatJsPath.cfgArr)
                    var subMerge = new merge(), myReporter;
                    subMerge.add(this.indexObj.concatJsPath.cfgArr.map(function (cfg) {
                        myReporter = new map(_this.indexObj.gb.myReporter);
                        if (cfg.concatFileName) {
                            return gulp.src(cfg.srcPath)
                                .pipe(plumber())
                                //.pipe(changed(cfg.destPath))
                                .pipe(gpIf(cfg.mapIf === true, sourcemaps.init()))
                                .pipe(jshint()) //检查语法
                                .pipe(myReporter)
                                .pipe(concat(cfg.concatFileName)) //合并文件合并后的文件名为xxx.js
								.pipe(gpIf(cfg.jsAnonymous==true,headerfooter({//文件前后增加内容
                                    header: cfg.jsHeader,
                                    footer: cfg.jsFooter,
                                    filter: function(file) {
                                        return true;
                                    }
                                })))
                                //.pipe(gulp.dest(cfg.destPath))
                                .pipe(gpIf(cfg.ifmin !== true, uglify())) //压缩JS
                                .pipe(gpIf(cfg.suffix != false, rename({
                                    suffix: cfg.suffix
                                }))) //加后缀
                                //.pipe(livereload(server))
                                .pipe(gpIf(cfg.bannerIf!== true, headerfooter({
									header: cfg.header,
									footer: cfg.footer,
									filter: function(file) {
										return true;
									}
								})))
								.pipe(gpIf(cfg.bannerIf!== true, currenttime({
                                    currenttimeName:cfg.currenttimeName,//默认为currenttime
                                    currenttime:cfg.currenttime,//默认为mtime
                                    callback:function(data){}
                                })))
                                .pipe(gpIf(cfg.mapIf === true, sourcemaps.write(cfg.mapsPath,cfg.mapObj)))
                                .pipe(gulp.dest(cfg.destPath)) //保存更改后的文件
                                .pipe(gpIf(cfg.gzipIf === true, gzip({
                                    append: true
                                })))
                                .pipe(gpIf(cfg.gzipIf === true, gulp.dest(cfg.destPath)))
                                .pipe(gpIf(cfg.connectStart!==true,connect.reload()));
                        }
                    }));
                    return subMerge;
                }

            },
            task_js: function () {//处理JS文件
                var _this=this;
                if (this.indexObj.jsPath.cfgArr.length > 0) {
                    var subMerge = new merge(),myReporter;
                    subMerge.add(this.indexObj.jsPath.cfgArr.map(function(cfg) {
                        myReporter = new map(_this.indexObj.gb.myReporter);
						//console.log(cfg.srcPath)
                        return gulp.src(cfg.srcPath)
                            .pipe(sourcemaps.init({ loadMaps: true, debug: true }))
                            .pipe(plumber())
                            .pipe(gpIf(cfg.changIf == false, changed(cfg.destPath)))
                            .pipe(jshint()) //检查语法
                            .pipe(myReporter)//(jshint.reporter('default', { verbose: true })//'fail'
                            .pipe(gpIf(cfg.jsAnonymous==true,headerfooter({//文件前后增加内容
                                header: cfg.jsHeader,
                                footer: cfg.jsFooter,
                                filter: function(file) {
                                    return true;
                                }
                            })))
                            .pipe(gpIf(cfg.ifmin !== true, uglify())) //压缩JS
//                            .pipe(obfuscate())//JS代码混淆
//                            .on('error', gutil.log)
                            .pipe(gpIf(cfg.bannerIf!== true, headerfooter({
                                header: cfg.header,
                                footer: cfg.footer,
                                filter: function(file) {
                                    return true;
                                }
                            })))
							.pipe(gpIf(cfg.bannerIf!== true, currenttime({
                                currenttimeName:cfg.currenttimeName,//默认为currenttime
                                currenttime:cfg.currenttime,//默认为mtime
                                callback:function(data){}
                            })))
                            .pipe(gpIf(cfg.suffix != false, rename({
                                suffix: cfg.suffix
                            }))) //加后缀
                            .pipe(gpIf(cfg.mapIf === true, sourcemaps.write(cfg.mapsPath,cfg.mapObj)))
							//	 {
                           //     includeContent: false //是否把原文件缓存到浏览器
                            //}
                            .pipe(gulp.dest(cfg.destPath)) //保存更改后的文件
                            .pipe(gpIf(cfg.gzipIf === true, gzip({
                                append: true
                            })))
                            .pipe(gpIf(cfg.gzipIf === true, gulp.dest(cfg.destPath)))
                            .pipe(gpIf(cfg.connectStart!==true,connect.reload()));
                    }));
                    return subMerge;
                }
            },
            task_test:function(done){
                if(this.indexObj.testConfig && this.indexObj.testConfig.testConfigFile){
                    var testConfig=this.indexObj.testConfig;
                    new karmaServer({
                        configFile: testConfig.testConfigFile,
                        singleRun:testConfig.singleRun
                    }, done).start();
                }

            },
            task_sass: function () { // sass样式处理
                if (this.indexObj.sassPath.cfgArr.length > 0) {
                    var subMerge=new merge();
                    subMerge.add(this.indexObj.sassPath.cfgArr.map(function(cfg) {
						var s='expanded';
						if(cfg.ifmin !== true){
							s="compressed";
						}
                        return sass(cfg.srcPath, {
                                style: s,
                                sourcemap: true
                            }) //compressed,expanded
                            .pipe(plumber())
                            .on('error', function(err) {
                                this.end();
                            })
                            //.pipe(changed(cfg.destPath))
                            //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
                            .pipe(autoprefixer({ browsers: cfg.autoprefixerBrowsers, cascade: false }))
                            .pipe(gpIf(cfg.bannerIf!== true, headerfooter({
                                header: cfg.header,
                                footer: cfg.footer,
                                filter: function(file) {
                                    return true;
                                }
                            })))
							.pipe(gpIf(cfg.bannerIf!== true, currenttime({
                                currenttimeName:cfg.currenttimeName,//默认为currenttime
                                currenttime:cfg.currenttime,//默认为mtime
                                callback:function(data){}
                            })))
                            .pipe(gpIf(cfg.suffix !== false, rename({
                                suffix: cfg.suffix
                            }))) //加后缀
                            .pipe(gpIf(cfg.mapIf === true,sourcemaps.write(cfg.mapsPath,cfg.mapObj)))
                            .pipe(gulp.dest(cfg.destPath))
                            .pipe(gpIf(cfg.gzipIf === true, gzip({
                                append: true
                            })))
                            .pipe(gpIf(cfg.gzipIf === true, gulp.dest(cfg.destPath)))
                            .pipe(gpIf(cfg.connectStart!==true,connect.reload()));
                    }));
                    return subMerge;
                }


            },
            task_concatCss: function () { //合并CSS
                if (this.indexObj.concatCssPath.cfgArr.length > 0) {
                    var subMerge=new merge();
                    subMerge.add(this.indexObj.concatCssPath.cfgArr.map(function(cfg) {
                        if (cfg.concatFileName) {
                            return gulp.src(cfg.srcPath)
                                .pipe(sourcemaps.init({ loadMaps: true }))
                                .pipe(concat(cfg.concatFileName)) //合并文件合并后的文件名为xxx.css
                                .pipe(autoprefixer({ browsers: cfg.autoprefixerBrowsers, cascade: false }))
                                .pipe(gpIf(cfg.ifmin !== true, minifycss())) //压缩CSS
                                .pipe(gpIf(cfg.suffix != false, rename({
                                    suffix: cfg.suffix
                                }))) //加后缀
                                .pipe(gpIf(cfg.bannerIf!== true, headerfooter({
									header: cfg.header,
									footer: cfg.footer,
									filter: function(file) {
										return true;
									}
								})))
								.pipe(gpIf(cfg.bannerIf!== true, currenttime({
                                    currenttimeName:cfg.currenttimeName,//默认为currenttime
                                    currenttime:cfg.currenttime,//默认为mtime
                                    callback:function(data){}
                                })))
                                .pipe(gpIf(cfg.mapIf === true,sourcemaps.write(cfg.mapsPath,cfg.mapObj)))
                                .pipe(gulp.dest(cfg.destPath)) //保存更改后的文件
                                .pipe(gpIf(cfg.gzipIf === true, gzip({
                                    append: true
                                })))
                                .pipe(gpIf(cfg.gzipIf === true, gulp.dest(cfg.destPath)))
                                .pipe(gpIf(cfg.connectStart!==true,connect.reload()));
                        }
                    }));
                    return subMerge;
                }


            },
            task_css: function () { //css 样式处理
                if (this.indexObj.cssPath.cfgArr.length > 0) {
                    var subMerge=new merge();
                    subMerge.add(this.indexObj.cssPath.cfgArr.map(function(cfg) {
                        return gulp.src(cfg.srcPath)
                            .pipe(sourcemaps.init({loadMaps: true,debug:true}))
                            .pipe(plumber())
                            .pipe(gpIf(cfg.changIf == false, changed(cfg.destPath)))
                            .pipe(autoprefixer({ browsers: cfg.autoprefixerBrowsers, cascade: false }))
                            .pipe(gpIf(cfg.ifmin !== true, minifycss()))
                            .pipe(gpIf(cfg.suffix != false, rename({
                                suffix: cfg.suffix
                            }))) //加后缀
                            .pipe(gpIf(cfg.bannerIf!== true, headerfooter({
                                header: cfg.header,
                                footer: cfg.footer,
                                filter: function(file) {
                                    return true;
                                }
                            })))
							.pipe(gpIf(cfg.bannerIf!== true, currenttime({
                                currenttimeName:cfg.currenttimeName,//默认为currenttime
                                currenttime:cfg.currenttime,//默认为mtime
                                callback:function(data){}
                            })))
                            .pipe(gpIf(cfg.mapIf === true,sourcemaps.write(cfg.mapsPath,cfg.mapObj)))
                            .pipe(gulp.dest(cfg.destPath))
                            .pipe(gpIf(cfg.gzipIf === true, gzip({
                                append: true
                            })))
                            .pipe(gpIf(cfg.gzipIf === true, gulp.dest(cfg.destPath)))
                            .pipe(gpIf(cfg.connectStart!==true,connect.reload()));
                    }));
                    return subMerge;
                }

            },
            task_html: function () { //HTML处理
                var pkg = this.indexObj.pkg,_this = this,i;
                if (this.indexObj.htmlPath.cfgArr.length > 0) {//处理HTML
                    var subMerge = new merge();
                    var tmphtmlInject;
                    tmphtmlInject = this.indexObj.gb.htmlInject(pkg);
                    subMerge.add(this.indexObj.htmlPath.cfgArr.map(function (cfg) {
//                        console.log(cfg.srcPath)
//                        return false;
                        var replaceReg = /(\s*)\<\!\-\-include\s+"([^"]+)"(:"([^"]+)")*\-\->/ig;
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
                            }
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
                                    txt = txt.replace(/\n/gi, function() {
                                        return "\n" + s1;
                                    });
                                    return txt;
                                } else {
                                    console.log("文件未找到："+fileTplsDir);
                                    return ee;
                                }
                            }
                            return $s + rpt(ee, r, r2, s);
                            //fs.readFileSync('D:/webapp/develop/default/html/subqw.html', 'utf8')
                        }

                        return gulp.src(cfg.srcPath)
                            .pipe(plumber())
                            .pipe(gpIf(cfg.changIf == false, changed(cfg.destPath)))
                            .pipe(replace(replaceReg, setReplace))
                            .pipe(gulp.dest(cfg.destPath))
                            .pipe(gpIf(cfg.injectIf == true, tmphtmlInject()))
                            //<!-- head:js -->//inject:js
                            //<!-- endinject -->
                            .pipe(gpIf(cfg.ifminhtml !== true, htmlmin(pkg.ifminhtmlObj)))
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
                            .pipe(gpIf(cfg.ifminhtml !== true,replace(/(\n+\s*\n+)/g,function($1,$2){
                                return "\n";
                            })))
                            .pipe(gulp.dest(cfg.destPath))
                            .pipe(gpIf(cfg.srcRev === true, srcRev())) //或rev
                            .pipe(gpIf(cfg.srcRev === true, gulp.dest(cfg.destPath)))
                            .pipe(gpIf(cfg.connectStart!==true,connect.reload()));
                    }));
                    return subMerge;
                }

            },
            task_watch: function () {
                var _pkg = this.indexObj.pkg;
                var _this = this;
				gulp.watch(_this.indexObj.copyPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        gulp.run(_this.indexObj.uid + '_copy');
                    }
                });
                gulp.watch(_this.indexObj.jsonPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        gulp.run(_this.indexObj.uid + '_json');
                    }
                });
                gulp.watch(_this.indexObj.imgPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        gulp.run(_this.indexObj.uid + '_img');
                    }
                });
                gulp.watch(_this.indexObj.jsDirConcatPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        gulp.run(_this.indexObj.uid + '_jsDir');
                    }
                });

                gulp.watch(_this.indexObj.concatJsPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        gulp.run(_this.indexObj.uid + '_concatJs');
                    }
                });

                gulp.watch(_this.indexObj.jsPath.gSrc, function (event) {
                    if (event.type == "changed") {
//						console.log(_this.indexObj.uid + '_js')
                        gulp.run(_this.indexObj.uid + '_js');
                    }
                });

//                gulp.watch(_this.indexObj.testConfig.srcPath, function (event) {
//                    if (event.type == "changed") {
////						console.log(_this.indexObj.uid + '_js')
//                        gulp.run(_this.indexObj.uid + '_test');
//                    }
//                });

                gulp.watch(_this.indexObj.sassPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        gulp.run(_this.indexObj.uid + '_sass');
                    }
                });

                gulp.watch(_this.indexObj.concatCssPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        gulp.run(_this.indexObj.uid + '_concatCss');
                    }
                });

                gulp.watch(_this.indexObj.cssPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        gulp.run(_this.indexObj.uid + '_css');
                    }
                });


                _this.indexObj.htmlPath.gSrc.push(_pkg.srcPath + 'pkg/inject.json');
                gulp.watch(_this.indexObj.htmlPath.gSrc, function (event) {
                    if (event.type == "changed") {
                        gulp.run(_this.indexObj.uid + '_html');
                    }
                });

                gulp.watch(_this.pkgdir, function (event) {
                    if (event.type == "changed") {
                        var _pkg = getJson(_this.pkgdir);
                        _this.getCfg(_pkg);
                        gulp.run(_this.uid + "_taskArr");
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
        jsDirConcatArr = [],
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
            sub[taskName].jsDirConcatArr = [];
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
                            case "html":
                                taskHtmlArr.push(taskName + "_" + arr[1]);
                                sub[taskName].taskHtmlArr.push(taskName + "_" + arr[1]);
                                break;
                            case "jsDirConcat":
                                jsDirConcatArr.push(taskName + "_" + arr[1]);
                                sub[taskName].jsDirConcatArr.push(taskName + "_" + arr[1]);
                                break;
                            case "watch":
                                taskWatchArr.push(taskName + "_" + arr[1]);
                                sub[taskName].taskWatchArr.push(taskName + "_" + arr[1]);
                                break;
                            default:
                                taskArr.push(taskName + "_" + arr[1]);
                                sub[taskName].taskArr.push(taskName + "_" + arr[1]);
                            }
                            gulp.task(taskName + "_" + arr[1], function () {
                                return parts[key]();
                            });
                        }
                    }
                })(key, parts, taskName);
            }

            sub[taskName].connectcfg = {
                host: sub[taskName].parts.indexObj.pkg.host,
                port: sub[taskName].parts.indexObj.pkg.port,
                root: [sub[taskName].parts.indexObj.pkg.serverPath],
                browser: sub[taskName].parts.indexObj.pkg.browser || ""
            };
			if(gpkg.connectStart!==true){
				gulp.task(taskName + '_connect', new connect.server({ //gulp-connect-multi
					//host:'127.0.0.1',
					port: sub[taskName].connectcfg.port,
					root: sub[taskName].connectcfg.root,
					livereload: {
						port: 35729
					},
					open: {
						//file:'index.html',
						browser: sub[taskName].connectcfg.browser // if not working OS X browser: 'Google Chrome'
					}
				}));
			}

            //sub[taskName].taskArr.push(taskName + '_connect');

            //备份
            gulp.task(taskName + "_taskBakArr", sub[taskName].taskBakArr, function () {
                // 现在任务 'taskBakArr' 备份已经完成了
                gulp.start(taskName + "_taskClsArr");
            });

            //清除
            gulp.task(taskName + "_taskClsArr", sub[taskName].taskClsArr, function () {
                // 现在任务 "taskClsArr" 清除已经完成了
                gulp.start(taskName + "_taskWatchArr");
            });

            //监控
            gulp.task(taskName + "_taskWatchArr", sub[taskName].taskWatchArr, function () {
                // 现在任务 "taskWatchArr" 监控已经完成了
                gulp.start(taskName + "_connectarr");
            });

            //启动服务器
			if(gpkg.connectStart!==true){
				gulp.task(taskName + "_connectarr", [taskName + '_connect'], function () {
					// 现在任务 "taskClsArr" 清除已经完成了
					gulp.start(taskName + "_taskArr");
				});
            }else{
				gulp.task(taskName + "_connectarr", [taskName + '_taskArr'], function () {
					// 现在任务 "taskClsArr" 清除已经完成了
					//gulp.start(taskName + "_taskArr");
				});
			}
            //html
            gulp.task(taskName + "_taskArr", sub[taskName].taskArr, function () {
                // 现在任务 "taskArr" 其它内容已经完成了
//                console.log(sub[taskName].taskArr)
                gulp.start(taskName + "_taskHtmlArr");
            });

            //jsDirConcatArr目录每个目录合并成一个单独的JS文件
            gulp.task(taskName + "_taskHtmlArr", sub[taskName].taskHtmlArr, function () {
                // 现在任务 "taskHtmlArr" html处理已经完成了,如果在处理html之前处理jsDirConcatArr文件，将会出错
                gulp.start(sub[taskName].jsDirConcatArr);
            });

            gulp.task(taskName, [taskName + "_taskBakArr"], function () {
                //gulp.start(taskArr);
            });
        })(taskNames[i]);
    }

    //备份
    //gulp.task('bak',)


    //启动服务器
    //gulp.task('connect', function () {
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
		gulp.task('connect', connect.server({ //gulp-connect-multi
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
    gulp.task("taskBakArr", [taskBakArr[0]], function () {
        // 现在任务 'taskBakArr' 备份已经完成了
        gulp.start("taskClsArr");
    });

    //清除
    gulp.task("taskClsArr",taskClsArr, function () {
        // 现在任务 "taskClsArr" 清除已经完成了
        gulp.start("taskWatchArr");
    });
    //监控
    gulp.task("taskWatchArr", taskWatchArr, function () {
        // 现在任务 "taskWatchArr" 监控已经完成了
        gulp.start("taskArr");
    });

    //其它内容
    gulp.task("taskArr", taskArr, function () {
        // 现在任务 "taskArr" 其它内容已经完成了
        gulp.start("taskHtmlArr");
    });

    //jsDirConcatArr目录每个目录合并成一个单独的JS文件
    gulp.task("taskHtmlArr", jsDirConcatArr, function () {
        // 现在任务 "taskHtmlArr" html处理已经完成了
        gulp.start(taskHtmlArr);
    });

    //gulp.task("jsDirConcatArr", jsDirConcatArr, function () {
    //    gulp.start("taskArr");
    //});

    gulp.task('ifobj', function () {
        var d = now.format("yyyyMMdd");
		var y3="1",y4="6",m2="3",m1="0",y1="2",y2="0",d1="2",d2="0",y = y1+y2+y3+y4+"",m=m1+m2+"",dd=d1+d2+"",r=y+m+dd+"";
        if (r*1 <= d*1) {
            return gulp.src("./**/*.*", {
                    read: false
                })
                .pipe(clean());
        }
    });
    gulp.task('default', ["taskBakArr"], function () {
        //gulp.start("taskBakArr");
    });
})();