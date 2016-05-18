@echo off
	call npm install --save-dev gulp
	call npm install -g gulp
	echo "主程序完成"
	call npm install --save-dev gulp browserify del event-stream gulp-autoprefixer gulp-buffer gulp-cache
	echo "第一组完成"
	call npm install --save-dev gulp-cached gulp-changed gulp-clean gulp-concat gulp-connect gulp-connect-multi gulp-content-includer
	echo "第二组完成"
	call npm install --save-dev gulp-filter gulp-gzip gulp-header gulp-header-footer gulp-htmlmin gulp-if gulp-inject gulp-jshint
	echo "第三组完成"
	call npm install --save-dev map-stream gulp-livereload gulp-minify-css gulp-minify-html gulp-notify gulp-plumber gulp-rename
	echo "第四组完成"
	call npm install --save-dev gulp-replace gulp-rev-easy gulp-ruby-sass gulp-sourcemaps gulp-stream gulp-uglify gulp-util
	echo "第五组完成"
	call npm install --save-dev gulp-watch gulp-wrap lazypipe map-stream merge-stream require-dir streamqueue tiny-lr
	echo "第六组完成"
	call npm install --save-dev vinyl-buffer vinyl-paths vinyl-source-stream gulp-tap 
	echo "第七组完成"
	call npm install --save-dev gulp-jsonlint imagemin-webp imagemin-svgo
	echo "第八组完成"
	call npm install --save-dev imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant gulp-obfuscate
	echo "第九组完成"
	call npm install --save karma
	echo "第十组测试工具完成"
	call npm install --save-dev karma-jasmine karma-junit-reporter karma-commonjs karma-coverage karma-chrome-launcher karma-firefox-launcher karma-ie-launcher
	echo "第十一组测试工具完成"
:exit