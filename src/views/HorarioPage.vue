<template>
  <ion-page class="h-screen bg-white flex">
    <MenuComponent/>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title class="text-center text-2xl font-bold custom-title">Mi Horario</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="search">
            <ion-icon :icon="searchOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content id="main-content" class="flex-grow">
        <img :src="notaImage" @click="notaEdit" class="custom-button" style="cursor: pointer;"/>
        <div class="font-bold text-title">MATERIAS</div>

      <div class="clases-container" v-if="clases.length > 0">
        <ion-item v-for="(clase, index) in clases" :key="index" class="item-clase">
          <ion-label @click="verDetalle(clase.id)">
            <h2 class="text-lg font-bold text-materia">{{ clase.nombre ? clase.nombre.toUpperCase() : 'Sin Nombre' }}</h2>
            <p class="text-gray-300"><strong>Día:</strong> {{ clase.horarios_clases && clase.horarios_clases[0] ? clase.horarios_clases[0].dia_de_clase : 'Día no disponible' }}</p>
            <p class="text-gray-300"><strong>Hora:</strong> {{ clase.hora_inicio && clase.hora_fin ? `${clase.hora_inicio} - ${clase.hora_fin}` : 'Hora no disponible' }}</p>
            <p v-if="clase.ubicacion" class="text-gray-300"><strong>Ubicación:</strong> {{ clase.ubicacion }}</p>
            <p v-if="clase.profesor" class="text-gray-300"><strong>Profesor:</strong> {{ clase.profesor.nombre }}</p>
          </ion-label>
          <ion-button slot="end" color = danger  class = "button-edit" @click="confirmarEliminacion(clase.id)">
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
        :buttons="[{
          text: 'Cancelar',
          role: 'cancel',
          handler: () => { console.log('Eliminación cancelada'); }
        },
        {
          text: 'Eliminar',
          handler: () => { eliminarClase(claseIdToDelete); }
        }]"
      ></ion-alert>

      <ion-toast
        :isOpen="mensaje !== ''"
        :message="mensaje"
        duration="2000"
        @didDismiss="() => (mensaje = '')"
      />
    </ion-content>

    <div class="left-button-container">
      <img :src="lapizImage" @click="editarP" class="button-image" style="cursor: pointer;"/>
      <ion-button color="danger" class="rounded-button vertical-button" @click="ponderadoPage">
        <div class="vertical-text font-bold text-ponde">PONDERADO</div>
      </ion-button>
    </div>
  </ion-page>
</template>

<script lang="ts">

import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import supabase from '../supabase';
import lapizImage from '@/assets/img/Lapiz.png';
import notaImage from '@/assets/img/Notas.png';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonButton, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonAlert, IonToast,IonMenuButton,IonButtons,IonIcon
} from '@ionic/vue';
import { settingsOutline, searchOutline } from 'ionicons/icons';
import MenuComponent from '../components/MenuComponent.vue';

