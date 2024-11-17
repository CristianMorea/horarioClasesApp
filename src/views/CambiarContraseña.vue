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
            <form @submit.prevent="changePassword" class="space-y-4">
              <div>
                <label for="new-password" class="block mb-2 text-sm font-medium text-gray-900">
                  Nueva Contraseña
                </label>
                <input
                  id="new-password"
                  type="password"
                  v-model="newPassword"
                  class="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg w-full p-2.5"
                  required
                />
              </div>
              <div>
                <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900">
                  Confirmar Contraseña
                </label>
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
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import supabase from '../supabase';

export default defineComponent({
  setup() {
    const newPassword = ref('');
    const confirmPassword = ref('');
    const submitting = ref(false);
    const route = useRoute();
    const router = useRouter();

    // Función para obtener y decodificar el token
    const getDecodedToken = () => {
      const hashFragment = window.location.hash;
      if (hashFragment) {
        const params = new URLSearchParams(hashFragment.substring(1));
        return params.get('access_token');
      }
      return route.query.token || route.query.access_token;
    };

    const changePassword = async () => {
      if (newPassword.value !== confirmPassword.value) {
        alert('Las contraseñas no coinciden.');
        return;
      }

      if (newPassword.value.length < 8) {
        alert('La nueva contraseña debe tener al menos 8 caracteres.');
        return;
      }

      submitting.value = true;

      try {
        // Obtener el token
        const token = getDecodedToken();
        
        if (!token) {
          alert('No se ha proporcionado un token válido.');
          return;
        }

        console.log('Token a utilizar:', token); // Para debugging

        // Intentar establecer la sesión primero
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error al obtener la sesión:', sessionError.message);
          alert(`Error de sesión: ${sessionError.message}`);
          return;
        }

        // Actualizar la contraseña usando el token
        const { data, error } = await supabase.auth.updateUser({
          password: newPassword.value
        });

        if (error) {
          console.error('Error al cambiar la contraseña:', error.message);
          alert(`Error: ${error.message}`);
          return;
        }

        alert('Tu contraseña ha sido cambiada con éxito.');
        
        // Cerrar la sesión después de cambiar la contraseña
        await supabase.auth.signOut();
        
        router.push('/login');
      } catch (error) {
        console.error('Error inesperado al cambiar la contraseña:', error);
        alert('Hubo un error al intentar cambiar la contraseña. Intenta nuevamente.');
      } finally {
        submitting.value = false;
      }
    };

    // Verificar el token cuando el componente se monta
    onMounted(async () => {
      const token = getDecodedToken();
      if (!token) {
        alert('No se encontró un token válido en la URL.');
        router.push('/login');
      }
    });

    return {
      newPassword,
      confirmPassword,
      submitting,
      changePassword,
    };
  },
});
</script>