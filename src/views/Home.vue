<style src="@/assets/styles/home.css"></style>

<template>
  <div class="home-wrapper">
    <div v-if="!isLoggedIn" class="tracking-card">
      <p class="prompt">Introduza o seu código de encomenda</p>
      <input class="tracking-input" type="text" placeholder="EX: ENC-2024-00123" />
    </div>

    <div v-else class="dashboard-grid">

      <router-link to="/minhas-encomendas">
        <button class="btn">Minhas encomendas</button>
      </router-link>

      <router-link to="/historico-encomendas">
        <button class="btn">Histórico de encomendas</button>
      </router-link>

      <router-link class="dashboard-card" to="/tickets">Tickets</router-link>
      <router-link
          v-if="isAdminOrFuncionario"
          class="dashboard-card"
          to="/dashboard"
      >Dashboard</router-link>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/auth';
import { computed } from 'vue';

const auth = useAuthStore();
const isLoggedIn = auth.isAuthenticated;
const isAdminOrFuncionario = computed(() => {
  const role = auth.utilizador?.id_role;
  return role === 1 || role === 2; // 1 = admin, 2 = funcionario
});
</script>

