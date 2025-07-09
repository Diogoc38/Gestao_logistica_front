<template>
  <div class="page">
    <h2>Suporte ao Cliente</h2>

    <div v-if="ticketAberto">
      <TicketChat :ticket="ticketAberto" />
    </div>

    <div v-else>
      <p>Não tem nenhum pedido de suporte ativo.</p>
      <form @submit.prevent="criarTicket">
        <label>Assunto:</label>
        <input v-model="assunto" required />

        <label>Mensagem:</label>
        <textarea v-model="mensagemInicial" required></textarea>

        <button type="submit">Criar Ticket</button>
      </form>
    </div>
  </div>
</template>

<script>
import TicketChat from '@/components/TicketChat.vue';
import axios from 'axios';

export default {
  components: { TicketChat },
  data() {
    return {
      ticketAberto: null,
      assunto: '',
      mensagemInicial: ''
    };
  },
  methods: {
    async verificarTicket() {
      try {
        const response = await axios.get('http://localhost:3000/api/tickets/meu', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        this.ticketAberto = response.data || null;
      } catch (err) {
        console.error('Erro ao verificar tickets:', err);
      }
    },

    async criarTicket() {
      try {
        const response = await axios.post('http://localhost:3000/api/tickets', {
          assunto: this.assunto,
          mensagemInicial: this.mensagemInicial
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        this.ticketAberto = response.data;
        this.assunto = '';
        this.mensagemInicial = '';
      } catch (err) {
        console.error('Erro ao criar ticket:', err);
      }
    }
  },
  mounted() {
    this.verificarTicket();
  }
};
</script>

<style scoped>
.page {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}
form {
  display: flex;
  flex-direction: column;
}
form > * {
  margin-bottom: 10px;
}
</style>
