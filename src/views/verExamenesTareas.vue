<template>
  <ion-page>
    <MenuComponent />
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Ver Deveres</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content id="main-content" class="ion-padding" scroll-y="true">
      <div>
        <!-- Mostramos las clases asociadas al usuario -->
        <ion-card v-for="(claseItem, index) in clases" :key="index">
          <ion-card-header>
            <!-- Mostramos el nombre de la clase -->
            <ion-card-title>{{ claseItem.nombre || "Sin nombre" }}</ion-card-title>
          </ion-card-header>

          <!-- Llamamos al componente subCard y le pasamos el ID de la clase -->
          <sub-card :idClase="claseItem.id" />
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import supabase from '../supabase';
import SubCard from '../components/subCard.vue'; // Importamos el componente subCard
import { useRouter } from 'vue-router';

// Datos reactivos
const clases = ref<Array<any>>([]);
const router = useRouter();

// Función para obtener las clases asociadas al usuario autenticado
const obtenerClases = async () => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error('Usuario no autenticado.');

    const { data, error } = await supabase
      .from('clases')
      .select('id, nombre')
      .eq('id_usuario', user.id);

    if (error) {
      console.error('Error al obtener las clases:', error);
      return;
    }

    clases.value = data || [];
  } catch (err) {
    console.error('Error al obtener las clases:', err);
  }
};

// Cargamos las clases al montar el componente
onMounted(obtenerClases);
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

ion-card {
  margin-bottom: 16px;
}
</style>
