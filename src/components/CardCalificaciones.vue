<template>
  <div>
    <!-- Recorremos la lista de clases y mostramos la información -->
    <ion-card v-for="(claseItem, index) in clases" :key="index">
      <ion-card-header>
        <ion-card-title>{{ claseItem.nombre || "Sin nombre" }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <p><strong>Ubicación:</strong> {{ claseItem.ubicacion || "No especificada" }}</p>
        <p><strong>Hora Inicio:</strong> {{ claseItem.hora_inicio || "No especificada" }}</p>
        <p><strong>Hora Fin:</strong> {{ claseItem.hora_fin || "No especificada" }}</p>
        <p><strong>Profesor:</strong> {{ claseItem.profesor.nombre || "No asignado" }}</p>
        <ion-button @click="actualizarDatos">Actualizar</ion-button>

        <!-- Botón flotante añadido -->
        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button @click="showPopover">
            <ion-icon name="add"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </ion-card-content>
    </ion-card>

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
  IonItem
} from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Importa useRouter
import supabase from '../supabase';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons'; // Importar el icono "add" de Ionicons

addIcons({ add }); // Registrar el icono "add"

// Datos reactivos
const clases = ref<Array<any>>([]); // Lista de clases
const popoverOpen = ref(false); // Estado para controlar si el popover está abierto
const router = useRouter(); // Inicializamos el router

// Función para obtener las clases asociadas al usuario autenticado
const obtenerClases = async () => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error('Usuario no autenticado.');

    // Consulta para obtener todas las clases del usuario
    const { data, error } = await supabase
      .from('clases')
      .select('id, nombre, ubicacion, hora_inicio, hora_fin, profesor_id')
      .eq('id_usuario', user.id); // Usamos 'id_usuario' para obtener las clases del usuario

    if (error) {
      console.error('Error al obtener las clases:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.error('No se encontraron clases para este usuario.');
      return;
    }

    // Asignamos las clases a la variable reactiva
    clases.value = await Promise.all(
      data.map(async (clase: any) => {
        // Obtenemos los datos del profesor si tiene un profesor_id
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

// Función para obtener los datos del profesor
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

// Función para actualizar los datos de las clases
const actualizarDatos = async () => {
  await obtenerClases();
};

// Función para mostrar el popover
const showPopover = () => {
  popoverOpen.value = true;
};

// Función para manejar la selección de una opción en el popover
const handleOptionClick = (option: string) => {
  console.log(`Opción seleccionada: ${option}`);
  // Redirigimos según la opción seleccionada
  if (option === 'Tarea') {
    router.push('/tareas'); // Redirige a la ruta /tareas
  } else if (option === 'Examen') {
    router.push('/examen'); // Redirige a la ruta /examen
  } else if (option === 'Calificaciones') {
    router.push('/calificaciones'); // Redirige a la ruta /calificaciones
  } else if (option === 'Deveres'){
    router.push('/verDeveres')
  }

  // Cerrar el popover después de seleccionar una opción
  popoverOpen.value = false;
};

// Cargamos los datos al montar el componente
onMounted(obtenerClases);
</script>

<style scoped>
p {
  margin: 8px 0;
}
</style>
