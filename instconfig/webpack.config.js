var path = require('path');
var glob = require('glob');
var _merge = require('webpack-merge');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// var TplsWebpackPlugin = require('tpls-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
//var projectRoot = path.resolve(__dirname, '../')

// check env & config/index.js to decide whether to enable CSS source maps for the
// various preprocessor loaders added to vue-loader at the end of this file

// 别名配置
var getAlias = function() {
    return {
        // 特殊
        'jquery': path.resolve(__dirname, '../src/vendor/jquery2/jquery.js')
    };
};

/**
 * 获取插件
 *
 * @param {any} cfg 配置参数
 * @returns {Array}
 */
function getPlugins(cfg) { //webpackHtmlTpls//
    var res = [];

    // res.push(new webpack.SourceMapDevToolPlugin({
    //   // Match assets like for loaders. This is
    //   // convenient if you want to match against multiple
    //   // file types.
    //   test: test, // string | RegExp | Array,
    //   include: include, // string | RegExp | Array,

    //   // `exclude` matches file names, not package names!
    //   // exclude: string | RegExp | Array,

    //   // If filename is set, output to this file.
    //   // See `sourceMapFileName`.
    //   // filename: string,

    //   // This line is appended to the original asset processed.
    //   // For instance '[url]' would get replaced with an url
    //   // to the source map.
    //   // append: false | string,

    //   // See `devtoolModuleFilenameTemplate` for specifics.
    //   // moduleFilenameTemplate: string,
    //   // fallbackModuleFilenameTemplate: string,

    //   // If false, separate source maps aren't generated.
    //   module: separateSourceMaps,

    //   // If false, column mappings are ignored.
    //   columns: columnMappings,

    //   // Use plain line to line mappings for the matched modules.
    //   // lineToLine: bool | {test, include, exclude},

    //   // Remove source content from source maps. This is handy
    //   // especially if your source maps are big (over 10 MB)
    //   // as browsers can struggle with those.
    //   // See https://github.com/webpack/webpack/issues/2669.
    //   // noSources: bool,
    // }));

    // res.push(new TplsWebpackPlugin({
    //     'process.env': {
    //         // 'NODE_ENV': '"production"'
    //         'NODE_ENV': cfg.NODE_ENV
    //     },
    //     "adsfdasf":false
    // }));
    res.push(new webpack.DefinePlugin({
        'process.env': {
            // 'NODE_ENV': '"production"'
            'NODE_ENV': cfg.NODE_ENV
        }
    }));
    res.push(new ExtractTextPlugin('../css/build/[name][hash].css'));

    // {
    //     filename:  function (getPath){
    //         return getPath('../css/build/[name][hash].css').replace('../js/', '');
    //     },
    //     allChunks: true
    // }

    if (cfg.ifmin !== true) {
        res.push(new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true, //这里的soucemap 不能少，可以在线上生成soucemap文件，便于调试
            mangle: {
                except: ['$', 'jQuery']
            }
        }));
    }
    var fileList = [];
    if (cfg.webpackHtmlTpls) {
        if (cfg.webpackHtmlTpls instanceof Array && cfg.webpackHtmlTpls.length > 0) {
            cfg.webpackHtmlTpls.forEach(function(tplsCfg) {
                fileList = fileList.concat(tplsCfg.chunks || []);

                tplsCfg.template = path.join(absPath(tplsCfg.template));
                tplsCfg.minify = cfg.ifminhtml !== true ? cfg.ifminhtmlObj || false : false;
                res.push(new HtmlWebpackPlugin(tplsCfg));
            });
        } else {
            fileList = fileList.concat(cfg.webpackHtmlTpls.chunks || []);

            cfg.webpackHtmlTpls.minify = cfg.ifminhtml !== true ? cfg.ifminhtmlObj || false : false;
            res.push(new HtmlWebpackPlugin(cfg.webpackHtmlTpls));
        }
    }

    // res.push(new webpack.NoErrorsPlugin());弃用，使用NoEmitOnErrorsPlugin代替
    res.push(new webpack.NoEmitOnErrorsPlugin());
    clearFileList = fileList.map(function(item) {
        var config = cfg.webpackConfig;
        var output = config && config.output;
        var filename = (output.filename || '') + '';
        if (filename.indexOf('[hash]') > -1 || !filename) {
            return item + '????????????????????.*';
        } else {
            return item + '.*';
        }
    });
    res.push(new CleanWebpackPlugin(clearFileList, //匹配删除的文件
        {
            root: path.join(absPath(cfg.destPath)), //根目录
            verbose: false, //开启在控制台输出信息
            dry: false, //启用删除目录
            watch: true//监控文件变化
        }
    ));
    return res;
}

