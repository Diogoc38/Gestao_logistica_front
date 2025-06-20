<!-- Importa o CSS externo -->
<style src="@/assets/styles/registo.css"></style>

<template>
  <div class="register-wrapper">
    <div class="register-card">
      <h2 class="title">Registo</h2>

      <div class="form-row">
        <input v-model="form.username" placeholder="Utilizador" />
        <input v-model="form.password" placeholder="Password" type="password" />
      </div>

      <div class="form-row">
        <input v-model="form.nome_utilizador" placeholder="Nome" />
        <input v-model="form.apelido_utilizador" placeholder="Apelido" />
      </div>

      <div class="form-row">
        <input v-model="form.morada_localidade" placeholder="Localidade" />
        <input v-model="form.morada_cod_postal" placeholder="Cod. Postal" />
      </div>

      <input v-model="form.morada_rua" placeholder="Morada" />
      <input v-model="form.documento_identificacao" placeholder="Documento de Identificação" />
      <input v-model="form.contacto_utilizador" placeholder="Contacto" />
      <input v-model="form.email_utilizador" placeholder="Email" />

      <button @click="submit">CRIAR CONTA</button>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        nome_utilizador: '',
        apelido_utilizador: '',
        morada_localidade: '',
        morada_cod_postal: '',
        morada_rua: '',
        documento_identificacao: '',
        contacto_utilizador: '',
        email_utilizador: '',
        id_role: 3
      }
    };
  },
  methods: {
    async submit() {
      try {
        // Envia password diretamente
        await api.post('/utilizadores', this.form);
        alert('Conta criada com sucesso!');
        this.$router.push('/');
      } catch (err) {
        console.error('Erro ao registar:', err);
        alert('Erro ao criar conta.');
      }
    }
  }
};
</script>

