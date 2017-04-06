var gutil = require('gulp-util'),//异常处理
    through = require('through2'),
    fs = require('fs'),//文件读写
    path = require('path'); //获取路径

//判断对象类型
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

//时间格式化
Date.prototype.format = function (fmt) { //author: meizz 格式化时间
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return fmt;
};
module.exports = function (options) {
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

        // 将文件内容转成字符串，并调用 preprocess 组件进行预处理
        // 然后将处理后的字符串，再转成Buffer形式
        //var content = pp.preprocess(, options || {});
//        console.log(file)
        var stat = file.stat;//fs.statSync(file.path);
        var tmpdateType = "atime";//创建时间
//        ctime, 很多朋友把它理解成create time，包括很多误导人的书籍也是这么写。实际上ctime是指change time。
//
//mtime, 就是modify time。（修改时间）
//
//mtime和ctime的区别在于，只有修改了文件的内容，才会更新文件的mtime，而对文件更名，修改文件的属主等操作，只会更新ctime。
//
//举例说明: 对文件进行mv操作，mtime不变，ctime更新；编辑文件内容，mtime和ctime同时修改。其他操作的影响，可以自己试验。但是我发现对文件执行touch操作，会同时修改mtime和ctime，所以具体修改哪个时间，还取决于不同命令自己的实现；
        var tempformat = "yyyy-MM-dd hh:mm:ss";
        if (options && typeof options.format != "undefined") {
            tempformat = options.format;
        }
        if (options && typeof options.timeType != "undefined") {
            if (typeof stat[options.timeType] != "undefined") {
                tmpdateType = options.timeType;
            }
        }
        var d = new Date();
        var timeList = [];
        if (stat) {
//            tempdate = stat;
            timeList.push(stat);
        } else {
            var fileArr=getSourceMapFile(file);
            timeList=getFileStat(fileArr);//,d = new Date()
            timeList=timeList||[];
            if(isData.isArray(timeList) && timeList.length<1){
                timeList=getFileStat(file.history);
            }
            timeList=timeList||[];
            if(!isData.isArray(timeList)||isData.isArray(timeList)&&timeList.length==0){
                timeList=[];
                timeList.push(d);
            }
        }
//        var reg=new RegExp("\{\$\#filetime\#\$\}","gi")
        if(typeof options.fileTimeName != "undefined"){
            options.fileTimeName=options.fileTimeName;
        }else{
            options.fileTimeName="filetime";
        }
        var reg = new RegExp("\{\\$\#"+options.fileTimeName+"+(\:+([^\#]+))*\#\\$\}", "gi");
        var maxTime=d;
        var minTime = d;
        var retdate = "";
        var content = file.contents.toString().replace(reg, function ($1,$2,$3) {
            var tempName=$3 && $3.toLowerCase();
            var tempgettime = 0, retMaxTime = 0, retMinTime = d.getTime();
            retdate = "";
            if (timeList && timeList.length > 0) {
                timeList.map(function(subtempdate) {
                    var subtime = "";
                    if (subtempdate && typeof subtempdate[tempName] != "undefined") {
                        subtime = subtempdate[tempName];
                    } else if (subtempdate && typeof subtempdate["mtime"] != "undefined") {
                        subtime = subtempdate["mtime"];
                    } else if (subtempdate && typeof subtempdate[tmpdateType] != "undefined") {
                        subtime = subtempdate[tmpdateType];
                    }
                    if (!subtime) {
                        subtime = d;
                    }
                    tempgettime = subtime.getTime();
                    if (tempgettime > retMaxTime) {
                        maxTime = subtime;
                    }
                    if (retMinTime > tempgettime) {
                        minTime = subtime;
                    }
//                    retdate = subtime.format(tempformat);
                });
            }
            retdate = maxTime.format(tempformat);
//            var tempdate = new Date();
            //            tempdate = tempdate.format("yyyy-MM-dd hh:mm:ss");
            return retdate;
        });
//        for (var f in file) {
//            console.log("----------------------------"+f+"-----------------------------------")
//            console.log(file[f])
//        }
//        console.log(file.sourceMap.sources)//sass内的一些文件
//        console.log(file.base)//目录
//        console.log(file.cwd)
//        console.log(maxTime);
        file.contents = new Buffer(content);
        // 下面这两句基本是标配啦，可以参考下 through2 的API
        this.push(file);
        cb();
        options.callback && options.callback(retdate, maxTime, minTime);
    });

    return ret;
};
function getSourceMapFile(file){
    /// <summary>
    /// 取得sourceMap里面的文件
    /// </summary>
    /// <param name="file" type="type">file对象</param>
    /// <returns type="Array">返回文件路径数组</returns>
    var ret=[];
    if(file && file.sourceMap && file.sourceMap.sources && typeof file.base !="undefined"){
        if(isData.isObject(file.sourceMap)&&isData.isArray(file.sourceMap.sources) && file.sourceMap.sources.length>0){
            var base="";
            if(file.base && isData.isString(file.base)){
                base=file.base;
            }
            file.sourceMap.sources.map(function(fileName){
                ret.push(base+fileName);
            });
        }
    }
    return ret;
}

function getFileStat(fileArr){
    /// <summary>
    /// 取得数组里面文件的stat
    /// </summary>
    /// <param name="fileArr" type="type">文件数组</param>
    /// <returns type="Array">返回stat数组</returns>
    //file.history
    var stat=false,tempdate="",timeList=[];
    if (fileArr && fileArr.length > 0) {
                fileArr.map(function (temppath) {
//                    var temppath = file.path;
                    temppath = path.normalize(temppath);//去除双斜杠(/)
                    if (temppath) {
                        var extname = "";
                        if (temppath && path.extname(temppath)) {
                            extname = path.extname(temppath);
                            extname = extname && extname.toLowerCase();
                        }
                        var folder_exists = fs.existsSync(temppath);
                        if(folder_exists){
                            try {
                                stat = fs.statSync(temppath);
                                if (stat) {
                                    tempdate = stat;
                                }
                            } catch (e) {}
                        }else{
                            if (extname) {

                                switch (extname) {
                                    case ".css":
                                        try {
                                            stat = fs.statSync(temppath.replace(/\.css$/ig, function ($1) { return ".scss"; }));
                                            if (stat) {tempdate = stat;} else {
                                                try {
                                                    stat = fs.statSync(temppath.replace(/\.css$/ig, function ($1) { return ".sass"; }));
                                                    if (stat) {tempdate = stat;}
                                                } catch (e) {}
                                            }
                                        } catch (e) {
                                            try {
                                                stat = fs.statSync(temppath.replace(/\.css$/ig, function ($1) { return ".sass"; }));
                                                if (stat) {tempdate = stat;}
                                            } catch (e) {}
                                        }
                                        break;
                                    case ".js":
                                        try {
                                            stat = fs.statSync(temppath);
                                            if (stat) {
                                                tempdate = stat;
                                            }
                                        } catch (e) {}
                                        break;
                                    default:
                                }
                            }
                        }
                        if (tempdate) {
                            timeList.push(tempdate);
                        }
                    }
                    
                });

            }
    return timeList;
}