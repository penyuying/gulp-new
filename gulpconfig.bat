@echo off
	set p=%~dp0
	set localmod=%p%instconfig\userModules\
	call npm install --save-dev gulp
	call npm install -g gulp
	echo "主程序完成"
	call npm install --save-dev gulp gulp-autoprefixer gulp-changed gulp-clean gulp-concat gulp-util
	echo "第一组完成"
	call npm install --save-dev gulp-connect-multi gulp-gzip gulp-header-footer gulp-htmlmin gulp-if
	echo "第二组完成"
	call npm install --save-dev gulp-inject gulp-jshint map-stream gulp-minify-css gulp-plumber
	echo "第三组完成"
	call npm install --save-dev gulp-rename gulp-replace gulp-rev-easy gulp-ruby-sass gulp-sourcemaps
	echo "第四组完成"
	call npm install --save-dev gulp-uglify lazypipe map-stream merge-stream gulp-jsonlint
	echo "第五组完成"
	call npm install --save-dev streamqueue imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant
	echo "第六组图片处理工具完成"
	call npm install --save-dev gulp-ngdocs gulp-ngdocs
	echo "第七组生成文档工具完成"
	call npm install --save karma
	echo "第八组测试工具(karma)完成"
	call npm install --save-dev karma-jasmine karma-junit-reporter karma-commonjs karma-coverage karma-chrome-launcher karma-firefox-launcher karma-ie-launcher
	echo "第九组测试工具完成"
	call npm install --save-dev %localmod%gulp-fileTime %localmod%remove-plugin %localmod%gulp-loadobj %localmod%gulp-connect-multi %localmod%gulp-htmlmin  %localmod%gulp-rev   %localmod%gulp-rev-collector
	echo "第十组安装本地插件完成"
:exit