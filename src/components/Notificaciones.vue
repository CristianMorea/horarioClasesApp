<template>
    <ion-menu side="end" content-id="main-content" menu-id="notificaciones-menu">
     <ion-header>
        <ion-toolbar>
          <ion-title class="text-center text-2xl font-bold custom-title">NOTIFICACIONES</ion-title>
        </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" >
      <ion-card v-for="recordatorio in recordatorios" :key="recordatorio.id" class="recordatorio-card">
      <ion-card-header>
        <ion-card-title>Clase: {{ recordatorio.clase_id?.nombre || 'Sin nombre' }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <p>Hora: {{ recordatorio.tiempo_recordatorio }}</p>
      </ion-card-content>
    </ion-card>
    <p v-if="recordatorios.length === 0">No tienes recordatorios pendientes.</p>

    </ion-content>
  </ion-menu>

</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { IonButtons,IonMenuButton,IonMenu,IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue';
import supabase from '@/supabase';

export default defineComponent({
components: {
  IonButtons,
  IonMenuButton,
  IonMenu,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
},
setup() {
  const recordatorios = ref([]); // Lista de recordatorios del usuario

  const obtenerRecordatorios = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      console.error('Error al obtener la sesión:', sessionError);
      return;
    }

    const { user } = sessionData.session;

    // Consulta los recordatorios del usuario
    const { data, error } = await supabase
      .from('recordatorios')
      .select(`id, clase_id (nombre), tiempo_recordatorio`) // Ajusta según las columnas de tu tabla
      .eq('usuario_id', user.id);

    if (error) {
      console.error('Error al obtener los recordatorios:', error);
      return;
    }

    recordatorios.value = data || [];
  };

  onMounted(() => {
    obtenerRecordatorios();
  });

  return {
    recordatorios,
  };
},
});
</script>

<style scoped>
.recordatorio-card {
margin: 10px;
padding: 10px;
}
</style>
