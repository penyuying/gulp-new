var path = require('path');
var glob = require('glob');
var _merge = require('webpack-merge');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
//var projectRoot = path.resolve(__dirname, '../')

    // check env & config/index.js to decide whether to enable CSS source maps for the
    // various preprocessor loaders added to vue-loader at the end of this file

// 别名配置
var getAlias = function() {
    return {
        "src":path.join(absPath('../src')),
        "lib":path.join(absPath('../lib')),
        "wjs":path.join(absPath('../src/wjs')),
        // 特殊
        'jquery': path.resolve(__dirname, '../src/vendor/jquery2/jquery.js'),

        // 正常第三方库
        'mui': path.join(absPath('../src/js/mui.js'))//path.resolve(__dirname, '../src/vendor/jquery2/jquery.js'),
    };
};



function getPlugins(cfg){//webpackHtmlTpls//
    var res=[];


    res.push(new webpack.DefinePlugin({
        'process.env': {
            // 'NODE_ENV': '"production"'
            'NODE_ENV': '"development"'
        }
    }));

    if(cfg.ifmin!==true){
        res.push(new webpack.optimize.UglifyJsPlugin({
           compress: {
               warnings: false
           },
           sourceMap: true,//这里的soucemap 不能少，可以在线上生成soucemap文件，便于调试
           mangle: {
               except: ['$', 'jQuery']
           }
        }));
    }

    if(cfg.webpackHtmlTpls){
        if(cfg.webpackHtmlTpls instanceof Array && cfg.webpackHtmlTpls.length>0){
            cfg.webpackHtmlTpls.forEach(function(tplsCfg){
                tplsCfg.template=path.join(absPath(tplsCfg.template));
                tplsCfg.minify=cfg.ifminhtml!==true ? cfg.ifminhtmlObj||false:false;
                res.push(new HtmlWebpackPlugin(tplsCfg));
            });
        }else{
            res.push(new HtmlWebpackPlugin(cfg.webpackHtmlTpls));
        }
    }

    res.push(new webpack.NoErrorsPlugin());
    return res;
}

module.exports = function(opts){
    var _srcPaths=splitSrcArr(opts.srcPath);

    var _opts={
        entry:filterSrcPath(getSrcPaths(_srcPaths._check),getSrcPaths(_srcPaths._notCheck)),
        output: {
            path: path.join(absPath(opts.destPath)),
            publicPath: "../js"
        }
    };
    var res={
        watch: true,
        profile: true,
        cache: false,
        entry: {
            //app: path.join(__dirname,"../src/wjs/main.js")
        },
        output: {
            //path: path.join(__dirname,"../dist/"),
            filename: '[name][hash].js'
        },
        resolve: {
            alias: getAlias()
        },
        module: {
            rules:[{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [[require("babel-preset-env"),opts.babelEnvConfig],require("babel-preset-stage-0")]//, //按照最新的ES6语法规则去转换
                        //plugins:[require("babel-plugin-transform-runtime")]
                    }
                }//,
                // include:path.resolve(__dirname, '../src/wjs/main.js')
            }]
        },
        plugins:getPlugins(opts)//[//
            // new webpack.DefinePlugin({
            //     'process.env': {
            //         // 'NODE_ENV': '"production"'
            //         'NODE_ENV': '"development"'
            //     }
            // })//,
            // new webpack.NoErrorsPlugin()
            //new webpack.optimize.UglifyJsPlugin({
            //    compress: {
            //        warnings: false
             //   },
            //    sourceMap: true,//这里的soucemap 不能少，可以在线上生成soucemap文件，便于调试
            //    mangle: {
            //        except: ['$', 'jQuery']
             //   }
            //}),
            
        //]
    };
    
    return _merge(res,_opts);
}




/**
 * 拆分需要选和不选的路径
 * 
 * @param {String|Array} arr 路径
 * @returns 返回拆分好后的数组
 */
function splitSrcArr(arr){
    var arrObj={
        _check:[],
        _notCheck:[]
    };
    if(!arr){
        return arrObj;
    }

    if(arr instanceof Array){
        arr.forEach(function(dir){
            if(dir){
                if(isNotCheckDir(dir)){
                    arrObj._notCheck.push(dir.replace(/^\s*\!/,""));
                }else{
                    arrObj._check.push(dir);
                }
            }
        });
    }else{
        if(arr){
            if(isNotCheckDir(arr)){
                arrObj._notCheck.push(arr.replace(/^\s*\!/,""));
            }else{
                arrObj._check.push(arr);
            }
        }
    }

    return arrObj;
}

function isNotCheckDir(dir){//判断是否不检查
    return dir && /^\s*\!/.test(dir)||false;
}

function getSrcPaths(Arr){//获取文件路径集
    var _entriesDir={};
    if(Arr instanceof Array){
        Arr.forEach(function(dir){
            _entriesDir=getSrcPath(dir,_entriesDir);
        });
    }else if(typeof arr=="string"){
        _entriesDir=getSrcPath(Arr,_entriesDir);
    }
    return _entriesDir;
}

/**
 * 格式化正则表达式
 * 
 * @param {String} regText 表达式文本
 * @returns 返回格式化好后的文本
 */
function _formatRegText(regText) {
    if (!regText) {
        return regText;
    }
    return regText.replace(/[\-\[\]\{\}\(\)\*\+\?\.\^\$\|\/\\]/g, "\\$&");
}

/**
 * 获取文件路径
 * 
 * @param {String} globPath 目录
 * @param {Object} entriesDir 已选中的路径
 * @returns 返回查找到的路径
 */
function getSrcPath(globPath,entriesDir) {
    var files = glob.sync(globPath);
    var entries =entriesDir || {},
        _reDir=globPath.replace(/\/*\**\/*\*+\.*[js]*$/,""),
        _regDir=_reDir && new RegExp("^\s*"+_formatRegText(_reDir)+"\/*"),
        entry,
        dirname,
        basename;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        basename = path.basename(entry, '.js');
        var _name=path.join(dirname, basename).replace(/\\/g, "/");

        if(_regDir){
            _name=_name.replace(_regDir,"");
        }
        entries[_name] =path.join(absPath(entry));
    }

    return entries;
}

/**
 * 过滤文件路径
 * 
 * @param {any} _checkObj 已选中的路径
 * @param {any} _notCheckObj 不选的路径
 * @returns 返回过滤完的路径
 */
function filterSrcPath(_checkObj,_notCheckObj){
    if(!_checkObj || !_notCheckObj){
        return _checkObj;
    }
    for (var key in _notCheckObj) {
        // console.log(key);
        if (_checkObj[key]) {
            delete _checkObj[key];
        }
    }

    return _checkObj;
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