module.exports = function(opts, pkg) {
    var _srcPaths = splitSrcArr(opts.srcPath);
    var webpackConfig = opts.webpackConfig;
    var resolve = webpackConfig && webpackConfig.resolve;
    var alias = resolve && resolve.alias;
    var dirPrefix = (absPath(opts.destPath) + '').replace((new RegExp('(^|\\s)' + absPath(pkg.destPath), 'g')), '');
    // console.log('dirPrefix:', dirPrefix,absPath(opts.destPath),absPath(pkg.destPath));
    if (alias) {
        resolve.alias = aliasAbs(alias);
    }
    var _opts = _merge({
        entry: filterSrcPath(getSrcPaths(_srcPaths._check, dirPrefix), getSrcPaths(_srcPaths._notCheck, dirPrefix)),
        output: {
            path: path.join(absPath(pkg.destPath)),
            // publicPath: "../js"
            filename: '[name][hash].js'
        }
    }, (opts && opts.webpackConfig) || {});

    if (opts.mapIf) {
        _opts.devtool = '#source-map';
    }
    var res = {
        watch: true,
        profile: true,
        cache: false,
        // progress:true,
        // colors:true,
        entry: {
            //app: path.join(__dirname,"../src/wjs/main.js")
        },
        output: {
            //path: path.join(__dirname,"../dist/"),
            // filename: '[name][hash].js'
        },
        resolve: {
            alias: aliasAbs(getAlias())
        },
        module: {
            rules: [{
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: '/images/build/[name][hash].[ext]'
                        }
                    }
                ]
            }, {
                test: /\.(svg|woff|woff2|eot|ttf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: '/fonts/build/[name][hash].[ext]'
                        }
                    }
                ]
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {
                            sourceMap: opts.mapIf || false
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: opts.mapIf || false,
                            plugins: opts.postcss
                        }
                    }]
                })
            }, {
                test: /\.(scss|sass)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {
                            sourceMap: opts.mapIf || false
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: opts.mapIf || false,
                            plugins: opts.postcss
                        }
                    }, {
                        loader: 'sass-loader'
                    }]
                })
            }, {
                test: /\.html$/,
                use: [ {
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                }, {
                    loader: 'tpls-loader',
                    options: {
                        tplsPath: opts.tplsPath
                    }
                }]
            }, {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|lib)/,
                use: loaderPush([{
                    loader: 'babel-loader',
                    options: {
                        presets: [[require('babel-preset-env'), opts.babelEnvConfig], require('babel-preset-stage-0')]//, //按照最新的ES6语法规则去转换
                        //plugins:[require("babel-plugin-transform-runtime")]
                    }
                }], {
                    loader: 'eslint-loader',
                    options: {
                        formatter: require('eslint-friendly-formatter'),
                        include: [
                            path.join(absPath('../src/wjs'))
                        ]
                    }
                }, opts.isEslint)//,
                // include:path.resolve(__dirname, '../src/wjs/main.js')
            }]
        },
        // eslint: {
        //     formatter: require('eslint-friendly-formatter')
        // },
        plugins: getPlugins(opts)//[//
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
    return _merge(res, _opts);
};

/**
 * 按条件加入loader
 *
 * @param {Array} loaderList 放loader的列表
 * @param {any} loader 加入的loader
 * @param {Boolean} flag 是否加入
 * @returns {Array}
 */
function loaderPush(loaderList, loader, flag) {
    loaderList = loaderList || [];
    if (flag !== true) {
        loaderList.push(loader);
    }
    return loaderList;
}

