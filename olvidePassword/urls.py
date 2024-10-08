from django.urls import path
from . import views

urlpatterns = [
    path('', views.vista_olvide_password, name='vista_olvide_password'),
    path('recuperar/', views.recuperar_password, name='recuperar_password'),
    path('password_reset/<uidb64>/<token>/', views.password_reset_confirm, name='password_reset_confirm')
]
