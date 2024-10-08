from django.urls import path
from . import views

urlpatterns = [
    path('', views.register, name='registrarme'),
    path('crear/', views.crear, name='crear'),
]
