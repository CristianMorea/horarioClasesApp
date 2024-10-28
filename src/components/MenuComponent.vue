<template>
  <ion-menu content-id="main-content" side="start" class="custom-menu">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title class="menu-title">Menú</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="menu-content">
      <ion-list>
        <ion-menu-toggle>
          <ion-item button @click="goToPerfil">
            <ion-icon slot="start" name="person-circle-outline"></ion-icon>
            <ion-label>Perfil</ion-label>
          </ion-item>
          <ion-item button>
            <ion-icon slot="start" name="language-outline"></ion-icon>
            <ion-label>Idioma</ion-label>
          </ion-item>
          <!-- Aquí el botón de tema -->
          <ion-item button @click="toggleTheme">
            <ion-icon slot="start" :name="isDarkMode ? 'sunny-outline' : 'moon-outline'"></ion-icon>
            <ion-label>{{ isDarkMode ? 'Tema Claro' : 'Tema Oscuro' }}</ion-label>
          </ion-item>
          <ion-item button @click="handleLogout">
            <ion-icon slot="start" name="log-out-outline"></ion-icon>
            <ion-label>Cerrar sesión</ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>
    </ion-content>
  </ion-menu>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { menuController } from '@ionic/core';
import { IonMenu, IonContent, IonList, IonMenuToggle, IonItem, IonLabel, IonIcon, IonHeader, IonToolbar, IonTitle } from '@ionic/vue';

export default defineComponent({
  components: {
    IonTitle,
    IonMenu,
    IonContent,
    IonList,
    IonMenuToggle,
    IonItem,
    IonLabel,
    IonIcon,
    IonHeader,
    IonToolbar,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const isDarkMode = ref(false); // Estado para el modo oscuro

    // Comprobar el tema inicial al montar el componente
    onMounted(() => {
      isDarkMode.value = document.body.classList.contains('dark');
    });

    const handleLogout = async () => {
      await store.dispatch('logout');
      router.push('/login');
    };

    const goToPerfil = async () => {
      await menuController.close();
      router.push('/modificar-perfil');
    };

    // Función para alternar entre el tema claro y oscuro
    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value;
      document.body.classList.toggle('dark', isDarkMode.value); // Agrega o remueve la clase 'dark' en el cuerpo del documento
      console.log(`Dark mode: ${isDarkMode.value}, Body classes: ${document.body.className}`);
    };

    return { handleLogout, goToPerfil, toggleTheme, isDarkMode };
  }
});
</script>

<style scoped>
.custom-menu {
  --background: #f0f4f8; /* Color de fondo del menú */
}

.menu-title {
  font-weight: bold;
  color: white;
  font-size: 1.5rem;
}

.menu-content {
  --ion-background-color: #ffffff; /* Color de fondo del contenido */
}

ion-item {
  --background: #e3f2fd; /* Color de fondo de los ítems */
  border-radius: 8px;
  margin: 10px 0;
  transition: background-color 0.3s;
}

ion-item:hover {
  --background: #bbdefb; /* Color al pasar el cursor sobre los ítems */
}

ion-icon {
  font-size: 1.2rem;
}

/* Estilos para el tema claro y oscuro */
body.light {
  --ion-background-color: white;
  --ion-text-color: black;
}

body.dark {
  --ion-background-color: #000;
  --ion-text-color: white;
}
</style>




