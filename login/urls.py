from django.urls import path
from . import views

urlpatterns = [
    path('', views.iniciar_sesion, name='vista_login'),
    path('login/', views.login, name='login'),
]
