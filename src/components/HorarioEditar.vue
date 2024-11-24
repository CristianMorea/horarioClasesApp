<template>
  <ion-page class="h-screen bg-white">
    <ion-header>
      <ion-toolbar>
        <ion-title class="text-center text-2xl font-bold custom-title">EDITAR</ion-title>
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

        <ion-button class="centrar-boton2" type="submit">Guardar Cambios</ion-button>

        <ion-alert
          v-if="mensaje"
          :is-open="true"
          :message="mensaje"
          :buttons="['OK']"
          @didDismiss="mensaje = ''"
        ></ion-alert>
      </form>

      <ion-button @click="cerrar" class="centrar-boton">Cerrar</ion-button>

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

    const cargarProfesores = async () => {
      try {
        const { data, error } = await supabase
          .from('profesores')
          .select('id, nombre');

        if (error) throw error;
        profesores.value = data || [];
      } catch (err) {
        console.error('Error al obtener los profesores:', err);
      }
    };

// Función para obtener las clases asociadas al usuario autenticado
const cargarClases = async () => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error('Usuario no autenticado.');

    const { data, error } = await supabase
      .from('clases')
      .select('id, nombre, ubicacion, hora_inicio, hora_fin, profesor_id')
      .eq('id_usuario', user.id);

    if (error) throw error;

    if (!data || data.length === 0) {
      console.error('No se encontraron clases para este usuario.');
      return;
    }

    clases.value = await Promise.all(
      data.map(async (clase: any) => {
        if (clase.profesor_id) {
          const profesor = await cargarProfesores(clase.profesor_id);
          return { ...clase, profesor };
        }
        return { ...clase, profesor: { nombre: 'No asignado' } };
      })
    );
  } catch (err) {
    console.error('Error al obtener los datos de las clases:', err);
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
@import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');

body {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente a todo el cuerpo */
}


ion-title {
  font-size: 1.8rem;
  text-align: center;
}

ion-content {
  padding: 1rem;
  
}


:root {
  --ion-color-step-50: #ffffff; /* Fondo blanco para temas claros */
}

.dark {
  --ion-color-step-50: #000000; /* Fondo negro para temas oscuros */
}

ion-card {
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  border-radius: 8px; /* Bordes redondeados */
  padding: 10px; /* Espaciado interno para hacer que el borde se vea mejor */
}

ion-card-header {
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
}

ion-card-title {
  font-size: 1.2rem;
  font-weight: bold;
}

ion-item {
  --border-color: rgba(0, 0, 0, 0.08);
  margin: 0.5rem 0;
  border-radius: 8px;
  border: 2px solid #bb2a2a; /* Color del borde */
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
}

ion-item:hover {
  cursor: pointer;
}

form {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

ion-button {
  --background: #a22626;
  --background-activated: #a22626;
  --border-radius: 20px;
  font-weight: bold;
  margin-top: 1rem;
}

ion-button.expand-full {
  margin-bottom: 1rem;
}

.custom-title {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente al título */
}

.text-materia {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente a los títulos de las materias */
}

ion-title, ion-label, ion-button, ion-item, ion-card-title, ion-card-content {
  font-family: 'Architects Daughter', cursive;
}

.centrar-boton {
  display: flex;
  justify-content: center; /* Centra horizontalmente */
  align-items: center; /* Centra verticalmente */
  margin: 0 auto; /* Asegura que el botón se mantiene centrado */
  width: 30%; /* Asegura que el contenedor del botón ocupe todo el ancho */
  color: white;
}

.centrar-boton2 {
  color: white;
}

.text-ponde {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente a los títulos de las materias */
}
</style>
