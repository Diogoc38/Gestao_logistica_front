<template>
  <div class="guia-listar">
    <h1>Guias de Transporte</h1>

    <div v-if="erro" class="erro">
      {{ erro }}
    </div>

    <table class="table" v-if="listaGuias.length > 0">
      <thead>
      <tr>
        <th>Nº Guia</th>
        <th>Data</th>
        <th>Viatura</th>
        <th>Encomendas</th>
        <th>Peso Total (kg)</th>
        <th>Volumes</th>
        <th>Ações</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="guia in listaGuias" :key="guia.id_guia">
        <td>{{ guia.numero_guia }}</td>
        <td>{{ formatarData(guia.data_guia) }}</td>
        <td>
          {{ guia.viatura?.matricula }} - {{ guia.viatura?.marca }} {{ guia.viatura?.modelo }}
        </td>
        <td>{{ guia.totalEncomendas }}</td>
        <td>{{ guia.totalPeso || '—' }}</td>
        <td>{{ guia.totalVolume || '—' }}</td>
        <td>
          <button @click="verGuia(guia.id_guia)" class="btn btn-primary">
            Visualizar
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <p v-else>Nenhuma guia encontrada.</p>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/store/auth';

export default {
  name: 'GuiaListar',
  data() {
    return {
      listaGuias: [],
      erro: ''
    };
  },
  mounted() {
    this.carregarGuias();
  },
  methods: {
    async carregarGuias() {
      try {
        const token = useAuthStore().token;
        console.log('🔐 Token JWT:', token);

        const resposta = await axios.get('http://localhost:3000/api/guias', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('✅ Resposta completa:', resposta);
        console.log('📦 GUIAS RECEBIDAS DO BACKEND:', JSON.stringify(resposta.data, null, 2));

        this.listaGuias = resposta.data;
      } catch (erro) {
        console.error('❌ Erro ao carregar guias:', erro);
        if (erro.response?.status === 403) {
          this.erro = 'Acesso negado. Verifica as tuas permissões.';
        } else {
          this.erro = erro.response?.data?.erro || 'Erro ao carregar guias.';
        }
      }
    },
    formatarData(data) {
      return new Date(data).toLocaleDateString('pt-PT');
    },
    verGuia(id) {
      this.$router.push(`/dashboard/guias/${id}`);
    }
  }
};
</script>

<style scoped>
.guia-listar {
  padding: 20px;
}
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}
th {
  background-color: #f5f5f5;
  font-weight: bold;
}
.erro {
  color: red;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
