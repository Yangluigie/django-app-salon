from django.contrib import admin
from .models import Servicios, Citas, CitasServicios


class ServiciosAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'precio']


class CitasAdmin(admin.ModelAdmin):
    list_display = ['fecha', 'hora', 'usuarioid']


class CitasServiciosAdmin(admin.ModelAdmin):
    list_display = ['cita', 'servicio']
    list_filter = ['citaid', 'serviciod']
    search_fields = ['citaid__id', 'serviciod__nombre']

    def cita(self, obj):
        return f'Cita {obj.citaid.id} - Fecha {obj.citaid.fecha}'

    def servicio(self, obj):
        return f'Servicio {obj.serviciod.nombre} - Precio {obj.serviciod.precio}'

    cita.short_description = 'Cita'
    servicio.short_description = 'Servicio'


admin.site.register(Servicios, ServiciosAdmin)
admin.site.register(Citas, CitasAdmin)
admin.site.register(CitasServicios, CitasServiciosAdmin)
