<template>
  <div class="perfil-wrapper">
    <div class="perfil-card">
      <h2 class="title">Atualizar Perfil</h2>
      <form @submit.prevent="guardarAlteracoes">
        <div class="input-box">
          <label>Nome:</label>
          <input v-model="form.nome_utilizador" />
        </div>
        <div class="input-box">
          <label>Apelido:</label>
          <input v-model="form.apelido_utilizador" />
        </div>
        <div class="input-box">
          <label>Email:</label>
          <input v-model="form.email_utilizador" />
        </div>
        <div class="input-box">
          <label>Contacto:</label>
          <input v-model="form.contacto_utilizador" />
        </div>
        <div class="input-box">
          <label>Documento Identificação:</label>
          <input v-model="form.documento_identificacao" />
        </div>
        <div class="input-box">
          <label>Morada (Rua):</label>
          <input v-model="form.morada_rua" />
        </div>
        <div class="input-box">
          <label>Morada (Localidade):</label>
          <input v-model="form.morada_localidade" />
        </div>
        <div class="input-box">
          <label>Código Postal:</label>
          <input v-model="form.morada_cod_postal" />
        </div>
        <div class="input-box">
          <label>Password Atual:</label>
          <input type="password" v-model="form.password_atual" />
        </div>
        <div class="input-box">
          <label>Nova Password:</label>
          <input type="password" v-model="form.nova_password" />
        </div>
        <button class="save-button" type="submit">Guardar alterações</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const auth = useAuthStore();

const form = reactive({
  nome_utilizador: auth.utilizador?.nome_utilizador || '',
  apelido_utilizador: auth.utilizador?.apelido_utilizador || '',
  email_utilizador: auth.utilizador?.email_utilizador || '',
  contacto_utilizador: auth.utilizador?.contacto_utilizador || '',
  documento_identificacao: auth.utilizador?.documento_identificacao || '',
  morada_rua: auth.utilizador?.morada_rua || '',
  morada_localidade: auth.utilizador?.morada_localidade || '',
  morada_cod_postal: auth.utilizador?.morada_cod_postal || '',
  password_atual: '',
  nova_password: ''
});

const guardarAlteracoes = async () => {
  try {
    const payload = {
      nome_utilizador: form.nome_utilizador,
      apelido_utilizador: form.apelido_utilizador,
      email_utilizador: form.email_utilizador,
      contacto_utilizador: form.contacto_utilizador,
      documento_identificacao: form.documento_identificacao,
      morada_rua: form.morada_rua,
      morada_localidade: form.morada_localidade,
      morada_cod_postal: form.morada_cod_postal
    };

    if (form.nova_password.trim() !== '') {
      payload.password = form.nova_password;
      payload.password_atual = form.password_atual;
    }

    const response = await axios.put(
        `http://localhost:3000/api/utilizadores/${auth.utilizador.id_utilizador}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
    );

    auth.login(response.data, auth.token);
    alert('Perfil atualizado com sucesso!');
    form.nova_password = '';
    form.password_atual = '';
  } catch (err) {
    alert(err.response?.data?.erro || 'Erro ao atualizar perfil.');
    console.error(err);
  }
};
</script>
<style src="@/assets/styles/perfil.css"></style>
