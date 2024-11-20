<template>
  <ion-menu content-id="main-content" side="start" class="custom-menu">
    <ion-header>
      <ion-toolbar class="menu-header">
        <div class="logo-container">
          <img src="../assets/img/login_logo.png" alt="Logo" class="app-logo" />
          <span class="app-name">EduTimble</span>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="menu-content">
      <ion-list lines="none">
        <ion-menu-toggle>
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
import { IonMenu, IonContent, IonList, IonMenuToggle, IonItem, IonLabel, IonIcon, IonHeader, IonToolbar } from '@ionic/vue';

export default defineComponent({
  components: {
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

    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value;
      document.body.classList.toggle('dark', isDarkMode.value);
      document.body.classList.toggle('light', !isDarkMode.value);
      localStorage.setItem('tema', isDarkMode.value ? 'dark' : 'light');
    };

    return { handleLogout, toggleTheme, isDarkMode };
  },
});
</script>

<style scoped>
/* Fondo del menú */
.custom-menu {
  --background: var(--ion-color-light, #f5f5f5);
}

/* Encabezado con logo y nombre */
.menu-header {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: var(--ion-color-light, #ffffff);
  border-bottom: 1px solid var(--ion-color-medium, #ccc);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.app-name {
  font-size: 1.2rem;
  font-weight: bold;
}

/* Fondo y estilo de los ítems */
ion-item {
  --background: transparent;
  color: var(--ion-color-medium, #333);
  border-radius: 0;
  padding: 8px 16px;
  font-size: 1rem;
  transition: color 0.3s, background-color 0.3s;
}

ion-item:hover {
  --background: var(--ion-color-primary-shade, #e0e0e0);
  --color: var(--ion-color-primary, #ff4d4d);
}

/* Íconos */
ion-icon {
  font-size: 1.3rem;
  color: var(--ion-color-medium, #888);
  transition: color 0.3s;
}

ion-item:hover ion-icon {
  color: var(--ion-color-primary, #3880ff);
}

/* Estilo del modo oscuro */
body.dark .custom-menu {
  --background: #1e1e1e;
}

body.dark .menu-header {
  background: #2b2b2b;
  border-bottom: 1px solid #444;
}

body.dark .app-name {
  color: #ffffff;
}

body.dark ion-item {
  color: #e0e0e0;
}

body.dark ion-item:hover {
  --background: #333333;
  color: var(--ion-color-light, #ffffff);
}

body.dark ion-icon {
  color: #b0b0b0;
}

body.dark ion-item:hover ion-icon {
  color: var(--ion-color-light, #ffffff);
}
</style>






