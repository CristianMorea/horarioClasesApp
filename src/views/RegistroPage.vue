<template>
  <ion-page id="registro-page">
    <ion-header>
      <ion-toolbar class="bg-white">
        <ion-title class="text-gray-900">Registro</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="bg-white">
      <div class="flex flex-col items-center justify-center h-full px-6 py-8">
        <div class="w-full bg-white rounded-lg shadow sm:max-w-md dark:bg-gray-100">
          <div class="p-6 space-y-4">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900">
              Crear una cuenta
            </h1>
            <form @submit.prevent="handleCrear" class="space-y-4">
              <div>
                <label for="nombre" class="block mb-2 text-sm font-medium text-gray-900">Tu nombre</label>
                <input
                  id="nombre"
                  placeholder="NOMBRE"
                  v-model="nombre"
                  class="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg w-full p-2.5"
                  required
                />
              </div>
              <div>
                <label for="apellido" class="block mb-2 text-sm font-medium text-gray-900">Tu apellido</label>
                <input
                  id="apellido"
                  placeholder="APELLIDO"
                  v-model="apellido"
                  class="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg w-full p-2.5"
                />
              </div>
              <div>
                <label for="correo" class="block mb-2 text-sm font-medium text-gray-900">Correo electrónico</label>
                <input
                  id="correo"
                  type="email"
                  placeholder="CORREO ELECTRÓNICO"
                  v-model="correo"
                  class="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg w-full p-2.5"
                  required
                />
              </div>
              <div>
                <label for="telefono" class="block mb-2 text-sm font-medium text-gray-900">Teléfono</label>
                <input
                  id="telefono"
                  placeholder="TELÉFONO"
                  v-model="telefono"
                  class="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg w-full p-2.5"
                />
              </div>
              <div>
                <label for="contraseña" class="block mb-2 text-sm font-medium text-gray-900">Contraseña</label>
                <input
                  id="contraseña"
                  type="password"
                  placeholder="CONTRASEÑA"
                  v-model="contraseña"
                  class="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg w-full p-2.5"
                  required
                />
              </div>
              <button type="submit" class="w-full bg-black text-white font-medium rounded-lg py-2.5">Crear</button>
              <button type="button" @click="handleVolver" class="w-full bg-black text-white font-medium rounded-lg py-2.5">Volver</button>
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
import supabase from '../supabase';

export default defineComponent({
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
          // Controlar el error 429
          if (authError.message.includes('429')) {
            alert('Demasiadas solicitudes. Por favor, espera un momento antes de volver a intentar.');
          }
          return;
        }

        const user = data?.user;
        if (!user) {
          alert('El usuario no se pudo registrar correctamente. Verifica los datos.');
          return;
        }

        // Paso 2: Insertar en la tabla `usuarios`
        const { error: dbError } = await supabase.from('usuarios').insert([{
          id: user.id, // Asigna el ID del usuario autenticado
          nombre_usuario: nombre.value,
          correo: correo.value,
          apellido: apellido.value || null,
          telefono: telefono.value || null,
          esta_verificado: false, // Inicialmente no está verificado
        }]);

        // Manejo de error de inserción en la base de datos
        if (dbError) {
          console.error('Error al insertar en la tabla usuarios:', dbError);
          alert(`Error al guardar los datos: ${dbError.message}`);
          return;
        }

        alert('Usuario registrado con éxito, por favor verifica tu correo');

        // Redirigir al usuario a la página de confirmación
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
    };
  },
});
</script>

<style scoped>
.form-container {
  padding: 16px;
}

ion-input {
  margin-bottom: 12px;
}
</style>
