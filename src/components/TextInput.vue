<template>
  <div class="mb-4">
    <label :for="id" class="block mb-2 text-sm font-medium text-gray-900">{{ label }}</label>
    <div class="relative flex items-center">
      <img v-if="icon" :src="icon" alt="Icon" class="w-8 h-8 absolute left-3" />
      <input
        :id="id"
        :type="type"
        :placeholder="placeholder"
        v-model="localValue"
        class="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg w-full p-4 pl-14"
        :required="required"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';

export default defineComponent({
  name: 'InputField',
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    icon: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const localValue = ref(props.modelValue);

    watch(localValue, (newValue) => {
      emit('update:modelValue', newValue);
    });

    return {
      localValue,
    };
  },
});
</script>

<style scoped>
/* Aquí puedes agregar estilos específicos si lo deseas */
</style>
