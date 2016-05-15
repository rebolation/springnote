from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.utils.html import escape
from django.template import loader
from .models import Note
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect

def homepage(request):
	# return render(request, 'home.html')
	return redirect('userpage', userpage='rebolation')

def userpage(request, userpage):
	return render(request, 'userpage.html', {'userpage':userpage})

@login_required
def gohome(request):
	return redirect('userpage', userpage=request.user.username)

def nav(request):
	notes = Note.objects.filter(parent__isnull=True)
	return HttpResponse(notes)


def viewnote(request, pk):
	note = Note.objects.get(pk=pk)
	content = note.content
	if content is None:
		content = ''

	# 저장시 bleach.clean
	# contenteditable=true 에서는 escape하지 않음
	# if content: 
	# 	content = escape(content)
	# 	content = content.replace("\t", "&nbsp;&nbsp;&nbsp;&nbsp;")
	# 	content = content.replace("\n", "<br/>")
	return HttpResponse(content)
