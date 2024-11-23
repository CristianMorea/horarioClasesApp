<template>
    <div>
      <!-- Selector para elegir el periodo -->
      <ion-item>
        <ion-label>Periodo</ion-label>
        <ion-select :value="selectedPeriodo" @ionChange="handlePeriodChange($event)">
          <ion-select-option value="1">Periodo 1</ion-select-option>
          <ion-select-option value="2">Periodo 2</ion-select-option>
          <ion-select-option value="3">Periodo 3</ion-select-option>
        </ion-select>
      </ion-item>
  
      <!-- Mostrar las tareas asociadas a esta clase -->
      <ion-card v-if="tareas.length > 0">
        <ion-card-header>
          <ion-card-title>Tareas de la clase</ion-card-title>
          <ion-card-subtitle>
            Ponderado de tareas: {{ calcularPonderadoTareas().toFixed(2) }}
          </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item v-for="(tarea, index) in tareas" :key="index">
              <ion-label>
                <h3>{{ tarea.nombre }}</h3>
                <p><strong>Nota:</strong> {{ tarea.nota || 'Sin calificar' }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
  
      <!-- Si no hay tareas, mostrar un mensaje -->
      <ion-card v-else>
        <ion-card-content>
          <p>No hay tareas asociadas a esta clase para el periodo seleccionado.</p>
        </ion-card-content>
      </ion-card>
  
      <!-- Mostrar los exámenes asociados a esta clase -->
      <ion-card v-if="examenes.length > 0">
        <ion-card-header>
          <ion-card-title>Exámenes de la clase</ion-card-title>
          <ion-card-subtitle>
            Ponderado de exámenes: {{ calcularPonderadoExamenes().toFixed(2) }}
          </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item v-for="(examen, index) in examenes" :key="index">
              <ion-label>
                <h3>{{ examen.nombre }}</h3>
                <p><strong>Nota:</strong> {{ examen.nota || 'Sin calificar' }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
  
      <!-- Si no hay exámenes, mostrar un mensaje -->
      <ion-card v-else>
        <ion-card-content>
          <p>No hay exámenes asociados a esta clase para el periodo seleccionado.</p>
        </ion-card-content>
      </ion-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  import supabase from '../supabase';
  
  const props = defineProps<{ idClase: string }>();
  
  // Datos reactivos
  const tareas = ref<Array<any>>([]);
  const examenes = ref<Array<any>>([]);
  const selectedPeriodo = ref<number>(2);
  
  // Función para calcular el ponderado de tareas
  const calcularPonderadoTareas = () => {
    if (tareas.value.length === 0) return 0;
    
    const tareasConNota = tareas.value.filter(tarea => tarea.nota != null);
    if (tareasConNota.length === 0) return 0;
    
    const sumNotas = tareasConNota.reduce((sum, tarea) => sum + (tarea.nota || 0), 0);
    return sumNotas / tareasConNota.length;
  };
  
  // Función para calcular el ponderado de exámenes
  const calcularPonderadoExamenes = () => {
    if (examenes.value.length === 0) return 0;
    
    const examenesConNota = examenes.value.filter(examen => examen.nota != null);
    if (examenesConNota.length === 0) return 0;
    
    const sumNotas = examenesConNota.reduce((sum, examen) => sum + (examen.nota || 0), 0);
    return sumNotas / examenesConNota.length;
  };
  
  // Función para manejar el cambio de período
  const handlePeriodChange = (event: CustomEvent) => {
    const newPeriod = parseInt(event.detail.value);
    selectedPeriodo.value = newPeriod;
    filtrarPorPeriodo();
  };
  
  // Función para obtener las tareas asociadas a una clase
  const obtenerTareas = async (idClase: string, periodo?: number) => {
    try {
      let query = supabase
        .from('tareas')
        .select('id_tareas, nombre, descripcion, fecha_entrega, estado, "Periodo", nota')
        .eq('id_clase', idClase);
  
      if (periodo) {
        query = query.eq('Periodo', periodo);
      }
  
      const { data, error } = await query;
  
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
  const obtenerExamenes = async (idClase: string, periodo?: number) => {
    try {
      let query = supabase
        .from('examenes')
        .select('id, descripcion, fecha_examen, nombre, estado, "Periodo", nota')
        .eq('id_clase', idClase);
  
      if (periodo) {
        query = query.eq('Periodo', periodo);
      }
  
      const { data, error } = await query;
  
      if (error) {
        console.error('Error al obtener los exámenes:', error);
        return;
      }
  
      examenes.value = data || [];
    } catch (err) {
      console.error('Error al obtener los exámenes:', err);
    }
  };
  
  // Función para filtrar tareas y exámenes por periodo
  const filtrarPorPeriodo = () => {
    tareas.value = [];
    examenes.value = [];
    obtenerTareas(props.idClase, selectedPeriodo.value);
    obtenerExamenes(props.idClase, selectedPeriodo.value);
  };
  
  // Watch para detectar cambios en el ID de la clase o el periodo
  watch([() => props.idClase, selectedPeriodo], () => {
    if (props.idClase) {
      filtrarPorPeriodo();
    }
  }, { immediate: true });
  </script>