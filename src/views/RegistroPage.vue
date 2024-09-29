<template>
  <ion-page class="h-screen bg-white">
    <ion-content class="p-0 h-full flex items-center justify-center" style="--offset-top: 0px; --offset-bottom: 0px;">
      <LoginLayout
        :logo="userRegistro"
        title="Crear una cuenta"
        footerText="¿Ya tienes cuenta?"
        footerActionText="Iniciar sesión"
        :handleFooterClick="handleVolver"
      >
        <form @submit.prevent="handleCrear" class="space-y-4 flex-grow">
          <TextInput
            id="nombre"
            label="Tu nombre"
            :icon="userIcon"
            placeholder="NOMBRE"
            v-model="nombre"
            required
          />
          <TextInput
            id="apellido"
            label="Tu apellido"
            :icon="userIcon"
            placeholder="APELLIDO"
            v-model="apellido"
          />
          <TextInput
            id="correo"
            label="Correo electrónico"
            type="email"
            :icon="gmailIcon"
            placeholder="CORREO ELECTRÓNICO"
            v-model="correo"
            required
          />
          <TextInput
            id="telefono"
            label="Teléfono"
            :icon="phoneIcon"
            placeholder="TELÉFONO"
            v-model="telefono"
          />
          <TextInput
            id="contraseña"
            label="Contraseña"
            type="password"
            :icon="passwordIcon"
            placeholder="CONTRASEÑA"
            v-model="contraseña"
            required
          />
          <!-- Eliminar el botón de enviar -->
        </form>
      </LoginLayout>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import supabase from '../supabase';
import TextInput from '../components/TextInput.vue';
import LoginLayout from '../components/LoginLayout.vue'; // Importar el LoginLayout
import userIcon from '../assets/iconos_login/usuario.png';
import gmailIcon from '../assets/iconos_registro/gmail.png';
import phoneIcon from '../assets/iconos_registro/phone.png';
import passwordIcon from '../assets/iconos_registro/password.png';
import userRegistro from '../assets/iconos_registro/usuario_rEGISTRO.png'

export default defineComponent({
  components: {
    TextInput,
    LoginLayout, // Registrar el LoginLayout como componente
  },
  setup() {
    const nombre = ref('');
    const correo = ref('');
    const contraseña = ref('');
    const apellido = ref('');
    const telefono = ref('');
    const router = useRouter();

    const handleCrear = async () => {
      // Validar campos
      if (!nombre.value || !correo.value || !contraseña.value) {
        alert('Por favor, completa todos los campos requeridos.');
        return;
      }

      try {
        // Paso 1: Registrar al usuario en Supabase Auth
        const { data, error: authError } = await supabase.auth.signUp({
          email: correo.value,
          password: contraseña.value,
        });

        // Manejo de error de autenticación
        if (authError) {
          console.error('Error de autenticación:', authError);
          alert(`Error: ${authError.message}`);
          return;
        }

        const user = data?.user;
        if (!user) {
          alert('El usuario no se pudo registrar correctamente. Verifica los datos.');
          return;
        }

        // Paso 2: Insertar en la tabla `usuarios`
        const { error: dbError } = await supabase.from('usuarios').insert([{
          id: user.id,
          nombre_usuario: nombre.value,
          correo: correo.value,
          apellido: apellido.value || null,
          telefono: telefono.value || null,
        }]);

        // Manejo de error de inserción en la base de datos
        if (dbError) {
          console.error('Error al insertar en la tabla usuarios:', dbError);
          alert(`Error al guardar los datos: ${dbError.message}`);
          return;
        }

        alert('Usuario registrado con éxito, por favor verifica tu correo');
        router.push('/Confirmar');

      } catch (error) {
        console.error('Error al registrar el usuario:', error.message);
        alert('Hubo un error al registrar el usuario. Intenta nuevamente.');
      }
    };

    const handleVolver = () => {
      router.push('/login');
    };

    return {
      nombre,
      correo,
      contraseña,
      apellido,
      telefono,
      handleCrear,
      handleVolver,
      userIcon,
      gmailIcon,
      phoneIcon,
      passwordIcon,
      userRegistro
    };
  },
});
</script>

<style scoped>
h1 {
  margin: 0;
}

img {
  width: 10px; /* Ajusta según sea necesario */
  height: 10px; /* Ajusta según sea necesario */
}
</style>
