from django.contrib.auth.models import User
from .models import Nav, Note
from .models import Todo, Entry
from tastypie import fields
from tastypie.resources import ModelResource
from tastypie.constants import ALL
from tastypie.authorization import Authorization, DjangoAuthorization
from tastypie.authentication import BasicAuthentication, SessionAuthentication
from tastypie.serializers import Serializer
import bleach

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
		# queryset = Note.objects.all()
		queryset = Note.objects.order_by('order')
		resource_name = 'note' #미지정시 클래스명으로부터 모델 생성
		filtering = { "id" : ALL }
		fields = ['id', 'order', 'text', 'author', 'completed', 'content'] #id를 꼭 넣어줘야 PATCH등이 정상 작동하는 듯
		include_resource_uri = False
		always_return_data = True #POST후 id와 resource_uri를 backbone에 전달
		authorization = Authorization()
		# authorization = DjangoAuthorization()
		# authentication = BasicAuthentication()
		# authentication = SessionAuthentication()

	# backbone으로 보낼 데이터를 가공하여 전송
	def dehydrate(self, bundle):
		if bundle.data['parent'] == None or bundle.data['parent'] == "#":
			bundle.data['parent'] = '#'
		else:
			bundle.data['parent'] = int(bundle.data['parent'][13:])
		bundle.data['content'] = None
		return bundle

	# backbone에서 보내온 데이터를 가공하여 저장
	def hydrate(self, bundle):
		if bundle.data['parent'] == None or bundle.data['parent'] == "#":
			bundle.data['parent'] = None
		else:
			bundle.data['parent'] = '/api/v1/note/' + str(bundle.data['parent'])

		# bleach.clean
		if bundle.data['content']:
			bundle.data['content'] = bundle.data['content'].replace("\t","&nbsp;&nbsp;&nbsp;&nbsp;")
			bundle.data['content'] = bleach.clean(
				bundle.data['content'],
				tags=['br', 'div', 'span'],
				strip=True
			)
		return bundle

	# backbone collection fetch를 위해 objects만 보냄
	def alter_list_data_to_serialize(self, request, data):
		return data["objects"]

	# # 파라미터 받아서 쿼리셋 처리
	# def get_object_list(self, request):
	# 	print(request.GET['user'])
	# 	return super(NoteResource, self).get_object_list(request).filter(parent_id=162)