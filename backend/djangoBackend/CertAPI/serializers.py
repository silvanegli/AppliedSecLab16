from rest_framework import serializers

from CertAPI.models import Certificate

from djangoBackend.models import Users


class CertificateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Certificate
        fields = ('name', 'user', 'cert_path', 'key_path')


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Users
        fields = ('firstname', 'lastname', 'email')