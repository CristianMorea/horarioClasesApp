<template>
  <ion-page class="forgot-password">
    <ion-content class="bg-white">
      <LoginLayout
        :logo="gmailIcon"
        title="Recuperar tu contraseña"
        footerText="¿Ya tienes cuenta? "
        footerActionText="Iniciar sesión"
        :handleSubmit="resetPassword"
        :handleFooterClick="goBackToLogin"
        :submitting="submitting"
      >
        <p class="text-sm text-gray-600 mb-4">
          Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>
        <TextInput
          id="email"
          label="Correo Electrónico"
          type="email"
          :icon="gmailIcon"
          placeholder="CORREO ELECTRÓNICO"
          v-model="email"
          required
        />
        <FormButton
          text="Enviar enlace de recuperación"
          :disabled="submitting"
          @click="resetPassword"
        />
      </LoginLayout>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import supabase from '../supabase';
import FormButton from '../components/FormButton.vue';
import TextInput from '../components/TextInput.vue';
import LoginLayout from '../components/LoginLayout.vue';
import gmailIcon from '../assets/iconos_registro/gmail.png';

export default defineComponent({
  components: {
    TextInput,
    LoginLayout,
    FormButton,
  },
  setup() {
    const email = ref('');
    const submitting = ref(false);
    const router = useRouter();

    const resetPassword = async () => {
      submitting.value = true;
      try {
        console.log('Enviando enlace de recuperación a:', email.value);

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
      gmailIcon,
    };
  },
});
</script>
