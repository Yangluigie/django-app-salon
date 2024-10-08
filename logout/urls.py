from django.urls import path
from . import views

urlpatterns = [
    path('logout/', views.logout, name='cerrar_sesion'),
]
