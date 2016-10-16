from rest_framework import serializers

from CertAPI.models import Certificate


class CertificateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Certificate
        fields = ('name', 'user', 'cert_path', 'key_path')
