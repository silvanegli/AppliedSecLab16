from django.http import HttpResponse, JsonResponse
from rest_framework_jwt.settings import api_settings

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
