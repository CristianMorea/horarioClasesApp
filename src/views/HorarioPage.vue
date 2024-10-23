<template>
  <ion-page class="h-screen bg-white flex">
    <ion-header>
      <ion-toolbar>
        <ion-title class="text-center text-2xl font-bold text-white">Mi Horario</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="flex-grow">
      <div class="clases-container" v-if="clases.length > 0">
        <ion-item v-for="(clase, index) in clases" :key="index" class="item-clase">
          <ion-label @click="verDetalle(clase.id)">
            <h2 class="text-lg font-bold text-white">{{ clase.nombre ? clase.nombre.toUpperCase() : 'Sin Nombre' }}</h2>
            <p class="text-gray-300"><strong>Día:</strong> {{ clase.horarios_clases && clase.horarios_clases[0] ? clase.horarios_clases[0].dia_de_clase : 'Día no disponible' }}</p>
            <p class="text-gray-300"><strong>Hora:</strong> {{ clase.hora_inicio && clase.hora_fin ? `${clase.hora_inicio} - ${clase.hora_fin}` : 'Hora no disponible' }}</p>
            <p v-if="clase.ubicacion" class="text-gray-300"><strong>Ubicación:</strong> {{ clase.ubicacion }}</p>
            <p v-if="clase.profesor" class="text-gray-300"><strong>Profesor:</strong> {{ clase.profesor.nombre }}</p>
          </ion-label>
          <ion-button slot="end" color="danger" @click="confirmarEliminacion(clase.id)">
            Eliminar
          </ion-button>
        </ion-item>
      </div>

      <ion-card v-else>
        <ion-card-header>
          <ion-card-title class="text-center">Sin Clases Programadas</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p class="text-center">No tienes clases programadas en este momento.</p>
        </ion-card-content>
      </ion-card>

      <ion-alert
        :isOpen="alertVisible"
        @didDismiss="() => (alertVisible = false)"
        header="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar esta clase?"
        :buttons="[
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Eliminación cancelada');
            },
          },
          {
            text: 'Eliminar',
            handler: () => {
              eliminarClase(claseIdToDelete);
            },
          }
        ]"
      ></ion-alert>

      <ion-toast
        :isOpen="mensaje !== ''"
        :message="mensaje"
        duration="2000"
        @didDismiss="() => (mensaje = '')"
      />
    </ion-content>

    <div class="left-button-container">
      <!-- Botón pequeño encima del botón ponderado -->
      <ion-button expand="full" color="danger" class="rounded-button vertical-button small-button" @click="editarP">
        <div class="vertical-text">NOTAS</div>
      </ion-button>

      <ion-button expand="full" color="danger" class="rounded-button vertical-button" @click="ponderadoPage">
        <div class="vertical-text">PONDERADO</div>
      </ion-button>
    </div>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import supabase from '../supabase';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonButton, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonAlert, IonToast
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
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonAlert,
    IonToast
  },
  setup() {
    const clases = ref([]);  // Lista de clases existentes
    const mensaje = ref('');
    const alertVisible = ref(false);
    const claseIdToDelete = ref(null);
    const router = useRouter();

    const cargarHorario = async () => {
      const { data, error } = await supabase
        .from('clases')
        .select(`
          *,
          horarios_clases (dia_de_clase)  /* Join con la tabla de horarios */
        `);

      if (error) {
        mensaje.value = 'Error al cargar el horario: ' + error.message;
      } else {
        clases.value = data;
      }
    };

    const verDetalle = (id) => {
      router.push(`/horariodetails/${id}`);
    };

    const abrirNotas = () => {
      router.push('/notas'); // Cambia '/notas' por la ruta correspondiente
    };

    const editarP = () => {
      router.push('/')
    };

    const ponderadoPage = () => {
      router.push('/ponderado'); // Cambia '/notas' por la ruta correspondiente
    };

    const confirmarEliminacion = (id) => {
      claseIdToDelete.value = id;
      alertVisible.value = true;
    };

    const eliminarClase = async (id) => {
      const { error } = await supabase
        .from('clases')
        .delete()
        .eq('id', id);

      if (error) {
        mensaje.value = 'Error al eliminar la clase: ' + error.message;
      } else {
        mensaje.value = 'Clase eliminada con éxito';
        cargarHorario();
      }

      alertVisible.value = false;
    };

    onMounted(() => {
      cargarHorario();
    });

    return {
      clases,
      mensaje,
      alertVisible,
      claseIdToDelete,
      verDetalle,
      abrirNotas,
      confirmarEliminacion,
      eliminarClase,
      ponderadoPage,
      editarP,
    };
  },
});
</script>

<style scoped>
.clases-container {
  padding: 25px; /* Espacio alrededor de las materias */
}

.item-clase {
  border-radius: 30px; /* Borde redondeado de cada materia */
  background-color: #444444; /* Color de fondo para las materias */
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Sombra más ligera */
  overflow: hidden; /* Para que el contenido no sobresalga del borde redondeado */
  color: white; /* Color del texto dentro del item-clase */
  width: 90%; /* Ajusta el ancho de los cuadros de materias */
  margin-left: 10%; /* Desplaza los cuadros a la derecha */
}

.left-button-container {
  position: absolute;
  top: 30%;
  left: 1.8px;
  transform: translateY(-50%); /* Centra el botón verticalmente */
}

.vertical-button {
  height: 150px; /* Ajusta la altura del botón vertical */
}

.small-button {
  height: 100px; /* Ajusta la altura del botón pequeño */
  width: 50px; /* Ajusta el ancho si es necesario */
  margin-bottom: 10px; /* Espacio entre los botones */
}

.vertical-text {
  writing-mode: vertical-rl; /* Hace que el texto esté en vertical */
  transform: rotate(180deg); /* Rota el texto para que quede correctamente alineado */
  color: white; /* Color del texto */
}

.ion-page {
  background-color: #f0f0f0; /* Color de fondo */
}
</style>
