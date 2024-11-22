
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="$router.push('/horario')" color="primary">
            <img src='@/assets/img/back.png' name="arrow-back" alt="Botón Horario" style="width: 24px; height: 24px;" />
          </ion-button>
        </ion-buttons>
        <ion-title class="text-center text-2xl font-bold custom-title">CREAR HORARIO</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form @submit.prevent="guardarClaseYHorario" class="form-container">
        <ion-item>
          <ion-label position="stacked">Nombre de la Clase (obligatorio)</ion-label>
          <ion-input v-model="nombreClase" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Día de la Clase (obligatorio)</ion-label>
          <ion-select v-model="diaClase" required>
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
          <ion-label position="stacked">Hora de Inicio (obligatorio)</ion-label>
          <ion-input type="time" v-model="horaInicio" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Hora de Fin (obligatorio)</ion-label>
          <ion-input type="time" v-model="horaFin" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Lugar (opcional)</ion-label>
          <ion-input v-model="lugar"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Profesor (opcional)</ion-label>
          <ion-select v-model="profesorId">
            <ion-select-option v-for="profesor in profesores" :key="profesor.id" :value="profesor.id">
              {{ profesor.nombre }}
            </ion-select-option>
          </ion-select>
          <ion-button @click="abrirModalCrearProfesor" expand="block" class="teacher-buttom" size="small" color="secondary">Agregar Profesor</ion-button>
        </ion-item>

        <ion-button type="submit" class="guardar-button">Guardar Clase</ion-button>
      </form>

      <!-- Modal para agregar profesor -->
      <ion-modal :is-open="modalCrearProfesor" >
  <ion-header>
    <ion-toolbar>
      <ion-title>Crear Profesor</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="cerrarModal">Cerrar</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <!-- Campo para el nombre del profesor -->
    <ion-item>
      <ion-label position="stacked">Nombre del Profesor</ion-label>
      <ion-input v-model="nuevoProfesor.nombre" placeholder="Nombre" required></ion-input>
    </ion-item>

    <!-- Campo para el correo del profesor -->
    <ion-item>
      <ion-label position="stacked">Correo del Profesor</ion-label>
      <ion-input v-model="nuevoProfesor.correo" type="email" placeholder="Correo" required></ion-input>
    </ion-item>

    <!-- Botón para guardar el profesor -->
    <ion-button expand="block" @click="crearProfesor">Guardar Profesor</ion-button>
  </ion-content>
