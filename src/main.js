import { createApp } from 'vue'; // Importación única de createApp
import App from './App.vue';
import router from './router';
import { IonicVue } from '@ionic/vue';
import store from './service/Store'; // Asegúrate de que la ruta sea correcta
import { addIcons } from 'ionicons';

import { personCircleOutline, languageOutline, colorPaletteOutline, logOutOutline,sunnyOutline,moonOutline  } from 'ionicons/icons';



/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';


/* Tailwind CSS */
import './index.css';  // Aquí importas Tailwind



/* Theme variables */
import './theme/variables.css';

/* Custom Styles */
import './assets/styles/styles.css';  // Importa los estilos personalizados correctamente
/* Ionic Dark Mode */
import '@ionic/vue/css/palettes/dark.system.css';

const app = createApp(App)
  .use(store) // Registra el store
  .use(IonicVue)
  .use(router);

  addIcons({
    personCircleOutline,
    languageOutline,
    colorPaletteOutline,
    logOutOutline,
    sunnyOutline,
    moonOutline 
  });

router.isReady().then(() => {
  app.mount('#app');
});
