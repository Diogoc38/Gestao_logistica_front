<style src="@/assets/styles/navbar.css"></style>

<template>
  <nav class="navbar">
    <div class="logo" @click="router.push('/')">
      <strong>GestãoLogística</strong>
    </div>

    <div class="nav-links">
      <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
      <router-link v-if="!isLoggedIn" to="/registo">Registo</router-link>
      <router-link v-if="isAdminOrFuncionario" to="/painel">Painel</router-link>

      <div v-if="isLoggedIn" class="profile-container">
        <div class="profile-icon" @click="toggleProfileMenu">
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
  const role = auth.utilizador?.role;
  return role === 'admin' || role === 'funcionario';
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
