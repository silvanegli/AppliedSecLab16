from rest_framework import serializers

from ca_api.models import Certificate
from ca_auth.models import DjangoUser



class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = DjangoUser
        fields = ('first_name', 'last_name', 'email')


class CertificateSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Certificate
        fields = ('name', 'revoked', 'user')

    def save(self, **kwargs):
        cert_name = self.validated_data.get('name')
        user = self.context['request'].user
        cert = Certificate.objects.create(name=cert_name, user=user)

        return cert



