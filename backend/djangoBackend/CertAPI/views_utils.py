from rest_framework.permissions import BasePermission
from rest_framework.generics import RetrieveUpdateAPIView
from django.contrib.auth.models import User

class IsOwner(BasePermission):
   """
   Permissions for user management
   """
   def has_object_permission(self, request, view, obj):
        user = request.user
        return obj.uid == user.username #as obj is a legacy user


class RetrieveUpdateAPIView_UpdateDjangoUser(RetrieveUpdateAPIView):

    def put(self, request, *args, **kwargs):
        #update django user model
        django_user = User.objects.get(pk=request.user.pk)
        new_firstname = request.data['firstname']
        new_lastname = request.data['lastname']
        new_email = request.data['email']

        django_user.first_name = new_firstname
        django_user.last_name = new_lastname
        django_user.email = new_email
        django_user.save()

        return super(RetrieveUpdateAPIView_UpdateDjangoUser, self).put(request, *args, **kwargs)