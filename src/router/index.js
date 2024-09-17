import { createRouter, createWebHistory } from '@ionic/vue-router';

import HomePage from '../views/HomePage.vue'
import RegistroPage from '../views/RegistroPage.vue';
import PerfilPage from '../views/PerfilPage.vue';

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
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
