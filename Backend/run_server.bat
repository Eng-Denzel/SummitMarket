@echo off
REM Set PYTHONPATH to include the user site-packages where python-decouple is installed
set PYTHONPATH=C:\Users\hp\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\LocalCache\local-packages\Python313\site-packages

REM Diagnostic: Check Python version and pip location
echo ===== DIAGNOSTIC INFO =====
python --version
echo.
echo Python executable location:
where python
echo.
echo Pip location:
where pip
echo.
echo Checking installed packages:
python -m pip list | findstr /I "dj-rest-auth django-allauth"
echo.
echo Python site-packages location:
python -c "import site; print(site.getsitepackages())"
echo.
echo User site-packages location:
python -c "import site; print(site.getusersitepackages())"
echo ===========================
echo.

REM Run Django development server
python manage.py runserver
