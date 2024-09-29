<template>
  <ion-page class="h-screen bg-white">
    <LoginLayout
      
      title="Bienvenido"
      buttonText="Iniciar Sesión"
      footerText="¿No tienes cuenta?"
      footerActionText="Registrarte"
      :submitting="submitting"
      :handleSubmit="login"
      :handleFooterClick="showRegisterForm"
    >
      <div class="logo-container">
        <img :src="loginLogo" class="logo" alt="Logo" />
      </div>

      <TextInput
        id="email"
        type="email"
        placeholder="Ingresa tu Email"
        v-model="email"
        label="Usuario"
        :icon="userIcon"
        required
      />

      <TextInput
        id="password"
        type="password"
        placeholder="*********"
        v-model="password"
        label="Contraseña"
        :icon="passwordIcon"
        required
      />
      
      <p class="mt-2 text-sm text-gray-500 cursor-pointer text-right" @click="resetPassword">
        ¿Olvidaste tu contraseña?
      </p>
    </LoginLayout>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import supabase from '../supabase';
import LoginLayout from '../components/LoginLayout.vue';
import TextInput from '../components/TextInput.vue';
// Importar imágenes
import loginLogo from '../assets/img/login_logo.png';
import userIcon from '../assets/iconos_login/usuario.png';
import passwordIcon from '../assets/iconos_login/password.png';

export default defineComponent({
  components: {
    LoginLayout,
    TextInput,
  },
  setup() {
    const email = ref('');
    const password = ref('');
    const submitting = ref(false);
    const router = useRouter();

    const login = async () => {
      if (!email.value || !password.value) {
        alert('Por favor, ingresa tu correo electrónico y contraseña.');
        return;
      }

      submitting.value = true;
      try {
        console.log('Intentando iniciar sesión con:', email.value, password.value);

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
      router.push('/registro'); // Redirigir a la página de registro
    };

    const resetPassword = () => {
      router.push('/olvidoPassword'); // Redirigir a la página para recuperar la contraseña
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

.logo-container {
  display: flex;
  justify-content: center; /* Centra horizontalmente el logo */
  margin-bottom: 20px; /* Espacio debajo del logo */
}

.logo {
  width: 60%; /* Ajusta el tamaño según tus necesidades */
  height: auto; /* Mantiene la proporción del logo */
}
</style>
