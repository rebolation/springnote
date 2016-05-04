from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.utils.html import escape
from django.template import loader
from .models import Note


def homepage(request):
	return render(request, 'home.html')

def nav(request):
	notes = Note.objects.filter(parent__isnull=True)
	return HttpResponse(notes)

def viewnote(request, pk):
	note = Note.objects.get(pk=pk)
	content = note.content
	if content == None:
		content = ''

	#저장시 bleach.clean
	#contenteditable=true 에서는 escape하지 않음
	# if content: 
	# 	content = escape(content)
	# 	content = content.replace("\t", "&nbsp;&nbsp;&nbsp;&nbsp;")
	# 	content = content.replace("\n", "<br/>")
	return HttpResponse(content)
