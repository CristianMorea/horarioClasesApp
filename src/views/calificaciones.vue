<template>
  <ion-page>
    <MenuComponent />
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Calificaciones</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content id="main-content">
      <!-- Coloca el componente de la tarjeta aquí -->
      <CardCalificaciones />
    </ion-content>
    <TabBar />
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent } from '@ionic/vue'; 
import MenuComponent from '../components/MenuComponent.vue'; // Importa el menú
import CardCalificaciones from '../components/CardCalificaciones.vue'; // Importa la tarjeta
import TabBar from '../components/TabBar.vue';

export default defineComponent({
  components: {
    TabBar,
    MenuComponent,
    CardCalificaciones, // Asegúrate de que este sea el nombre correcto del componente
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonContent,
  },
});
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
</style>
