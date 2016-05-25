from django.contrib.auth.models import User
from .models import Note
from tastypie import fields
from tastypie.resources import ModelResource, Resource
from tastypie.constants import ALL
from tastypie.authorization import Authorization, DjangoAuthorization
from tastypie.authentication import BasicAuthentication, SessionAuthentication
from tastypie.serializers import Serializer
from tastypie.cache import SimpleCache
import bleach


class UserResource(ModelResource):
	class Meta:
		queryset = User.objects.all()
		resource_name = 'user'
		excludes = ['email', 'password', 'is_active', 'is_staff', 'is_superuser']
		fields = ['username']
		allowed_methods = ['get']

class NoteAuthorization(Authorization):
	# GET : 누구나
	def read_list(self, object_list, bundle):
		return object_list

	# POST : 노트의 오너와 로그인한 유저가 일치해야만
	def create_detail(self, object_list, bundle):
		if bundle.obj.author == bundle.request.user:
			return True
		else:
			raise Unauthorized("no permission")

	# PATCH, PUT (여러개) : 노트의 오너와 로그인한 유저가 일치해야만
	def update_list(self, object_list, bundle):
		allowed = []
		for obj in object_list:
			if obj.author == bundle.request.user:
				allowed.append(obj)
		return allowed

	# PATCH, PUT : 노트의 오너와 로그인한 유저가 일치해야만
	def update_detail(self, object_list, bundle):
		if bundle.obj.author == bundle.request.user:
			return True
		else:
			raise Unauthorized("no permission")		

	# DELETE : 노트의 오너와 로그인한 유저가 일치해야만
	def delete_detail(self, object_list, bundle):
		if bundle.obj.author == bundle.request.user:
			return True
		else:
			raise Unauthorized("no permission")


class NavResource(Resource):
	id = fields.IntegerField(attribute='id')
	text = fields.CharField(attribute='text')
	author = fields.IntegerField(attribute='author_id')
	parent = fields.IntegerField(attribute='parent_id', null=True, blank=True)
	order = fields.IntegerField(attribute='order')
	ishidden = fields.BooleanField(attribute='ishidden')

	class Meta:
		max_limit = None #settings.py에 API_LIMIT_PER_PAGE = 0 설정했더라도 리소스에 max_limit를 설정하지 않으면 1000개로 제한된다
		include_resource_uri = False
		always_return_data = True #POST후 id와 resource_uri를 backbone에 전달
		# cache = SimpleCache(timeout=60*60)
		authorization = NoteAuthorization()

	def get_object_list(self, request):
		userpage = request.GET.get('userpage','')
		if userpage:
			user = User.objects.get(username=userpage)
			userid = user.id

		query = """
			select id, "order", text, author_id, parent_id, ishidden
			from note_note
			where author_id = %s
			order by "order"
		"""
		results = list(Note.objects.raw(query, [userid]))
		return results

	# def get_object_list(self, request):
	# 	userpage = request.GET.get('userpage','')
	# 	if userpage:
	# 		user = User.objects.get(username=userpage)
	# 		return super(NoteResource, self).get_object_list(request).filter(author_id=user.id)
	# 	else:
	# 		return super(NoteResource, self).get_object_list(request)		

	def dehydrate(self, bundle):
		if bundle.data['parent'] == None or bundle.data['parent'] == "#":
			bundle.data['parent'] = '#'
		bundle.data['author'] = '/api/v1/user/' + str(bundle.data['author'])
		return bundle		

	def obj_get_list(self, bundle, **kwargs):
		return self.get_object_list(bundle.request)

	def alter_list_data_to_serialize(self, request, data):
		return data["objects"]


class NoteResource(ModelResource):
	author = fields.ForeignKey(UserResource, 'author')
	parent = fields.ForeignKey('self', 'parent', null=True)

	class Meta:
		queryset = Note.objects.order_by('order')
		# queryset = Note.objects.all()
		max_limit = None #settings.py에 API_LIMIT_PER_PAGE = 0 설정했더라도 리소스에 max_limit를 설정하지 않으면 1000개로 제한된다
		resource_name = 'note' #미지정시 클래스명으로부터 모델 생성
		filtering = { "id" : ALL }
		fields = ['id', 'order', 'text', 'author', 'ishidden', 'content'] #id를 꼭 넣어줘야 PATCH등이 정상 작동하는 듯
		include_resource_uri = False
		always_return_data = True #POST후 id와 resource_uri를 backbone에 전달
		# cache = SimpleCache(timeout=60*60)
		authorization = NoteAuthorization()

	# backbone으로 보낼 데이터를 가공하여 전송
	def dehydrate(self, bundle):
		# 요청이 GET일 때만 가공(목록 순서 변경(PATCH)시 내부적으로는 dehydrate -> PUT 처리되므로 order만 patch하더라도 content가 None이 되는 경우 발생)
		if "GET" in str(bundle.request):
			if bundle.data['parent'] == None or bundle.data['parent'] == "#":
				bundle.data['parent'] = '#'
			else:
				bundle.data['parent'] = int(bundle.data['parent'][13:])

			# 목록 조회 시 데이터를 줄이기 위해 content = None 처리
			bundle.data['content'] = None
		return bundle

	# backbone에서 보내온 데이터를 가공하여 저장
	def hydrate(self, bundle):
		# 요청이 POST일 때만 로그인아이디 -> author로 지정
		# 요청이 PATCH일 때도 적용하면 다른 사람 노트를 수정할 수도 있음
		if "POST" in str(bundle.request):
			bundle.data['author'] = '/api/v1/user/' + str(bundle.request.user.id)

		if bundle.data['parent'] == None or bundle.data['parent'] == "#":
			bundle.data['parent'] = None
		else:
			bundle.data['parent'] = '/api/v1/note/' + str(bundle.data['parent'])

		# bleach.clean
		#제목
		bundle.data['text'] = bleach.clean(bundle.data['text'], strip=True)

		#본문
		if bundle.data['content']:
			bundle.data['content'] = bundle.data['content'].replace("\t","&nbsp;&nbsp;&nbsp;&nbsp;")
			bundle.data['content'] = bleach.clean(
				bundle.data['content'],
				tags=['br', 'div', 'span', 'p', 'pre', 'code', 'blockquote', 'a', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'b', 'strong', 'u', 'i', 'em'],
				attributes={
					'*': ['class'],
					# '*': ['class', 'style'],
				},
				# styles=['color', 'background', 'background-color', 'font-size', 'font-weight'],
				strip=True
			)

		return bundle

	# backbone collection fetch를 위해 objects만 보냄
	def alter_list_data_to_serialize(self, request, data):
		return data["objects"]

	# 파라미터 받아서 쿼리셋 처리
	def get_object_list(self, request):
		userpage = request.GET.get('userpage','')
		if userpage:
			user = User.objects.get(username=userpage)
			return super(NoteResource, self).get_object_list(request).filter(author_id=user.id)
		else:
			return super(NoteResource, self).get_object_list(request)