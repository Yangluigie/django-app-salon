from django.contrib import admin
from .models import RegistrarUsuario


class RegistrarUsuarioAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'apellido', 'email', 'is_staff', 'is_active']
    list_filter = ['is_staff', 'is_active']
    search_fields = ['nombre', 'apellido', 'email']
    readonly_fields = ['password']


admin.site.register(RegistrarUsuario, RegistrarUsuarioAdmin)
