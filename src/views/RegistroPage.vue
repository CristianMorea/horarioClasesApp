<template>
  <ion-page class="h-screen bg-white">
    <ion-content class="p-0 h-full flex items-center justify-center" style="--offset-top: 0px; --offset-bottom: 0px;">
      <div class="w-full max-w-md bg-white rounded-lg shadow h-full flex flex-col justify-center p-6">
        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 mb-6">
          Crear una cuenta
        </h1>
        <form @submit.prevent="handleCrear" class="space-y-4 flex-grow">
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
    };
  },
});
</script>

<style scoped>
h1 {
  margin: 0;
}
</style>
