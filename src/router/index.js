import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Registo from '../views/Registo.vue';
import Dashboard from '../views/Dashboard/Dashboard.vue';
import Painel from '../views/Painel.vue';
import Perfil from '../views/Perfil.vue';
import { useAuthStore } from '@/store/auth';
import MinhasEncomendas from '../views/MinhasEncomendas.vue';
import HistoricoEncomendas from "@/views/HistoricoEncomendas.vue";
import TicketsAbertos from '@/views/Dashboard/TicketsAbertos.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/registo', name: 'Registo', component: Registo },
  {path: '/minhas-encomendas', name: 'MinhasEncomendas', component: MinhasEncomendas},
  { path: '/historico-encomendas', name: 'HistoricoEncomendas', component: HistoricoEncomendas, meta: { requiresAuth: true } },
  { path: '/perfil', name: 'Perfil', component: Perfil, meta: { requiresAuth: true } },
  {path: '/tickets', name: 'TicketsCliente', component: () => import('@/views/TicketsCliente.vue'), meta: { requiresAuth: true }},

{
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard', component: Painel },
      { path: 'novo-envio', name: 'NovoEnvio', component: () => import('@/views/Dashboard/NovoEnvio.vue') },
      { path: 'pesquisas', name: 'Pesquisas', component: () => import('@/views/Dashboard/Pesquisas.vue') },
      {path: 'clientes', name: 'clientes', component: () => import('@/views/Dashboard/Clientes.vue'), meta: { requiresAuth: true }},
      {path: 'guias', name: 'ListarGuias', component: () => import('@/views/Dashboard/GuiaListar.vue'), meta: { requiresAuth: true }},
      {path: 'guias/criar', name: 'CriarGuia', component: () => import('@/views/Dashboard/GuiaCriar.vue'), meta: { requiresAuth: true }},
      {path: 'turno', name: 'Turno', component: () => import('@/views/Dashboard/Turno.vue'), meta: { requiresAuth: true }},
      { path: 'turno-ativo', name: 'TurnoAtivo', component: () => import('@/views/Dashboard/TurnoAtivo.vue'), meta: { requiresAuth: true }},
      { path: 'turnos-encerrados', name: 'TurnosEncerrados', component: () => import('@/views/Dashboard/TurnosEncerrados.vue'), meta: { requiresAuth: true }},
      { path: 'tickets/abertos', name: 'TicketsAbertos', component: TicketsAbertos },
      {path: 'clientes/:id/editar', name: 'EditarCliente', component: () => import('@/views/Dashboard/EditarCliente.vue'),
      }

    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Proteção de rotas com a store Pinia
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
