<template>
  <div>
    <h1>Criar Guia de Transporte</h1>

    <div>
      <div>
        <label>Viatura associada:</label>
        <div v-if="viaturaMatricula">{{ viaturaMatricula }}</div>
        <p v-if="viatura">{{ viatura.matricula }} - {{ viatura.marca }} {{ viatura.modelo }}</p>
      </div>
    </div>

    <h2>Encomendas Disponíveis</h2>
    <table border="1" cellpadding="4" cellspacing="0">
      <thead>
      <tr>
        <th>Selecionar</th>
        <th>Número</th>
        <th>Destinatário</th>
        <th>Morada</th>
        <th>Peso</th>
        <th>Volume</th>
        <th>Valor (€)</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="encomenda in encomendas" :key="encomenda.id_encomenda">
        <td>
          <input
              type="checkbox"
              :value="encomenda.id_encomenda"
              v-model="selecionadas"
          />
        </td>
        <td>{{ encomenda.numero_encomenda }}</td>
        <td>{{ encomenda.nome_receptor }}</td>
        <td>{{ encomenda.morada_destinatario || '—' }}</td>
        <td>{{ encomenda.peso }}</td>
        <td>{{ encomenda.volume }}</td>
        <td>{{ encomenda.pvp_acordado?.toFixed(2) ?? '—' }}</td>
      </tr>
      </tbody>
    </table>

    <button @click="criarGuia" :disabled="!id_viatura || selecionadas.length === 0">
      Criar Guia
    </button>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const encomendas = ref([]);
const selecionadas = ref([]);
const viatura = ref(null); // objeto com info da viatura
const id_viatura = ref('');
const router = useRouter();

const token = localStorage.getItem('token');
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

const carregarViaturaDoTurno = async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/api/resumos_turno/turno-ativo', config);
    if (data.ativo && data.turno?.id_viatura) {
      id_viatura.value = data.turno.id_viatura;

      // buscar dados da viatura pelo ID
      const resposta = await axios.get(`http://localhost:3000/api/viaturas/${id_viatura.value}`, config);
      viatura.value = resposta.data;
    } else {
      alert("Nenhum turno ativo encontrado. Inicie um turno antes de criar a guia.");
      router.push('/dashboard/turno');
    }
  } catch (err) {
    console.error('Erro ao carregar viatura do turno:', err);
  }
};

const carregarEncomendas = async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/api/encomendas/disponiveis', config);
    encomendas.value = data;
  } catch (err) {
    console.error('Erro ao carregar encomendas:', err);
  }
};

const criarGuia = async () => {
  try {
    await axios.post('http://localhost:3000/api/guias/com-encomendas', {
      ids_encomendas: selecionadas.value,
      id_viatura: id_viatura.value
    }, config);
    alert('Guia criada com sucesso!');
    router.push('/dashboard/guias');
  } catch (err) {
    console.error('Erro ao criar guia:', err);
    alert('Erro ao criar guia.');
  }
};

onMounted(() => {
  carregarViaturaDoTurno();
  carregarEncomendas();
});
</script>

