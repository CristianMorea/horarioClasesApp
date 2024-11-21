<template>
  <div>
    <!-- Mostrar las tareas asociadas a esta clase -->
    <ion-card v-if="tareas && tareas.length > 0">
      <ion-card-header>
        <ion-card-title>Tareas de la clase</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-list>
          <ion-item v-for="(tarea, index) in tareas" :key="index">
            <ion-label>
              <h3>{{ tarea.nombre }}</h3>
              <p>{{ tarea.descripcion }}</p>
              <p><strong>Fecha de entrega:</strong> {{ tarea.fecha_entrega }}</p>
              <p><strong>Periodo:</strong> {{ tarea.periodo }}</p>
              <p>
                <strong>Estado:</strong>
                <span v-if="tarea.estado">Completada</span>
                <span v-else>Pendiente</span>
              </p>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-card-content>
    </ion-card>

    <!-- Si no hay tareas, mostrar un mensaje -->
    <ion-card v-else>
      <ion-card-content>
        <p>No hay tareas asociadas a esta clase.</p>
      </ion-card-content>
    </ion-card>

    <!-- Mostrar los exámenes asociados a esta clase -->
    <ion-card v-if="examenes && examenes.length > 0">
      <ion-card-header>
        <ion-card-title>Exámenes de la clase</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-list>
          <ion-item v-for="(examen, index) in examenes" :key="index">
            <ion-label>
              <h3>{{ examen.nombre }}</h3>
              <p>{{ examen.descripcion }}</p>
              <p><strong>Fecha del examen:</strong> {{ examen.fecha_examen }}</p>
              <p><strong>Periodo:</strong> {{ examen.periodo }}</p>
              <p>
                <strong>Estado:</strong>
                <span v-if="examen.estado">Realizado</span>
                <span v-else>Pendiente</span>
              </p>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-card-content>
    </ion-card>

    <!-- Si no hay exámenes, mostrar un mensaje -->
    <ion-card v-else>
      <ion-card-content>
        <p>No hay exámenes asociados a esta clase.</p>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import supabase from '../supabase';

// Prop para recibir el ID de la clase
const props = defineProps<{ idClase: string }>();

// Datos reactivos
const tareas = ref<Array<any>>([]);
const examenes = ref<Array<any>>([]);

// Función para obtener las tareas asociadas a una clase
const obtenerTareas = async (idClase: string) => {
  try {
    const { data, error } = await supabase
      .from('tareas')
      .select('id_tareas, nombre, descripcion, fecha_entrega, estado, "Periodo"')
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

// Función para obtener los exámenes asociados a una clase
const obtenerExamenes = async (idClase: string) => {
  try {
    const { data, error } = await supabase
      .from('examenes')
      .select('id, descripcion, fecha_examen, nombre, estado, "Periodo"')
      .eq('id_clase', idClase);

    if (error) {
      console.error('Error al obtener los exámenes:', error);
      return;
    }

    examenes.value = data || [];
  } catch (err) {
    console.error('Error al obtener los exámenes:', err);
  }
};

// Cargar las tareas y exámenes cuando cambie el ID de la clase
watch(
  () => props.idClase,
  (newId) => {
    if (newId) {
      obtenerTareas(newId);
      obtenerExamenes(newId);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
ion-card {
  margin: 16px;
}

ion-card-title {
  font-size: 1.2em;
}

p {
  margin: 4px 0;
}
</style>
