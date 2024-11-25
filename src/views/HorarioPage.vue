<template>
  <ion-page class="h-screen bg-white flex">
    <MenuComponent/>
    <Notificaciones/>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title class="text-center text-2xl font-bold custom-title">Mi Horario</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="abrirMenuNotificaciones">
            <ion-icon slot="icon-only" :icon="notifications"></ion-icon>
            
          </ion-button>
        </ion-buttons>

       </ion-toolbar> 
    </ion-header>

    <ion-content id="main-content" class="flex-grow relative">
      <carrusel />
      <ion-button class="add-note-button" @click="notaEdit">
        <ion-icon name="add-circle-outline" slot="icon-only"></ion-icon>
      </ion-button>

      <div class="font-bold text-title">MATERIAS</div>

      <div class="clases-container" v-if="clases.length > 0">
        <div class="scrollable-content">
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

    <div class="left-button-container ">
      <img :src="lapizImage" @click="editarP" class="button-image" style="cursor: pointer;"/>
      <ion-button class="rounded-button border vertical-button" @click="ponderadoPage">
        <div class="vertical-text font-bold text-ponde">PONDERADO</div>
      </ion-button>
    </div>
    <TabBar />
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
  IonCardTitle, IonCardContent, IonAlert, IonToast,IonMenuButton,IonButtons,IonIcon,menuController,
} from '@ionic/vue';
import { settingsOutline, searchOutline, notifications, } from 'ionicons/icons';
import MenuComponent from '../components/MenuComponent.vue';
import TabBar from '../components/TabBar.vue';
import carrusel from '../components/carrusel.vue';
import Notificaciones from '../components/Notificaciones.vue';

export default defineComponent({
  components: {
    Notificaciones,
    carrusel,
    TabBar,
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

    const verDetalle = (id) => {
      router.push(`/horariodetails/${id}`);
    };

    const notaEdit = () => {
      router.push('/blog');
    };

    const editarP = () => {
      router.push('/crearhorario');
    };

    const search = () => {
      router.push('/filter');
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
    const abrirMenuNotificaciones = async () => {
        await menuController.open('notificaciones-menu');
      };

  

    onMounted(() => {
      cargarHorario();
    });

    return {
      abrirMenuNotificaciones,
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
      notifications,
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

.scrollable-content {
  border: 3px solid transparent;
  max-height: 379px; /* Ajusta la altura máxima de la lista de materias */
  overflow-y: auto;  /* Habilita el scroll solo verticalmente */
  padding-right: 10px; /* Agrega un poco de espacio si es necesario para la barra de desplazamiento */
  border-radius: 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  padding: 10px;
  
}

.overlay-title {
  margin-left: 185px;
  pointer-events: none; 
  top: 14.5%;
  position: absolute;
  font-family: 'Architects Daughter', sans-serif; /* La misma fuente que los títulos */
  font-weight: bold; /* Negrita */
  color: #bb2a2a;
  font-size: 1.5rem; /* Ajusta el tamaño de fuente según lo necesites */
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7); /* Sombra para dar mayor contraste */
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
  --border-radius: 14px; /* Aplica el borde redondeado aquí */
  --background: #bb2a2a;
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
  border: 2px solid #000000;
}

.vertical-text {
  writing-mode: vertical-rl; /* Hace que el texto esté en vertical */
  transform: rotate(180deg); /* Rota el texto para que quede correctamente alineado */
  color:#f0f0f0
  
}

.border{
  border-radius: 16px; 
  border: 3px solid #000000;
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

.add-note-button {
  bottom: 20px; /* Ajusta según la posición deseada */
  right: 20px; /* Ajusta según la posición deseada */
  --background: #bb2a2a; /* Color de fondo */
  --color: white; /* Color del icono */
  width: 60px; /* Tamaño del botón */
  height: 60px; /* Tamaño del botón */
  border-radius: 50%; /* Redondear el botón */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Sombra para dar relieve */
}

/* Asegúrate de ajustar otros estilos según sea necesario */
</style>

