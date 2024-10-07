import { createRouter, createWebHistory } from '@ionic/vue-router';
import HomePage from '../views/HomePage.vue';
import RegistroPage from '../views/RegistroPage.vue';
import PerfilPage from '../views/PerfilPage.vue';
import Ponderado from '../views/ponderado.vue';
import LoginPage from '../views/LoginPage.vue';
import CalendarioPage from '../views/CalendarioPage.vue';
import FechaPage from '../views/FechaPage.vue';
import OlvidoContraseña from '../views/olvidoContraseña.vue';
import CambiarContraseña from '../views/CambiarContraseña.vue'
import CrearHorario from '../components/CrearHorario.vue';
import { requireAuth } from './authGuard';

const routes = [

  {
    path: '/',
    name: 'Home',
    component: HomePage,
    beforeEnter: requireAuth,
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    beforeEnter: requireAuth,
  },
  {
    path: '/registro',
    name: 'Registro Login',
    component: RegistroPage,
  },
  
  {
    path: '/perfil',
    name: 'Perfil',
    component: PerfilPage,
  },
  {
    path: '/ponderado',
    name: 'Ponderado',
    component: Ponderado,
  },
  {
    path: '/login',
    name: 'loginPage',
    component: LoginPage,
  },
  {
    path: '/calendario',
    name: 'Calendario',
    component: CalendarioPage,
  },
  {
    path: '/fecha',
    name: 'Fecha',
    component: FechaPage,
  },
  {
    path: '/olvidoPassword',
    name: 'olvidoContraseña',
    component: OlvidoContraseña,
  },
  {
    path: '/cambiarPassword',
    name: 'cambiarPassworda',
    component: CambiarContraseña,
  },
  {
    path: '/crearhorario', 
    component: CrearHorario
  }
  
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
