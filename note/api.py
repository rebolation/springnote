from django.contrib.auth.models import User
from .models import Nav, Note
from .models import Todo, Entry
from tastypie import fields
from tastypie.resources import ModelResource
from tastypie.constants import ALL
from tastypie.authorization import Authorization, DjangoAuthorization
from tastypie.authentication import BasicAuthentication, SessionAuthentication
from tastypie.serializers import Serializer

class TodoResource(ModelResource):
	class Meta:
		queryset = Todo.objects.all()
		resource_name = 'todo' #미지정시 클래스명으로부터 모델 생성
		filtering = { "id" : ALL }
		always_return_data = True #POST후 id와 resource_uri를 backbone에 전달
		authorization = Authorization()
		# authentication = SessionAuthentication()

	# backbone collection fetch를 위해 objects만 보냄
	def alter_list_data_to_serialize(self, request, data):
		return data["objects"]

class UserResource(ModelResource):
	class Meta:
		queryset = User.objects.all()
		resource_name = 'user'
		excludes = ['email', 'password', 'is_active', 'is_staff', 'is_superuser']
		fields = ['username']
		allowed_methods = ['get']

class EntryResource(ModelResource):
	user = fields.ForeignKey(UserResource, 'user')
	class Meta:
		queryset = Entry.objects.all()
		resource_name = 'entry'
		authorization = Authorization()
		# authentication = SessionAuthentication()
		# authorization = DjangoAuthorization()

class NavResource(ModelResource):
	class Meta:
		queryset = Nav.objects.all()
		resource_name = 'nav'
		filtering = { "id" : ALL }
		
class NoteResource(ModelResource):
	author = fields.ForeignKey(UserResource, 'author')
	parent = fields.ForeignKey('self', 'parent', null=True)

	class Meta:
		queryset = Note.objects.all()
		# queryset = Note.objects.order_by('-text')
		resource_name = 'note' #미지정시 클래스명으로부터 모델 생성
		filtering = { "id" : ALL }
		fields = ['order', 'text', 'author']
		# serializer = Serializer()
		# include_resource_uri = False
		always_return_data = True #POST후 id와 resource_uri를 backbone에 전달
		authorization = Authorization()

	# def dehydrate_title(self, bundle):
	# 	return bundle.data['title'] + "제목입니다..."

	def dehydrate(self, bundle):
		bundle.data['id'] = int(bundle.data['resource_uri'][13:])
		if not bundle.data['parent']:
			bundle.data['parent'] = '1'
		else:
			bundle.data['parent'] = int(bundle.data['parent'][13:])
		return bundle

	# backbone collection fetch를 위해 objects만 보냄
	def alter_list_data_to_serialize(self, request, data):
		return data["objects"]