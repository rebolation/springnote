cls
cd _deploy_tools
fab deploy:host=reboministrator@192.168.0.13,siteurl=rebosvr.iptime.org,virtualenvdir=_virtualenv,staticdir=_static,deploytoolsdir=_deploy_tools
cd..
pause