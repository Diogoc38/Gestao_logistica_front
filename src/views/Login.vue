<style src="@/assets/styles/login.css"></style>

<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h2 class="title">Login</h2>

      <div class="input-box">
        <input type="text" v-model="username" placeholder="Utilizador" required />
        <i class="fas fa-user icon"></i>
      </div>

      <div class="input-box">
        <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Password"
            required
        />
        <i class="fas fa-lock icon"></i>
        <i
            :class="showPassword ? 'fas fa-eye-slash toggle' : 'fas fa-eye toggle'"
            @click="togglePassword"
        ></i>
      </div>

      <div class="remember-me">
        <input type="checkbox" id="remember" />
        <label for="remember">Lembra-me</label>
      </div>

      <button class="login-button" @click="login">ENTRAR</button>

      <p class="forgot-password">Esqueci-me da palavra passe</p>

      <p class="register-text">
        Ainda não tens conta?
        <router-link to="/registo">Regista-te</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const username = ref('');
const password = ref('');
const showPassword = ref(false);

const router = useRouter();
const auth = useAuthStore();

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const login = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      username: username.value,
      password: password.value,
    });

    auth.login(response.data, response.data.token);
    router.push('/');
  } catch (error) {
    alert(error.response?.data?.erro || 'Erro ao autenticar.');
  }
};
</script>



