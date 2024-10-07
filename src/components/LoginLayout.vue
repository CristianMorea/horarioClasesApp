<template>
  <ion-page class="h-screen bg-white">
    <ion-content class="p-0 h-full flex items-center justify-center" style="--offset-top: 0px; --offset-bottom: 0px;">
      <div class="w-full max-w-md bg-white rounded-lg shadow h-full flex flex-col justify-center p-6">
        <header class="mb-6 text-center">
          <img v-if="logo" :src="logo" alt="Logo" :style="{ width: logoWidth, height: logoHeight }" class="mx-auto mb-4" />
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900">{{ title }}</h1>
        </header>

        <form @submit.prevent="handleSubmit" class="space-y-4 flex-grow">
          <slot></slot> <!-- Aquí se insertan los inputs personalizados -->
          <!-- Eliminar el botón de envío predeterminado -->
          <!-- <SubmitButton :text="buttonText" :disabled="submitting" /> -->
        </form>

        <div class="mt-4 text-center">
          <p class="text-sm text-gray-500">
            {{ footerText }}
            <span 
              class="text-blue-500 cursor-pointer" 
              @click="handleFooterClick"
            >
              {{ footerActionText }}
            </span>
          </p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
// No es necesario importar SubmitButton si lo has comentado
// import SubmitButton from '../components/FormButton.vue';

export default defineComponent({
  // components: {
  //   SubmitButton,
  // },
  props: {
    logo: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    // Eliminar `buttonText` si no se usa más
    footerText: {
      type: String,
      default: '¿No tienes cuenta? ',
    },
    footerActionText: {
      type: String,
      default: 'Registrarte',
    },
    handleSubmit: {
      type: Function as PropType<() => void>,
      required: true,
    },
    handleFooterClick: {
      type: Function as PropType<() => void>,
      required: true,
    },
    submitting: {
      type: Boolean,
      default: false,
    },
    logoWidth: {
      type: String,
      default: '100px',
    },
    logoHeight: {
      type: String,
      default: '100px',
    },
  },
});

</script>

<style scoped>
h1 {
  margin: 0;
}
</style>
