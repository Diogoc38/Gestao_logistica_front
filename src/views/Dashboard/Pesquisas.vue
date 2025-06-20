<template>
  <div class="pesquisa-container">
    <h2>Lista de Encomendas</h2>

    <input
        v-model="filtro"
        type="text"
        placeholder="Pesquisar cliente ou nº encomenda..."
    />
    <button @click="limparFiltro">Cancelar Filtro</button>

    <table class="pesquisa-tabela">
      <thead>
      <tr>
        <th>Encomenda</th>
        <th>Data</th>
        <th>Cliente</th>
        <th>Destino</th>
        <th>Designação</th>
        <th>Estado</th>
        <th>Reembolso</th>
        <th>Pago</th>
        <th>Total</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="encomenda in encomendas"
          :key="encomenda.id_encomenda"
          @click="verDetalhes(encomenda.numero_encomenda)"
          style="cursor: pointer"
      >
        <td>#{{ encomenda.numero_encomenda }}</td>
        <td>{{ formatarData(encomenda.data) }}</td>
        <td>{{ encomenda.cliente }}</td>
        <td>{{ encomenda.destino }}</td>
        <td>{{ encomenda.designacao_mercadoria || '—' }}</td>
        <td>{{ encomenda.estado }}</td>
        <td>{{ encomenda.reembolso ? '✅' : '❌' }}</td>
        <td>{{ encomenda.pago ? '✅' : '❌' }}</td>
        <td>{{ encomenda.total.toFixed(2) }} €</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const encomendas = ref([])
const filtro = ref('')
const router = useRouter()
const auth = useAuthStore()

const carregarEncomendas = async () => {
  try {
    console.log('Enviando filtro para backend:', filtro.value)

    const res = await axios.get('http://localhost:3000/api/encomendas', {
      headers: {
        Authorization: `Bearer ${auth.token}`
      },
      params: {
        pesquisa: filtro.value
      }
    })

    encomendas.value = res.data
  } catch (err) {
    console.error('Erro ao carregar encomendas:', err)
  }
}

// chama ao montar
onMounted(() => {
  carregarEncomendas()
})

// chama sempre que filtro mudar (com pequeno debounce)
let debounceTimer
watch(filtro, () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    carregarEncomendas()
  }, 300)
})

const limparFiltro = () => {
  filtro.value = ''
  carregarEncomendas()
}

const verDetalhes = (numero) => {
  router.push(`/dashboard/encomenda/${numero}`)
}

function formatarData(dataISO) {
  const d = new Date(dataISO)
  return d.toLocaleDateString('pt-PT') + ' ' + d.toLocaleTimeString('pt-PT').slice(0, 5)
}
</script>


<style src="@/assets/styles/dashboard_css/pesquisa.css"></style>
