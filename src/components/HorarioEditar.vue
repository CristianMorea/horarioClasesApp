<template>
  <ion-page class="h-screen bg-white">
    <ion-header>
      <ion-toolbar>
        <ion-title class="text-center text-2xl font-bold text-white">EDITAR Y VISUALIZACION</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Lista de clases para seleccionar cuál editar -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Selecciona una clase para editar</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item v-for="(clase, index) in clases" :key="index" @click="seleccionarClase(clase)">
            {{ clase.nombre }} - {{ clase.hora_inicio }} - {{ clase.hora_fin }}
          </ion-item>
        </ion-card-content>
      </ion-card>

      <!-- Formulario de edición -->
      <form v-if="claseSeleccionada" @submit.prevent="editarClaseYHorario">
        <ion-item>
          <ion-label position="stacked">Nombre de la Clase (obligatorio)*</ion-label>
          <ion-input v-model="claseSeleccionada.nombre" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Día de la Clase (obligatorio)*</ion-label>
          <ion-select v-model="claseSeleccionada.dia_de_clase" required>
            <ion-select-option value="lunes">Lunes</ion-select-option>
            <ion-select-option value="martes">Martes</ion-select-option>
            <ion-select-option value="miércoles">Miércoles</ion-select-option>
            <ion-select-option value="jueves">Jueves</ion-select-option>
            <ion-select-option value="viernes">Viernes</ion-select-option>
            <ion-select-option value="sábado">Sábado</ion-select-option>
            <ion-select-option value="domingo">Domingo</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Hora de Inicio (obligatorio)*</ion-label>
          <ion-input type="time" v-model="claseSeleccionada.hora_inicio" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Hora de Fin (obligatorio)*</ion-label>
          <ion-input type="time" v-model="claseSeleccionada.hora_fin" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Lugar (opcional)</ion-label>
          <ion-input v-model="claseSeleccionada.ubicacion"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Profesor (opcional)</ion-label>
          <ion-select v-model="claseSeleccionada.profesor_id">
            <ion-select-option v-for="profesor in profesores" :key="profesor.id" :value="profesor.id">
              {{ profesor.nombre }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-button expand="full" type="submit">Guardar Cambios</ion-button>

        <ion-alert
          v-if="mensaje"
          :is-open="true"
          :message="mensaje"
          :buttons="['OK']"
          @didDismiss="mensaje = ''"
        ></ion-alert>
      </form>

      <ion-button expand="full" @click="cerrar">Cerrar</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import supabase from '../supabase';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonAlert,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/vue';

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonAlert,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  },
  setup() {
    const clases = ref([]); // Lista de clases existentes
    const claseSeleccionada = ref(null); // Clase que el usuario selecciona para editar
    const profesores = ref([]); // Lista de profesores disponibles
    const mensaje = ref('');
    const router = useRouter(); // Obtener el enrutador

    const cargarClases = async () => {
      const { data, error } = await supabase
        .from('clases')
        .select('*');

      if (error) {
        console.error('Error al cargar clases:', error.message);
      } else {
        clases.value = data;
      }
    };

    const cargarProfesores = async () => {
      const { data, error } = await supabase
        .from('profesores')
        .select('id, nombre');

      if (error) {
        console.error('Error al cargar profesores:', error.message);
      } else {
        profesores.value = data;
      }
    };

    const seleccionarClase = (clase) => {
      claseSeleccionada.value = { ...clase }; // Crear una copia del horario seleccionado
    };

    const editarClaseYHorario = async () => {
      if (!claseSeleccionada.value.nombre || !claseSeleccionada.value.dia_de_clase || !claseSeleccionada.value.hora_inicio || !claseSeleccionada.value.hora_fin) {
        mensaje.value = 'Por favor, completa todos los campos obligatorios.';
        return;
      }

      const { error: claseError } = await supabase
        .from('clases')
        .update({
          nombre: claseSeleccionada.value.nombre,
          profesor_id: claseSeleccionada.value.profesor_id,
          ubicacion: claseSeleccionada.value.ubicacion,
          hora_inicio: claseSeleccionada.value.hora_inicio,
          hora_fin: claseSeleccionada.value.hora_fin,
          actualizado_en: new Date().toISOString(),
        })
        .eq('id', claseSeleccionada.value.id);

      if (claseError) {
        mensaje.value = 'Error al editar la clase: ' + claseError.message;
        return;
      }

      const { error: horarioError } = await supabase
        .from('horarios_clases')
        .update({
          dia_de_clase: claseSeleccionada.value.dia_de_clase,
          actualizado_en: new Date().toISOString(),
        })
        .eq('clase_id', claseSeleccionada.value.id);

      if (horarioError) {
        mensaje.value = 'Error al editar el horario: ' + horarioError.message;
      } else {
        mensaje.value = 'Clase y horario editados con éxito.';
        claseSeleccionada.value = null; // Limpiar la selección después de editar
        cargarClases(); // Recargar la lista de clases
      }
    };

    const cerrar = () => {
      router.push('/horario'); // Redirigir a la lista de horarios
    };

    onMounted(() => {
      cargarClases();
      cargarProfesores();
    });

    return {
      clases,
      claseSeleccionada,
      profesores,
      mensaje,
      seleccionarClase,
      editarClaseYHorario,
      cerrar,
    };
  },
});
</script>

<style scoped>
/* Estilos personalizados si es necesario */
</style>

