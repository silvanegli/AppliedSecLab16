from pprint import pformat
import hashlib

from django.http import HttpResponse
from rest_framework import generics
from django.contrib.auth.models import User
from djangoBackend.models import Users as LegacyUsers


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


class UserModelAuth(object):
    def authenticate(self, username=None, password=None):
        try:
            user = LegacyUsers.objects.get(uid=username)
            bin_sha1_pwd_hash = hashlib.sha1(password.encode())
            hex_dig = bin_sha1_pwd_hash.hexdigest()
            
            if hex_dig != user.pwd:
                user = None
        except LegacyUsers.DoesNotExist:
            user = None

        return None


    def get_user(self, user_id):
        try:
            return LegacyUsers.objects.get(uid=user_id)
        except LegacyUsers.DoesNotExist:
            return None

