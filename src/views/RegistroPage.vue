// src/pages/RegistroPage.vue
<template>
  <ion-page id="registro-page">
    <ion-header>
      <ion-toolbar class="bg-white">
        <ion-title class="text-gray-900">Registro</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="bg-white">
      <div class="flex flex-col items-center justify-center h-full px-6 py-8">
        <div class="w-full bg-white rounded-lg shadow sm:max-w-md dark:bg-gray-100">
          <div class="p-6 space-y-4">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900">
              Crear una cuenta
            </h1>
            <form @submit.prevent="handleCrear" class="space-y-4">
              <div>
                <label for="nombre" class="block mb-2 text-sm font-medium text-gray-900">Tu nombre</label>
                <input
                  id="nombre"
                  placeholder="NOMBRE"
                  v-model="nombre"
                  class="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg w-full p-2.5"
                />
              </div>
              <div>
                <label for="correo" class="block mb-2 text-sm font-medium text-gray-900">Correo electrónico</label>
                <input
                  id="correo"
                  type="email"
                  placeholder="CORREO ELECTRÓNICO"
                  v-model="correo"
                  class="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg w-full p-2.5"
                />
              </div>
              <div>
                <label for="contraseña" class="block mb-2 text-sm font-medium text-gray-900">Contraseña</label>
                <input
                  id="contraseña"
                  type="password"
                  placeholder="CONTRASEÑA"
                  v-model="contraseña"
                  class="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg w-full p-2.5"
                />
              </div>
              <button type="submit" class="w-full bg-black text-white font-medium rounded-lg py-2.5">Crear</button>
              <button type="button" @click="handleVolver" class="w-full bg-black text-white font-medium rounded-lg py-2.5">Volver</button>
            </form>
          </div>
        </div>
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
