<template>
  <ion-item>
    <ion-label>
      <h3>{{ task.nombre }}</h3>
      <p>{{ task.descripcion }}</p>
      <p><strong>Fecha de entrega:</strong> {{ task.fecha_entrega }}</p>
      <p><strong>Periodo:</strong> {{ task.periodo }}</p>
      <p>
        <strong>Estado:</strong>
        <span v-if="task.estado">Completada</span>
        <span v-else>Pendiente</span>
      </p>
    </ion-label>
    <!-- Botón para eliminar -->
    <ion-button color="danger" slot="end" @click="eliminarTarea(task.id_tareas)">
      Eliminar
    </ion-button>
    <!-- Botón para editar -->
    <ion-button color="danger" slot="end" @click="editarTarea(task.id_tareas)">
      Editar
    </ion-button>
  </ion-item>
</template>

<script setup lang="ts">
const props = defineProps<{ task: any; eliminarTarea: Function; editarTarea: Function }>();
</script>
