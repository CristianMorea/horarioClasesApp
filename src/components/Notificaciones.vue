<template>
    <ion-menu side="end" content-id="main-content" menu-id="notificaciones-menu">
     <ion-header>
        <ion-toolbar>
          <ion-title class="text-center text-2xl font-bold custom-title">NOTIFICACIONES</ion-title>
        </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding" >
      <div class="scrollable-content">
      <ion-card v-for="recordatorio in recordatorios" :key="recordatorio.id" class="recordatorio-card ">
      <ion-card-header>
        <ion-card-title>Clase: {{ recordatorio.clase_id?.nombre || 'Sin nombre' }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <p>Hora: {{ recordatorio.tiempo_recordatorio }}</p>
      </ion-card-content>
    </ion-card>
    <p v-if="recordatorios.length === 0">No tienes recordatorios pendientes.</p>
  </div>
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
@import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');

body {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente a todo el cuerpo */
}

ion-title, ion-label, ion-button, ion-item, ion-card-title, ion-card-content {
  font-family: 'Architects Daughter', cursive;
}

.scrollable-content {
  border: 3px solid transparent;
  max-height: 785px; /* Ajusta la altura máxima de la lista de materias */
  overflow-y: auto;  /* Habilita el scroll solo verticalmente */
  padding-right: 10px; /* Agrega un poco de espacio si es necesario para la barra de desplazamiento */
  border-radius: 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  padding: 0px;
  margin-left: -10px;
  margin-right: -10px;
  margin-top: -7px;
  background-color: transparent;
}

.recordatorio-card {
margin: 10px;
padding: 10px;
}

.custom-title{
  font-size: 1.0em; 
}
</style>
