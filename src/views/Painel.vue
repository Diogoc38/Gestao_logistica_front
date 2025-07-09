<template>
  <div class="dashboard">
    <div class="dashboard-cards">
      <div class="card">
        <h3>Encomendas para Recolha</h3>
        <p class="card-value">{{ encomendasParaRecolha }}</p>
      </div>
      <div class="card">
        <h3>Guias Pendentes</h3>
        <p class="card-value">{{ guiasPendentes }}</p>
      </div>
    </div>
    <!-- Pode adicionar outros cards aqui -->
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Painel',
  data() {
    return {
      encomendasParaRecolha: 0,
      guiasPendentes: 0
    }
  },
  mounted() {
    this.fetchDashboardData()
  },
  methods: {
    async fetchDashboardData() {
      try {
        // Buscar token do localStorage/sessionStorage
        const token = localStorage.getItem('token')

        // Buscar total de guias pendentes
        const guiasRes = await axios.get('http://localhost:3000/api/guias/pendentes/contar', {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.guiasPendentes = guiasRes.data.total

        // Buscar total de encomendas para recolha pendentes
        const recolhasRes = await axios.get('http://localhost:3000/api/recolhas/pendentes/contar', {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.encomendasParaRecolha = recolhasRes.data.total

      } catch (err) {
        console.error('Erro ao buscar dados do dashboard:', err)
      }
    }
  }
}

</script>


<style scoped>
.dashboard {
  padding: 2rem;
}
.dashboard-cards {
  display: flex;
  gap: 2rem;
}
.card {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  border-radius: 12px;
  padding: 2rem 3rem;
  text-align: center;
  min-width: 220px;
}
.card h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #4A5568;
}
.card-value {
  font-size: 2.4rem;
  font-weight: bold;
  color: #1A202C;
}
</style>
