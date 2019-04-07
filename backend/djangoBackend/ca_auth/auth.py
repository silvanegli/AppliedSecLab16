import hashlib

from ca_auth.models import DjangoUser as User
from ca_auth.models import Users as LegacyUsers


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
            user = User.objects.get(uid=legacy_user.uid)

        except User.DoesNotExist:
            user = User.objects.create_user(uid=legacy_user.uid, firstname=legacy_user.firstname,
                                            lastname=legacy_user.lastname,
                                            email=legacy_user.email, password=raw_pwd)
        return user

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
