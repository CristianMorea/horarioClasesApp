<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="text-center text-2xl font-bold custom-title">DETALLES</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content v-if="clase">
      <ion-card class="custom-card">
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

      <!-- Contenedor de botones -->
      <div class="button-container">
        <ion-button class="rounded-button" @click="editarHorario">Modificar</ion-button>
        <ion-button class="rounded-button" @click="configurarRecordatorio">Configurar Recordatorio</ion-button>
        <ion-button class="rounded-button small-button" @click="cerrarDetalle">Cerrar</ion-button>
      </div>
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
        .select('*, horarios_clases(dia_de_clase)') // Obtiene los datos de la clase y horarios
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');

/* Fuente personalizada */
body {
  font-family: 'Architects Daughter', cursive;
}

ion-title, ion-label, ion-button, ion-item, ion-card-title, ion-card-content {
  font-family: 'Architects Daughter', cursive;
}


/* Estilo del ion-card */
.custom-card {
  --background: transparent;
  border: 2px solid #bb2a2a;
  border-radius: 20px;
}

.custom-card ion-card-title {
  color: #bb2a2a;
  text-transform: uppercase; /* Convierte el texto a mayúsculas */
  font-weight: bold; 
}

/* Contenedor de los botones */
.button-container {
  display: flex;
  flex-direction: column; /* Alinea botones verticalmente */
  align-items: center; /* Centra horizontalmente */
  margin-top: 20px; /* Espaciado superior */
}

/* Botones personalizados */
.rounded-button {
  margin-bottom: 10px; /* Espacio entre botones */
  --background: #bb2a2a;
  --color: white; /* Texto blanco */
  width: 80%; /* Ancho del botón */
  max-width: 300px; /* Ancho máximo del botón */
  text-align: center;
}
</style>
