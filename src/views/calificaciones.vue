<template>
  <ion-page>
    <!-- Componente del menú -->
    <MenuComponent />

    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Calificaciones</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Componente de la tarjeta -->
      <CardCalificaciones />
    </ion-content>

    <!-- Componente de la barra de navegación -->
    <TabBar />
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent } from '@ionic/vue';
import MenuComponent from '@/components/MenuComponent.vue'; // Verifica que la ruta sea correcta
import CardCalificaciones from '@/components/CardCalificaciones.vue'; // Verifica que la ruta sea correcta
import TabBar from '@/components/TabBar.vue'; // Verifica que la ruta sea correcta

export default defineComponent({
  name: 'CalificacionesPage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonContent,
    MenuComponent,
    CardCalificaciones,
    TabBar,
  },
});
</script>

<style scoped>
/* Agrega estilos específicos aquí si son necesarios */
</style>
