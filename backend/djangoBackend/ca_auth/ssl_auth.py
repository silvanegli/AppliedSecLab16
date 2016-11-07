from ca_auth.models import DjangoUser as User


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
        try:
            user_data = extract_user(dn)
        except Exception:
            print("invalid certificate subject: " + dn)
            # invalid certificate
            return None

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


def extract_user(dn):
    d = _dictify_dn(dn)
    ret = dict()
    ret['email'] = d['emailAddress']
    ret['uid'] = d['CN']
    return ret


def _dictify_dn(dn):
    return dict(x.split('=') for x in dn.split('/') if '=' in x)
