# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-05-15 11:51
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('note', '0003_auto_20160515_0203'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='entry',
            name='user',
        ),
        migrations.RemoveField(
            model_name='nav',
            name='author',
        ),
        migrations.DeleteModel(
            name='Todo',
        ),
        migrations.DeleteModel(
            name='Entry',
        ),
        migrations.DeleteModel(
            name='Nav',
        ),
    ]
