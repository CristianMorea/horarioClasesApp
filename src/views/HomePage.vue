<template>
  <ion-menu content-id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Opciones</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>This is the menu content.
      <ion-menu-toggle>
        <ion-button size="large"expand="full" shape="round">idioma</ion-button>
        <ion-button size="large"expand="full"shape="round">usuario</ion-button>
        <ion-button size="large"expand="full"shape="round">tema</ion-button>
        <ion-button size="large"expand="full"shape="round">cerrar cesion</ion-button>  

      </ion-menu-toggle>
    </ion-content>
  </ion-menu>

  <ion-page id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Menu</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding"> Tap the button in the toolbar to open the menu. </ion-content>
    <div id="container">
        <strong>Ready to create an app?</strong>
        <p>Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
      </div>
  </ion-page>

  <!-- <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Blank</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <strong>Ready to create an app?</strong>
        <p>Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
      </div>
    </ion-content>
  </ion-page> -->
</template>

<script lang="ts">
  import { IonMenuToggle, IonButtons, IonContent, IonItem, IonHeader, IonIcon, IonList, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
  import { defineComponent } from 'vue';
  import { heart } from 'ionicons/icons';

  export default defineComponent({
    components: {
      IonButtons,
      IonIcon,
      IonContent,
      IonHeader,
      IonMenu,
      IonMenuButton,
      IonPage,
      IonTitle,
      IonToolbar,
      IonList,
      IonItem,
      IonMenuToggle,
    },
    setup() {
      return { heart };
    }
  });
</script>

<style scoped>
#container {
  text-align: center;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}

ion-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}





</style>
