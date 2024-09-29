<template>
  <ion-page class="h-screen bg-white">
    <ion-content class="p-0 h-full flex items-center justify-center" style="--offset-top: 0px; --offset-bottom: 0px;">
      <div class="w-full max-w-md bg-white rounded-lg shadow h-full flex flex-col justify-center p-6">
        <header class="mb-6 text-center">
          <img :src="loginLogo" alt="Logo" class="w-37 h-37 mx-auto mb-4" />
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900">Bienvenido</h1>
        </header>

        <form @submit.prevent="login" class="space-y-4 flex-grow">
          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Usuario</label>
            <div class="relative flex items-center">
              <img :src="userIcon" alt="Usuario" class="w-8 h-8 absolute left-3" />
              <input
                id="email"
                type="email"
                placeholder="Ingresa tu Email"
                v-model="email"
                class="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg w-full p-4 pl-14"
                required
              />
            </div>
          </div>

          <div>
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Contraseña</label>
            <div class="relative flex items-center">
              <img :src="passwordIcon" alt="Contraseña" class="w-8 h-8 absolute left-3" />
              <input
                id="password"
                type="password"
                placeholder="*********"
                v-model="password"
                class="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg w-full p-4 pl-14"
                required
              />
            </div>
            <p class="mt-2 text-sm text-gray-500 cursor-pointer text-right" @click="resetPassword">
              ¿Olvidaste tu contraseña?
            </p>
          </div>

          <button
            type="submit"
            class="w-full bg-black text-white font-medium rounded-lg py-4"
            :disabled="submitting"
          >
            Iniciar Sesión
          </button>
        </form>

        <div class="mt-4 text-center">
          <p class="text-sm text-gray-500">
            ¿No tienes cuenta? 
            <span 
              class="text-blue-500 cursor-pointer" 
              @click="showRegisterForm"
            >
              Registrarte
            </span>
          </p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import supabase from '../supabase';

// Cambia require por import para las imágenes
import loginLogo from '../assets/img/login_logo.png';
import userIcon from '../assets/iconos_login/usuario.png';
import passwordIcon from '../assets/iconos_login/password.png';

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

    // Función para redirigir al formulario de registro
    const showRegisterForm = () => {
      router.push('/registro'); // Redirigir a la página de registro
    };

    // Función para manejar el restablecimiento de contraseña
    const resetPassword = () => {
      alert('Funcionalidad de restablecimiento de contraseña aún no implementada.');
      // Aquí puedes implementar la lógica para el restablecimiento de la contraseña
    };

    return {
      email,
      password,
      submitting,
      login,
      showRegisterForm,
      resetPassword,
      loginLogo,
      userIcon,
      passwordIcon,
    };
  },
});
</script>

<style scoped>
h1 {
  margin: 0;
}

.relative img {
  width: 35px; /* Ajusta el tamaño si es necesario */
  height: 35px; /* Ajusta el tamaño si es necesario */
}
</style>
