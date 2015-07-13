python dir2bin.py
if not exist "dumps" mkdir dumps
move last_dump\*.sprx dumps
cd last_dump
del * /F /Q
pause