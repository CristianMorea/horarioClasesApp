<template>
  <ion-page class="forgot-password">
    <ion-header>
      <ion-toolbar class="bg-white">
        <ion-title class="text-gray-900">Recuperar Contraseña</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="bg-white">
      <div class="flex flex-col items-center justify-center h-full px-6 py-8">
        <div class="w-full bg-white rounded-lg shadow sm:max-w-md dark:bg-gray-100">
          <div class="p-6 space-y-4">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900">
              Recuperar tu contraseña
            </h1>
            <p class="text-sm text-gray-600">
              Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>
            <form @submit.prevent="resetPassword" class="space-y-4">
              <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Correo Electrónico</label>
                <input
                  id="email"
                  type="email"
                  placeholder="CORREO ELECTRÓNICO"
                  v-model="email"
                  class="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg w-full p-2.5"
                  required
                />
              </div>
              <button
                type="submit"
                class="w-full bg-black text-white font-medium rounded-lg py-2.5"
                :disabled="submitting"
              >
                Enviar enlace de recuperación
              </button>
              <button
                type="button"
                @click="goBackToLogin"
                class="w-full bg-black text-white font-medium rounded-lg py-2.5"
              >
                Volver a Iniciar Sesión
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
import { useRouter } from 'vue-router';
import supabase from '../supabase';

export default defineComponent({
  setup() {
    const email = ref('');
    const submitting = ref(false);
    const router = useRouter();

    const resetPassword = async () => {
      submitting.value = true;
      try {
        console.log('Enviando enlace de recuperación a:', email.value);
        
        // Añade la URL de redirección
        const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
          redirectTo: 'http://localhost:5173/cambiarPassword',
        });

        if (error) {
          console.error('Error al enviar el enlace de recuperación:', error.message);
          alert(`Error: ${error.message}`);
          return;
        }

        alert('Se ha enviado un enlace de recuperación a tu correo electrónico.');
      } catch (error) {
        console.error('Error en el proceso de recuperación de contraseña:', error);
        alert('Hubo un error al intentar enviar el enlace de recuperación. Intenta nuevamente.');
      } finally {
        submitting.value = false;
      }
    };

    const goBackToLogin = () => {
      router.push('/login');
    };

    return {
      email,
      submitting,
      resetPassword,
      goBackToLogin,
    };
  },
});
</script>

<style scoped>
.forgot-password {
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

ion-button {
  margin-top: 20px;
}
</style>
