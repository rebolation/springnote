from django.db import models
from tastypie.utils.timezone import now
from django.contrib.auth.models import User
from django.utils.text import slugify

class Note(models.Model):
	author = models.ForeignKey(User)
	parent = models.ForeignKey('self', null=True, blank=True, related_name='subnotes')
	order = models.IntegerField(db_index=True, default=0)
	text = models.CharField(max_length=200)
	content = models.TextField(null=True, blank=True)
	regdate = models.DateTimeField(default=now)
	completed = models.BooleanField(default=False)

	def to_dict(self):
		return {
			'id': self.pk, 
			'author': self.author.id, 
			'parent': self.parent.id, 
			'"order"': self.order,
			'test': self.text,
			'completed': self.completed,
		}

	def __str__(self):
		return self.text

