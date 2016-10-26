from ca_auth.models import DjangoUser as User

class SSLClientAuthBackend(object):
    @staticmethod
    def authenticate(request=None):
        if not request.is_secure():
            print("insecure request")
            return None
        authentication_status = request.META.get('HTTP_X_SSL_AUTHENTICATED', None)
        print(authentication_status)
        if (authentication_status != "SUCCESS" or 'HTTP_X_SSL_USER_DN' not in request.META):
            print(
                "HTTP_X_SSL_AUTHENTICATED marked failed or "
                "HTTP_X_SSL_USER_DN "
                "header missing")
            return None
        dn = request.META.get('HTTP_X_SSL_USER_DN')
        user_data = SSLClientAuthBackend.extract_user(dn)
        uid = user_data['uid']
        try:
            user = User.objects.get(uid=uid)
        except User.DoesNotExist:
            print("user {0} not found".format(uid))
            return None
        if not user.is_active:
            print("user {0} inactive".format(uid))
            return None
        print("user {0} authenticated using a certificate issued to "
                    "{1}".format(uid, dn))
        return user

    @staticmethod
    def extract_user(self, dn):
        print(dn)
        ret = dict()
        ret['email'] = dn['email']
        ret['uid'] = dn['email']
        ret['firstname'] = dn['email']
        ret['lastname'] = dn['email']
        return ret