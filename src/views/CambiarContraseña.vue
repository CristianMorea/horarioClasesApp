<template>
    <ion-page class="change-password">
      <ion-header>
        <ion-toolbar class="bg-white">
          <ion-title class="text-gray-900">Cambiar Contraseña</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content class="bg-white">
        <div class="flex flex-col items-center justify-center h-full px-6 py-8">
          <div class="w-full bg-white rounded-lg shadow sm:max-w-md dark:bg-gray-100">
            <div class="p-6 space-y-4">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900">
                Cambia tu contraseña
              </h1>
              <p class="text-sm text-gray-600">
                Introduce tu nueva contraseña.
              </p>
              <form @submit.prevent="changePassword" class="space-y-4">
                <div>
                  <label for="new-password" class="block mb-2 text-sm font-medium text-gray-900">Nueva Contraseña</label>
                  <input
                    id="new-password"
                    type="password"
                    v-model="newPassword"
                    class="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg w-full p-2.5"
                    required
                  />
                </div>
                <div>
                  <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900">Confirmar Contraseña</label>
                  <input
                    id="confirm-password"
                    type="password"
                    v-model="confirmPassword"
                    class="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg w-full p-2.5"
                    required
                  />
                </div>
                <button
                  type="submit"
                  class="w-full bg-black text-white font-medium rounded-lg py-2.5"
                  :disabled="submitting"
                >
                  Cambiar Contraseña
                </button>
              </form>
            </div>
          </div>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import supabase from '../supabase';
  
  export default defineComponent({
    setup() {
      const newPassword = ref('');
      const confirmPassword = ref('');
      const submitting = ref(false);
      const route = useRoute();
      const router = useRouter();
  
      const changePassword = async () => {
        if (newPassword.value !== confirmPassword.value) {
          alert('Las contraseñas no coinciden.');
          return;
        }
  
        submitting.value = true;
        try {
          // Obtén el token de la URL
          const token = route.query.token as string;
  
          const { error } = await supabase.auth.update({ password: newPassword.value });
  
          if (error) {
            alert(`Error: ${error.message}`);
            return;
          }
  
          alert('Tu contraseña ha sido cambiada con éxito.');
          router.push('/login'); // Redirigir al inicio de sesión
        } catch (error) {
          alert('Hubo un error al intentar cambiar la contraseña. Intenta nuevamente.');
        } finally {
          submitting.value = false;
        }
      };
  
      return {
        newPassword,
        confirmPassword,
        submitting,
        changePassword,
      };
    },
  });
  </script>
  
  <style scoped>
  .change-password {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  
  ion-content {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  </style>
  