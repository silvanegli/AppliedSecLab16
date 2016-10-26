from rest_framework.permissions import BasePermission
from rest_framework.generics import RetrieveUpdateAPIView
from djangoBackend.models import Users as LegacyUsers

class IsOwner(BasePermission):
   """
   Permissions for user management
   """
   def has_object_permission(self, request, view, obj):
        user = request.user
        return obj.uid == user.uid #as obj is a legacy user


class RetrieveUpdateAPIView_UpdateLegacyUser(RetrieveUpdateAPIView):

    def put(self, request, *args, **kwargs):
        #update django user model
        legacy_user = LegacyUsers.objects.get(uid=request.user.uid)
        new_firstname = request.data['first_name']
        new_lastname = request.data['last_name']
        new_email = request.data['email']

        legacy_user.firstname = new_firstname
        legacy_user.lastname = new_lastname
        legacy_user.email = new_email
        legacy_user.save()

        return super(RetrieveUpdateAPIView_UpdateLegacyUser, self).put(request, *args, **kwargs)