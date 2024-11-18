<template>
  <ion-page class="h-screen bg-white flex">
    <ion-header>
      <ion-toolbar>
        <ion-title class="text-center text-2xl font-bold custom-title">PERFIL</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card>
        <ion-card-header>
          <ion-card-title>Modifica tu perfil</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label position="stacked">Nombre Completo</ion-label>
            <ion-input v-model="nombre_usuario" placeholder="Nombre Completo"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Correo Electrónico</ion-label>
            <ion-input v-model="correo" type="email" placeholder="Correo"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Teléfono</ion-label>
            <ion-input v-model="telefono" type="tel" placeholder="Teléfono"></ion-input>
          </ion-item>
          <ion-button @click="cerrar" class="rounded-button cerrar-button" expand="inline">Cerrar</ion-button>
          <ion-button @click="guardarCambios" class="rounded-button guardar-button" expand="inline">Guardar Cambios</ion-button>
          <p v-if="mensaje">{{ mensaje }}</p>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonMenuButton,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton
} from '@ionic/vue'; // Importa los componentes de Ionic
import supabase from '@/supabase'; // Asegúrate de que esta ruta sea correcta
import MenuComponent from "../components/MenuComponent.vue";

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    MenuComponent,
    IonMenuButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton
  },
  setup() {
    const nombre_usuario = ref('');
    const correo = ref('');
    const telefono = ref('');
    const mensaje = ref('');
    const router = useRouter(); // Declara router solo una vez

    // Método para cargar el perfil del usuario
    const cargarPerfil = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData?.session) {
          console.error('Usuario no logueado');
          router.push('/'); 
          return;
        }

        const userId = sessionData.session.user.id;

        const { data, error: profileError } = await supabase
          .from('usuarios')
          .select('nombre_usuario, correo, telefono')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error('Error al obtener el perfil:', profileError.message);
        } else {
          nombre_usuario.value = data.nombre_usuario || '';
          correo.value = data.correo || '';
          telefono.value = data.telefono || '';
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error.message);
      }
    };

    const cerrar = () => {
      router.push('/horario'); // Cambia '/ruta-de-cierre' por la ruta deseada
    };

    const guardarCambios = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData?.session) {
          console.error('Usuario no logueado');
          router.push('/');
          return;
        }

        const userId = sessionData.session.user.id;

        const { error: updateError } = await supabase
          .from('usuarios')
          .update({
            nombre_usuario: nombre_usuario.value,
            correo: correo.value,
            telefono: telefono.value,
          })
          .eq('id', userId);

        if (updateError) {
          console.error('Error al actualizar el perfil:', updateError.message);
          mensaje.value = `Error al guardar los cambios: ${updateError.message}`;
        } else {
          mensaje.value = 'Perfil actualizado con éxito.';
        }
      } catch (error) {
        console.error('Error al guardar cambios:', error.message);
        mensaje.value = `Error al guardar los cambios: ${error.message}`;
      }
    };

    onMounted(cargarPerfil);

    return {
      nombre_usuario,
      correo,
      telefono,
      mensaje,
      cerrar,
      guardarCambios
    };
  },
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');

/* Aplica la fuente a todo el cuerpo de la página */
body {
  font-family: 'Architects Daughter', cursive; /* Aplica la fuente a todo el cuerpo */
  margin: 0; /* Elimina márgenes extra */
  padding: 0; /* Elimina relleno extra */
}

/* Aplica la fuente a todos los componentes de Ionic */
ion-title, ion-label, ion-input, ion-button, ion-card-title, ion-card-header {
  font-family: 'Architects Daughter', cursive; /* Asegura que estos componentes también usen la fuente */
}

/* Estilo para los botones redondeados */
.rounded-button {
  border-radius: 50px; /* Bordes redondeados */
  padding: 12px; /* Espaciado interno para hacerlos más grandes */
  --border-width: 0; /* Elimina bordes adicionales */
  --box-shadow: none; /* Elimina sombra adicional */
  --background: none; /* Para evitar que se aplique un fondo no deseado por defecto */
  --color: white; /* Color del texto */
}

/* Estilo para el botón "Cerrar" */
.cerrar-button {
  --background: #b72121; /* Rojo para el botón "Cerrar" */
  --color: white; /* Color del texto */
}

/* Estilo para el botón "Guardar Cambios" */
.guardar-button {
  --background: #b72121; /* Rojo para el botón "Guardar Cambios" */
  --color: white; /* Color del texto */
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

