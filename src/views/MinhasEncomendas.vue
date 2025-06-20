<template>
  <div class="minhas-encomendas">
    <h2>Minhas Encomendas Ativas</h2>

    <div v-if="encomendas.length === 0">
      <p>Nenhuma encomenda ativa encontrada.</p>
    </div>

    <div v-for="(encomenda, index) in encomendas" :key="encomenda.id" class="encomenda-card">
      <div class="cabecalho" @click="toggle(index)">
        <p><strong>Número:</strong> {{ encomenda.numero }}</p>
        <strong>{{ encomenda.nome_receptor }}</strong><br />
        <span>{{ encomenda.morada }}</span><br />
        <em>{{ encomenda.designacao }}</em>
      </div>

      <div v-if="encomenda.expandido" class="detalhes">
        <h4>Histórico de Estados</h4>
        <ul>
          <li v-for="(estado, i) in encomenda.historico" :key="i">
            {{ estado.nome_estado }} - {{ formatarDataHora(estado.data, estado.hora) }}
          </li>
        </ul>

        <h4>Detalhes</h4>
        <div class="detalhe-item"><strong>Tipo:</strong> {{ encomenda.tipo }}</div>
        <div class="detalhe-item"><strong>Peso:</strong> {{ encomenda.peso }} kg</div>
        <div class="detalhe-item"><strong>Volume:</strong> {{ encomenda.volume }} m³</div>
        <div class="detalhe-item" v-if="encomenda.portes === 'Destinatário'">
          <strong>Portes:</strong> Destinatário - {{ formatarValor(encomenda.total) }}
        </div>
        <div class="detalhe-item" v-else>
          <strong>Portes:</strong> Expedidos - nada a pagar
        </div>
      </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/store/auth';


export default {
  name: 'MinhasEncomendas',
  data() {
    return {
      encomendas: []
    };
  },
  methods: {
    async carregarEncomendas() {
      try {
        const auth = useAuthStore();
        const token = auth.token;

        const res = await axios.get('http://localhost:3000/api/encomendas/minhas', {
          headers: { Authorization: `Bearer ${token}` }
        });


        this.encomendas = res.data.map(e => ({
          ...e,
          expandido: false
        }));
      } catch (err) {
        console.error('Erro ao carregar encomendas:', err);
      }
    },
    toggle(index) {
      this.encomendas[index].expandido = !this.encomendas[index].expandido;
    },
    formatarDataHora(data, hora) {
      return `${new Date(data).toLocaleDateString()} ${hora?.substring(0, 5) || ''}`;
    },
    formatarValor(valor) {
      return `€ ${Number(valor).toFixed(2).replace('.', ',')}`;
    }
  },
  mounted() {
    this.carregarEncomendas();
  }
};
</script>


<style scoped>
.minhas-encomendas {
  max-width: 800px;
  margin: 0 auto;
}
.encomenda-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.cabecalho:hover {
  background-color: #f9f9f9;
}
.detalhes {
  margin-top: 10px;
  background: #f5f5f5;
  padding: 10px;
  border-radius: 6px;
}
.detalhe-item {
  display: flex;
  gap: 5px;
  margin-bottom: 4px;
}

</style>
