<template>
  <ion-page>
    <MenuComponent/>
    <ion-header>
      <ion-toolbar>
        <ion-title>PERFIL</ion-title>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon slot="icon-only" name="search-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content id="main-content">
      <!-- Zona de Notas -->
      <div class="notas-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>NOTAS</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-textarea placeholder="Escribe tus notas aquí..."></ion-textarea>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Zona de Materias -->
      <div class="materias-container">
        <ion-list>
          <ion-item>
            <ion-label position="stacked">Title</ion-label>
            <ion-input placeholder="Descripción"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Title</ion-label>
            <ion-input placeholder="Descripción"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Title</ion-label>
            <ion-input placeholder="Descripción"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Title</ion-label>
            <ion-input placeholder="Descripción"></ion-input>
          </ion-item>
        </ion-list>
      </div>

      <!-- Iconos de Funciones -->
      <div class="iconos-funciones">
        <ion-button>
          <ion-icon slot="icon-only" name="create-outline"></ion-icon>
        </ion-button>
        <ion-button>
          <ion-icon slot="icon-only" name="pencil-outline"></ion-icon>
        </ion-button>
        <ion-button>
          <ion-icon slot="icon-only" name="calculator-outline"></ion-icon>
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonTextarea, IonList, IonItem, IonLabel, IonInput } from '@ionic/vue';
import MenuComponent from '../components/MenuComponent.vue';;

export default defineComponent({
  components: {
    MenuComponent,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonTextarea,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
  },
});
</script>

<style scoped>
.notas-container {
  padding: 5px;
}

.materias-container {
  padding: 16px;
}

.iconos-funciones {
  display: flex;
  justify-content: space-around;
  padding: 16px;
}
</style>
