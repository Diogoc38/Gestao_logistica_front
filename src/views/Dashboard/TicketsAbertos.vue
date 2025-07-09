<template>
  <div class="page">
    <h2>Tickets Abertos</h2>

    <div v-if="erro" class="erro">{{ erro }}</div>

    <ul v-if="tickets.length > 0">
      <li v-for="ticket in tickets" :key="ticket.id_ticket">
        <button @click="abrir(ticket)">
          {{ ticket.assunto }} - {{ formatarData(ticket.criado_em) }}
        </button>
      </li>
    </ul>

    <p v-else>Nenhum ticket aberto.</p>

    <TicketChat
        v-if="ticketSelecionado"
        :ticket="ticketSelecionado"
        @fechar="ticketSelecionado = null"
        @atualizar="carregarTickets"
    />
  </div>
</template>

<script>
import TicketChat from '@/components/TicketChat.vue';
import axios from 'axios';

export default {
  components: { TicketChat },
  data() {
    return {
      tickets: [],
      ticketSelecionado: null,
      erro: ''
    };
  },
  methods: {
    async carregarTickets() {
      try {
        const response = await axios.get('http://localhost:3000/api/tickets', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        this.tickets = response.data.filter(t => t.status === 'aberto');
      } catch (err) {
        console.error('Erro ao carregar tickets:', err);
        this.erro = 'Erro ao carregar tickets.';
        this.tickets = [];
      }
    },
    abrir(ticket) {
      this.ticketSelecionado = ticket;
    },
    formatarData(data) {
      return new Date(data).toLocaleDateString('pt-PT');
    }
  },
  mounted() {
    this.carregarTickets();
  }
};
</script>

<style scoped>
.page {
  padding: 20px;
}
.erro {
  color: red;
  margin-bottom: 10px;
}
button {
  margin: 8px 0;
  padding: 6px 12px;
  background: #2b6cb0;
  color: white;
  border: none;
  border-radius: 4px;
}
button:hover {
  background: #2c5282;
}
</style>
