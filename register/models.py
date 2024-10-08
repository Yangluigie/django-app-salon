from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class RegistrarUsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El Email debe ser establecido')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class RegistrarUsuario(AbstractBaseUser, PermissionsMixin):
    nombre = models.CharField(max_length=70)
    apellido = models.CharField(max_length=80)
    telefono = models.CharField(max_length=10)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = RegistrarUsuarioManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre', 'apellido', 'telefono']

    def __str__(self):
        return f'{self.nombre} {self.apellido}'
