<template>
  <div class="turno-ativo-container">
    <h2>Resumo do Turno Ativo</h2>
  </div>

  <div class="dados-turno" v-if="viatura">
    <p><strong>VIATURA:</strong> {{ viatura.matricula }} - {{ viatura.marca }} {{ viatura.modelo }}</p>
    <p><strong>PESO BRUTO:</strong> {{ viatura.peso_bruto }} kg</p>
    <p><strong>CARGA ÚTIL:</strong> {{ viatura.carga_util }} kg</p>
  </div>
  <div class="dados-turno" v-if="viatura">
  <p><strong>TOTAL DE VOLUMES:</strong> {{ totais.volumes }}</p>
    <p><strong>TOTAL DE PESO (kg):</strong> {{ totais.peso }}</p>
    <p><strong>TOTAL DE PREÇO (€):</strong> {{ totais.preco.toFixed(2) }}</p>
  </div>


  <div v-for="guia in guias" :key="guia.id_guia" class="guia-container">
        <div class="guia-header" @click="toggleGuia(guia.id_guia)">
          <h3>Guia Nº {{ guia.numero_guia }}</h3>
          <small>Data da guia: {{ formatarData(guia.data_guia) }}</small>
        </div>

        <div v-if="guia.expandir" class="guia-detalhes">
          <table>
            <thead>
            <tr>
              <th>Destinatário</th>
              <th>NIF</th>
              <th>Local Destino</th>
              <th>Volumes</th>
              <th>Peso (kg)</th>
              <th>Preço (€)</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="g in guia.guia_encomendas" :key="g.id_encomenda">
              <td>{{ g.encomenda?.nome_receptor || '---' }}</td>
              <td>{{ g.encomenda?.niff_receptor || '---' }}</td>
              <td>{{ g.encomenda?.morada_destinatario || '---' }}</td>
              <td>{{ g.encomenda?.volume || '---' }}</td>
              <td>{{ g.encomenda?.peso || '---' }}</td>
              <td>{{ g.encomenda?.pvp_acordado?.toFixed(2) || '---' }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const guias = ref([])
const viatura = ref(null)
const totais = ref({ volumes: 0, peso: 0, preco: 0 })

const token = localStorage.getItem('token')

const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
}

const carregarGuias = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/resumos_turno/turno-ativo/guias', config)

    guias.value = response.data.guias.map(g => ({
      ...g,
      expandir: false
    }))

    viatura.value = response.data.viatura || null

    let totalVolumes = 0
    let totalPeso = 0
    let totalPreco = 0

    response.data.guias.forEach(guia => {
      guia.guia_encomendas.forEach(ge => {
        const enc = ge.encomenda
        totalVolumes += Number(enc.volume || 0)
        totalPeso += Number(enc.peso || 0)
        totalPreco += Number(enc.pvp_acordado || 0)
      })
    })

    totais.value = {
      volumes: totalVolumes,
      peso: totalPeso,
      preco: totalPreco
    }

  } catch (err) {
    console.error('Erro ao carregar guias:', err)
  }
}

function toggleGuia(id) {
  const guia = guias.value.find(g => g.id_guia === id)
  if (guia) guia.expandir = !guia.expandir
}

function formatarData(dataISO) {
  const data = new Date(dataISO)
  return data.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

onMounted(() => {
  carregarGuias()
})
</script>



    <style scoped>
      .guia-container {
        margin-bottom: 20px;
        border: 1px solid #ccc;
        padding: 12px;
        background: #f9f9f9;
      }

      .guia-header {
        cursor: pointer;
        background-color: #e9ecef;
        padding: 10px;
        border-radius: 4px;
      }

      .guia-detalhes {
        margin-top: 10px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 8px;
      }

      th,
      td {
        padding: 8px;
        border: 1px solid #ccc;
      }
      .dados-turno {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-bottom: 20px;
      }

      .dados-turno p {
        margin: 0;
        font-weight: bold;
      }

    </style>
