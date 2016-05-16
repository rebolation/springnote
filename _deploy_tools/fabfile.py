from fabric.contrib.files import append, exists, sed
from fabric.api import env, local, run, sudo, get, put
import random
import os, sys, time

def upload():
	USER_NAME = env.user
	put('D:\\Git\\upload\\*.*', '/home/%s' % (USER_NAME,))

def dbsync():
	PROJECT_NAME = os.path.basename(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
	
	run('pg_dump -U '+PROJECT_NAME+' '+PROJECT_NAME+' > '+PROJECT_NAME+'.sql')
	get(''+PROJECT_NAME+'.sql', 'D:\\')
	time.sleep(2)
	local('D:\\DevTools\\PostgreSQL9.5\\bin\\dropdb --if-exists -U '+PROJECT_NAME+' '+PROJECT_NAME)
	local('D:\\DevTools\\PostgreSQL9.5\\bin\\createdb -U postgres -O '+PROJECT_NAME+' '+PROJECT_NAME)
	time.sleep(1)
	local('D:\\DevTools\\PostgreSQL9.5\\bin\\psql -U '+PROJECT_NAME+' '+PROJECT_NAME+' < D:\\'+PROJECT_NAME+'.sql')
	time.sleep(2)
	local('del D:\\'+PROJECT_NAME+'.sql')

def deploy(siteurl='', virtualenvdir='', staticdir='', deploytoolsdir='', fetchonly=False):
	global PROJECT_NAME			# superlists
	global USER_NAME			# rebo
	global REPO_URL				# https://github.com/rebolation/superlists.git
	global SITE_URL				# rebosvr.iptime.org
	global SOURCE_FOLDER		# /home/rebo/sites/rebosvr.iptime.org
	global VIRTUALENV_FOLDER	# /home/rebo/sites/rebosvr.iptime.org/_virtualenv
	global STATIC_FOLDER		# /home/rebo/sites/rebosvr.iptime.org/_static
	global DEPLOY_TOOLS_FOLDER	# /home/rebo/sites/rebosvr.iptime.org/_virtualenv
	global FETCH_ONLY
	PROJECT_NAME = os.path.basename(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
	USER_NAME = env.user
	REPO_URL = 'https://github.com/rebolation/%s.git' % PROJECT_NAME
	if env.host.startswith('192.168.0.'):
		SITE_URL = siteurl
	else:
		SITE_URL = env.host
	SOURCE_FOLDER = '/home/%s/sites/%s' % (USER_NAME, SITE_URL)
	VIRTUALENV_FOLDER = SOURCE_FOLDER + '/' + virtualenvdir
	STATIC_FOLDER = SOURCE_FOLDER + '/' + staticdir
	DEPLOY_TOOLS_FOLDER = SOURCE_FOLDER + '/' + deploytoolsdir
	FETCH_ONLY = fetchonly

	_apt_get_check()								# git, pip3, virtualenv, nginx, postgresql-9.5, pgadmin3, libpq installation
	_create_directory_structure_if_necessary()		# creating folders
	_get_latest_source()							# copying source files
	_update_settingspy()							# modifying django settings : DEBUG OFF, SECRET_KEY
	_update_virtualenv()							# (virtualenv) pip install
	_update_static_files()							# collectstatic
	_setup_postgres_if_necessary()					# setup postgres
	_update_database()								# migrate
	_update_gunicorn()								# gunicorn reload
	_update_nginx()									# nginx reload

def _apt_get_check():
	if FETCH_ONLY:
		return

	sudo('apt-get install -y git')
	sudo('apt-get install -y python3-pip')
	sudo('apt-get install -y virtualenv')
	sudo('apt-get install -y nginx')
	sudo('apt-get install -y postgresql-9.5 pgadmin3')
	sudo('apt-get install -y libpq-dev')

def _create_directory_structure_if_necessary():
	if FETCH_ONLY:
		return

	run('mkdir -p %s' % (SOURCE_FOLDER))

def _get_latest_source():
	if exists(SOURCE_FOLDER + '/.git'):
		run('cd %s && git fetch' % (SOURCE_FOLDER,))
	else:
		run('git clone %s %s' % (REPO_URL, SOURCE_FOLDER))
	current_commit = local('git log -n 1 --format=%H', capture=True)
	run('cd %s && git reset --hard %s' % (SOURCE_FOLDER, current_commit))

def _update_settingspy():
	if FETCH_ONLY:
		return

	settings_path = SOURCE_FOLDER + '/' + PROJECT_NAME + '/settings.py'
	sed(settings_path, "DEBUG[[:blank:]]*=[[:blank:]]*True", "DEBUG = False")
	sed(settings_path, "SECRET_KEY[[:blank:]]*=.+$", "")
	sed(settings_path,
		'ALLOWED_HOSTS =.+$',
		'ALLOWED_HOSTS = ["%s"]' % (SITE_URL,)
	)
	secret_key_file = SOURCE_FOLDER + '/' + PROJECT_NAME + '/secret_key.py'
	if not exists(secret_key_file):
		chars = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-=+'
		key = ''.join(random.SystemRandom().choice(chars) for _ in range(50))
		append(secret_key_file, "SECRET_KEY = '%s'" % (key,))
	append(settings_path, '\nfrom .secret_key import SECRET_KEY')

def _update_virtualenv():
	if FETCH_ONLY:
		return

	if not exists(VIRTUALENV_FOLDER + '/bin/pip'):
		run('virtualenv --python=python3 %s' % (VIRTUALENV_FOLDER,))
	run('%s/bin/pip install -r %s/requirements.txt' %(VIRTUALENV_FOLDER, SOURCE_FOLDER))

def _update_static_files():
	run('cd %s && %s/bin/python3 manage.py collectstatic --noinput' % (SOURCE_FOLDER, VIRTUALENV_FOLDER))

def _setup_postgres_if_necessary():
	if FETCH_ONLY:
		return

	if not exists('/etc/postgresql/9.5/setup_flag.txt'):
		sudo('touch /etc/postgresql/9.5/setup_flag.txt')
		run('sudo -u postgres psql template1 -c "ALTER USER postgres with encrypted password \'1234\';"')
		sudo('sed -i "s/\(local[[:blank:]]*all[[:blank:]]*postgres[[:blank:]]*\)peer/\\1md5/g" /etc/postgresql/9.5/main/pg_hba.conf')
		sudo('sed -i "s/\(local[[:blank:]]*all[[:blank:]]*all[[:blank:]]*\)peer/\\1md5/g" /etc/postgresql/9.5/main/pg_hba.conf')
		run('sudo -u postgres psql template1 -c "CREATE USER '+PROJECT_NAME+' WITH PASSWORD \'1234\' CREATEDB;"')
		run('sudo -u postgres psql template1 -c "CREATE DATABASE '+PROJECT_NAME+' OWNER '+PROJECT_NAME+';"')
		#run('sudo /etc/init.d/postgresql restart')
		sudo('/etc/init.d/postgresql restart')

def _update_database():
	if FETCH_ONLY:
		return

	#run('sudo /etc/init.d/postgresql restart')
	sudo('/etc/init.d/postgresql restart')
	run('cd %s && %s/bin/python3 manage.py migrate --noinput' % (SOURCE_FOLDER, VIRTUALENV_FOLDER))

def _update_gunicorn():
	if FETCH_ONLY:
		return

	sudo('cp  %s/gunicorn-template.socket /etc/systemd/system/gunicorn.socket' % (DEPLOY_TOOLS_FOLDER))
	sudo('sed -i "s/USER_NAME/%s/g" /etc/systemd/system/gunicorn.socket' % (USER_NAME))
	sudo('cp  %s/gunicorn-template.service /etc/systemd/system/gunicorn.service' % (DEPLOY_TOOLS_FOLDER))
	sudo('sed -i "s/USER_NAME/%s/g" /etc/systemd/system/gunicorn.service' % (USER_NAME))
	sudo('sed -i "s/SOURCE_FOLDER/%s/g" /etc/systemd/system/gunicorn.service' % (SOURCE_FOLDER.replace('/','\/')))
	sudo('sed -i "s/VIRTUALENV_FOLDER/%s/g" /etc/systemd/system/gunicorn.service' % (VIRTUALENV_FOLDER.replace('/','\/')))
	sudo('sed -i "s/PROJECT_NAME/%s/g" /etc/systemd/system/gunicorn.service' % (PROJECT_NAME.replace('/','\/')))
	sudo('cp  %s/gunicorn-template.conf /etc/tmpfiles.d/gunicorn.conf' % (DEPLOY_TOOLS_FOLDER))
	sudo('sed -i "s/USER_NAME/%s/g" /etc/tmpfiles.d/gunicorn.conf' % (USER_NAME))

	# firstemploy permission
	if not exists('/run/gunicorn'):
		sudo('mkdir /run/gunicorn')
		sudo('chown -R reboministrator:reboministrator /run/gunicorn')

	sudo('systemctl -q daemon-reload')
	time.sleep(5)
	sudo('systemctl -q stop gunicorn.socket')
	time.sleep(10)
	sudo('systemctl -q stop gunicorn.service')
	time.sleep(10)
	sudo('systemctl -q start gunicorn.socket')
	time.sleep(10)
	sudo('systemctl -q start gunicorn.service')
	time.sleep(10)	
	sudo('systemctl -q enable gunicorn.socket')
	time.sleep(3)
	sudo('systemctl -q enable gunicorn.service')
	time.sleep(3)
	# sudo('systemctl status gunicorn')

def _update_nginx():
	if FETCH_ONLY:
		return

	sudo('cp  %s/nginx-template.conf /etc/nginx/sites-available/%s' % (DEPLOY_TOOLS_FOLDER,SITE_URL))
	sudo('sed -i "s/SITE_URL/%s/g" /etc/nginx/sites-available/%s' % (SITE_URL, SITE_URL))
	sudo('sed -i "s/STATIC_FOLDER/%s/g" /etc/nginx/sites-available/%s' % (STATIC_FOLDER.replace('/','\/'), SITE_URL))
	sudo('rm -f /etc/nginx/sites-enabled/%s' % (SITE_URL))
	sudo('ln -s /etc/nginx/sites-available/%s /etc/nginx/sites-enabled/%s' % (SITE_URL, SITE_URL))
	sudo('rm -f /etc/nginx/sites-enabled/default')
	sudo('nginx -s reload')
