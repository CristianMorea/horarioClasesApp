// src/pages/RegistroPage.vue
<template>
  <ion-page id="registro-page">
    <ion-header>
      <ion-toolbar>
        <ion-title>Registro</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="form-container">
        <ion-input placeholder="NOMBRE" v-model="nombre"></ion-input>
        <ion-input placeholder="CORREO ELECTRÓNICO" v-model="correo" type="email"></ion-input>
        <ion-input placeholder="CONTRASEÑA" v-model="contraseña" type="password"></ion-input>
        <ion-button expand="full" @click="handleCrear">Crear</ion-button>
        <ion-button expand="full" @click="handleVolver">Volver</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { IonInput, IonButton, IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import supabase from '../supabase';

export default defineComponent({
  components: {
    IonInput,
    IonButton,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
  },
  setup() {
    const nombre = ref('');
    const correo = ref('');
    const contraseña = ref('');

    const handleCrear = async () => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: correo.value,
          password: contraseña.value,
        });

        if (error) throw error;

        console.log('Usuario registrado:', data);
        alert('Usuario registrado con éxito');
      } catch (error) {
        console.error('Error al registrar el usuario:', error.message);
        alert('Hubo un error al registrar el usuario. Intenta nuevamente.');
      }
    };

    const handleVolver = () => {
      console.log('Volver a la pantalla anterior');
    };

    return {
      nombre,
      correo,
      contraseña,
      handleCrear,
      handleVolver,
    };
  },
});
</script>

<style scoped>
.form-container {
  padding: 16px;
}

ion-input {
  margin-bottom: 12px;
}
</style>
