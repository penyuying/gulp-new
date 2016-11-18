@echo off
set gulpdir=c:\gulp\
set p=%~dp0
@echo off
set gulpdir=c:\gulp\
set p=%~dp0

if exist %gulpdir%gulpfile.js (
	call xcopy %p%instconfig\package.json %gulpdir% /y
	call xcopy %p%instconfig\webAppConfig.json %gulpdir% /y
	goto ST
	
) else (
	call xcopy %p%instconfig\package.json %gulpdir% /y
	call xcopy %p%instconfig\webAppConfig.json %gulpdir% /y
	goto IT
)

goto exit1
:IT
call inst.cmd
goto :exit1
exit

:ST
call cd /d %p%
start gulp
REM call startup.bat
call cd /d %gulpdir%
start %p%cgulp
call cd /d %p%
rem call gulp
exit
:exit1
exit