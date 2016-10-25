from django.db import models
from django.contrib.auth.models import User


class Certificate(models.Model):
    user = models.ForeignKey(User, related_name='certificates')
    name = models.CharField('cert name', max_length=100, blank=True)
    revoked = models.BooleanField('is revoked', default=False)