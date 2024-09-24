<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Confirmar Correo</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <div class="flex flex-col items-center justify-center h-full">
          <h1 class="text-xl font-bold">Confirmar Correo</h1>
          <button @click="confirmEmail" class="mt-4 bg-black text-white rounded-lg p-2">Confirmar</button>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import supabase from '../supabase';
  
  export default defineComponent({
    setup() {
      const route = useRoute();
      const router = useRouter();
  
      const confirmEmail = async () => {
        const token = route.query.token as string;
  
        if (!token) {
          alert('Token de confirmación no encontrado.');
          return;
        }
  
        // Verificar el correo utilizando el token
        const { error: verificationError } = await supabase.auth.api.verifyEmail(token);
        
        if (verificationError) {
          console.error('Error al confirmar el correo:', verificationError.message);
          alert('Error al confirmar el correo. Intenta nuevamente.');
          return;
        }
  
        // Obtener el usuario actual
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          alert('Error al obtener el usuario. Intenta nuevamente.');
          return;
        }
  
        // Actualiza el estado de verificación en la tabla `usuarios`
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({ esta_verificado: true })
          .eq('id', user.id);
  
        if (updateError) {
          alert(`Error al actualizar el estado de verificación: ${updateError.message}`);
          return;
        }
  
        alert('Correo confirmado con éxito');
        router.push('/login'); // Redirigir a donde sea necesario
      };
  
      // Llama a la función al montar el componente
      onMounted(confirmEmail);
  
      return {};
    },
  });
  </script>
  
  <style scoped>
  /* Estilos opcionales */
  </style>
  