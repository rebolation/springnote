from django.conf.urls import url, include
from note import views

from tastypie.api import Api
from .api import NavResource, NoteResource
from .api import EntryResource, UserResource, TodoResource


v1_api = Api(api_name='v1')
v1_api.register(UserResource())
v1_api.register(EntryResource())
v1_api.register(NavResource())
v1_api.register(NoteResource())
v1_api.register(TodoResource())

urlpatterns = [
    url(r'^$', views.homepage, name='homepage'),
    url(r'^api/', include(v1_api.urls)),
    # url(r'^nav/$', views.nav, name='nav'),
    # url(r'^note/(?P<pk>[0-9]+)/$', views.viewnote, name='viewnote'),
]