from django.conf.urls import url, include
from django.contrib.auth.views import login, logout
from note import views
from tastypie.api import Api
from .api import UserResource, NoteResource


v1_api = Api(api_name='v1')
v1_api.register(UserResource())
v1_api.register(NoteResource())

urlpatterns = [
	url(r'^$', views.homepage, name='homepage'),
	url(r'^(?P<userpage>[a-zA-Z0-9]+)/$', views.userpage, name='userpage'),
	url(r'^accounts/login/$', login, name='login'),
	url(r'^accounts/logout/$', logout, {'next_page':'/'}, name='logout'), 
	url(r'^api/', include(v1_api.urls)),
	# url(r'^nav/$', views.nav, name='nav'),
	url(r'^note/(?P<pk>[0-9]+)/$', views.viewnote, name='viewnote'),
]