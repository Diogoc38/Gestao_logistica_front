<template>
  <div class="turnos-container">
    <h2>Turnos Encerrados</h2>

    <input
        v-model="pesquisa"
        type="text"
        placeholder="Pesquisar por número de guia"
        class="filtro-input"
    />

    <table>
      <thead>
      <tr>
        <th>Início</th>
        <th>Fim</th>
        <th>Matrícula</th>
        <th>Guias Associadas</th>
        <th>Ações</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="t in turnosPaginados" :key="t.id_turno">
        <td>{{ formatarDataHora(t.data_inicio) }}</td>
        <td>{{ formatarDataHora(t.data_fim) }}</td>
        <td>{{ t.viatura?.matricula || '---' }}</td>
        <td>{{ t.guias.join(', ') }}</td>
        <td>
          <button @click="verDetalhes(t)">Ver detalhes</button>
        </td>
      </tr>
      </tbody>
    </table>

    <div class="paginacao">
      <button @click="paginaAtual--" :disabled="paginaAtual === 1">Anterior</button>
      <span>Página {{ paginaAtual }}</span>
      <button
          @click="paginaAtual++"
          :disabled="paginaAtual * porPagina >= turnosFiltrados.length"
      >
        Seguinte
      </button>
    </div>

    <div v-if="turnoSelecionado" class="detalhes-box">
      <h3>Detalhes do Turno</h3>
      <p><strong>Início:</strong> {{ formatarDataHora(turnoSelecionado.data_inicio) }}</p>
      <p><strong>Fim:</strong> {{ formatarDataHora(turnoSelecionado.data_fim) }}</p>
      <p><strong>Matrícula:</strong> {{ turnoSelecionado.viatura?.matricula || '---' }}</p>
      <p><strong>Guias:</strong></p>
      <ul>
        <li v-for="g in turnoSelecionado.guias" :key="g">Guia: {{ g }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const turnos = ref([])
const pesquisa = ref('')
const paginaAtual = ref(1)
const porPagina = 10
const turnoSelecionado = ref(null)

const token = localStorage.getItem('token')
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
}

const carregarTurnos = async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/api/resumos_turno/encerrados', config)
    turnos.value = data
  } catch (err) {
    console.error('Erro ao carregar turnos:', err)
  }
}

const formatarDataHora = (dataISO) => {
  const data = new Date(dataISO)
  return data.toLocaleString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const verDetalhes = (turno) => {
  turnoSelecionado.value = turno
}

const turnosFiltrados = computed(() => {
  if (!pesquisa.value) return turnos.value
  return turnos.value.filter(t =>
      t.guias.some(g => g.toLowerCase().includes(pesquisa.value.toLowerCase()))
  )
})

const turnosPaginados = computed(() => {
  const inicio = (paginaAtual.value - 1) * porPagina
  return turnosFiltrados.value.slice(inicio, inicio + porPagina)
})

onMounted(carregarTurnos)
</script>

<style scoped>
.turnos-container {
  margin: 20px;
}
.filtro-input {
  padding: 8px;
  margin-bottom: 12px;
  width: 300px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}
th, td {
  padding: 10px;
  border: 1px solid #ddd;
}
button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
button:disabled {
  background-color: #ccc;
}
.paginacao {
  margin-top: 10px;
}
.detalhes-box {
  margin-top: 20px;
  padding: 16px;
  border: 1px solid #ccc;
  background: #f9f9f9;
}
</style>
