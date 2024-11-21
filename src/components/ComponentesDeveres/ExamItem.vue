<template>
  <ion-item>
    <ion-label>
      <h3>{{ exam.nombre }}</h3>
      <p>{{ exam.descripcion }}</p>
      <p><strong>Fecha de examen:</strong> {{ exam.fecha_examen }}</p>
      <p><strong>Periodo:</strong> {{ exam.periodo }}</p>
      <p>
        <strong>Estado:</strong>
        <span v-if="exam.estado">Completado</span>
        <span v-else>Pendiente</span>
      </p>
    </ion-label>
    <!-- Botón para eliminar -->
    <ion-button color="danger" slot="end" @click="eliminarExamen(exam.id)">
      Eliminar
    </ion-button>
    <!-- Botón para editar -->
    <ion-button color="primary" slot="end" @click="editarExamen(exam.id)">
      Editar
    </ion-button>
  </ion-item>
</template>

<script setup lang="ts">
const props = defineProps<{ exam: any; eliminarExamen: Function; editarExamen: Function }>();
</script>
