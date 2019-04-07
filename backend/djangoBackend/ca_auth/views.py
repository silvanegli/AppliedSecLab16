from wsgiref.util import FileWrapper

from django.http import HttpResponse, JsonResponse
from rest_framework_jwt.settings import api_settings
import pysftp
from django.http import FileResponse
from ca_auth.ssl_auth import SSLClientAuthBackend


def ssl_auth(request):
    user = SSLClientAuthBackend.authenticate(request)
    if user is None:
        return HttpResponse(status=403)

    jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
    jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

    # create the token from the user
    token = jwt_encode_handler(jwt_payload_handler(user))

    return JsonResponse({'token': token})


def sftptest(request):
    with pysftp.Connection('192.168.56.14', username='cadmin', password='g68?M_tk') as sftp:
        with sftp.cd('/home/cadmin'):
            exists = sftp.exists('/home/cadmin/test')
            file = sftp.open('/home/cadmin/c1.p12')
            #content = file.read()
            response = HttpResponse(FileWrapper(file), content_type='application/pkcs-12')
            response['Content-Disposition'] = 'attachment; filename=test.txt'

    return response