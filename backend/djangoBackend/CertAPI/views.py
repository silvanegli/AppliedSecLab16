from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

from CertAPI.models import Certificate
from CertAPI.serializers import CertificateSerializer


@api_view(('GET',))
def api_root(request, format=None):
    return Response({
        'certificates': reverse('certificate-list', request=request, format=format),
    })

# Certificates
class CertificateList(generics.ListCreateAPIView):
    """
    List all categories or create new foodCategory
    """
    serializer_class = CertificateSerializer
    queryset = Certificate.objects.all()