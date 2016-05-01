@echo off
@for %%* in (.) do set CurrDirName=%%~nx*
@echo on

virtualenv _virtualenv
_virtualenv\scripts\pip3 install --upgrade selenium
_virtualenv\scripts\pip3 install django
_virtualenv\scripts\pip3 install gunicorn
_virtualenv\scripts\pip3 install psycopg2
_virtualenv\scripts\pip3 freeze > requirements.txt
_virtualenv\Scripts\django-admin startproject %CurrDirName% .
_virtualenv\Scripts\python manage.py startapp %1
_virtualenv\Scripts\activate