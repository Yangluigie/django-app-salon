from django.shortcuts import render
from django.contrib.auth.decorators import user_passes_test

# Función para verificar si el usuario es staff


def es_staff(user):
    return user.is_active and user.is_staff

# Vista para el panel personalizado de administración


@user_passes_test(es_staff, login_url='/login/')
def admin_panel(request):
    usuario = request.user
    nombre_completo = f'{usuario.nombre} {usuario.apellido}'
    return render(request, 'admin_panel.html', {'nombre_completo': nombre_completo})
