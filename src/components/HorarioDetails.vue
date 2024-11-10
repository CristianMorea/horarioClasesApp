<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Detalles de la Clase</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content v-if="clase">
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ clase.nombre }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p><strong>Día:</strong> {{ clase.horarios_clases[0]?.dia_de_clase || 'No disponible' }}</p>
          <p><strong>Hora:</strong> {{ clase.hora_inicio }} - {{ clase.hora_fin }}</p>
          <p v-if="clase.ubicacion"><strong>Ubicación:</strong> {{ clase.ubicacion }}</p>
          <p v-if="clase.profesor"><strong>Profesor:</strong> {{ clase.profesor.nombre }}</p>
        </ion-card-content>
      </ion-card>

      <!-- Botones de Modificar y Cerrar -->
      <ion-button expand="full" @click="editarHorario">Modificar</ion-button>
      <ion-button expand="full" color="secondary" @click="configurarRecordatorio">Configurar Recordatorio</ion-button>
      <ion-button expand="full" color="primary" @click="cerrarDetalle">Cerrar</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // Añadido useRouter para redirigir
import supabase from '../supabase';

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter(); // Inicializar el router
    const clase = ref(null);

    const cargarClase = async () => {
      const { id } = route.params; // Obtener el ID de la clase desde la URL
      const { data, error } = await supabase
        .from('clases')
        .select('*, horarios_clases(dia_de_clase)')
        .eq('id', id)
        .single(); // Obtener una sola clase

      if (!error) {
        clase.value = data;
      }
    };

    // Función para redirigir a la vista de edición
    const editarHorario = () => {
      router.push(`/horarioeditar`); // Cambia la ruta según tu estructura de rutas
    };

    // Función para redirigir a la vista de configuración de recordatorio
    const configurarRecordatorio = () => {
      router.push(`/configurar-recordatorio/${clase.value.id}`); // Pasar el ID de la clase
    };

    // Función para cerrar los detalles y volver al listado
    const cerrarDetalle = () => {
      router.push('/'); // Cambia la ruta a donde quieres redirigir al cerrar
    };

    onMounted(() => {
      cargarClase(); // Cargar los detalles de la clase al montar la vista
    });

    return {
      clase,
      editarHorario,
      configurarRecordatorio,
      cerrarDetalle,
    };
  },
});
</script>

