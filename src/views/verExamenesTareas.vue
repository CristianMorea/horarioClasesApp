<template>
  <ion-page>
    <MenuComponent />
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="redirigirAhorarioPage" color="primary">
                <img src='@/assets/img/back.png' name="arrow-back" alt="Botón Horario" style="width: 24px; height: 24px;" />
            </ion-button>
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title class="text-center text-2xl font-bold custom-title">Deveres</ion-title>
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

          <!-- Llamamos al componente subCard y le pasamos el ID de la clase -->
          <sub-card :idClase="claseItem.id" />
        </ion-card>
      </div>
    </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import supabase from '../supabase';
import SubCard from '../components/subCard.vue'; // Importamos el componente subCard
import { useRouter } from 'vue-router';

// Datos reactivos
const clases = ref<Array<any>>([]);
const router = useRouter();


// Función para redirigir a la página de horario
const redirigirAhorarioPage = () => {
  router.push('/calificaciones'); // Navega a la página de horario
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

.scrollable-content {
  border: 3px solid transparent;
  max-height: 782px; /* Ajusta la altura máxima de la lista de materias */
  overflow-y: auto;  /* Habilita el scroll solo verticalmente */
  padding-right: 10px; /* Agrega un poco de espacio si es necesario para la barra de desplazamiento */
  border-radius: 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  padding: 0px;
  margin-left: -10px;
  margin-right: -10px;
  margin-top: -7px;
  background-color: transparent;
}

#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

ion-card {
  margin-bottom: 16px;
}

</style>
