from django.shortcuts import render, redirect
from django.http import HttpResponse
from  django.template  import  loader

from .models import Note

def homepage(request):
	return render(request, 'home.html')

def nav(request):
	notes = Note.objects.filter(parent__isnull=True)
	return HttpResponse(notes)

def viewnote(request, pk):
	return render(request, 'viewnote.html')