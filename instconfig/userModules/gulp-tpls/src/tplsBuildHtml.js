    //#region 模板处理类
var cheerio = require('cheerio'),//HTML节点处理
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

    var TplsBuildHtml = (function () {
        /**
         * 模板生成
         * @class
         * @param {Object} options 参数集对象
         * @param {String} [options.includeTag="py-include"] 引入模板的标签名
         * @param {String} [options.repeatTag="py-repeat"] 直接循环的标签名
         * @param {String} [options.ifTag="py-if"] 判断的标签名
         * @param {String} [options.dataAttr="data"] 引入数据对象的属性(值为json则引用jsonsrc的JSON数据)
         * @param {String} [options.dataAttr="jsonsrc"] JSON数据路径
         */
        function tplsBuildHtml(options) {
            this.options = extend({
                includeTag: "py-include",//引入模板
                repeatTag: "py-repeat",//直接循环
                ifTag: "py-if",//判断
                dataAttr: "data",//数据对象
                jsonsrc: "jsonsrc"//JSON数据路径
            }, options);
        }

        tplsBuildHtml.prototype = {

            /**
             * 获取文件文本内容
             * @private
             * @param {String} src 需要读取文件的路径
             * @returns {string} 返回文件文本内容或空字符串
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
             * 获取模板内容
             * @private
             * @param {String} src 需要读取模板文件的路径
             * @returns {string}  返回文件文本内容或空字符串
             */
            _getHtmlTempContent: function (src) {
                if (!src) {
                    return "";
                }
                var _this = this,
                    content = _this._getFileText(src) || "";
                return content;
            },

            /**
            *获取JSON文件并返回对象
            *@private
            *@function getJson
            *@param {String} dir JSON文件路径
            *@retrun {Object} 返回对象
            */
            _getJson: function (dir) {//取JSON文件对象
                var _this = this,
                    _pkg = {};
                var data = _this._getFileText(dir);
                try {
                    _pkg = JSON.parse(data);
                } catch (e) {
                    console.log("\x1B[33m" + dir + "格式转换错误：\x1B[39m\x1B[31m" + e.message + "\x1B[39m");
                    _pkg = {};
                }
                return _pkg;
            },


            /**
             * 传入HTML文本获取DOM对象
             * @private
             * @param   {HTML} tempContent HTML文本
             * @returns {Node} 返回节点对象
             */
            _getDom: function (tempContent) {
                var $ = cheerio.load(tempContent, {
                    withDomLvl1: true,
                    normalizeWhitespace: false,//是否去除空格
                    xmlMode: false,
                    decodeEntities: false//是否把文本转成utf-8码
                });
                return $;
            },

            /**
             * 转换获取参数
             * @private
             * @param   {string}   key       循环中的key值
             * @param   {string}   $key      从HTML中取到的引用的key名
             * @param   {Object} obj       循环的value对象
             * @param   {string} _paramArr 从HTML取出的循环时候的表达式
             * @returns {string} 返回转换好的参数
             */
            _getParam: function (key, $key, obj, _paramArr) {
                $key = $key && $key.replace(/^\s*|\s*$/g, "");
                var res;
                try {
                    if (!_paramArr || _paramArr.length < 1) {
                        eval("res=obj && obj" + $key + ";");
                    } else {
                        eval("var " + _paramArr[0] + "=obj;");
                        if (!obj) {
                            eval("var " + _paramArr[0] + "=key;");
                        }
                    
                        if (_paramArr[1]) {
                            eval("var " + _paramArr[1] + "=key;");
                        }
                    
                        try {
                            eval("res=" + $key + ";");
                        } catch (e) {
                            //console.log("循环参数出错，错误信息：" + e.message);
                        }
                    }

                    if (res instanceof Object) {
                        res = JSON.stringify(res);
                        res = res.replace(/\"/g, "\'");
                    }
                }catch(e){}
                return res;
            },

            /**
             * 替换HTML中的数据
             * @private
             * @param   {string}   tpls      模板内容文本
             * @param   {string}   $key      从HTML中取到的引用的key名
             * @param   {Object} obj       循环的value对象
             * @param   {string} _paramArr 从HTML取出的循环时候的表达式
             * @returns {string}   返回替换好的HTML文本
             */
            _replace: function (tpls, key, obj, _paramArr) {
                var _this = this;
                if (!tpls) {
                    return "";
                }
                tpls = tpls.replace(/\{\$([^}]+)\$\}/ig, function ($1, $2) {
                    var _res = _this._getParam(key, $2, obj && obj[key] || "", _paramArr);
                    if (typeof _res === "undefined") {
                        _res = $1;
                    }
                    return _res;
                });
                return tpls + "\r\n";
            },


            /**
             * 获取JSON对象
             * @private
             * @param   {String} src  JSON文件路径
             * @param   {Object} _node 引用对象的节点对象
             * @returns {Object} 返回取到的对象
             */
            _getObj: function (src, _node) {
                var _this = this,
                    _options = _this.options,
                    _objTxt = _node.attr(_options.dataAttr),
                    _jsonsrc = _node.attr(_options.jsonsrc),
                    _obj = {};

                //console.log(_objTxt);
                try {
                    if (_objTxt) {
                        if (_objTxt.toLowerCase() == "json" && _jsonsrc) {
                            _obj = _this._getJson(src + _jsonsrc);
                        } else {
                            if (_objTxt) {
                                _obj = eval("(" + _objTxt + ")");
                            }

                        }
                    }
                } catch (e) {

                }
                return _obj;
            },

            /**
             * 获取for表达式的文本
             * @param {String} _repeatArr 循环表达式文本拆分的数组
             */
            _getForText: function (_repeatArr) {
                var _this = this,
                    _options = _this.options,
                    _objName = _options.dataAttr,
                    _forin = "",
                    _endParam = _repeatArr[_repeatArr.length - 1],
                    _repeatTxt = _repeatArr.join(" ");

                if (_endParam * 1 > 0) {//in后面是数字的时候
                    _forin = "for (var " + _repeatArr[0] + " = 0; " + _repeatArr[0] + " < _endParam * 1; " + _repeatArr[0] + "++) {\n" +
                        "tplsContent=tplsContent+_this._replace(_tpls," + _repeatArr[0] + ",'',_paramArr);\n" +
                    "};\n";
                } else {
                    _forin = "var " + _objName + "=_obj;for (var " + _repeatTxt + ") {\n" +
                            "tplsContent=tplsContent+_this._replace(_tpls," + _repeatArr[0] + "," + _objName + ",_paramArr);\n" +
                        "}\n";
                }
                return _forin
            },

            /**
             * 循环生成模板
             * @private
             * @param   {String} _tpls      模板HTML文本内容
             * @param   {Object} _obj       需要引用的对象
             * @param   {string}   _repeatTxt 循环的表达式文本
             * @returns {String} 返回处理好的模板
             */
            _repeat: function (_tpls, _obj, _repeatTxt) {
                if (!_tpls || !_obj || !_repeatTxt) {
                    return _tpls;
                }
                var _this = this,
                    _options = _this.options,
                    _objName = _options.dataAttr,
                    tplsContent = "",
                    _repeatArr = _repeatTxt.split(" "),
                    _paramArr = [];
                

                if (_repeatArr && _repeatArr[0]) {//设置循环的key和value
                    var _paramTempArr = _repeatArr[0].replace(/\(|\)/g, "").split(",");
                    if (_paramTempArr && _paramTempArr.length > 0) {
                        if (_paramTempArr.length == 1) {
                            _paramArr.push(_paramTempArr[0]);
                        } else {
                            _paramArr.push(_paramTempArr[1]);
                            _paramArr.push(_paramTempArr[0]);
                        }
                    }
                }

                _repeatArr[0] = _paramArr[0];
                var _endParam = _repeatArr[_repeatArr.length - 1];
                var _forin = _this._getForText(_repeatArr);
                
                eval(_forin + "");
                //console.log(tplsContent.split("\n"));
                tplsContent = _this._clearSpace(tplsContent);

                return tplsContent;
            },

            /**
             *给模板内容前加空格
             *@param {String} _tpls 模板内容
             *@param {Object} node 节点对象
             *@param {Number} flag 等于1时为引入的模板2为直接循环的模板
             * @returns {String} 返回添加好后的模板内容
             */
            _addSpace: function (_tpls, node, flag) {
                if (!_tpls || !node) {
                    return _tpls;
                }
                var space="";


                if (flag === 1) {//引入模板文件的格式
                    if (node.prev && node.prev.data) {
                        space = node.prev.data.replace(/\r+|\n+/g, "").replace(/\t/g, "    ");
                        var _tplsArr = _tpls && _tpls.split("\n") || "";
                        if (_tplsArr) {
                            _tplsArr = _tplsArr.map(function (value, key) {
                                if (key == 0) {
                                    return value;
                                } else {
                                    if (value && value.replace(/\s*/g, "")) {
                                        return space + value;
                                    } else {
                                        return value;
                                    }

                                }
                            })
                            _tpls = _tplsArr.join("\n");
                        }
                    }
                } else if (flag == 2) {//直接循环的模板的格式
                    if (node.prev && node.prev.data) {
                        space = node.prev.data.replace(/\r+|\n+/g, "").replace(/\t/g, "    ");//获取当前节点前面的空格
                        var _tplsArr = _tpls && _tpls.split("\n") || "";

                        if (_tplsArr && space) {
                            if (_tplsArr[0]) {
                                _tplsArr[0] = _tplsArr[0].replace(/\t/g, "    ").replace(space, "");
                            }
                            _tpls = _tplsArr.join("\n");
                        }
                    }
                }
                return _tpls;
            },

            /**
             * 清除模板前后空格和空行
             * @private
             * @param   {string}   _tpls 模板内容
             * @returns {String} 返回清除后的模板内容
             */
            _clearSpace: function (_tpls) {
                if (!_tpls) {
                    return _tpls;
                }
                var tempArr = _tpls.split("\n");

                if (tempArr && tempArr.length > 1) {
                    var _temptxt = tempArr[tempArr.length - 1].replace(/\s*/g, "");
                    if (!tempArr[tempArr.length - 1] || !_temptxt) {
                        tempArr.splice(tempArr.length - 1, 1);
                        if (tempArr[tempArr.length - 1]) {
                            tempArr[tempArr.length - 1] = tempArr[tempArr.length - 1].replace(/\r$/, "");
                        }
                    }


                    if (!tempArr[0] || !tempArr[0].replace(/\s*/g, "")) {
                        tempArr.splice(0, 1);
                    }
                    if (tempArr.length > 0) {
                        _tpls = tempArr.join("\n");
                    }
                }
                return _tpls;
            },

            /**
             * 引入文件模板
             * @private
             * @param   {String} src 模板和JSON存放的路径不含文件名
             * @param   {Node} $   Dom节点对象
             * @returns {Node} 返回改好的Dom节点对象
             */
            _includeTpls: function (src, $) {
                if (!src || !$) {
                    return $;
                }
                var _this = this,
                    _options = _this.options,
                    nodeList = [];

                if ($ instanceof Function) {
                    nodeList = $(_options.includeTag);
                } else if ($.find instanceof Function) {
                    nodeList = $.find(_options.includeTag);
                }

                if (nodeList && nodeList.length > 0) {
                    nodeList.map(function (key, value) {
                        var _node;
                        if ($ instanceof Function) {
                            _node = $(value);
                        } else if ($.find instanceof Function) {
                            _node = $.find(value);
                        }
                        if (!_node) {
                            return value;
                        }

                        var _src = _node.attr("src"),
                            _repeatTxt = _node.attr("repeat"),
                            _obj = _this._getObj(src, _node),
                            _tpls = _this._getHtmlTempContent(src + _src),
                            _dom;

                        
                        if (!_tpls) {
                            return value;
                        }
                        _tpls = _this._clearSpace(_tpls);//清除前后空格

                        _tpls = _this._repeat(_tpls, _obj, _repeatTxt);

                        _tpls = _this._addSpace(_tpls, value, 1);

                        _dom = _this._getDom(_tpls);

                        if (_dom(_options.includeTag).length > 0) {
                            _dom = _this._includeTpls(src, _dom);
                        }

                        _dom = _this._repeatTpls(src, _dom);
                        
                        _dom = _this._ifNode(_dom);
                        
                        $(value).replaceWith(_dom.html());

                    });
                    
                }
                
                return $;
            },

            /**
             * 直接引入HTML中的模板
             * @private
             * @param   {String} src 模板和JSON存放的路径不含文件名
             * @param   {Node} $   Dom节点对象
             * @returns {Node} 返回改好的Dom节点对象
             */
            _repeatTpls: function (src, $) {
                if (!src || !$) {
                    return $;
                }
                var _this = this,
                    _options = _this.options,
                    _repeatNode = [];

                if ($ instanceof Function) {
                    _repeatNode = $(_options.repeatTag);
                } else if ($.find instanceof Function) {
                    _repeatNode = $.find(_options.repeatTag);
                }

                if (_repeatNode && _repeatNode.length>0) {
                    _repeatNode.each(function (key, value) {
                        var _node;
                        if ($ instanceof Function) {
                            _node = $(value);
                        } else if ($.find instanceof Function) {
                            _node = $.find(value);
                        }
                        if (!_node) {
                            return value;
                        }

                        var _repeatTxt = _node.attr("repeat"),
                            _obj = _this._getObj(src, _node),
                            _tpls = _node.html(),
                            _dom;
                        if (!_tpls) {
                            return value;
                        }
                        _tpls = _this._clearSpace(_tpls);//清除前后空格

                        _tpls = _this._repeat(_tpls, _obj, _repeatTxt);

                        _tpls = _this._addSpace(_tpls, value, 2);

                        _tpls = _this._clearSpace(_tpls);//清除前后空格

                        _dom = _this._getDom(_tpls);
                        
                        _dom = _this._includeTpls(src, _dom);
                        
                        _dom = _this._repeatTpls(src, _dom);
                        
                        _dom = _this._ifNode(_dom);
                        $(value).replaceWith(_dom.html());

                    });
                    
                }
                return $;
            },

            /**
             * if表达式节点
             * @private
             * @param   {Node} $   Dom节点对象
             * @returns {Node} 返回改好的Dom节点对象
             */
            _ifNode: function ($) {
                if (!$) {
                    return $;
                }
                var _this = this,
                    _options = _this.options,
                    _ifTagList = [];
                if ($ instanceof Function) {
                    _ifTagList = $(_options.ifTag);
                } else if ($.find instanceof Function) {
                    _ifTagList = $.find(_options.ifTag);
                }
                if (_ifTagList && _ifTagList.length > 0) {
                    _ifTagList.map(function (key, value) {
                        var _node;
                        if ($ instanceof Function) {
                            _node = $(value);
                        } else if ($.find instanceof Function) {
                            _node = $.find(value);
                        }
                        if (!_node) {
                            return value;
                        }
                        var _ifdata = false,
                            _ifTxt = _node.attr("data"),
                            _tpls = _node.html(),
                            _dom;

                        try {
                            eval("_ifdata=" + _ifTxt);
                        } catch (e) {

                        };
                        _tpls = _this._clearSpace(_tpls);//清除前后空格
                        if (_tpls && _ifdata) {
                            _tpls = _this._addSpace(_tpls, value, 2);
                        } else {
                            _tpls = "";
                        }
                        if (_tpls) {
                            _dom = _this._getDom(_tpls);
                            _dom = _this._ifNode(_dom);
                            _node.replaceWith(_this._clearSpace(_dom.html()));
                        } else {
                            _node.remove();
                            return "";
                        }
                    });
                }

                return $;
            },

            /**
             * 写入文件
             * @private
             * @param {String} dest 文件存放目录
             * @param {String} html 写放的文件内容
             */
            _writeFile: function (dest, html) {
                if (!dest) {
                    return;
                }
                try {
                    fs.writeFile(dest, html);
                    return true;
                } catch (e) {
                }

            },

            /**
             * 根据模板HTML生成HTML
             * @param   {String} src      模板文件所在目录
             * @param   {String} html html文本
             * @returns {String} 返回模板的HTML内容
             */
            buildHtml: function (src, html) {
                var _this = this,
                    _tpls = _this._clearSpace(html);
                
                var _domObj = _this._getDom(_tpls);
                _domObj = _this._repeatTpls(src, _domObj);
                _domObj = _this._includeTpls(src, _domObj);
                _domObj = _this._repeatTpls(src, _domObj);
                _domObj = _this._includeTpls(src, _domObj);

                _domObj = _this._ifNode(_domObj);

                return _domObj.html() || "";
            },

            /**
             * 根据模板生成HTML
             * @param   {String} src      模板文件所在目录
             * @param   {String} fileName 模板名称
             * @returns {String} 返回模板的HTML内容
             */
            buildTpls: function (src, fileName) {
                var _this = this,
                    _tpls = _this._getHtmlTempContent(src + fileName);

                return _this.buildHtml(src, _tpls) || "";
            },

            /**
             * 根据模板文件生成HTML文件
             * @param   {String} src      模板文件所在目录
             * @param {String} dest 文件存放目录
             * @param   {String} fileName 模板名称
             * @returns {String} 返回模板的HTML内容
             */
            buildFile: function (src, dest, fileName) {
                var _this = this,
                    _htmlTxt = _this.buildTpls(src, fileName);
                
                _this._writeFile(dest, _htmlTxt || "");
                return _htmlTxt;
            }
        };

        return tplsBuildHtml;
    })();
    //#endregion

module.exports = new TplsBuildHtml();