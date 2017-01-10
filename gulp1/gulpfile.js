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



var gulp=require("gulp");
var fs = require('fs'),
    cheerio = require('cheerio'),
    path = require('path'),
    ctpls=require("gulp-tpls"),
    josntpls=require("gulp-jsontpls"),
	encrypt=require("gulp-encrypt");
	jsencrypt=require("gulp-jsencrypt");




    //var $=tempObj.buildFile("E:/webapp/develop/practice/html/tpls/","C:/index1.html","../tplsTest.html");

gulp.task("html",function(){
    var src="C:/gulp1/jsonhtml/";
	gulp.src(src+'**/*.{ud,json}')
        .pipe(encrypt({
			"unType":"ud",
            "type":"ununicode,undes,ununicode",
            "extname":"jsn",
            "password":"niCaiCai"
        }))
        .pipe(gulp.dest("jsonhtml1/"));
});
    //console.log($.html());

gulp.task('default',["html"]);