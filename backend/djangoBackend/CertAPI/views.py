from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.reverse import reverse

from CertAPI.views_utils import IsOwner, RetrieveUpdateAPIView_UpdateLegacyUser
from CertAPI.models import Certificate
from CertAPI.serializers import CertificateSerializer, UserSerializer

from djangoBackend.models import DjangoUser


@api_view(('GET',))
def api_root(request, format=None):
    return Response({
        'certificates': reverse('certificate-list', request=request, format=format),
    })


# Certificates
class CertificateList(generics.ListCreateAPIView):
    """
    List all certificates
    """
    serializer_class = CertificateSerializer
    queryset = Certificate.objects.all()



@permission_classes((IsOwner,))
class UserDetail(RetrieveUpdateAPIView_UpdateLegacyUser):
    """
    User detail view
    """
    serializer_class = UserSerializer
    queryset = DjangoUser.objects.all()


