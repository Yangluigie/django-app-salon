from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import logout as auth_logout


def logout(request):
    if request.method == 'POST':
        auth_logout(request)
        return JsonResponse({'message': 'Has cerrado sesion exitosamente'}, status=200)
    return JsonResponse({'error': 'Ha habido un error al cerrar la sesión'}, status=405)
