import { createRouter, createWebHistory } from '@ionic/vue-router';
import { requireAuth } from './authGuard';
import HomePage from '../views/HomePage.vue';
import RegistroPage from '../views/RegistroPage.vue';
import Ponderado from '../views/ponderado.vue';
import LoginPage from '../views/LoginPage.vue';
import CalendarioPage from '../views/CalendarioPage.vue';
import OlvidoContraseña from '../views/olvidoContraseña.vue';
import CambiarContraseña from '../views/CambiarContraseña.vue'
import CrearHorario from '../components/CrearHorario.vue';
import PruebaMenu from '../views/pruebaMenu.vue';
import HorarioEditar from '../components/HorarioEditar.vue';
import HorarioPage from '../views/HorarioPage.vue';
import HorarioDetails from '../components/HorarioDetails.vue';
import RecordatorioConfiguracion from '../components/RecordatorioConfiguracion.vue';
import UpdatePerfil from '../views/updatePerfil.vue';
import BlogPage from '../views/BlogPage.vue';
import FiltersPage from '../views/FiltersPage.vue';

const routes = [

  {
    path: '/',
    name: 'horario',
    component: HorarioPage,
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
    path: '/filter',
    name: 'Filtro de busquedas',
    component: FiltersPage,
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
    path: '/crearhorario', /*Falta*/
    component: CrearHorario
  },
  {
    path: '/blog', 
    component: BlogPage
  },
  {
    path: '/prueba', 
    component: PruebaMenu
  },
  {
    path: '/horarioeditar', /*Falta*/
    component: HorarioEditar
  },
  {
    path: '/horariodetails/:id', /*Falta*/
    name: 'HorarioDetalle',
    component: HorarioDetails
  },
  {
    path: '/configurar-recordatorio/:id',
    component: RecordatorioConfiguracion
  },
  {
    path: '/modificar-perfil',
    name: 'ModificarPerfil',
    component: UpdatePerfil
  }
  
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
