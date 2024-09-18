<template>
  <ion-page id="registro-page">
    <ion-header>
      <ion-toolbar>
        <ion-title>Registro</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="form-container">
        <ion-input placeholder="NOMBRE" v-model="nombre"></ion-input>
        <ion-input placeholder="CORREO ELECTRÓNICO" v-model="correo"></ion-input>
        <ion-input placeholder="CONTRASEÑA" v-model="contraseña"></ion-input>
        <ion-button expand="full" @click="handleCrear">Crear</ion-button>
        <ion-button expand="full" @click="handleVolver">Volver</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { IonInput, IonButton, IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';

export default defineComponent({
  components: {
    IonInput,
    IonButton,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
  },
  setup() {
    const nombre = ref('');
    const correo = ref('');
    const contraseña = ref('');

    const handleCrear = () => {
      console.log('Registro creado:', { nombre: nombre.value, correo: correo.value, contraseña: contraseña.value });
    };

    const handleVolver = () => {
      console.log('Volver a la pantalla anterior');
    };

    return {
      nombre,
      correo,
      contraseña,
      handleCrear,
      handleVolver,
    };
  },
});
</script>

<style scoped>
.form-container {
  padding: 16px;
}

ion-input {
  margin-bottom: 12px;
}
</style>
