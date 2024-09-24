<template>
    <ion-page>
      <!-- Header con el engranaje y el icono de búsqueda -->
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button>
              <ion-icon :icon="settingsOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title>CALENDARIO</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content>
      <!-- Selección de Fecha y Eventos -->
      <div class="fecha-eventos-container">
        <ion-item>
          <ion-datetime display-format="DDD, MMM, D" v-model="selectedDate" ></ion-datetime>
          <ion-card-header>
            <ion-card-title>Eventos para {{ selectedDate }}</ion-card-title>
          </ion-card-header>
        </ion-item>
        <ion-card-content>
              <ion-item v-for="event in events[selectedDate]" :key="event">
                {{ event }}
              </ion-item>
          </ion-card-content>
      </div>
      
                <!-- Nota -->
                <div class="nota-container">
          <ion-item>
            <ion-label>Nota: </ion-label>
            <ion-textarea v-model="note" placeholder=" Escribe tu nota aquí"></ion-textarea>
          </ion-item>
          <ion-button expand="block" @click="saveNote">Guardar</ion-button>
        </div>

        <!-- Notas Guardadas -->
        <div class="notas-guardadas-container">
          <ion-card>
            <ion-card-header>
              <ion-card-title>Guardadas</ion-card-title>
            </ion-card-header>
                <ion-item v-for="(notes, date) in events" :key="date">
                  <ion-label>
                    <h2>{{ date }}</h2>
                    <p v-for="note in notes" :key="note">{{ note }}</p>
                  </ion-label>
                </ion-item>
          </ion-card>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonDatetime, IonTextarea, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem as IonListItem, IonButton, IonIcon, IonButtons } from '@ionic/vue';
  import { settingsOutline } from 'ionicons/icons';
  
  export default defineComponent({
    name: 'PerfilPage',
    components: {
      IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonDatetime, IonTextarea, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonListItem, IonButton, IonIcon, IonButtons
    },
    setup() {
      const selectedDate = ref('');
      const note = ref('');
      const events = ref<{ [key: string]: string[] }>({});
  
      const saveNote = () => {
        if (selectedDate.value) {
          if (!events.value[selectedDate.value]) {
            events.value[selectedDate.value] = [];
          }
          events.value[selectedDate.value].push(note.value);
          note.value = ''; // Limpiar la nota después de guardarla
        }
      };
  
      return {
        selectedDate,
        note,
        events,
        saveNote,
        settingsOutline
      };
    }
  });
  </script>
  
  <style scoped>
  .fecha-container, .nota-container, .eventos-container, .notas-guardadas-container {
    margin: 20px;
  }
  
  .nota-container ion-button {
    margin-top: 10px;
  }
  </style>
  