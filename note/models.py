from django.db import models
from tastypie.utils.timezone import now
from django.contrib.auth.models import User
from django.utils.text import slugify

class Todo(models.Model):
	title = models.CharField(max_length=200)
	order = models.IntegerField(default=0)
	completed = models.BooleanField(default=False)

	def __str__(self):
		return self.title


class Entry(models.Model):
    user = models.ForeignKey(User)
    pub_date = models.DateTimeField(default=now)
    title = models.CharField(max_length=200)
    slug = models.SlugField(null=True, blank=True)
    body = models.TextField()

    def __unicode__(self):
        return self.title

    def save(self, *args, **kwargs):
        # For automatic slug generation.
        if not self.slug:
            self.slug = slugify(self.title)[:50]

        return super(Entry, self).save(*args, **kwargs)

class Nav(models.Model):
	author = models.ForeignKey(User)
	text = models.TextField(null=True, blank=True)

	def __str__(self):
		return str(self.author)

class Note(models.Model):
	author = models.ForeignKey(User)
	parent = models.ForeignKey('self', null=True, blank=True, related_name='subnotes')
	order = models.IntegerField(default=0)
	text = models.CharField(max_length=200)
	content = models.TextField(null=True, blank=True)
	regdate = models.DateTimeField(default=now)

	def __str__(self):
		return self.text