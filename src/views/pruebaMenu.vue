<template>
    <ion-page>
      <MenuComponent />
      <ion-header>
        <ion-toolbar>
          <ion-title>Vista Principal</ion-title>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content id="main-content">
        <h1>Bienvenido a la vista principal</h1>
        <!-- Otro contenido -->
      </ion-content>
    </ion-page>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import MenuComponent from '../components/MenuComponent.vue';
  
  export default defineComponent({
    components: {
      MenuComponent
    }
  });
  </script>
  