from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required
def citas(request):
    usuario = request.user
    nombre_completo = f'{usuario.nombre} {usuario.apellido}'
    return render(request, 'citas.html', {
        'nombre_completo': nombre_completo,
        'usuario_id': usuario.id})
