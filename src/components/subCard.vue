<!-- subCard.vue -->
<template>
  <div>
    <!-- Mostrar las tareas asociadas a esta clase -->
    <ion-card-content v-if="tareas && tareas.length > 0">
      <ion-list>
        <ion-item v-for="(tarea, index) in tareas" :key="index">
          <div>
            <h3>{{ tarea.nombre }}</h3>
            <p>{{ tarea.descripcion }}</p>
            <p>Fecha de entrega: {{ tarea.fecha_entrega }}</p>
            <p>Periodo: {{ tarea.periodo }}</p>
            <p v-if="tarea.estado">Estado: Completada</p>
            <p v-else>Estado: Pendiente</p>
          </div>
        </ion-item>
      </ion-list>
    </ion-card-content>

    <!-- Si no hay tareas, mostrar un mensaje -->
    <ion-card-content v-else>
      <p>No hay tareas asociadas a esta clase.</p>
    </ion-card-content>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import supabase from '../supabase';

// Prop para recibir el ID de la clase
const props = defineProps<{ idClase: string }>();

// Datos reactivos
const tareas = ref<Array<any>>([]);

// Función para obtener las tareas asociadas a una clase
const obtenerTareas = async (idClase: string) => {
  try {
    const { data, error } = await supabase
      .from('tareas')
      .select('id_tareas, nombre, descripcion, fecha_entrega, estado, "Periodo"') // Campo Periodo entre comillas
      .eq('id_clase', idClase);

    if (error) {
      console.error('Error al obtener las tareas:', error);
      return;
    }

    tareas.value = data || [];
  } catch (err) {
    console.error('Error al obtener las tareas:', err);
  }
};

// Cargar las tareas cuando cambie el ID de la clase
watch(
  () => props.idClase,
  (newId) => {
    if (newId) obtenerTareas(newId);
  },
  { immediate: true }
);
</script>
