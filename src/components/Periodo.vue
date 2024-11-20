<template>
    <ion-item>
      <ion-label>Periodo</ion-label>
      <ion-select v-model="localPeriodoSeleccionado" placeholder="Selecciona un periodo">
        <!-- Iteración sobre los periodos para mostrar solo el número del periodo -->
        <ion-select-option v-for="periodo in periodos" :key="periodo.id_periodo" :value="periodo.id_periodo">
          {{ periodo.numeroPeriodo }} <!-- Mostrar solo el numeroPeriodo -->
        </ion-select-option>
      </ion-select>
    </ion-item>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, watch } from 'vue';
  import supabase from '../supabase';
  
  export default defineComponent({
    name: 'Periodo',
    props: {
      modelValue: {
        type: [String, Number],
        default: null,
      },
    },
    setup(props, { emit }) {
      const periodos = ref<Array<any>>([]); // Lista de periodos
      const localPeriodoSeleccionado = ref(props.modelValue); // Valor local para la selección
  
      // Función para obtener los periodos desde la base de datos
      const obtenerPeriodos = async () => {
        try {
          const { data, error } = await supabase
            .from('Periodo')
            .select('id_periodo, numeroPeriodo');
  
          if (error) {
            console.error('Error al obtener los periodos:', error);
            return;
          }
  
          periodos.value = data || [];
        } catch (err) {
          console.error('Error al obtener los periodos:', err);
        }
      };
  
      // Cargar los periodos al montar el componente
      onMounted(() => {
        obtenerPeriodos();
      });
  
      // Cuando el valor local cambia, emitimos el cambio hacia el componente padre
      watch(localPeriodoSeleccionado, (nuevoValor) => {
        emit('update:modelValue', nuevoValor);
      });
  
      return {
        periodos,
        localPeriodoSeleccionado,
      };
    },
  });
  </script>
  