<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Modificar Perfil</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card>
        <ion-card-header>
          <ion-card-title>Modifica tu perfil</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label position="floating">Nombre Completo</ion-label>
            <ion-input v-model="nombre_usuario" placeholder="Nombre Completo"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Correo Electrónico</ion-label>
            <ion-input v-model="correo" type="email" placeholder="Correo"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Teléfono</ion-label>
            <ion-input v-model="telefono" type="tel" placeholder="Teléfono"></ion-input>
          </ion-item>
          <ion-button expand="full" @click="cerrar">Cerrar</ion-button>
          <ion-button expand="full" @click="guardarCambios">Guardar Cambios</ion-button>
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
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton
} from '@ionic/vue'; // Importa los componentes de Ionic
import supabase from '@/supabase'; // Asegúrate de que esta ruta sea correcta

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
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
          router.push('/login'); 
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
      router.push('/'); // Cambia '/ruta-de-cierre' por la ruta deseada
    };

    const guardarCambios = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData?.session) {
          console.error('Usuario no logueado');
          router.push('/login');
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
/* Añade tus estilos personalizados aquí si es necesario */
</style>
