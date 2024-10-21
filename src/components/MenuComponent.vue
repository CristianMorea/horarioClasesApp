<template>
  <ion-menu content-id="main-content" side="start">
    <ion-content>
      This is the menu content.
      <ion-menu-toggle>
        <ion-button size="large" expand="full" shape="round">idioma</ion-button>
        <ion-button size="large" expand="full" shape="round" @click="goToPerfil">usuario</ion-button>
        <ion-button size="large" expand="full" shape="round">tema</ion-button>
        <ion-button size="large" expand="full" shape="round" @click="handleLogout">cerrar sesión</ion-button>
      </ion-menu-toggle>
    </ion-content>
  </ion-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { IonMenu, IonContent, IonButton, IonMenuToggle, menuController } from '@ionic/vue';

export default defineComponent({
  components: {
    IonMenu,
    IonContent,
    IonButton,
    IonMenuToggle
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const handleLogout = async () => {
      await store.dispatch('logout'); // Llamar a la acción de logout
      router.push('/login'); // Redirigir a la página de inicio de sesión
    };

    const goToPerfil = async () => {
      await menuController.close(); // Cierra el menú
      router.push('/modificar-perfil'); // Redirige a la página de modificar perfil
    };

    return { handleLogout, goToPerfil };
  }
});
</script>

<style scoped>
/* Estilos específicos del componente, si los necesitas */
</style>


  