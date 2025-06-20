
<template>
  <div class="turno-container">
    <h2>Gestão de Turno</h2>

    <!-- Se não houver turno ativo -->
    <div v-if="!turno || !turno.ativo">
      <label for="viatura">Selecionar Viatura:</label>
      <select v-model="viaturaSelecionada">
        <option disabled value="">Escolhe uma viatura</option>
        <option v-for="v in viaturasDisponiveis" :key="v.id_viatura" :value="v.id_viatura">
          {{ v.matricula }}
        </option>
      </select>
      <button @click="iniciarTurno">Iniciar Turno</button>
    </div>

    <!-- Se houver turno ativo -->
    <div v-else>
      <p>Turno iniciado às: {{ formatarHora(turno.turno?.data_inicio) }}</p>
      <button @click="fecharTurno">Encerrar Turno</button>
    </div>

    <p v-if="erro" class="erro">{{ erro }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/store/auth';

export default {
  data() {
    return {
      turno: null,
      viaturaSelecionada: '',
      viaturasDisponiveis: [],
      erro: ''
    };
  },
  mounted() {
    this.verificarTurnoAtivo();
    this.carregarViaturasDisponiveis();
  },
  methods: {
    async verificarTurnoAtivo() {
      try {
        const response = await axios.get('http://localhost:3000/api/resumos_turno/turno-ativo', {
          headers: { Authorization: `Bearer ${useAuthStore().token}` }
        });
        this.turno = response.data;
      } catch (err) {
        this.erro = 'Erro ao verificar turno ativo';
      }
    },
    async carregarViaturasDisponiveis() {
      try {
        const response = await axios.get('http://localhost:3000/api/viaturas', {
          headers: { Authorization: `Bearer ${useAuthStore().token}` }
        });
        this.viaturasDisponiveis = response.data.filter(v => v.disponivel);
      } catch (err) {
        this.erro = 'Erro ao carregar viaturas disponíveis';
      }
    },
    async iniciarTurno() {
      try {
        if (!this.viaturaSelecionada) {
          this.erro = 'Seleciona uma viatura para iniciar o turno.';
          return;
        }

        const response = await axios.post(
            'http://localhost:3000/api/resumos_turno/iniciar',
            { id_viatura: this.viaturaSelecionada },
            { headers: { Authorization: `Bearer ${useAuthStore().token}` } }
        );

        console.log("✅ Turno criado com resposta:", response.data);

        const turnoAtual = response.data.turno;
        if (!turnoAtual || !turnoAtual.id_turno) {
          throw new Error("Turno não retornado corretamente.");
        }

        this.turno = { ativo: true, turno: turnoAtual };
        this.erro = '';

        if (response.data.guias_pendentes && response.data.guias_pendentes.length > 0) {
          const confirmar = window.confirm("Existem guias com encomendas ainda não entregues. Deseja associá-las a este turno?");
          if (confirmar) {
            const idsGuias = response.data.guias_pendentes.map(g => g.id_guia);
            console.log("🔧 Enviando POST associar-guias:", idsGuias);

            await axios.post(
                'http://localhost:3000/api/resumos_turno/associar-guias',
                {
                  id_turno: turnoAtual.id_turno,
                  ids_guias: idsGuias
                },
                {
                  headers: { Authorization: `Bearer ${useAuthStore().token}` }
                }
            );

            alert("Guias anteriores associadas ao turno com sucesso.");
          }
        }

      } catch (err) {
        console.error("❌ Erro ao iniciar turno:", err);
        this.erro = err.response?.data?.error || 'Erro ao iniciar turno';
      }
    },
    async fecharTurno() {
      const confirmacao = window.confirm("Tens a certeza que queres encerrar o turno?");
      if (!confirmacao) return;

      try {
        await axios.post(
            'http://localhost:3000/api/resumos_turno/fechar',
            {},
            { headers: { Authorization: `Bearer ${useAuthStore().token}` } }
        );
        this.turno = { ativo: false, turno: null };
        this.erro = '';
        this.carregarViaturasDisponiveis();
        alert("Turno encerrado com sucesso.");
      } catch (err) {
        this.erro = err.response?.data?.error || 'Erro ao encerrar turno';
      }
    },

    formatarHora(dataISO) {
      if (!dataISO) return '';
      const data = new Date(dataISO);
      return data.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    }
  }
};
</script>

<style scoped>
.turno-container {
  padding: 20px;
}
.erro {
  color: red;
  margin-top: 10px;
}
</style>
