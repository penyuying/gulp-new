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
    rem gulp-minify-css���ã�{compatibility: 'ie7',keepSpecialComments: '*'}��
    rem gulp-clean-css���ã�{compatibility: 'ie8',keepSpecialComments: '*'}��
	call npm install --save-dev gulp-inject gulp-jshint map-stream gulp-minify-css gulp-clean-css gulp-plumber
	echo "���������"
	call npm install --save-dev gulp-rename gulp-replace gulp-rev-easy gulp-ruby-sass gulp-compass gulp-sourcemaps
	echo "���������"
	call npm install --save-dev gulp-uglify lazypipe map-stream merge-stream gulp-jsonlint
	echo "���������"
	call npm install --save-dev streamqueue imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant
	echo "������ͼƬ���������"
	call npm install --save-dev gulp-jsdoc3 gulp-ngdocs
	echo "�����������ĵ��������"
	call npm install --save karma
	echo "�ڰ�����Թ���(karma)���"
	call npm install --save-dev karma-jasmine karma-junit-reporter karma-commonjs karma-coverage karma-chrome-launcher karma-firefox-launcher karma-ie-launcher
	echo "�ھ�����Թ������"
	call npm install --save-dev %localmod%gulp-fileTime %localmod%remove-plugin %localmod%gulp-loadobj %localmod%gulp-connect-multi %localmod%gulp-htmlmin  %localmod%gulp-rev   %localmod%gulp-rev-collector
	rem call npm install --save-dev /mnt/userModules/gulp-fileTime /mnt/userModules/remove-plugin /mnt/userModules/gulp-loadobj /mnt/userModules/gulp-connect-multi /mnt/userModules/gulp-htmlmin  /mnt/userModules/gulp-rev   /mnt/userModules/gulp-rev-collector
	echo "��ʮ�鰲װ���ز�����"
:exit