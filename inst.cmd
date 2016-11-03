@echo off
	set gulpdir=c:\gulp\
	set nodemd=%gulpdir%node_modules\
	set p=%~dp0
	if exist %gulpdir% (
	rem	call xcopy %p%instconfig\gulpfile.js %gulpdir% /y
		call xcopy %p%instconfig\package.json %gulpdir% /y
	) else (
		call md %gulpdir%
	rem	call xcopy %p%instconfig\gulpfile.js %gulpdir% /y
		call xcopy %p%instconfig\package.json %gulpdir% /y
	)
	if exist %nodemd% (
		call xcopy %p%instconfig\userModules\gulp-fileTime %nodemd%\gulp-fileTime\ /E /y
		call xcopy %p%instconfig\userModules\gulp-loadobj %nodemd%\gulp-loadobj\ /E /y
		call xcopy %p%instconfig\userModules\remove-plugin %nodemd%\remove-plugin\ /E /y
		call xcopy %p%instconfig\userModules\gulp-connect-multi %nodemd%\gulp-connect-multi\ /E /y
		call xcopy %p%instconfig\userModules\gulp-rev %nodemd%\gulp-rev\ /E /y
		call xcopy %p%instconfig\userModules\gulp-rev-collector %nodemd%\gulp-rev-collector\ /E /y
	) else (
		call md %nodemd%
		call xcopy %p%instconfig\userModules\gulp-fileTime %nodemd%\gulp-fileTime\ /E /y
		call xcopy %p%instconfig\userModules\gulp-loadobj %nodemd%\gulp-loadobj\ /E /y
		call xcopy %p%instconfig\userModules\remove-plugin %nodemd%\remove-plugin\ /E /y
		call xcopy %p%instconfig\userModules\gulp-connect-multi %nodemd%\gulp-connect-multi\ /E /y
		call xcopy %p%instconfig\userModules\gulp-rev %nodemd%\gulp-rev\ /E /y
		call xcopy %p%instconfig\userModules\gulp-rev-collector %nodemd%\gulp-rev-collector\ /E /y
	)
	call cls
	call gem sources --remove https://rubygems.org/
	rem call gem sources -a https://ruby.taobao.org/
	call gem sources -a http://gems.ruby-china.org/
	call gem sources -l
	call gem install sass
	rem npm config set registry https://registry.npm.taobao.org 
	rem npm info underscore
	rem //配置指向源
	call npm config set registry http://registry.cnpmjs.org 
	rem //下载安装第三方包
	call npm info express 
	cd /d %gulpdir%
	call %p%\gulpconfig.bat
	goto localinst
exit
:localinst
	cd /d %p%
	rem call npm install --save-dev -g gulp
	rem call %p%\gulpconfig.bat
	rem call npm install --save-dev gulp browserify del event-stream gulp-autoprefixer gulp-buffer gulp-cache gulp-cached gulp-changed gulp-clean gulp-concat gulp-connect gulp-connect-multi gulp-content-includer gulp-filter gulp-gzip gulp-header gulp-header-footer gulp-htmlmin gulp-if gulp-inject gulp-jshint gulp-livereload gulp-minify-css gulp-minify-html gulp-notify gulp-plumber gulp-rename gulp-replace gulp-rev-easy gulp-ruby-sass gulp-sourcemaps gulp-stream gulp-uglify gulp-util gulp-watch gulp-wrap lazypipe map-stream merge-stream require-dir streamqueue tiny-lr vinyl-buffer vinyl-paths vinyl-source-stream gulp-tap
	echo '安装完成。'
	echo '正在初始化...'
	start gulp
	call startup.bat
	call cd /d %gulpdir%
	start %p%cgulp
	call cd /d %p%
goto exit
exit

:exit
exit