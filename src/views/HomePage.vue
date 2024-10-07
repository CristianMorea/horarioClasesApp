<template>
  <ion-menu content-id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Opciones</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      This is the menu content.
      <ion-menu-toggle>
        <ion-button size="large" expand="full" shape="round">idioma</ion-button>
        <ion-button size="large" expand="full" shape="round">usuario</ion-button>
        <ion-button size="large" expand="full" shape="round">tema</ion-button>
        <ion-button size="large" expand="full" shape="round" @click="handleLogout">cerrar cesion</ion-button>  
      </ion-menu-toggle>
    </ion-content>
  </ion-menu>

  <ion-page id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Menu</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding"> Tap the button in the toolbar to open the menu. </ion-content>
    <div id="container">
      <strong>Ready to create an app?</strong>
      <p>Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
    </div>
    <ion-buttons slot="end">
      <ion-button @click="handleLogout">Cerrar sesión</ion-button>
    </ion-buttons>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { IonMenuToggle, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';

export default defineComponent({
  components: {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenu,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonMenuToggle,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const handleLogout = async () => {
      await store.dispatch('logout'); // Llamar a la acción de logout
      router.push('/login'); // Redirigir a la página de inicio de sesión
    };

    return { handleLogout };
  }
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

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}

ion-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}
</style>
