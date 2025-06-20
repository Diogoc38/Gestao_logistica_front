<template>
  <div class="editar-cliente-wrapper">

    <!-- Container: Gestão de Funcionário -->
    <div v-if="auth.utilizador?.id_role === 1" class="gestao-vinculo-container">
      <h3>Gestão de Funcionários</h3>

      <!-- Botão de contratação -->
      <div v-if="cliente.id_role === 3">
        <div class="botoesG">
          <button type="button" @click="contratarFuncionario" class="botao-contratar">
            Contratar como Funcionário
          </button>
        </div>

      </div>

      <!-- Promoção e despedimento -->
      <div v-else>
        <label>Função:</label>
        <select v-model="cliente.id_role">
          <option v-for="role in roles" :key="role.id_role" :value="role.id_role">
            {{ role.nome_role }}
          </option>
        </select>

        <label>Empresa:</label>
        <input type="text" :value="empresaAssociada?.nome_empresa || 'Sem empresa'" disabled />

        <div class="botoes">
          <button type="button" @click="gravarPromocao" class="botao-promover">Guardar Promoção</button>
          <button type="button" @click="despedirFuncionario" class="botao-despedir">Despedir Funcionário</button>
        </div>
      </div>
    </div>

    <!-- Container: Dados do cliente -->

    <div class="editar-cliente-container">
      <h2>Editar Cliente</h2>
      <form class="editar-cliente-form" @submit.prevent="guardar">
        <div>
          <label>Nome:</label>
          <input v-model="cliente.nome_utilizador" />
        </div>
        <div>
          <label>Apelido:</label>
          <input v-model="cliente.apelido_utilizador" />
        </div>

        <div>
          <label>Contacto:</label>
          <input v-model="cliente.contacto_utilizador" />
        </div>
        <div>
          <label>Documento de Identificação:</label>
          <input v-model="cliente.documento_identificacao" />
        </div>

        <div class="full-width">
          <label>Email:</label>
          <input v-model="cliente.email_utilizador" />
        </div>

        <div class="full-width">
          <label>Rua:</label>
          <input v-model="cliente.morada_rua" />
        </div>

        <div>
          <label>Localidade:</label>
          <input v-model="cliente.morada_localidade" />
        </div>
        <div>
          <label>Código Postal:</label>
          <input v-model="cliente.morada_cod_postal" />
        </div>
        <div class="full-width">
        <div  class="botoesG">
        <button type="submit" class="botao-guardar">Guardar Alterações</button>
        </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const route = useRoute()
const auth = useAuthStore()
const cliente = ref({})
const empresaAssociada = ref(null)
const roles = ref([])

const carregarCliente = async () => {
  const id = route.params.id
  const res = await axios.get(`http://localhost:3000/api/utilizadores/${id}`, {
    headers: {
      Authorization: `Bearer ${auth.token}`
    }
  })
  cliente.value = JSON.parse(JSON.stringify(res.data))  // Deep clone
}

const carregarEmpresaAssociada = async () => {
  if (!cliente.value.id_empresa) return
  try {
    const res = await axios.get(`http://localhost:3000/api/empresas/${cliente.value.id_empresa}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    empresaAssociada.value = res.data
  } catch (err) {
    console.error('Erro ao carregar empresa:', err)
  }
}

const carregarRoles = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/roles', {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    roles.value = res.data
  } catch (err) {
    console.error('Erro ao carregar roles:', err)
  }
}

const guardar = async () => {
  const id = route.params.id
  await axios.put(`http://localhost:3000/api/utilizadores/${id}`, cliente.value, {
    headers: {
      Authorization: `Bearer ${auth.token}`
    }
  })
  alert('Alterações guardadas com sucesso.')
}

const contratarFuncionario = async () => {
  const id = route.params.id
  await axios.put(`http://localhost:3000/api/utilizadores/${id}`, {
    nome_utilizador: cliente.value.nome_utilizador,
    apelido_utilizador: cliente.value.apelido_utilizador,
    contacto_utilizador: cliente.value.contacto_utilizador,
    documento_identificacao: cliente.value.documento_identificacao,
    email_utilizador: cliente.value.email_utilizador,
    morada_rua: cliente.value.morada_rua,
    morada_localidade: cliente.value.morada_localidade,
    morada_cod_postal: cliente.value.morada_cod_postal,
    id_role: 2,
    id_empresa: auth.utilizador.id_empresa
  }, {
    headers: {
      Authorization: `Bearer ${auth.token}`
    }
  })
  cliente.value.id_role = 2
  cliente.value.id_empresa = auth.utilizador.id_empresa
  await carregarEmpresaAssociada()
  alert('Utilizador contratado como funcionário.')
}

const gravarPromocao = async () => {
  const id = route.params.id
  await axios.put(`http://localhost:3000/api/utilizadores/${id}`, cliente.value, {
    headers: {
      Authorization: `Bearer ${auth.token}`
    }
  })
  alert('Promoção atualizada com sucesso.')
}

const despedirFuncionario = async () => {
  const id = route.params.id
  await axios.put(`http://localhost:3000/api/utilizadores/${id}`, {
    ...cliente.value,
    id_role: 3,
    id_empresa: null
  }, {
    headers: {
      Authorization: `Bearer ${auth.token}`
    }
  })
  cliente.value.id_role = 3
  cliente.value.id_empresa = null
  empresaAssociada.value = null
  alert('Funcionário despedido.')
}

onMounted(async () => {
  if (auth.utilizador?.id_role !== 1) return
  await carregarCliente()
  await carregarEmpresaAssociada()
  await carregarRoles()
})
</script>

<style src="@/assets/styles/dashboard_css/editar_clientes.css"></style>

