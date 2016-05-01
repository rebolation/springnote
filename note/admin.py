from django.contrib import admin
from .models import Entry, Nav, Note, Todo

admin.site.register(Entry)
admin.site.register(Nav)
admin.site.register(Note)
admin.site.register(Todo)