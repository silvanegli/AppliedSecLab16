from django.db import models
from ca_auth.models import DjangoUser


class Certificate(models.Model):
    user = models.ForeignKey(DjangoUser, related_name='certificates')
    name = models.CharField('cert name', max_length=100, blank=True)
    revoked = models.BooleanField('is revoked', default=False)