export default defineComponent({
  components: {
    IonIcon,
    IonButtons,
    IonMenuButton,
    MenuComponent,
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
    const clases = ref([]);
    const mensaje = ref('');
    const alertVisible = ref(false);
    const claseIdToDelete = ref(null);
    const router = useRouter();
    const notaImageRef = ref(notaImage);
    const lapizImageRef = ref(lapizImage);

    const cargarHorario = async () => {
      const { data, error } = await supabase
        .from('clases')
        .select(`*,
          horarios_clases (dia_de_clase)`);

      if (error) {
        mensaje.value = 'Error al cargar el horario: ' + error.message;
      } else {
        clases.value = data;
      }
    };

    const verDetalle = (id) => {
      router.push(`/horariodetails/${id}`);
    };

    const notaEdit = () => {
      router.push('/blog');
    };

    const editarP = () => {
      router.push('/crearhorario');
    };

    const ponderadoPage = () => {
      router.push('/ponderado');
    };

    const abrirOtraVista = () => {
      router.push('/otra-vista'); // Cambia a la ruta deseada para abrir la nueva vista
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

    

    const search = () => {
      console.log('Buscar acción iniciada');
      // Aquí puedes abrir un cuadro de búsqueda o filtrar la lista de materias
      // router.push('/buscar'); // Cambia a la ruta deseada
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
      notaEdit,
      editarP,
      notaImage : notaImageRef,
      lapizImage: lapizImageRef,
      confirmarEliminacion,
      eliminarClase,
      ponderadoPage,
      search,
      abrirOtraVista, // Añadir la función aquí
      settingsOutline,
      searchOutline,
    };
  },
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');

body {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente a todo el cuerpo */
}

.clases-container {
  padding: 10px; /* Espacio alrededor de las materias */
  margin-top: 0px; /* Cambia este valor para desplazar hacia abajo */
  
}

ion-item.item-clase {
  border-radius: 30px; /* Borde redondeado de cada materia */
  background-color: #868181; /* Color de fondo para las materias */
  margin-bottom: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Sombra más ligera */
  overflow: hidden; /* Para que el contenido no sobresalga del borde redondeado */
  color: white; /* Color del texto dentro del item-clase */
  width: 100%; /* Ajusta el ancho de los cuadros de materias */
  border: 2px solid #7b7676; /* Borde de 2px con color rojo oscuro */
}

.left-button-container {
  position: absolute;
  top: 19%;
  left: 5.7px;
  transform: translateY(-50%); /* Centra el botón verticalmente */
}

.vertical-button {
  height: 130px; /* Ajusta la altura del botón vertical */
  width: 45px; /* Ajusta el ancho si es necesario */
  border-radius: 45px; /* Aplica el borde redondeado aquí */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5); /* Sombra de la imagen */
  
}

.small-button {
  height: 100px; /* Ajusta la altura del botón pequeño */
  width: 50px; /* Ajusta el ancho si es necesario */
  margin-bottom: 10px; /* Espacio entre los botones */
}

.button-image {
  height: 50px; /* Ajusta la altura deseada */
  width: 45px; /* Mantiene la proporción de la imagen */
  margin-left: 2px; /* Espacio entre los botones */
  border-radius: 15px; /* Ajusta el valor para el redondeado de los bordes */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5); /* Sombra de la imagen */
}

.vertical-text {
  writing-mode: vertical-rl; /* Hace que el texto esté en vertical */
  transform: rotate(180deg); /* Rota el texto para que quede correctamente alineado */
  color:#f0f0f0
  
}

.custom-title {
  color: #000000; /* Color rojo */
}

ion-content {
  padding: 0; /* Elimina el padding por defecto */
  margin: 0; /* Elimina el margen por defecto */
}

.custom-button {
  width: 318px; /* Ajusta el ancho según tus necesidades */ 
  height: 250px; /* Ajusta la altura del botón pequeño */
  margin-top: 11px; /* Cambia este valor para desplazar hacia abajo */
  margin-left: 16%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5); /* Sombra de la imagen */
  border-radius: 15px; /* Ajusta el valor para el redondeado de los bordes */
  border: 3px solid #7b7676; /* Borde de 2px con color rojo oscuro */
}

ion-icon {
  color: #000000; /* Cambia este valor por el color que desees */
  
}

.text-title {
  margin-left: 32%;
  margin-top: 15px; 
  font-size: 30px;
  font-weight: bold; /* Esto asegura que el texto esté en negrita */
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente a los títulos de las materias */
}

.text-materia {
  color: #bb2a2a; /* Cambia este color al que desees */
  font-weight: bold; /* Esto asegura que el texto esté en negrita */

}

.button-edit{
  color: #ffffff; /* Cambia este color al que desees */

}


.ion-page {
  background-color: #f0f0f0; /* Color de fondo */
  height: 100vh; /* Asegura que la página ocupe toda la altura de la ventana */
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

/* Asegúrate de ajustar otros estilos según sea necesario */
</style>

