import { createRouter, createWebHistory } from '@ionic/vue-router';

import HomePage from '../views/HomePage.vue'
import RegistroPage from '../views/RegistroPage.vue';
import PerfilPage from '../views/PerfilPage.vue';
import Ponderado from '../views/ponderado.vue';
import LoginPage from '../views/LoginPage.vue';
import CalendarioPage from '../views/CalendarioPage.vue';
const routes=[
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/registro',
    name: 'Registro Login',
    component: RegistroPage
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: PerfilPage
  },
  {
    path: '/ponderado',
    name: 'Ponderado',
    component: Ponderado
  },
   {
    path: '/login',
    name: 'loginPage',
    component: LoginPage
  },
  {
    path: '/calendario',
    name: 'Calendario',
    component: CalendarioPage 
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
