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


class UserModelAuth:
    def authenticate(self, username=None, password=None):
        try:
            legacy_user = LegacyUsers.objects.get(email=username)
            bin_sha1_pwd_hash = hashlib.sha1(password.encode())
            hex_dig = bin_sha1_pwd_hash.hexdigest()
            
            if hex_dig != legacy_user.pwd:
                legacy_user = None
        except LegacyUsers.DoesNotExist:
            legacy_user = None

        if legacy_user is not None:
            django_user = self.get_or_create_django_user(legacy_user, password)
        else:
            django_user = None

        return django_user


    def get_or_create_django_user(self, legacy_user, raw_pwd):
        try:
            user = User.objects.get(username=legacy_user.uid)

        except User.DoesNotExist:
            user = User.objects.create_user(username=legacy_user.uid,email=legacy_user.email, password=raw_pwd)

        return user


    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

