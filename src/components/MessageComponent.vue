<template>
    <ion-alert
      v-if="visible"
      :is-open="visible"
      :header="header"
      :message="message"
      :css-class="`alert-${type}`"
      buttons="Cerrar"
      @ionAlertDidDismiss="close"
    />
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    props: {
      message: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        default: 'info', // Tipos: 'info', 'success', 'error', etc.
      },
    },
    setup(props) {
      const visible = ref(true);
      const header = getHeaderByType(props.type);
  
      const close = () => {
        visible.value = false;
      };
  
      function getHeaderByType(type: string): string {
        switch (type) {
          case 'success':
            return 'Éxito';
          case 'error':
            return 'Error';
          case 'warning':
            return 'Advertencia';
          default:
            return 'Información';
        }
      }
  
      return {
        visible,
        close,
        header,
      };
    },
  });
  </script>
  
  <style scoped>
  .alert-info {
    color: #007bff; /* Azul para información */
  }
  .alert-success {
    color: #28a745; /* Verde para éxito */
  }
  .alert-error {
    color: #dc3545; /* Rojo para error */
  }
  .alert-warning {
    color: #ffc107; /* Amarillo para advertencias */
  }
  </style>
  