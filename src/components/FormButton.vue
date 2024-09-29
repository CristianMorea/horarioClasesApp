<template>
  <button
    type="submit"
    class="w-full bg-black text-white font-medium rounded-lg py-4"
    :disabled="disabled"
  >
    {{ text }}
  </button>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';

export default defineComponent({
  props: {
    text: { type: String, required: true },  // Asegúrate de que esta prop esté definida
    disabled: { type: Boolean, default: false },
    type: { type: String, default: 'submit' }, // Por defecto será 'submit'
  },
  setup(props) {
    const { disabled, text } = toRefs(props);

    return {
      disabled,
      text,  // Asegúrate de retornar text
    };
  },
});
</script>
