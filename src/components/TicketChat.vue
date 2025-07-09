<template>
  <div v-if="ticket" class="chat-container">
    <div class="mensagens">
      <div
          v-for="msg in mensagens"
          :key="msg.id_mensagem"
          class="mensagem"
          :class="{ minha: msg.id_utilizador === utilizadorId }"
      >
        <div class="nome">
          <strong>{{ msg.utilizador?.nome_utilizador || 'Desconhecido' }}</strong>
        </div>
        <div class="texto">{{ msg.texto }}</div>
        <div class="hora">{{ formatarData(msg.enviado_em) }}</div>
      </div>
    </div>

    <form @submit.prevent="enviarMensagem" class="formulario">
      <textarea v-model="novaMensagem" placeholder="Escreva a sua mensagem..." required />
      <button type="submit">Enviar</button>
    </form>

    <button
        v-if="podeEncerrar && ticket.status === 'aberto'"
        @click="encerrarTicket"
        class="encerrar"
    >
      Encerrar Ticket
    </button>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/store/auth';

export default {
  props: {
    ticket: Object
  },
  data() {
    return {
      mensagens: [],
      novaMensagem: '',
      utilizadorId: null,
      isFuncionario: false,
      podeEncerrar: false
    };
  },
  methods: {
    async carregarMensagens() {
      if (!this.ticket?.id_ticket) return;

      try {
        const endpoint = this.isFuncionario
            ? `/api/tickets/${this.ticket.id_ticket}/mensagens/admin`
            : `/api/tickets/${this.ticket.id_ticket}/mensagens`;

        const response = await axios.get(`http://localhost:3000${endpoint}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        this.mensagens = response.data;
      } catch (err) {
        console.error('Erro ao carregar mensagens:', err);
      }
    },

    async enviarMensagem() {
      if (!this.ticket?.id_ticket) return;

      try {
        const endpoint = this.isFuncionario
            ? `/api/tickets/${this.ticket.id_ticket}/mensagens/admin`
            : `/api/tickets/${this.ticket.id_ticket}/mensagens`;

        await axios.post(`http://localhost:3000${endpoint}`, {
          texto: this.novaMensagem
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        this.novaMensagem = '';
        this.carregarMensagens();
      } catch (err) {
        console.error('Erro ao enviar mensagem:', err);
      }
    },

    async encerrarTicket() {
      try {
        const endpoint = this.isFuncionario
            ? `/api/tickets/${this.ticket.id_ticket}/encerrar/admin`
            : `/api/tickets/${this.ticket.id_ticket}/encerrar`;

        await axios.put(`http://localhost:3000${endpoint}`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        this.ticket.status = 'fechado';
        alert('Ticket encerrado com sucesso.');
        this.$emit('atualizar');
      } catch (err) {
        console.error('Erro ao encerrar ticket:', err);
      }
    },

    formatarData(data) {
      return new Date(data).toLocaleString('pt-PT');
    }
  },
  mounted() {
    const auth = useAuthStore();
    this.utilizadorId = auth.utilizador?.id_utilizador || null;
    this.isFuncionario = auth.utilizador?.id_role === 1 || auth.utilizador?.id_role === 2;
    this.podeEncerrar =
        this.isFuncionario || this.utilizadorId === this.ticket?.id_utilizador;

    if (this.ticket?.id_ticket) {
      this.carregarMensagens();
    }
  },
  watch: {
    ticket(novo) {
      if (novo?.id_ticket) {
        this.carregarMensagens();
      }
    }
  }
};
</script>

<style scoped>
.chat-container {
  max-width: 700px;
  margin: auto;
}
.mensagens {
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 15px;
}
.mensagem {
  margin-bottom: 10px;
  background: #f4f4f4;
  padding: 8px;
  border-radius: 5px;
}
.mensagem.minha {
  background: #d0e8ff;
}
.nome {
  font-weight: bold;
  margin-bottom: 4px;
}
.hora {
  font-size: 0.8em;
  color: gray;
  text-align: right;
}
textarea {
  width: 100%;
  min-height: 60px;
  margin-bottom: 10px;
}
button {
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
}
button:hover {
  background-color: #0056b3;
}
.encerrar {
  margin-top: 15px;
  padding: 8px 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
}
.encerrar:hover {
  background-color: #b02a37;
}
</style>
