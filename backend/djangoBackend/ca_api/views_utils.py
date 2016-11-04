from rest_framework.permissions import BasePermission
from rest_framework.generics import RetrieveUpdateAPIView, ListCreateAPIView
from rest_framework import exceptions
from subprocess import call

from ca_auth import settings
from ca_auth.models import Users as LegacyUsers
from ca_api.models import Certificate


class IsOwner(BasePermission):
   """
   Permissions for user management
   """
   def has_object_permission(self, request, view, obj):
        user = request.user
        return obj.uid == user.uid #


class RetrieveUpdateAPIView_UpdateLegacyUser(RetrieveUpdateAPIView):

    def get(self, request, *args, **kwargs):
        uid = kwargs.__getitem__('pk')
        if LegacyUsers.objects.filter(uid=uid).exists():
            return super(RetrieveUpdateAPIView_UpdateLegacyUser, self).get(request, *args, **kwargs)
        else:
            raise exceptions.PermissionDenied()

    def put(self, request, *args, **kwargs):
        uid = kwargs.__getitem__('pk')
        try:
            legacy_user = LegacyUsers.objects.get(uid=uid)
            response = super(RetrieveUpdateAPIView_UpdateLegacyUser, self).put(request, *args, **kwargs) #in order that permission class is called
        except LegacyUsers.DoesNotExist:
            raise exceptions.PermissionDenied() #TODO: maybe use methodNotAllowed

        new_firstname = request.data['first_name']
        new_lastname = request.data['last_name']
        new_email = request.data['email']

        legacy_user.firstname = new_firstname
        legacy_user.lastname = new_lastname
        legacy_user.email = new_email
        legacy_user.save()

        return response


def create_cert(user, cert_name):
    r1 = call(["pwd"])
    response = call([settings.CREATE_CERT_LOCATION, user.uid, cert_name])
    return response


class RetrieveCreateCertsAPIView(ListCreateAPIView):

    def post(self, request, *args, **kwargs):

        user = request.user
        cert_name = request.data.get('name')
        same_name_cert_exists = user.certificates.all().filter(name=cert_name).exists()

        if same_name_cert_exists:
            raise exceptions.NotAcceptable(detail= 'There exists already a certificate with name: ' + cert_name)

        response = super(RetrieveCreateCertsAPIView, self).post(request, *args, **kwargs)

        script_response = create_cert(user, cert_name)

        if script_response != 0:
            Certificate.objects.get(name=cert_name).delete() #undo certificate model creation
            raise exceptions.APIException()

        #both script and django model creation succeeded
        user_cert_path = settings.USER_CERT_LOCATION + user.uid + '/' + cert_name + '.crt'
        return response

