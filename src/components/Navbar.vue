<template>
  <nav class="navbar">
    <div class="navbar-left">
      <div class="logo" @click="router.push('/')">
        <strong>GestãoLogística</strong>
      </div>

      <div v-if="isLoggedIn" class="nav-links-user">
        <router-link to="/minhas-encomendas">Minhas encomendas</router-link>
        <router-link to="/historico-encomendas">Histórico de encomendas</router-link>
        <router-link to="/tickets">Tickets</router-link>
        <router-link v-if="isAdminOrFuncionario" to="/dashboard">Dashboard</router-link>
      </div>

    </div>

    <div class="nav-links">
      <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
      <router-link v-if="!isLoggedIn" to="/registo">Registo</router-link>

      <div v-if="isLoggedIn" class="profile-container">
        <div class="profile-icon" @click.stop="toggleProfileMenu">
          <img v-if="userProfile?.avatar" :src="userProfile.avatar" alt="Profile" class="profile-img" />
          <div v-else class="profile-img-placeholder">{{ userInitials }}</div>
        </div>

        <div v-if="profileMenuOpen" class="profile-menu">
          <div class="profile-details">
            <p>
              {{
                userProfile
                    ? userProfile.nome_utilizador + ' ' + userProfile.apelido_utilizador
                    : 'Nome do Utilizador'
              }}
            </p>
            <p>{{ userProfile?.email }}</p>
          </div>
          <router-link to="/perfil" class="update-profile">Atualizar perfil</router-link>
          <button @click="logout">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { onMounted, onBeforeUnmount } from 'vue';

const handleClickOutside = (event) => {
  const profile = document.querySelector('.profile-container');
  if (profile && !profile.contains(event.target)) {
    profileMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

const auth = useAuthStore();
const router = useRouter();

const isLoggedIn = computed(() => auth.isAuthenticated);
const userProfile = computed(() => auth.utilizador);

const userInitials = computed(() => {
  if (!auth.utilizador) return '';
  const nome = auth.utilizador.nome_utilizador || '';
  const apelido = auth.utilizador.apelido_utilizador || '';
  return `${nome[0] || ''}${apelido[0] || ''}`.toUpperCase();
});

const isAdminOrFuncionario = computed(() => {
  const role = auth.utilizador?.id_role;
  return role === 1 || role === 2;
});

const profileMenuOpen = ref(false);
const toggleProfileMenu = () => {
  profileMenuOpen.value = !profileMenuOpen.value;
};

const logout = () => {
  auth.logout();
  router.push('/login');
};
</script>

<style src="@/assets/styles/navbar.css"></style>
