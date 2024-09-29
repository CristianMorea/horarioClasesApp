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
              Bienvenido
            </h1>
            <form @submit.prevent="login" class="space-y-4">
              <h3 class="text-black">Usuario</h3>
              <div class="relative flex items-center">
                <img
                  src="../assets/iconos_login/usuario.png"
                  alt="Usuario"
                  class="w-5 h-5 absolute left-3"
                />
                <input
                  id="email"
                  type="email"
                  placeholder="Ingresa tu Email"
                  v-model="email"
                  class="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg w-full p-2.5 pl-10"
                  required
                />
              </div>
              <h3 class="text-black">Contraseña</h3>
              <div class="relative flex items-center">
                <img
                  src="../assets/iconos_login/contraseña.png"
                  alt="Contraseña"
                  class="w-5 h-5 absolute left-3"
                />
                <input
                  id="password"
                  type="password"
                  placeholder="*********"
                  v-model="password"
                  class="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg w-full p-2.5 pl-10"
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

    // Función para redirigir al formulario de registro
    const showRegisterForm = () => {
      router.push('/registro'); // Redirigir a la página de registro
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

/* Estilo adicional para mejorar la visibilidad de los iconos */
.relative img {
  width: 24px; /* Ajusta el tamaño si es necesario */
  height: 24px; /* Ajusta el tamaño si es necesario */
}

/* Asegura que los h3 sean de color negro */
h3 {
  color: black; /* Cambia el color del texto a negro */
}
</style>
