<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="$router.push('/horario')" color="primary">
            <img src='@/assets/img/back.png' name="arrow-back" alt="Botón Horario" style="width: 24px; height: 24px;" />
          </ion-button>
        </ion-buttons>
        <ion-title class="text-center text-2xl font-bold custom-title">NOTA</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card class="recordatorio-card">
        <ion-card-header>
          <ion-card-title>Configura tu nota</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label position="stacked">Escribe tu nota</ion-label>
            <ion-input
              v-model="nota"
              type="text"  
              @ionChange="onNotaChange"
            ></ion-input>
          </ion-item>
          <ion-button class="butonR" @click="guardarNota">Guardar Nota</ion-button>
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
import { v4 as uuidv4 } from 'uuid'; // Importar la librería para generar UUID

import {
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
} from '@ionic/vue';

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
    const nota = ref('');
    const mensaje = ref('');

    onMounted(async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        console.error('Error al obtener la sesión:', error);
        router.push('/');
        return;
      }
    });

    const onNotaChange = (event: Event) => {
      const valor = (event.target as HTMLInputElement).value;
      nota.value = valor;
    };

    const guardarNota = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        router.push('/');
        return;
      }

      if (!nota.value) {
        mensaje.value = 'Por favor ingresa la nota.';
        return;
      }

      const { error } = await supabase
        .from('Notas')
        .insert([
          {
            id: uuidv4(),  // Generar un UUID para el id
            nota: nota.value, // Solo insertamos la nota
          },
        ]);

      if (error) {
        console.error('Error al guardar la nota:', error);
        mensaje.value = `Error al guardar la nota: ${error.message}`;
      } else {
        mensaje.value = 'Nota guardada con éxito.';
        nota.value = ''; // Limpiar el campo de la nota después de guardar
      }
    };

    return {
      nota,
      mensaje,
      guardarNota,
      onNotaChange,
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
