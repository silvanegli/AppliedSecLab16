from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.shortcuts import render
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.response import Response
from django.http import HttpResponse, HttpResponseForbidden
from rest_framework.reverse import reverse
from rest_framework import exceptions
from django.views.generic import ListView

from ca_api.views_utils import IsSameUser, IsOwner, RetrieveUpdateAPIView_UpdateLegacyUser, RetrieveCreateCertsAPIView
from ca_api.models import Certificate
from ca_api.serializers import CertificateSerializer, UserSerializer
from ca_auth import settings

from ca_auth.models import DjangoUser

from subprocess import call

from ca_auth.ssl_auth import SSLClientAuthBackend


@api_view(('GET',))
def api_root(request, format=None):
    return Response({
        'certificates': reverse('certificate-list', request=request, format=format),
    })


@permission_classes((IsOwner,))
@api_view(('GET',))
def pkcs12_download(request, cert_pk):
    user = request.user

    cert = Certificate.objects.get(pk=cert_pk)
   
    pkcs12_filename = cert.name + '.p12'
    pkcs12_redirect_path = '/download/{0}/{1}'.format(user.uid, pkcs12_filename)
    print('redirecting webserver for pkcs12 download to: ' + pkcs12_redirect_path)

    response = HttpResponse()
    response['Content-Type'] = 'application/pkcs-12'
    response['X-Accel-Redirect'] = pkcs12_redirect_path
    response['Content-Disposition'] = 'attachment;filename=' + pkcs12_filename

    return response


#class Certificate(generics.RetrieveUpdateAPIView):

def revoke_cert(cert):
    #revoke  x509 certificate
    print('trying to revoke certificate: ' + cert.name + ' : ' + settings.REVOKE_CERT_LOCATION  + ' :' + cert.user.uid)
    cert_revokation_status = call([settings.REVOKE_CERT_LOCATION, cert.user.uid, cert.name])
    if cert_revokation_status == 0:
        print('certificate: ' + cert.name + ' revoked')
        cert.revoked = True
        cert.save()
    else:
        raise exceptions.APIException(detail='revocation failed')


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

        if cert.name != name:
            raise exceptions.NotAcceptable(detail='certificate\'s name can not be changed')

        if cert.revoked and not revoked:
            raise exceptions.NotAcceptable(detail='revocation can not be undone')

        elif cert.revoked and revoked:
            raise exceptions.NotAcceptable(detail='certificate is already revoked')

        elif not cert.revoked and revoked:
            revoke_cert(cert)




class CertificateList(RetrieveCreateCertsAPIView):
    """
    List all certificates
    """
    serializer_class = CertificateSerializer

    def perform_create(self, serializer):
        cert_name = serializer.validated_data.get('name')
        user = self.request.user
        cert_email = user.email        
        print('trying to create cert: ' +  cert_name + ' for user: ' + user.uid )
        same_name_cert_exists = user.certificates.all().filter(name=cert_name).exists()

        if same_name_cert_exists:
            raise exceptions.NotAcceptable(detail= 'There exists already a certificate with name: ' + cert_name)

        same_email_cert_exists = user.certificates.all().filter(email=cert_email).exists()
        
        if same_email_cert_exists:
            raise exceptions.NotAcceptable(detail='There exists already a certificate with the same email address: '+ cert_email +'. Only one certificate per email address is allowed.')

        cert = Certificate.objects.create(name=cert_name, user=user, email=user.email)
        serializer.instance = cert

    def get_queryset(self):
        """
        This view should return a list of all the certificates
        for the currently authenticated user.
        """
        user = self.request.user
        return Certificate.objects.filter(user=user)



@permission_classes((IsSameUser,))
class UserDetail(RetrieveUpdateAPIView_UpdateLegacyUser):
    """
    User detail view
    """
    serializer_class = UserSerializer
    queryset = DjangoUser.objects.all()


def certificate_list(request):
    user = SSLClientAuthBackend.authenticate(request)

    if user is None or not user.is_superuser:
        return HttpResponseForbidden("No or invalid certificate provided. Please import a valid administrator certificate and try again.")

    else:
        certs = Certificate.objects.all().order_by('user')
        return render(request, 'certificate_list.html', {'certificates': certs})
