from rest_framework import viewsets
from django.db.models import Prefetch
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.reverse import reverse
from django.http import HttpResponseForbidden
from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated
from django.utils.dateparse import parse_date
from .models import Servicios, Citas, CitasServicios
from .serializers import ServiciosSerializer, CitasSerializer, CitasServiciosSerializer, CitasDetallesSerializer


class ServiciosViewSet(viewsets.ModelViewSet):
    queryset = Servicios.objects.all()
    serializer_class = ServiciosSerializer


class CitasViewSet(viewsets.ModelViewSet):
    queryset = Citas.objects.all()
    serializer_class = CitasSerializer

    # Puedes redefinir el método destroy si necesitas lógica personalizada
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'message': 'Cita eliminada exitosamente'}, status=status.HTTP_204_NO_CONTENT)


class CitasServiciosSerializerViewSet(viewsets.ModelViewSet):
    queryset = CitasServicios.objects.all()
    serializer_class = CitasServiciosSerializer


class CitasDetallesView(APIView):

    def get(self, request):
        fecha = request.query_params.get('fecha', None)

        if fecha:
            # Convertimos el string de la fecha en un objeto date
            fecha_parsed = parse_date(fecha)
            if fecha_parsed is None:
                return Response({'error': 'Formato de fecha inválido. Usa AAAA-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)

            # Filtramos las citas según la fecha
            citas = Citas.objects.filter(fecha=fecha_parsed).prefetch_related(
                Prefetch('citasservicios_set', queryset=CitasServicios.objects.select_related(
                    'serviciod'))
            ).select_related('usuarioid')

            if not citas.exists():
                return Response({'error': 'No se encontraron citas para esta fecha'}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Si no se proporciona fecha, devolvemos todas las citas
            citas = Citas.objects.prefetch_related(
                Prefetch('citasservicios_set', queryset=CitasServicios.objects.select_related(
                    'serviciod'))
            ).select_related('usuarioid')

        # Serializamos las citas y las devolvemos
        serializer = CitasDetallesSerializer(citas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Vista personalizada para la interfaz de navegación de DRF


class CustomBrowsableAPIRoot(APIView):

    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_staff:
            return HttpResponseForbidden("No tienes permiso para acceder a esta interfaz.")

        # Proporcionar un enlace a la interfaz de navegación
        return Response({
            "api_root": reverse('api-root', request=request),
            "servicios": reverse('servicios-list', request=request),
            "citas": reverse('citas-list', request=request),
            "citas-servicios": reverse('citas-servicios-list', request=request),
            "citas-detalles": reverse('citas_detalles', request=request),
        })
