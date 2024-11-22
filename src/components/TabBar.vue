<template>
  <div style="background-color: transparent; position: fixed; bottom: 0; width: 100%; z-index: 9;">
  <ion-tab-bar slot="bottom" class="tab-container">
    <div class="tab-island">
      <ion-tab-button @click="navigateTo('/horario')" class="tab-button">
        <ion-icon name="home-outline"></ion-icon>
        <ion-label>Inicio</ion-label>
      </ion-tab-button>
      <ion-tab-button @click="navigateTo('/modificar-perfil')" class="tab-button">
        <ion-icon name="person-outline"></ion-icon>
        <ion-label>Perfil</ion-label>
      </ion-tab-button>
      <ion-tab-button @click="navigateTo('/calificaciones')" class="tab-button">
        <ion-icon name="calculator-outline"></ion-icon>
        <ion-label>calificaciones</ion-label>
      </ion-tab-button>
    </div>
  </ion-tab-bar>
  </div>
</template>

<script>
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/vue';
import { useRouter } from 'vue-router';

export default {
  components: {
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
  },
  setup() {
    const router = useRouter();

    const navigateTo = (route) => {
      router.push(route);
    };

    return {
      navigateTo,
    };
  },
};
</script>

<style scoped>

/* Contenedor de la barra de pestañas */
.tab-container {
  display: flex;
  justify-content: center; /* Centra la isla */
  align-items: center;
  padding: 10px 0; /* Espaciado alrededor de la barra */
  --background: transparent;
}

/* Isla negra para contener los botones */
/* Isla blanca para contener los botones */
.tab-island {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: rgb(255, 252, 252); /* Fondo blanco */
  border: 3px solid #646060;
  width: 90%; /* Ancho adaptable */
  height: 60px; /* Altura de la isla */
  border-radius: 35px; /* Bordes redondeados para elipse */
  box-shadow: b b; /* Sombra para efecto flotante */
}


/* Botones dentro de la isla */
.tab-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: -18px;
  justify-content: center;
  color: #050505; /* Botones blancos */
  font-weight: bold;
  text-align: center;
  flex-grow: 1; /* Distribución uniforme dentro de la isla */
}

.tab-button ion-icon {
  font-size: 1.8rem; /* Tamaño grande para los iconos */
  margin-bottom: 5px; /* Espaciado entre icono y texto */
  color: #0a0a0a; /* Iconos blancos */
}

.tab-button ion-label {
  font-size: 0.85rem; /* Tamaño del texto */
}

/* Efecto al presionar un botón */
.tab-button:active {
  transform: scale(0.1); /* Efecto de reducción al presionar */
  transition: transform 0.2s ease;
}

</style>


