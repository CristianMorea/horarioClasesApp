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

    <!-- Mostrar la nota final del periodo actual -->
    <ion-card>
      <ion-card-content class="ion-text-center">
        <h2>Nota Final del Periodo</h2>
        <h1 style="font-size: 2em; margin: 10px 0;">
          {{ calcularNotaFinal().toFixed(2) }}
        </h1>
        <p>
          <small>
            (Tareas: {{ calcularPonderadoTareas().toFixed(2) }} x 40% + 
            Exámenes: {{ calcularPonderadoExamenes().toFixed(2) }} x 60%)
          </small>
        </p>
      </ion-card-content>
    </ion-card>

    <!-- Mostrar la nota final acumulada -->
    <ion-card>
      <ion-card-content class="ion-text-center">
        <h2>Nota Final Acumulada</h2>
        <h1 style="font-size: 2em; margin: 10px 0;">
          {{ calcularNotaFinalAcumulada().toFixed(2) }}
        </h1>
        <p>
          <small>
            (Periodo 1: {{ notasPeriodos[1]?.toFixed(2) || '0.00' }} x 30% + 
            Periodo 2: {{ notasPeriodos[2]?.toFixed(2) || '0.00' }} x 30% + 
            Periodo 3: {{ notasPeriodos[3]?.toFixed(2) || '0.00' }} x 40%)
          </small>
        </p>
      </ion-card-content>
    </ion-card>

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
const notasPeriodos = ref<Record<number, number>>({});

// Constantes para los porcentajes
const PORCENTAJE_TAREAS = 0.4;  // 40%
const PORCENTAJE_EXAMENES = 0.6; // 60%
const PESO_PERIODO_1 = 0.3;  // 30%
const PESO_PERIODO_2 = 0.3;  // 30%
const PESO_PERIODO_3 = 0.4;  // 40%

// Función para calcular la nota final del periodo actual
const calcularNotaFinal = () => {
  const ponderadoTareas = calcularPonderadoTareas();
  const ponderadoExamenes = calcularPonderadoExamenes();
  const notaFinal = (ponderadoTareas * PORCENTAJE_TAREAS) + (ponderadoExamenes * PORCENTAJE_EXAMENES);
  
  // Guardar la nota del periodo actual
  notasPeriodos.value[selectedPeriodo.value] = notaFinal;
  
  return notaFinal;
};

// Función para calcular la nota final acumulada
const calcularNotaFinalAcumulada = () => {
  const nota1 = (notasPeriodos.value[1] || 0) * PESO_PERIODO_1;
  const nota2 = (notasPeriodos.value[2] || 0) * PESO_PERIODO_2;
  const nota3 = (notasPeriodos.value[3] || 0) * PESO_PERIODO_3;
  
  return nota1 + nota2 + nota3;
};

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