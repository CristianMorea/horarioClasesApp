<template>
  <button
    type="submit"
    class="w-full bg-black text-white font-medium rounded-lg py-4"
    :disabled="disabled"
  >
    Iniciar Sesión
  </button>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';

export default defineComponent({
  props: {
    disabled: { type: Boolean, default: false },
  },
  setup(props) {
    const { disabled } = toRefs(props);

    return {
      disabled,
    };
  },
});
</script>
