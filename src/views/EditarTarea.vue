<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button></ion-back-button>
          </ion-buttons>
          <ion-title>Editar Tarea</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content class="ion-padding">
        <form @submit.prevent="guardarTarea">
          <ion-list>
            <!-- Nombre de la tarea -->
            <ion-item>
              <ion-label position="floating">Nombre de la Tarea</ion-label>
              <ion-input v-model="tarea.nombre" type="text" required></ion-input>
            </ion-item>
  
            <!-- Descripción -->
            <ion-item>
              <ion-label position="floating">Descripción</ion-label>
              <ion-textarea v-model="tarea.descripcion" required></ion-textarea>
            </ion-item>
  
            <!-- Fecha de entrega -->
            <ion-item>
              <ion-label position="floating">Fecha de Entrega</ion-label>
              <ion-datetime 
                v-model="tarea.fecha_entrega" 
                display-format="DD/MM/YYYY" 
                picker-format="DD MMM YYYY" 
                required>
              </ion-datetime>
            </ion-item>
  
            <!-- Período -->
            <ion-item>
              <ion-label>Número de Período</ion-label>
              <ion-select 
                v-model="tarea.Periodo" 
                placeholder="Seleccionar Período" 
                required>
                <ion-select-option :value="1">Período 1</ion-select-option>
                <ion-select-option :value="2">Período 2</ion-select-option>
                <ion-select-option :value="3">Período 3</ion-select-option>
              </ion-select>
            </ion-item>
  
            <!-- Clase asociada -->
            <ion-item>
              <ion-label>Clase</ion-label>
              <ion-select 
                v-model="tarea.id_clase" 
                placeholder="Seleccionar Clase" 
                required>
                <ion-select-option 
                  v-for="clase in clases" 
                  :key="clase.id" 
                  :value="clase.id">
                  {{ clase.nombre }}
                </ion-select-option>
              </ion-select>
            </ion-item>
  
            <!-- Estado -->
            <ion-item>
              <ion-label>Estado</ion-label>
              <ion-toggle v-model="tarea.estado"></ion-toggle>
            </ion-item>
  
            <!-- Nota (condicional) -->
            <ion-item v-if="tarea.estado">
              <ion-label position="floating">Nota</ion-label>
              <ion-input 
                v-model.number="tarea.nota" 
                type="number" 
                min="0" 
                max="5" 
                step="0.1">
              </ion-input>
            </ion-item>
          </ion-list>
  
          <!-- Botón para guardar -->
          <div class="ion-padding">
            <ion-button expand="block" type="submit" color="primary">Guardar Cambios</ion-button>
          </div>
        </form>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import supabase from '../supabase';
  
  // Router y parámetros
  const router = useRouter();
  const route = useRoute();
  
  // Clase seleccionada
  const clases = ref<Array<any>>([]);
  const tarea = ref({
    id: '',
    nombre: '',
    descripcion: '',
    fecha_entrega: '',
    Periodo: null,
    id_clase: null,
    estado: false,
    nota: null,
  });
  
  // Función para obtener clases disponibles
  const obtenerClases = async () => {
    try {
      const { data, error } = await supabase.from('clases').select('*');
      if (error) {
        console.error('Error al obtener clases:', error.message);
        return;
      }
      clases.value = data || [];
    } catch (err) {
      console.error('Error al obtener clases:', err);
    }
  };
  
  // Función para cargar la tarea seleccionada
  const cargarTarea = async () => {
    const id = route.params.id as string;
    try {
      const { data, error } = await supabase.from('tareas').select('*').eq('id', id).single();
      if (error) {
        console.error('Error al cargar la tarea:', error.message);
        return;
      }
      tarea.value = data;
    } catch (err) {
      console.error('Error al cargar la tarea:', err);
    }
  };
  
  // Función para guardar cambios
  const guardarTarea = async () => {
    try {
      const { error } = await supabase.from('tareas').update(tarea.value).eq('id', tarea.value.id);
      if (error) {
        console.error('Error al actualizar la tarea:', error.message);
        return;
      }
      console.log('Tarea actualizada:', tarea.value);
      router.back(); // Regresar a la página anterior
    } catch (err) {
      console.error('Error al guardar la tarea:', err);
    }
  };
  
  // Cargar datos al montar
  onMounted(() => {
    cargarTarea();
    obtenerClases();
  });
  </script>
  
  <style scoped>
  ion-button {
    margin-top: 10px;
  }
  </style>
  