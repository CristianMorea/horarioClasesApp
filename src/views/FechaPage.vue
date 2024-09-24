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
          <ion-title>PERFIL</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content>
        <!-- Selección de Fecha -->
        <div class="fecha-container">
          <ion-item>
            <ion-label>Select date</ion-label>
            <ion-datetime display-format="DDD, MMM D" v-model="selectedDate"></ion-datetime>
          </ion-item>
        </div>
  
        <!-- Eventos -->
        <div class="eventos-container">
          <ion-card>
            <ion-card-header>
              <ion-card-title>Eventos para {{ selectedDate }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-list>
                <ion-item v-for="event in events[selectedDate]" :key="event">
                  {{ event }}
                </ion-item>
              </ion-list>
            </ion-card-content>
          </ion-card>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonDatetime, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem as IonListItem } from '@ionic/vue';
  import { settingsOutline} from 'ionicons/icons';

  export default defineComponent({
    components: {
      IonPage,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonContent,
      IonItem,
      IonLabel,
      IonDatetime,
      IonGrid,
      IonRow,
      IonCol,
      IonCard,
      IonCardHeader,
      IonCardTitle,
      IonCardContent,
      IonList,
      IonListItem,
    },
    setup() {
      const selectedDate = ref('');
      const events = ref({
        '2023-08-17': ['Evento 1', 'Evento 2'],
        '2023-08-18': ['Evento 3'],
        // Agrega más eventos según sea necesario
      });
  
      const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      const calendar = [
        [1, 2, 3, 4, 5, 6, 7],
        [8, 9, 10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19, 20, 21],
        [22, 23, 24, 25, 26, 27, 28],
        [29, 30, 31]
      ];
  
      const selectDate = (date) => {
        selectedDate.value = `2023-08-${date < 10 ? '0' + date : date}`;
      };
  
      return {
        settingsOutline, // Definición del icono de configuración
        selectedDate,
        events,
        days,
        calendar,
        selectDate,
      };
    },
  });
  </script>
  
  <style scoped>
  .fecha-container {
    padding: 16px;
  }
  
  .calendario-container {
    padding: 16px;
  }
  
  ion-col {
    text-align: center;
    padding: 8px;
  }
  
  ion-col:nth-child(7n+1) {
    color: red; /* Domingo */
  }
  
  .eventos-container {
    padding: 16px;
  }
  </style>
  