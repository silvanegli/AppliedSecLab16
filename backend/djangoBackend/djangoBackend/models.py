from django.db import models
from django.contrib.auth.models import  BaseUserManager, AbstractBaseUser, PermissionsMixin


#Legacy User Model
class Users(models.Model):
    uid = models.CharField(primary_key=True, max_length=64)
    lastname = models.CharField(max_length=64)
    firstname = models.CharField(max_length=64)
    email = models.CharField(max_length=64)
    pwd = models.CharField(max_length=64)

    class Meta:
        managed = False
        db_table = 'users'


class UserManager(BaseUserManager):
    """
    Manager for the User model.
    """

    def create_user(self, uid, firstname, lastname, email, password=None):
        user = self.model(
            uid=uid,
            email=self.normalize_email(email),
            first_name=firstname,
            last_name=lastname,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user


class DjangoUser(AbstractBaseUser, PermissionsMixin):
    uid = models.CharField(max_length=64, primary_key=True)
    first_name = models.CharField(max_length=64)
    last_name = models.CharField(max_length=64)
    email = models.EmailField(max_length=64)

    objects = UserManager()

    USERNAME_FIELD = 'uid'

    class Meta:
        verbose_name = 'django_user'
        verbose_name_plural = 'django_users'
