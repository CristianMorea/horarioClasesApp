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
    const isDarkMode = ref(false);

    onMounted(() => {
      const temaGuardado = localStorage.getItem('tema');
      if (temaGuardado === 'dark') {
        document.body.classList.add('dark');
        isDarkMode.value = true;
      } else {
        document.body.classList.add('light');
        isDarkMode.value = false;
      }
    });

    const handleLogout = async () => {
      await store.dispatch('logout');
      router.push('/');
    };

    const goToPerfil = async () => {
      await menuController.close();
      router.push('/modificar-perfil');
    };

    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value;
      document.body.classList.toggle('dark', isDarkMode.value);
      document.body.classList.toggle('light', !isDarkMode.value);
      localStorage.setItem('tema', isDarkMode.value ? 'dark' : 'light');
    };

    return { handleLogout, goToPerfil, toggleTheme, isDarkMode };
  }
});
</script>

<style scoped>
.custom-menu {
  --background: #f0f4f8;
}

.menu-title {
  font-weight: bold;
  color: white;
  font-size: 1.5rem;
}

.menu-content {
  --ion-background-color: #ffffff;
}

ion-item {
  --background: #e3f2fd;
  border-radius: 8px;
  margin: 10px 0;
  transition: background-color 0.3s;
}

ion-item:hover {
  --background: #bbdefb;
}

ion-icon {
  font-size: 1.2rem;
}

/* Estilos específicos para el modo oscuro */
body.dark .custom-menu {
  --background: #1e1e1e; /* Fondo del menú en modo oscuro */
}

body.dark .menu-title {
  color: #ffffff;
}

body.dark .menu-content {
  --ion-background-color: #2b2b2b; /* Fondo del contenido en modo oscuro */
}

body.dark ion-item {
  --background: #3a3a3a; /* Fondo de los ítems en modo oscuro */
  color: #ffffff;
}

body.dark ion-item:hover {
  --background: #505050; /* Fondo de los ítems al pasar el cursor en modo oscuro */
}

body.dark ion-icon {
  color: #ffffff;
}
body.dark ion-list {
  background: #2b2b2b;
}
</style>





