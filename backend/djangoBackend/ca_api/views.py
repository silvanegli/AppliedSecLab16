from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework import exceptions

from ca_api.views_utils import IsSameUser, IsOwner, RetrieveUpdateAPIView_UpdateLegacyUser, RetrieveCreateCertsAPIView
from ca_api.models import Certificate
from ca_api.serializers import CertificateSerializer, UserSerializer

from ca_auth.models import DjangoUser


@api_view(('GET',))
def api_root(request, format=None):
    return Response({
        'certificates': reverse('certificate-list', request=request, format=format),
    })


#class Certificate(generics.RetrieveUpdateAPIView):

@permission_classes((IsOwner,))
class CertificateDetails(RetrieveUpdateAPIView):
    """
    List certain certificate with option to revoke it
    """
    serializer_class = CertificateSerializer
    queryset = Certificate.objects.all()

    def perform_update(self, serializer):
        revoked = serializer.validated_data.get('revoked')
        name = serializer.validated_data.get('name')

        cert = serializer.instance

        if cert.revoked and not revoked:
            raise exceptions.NotAcceptable(detail='revocation can not be undone')

        if cert.name != name:
            raise exceptions.NotAcceptable(detail='certificate\'s name can not be changed')

        cert.revoked = revoked
        cert.save()

        serializer.instance = cert


# Certificates
class CertificateList(RetrieveCreateCertsAPIView):
    """
    List all certificates
    """
    serializer_class = CertificateSerializer
    queryset = Certificate.objects.all()

    def perform_create(self, serializer):
        cert_name = serializer.validated_data.get('name')
        user = self.context['request'].user
        same_name_cert_exists = user.certificates.all().filter(name=cert_name).exists()

        if same_name_cert_exists:
            raise exceptions.NotAcceptable(detail= 'There exists already a certificate with name: ' + cert_name)

        cert = Certificate.objects.create(name=cert_name, user=user)
        serializer.instance = cert


@permission_classes((IsSameUser,))
class UserDetail(RetrieveUpdateAPIView_UpdateLegacyUser):
    """
    User detail view
    """
    serializer_class = UserSerializer
    queryset = DjangoUser.objects.all()


