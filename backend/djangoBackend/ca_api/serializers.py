from rest_framework import serializers
from rest_framework.fields import CharField, EmailField

from ca_api.models import Certificate
from ca_auth.models import DjangoUser



class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = DjangoUser
        fields = ('first_name', 'last_name', 'email')


class CertificateSerializer(serializers.HyperlinkedModelSerializer):
    #user = UserSerializer(read_only=True)
    user = CharField(source='user.uid', read_only=True)
    subject_email = EmailField(source='email', read_only=True)

    class Meta:
        model = Certificate
        fields = ('pk', 'name', 'revoked', 'subject_email', 'user')