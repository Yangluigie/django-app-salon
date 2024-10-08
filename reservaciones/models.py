from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from decimal import Decimal


class Servicios(models.Model):
    nombre = models.CharField(max_length=100)
    precio = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        validators=[MinValueValidator(Decimal('0.000'))]
    )

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Servicio"
        verbose_name_plural = "Servicios"


class Citas(models.Model):
    fecha = models.DateField()
    hora = models.TimeField()
    usuarioid = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f'Fecha: {self.fecha} --- Hora: {self.hora}'

    class Meta:
        verbose_name = "Cita"
        verbose_name_plural = "Citas"


class CitasServicios(models.Model):
    citaid = models.ForeignKey(Citas, on_delete=models.CASCADE)
    serviciod = models.ForeignKey(Servicios, on_delete=models.CASCADE)

    def __str__(self):
        return f'Cita {self.citaid.id} - Servicio {self.serviciod.nombre}'

    class Meta:
        verbose_name = "Cita y Servicio"
        verbose_name_plural = "Citas y Servicios"
