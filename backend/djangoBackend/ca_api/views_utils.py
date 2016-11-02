from rest_framework.permissions import BasePermission
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework import exceptions
from ca_auth.models import Users as LegacyUsers

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
            raise exceptions.PermissionDenied()

        new_firstname = request.data['first_name']
        new_lastname = request.data['last_name']
        new_email = request.data['email']

        legacy_user.firstname = new_firstname
        legacy_user.lastname = new_lastname
        legacy_user.email = new_email
        legacy_user.save()

        return response
