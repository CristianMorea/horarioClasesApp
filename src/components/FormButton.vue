<template>
    <button
      :type="type"
      :disabled="disabled"
      class="w-full bg-black text-white font-medium rounded-lg py-2.5"
      @click="onClick"
    >
      <slot></slot>
    </button>
  </template>
  
  <script lang="ts">
  export default {
    props: {
      type: {
        type: String,
        default: 'button'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      onClick: {
        type: Function,
        default: () => {}
      }
    }
  }
  </script>
  