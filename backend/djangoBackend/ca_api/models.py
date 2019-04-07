from django.core.validators import RegexValidator
from django.db import models
from ca_auth.models import DjangoUser
from django.core.exceptions import ValidationError
from rest_framework import exceptions


def validate_name(value):
    regex_validator = RegexValidator(r'^[0-9a-zA-Z]*$', 'Only alphanumeric characters are allowed.')
    try:
        regex_validator.__call__(value)
    except ValidationError :
        raise exceptions.NotAcceptable(detail='Only alphanumeric characters are allowed')



class Certificate(models.Model):
    user = models.ForeignKey(DjangoUser, related_name='certificates')
    name = models.CharField('cert name', max_length=100, validators=[validate_name])
    email = models.EmailField('subject email')
    revoked = models.BooleanField('is revoked', default=False)

    def save(self, *args, **kwargs):
        self.full_clean()
        super(Certificate, self).save(*args, **kwargs)
