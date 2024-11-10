<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Notas Rápidas</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-button expand="full" @click="mostrarInput = !mostrarInput">
      {{ mostrarInput ? 'Cancelar' : 'Agregar Nota' }}
    </ion-button>

    <ion-button expand="full" @click="cerrar">Cerrar</ion-button>

    <div v-if="mostrarInput" class="input-container">
      <ion-input
        v-model="nuevaNota"
        placeholder="Escribe tu nota aquí..."
        @keyup.enter="agregarNota"
      ></ion-input>
      <ion-button @click="agregarNota" color="primary">Agregar</ion-button>
    </div>

    <ion-list>
      <ion-item v-for="(nota, index) in notas" :key="index">
        <ion-label>{{ nota }}</ion-label>
        <ion-button slot="end" color="danger" @click="eliminarNota(index)">Eliminar</ion-button>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script>
import { useRouter } from 'vue-router'; // Importar useRouter para la navegación

export default {
  data() {
    return {
      nuevaNota: '',
      notas: JSON.parse(localStorage.getItem('notas')) || [], // Recuperar notas del localStorage
      mostrarInput: false, // Controlar la visibilidad del input
    };
  },
  
  setup() {
    const router = useRouter(); // Obtener el router para la navegación

    const cerrar = () => {
      router.push('/'); // Redirigir a la lista de horarios
    };

    return { cerrar }; // Hacer la función cerrar disponible en la plantilla
  },

  methods: {
    agregarNota() {
      if (this.nuevaNota.trim() !== '') {
        this.notas.push(this.nuevaNota);
        this.nuevaNota = ''; // Limpiar el campo de entrada
        this.guardarNotas(); // Guardar en localStorage
        this.mostrarInput = false; // Ocultar el input después de agregar
      }
    },
    eliminarNota(index) {
      this.notas.splice(index, 1); // Eliminar la nota
      this.guardarNotas(); // Guardar en localStorage
    },
    guardarNotas() {
      localStorage.setItem('notas', JSON.stringify(this.notas)); // Guardar notas en localStorage
    },
  },
};
</script>

<style scoped>
.input-container {
  display: flex;
  align-items: center;
  margin: 10px 0; /* Espaciado superior e inferior */
}

ion-input {
  flex: 1; /* Hacer que el input ocupe el espacio disponible */
}
</style>
