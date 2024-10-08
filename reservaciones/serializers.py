from datetime import date
from django.db.models import Sum
from rest_framework import serializers
from .models import Servicios, Citas, CitasServicios


class ServiciosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicios
        fields = '__all__'


class CitasSerializer(serializers.ModelSerializer):
    servicios = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Citas
        fields = ['id', 'fecha', 'hora', 'usuarioid', 'servicios']

    def validate_fecha(self, value):
        if value < date.today():
            raise serializers.ValidationError(
                'La fecha no puede ser anterior a la fecha actual')
        return value

    def create(self, validated_data):
        servicios_ids = validated_data.pop('servicios', [])
        cita = Citas.objects.create(**validated_data)

        for servicio_id in servicios_ids:
            CitasServicios.objects.create(
                citaid=cita, serviciod_id=servicio_id)

        return cita


class CitasServiciosSerializer(serializers.ModelSerializer):
    class Meta:
        model = CitasServicios
        fields = '__all__'


class CitasDetallesSerializer(serializers.ModelSerializer):
    cliente = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    telefono = serializers.SerializerMethodField()
    servicio_nombre = serializers.SerializerMethodField()
    servicio_precio = serializers.SerializerMethodField()
    total_precio = serializers.SerializerMethodField()

    class Meta:
        model = Citas
        fields = ['id', 'hora', 'fecha', 'cliente', 'email',
                  'telefono', 'servicio_nombre', 'servicio_precio', 'total_precio']

    def get_cliente(self, obj):
        return f"{obj.usuarioid.nombre} {obj.usuarioid.apellido}"

    def get_email(self, obj):
        return obj.usuarioid.email

    def get_telefono(self, obj):
        return obj.usuarioid.telefono

    def get_servicio_nombre(self, obj):
        return list(CitasServicios.objects.filter(citaid=obj).values_list('serviciod__nombre', flat=True))

    def get_servicio_precio(self, obj):
        # Convertimos los precios a cadenas con dos decimales
        precios = CitasServicios.objects.filter(
            citaid=obj).values_list('serviciod__precio', flat=True)
        return [f"{precio:.3f}" for precio in precios]

    def get_total_precio(self, obj):
        total = CitasServicios.objects.filter(citaid=obj).aggregate(
            total=Sum('serviciod__precio'))['total']
        return f'{total:.3f}'  # Formato de tres decimales para el total
