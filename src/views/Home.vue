<style src="@/assets/styles/home.css"></style>
<template>
  <div class="home-wrapper">
    <div class="tracking-card">
      <p class="prompt">Introduza o seu código de encomenda</p>
      <input
          v-model="codigoEncomenda"
          class="tracking-input"
          type="text"
          placeholder="Código de encomenda"
          @keyup.enter="buscarEncomenda"
      />
    </div>

    <div v-if="encomenda" class="tracking-card">
      <h2>Número: {{ encomenda.numero_encomenda }}</h2>
      <p><strong>Cliente:</strong> {{ encomenda.nome_cliente }}</p>
      <p><strong>Morada:</strong> {{ encomenda.morada_destinatario }}</p>
      <p><strong>Mercadoria:</strong> {{ encomenda.designacao_mercadoria }}</p>
      <p><strong>Tipo:</strong> {{ encomenda.tipo_encomenda }}</p>
      <p><strong>Peso:</strong> {{ encomenda.peso }} kg</p>
      <p><strong>Volume:</strong> {{ encomenda.volume }} m³</p>
      <p><strong>Portes:</strong> {{ encomenda.portes_responsavel }}</p>
      <p><strong>Estado atual:</strong>
        <span v-if="encomenda.historico_estados && encomenda.historico_estados.length">
          {{ encomenda.historico_estados[encomenda.historico_estados.length - 1].estado.nome_estado }}
        </span>
        <span v-else>Desconhecido</span>
      </p>

      <div v-if="encomenda.historico_estados && encomenda.historico_estados.length">
        <p class="historico-title">Histórico de Estados</p>
        <div class="historico-content">
          <div
              v-for="h in encomenda.historico_estados"
              :key="h.id_historico"
          >
            {{ h.estado.nome_estado }} - {{ formatDate(h.data_estado, h.hora_estado) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      codigoEncomenda: "",
      encomenda: null
    };
  },
  methods: {
    async buscarEncomenda() {
      if (!this.codigoEncomenda) return;
      try {
        // Chama o endpoint que devolve todos os dados e histórico
        const res = await axios.get('http://localhost:3000/api/encomendas/codigo/' + this.codigoEncomenda);
        this.encomenda = res.data;
      } catch (err) {
        this.encomenda = null;
        alert("Encomenda não encontrada!");
      }
    },
    formatDate(data, hora) {
      if (!data) return "";
      const date = new Date(`${data}T${hora ? hora : "00:00:00"}`);
      return (
          date.toLocaleDateString("pt-PT") +
          " " +
          date.toLocaleTimeString("pt-PT").slice(0, 5)
      );
    }
  }
};
</script>


