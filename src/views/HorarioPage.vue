<template>
  <ion-page class="h-screen bg-white">
    <ion-header>
      <ion-toolbar>
        <ion-title class="text-center text-2xl font-bold text-white">Mi Horario</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="clases-container" v-if="clases.length > 0">
        <ion-item v-for="(clase, index) in clases" :key="index" class="item-clase" @click="verDetalle(clase.id)">
          <ion-label>
            <h2 class="text-lg font-bold text-white">{{ clase.nombre.toUpperCase() }}</h2>
            <p class="text-gray-300"><strong>Día:</strong> {{ clase.horarios_clases[0]?.dia_de_clase }}</p>
            <p class="text-gray-300"><strong>Hora:</strong> {{ clase.hora_inicio }} - {{ clase.hora_fin }}</p>
            <p v-if="clase.ubicacion" class="text-gray-300"><strong>Ubicación:</strong> {{ clase.ubicacion }}</p>
            <p v-if="clase.profesor" class="text-gray-300"><strong>Profesor:</strong> {{ clase.profesor.nombre }}</p>
          </ion-label>
        </ion-item>
      </div>

      <ion-card v-else>
        <ion-card-header>
          <ion-card-title class="text-center">Sin Clases Programadas</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p class="text-center">No tienes clases programadas en este momento.</p>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import supabase from '@/supabase';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue';

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  },
  setup() {
    const clases = ref([]);  // Lista de clases existentes
    const mensaje = ref('');
    const router = useRouter(); // Obtener el enrutador

    const cargarHorario = async () => {
      const { data, error } = await supabase
        .from('clases')
        .select(`
          *,
          horarios_clases (dia_de_clase)  /* Join con la tabla de horarios */
        `);

      if (error) {
        mensaje.value = 'Error al cargar el horario: ' + error.message;
      } else if (data.length === 0) {
        mensaje.value = 'No tienes clases programadas en este momento.';
      } else {
        clases.value = data;
      }
    };

    const verDetalle = (id) => {
      router.push(`/horariodetails/:id`); // Cambia esta ruta si es necesario
    };

    onMounted(() => {
      cargarHorario();  // Cargar las clases al montar la vista
    });

    return {
      clases,
      mensaje,
      verDetalle,
    };
  },
});
</script>

<style scoped>
.clases-container {
  padding: 10px; /* Espacio alrededor de las materias */
}

.item-clase {
  border-radius: 10px; /* Borde redondeado de cada materia */
  background-color: #444444; /* Color de fondo para las materias */
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Sombra más ligera */
  overflow: hidden; /* Para que el contenido no sobresalga del borde redondeado */
  color: white; /* Color del texto dentro del item-clase */
}

.ion-page {
  background-color: #f0f0f0; /* Color de fondo */
}
</style>
