<!-- carPrincipal.vue -->
<template>
  <div>
    <!-- Recorremos la lista de clases y mostramos el título -->
    <ion-card v-for="(claseItem, index) in clases" :key="index">
      <ion-card-header>
        <!-- Mostramos el nombre de la clase -->
        <ion-card-title>{{ claseItem.nombre || "Sin nombre" }}</ion-card-title>
      </ion-card-header>

      <!-- Llamamos al componente subCard y le pasamos el ID de la clase -->
      <sub-card :idClase="claseItem.id" />
    </ion-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import supabase from '../supabase';
import SubCard from '../components/subCard.vue'; // Importamos el componente subCard

// Datos reactivos
const clases = ref<Array<any>>([]);

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
