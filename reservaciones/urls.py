from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiciosViewSet, CitasViewSet, CitasServiciosSerializerViewSet, CitasDetallesView

router = DefaultRouter()
router.register(r'servicios', ServiciosViewSet)
router.register(r'citas', CitasViewSet)
router.register(r'citas-servicios', CitasServiciosSerializerViewSet)

urlpatterns = [

    path('api/', include(router.urls)),
    path('citas/detalles/', CitasDetallesView.as_view(), name='citas_detalles'),
]
