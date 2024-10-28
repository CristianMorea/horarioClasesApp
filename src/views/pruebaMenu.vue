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

    <ion-content id="main-content" class="ion-padding">
      <!-- Banner o título de bienvenida -->
      <div class="banner">
        <h2>¡Bienvenido a la App!</h2>
        <p>Explora todas las funcionalidades</p>
      </div>

      <!-- Grilla de funcionalidades -->
      <ion-grid>
        <ion-row>
          <ion-col size="6">
            <ion-card button @click="goToFeature('configurarRecordatorios')">
              <ion-icon name="alarm-outline" class="feature-icon"></ion-icon>
              <ion-card-content>Configurar Recordatorios</ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="6">
            <ion-card button @click="goToFeature('gestionUsuarios')">
              <ion-icon name="person-circle-outline" class="feature-icon"></ion-icon>
              <ion-card-content>Gestión de Usuarios</ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="6">
            <ion-card button @click="goToFeature('explorarEventos')">
              <ion-icon name="calendar-outline" class="feature-icon"></ion-icon>
              <ion-card-content>Explorar Eventos</ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="6">
            <ion-card button @click="goToFeature('perfilUsuario')">
              <ion-icon name="settings-outline" class="feature-icon"></ion-icon>
              <ion-card-content>Perfil de Usuario</ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonIcon,
} from '@ionic/vue';
import MenuComponent from '../components/MenuComponent.vue';

export default defineComponent({
  components: {
    MenuComponent,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonIcon,
  },
  setup() {
    const router = useRouter();
    const goToFeature = (feature: string) => {
      router.push({ name: feature });
    };
    return { goToFeature };
  },
});
</script>

<style scoped>
#main-content {
  background-color: #f5f5f5;
}

.banner {
  text-align: center;
  margin: 20px 0;
}

.banner h2 {
  color: #3b82f6;
  font-size: 1.8em;
}

.banner p {
  color: #666;
  font-size: 1em;
}

.feature-icon {
  font-size: 3em;
  color: #3b82f6;
}

ion-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  text-align: center;
  color: #333;
  --background: #ffffff;
  --ion-card-border-color: #e0e0e0;
}

ion-card-content {
  font-size: 0.9em;
  font-weight: bold;
}

ion-card:hover {
  --background: #e3f2fd;
}
</style>
