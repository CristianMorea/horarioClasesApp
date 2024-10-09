<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title class="text-center text-2xl font-bold text-white">Detalles de la Materia</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content>
        <div class="detalles-container">
          <ion-item>
            <ion-label position="stacked">Nombre de la Clase</ion-label>
            <ion-input v-model="clase.nombre" readonly></ion-input>
          </ion-item>
  
          <ion-item>
            <ion-label position="stacked">Día de la Clase</ion-label>
            <ion-input v-model="diaDeClase" @input="actualizarDiaDeClase" readonly></ion-input>
          </ion-item>
  
          <ion-item>
            <ion-label position="stacked">Hora de Inicio</ion-label>
            <ion-input v-model="clase.hora_inicio" readonly></ion-input>
          </ion-item>
  
          <ion-item>
            <ion-label position="stacked">Hora de Fin</ion-label>
            <ion-input v-model="clase.hora_fin" readonly></ion-input>
          </ion-item>
  
          <ion-item>
            <ion-label position="stacked">Lugar</ion-label>
            <ion-input v-model="clase.ubicacion" readonly></ion-input>
          </ion-item>
  
          <ion-item>
            <ion-label position="stacked">Profesor</ion-label>
            <ion-input v-model="profesor.nombre" readonly></ion-input>
          </ion-item>
  
          <ion-button expand="full" @click="editarHorario">Modificar</ion-button>
          <ion-button expand="full" @click="cerrarDetalle">Cerrar</ion-button>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import supabase from '@/supabase';
  
  export default defineComponent({
    setup() {
      const clase = ref({}); // Objeto para almacenar los detalles de la clase
      const profesor = ref({}); // Objeto para almacenar los detalles del profesor
      const diaDeClase = ref(''); // Variable para el día de la clase
      const route = useRoute(); // Obtener la ruta actual
      const router = useRouter(); // Obtener el enrutador
  
      // Obtener el ID de la clase desde la ruta
      const claseId = route.params.id; // Asumiendo que tienes una ruta con un parámetro 'id'
  
      // Cargar los detalles de la clase, el profesor y el día de la clase
      const cargarClaseDetalles = async () => {
        const { data, error } = await supabase
          .from('clases')
          .select(`
            *,
            profesor:profesor_id (
              nombre
            ),
            horarios_clases (
              dia_de_clase
            )
          `)
          .eq('id', claseId)
          .single();
  
        if (error) {
          console.error('Error al cargar detalles de la clase:', error.message);
        } else if (data) {
          clase.value = data;
          profesor.value = data.profesor;
          diaDeClase.value = data.horarios_clases[0]?.dia_de_clase || ''; // Inicializar con el día de clase
        } else {
          console.error('No se encontró la clase.');
        }
      };
  
      const actualizarDiaDeClase = () => {
        if (clase.value.horarios_clases.length > 0) {
          clase.value.horarios_clases[0].dia_de_clase = diaDeClase.value; // Actualiza el día de clase en el objeto clase
        }
      };
  
      const cerrarDetalle = () => {
        router.push('/horario'); // Redirigir al usuario a la página anterior o a la lista de clases
      };
  
      const editarHorario = () => {
        router.push('/horarioeditar'); // Redirigir a la vista de edición
      };
  
      onMounted(() => {
        cargarClaseDetalles(); // Cargar los detalles al montar el componente
      });
  
      return {
        clase,
        profesor,
        diaDeClase,
        cerrarDetalle,
        actualizarDiaDeClase,
        editarHorario,
      };
    },
  });
  </script>
  
  <style scoped>
  .detalles-container {
    padding: 16px;
  }
  </style>
  