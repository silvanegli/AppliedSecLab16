from rest_framework.permissions import BasePermission
from rest_framework.generics import RetrieveUpdateAPIView, ListCreateAPIView
from rest_framework import exceptions
from subprocess import call

from ca_auth import settings
from ca_auth.models import Users as LegacyUsers
from ca_api.models import Certificate


class IsSameUser(BasePermission):
   """
   Permissions for user management
   """
   def has_object_permission(self, request, view, obj):
        user = request.user
        print('check user permission request.user: ' + user.uid + ' and obj.user ' + obj.uid)
        return obj.uid == user.uid #


class IsOwner(BasePermission):
   """
   Check if logged in user is holder of cert.
   """
   def has_object_permission(self, request, view, obj):
        user = request.user
        return obj.user == user


class RetrieveUpdateAPIView_UpdateLegacyUser(RetrieveUpdateAPIView):

    def put(self, request, *args, **kwargs):
        response = super(RetrieveUpdateAPIView_UpdateLegacyUser, self).put(request, *args, **kwargs) #in order that permission class is called
        print('updating user info')
        # try to update the legacy user if one exists
        try:
            uid = kwargs.__getitem__('pk')
            legacy_user = LegacyUsers.objects.get(uid=uid)
            print('updating legacy user: ' + legacy_user.uid)
            new_firstname = request.data['first_name']
            new_lastname = request.data['last_name']
            new_email = request.data['email']

            legacy_user.firstname = new_firstname
            legacy_user.lastname = new_lastname
            legacy_user.email = new_email
            legacy_user.save()

        except LegacyUsers.DoesNotExist:
            pass

        return response


class RetrieveCreateCertsAPIView(ListCreateAPIView):

    def post(self, request, *args, **kwargs):

        #create model instance
        response = super(RetrieveCreateCertsAPIView, self).post(request, *args, **kwargs)

        user = request.user
        cert_name = request.data.get('name')

        #create x509 certificate
        cert_creation_status =  call([settings.CREATE_CERT_LOCATION, user.uid, cert_name, user.email])

        if cert_creation_status != 0:
            Certificate.objects.get(name=cert_name).delete() #undo certificate model creation
            raise exceptions.APIException()

        #both script and django model creation succeeded
        return response

