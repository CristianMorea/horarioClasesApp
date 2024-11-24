<template>
  <ion-page>
    <MenuComponent />
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title class="text-center text-2xl font-bold custom-title">Ponderado</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content id="main-content" class="ion-padding" scroll-y="true">
      <div class="scrollable-content">
      <div>
        <!-- Mostramos las clases asociadas al usuario -->
        <ion-card v-for="(claseItem, index) in clases" :key="index">
          <ion-card-header>
            <!-- Mostramos el nombre de la clase -->
            <ion-card-title>{{ claseItem.nombre || "Sin nombre" }}</ion-card-title>
          </ion-card-header>

          <!-- Llamamos al componente subCardPonderado y le pasamos el ID de la clase -->
          <sub-card-ponderado :idClase="claseItem.id" />
        </ion-card>
      </div>
    </div>

          <!-- Botón Ponderado -->
           <div class="button-container" >
        <ion-button  @click="ponderadoPage">
          Ponderado
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import supabase from '../supabase';
import SubCardPonderado from '../components/subCardPonderado.vue'; // Importamos el componente subCardPonderado
import { useRouter } from 'vue-router';

// Datos reactivos
const clases = ref<Array<any>>([]);
const router = useRouter();

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
      .select('id, nombre')
      .eq('id_usuario', user.id);

    if (error) {
      console.error('Error al obtener las clases:', error);
      return;
    }

    clases.value = data || [];
  } catch (err) {
    console.error('Error al obtener las clases:', err);
  }
};

const ponderadoPage = () => {
      router.push('/horario');
    };

// Cargamos las clases al montar el componente
onMounted(obtenerClases);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');

body {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente a todo el cuerpo */
}

ion-title, ion-label, ion-button, ion-item, ion-card-title, ion-card-content {
  font-family: 'Architects Daughter', cursive;
}


#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.scrollable-content {
  border: 3px solid transparent;
  max-height: 729px; /* Ajusta la altura máxima de la lista de materias */
  overflow-y: auto;  /* Habilita el scroll solo verticalmente */
  padding-right: 10px; /* Agrega un poco de espacio si es necesario para la barra de desplazamiento */
  border-radius: 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  padding: 0px;
  margin-left: -7px;
  margin-right: -7px;
  margin-top: -7px;
  background-color: transparent;
}

ion-button {
  width: 150px; /* Ajusta el ancho del botón */
  height: 45px; /* Ajusta la altura del botón */
  color: white; /* Cambia el color del texto */
  --border-radius: 25px; /* Aplica bordes redondeados */
  border-radius: 25px; /* Aplica bordes redondeados */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3); /* Añade sombra */
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente personalizada */
  font-size: 16px; /* Ajusta el tamaño del texto */
  font-weight: bold; /* Haz que el texto sea más grueso */
  text-align: center; /* Centra el texto dentro del botón */
  --background: #bf1a1a ; /* Cambia el color de fondo del botón */
  margin-top: 8px; /* Baja un poco el botón */
}

.button-container {
  display: flex; /* Usamos flexbox para alinear el contenido */
  justify-content: center; /* Centra horizontalmente */

}


ion-card {
  margin-bottom: 16px;
}
</style>
