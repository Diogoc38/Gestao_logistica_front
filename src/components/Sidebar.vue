<style src="@/assets/styles/sidebar.css"></style>

<template>
  <aside :class="['sidebar', { collapsed }]">
    <button class="toggle-btn" @click="collapsed = !collapsed">
      <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20"
          viewBox="0 96 960 960"
          width="20"
          fill="white"
      >
        <path
            :d="collapsed ? 'M560 816 360 616l200-200v400Z' : 'M400 816V416l200 200-200 200Z'"
        />
      </svg>
    </button>

    <div class="sidebar-header">
      <div class="avatar"></div>
      <div v-if="!collapsed" class="user-info">
        <small>{{ userRole?.toUpperCase() }}</small>
        <strong>{{ userName }}</strong>
      </div>
    </div>

    <hr class="separator" />

    <ul class="menu">
      <router-link to="/dashboard" custom v-slot="{ navigate, isActive }">
        <li :class="{ 'active': isActive }" @click="navigate">
          <i class="fas fa-chart-bar"></i>
          <span v-if="!collapsed">Dashboard</span>
        </li>
      </router-link>

      <li @click="toggleSection('turnos')">
        <i class="fas fa-clock"></i>
        <span v-if="!collapsed">Turno</span>
        <i v-if="!collapsed" class="fas fa-chevron-down submenu-arrow"></i>
      </li>
      <ul v-if="!collapsed && expandedSection === 'turnos'" class="submenu">
        <router-link to="/dashboard/turno" custom v-slot="{ navigate, isActive }">
          <li :class="{ 'active': isActive }" @click="navigate">Gestão de Turno</li>
        </router-link>
        <router-link to="/dashboard/turno-ativo" custom v-slot="{ navigate, isActive }">
          <li :class="{ 'active': isActive }" @click="navigate">Turno Ativo</li>
        </router-link>
        <router-link to="/dashboard/turnos-encerrados" custom v-slot="{ navigate, isActive }">
          <li :class="{ 'active': isActive }" @click="navigate">Turnos Encerrados</li>
        </router-link>
      </ul>



      <li @click="toggleSection('envios')">
        <i class="fas fa-box"></i>
        <span v-if="!collapsed">Envios</span>
        <i v-if="!collapsed" class="fas fa-chevron-down submenu-arrow"></i>
      </li>
      <ul v-if="!collapsed && expandedSection === 'envios'" class="submenu">
        <router-link to="/dashboard/novo-envio" custom v-slot="{ navigate, isActive }">
          <li :class="{ 'active': isActive }" @click="navigate">Novo Envio</li>
        </router-link>
        <router-link to="/dashboard/pesquisas" custom v-slot="{ navigate, isActive }">
          <li :class="{ 'active': isActive }" @click="navigate">Pesquisas</li>
        </router-link>
      </ul>

      <li @click="toggleSection('guias')">
        <i class="fas fa-file-alt"></i>
        <span v-if="!collapsed">Guias de Transporte</span>
        <i v-if="!collapsed" class="fas fa-chevron-down submenu-arrow"></i>
      </li>
      <ul v-if="!collapsed && expandedSection === 'guias'" class="submenu">
        <router-link to="/dashboard/guias/criar" custom v-slot="{ navigate, isActive }">
          <li :class="{ 'active': isActive }" @click="navigate">Criar Guia</li>
        </router-link>
        <router-link to="/dashboard/guias" custom v-slot="{ navigate, isActive }">
          <li :class="{ 'active': isActive }" @click="navigate">Listar Guias</li>
        </router-link>
      </ul>

      <li><i class="fas fa-euro-sign"></i><span v-if="!collapsed">Reembolsos</span></li>
      <li><i class="fas fa-file-invoice-dollar"></i><span v-if="!collapsed">Faturação</span></li>
      <router-link to="/dashboard/clientes" custom v-slot="{ navigate, isActive }">
        <li :class="{ 'active': isActive }" @click="navigate">
          <i class="fas fa-users"></i>
          <span v-if="!collapsed">Clientes</span>
        </li>
      </router-link>

      <li><i class="fas fa-truck"></i><span v-if="!collapsed">Frota</span></li>


      <li><i class="fas fa-envelope"></i><span v-if="!collapsed">Mensagens</span></li>
    </ul>

    <ul class="menu bottom">
      <li><i class="fas fa-cog"></i><span v-if="!collapsed">Settings</span></li>
      <li><i class="fas fa-question-circle"></i><span v-if="!collapsed">Help</span></li>
      <li class="logout"><i class="fas fa-sign-out-alt"></i><span v-if="!collapsed">Logout Account</span></li>
    </ul>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/store/auth';

const collapsed = ref(false);
const expandedSection = ref(null);
const auth = useAuthStore();

function toggleSection(section) {
  expandedSection.value = expandedSection.value === section ? null : section;
}

const userName = computed(() => {
  const u = auth.utilizador;
  return u ? `${u.nome_utilizador} ${u.apelido_utilizador}` : '';
});

const userRole = computed(() => {
  return auth.utilizador?.role_nome || 'Utilizador';
});
</script>

