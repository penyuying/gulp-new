@echo off
	set p=%~dp0
	set localmod=%p%instconfig\userModules\
	call npm install --save-dev gulp
	call npm install -g gulp
	echo "���������"
	call npm install --save-dev gulp gulp-autoprefixer gulp-changed gulp-clean gulp-concat gulp-util
	echo "��һ�����"
	call npm install --save-dev gulp-connect-multi gulp-gzip gulp-header-footer gulp-htmlmin gulp-if
	echo "�ڶ������"
	call npm install --save-dev gulp-inject gulp-jshint map-stream gulp-minify-css gulp-plumber
	echo "���������"
	call npm install --save-dev gulp-rename gulp-replace gulp-rev-easy gulp-ruby-sass gulp-sourcemaps
	echo "���������"
	call npm install --save-dev gulp-uglify lazypipe map-stream merge-stream gulp-jsonlint
	echo "���������"
	call npm install --save-dev streamqueue imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant
	echo "������ͼƬ���������"
	call npm install --save-dev gulp-ngdocs gulp-ngdocs
	echo "�����������ĵ��������"
	call npm install --save karma
	echo "�ڰ�����Թ���(karma)���"
	call npm install --save-dev karma-jasmine karma-junit-reporter karma-commonjs karma-coverage karma-chrome-launcher karma-firefox-launcher karma-ie-launcher
	echo "�ھ�����Թ������"
	call npm install --save-dev %localmod%gulp-fileTime %localmod%remove-plugin %localmod%gulp-loadobj %localmod%gulp-connect-multi %localmod%gulp-htmlmin  %localmod%gulp-rev   %localmod%gulp-rev-collector
	echo "��ʮ�鰲װ���ز�����"
:exit