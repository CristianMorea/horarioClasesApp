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
          <ion-title></ion-title>
          <ion-buttons slot="end">
            <ion-button>
              <ion-icon :icon="searchOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
  
      <!-- Contenido de la página -->
      <ion-content class="ion-padding">
        <!-- Título "PONDERADO" -->
        <div class="ponderado-title">
          PONDERADO
        </div>
  
        <!-- Nota final -->
        <div class="final-note-container">
          <div class="final-note-title">NOTA FINAL</div>
          <div class="final-note-value">0.00</div>
        </div>
  
        <!-- Lista de materias -->
        <ion-list>
          <ion-card v-for="(subject, index) in subjects" :key="index" class="subject-card">
            <ion-item lines="none">
              <ion-avatar slot="start">
                <img src="@/assets/img/icono1.png" />
              </ion-avatar>
              <ion-label>
                <h2>{{ subject.name }}</h2>
                <p>Nota: {{ subject.note }}</p>
              </ion-label>
              <ion-note slot="end">{{ currentTime }}</ion-note>
            </ion-item>
          </ion-card>
        </ion-list>
  
        <!-- Switch para promedio -->
        <ion-item lines="none" class="average-switch">
          <ion-label>PROMEDIO</ion-label>
          <ion-toggle v-model="showAverage"></ion-toggle>
        </ion-item>
      </ion-content>
    </ion-page>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonList,
    IonCard,
    IonItem,
    IonAvatar,
    IonLabel,
    IonNote,
    IonToggle,
  } from '@ionic/vue';
  import { settingsOutline, searchOutline } from 'ionicons/icons';
  
  export default defineComponent({
    components: {
      IonPage,
      IonHeader,
      IonToolbar,
      IonButtons,
      IonButton,
      IonIcon,
      IonTitle,
      IonContent,
      IonList,
      IonCard,
      IonItem,
      IonAvatar,
      IonLabel,
      IonNote,
      IonToggle,
    },
    data() {
      return {
        settingsOutline, // Definición del icono de configuración
        searchOutline, // Definición del icono de búsqueda
        subjects: [
          { name: 'Materia 1', note: '0.00' },
          { name: 'Materia 2', note: '0.00' },
          { name: 'Materia 3', note: '0.00' },
          { name: 'Materia 4', note: '0.00' },
        ],
        currentTime: new Date().toLocaleTimeString(),
        showAverage: false,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Estilos del título "PONDERADO" */
  .ponderado-title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    font-family: 'Comic Sans MS', cursive, sans-serif; /* Estilo divertido como en la imagen */
    margin-top: 10px;
    margin-bottom: 20px;
    color: #555;
  }
  
  /* Estilo para la nota final */
  .final-note-container {
    text-align: center;
    margin: 20px 0;
  }
  
  .final-note-title {
    font-size: 16px;
    color: #9e9e9e;
  }
  
  .final-note-value {
    font-size: 40px;
    color: #9e9e9e;
    font-weight: bold;
  }
  
  /* Estilo para las tarjetas de materias */
  .subject-card {
    --background: #f3f3f3;
    margin-bottom: 10px;
    border-radius: 10px;
  }
  
  ion-label h2 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  ion-label p {
    font-size: 14px;
    color: #888;
  }
  
  /* Estilo del switch de promedio */
  .average-switch {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    font-size: 18px;
  }
  
  ion-toggle {
    --handle-background: #000;
    --background-checked: #000;
  }
  
  ion-button {
    --color: #888;
  }
  
  ion-avatar img {
    border-radius: 50%;
    background: #fff;
    padding: 5px;
  }
  </style>
    