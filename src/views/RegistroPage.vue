<template>
  <!-- El template permanece igual -->
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
            :disabled="loading"
          />
          <TextInput
            id="apellido"
            label="Tu apellido"
            :icon="userIcon"
            placeholder="APELLIDO"
            v-model="apellido"
            :disabled="loading"
          />
          <TextInput
            id="correo"
            label="Correo electrónico"
            type="email"
            :icon="gmailIcon"
            placeholder="CORREO ELECTRÓNICO"
            v-model="correo"
            required
            :disabled="loading"
          />
          <TextInput
            id="telefono"
            label="Teléfono"
            :icon="phoneIcon"
            placeholder="TELÉFONO"
            v-model="telefono"
            :disabled="loading"
          />
          <TextInput
            id="contraseña"
            label="Contraseña"
            type="password"
            :icon="passwordIcon"
            placeholder="CONTRASEÑA"
            v-model="contraseña"
            required
            :disabled="loading"
          />

          <!-- Mensaje de error -->
          <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-400 p-4">
            <div class="flex">
              <div class="ml-3">
                <p class="text-sm text-red-700">{{ errorMessage }}</p>
              </div>
            </div>
          </div>

          <FormButton 
            :text="loading ? 'Registrando...' : 'Registrar usuario'" 
            :disabled="!isFormValid || loading" 
          />
        </form>
      </LoginLayout>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import supabase from '../supabase';
import TextInput from '../components/TextInput.vue';
import LoginLayout from '../components/LoginLayout.vue';
import FormButton from '../components/FormButton.vue';
import userIcon from '../assets/iconos_login/usuario.png';
import gmailIcon from '../assets/iconos_registro/gmail.png';
import phoneIcon from '../assets/iconos_registro/phone.png';
import passwordIcon from '../assets/iconos_registro/password.png';
import userRegistro from '../assets/iconos_registro/usuario_rEGISTRO.png'

export default defineComponent({
  components: {
    TextInput,
    LoginLayout,
    FormButton,
  },
  setup() {
    const nombre = ref('');
    const correo = ref('');
    const contraseña = ref('');
    const apellido = ref('');
    const telefono = ref('');
    const loading = ref(false);
    const errorMessage = ref('');
    const router = useRouter();

    const isFormValid = computed(() => {
      return nombre.value.trim() && 
             correo.value.trim() && 
             contraseña.value.trim() &&
             contraseña.value.length >= 6;
    });

    const validateEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const handleCrear = async () => {
      try {
        errorMessage.value = '';
        
        // Validaciones
        if (!isFormValid.value) {
          errorMessage.value = 'Por favor, completa todos los campos requeridos.';
          return;
        }

        if (!validateEmail(correo.value)) {
          errorMessage.value = 'Por favor, ingresa un correo electrónico válido.';
          return;
        }

        if (contraseña.value.length < 6) {
          errorMessage.value = 'La contraseña debe tener al menos 6 caracteres.';
          return;
        }

        loading.value = true;

        // Verificar si el usuario ya existe
        const { data: existingUser } = await supabase
          .from('usuarios')
          .select('correo')
          .eq('correo', correo.value)
          .single();

        if (existingUser) {
          errorMessage.value = 'Este correo electrónico ya está registrado.';
          loading.value = false;
          return;
        }

        // Registro en Supabase Auth sin opciones de redirección de email
        const { data, error: authError } = await supabase.auth.signUp({
          email: correo.value,
          password: contraseña.value,
          options: {
            data: {
              nombre: nombre.value,
              apellido: apellido.value,
            }
          }
        });

        if (authError) {
          switch(authError.message) {
            case 'User already registered':
              errorMessage.value = 'Este correo electrónico ya está registrado.';
              break;
            default:
              errorMessage.value = 'Error al crear la cuenta. Por favor intenta nuevamente.';
              console.error('Error de autenticación:', authError);
          }
          return;
        }

        const user = data?.user;
        if (!user) {
          errorMessage.value = 'No se pudo completar el registro. Por favor intenta nuevamente.';
          return;
        }

        // Insertar datos en la tabla usuarios
        const { error: dbError } = await supabase.from('usuarios').insert([{
          id: user.id,
          nombre_usuario: nombre.value,
          correo: correo.value,
          apellido: apellido.value || null,
          telefono: telefono.value || null,
        }]);

        if (dbError) {
          errorMessage.value = 'Error al guardar los datos de usuario.';
          console.error('Error al insertar en la tabla usuarios:', dbError);
          return;
        }


        // Mostrar mensaje de éxito y redirigir
        alert('Cuenta creada exitosamente. Ya puedes iniciar sesión.');
     

        router.push('/login');

      } catch (error) {
        errorMessage.value = 'Ocurrió un error inesperado. Por favor intenta nuevamente.';
        console.error('Error al registrar el usuario:', error);
      } finally {
        loading.value = false;
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
      loading,
      errorMessage,
      isFormValid,
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