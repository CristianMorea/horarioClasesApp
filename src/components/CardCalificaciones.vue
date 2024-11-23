<template>
  <div>
    <!-- Recorremos la lista de clases y mostramos la información -->
    <ion-card class="border" v-for="(claseItem, index) in clases" :key="index">
      <ion-card-header>
        <ion-card-title>{{ claseItem.nombre || "Sin nombre" }}</ion-card-title>
      </ion-card-header>
      <ion-card-content class="colors">
        <p><strong>Ubicación:</strong> {{ claseItem.ubicacion || "No especificada" }}</p>
        <p><strong>Hora Inicio:</strong> {{ claseItem.hora_inicio || "No especificada" }}</p>
        <p><strong>Hora Fin:</strong> {{ claseItem.hora_fin || "No especificada" }}</p>
        <p><strong>Profesor:</strong> {{ claseItem.profesor.nombre || "No asignado" }}</p>
        <ion-button class="butonA" @click="abrirModalEdicion(claseItem)">Actualizar</ion-button>

        <!-- Botón flotante añadido -->
        <ion-fab vertical="bottom" slot="fixed">
          <ion-fab-button class="plus" @click="showPopover">
            <ion-icon name="add"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </ion-card-content>
    </ion-card>

    <!-- Modal de edición -->
    <ion-modal :is-open="modalAbierto" @didDismiss="cerrarModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>Editar Clase</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="cerrarModal">Cerrar</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <form @submit.prevent="guardarCambios">
          <ion-item>
            <ion-label position="stacked">Nombre de la clase</ion-label>
            <ion-input v-model="claseEditando.nombre" required></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Ubicación</ion-label>
            <ion-input v-model="claseEditando.ubicacion" required></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Hora de inicio</ion-label>
            <ion-input type="time" v-model="claseEditando.hora_inicio" required></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Hora de fin</ion-label>
            <ion-input type="time" v-model="claseEditando.hora_fin" required></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Profesor</ion-label>
            <ion-select v-model="claseEditando.profesor_id" required>
              <ion-select-option v-for="profesor in profesores" :key="profesor.id" :value="profesor.id">
                {{ profesor.nombre }}
              </ion-select-option>
            </ion-select>
          </ion-item>

          <div class="ion-padding">
            <ion-button type="submit" expand="block" class="butonA">
              Guardar cambios
            </ion-button>
          </div>
        </form>
      </ion-content>
    </ion-modal>

    <!-- Popover con las opciones -->
    <ion-popover :is-open="popoverOpen" @ionPopoverDidDismiss="popoverOpen = false">
      <ion-list>
        <ion-item button @click="handleOptionClick('Tarea')">Tarea</ion-item>
        <ion-item button @click="handleOptionClick('Examen')">Examen</ion-item>
        <ion-item button @click="handleOptionClick('Deveres')">Deveres</ion-item>
      </ion-list>
    </ion-popover>
  </div>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonPopover,
  IonList,
  IonItem,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  alertController
} from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import supabase from '../supabase';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

addIcons({ add });

// Datos reactivos
const clases = ref<Array<any>>([]);
const popoverOpen = ref(false);
const router = useRouter();
const modalAbierto = ref(false);
const claseEditando = ref<any>({});
const profesores = ref<Array<any>>([]);

// Función para obtener los profesores
const obtenerProfesores = async () => {
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

// Función para abrir el modal de edición
const abrirModalEdicion = (clase: any) => {
  claseEditando.value = { ...clase };
  modalAbierto.value = true;
};

// Función para cerrar el modal
const cerrarModal = () => {
  modalAbierto.value = false;
  claseEditando.value = {};
};

// Función para guardar los cambios
const guardarCambios = async () => {
  try {
    const { error } = await supabase
      .from('clases')
      .update({
        nombre: claseEditando.value.nombre,
        ubicacion: claseEditando.value.ubicacion,
        hora_inicio: claseEditando.value.hora_inicio,
        hora_fin: claseEditando.value.hora_fin,
        profesor_id: claseEditando.value.profesor_id
      })
      .eq('id', claseEditando.value.id);

    if (error) throw error;

    // Mostrar alerta de éxito
    const alert = await alertController.create({
      header: 'Éxito',
      message: 'La clase se ha actualizado correctamente',
      buttons: ['OK']
    });
    await alert.present();

    // Cerrar modal y actualizar datos
    cerrarModal();
    await obtenerClases();
  } catch (err) {
    console.error('Error al guardar los cambios:', err);
    
    // Mostrar alerta de error
    const alert = await alertController.create({
      header: 'Error',
      message: 'No se pudo actualizar la clase. Por favor, intente de nuevo.',
      buttons: ['OK']
    });
    await alert.present();
  }
};

// Función para obtener las clases asociadas al usuario autenticado
const obtenerClases = async () => {
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
          const profesor = await obtenerProfesor(clase.profesor_id);
          return { ...clase, profesor };
        }
        return { ...clase, profesor: { nombre: 'No asignado' } };
      })
    );
  } catch (err) {
    console.error('Error al obtener los datos de las clases:', err);
  }
};

const obtenerProfesor = async (profesorId: string) => {
  try {
    const { data, error } = await supabase
      .from('profesores')
      .select('nombre')
      .eq('id', profesorId)
      .single();

    if (error) throw error;
    if (!data) throw new Error('No se encontró el profesor.');

    return data;
  } catch (err) {
    console.error('Error al obtener los datos del profesor:', err);
    return { nombre: 'No asignado' };
  }
};

const showPopover = () => {
  popoverOpen.value = true;
};

const handleOptionClick = (option: string) => {
  if (option === 'Tarea') {
    router.push('/tareas');
  } else if (option === 'Examen') {
    router.push('/examen');
  } else if (option === 'Calificaciones') {
    router.push('/calificaciones');
  } else if (option === 'Deveres'){
    router.push('/verDeveres');
  }
  popoverOpen.value = false;
};

// Cargamos los datos al montar el componente
onMounted(() => {
  obtenerClases();
  obtenerProfesores();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');

body {
  font-family: 'Architects Daughter', cursive;
}

.custom-title {
  font-family: "Architects Daughter", cursive;
}

ion-title, ion-label, ion-button, ion-item, ion-card-title, ion-card-content {
  font-family: 'Architects Daughter', cursive;
}

p {
  margin: 8px 0;
}

.butonA {
  --background: #a22626;
  --background-hover: #a22626;
  --color: #ffffff;
  height: 50px;
  font-size: 12px;
  padding: 0 12px;
  width: 160px;
}

ion-button {
  --background: #a22626;
  --background-activated: #a22626;
  --border-radius: 40px;
  margin-top: 1rem;
}

.plus {
  --background: #a22626;
  --color: white;
  margin-left: 90px;
  position: relative;
  top: -10px;
}

.colors {
  color: rgb(48, 48, 48);
}

.border {
  border-radius: 40px;
}
</style>