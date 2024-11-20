<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Tareas</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content>
        <MenuComponent />
  
        <form @submit.prevent="guardarTarea">
          <ion-item>
            <ion-label position="floating">Nombre</ion-label>
            <ion-input v-model="nombre" type="text" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Descripción</ion-label>
            <ion-input v-model="descripcion" type="text" required></ion-input>
          </ion-item>
  
          <ion-item>
            <ion-label>¿Está terminada?</ion-label>
            <ion-checkbox v-model="terminada" slot="start"></ion-checkbox>
          </ion-item>
  
          <!-- Componente Periodo -->
          <Periodo v-model="periodoSeleccionado" />
  
          <ion-button expand="full" type="submit">Guardar</ion-button>
        </form>
      </ion-content>
    </ion-page>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import supabase from '../supabase';
  import MenuComponent from '../components/MenuComponent.vue';
  import Periodo from '../components/Periodo.vue'; // Importar el componente Periodo
  
  export default defineComponent({
    components: {
      MenuComponent,
      Periodo, // Usar el componente Periodo
    },
    setup() {
      const descripcion = ref('');
      const nombre = ref('');
      const terminada = ref(false);
      const periodoSeleccionado = ref(null); // Este valor se vincula con Periodo.vue
  
      // Función para guardar la tarea
      const guardarTarea = async () => {
        if (!descripcion.value || !nombre.value || !periodoSeleccionado.value) {
          alert('Por favor complete todos los campos.');
          return;
        }
  
        try {
          const { error } = await supabase.from('tareas').insert([{
            descripcion: descripcion.value,
            terminada: terminada.value,
            nombre: nombre.value,
            periodo_id: periodoSeleccionado.value,  // Guardamos el id del periodo seleccionado
          }]);
  
          if (error) throw error;
          alert('Tarea guardada exitosamente!');
          // Limpia los campos después de guardar
          descripcion.value = '';
          nombre.value = '';
          terminada.value = false;
          periodoSeleccionado.value = null;
        } catch (error) {
          console.error('Error al guardar la tarea:', error);
          alert('Hubo un error al guardar la tarea.');
        }
      };
  
      return {
        descripcion,
        nombre,
        terminada,
        periodoSeleccionado,
        guardarTarea,
      };
    },
  });
  </script>
  