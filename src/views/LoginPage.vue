<template>
  <ion-page class="login">
    <ion-header>
      <ion-toolbar class="bg-white">
        <ion-title class="text-gray-900">Iniciar Sesión</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="bg-white">
      <div class="flex flex-col items-center justify-center h-full px-6 py-8">
        <div class="w-full bg-white rounded-lg shadow sm:max-w-md dark:bg-gray-100">
          <div class="p-6 space-y-4">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900">
              Iniciar sesión en tu cuenta
            </h1>
            <form @submit.prevent="login" class="space-y-4">
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
              <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  placeholder="CONTRASEÑA"
                  v-model="password"
                  class="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg w-full p-2.5"
                  required
                />
              </div>
              <button
                type="submit"
                class="w-full bg-black text-white font-medium rounded-lg py-2.5"
                :disabled="submitting"
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                @click="showRegisterForm"
                class="w-full bg-black text-white font-medium rounded-lg py-2.5"
              >
                Registrarse
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
import supabase from '../supabase'; // Asegúrate de que este archivo esté bien configurado

export default defineComponent({
  setup() {
    const email = ref('');
    const password = ref('');
    const submitting = ref(false);
    const router = useRouter();

    const login = async () => {
      submitting.value = true;
      try {
        console.log('Intentando iniciar sesión con:', email.value, password.value);

        // Iniciar sesión usando Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.value,
          password: password.value,
        });

        if (error) {
          console.error('Error al iniciar sesión:', error.message);
          alert(`Error: ${error.message}`);
          return;
        }

        // Verificar si el correo del usuario está confirmado
        if (!data.user?.email_confirmed_at) {
          alert('Tu correo no ha sido verificado. Por favor, revisa tu bandeja de entrada y verifica tu correo electrónico.');
          return;
        }

        // Si el inicio de sesión fue exitoso
        if (data?.user) {
          console.log('Inicio de sesión exitoso para el usuario:', data.user);
          router.push('/home'); // Redirigir a la página de inicio
        }
      } catch (error) {
        console.error('Error en el proceso de inicio de sesión:', error);
        alert('Hubo un error al intentar iniciar sesión. Intenta nuevamente.');
      } finally {
        submitting.value = false;
      }
    };

    const showRegisterForm = () => {
      router.push('/register'); // Redirigir a la página de registro
    };

    return {
      email,
      password,
      submitting,
      login,
      showRegisterForm,
    };
  },
});
</script>

<style scoped>
.login {
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
