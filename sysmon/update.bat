FOR /F "delims=" %%i IN ('wmic service SplunkForwarder get Pathname ^| findstr /m service') DO set SPLUNKDPATH=%%i
set SPLUNKPATH=%SPLUNKDPATH:~1,-28%
>> C:\Windows\sysmon.log (
fc C:\Windows\sysmonconfig.xml "%SPLUNKPATH%\etc\apps\TA-Sysmon-deploy\bin\sysmonconfig.xml" | Find "no differences" 1>nul && echo %DATE%-%TIME% No updates found && exit
echo %DATE%-%TIME% Update found, installing && copy /z /y "%SPLUNKPATH%\etc\apps\TA-Sysmon-deploy\bin\sysmonconfig.xml" "C:\Windows\" && "C:\Windows\Sysmon.exe" -c C:\Windows\sysmonconfig.xml
)
