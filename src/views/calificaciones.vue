<template>
  <ion-page>
    <!-- Componente del menú -->
    <MenuComponent />

    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title class="text-center text-2xl font-bold custom-title">CALIFICACIONES</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content >
      <!-- Componente de la tarjeta -->
      <CardCalificaciones/>
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
@import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');

body {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente a todo el cuerpo */
}

.custom-title {
    font-family: "Architects Daughter", cursive;
  }

ion-title, ion-label, ion-button, ion-item, ion-card-title, ion-card-content {
  font-family: 'Architects Daughter', cursive;
}

</style>