</ion-modal>


      <ion-alert
        v-if="mensaje"
        :is-open="true"
        :message="mensaje"
        :buttons="['OK']"
        @didDismiss="mensaje = ''"
      ></ion-alert>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import supabase from '@/supabase';
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
  IonModal,
  IonAlert,
  IonSelect,
  IonSelectOption,
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
    IonModal,
    IonAlert,
    IonSelect,
    IonSelectOption,
  },
  setup() {
    const nombreClase = ref('');
    const diaClase = ref('');
    const horaInicio = ref('');
    const horaFin = ref('');
    const lugar = ref('');
    const profesorId = ref('');
    const mensaje = ref('');
    const profesores = ref([]);
    const modalCrearProfesor = ref(false);
    const nuevoProfesor = ref({ nombre: '', correo: '' });

    const cargarProfesores = async () => {
      const { data, error } = await supabase.from('profesores').select('id, nombre');
      if (error) {
        console.error('Error al cargar profesores:', error.message);
      } else {
        profesores.value = data;
      }
    };

    const guardarClaseYHorario = async () => {
        if (!nombreClase.value || !diaClase.value || !horaInicio.value || !horaFin.value) {
          mensaje.value = 'Por favor, completa todos los campos obligatorios.';
          return;
        }
        // Obtener el ID del usuario logueado
        const { data: { user }, error: userError } = await supabase.auth.getUser();
  
        if (userError) {
          mensaje.value = 'Error al obtener usuario: ' + userError.message;
          return;
        }
  
        if (!user) {
          mensaje.value = 'Debes estar logueado para crear una clase.';
          return;
        }
        // Crear la nueva clase en la tabla 'clases'
        const { data: claseData, error: claseError } = await supabase
          .from('clases')
          .insert([{
            nombre: nombreClase.value,
            profesor_id: profesorId.value,
            ubicacion: lugar.value,
            hora_inicio: horaInicio.value,
            hora_fin: horaFin.value,
            creado_en: new Date().toISOString(),
            actualizado_en: new Date().toISOString(),
            id_usuario: user.id, // Agregar el ID del usuario
          }])
          .select('id'); // Seleccionar el ID de la nueva clase
  
        if (claseError) {
          mensaje.value = 'Error al crear la clase: ' + claseError.message;
          return;
        }
  
        // Usar el ID de la clase recién creada para crear el horario
        const nuevaClaseId = claseData[0].id;
  
        const { error: horarioError } = await supabase
          .from('horarios_clases')
          .insert([{
            clase_id: nuevaClaseId,
            dia_de_clase: diaClase.value, // Asegúrate de que este formato sea correcto
            profesor_id: profesorId.value,
            creado_en: new Date().toISOString(),
            actualizado_en: new Date().toISOString(),
            id_usuario: user.id, // Agregar el ID del usuario
          }]);
  
        if (horarioError) {
          mensaje.value = 'Error al crear el horario: ' + horarioError.message;
        } else {
          mensaje.value = 'Clase y horario creados con éxito.';
          // Limpiar campos después de guardar
          nombreClase.value = '';
          diaClase.value = '';
          horaInicio.value = '';
          horaFin.value = '';
          lugar.value = '';
          profesorId.value = '';
        }
    };

    const abrirModalCrearProfesor = () => {
      nuevoProfesor.value = { nombre: '', correo: '' };
      modalCrearProfesor.value = true;
    };

    const cerrarModal = () => {
      modalCrearProfesor.value = false;
    };

    const crearProfesor = async () => {
      if (!nuevoProfesor.value.nombre || !nuevoProfesor.value.correo) {
        mensaje.value = 'Por favor, completa todos los campos.';
        return;
      }

      const { error } = await supabase.from('profesores').insert(nuevoProfesor.value);

      if (error) {
        console.error('Error al crear profesor:', error.message);
        mensaje.value = 'Error al crear profesor.';
        return;
      }

      mensaje.value = 'Profesor creado con éxito.';
      cerrarModal();
      await cargarProfesores();
    };

    onMounted(() => {
      cargarProfesores();
    });

    return {
      nombreClase,
      diaClase,
      horaInicio,
      horaFin,
      lugar,
      profesorId,
      mensaje,
      profesores,
      modalCrearProfesor,
      nuevoProfesor,
      guardarClaseYHorario,
      abrirModalCrearProfesor,
      cerrarModal,
      crearProfesor,
    };
  },
});
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');

body {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente a todo el cuerpo */
}

.form-container {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5); /* Sombra de la imagen */
  border-radius: 15px; /* Bordes redondeados */
  padding: 16px; /* Espaciado interno */
  width: 350px; /* Ancho fijo (puedes ajustarlo según tus necesidades) */
  height: auto; /* Alto automático (se ajusta al contenido) */
  margin-left: 20px; 
  margin-top: 20px;
  
}

.guardar-button {
  margin-top: 20px; /* Ajusta el valor para bajar el botón */
  margin-left: 90px; 
  color: white;
}

ion-title, ion-label, ion-button, ion-item, ion-card-title, ion-card-content {
  font-family: 'Architects Daughter', cursive;
}

ion-button {
  --background: #a22626;
  --background-activated: #a22626;
  --border-radius: 20px;
  margin-top: 1rem;
  color: white;
}

.button-clear{
  --color: white;
}

.ion-color-secondary{
  --ion-color-base: #a22626 !important;
  --border-radius: 5px;
}

.teacher-buttom{
  background: #a22626;
  border-radius: 20px;
  margin-top: 1rem;
}

ion-title, ion-label, ion-button, ion-item, ion-card-title, ion-card-content {
  font-family: 'Architects Daughter', cursive;
}

:root {
  --ion-color-step-50: #ffffff; /* Fondo blanco para temas claros */
}

.dark {
  --ion-color-step-50: #000000; /* Fondo negro para temas oscuros */
}

.custom-title {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente al título */
}

.text-materia {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente a los títulos de las materias */
}

.text-ponde {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente a los títulos de las materias */
}


</style>