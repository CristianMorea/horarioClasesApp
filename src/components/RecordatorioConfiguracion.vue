<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="$router.push('/horario')" color="primary">
            <img src='@/assets/img/back.png' name="arrow-back" alt="Botón Horario" style="width: 24px; height: 24px;" />
          </ion-button>
        </ion-buttons>
        <ion-title class="text-center text-2xl font-bold custom-title">RECORDATORIO</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card class="recordatorio-card">
        <ion-card-header>
          <ion-card-title>Configura tu recordatorio</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label position="stacked">Selecciona la hora</ion-label>
            <ion-input
              v-model="horaSeleccionada"
              type="time"  
              @ionChange="onHoraChange"
            ></ion-input>
          </ion-item>
          <ion-button class="butonR" @click="guardarRecordatorio">Guardar Recordatorio</ion-button>
          <p v-if="mensaje">{{ mensaje }}</p>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import supabase from '@/supabase';

// Importación de componentes de Ionic
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const horaSeleccionada = ref(''); // Hora seleccionada por el usuario
    const mensaje = ref(''); // Mensaje para el usuario

    // Verificar sesión al montar el componente
    onMounted(async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        console.error('Error al obtener la sesión:', error);
        router.push('/');
        return;
      }
    });

    // Método para manejar el cambio en la hora seleccionada
    const onHoraChange = (event: Event) => {
      const valor = (event.target as HTMLInputElement).value;
      console.log('Hora seleccionada:', valor);
      horaSeleccionada.value = valor;
    };

    const guardarRecordatorio = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        console.log('No hay sesión activa, redirigiendo...');
        router.push('/');
        return;
      }

      if (!horaSeleccionada.value) {
        mensaje.value = 'Por favor selecciona una hora para el recordatorio.';
        return;
      }

      const { user } = sessionData.session;

      // Log para verificar los valores
      console.log('Hora seleccionada para el recordatorio:', horaSeleccionada.value);

      // Intentar insertar el recordatorio en la base de datos
      const { error } = await supabase
        .from('recordatorios')
        .insert([{ 
          clase_id: route.params.id, 
          usuario_id: user.id, 
          tiempo_recordatorio: horaSeleccionada.value // Asegúrate de usar solo la hora
        }]);

      if (error) {
        console.error('Error al guardar el recordatorio:', error);
        mensaje.value = `Error al guardar el recordatorio: ${error.message}`;
      } else {
        mensaje.value = 'Recordatorio guardado con éxito.';
      }
    };

    return {
      horaSeleccionada,
      mensaje,
      guardarRecordatorio,
      onHoraChange,
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

.butonR {
  color: white;
}

ion-button {
  --background: #a22626;
  --background-activated: #a22626;
  --border-radius: 20px;
  margin-top: 1rem;
}

.recordatorio-card {
  border: 2px solid #a32323; /* Borde rojo */
  border-radius: 10px; /* Bordes redondeados */
  padding: 16px; /* Espaciado interno */
}

.custom-title {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente al título */
}

.text-materia {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente a los títulos de las materias */
}

.text-ponde {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente a los títulos de las materias */
}
</style>



