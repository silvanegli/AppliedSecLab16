import hashlib
from pprint import pformat

from django.http import HttpResponse
from rest_framework import generics

from djangoBackend.models import DjangoUser
from djangoBackend.models import Users as LegacyUsers


def extract_user(self, dn):
    print(dn)
    ret = dict()
    ret['email'] = dn['email']
    ret['uid'] = dn['email']
    ret['firstname'] = dn['email']
    ret['lastname'] = dn['email']
    return ret

class SSLAuth(generics.GenericAPIView):
    def get(self, request, **kwargs):
        ctx = dict(
            user_data=extract_user(request.META[
                                            'HTTP_X_SSL_USER_DN']),
            authentication_status=request.META['HTTP_X_SSL_AUTHENTICATED'],
            user=str(request.user))
        return HttpResponse(pformat(ctx), content_type="text/plain")

class SSLClientAuthBackend(object):
    @staticmethod
    def authenticate(request=None):
        if not request.is_secure():
            print("insecure request")
            return None
        authentication_status = request.META.get('HTTP_X_SSL_AUTHENTICATED', None)
        if (authentication_status != "SUCCESS" or 'HTTP_X_SSL_USER_DN' not in request.META):
            print(
                "HTTP_X_SSL_AUTHENTICATED marked failed or "
                "HTTP_X_SSL_USER_DN "
                "header missing")
            return None
        dn = request.META.get('HTTP_X_SSL_USER_DN')
        user_data = extract_user(dn)
        uid = user_data['uid']
        try:
            user = User.objects.get(uid=uid)
        except User.DoesNotExist:
            print("user {0} not found".format(username))
            if settings.AUTOCREATE_VALID_SSL_USERS:
                user = User(**user_data)
                user.save()
            else:
                return None
        if not user.is_active:
            logger.warning("user {0} inactive".format(username))
            return None
        logger.info("user {0} authenticated using a certificate issued to "
                    "{1}".format(username, dn))
        return user


class UserModelAuth:
    def authenticate(self, uid=None, password=None):
        try:
            legacy_user = LegacyUsers.objects.get(uid=uid)
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
            user = DjangoUser.objects.get(uid=legacy_user.uid)

        except DjangoUser.DoesNotExist:
            user = DjangoUser.objects.create_user(uid=legacy_user.uid,firstname=legacy_user.firstname, lastname=legacy_user.lastname,
                                                  email=legacy_user.email, password=raw_pwd)

        return user

    def get_user(self, user_id):
        try:
            return DjangoUser.objects.get(pk=user_id)
        except DjangoUser.DoesNotExist:
            return None

