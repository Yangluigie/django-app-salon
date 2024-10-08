from django.shortcuts import render
from .models import RegistrarUsuario
from django.http import JsonResponse
from django.core.mail import EmailMessage


def register(request):
    return render(request, 'register.html')


def crear(request):
    if request.method == 'POST':
        try:
            nombre = request.POST.get('nombre')
            apellido = request.POST.get('apellido')
            telefono = request.POST.get('telefono')
            email = request.POST.get('email')
            password = request.POST.get('password')

            if not all([nombre, apellido, telefono, email, password]):
                return JsonResponse({'error': 'Todos los campos son requeridos'}, status=400)

            email_existente = RegistrarUsuario.objects.filter(
                email=email).exists()

            if email_existente:
                return JsonResponse({'error': 'El email ya esta registrado'}, status=400)

            correo = EmailMessage(
                'Bienvenid@ a App Salón',
                f'''Hola {email}, un gusto saludarte. Gracias por crear tu cuenta con nosotros. 
                    Ya puedes iniciar sesion en nuestra web para que agedes tu cita en App Salón. Bienvenido!''',
                email,
                ['3f8ba3cb5b8d5d@inbox.mailtrap.io'],
                reply_to=[email]
            )
            correo.send()

            nuevo_perfil = RegistrarUsuario(
                nombre=nombre,
                apellido=apellido,
                telefono=telefono,
                email=email
            )
            nuevo_perfil.set_password(password)
            nuevo_perfil.save()
            return JsonResponse({'message': 'Has creado tu cuenta exitosamente. Por favor inicia sesión'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Método no permitido'}, status=405)
