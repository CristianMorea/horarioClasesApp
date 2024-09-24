<template>
  <ion-page class="login">
    <ion-header>
      <ion-toolbar>
        <ion-title>Iniciar Sesión</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form @submit.prevent="login" ref="loginForm">
        <ion-list>
          <!-- Campo de Correo Electrónico -->
          <ion-item>
            <ion-label position="floating">Correo Electrónico</ion-label>
            <ion-input type="email" v-model="email" required></ion-input>
          </ion-item>

          <!-- Campo de Contraseña -->
          <ion-item>
            <ion-label position="floating">Contraseña</ion-label>
            <ion-input type="password" v-model="password" required></ion-input>
          </ion-item>
        </ion-list>

        <!-- Botón para Iniciar Sesión -->
        <ion-button expand="full" type="submit" :disabled="submitting">
          Iniciar Sesión
        </ion-button>

        <!-- Botón para mostrar el formulario de registro -->
        <ion-button expand="full" fill="outline" @click="showRegisterForm">
          Registrarse
        </ion-button>
      </form>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const email = ref('');
    const password = ref('');
    const submitting = ref(false);
    const router = useRouter();

    const login = async () => {
      submitting.value = true;
      try {
const usuarios = supabase.channel('custom-insert-channel')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'usuarios' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
        console.log('Intentando iniciar sesión con:', email.value, password.value);

        // Ejemplo de redirección tras iniciar sesión
        router.push('/home');
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
      } finally {
        submitting.value = false;
      }
    };

    const showRegisterForm = () => {
      // Lógica para mostrar el formulario de registro o redirigir
      router.push('/register');
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
