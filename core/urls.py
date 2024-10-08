from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('login.urls')),
    path('cerrar_sesion/', include('logout.urls')),
    path('registrar/', include('register.urls')),
    path('olvide/', include('olvidePassword.urls')),

    # endpoint para citas
    path('dashboard/', include('citas.urls')),
    path('citas/', include('admin_custom.urls')),

    # API servicios
    path('reservaciones/', include('reservaciones.urls')),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
