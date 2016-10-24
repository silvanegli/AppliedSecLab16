from django.db import models


class Users(models.Model):
    uid = models.CharField(primary_key=True, max_length=64)
    lastname = models.CharField(max_length=64)
    firstname = models.CharField(max_length=64)
    email = models.CharField(max_length=64)
    pwd = models.CharField(max_length=64)

    class Meta:
        managed = False
        db_table = 'users'
