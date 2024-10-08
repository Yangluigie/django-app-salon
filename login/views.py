from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate, login as auth_login


def iniciar_sesion(request):
    return render(request, 'login.html')


def login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        if not email or not password:
            return JsonResponse({'error': 'El email o password es obligatorio'}, status=400)

        try:
            user = authenticate(request, email=email, password=password)
            if user is not None:
                if user.is_active:
                    auth_login(request, user)

                    # Verificar si el usuario es staff
                    if user.is_staff:
                        # Redirigir al panel personalizado de administración
                        return JsonResponse({'message': 'Inicio de sesión exitoso', 'redirect_url': '/citas/panel-admin/'}, status=200)
                    else:
                        # Redirigir al área de creación de citas (usuarios regulares)
                        return JsonResponse({'message': 'Inicio de sesión exitoso', 'redirect_url': '/dashboard/citas/'}, status=200)
                else:
                    return JsonResponse({'error': 'Cuenta inactiva'}, status=400)
            else:
                return JsonResponse({'error': 'Email o password incorrecto'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Método no permitido'}, status=405)
