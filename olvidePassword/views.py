from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import SetPasswordForm
from django.http import JsonResponse
from django.core.mail import EmailMessage
from django.utils.html import format_html

def vista_olvide_password(request):
    return render(request, 'olvide-password.html')

def recuperar_password(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        UserModel = get_user_model()

        if email:
            try:
                user = UserModel.objects.get(email=email)
                token = default_token_generator.make_token(user)
                # Codificar `user.pk` como bytes
                uid = urlsafe_base64_encode(force_bytes(user.pk))  
                domain = request.get_host()
                reset_link = f"http://{domain}/olvide/password_reset/{uid}/{token}/"

               # Crear el contenido del correo en HTML
                message = format_html(
                    '''
                    <p>Hola {name}</p>,
                    <p>Has solicitado restablecer tu contraseña. Por favor, haz clic en el siguiente enlace para restablecerla:</p>
                    <p><a href="{link}">Reestablecer aquí</a></p>
                    <p>Si no solicitaste este cambio, por favor ignora este correo.</p>
                    ''',
                    name=f'{user.nombre} {user.apellido}',  # Combina nombre y apellido
                    link=reset_link
                )

                correo = EmailMessage(
                    'Solicitud de Restablecimiento de Contraseña',
                    message,  # Usa el contenido HTML
                    from_email=email,
                    to=['3f8ba3cb5b8d5d@inbox.mailtrap.io'],
                    reply_to=[email]
                )

                correo.content_subtype = "html"  # Establece el tipo de contenido a HTML
                correo.send()

                return JsonResponse({'message': 'Te hemos enviado un correo con instrucciones para restablecer tu contraseña.'}, status=200)
            except UserModel.DoesNotExist:
                return JsonResponse({'error': 'No hay ningún usuario asociado a este correo electrónico.'}, status=400)
        else:
            return JsonResponse({'error': 'El email es obligatorio'}, status=400)
        
    return JsonResponse({'error': 'Método no permitido'}, status=405)

def password_reset_confirm(request, uidb64, token):
    UserModel = get_user_model()
    try:
        # Decodificar `uidb64` que ya es una cadena str
        uid = urlsafe_base64_decode(uidb64).decode('utf-8')  
        user = UserModel._default_manager.get(pk=uid)
    except (TypeError, ValueError, OverflowError, UserModel.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        if request.method == 'POST':
            form = SetPasswordForm(user, request.POST)
            if form.is_valid():
                form.save()
                update_session_auth_hash(request, user)
                return JsonResponse({'message': 'Contraseña cambiada exitosamente.'}, status=200)
            else:
                return JsonResponse({'error': 'Formulario inválido.'}, status=400)
        else:
            form = SetPasswordForm(user)
        return render(request, 'password_reset_confirm.html', {'form': form})
    else:
        return JsonResponse({'error': 'El enlace de restablecimiento de contraseña es inválido o ha expirado.'}, status=400)
