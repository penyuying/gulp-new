var fs = require('fs'),//文件读写
    tplsBuild=require("./tplsBuildHtml.js"),//处理HTML的工具对象
    path = require('path'); //获取路径
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
            console.log("\x1B[33m" + dir + "格式转换错误：\x1B[39m\x1B[31m" + e.message + "\x1B[39m");
            _pkg = {};
        }
    }
    return _pkg;
}

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
                
                if (otmp instanceof Object) {
                    otmp = JSON.stringify(otmp);
                    otmp = otmp.replace(/\"/g, "\'");
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
                            console.log("\x1B[33m引用" + (fileTplsDir) + "内容JSON对象格式转换错误：\x1B[39m\x1B[31m" + e.message + "\x1B[39m");
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

                fortxt=tplsBuild.buildHtml(cfg.tplsPath, fortxt);
                
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
                console.log("\x1B[33m模板文件未找到：" + fileTplsDir + "\x1B[39m");
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

module.exports = htmlReplace;

//var replaceReg = /(\s*)<\!\-\-include\s+"([^"]+)"(:"([^"]+)")*\-\->/ig;
//PY.gulpreplace(replaceReg, function (ee, $s, r, r1, r2) { return htmlReplace(cfg, replaceReg, ee, $s, r, r1, r2); })