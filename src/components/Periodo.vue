<template>
  <ion-item>
    <ion-label>Periodo</ion-label>
    <ion-select v-model="localPeriodoSeleccionado" placeholder="Selecciona un periodo">
      <ion-select-option v-for="periodo in periodos" :key="periodo.numeroPeriodo" :value="periodo.numeroPeriodo">
        {{ periodo.numeroPeriodo }}
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
    const periodos = ref<Array<any>>([]);
    const localPeriodoSeleccionado = ref(props.modelValue);

    // Función para obtener periodos desde la base de datos
    const obtenerPeriodos = async () => {
      try {
        // Ajuste de la consulta: ahora solo se selecciona el campo numeroPeriodo como ID
        const { data, error } = await supabase.from('Periodo').select('numeroPeriodo');
        if (error) {
          console.error('Error al obtener los periodos:', error);
          return;
        }
        periodos.value = data || [];
      } catch (err) {
        console.error('Error al obtener los periodos:', err);
      }
    };

    // Cargar datos al montar el componente
    onMounted(() => {
      obtenerPeriodos();
    });

    // Emitir cambios hacia el componente padre cuando se seleccione un nuevo período
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
