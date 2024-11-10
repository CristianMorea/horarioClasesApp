<template>
    <ion-page>

      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="$router.push('/')">Atrás</ion-button>
          </ion-buttons>
          <ion-title>Crear Clase y Horario</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content>
        <form @submit.prevent="guardarClaseYHorario">
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
          </ion-item>
  
          <ion-button expand="full" type="submit">Guardar Clase y Horario</ion-button>
  
          <ion-alert
            v-if="mensaje"
            :is-open="true"
            :message="mensaje"
            :buttons="['OK']"
            @didDismiss="mensaje = ''"
          ></ion-alert>
        </form>
      </ion-content>
    </ion-page>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import supabase from '@/supabase';
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonAlert, IonSelect, IonSelectOption } from '@ionic/vue';
  
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
        guardarClaseYHorario,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Agrega estilos personalizados aquí si es necesario */
  </style>
  