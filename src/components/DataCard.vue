<template>
    <ion-card>
      <ion-card-header>
        <ion-card-title>{{ titulo }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-list>
          <ion-item v-for="(item, index) in items" :key="index">
            <ion-label>
              <h3>{{ item.nombre }}</h3>
              <p>{{ item.descripcion }}</p>
              <p><strong>Fecha:</strong> {{ item.fecha_entrega || item.fecha_examen }}</p>
              <p><strong>Periodo:</strong> {{ item.periodo }}</p>
              <p>
                <strong>Estado:</strong>
                <span v-if="item.estado">Realizado</span>
                <span v-else>Pendiente</span>
              </p>
            </ion-label>
            <ion-button color="primary" slot="end" @click="$emit('editar', item)">
              Editar
            </ion-button>
            <ion-button color="danger" slot="end" @click="$emit('eliminar', item.id)">
              Eliminar
            </ion-button>
          </ion-item>
        </ion-list>
      </ion-card-content>
    </ion-card>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    titulo: string;
    items: Array<any>;
  }>();
  </script>
  
  <style scoped>
  ion-button {
    margin-left: 10px;
  }
  </style>
  