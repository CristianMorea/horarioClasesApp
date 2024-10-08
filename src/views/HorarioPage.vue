<template>
  <ion-page class="h-screen bg-white">
    <ion-header>
      <ion-toolbar>
        <ion-title>Mi Horario</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Lista de clases programadas -->
      <ion-card v-if="clases.length > 0">
        <ion-card-header>
          <ion-card-title>Horario de Clases</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item v-for="(clase, index) in clases" :key="index">
            <ion-label>
              <h2>{{ clase.nombre }}</h2>
              <p><strong>Día:</strong> {{ clase.horarios_clases[0]?.dia_de_clase }}</p> <!-- Mostrar el día de la clase -->
              <p><strong>Hora:</strong> {{ clase.hora_inicio }} - {{ clase.hora_fin }}</p>
              <p v-if="clase.ubicacion"><strong>Ubicación:</strong> {{ clase.ubicacion }}</p>
              <p v-if="clase.profesor"><strong>Profesor:</strong> {{ clase.profesor.nombre }}</p>
            </ion-label>
          </ion-item>
        </ion-card-content>
      </ion-card>

      <!-- Mensaje si no hay clases -->
      <ion-card v-else>
        <ion-card-header>
          <ion-card-title>Sin Clases Programadas</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>No tienes clases programadas en este momento.</p>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
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

    const cargarHorario = async () => {
      const { data, error } = await supabase
        .from('clases')
        .select(`
          *,
          horarios_clases(dia_de_clase)  /* Join con la tabla de horarios */
        `);

      if (error) {
        mensaje.value = 'Error al cargar el horario: ' + error.message;
      } else if (data.length === 0) {
        mensaje.value = 'No tienes clases programadas en este momento.';
      } else {
        clases.value = data;
      }
    };

    onMounted(() => {
      cargarHorario();  // Cargar las clases al montar la vista
    });

    return {
      clases,
      mensaje,
    };
  },
});
</script>
