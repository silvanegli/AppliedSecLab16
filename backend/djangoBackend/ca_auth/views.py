from pprint import pformat

from django.http import HttpResponse

from ca_auth.ssl_auth import SSLClientAuthBackend

def ssl_auth(request):
    user = SSLClientAuthBackend.authenticate(request)
    if user is None:
        return HttpResponse(status=403)

    ctx = dict(
        user_data=SSLClientAuthBackend.extract_user(request.META[
                                                        'HTTP_X_SSL_USER_DN']),
        authentication_status=request.META['HTTP_X_SSL_AUTHENTICATED'],
        user=str(request.user))
    return HttpResponse(pformat(ctx), content_type="text/plain")
