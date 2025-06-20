<template>
  <div class="historico-encomendas">
    <h2>Histórico de Encomendas</h2>

    <div v-if="encomendas.length === 0">
      <p>Nenhuma encomenda entregue encontrada.</p>
    </div>

    <div v-for="(e, index) in encomendas" :key="e.id" class="encomenda-card">
      <div class="cabecalho">
        <p><strong>Número:</strong> {{ e.numero }}</p>
        <strong>{{ e.nome_receptor }}</strong><br />
        <span>{{ e.morada }}</span><br />
        <em>{{ e.designacao }}</em>
      </div>

      <div class="detalhes">
        <p><strong>Tipo:</strong> {{ e.tipo }}</p>
        <p><strong>Peso:</strong> {{ e.peso }} kg</p>
        <p><strong>Volume:</strong> {{ e.volume }} m³</p>
        <p v-if="e.portes === 'Destinatário'"><strong>Portes:</strong> Destinatário - {{ formatarValor(e.total) }}</p>
        <p v-else><strong>Portes:</strong> Expedidos - nada a pagar</p>

        <h4>Histórico de Estados</h4>
        <ul>
          <li v-for="(estado, i) in e.historico" :key="i">
            {{ estado.nome_estado }} - {{ formatarDataHora(estado.data, estado.hora) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/store/auth';

export default {
  name: 'HistoricoEncomendas',
  data() {
    return {
      encomendas: []
    };
  },
  methods: {
    async carregarHistorico() {
      try {
        const auth = useAuthStore();
        const token = auth.token;

        const res = await axios.get('http://localhost:3000/api/encomendas/historico', {
          headers: { Authorization: `Bearer ${token}` }
        });

        this.encomendas = res.data;
      } catch (err) {
        console.error('Erro ao carregar histórico de encomendas:', err);
      }
    },

    formatarDataHora(data, hora) {
      return `${new Date(data).toLocaleDateString()} ${hora?.substring(0, 5) || ''}`;
    },
    formatarValor(valor) {
      return `€ ${Number(valor).toFixed(2).replace('.', ',')}`;
    }
  },
  mounted() {
    this.carregarHistorico();
  }
};
</script>

<style scoped>
.historico-encomendas {
  padding: 1rem;
  max-width: 800px;
  margin: auto;
}
.encomenda-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
}
.detalhes {
  margin-top: 10px;
}
</style>