/**
 * 拆分需要选和不选的路径
 *
 * @param {String|Array} arr 路径
 * @returns {Array} 返回拆分好后的数组
 */
function splitSrcArr(arr) {
    var arrObj = {
        _check: [],
        _notCheck: []
    };
    if (!arr) {
        return arrObj;
    }

    if (arr instanceof Array) {
        arr.forEach(function(dir) {
            if (dir) {
                if (isNotCheckDir(dir)) {
                    arrObj._notCheck.push(dir.replace(/^\s*\!/, ''));
                } else {
                    arrObj._check.push(dir);
                }
            }
        });
    } else {
        if (arr) {
            if (isNotCheckDir(arr)) {
                arrObj._notCheck.push(arr.replace(/^\s*\!/, ''));
            } else {
                arrObj._check.push(arr);
            }
        }
    }

    return arrObj;
}

/**
 * 判断是否不检查
 *
 * @param {any} dir 路径
 * @returns {Boolean}
 */
function isNotCheckDir(dir) {
    return (dir && /^\s*\!/.test(dir)) || false;
}

/**
 * 获取文件路径集
 *
 * @param {any} arr 数组
 * @param {String} prefix 路径前缀
 * @returns {Object}
 */
function getSrcPaths(arr, prefix) {
    var _entriesDir = {};
    if (arr instanceof Array) {
        arr.forEach(function(dir) {
            _entriesDir = getSrcPath(dir, _entriesDir, prefix);
        });
    } else if (typeof arr == 'string') {
        _entriesDir = getSrcPath(arr, _entriesDir, prefix);
    }
    return _entriesDir;
}

/**
 * 格式化正则表达式
 *
 * @param {String} regText 表达式文本
 * @returns {String} 返回格式化好后的文本
 */
function _formatRegText(regText) {
    if (!regText) {
        return regText;
    }
    return regText.replace(/[\-\[\]\{\}\(\)\*\+\?\.\^\$\|\/\\]/g, '\\$&');
}

/**
 * 获取文件路径
 *
 * @param {String} globPath 目录
 * @param {Object} entriesDir 已选中的路径
 * @param {String} prefix 路径前缀
 * @returns {Object} 返回查找到的路径
 */
function getSrcPath(globPath, entriesDir, prefix) {
    prefix = (prefix || '') + '';
    var files = glob.sync(globPath);
    var entries = entriesDir || {},
        _reDir = globPath.replace(/\/*\**\/*\*+\.*[js]*$/, ''),
        _regDir = _reDir && new RegExp('^\\s*' + _formatRegText(_reDir) + '\\/*'),
        entry,
        dirname,
        basename;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        basename = path.basename(entry, '.js');
        var _name = path.join(dirname, basename).replace(/\\/g, '/');

        if (_regDir) {
            _name = _name.replace(_regDir, '');
        }
        entries[prefix + _name] = path.join(absPath(entry));
    }

    return entries;
}

/**
 * 过滤文件路径
 *
 * @param {any} _checkObj 已选中的路径
 * @param {any} _notCheckObj 不选的路径
 * @returns {Object} 返回过滤完的路径
 */
function filterSrcPath(_checkObj, _notCheckObj) {
    if (!_checkObj || !_notCheckObj) {
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

/**
 * 相对路径转成绝对路径
 *
 * @param {String} dir 路径
 * @returns {String}
 */
function absPath(dir) {
    var res = dir;

    if (!dir) {
        return res;
    }
    if (!path.isAbsolute(dir)) { //相对路径转绝对路径
        res = path.normalize(path.join(process.cwd(), dir)).replace(/\\/g, '/');
    } else {
        res = path.normalize(dir).replace(/\\/g, '/');
    }
    return res;
}

/**
 * 转换别名的路径为绝对路径
 *
 * @param {Object} aliasParas 别名集
 * @returns {Object}
 */
function aliasAbs(aliasParas) {
    var res = {};
    aliasParas = aliasParas || {};
    for (var key in aliasParas) {
        if (aliasParas[key]) {
            res[key] = path.join(absPath(aliasParas[key]));
        }
    }
    return res;
}