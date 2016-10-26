from rest_framework import serializers

from CertAPI.models import Certificate
from djangoBackend.models import DjangoUser



class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = DjangoUser
        fields = ('first_name', 'last_name', 'email')


class CertificateSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Certificate
        fields = ('name', 'revoked', 'user')


