from django.urls import path
from . import views

urlpatterns = [
    path('citas/', views.citas, name='citas'),
]
