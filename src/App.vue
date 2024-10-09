<template>
  <ion-app>
    <!-- Añade una clave para asegurar la reactividad al cambiar de rutas -->
    <ion-router-outlet :key="$route.fullPath" />
  </ion-app>
</template>

<script setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import './assets/styles/styles.css';
</script>
