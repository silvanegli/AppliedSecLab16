# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-11-07 08:36
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('ca_api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='certificate',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='certificates', to=settings.AUTH_USER_MODEL),
        ),
    ]