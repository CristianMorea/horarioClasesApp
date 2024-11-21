<template>
  <ion-page>
    <MenuComponent />
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Inicio</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content id="main-content">
      Tap the button in the toolbar to open the menu.
      <div id="container">
        <strong>Ready to create an app?</strong>
        <p>Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent } from '@ionic/vue'; // Importa los componentes necesarios
import MenuComponent from '../components/MenuComponent.vue';

export default defineComponent({
  components: {
    MenuComponent,
    IonPage,       // Asegúrate de importar IonPage
    IonHeader,     // Asegúrate de importar IonHeader
    IonToolbar,    // Asegúrate de importar IonToolbar
    IonTitle,      // Asegúrate de importar IonTitle
    IonButtons,    // Asegúrate de importar IonButtons
    IonMenuButton, // Asegúrate de importar IonMenuButton
    IonContent,    // Asegúrate de importar IonContent
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


