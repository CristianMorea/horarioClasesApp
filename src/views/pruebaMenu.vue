<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <p>Bienvenido a la página de inicio.</p>
    </ion-content>
    <TabBar />
  </ion-page>
</template>

<script>
import TabBar from '../components/TabBar.vue';
import {IonPage,IonHeader,IonToolbar,IonContent,IonTitle } from '@ionic/vue';

export default {
  components: {
    TabBar,
    IonPage,
    IonHeader,
    IonToolbar,
    IonContent,
    IonTitle
  },
};
</script>


