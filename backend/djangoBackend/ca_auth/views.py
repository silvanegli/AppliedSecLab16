from pprint import pformat

from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from rest_framework.compat import is_authenticated

from ca_auth.ssl_auth import SSLClientAuthBackend


def ssl_auth(request):
    if
    ctx = dict(
        user_data=SSLClientAuthBackend.extract_user(request.META[
                                                        'HTTP_X_SSL_USER_DN']),
        authentication_status=request.META['HTTP_X_SSL_AUTHENTICATED'],
        user=str(request.user))
    return HttpResponse(pformat(ctx), content_type="text/plain")
