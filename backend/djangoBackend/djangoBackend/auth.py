from pprint import pformat

from django.http import HttpResponse
from rest_framework import generics


class SSLAuth(generics.GenericAPIView):
    def get(self, request, **kwargs):
        ctx = dict(
            user_data=self.extract_user(request.META[
                                            'HTTP_X_SSL_USER_DN']),
            authentication_status=request.META['HTTP_X_SSL_AUTHENTICATED'],
            user=str(request.user))
        return HttpResponse(pformat(ctx), content_type="text/plain")

    def extract_user(self, dn):
        # d = dict(dn)
        ret = dict()
        ret['email'] = dn['email']
        return ret
