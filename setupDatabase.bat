@echo off
cd /d "%~dp0"
node setupDatabase.js
set TARGET_PATH=%~dp0Start.bat
set ICON_PATH=%~dp0Start.ico
set SHORTCUT_PATH=%USERPROFILE%\Desktop\Start.lnk

:: Створення ярлика через PowerShell
powershell -Command ^
    "$WshShell = New-Object -ComObject WScript.Shell; ^
     $Shortcut = $WshShell.CreateShortcut('%SHORTCUT_PATH%'); ^
     $Shortcut.TargetPath = '%TARGET_PATH%'; ^
     $Shortcut.IconLocation = '%ICON_PATH%'; ^
     $Shortcut.WorkingDirectory = '%~dp0'; ^
     $Shortcut.Save()"

echo Ярлик створено на робочому столі!