<template>
  <div>
    <!-- Componente genérico para mostrar tareas -->
    <DataCard 
      v-if="tareas.length > 0" 
      :titulo="'Tareas de la clase'" 
      :items="tareas" 
      @editar="editarTarea" 
      @eliminar="eliminarTarea"
      entidad="tareas"
    />
    <ion-card v-else>
      <ion-card-content>
        <p>No hay tareas asociadas a esta clase.</p>
      </ion-card-content>
    </ion-card>

    <!-- Componente genérico para mostrar exámenes -->
    <DataCard 
      v-if="examenes.length > 0" 
      :titulo="'Exámenes de la clase'" 
      :items="examenes" 
      @editar="editarExamen" 
      @eliminar="eliminarExamen"
      entidad="examenes"
    />
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
import DataCard from './DataCard.vue';

// Props para recibir datos
const props = defineProps<{ idClase: string }>();

// Variables reactivas
const tareas = ref<Array<any>>([]);
const examenes = ref<Array<any>>([]);
const tareaEditar = ref<any>(null);
const examenEditar = ref<any>(null);

// Función genérica para obtener datos de una tabla
const obtenerDatos = async (tabla: string, idClase: string, setDatos: (data: any[]) => void) => {
  try {
    const { data, error } = await supabase
      .from(tabla)
      .select('*') // Seleccionar todo; puede ajustarse según los campos necesarios
      .eq('id_clase', idClase);

    if (error) {
      console.error(`Error al obtener datos de ${tabla}:`, error.message);
      return;
    }

    console.log(`${tabla} obtenidos:`, data);
    setDatos(data || []);
  } catch (err) {
    console.error(`Error al obtener datos de ${tabla}:`, err);
  }
};

// Funciones para obtener tareas y exámenes
const obtenerTareas = () => obtenerDatos('tareas', props.idClase, data => (tareas.value = data));
const obtenerExamenes = () => obtenerDatos('examenes', props.idClase, data => (examenes.value = data));

// Función genérica para eliminar un registro
const eliminarRegistro = async (tabla: string, id: string, actualizarLista: (id: string) => void) => {
  try {
    const { error } = await supabase.from(tabla).delete().eq('id', id);
    if (error) {
      console.error(`Error al eliminar en ${tabla}:`, error.message);
      return;
    }
    actualizarLista(id);
  } catch (err) {
    console.error(`Error al eliminar en ${tabla}:`, err);
  }
};

// Funciones específicas para eliminar tareas y exámenes
const eliminarTarea = (id: string) => eliminarRegistro('tareas', id, idEliminado => {
  tareas.value = tareas.value.filter(t => t.id_tareas !== idEliminado);
});
const eliminarExamen = (id: string) => eliminarRegistro('examenes', id, idEliminado => {
  examenes.value = examenes.value.filter(e => e.id !== idEliminado);
});

// Funciones para editar tareas y exámenes
const editarTarea = (tarea: any) => {
  tareaEditar.value = { ...tarea };
  console.log('Tarea a editar:', tareaEditar.value);
};
const editarExamen = (examen: any) => {
  examenEditar.value = { ...examen };
  console.log('Examen a editar:', examenEditar.value);
};

// Cargar datos al cambiar el ID de la clase
watch(
  () => props.idClase,
  (newId) => {
    if (newId) {
      obtenerTareas();
      obtenerExamenes();
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

ion-button {
  margin-left: 10px;
}
</style>
