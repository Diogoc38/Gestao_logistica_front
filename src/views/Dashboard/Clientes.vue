<template>
  <div class="clientes-container">
    <h2>Lista de Clientes</h2>
    <table class="clientes-tabela">
      <thead>
      <tr>
        <th>Nome</th>
        <th>Email</th>
        <th>Telefone</th>
        <th>Role</th>
        <th v-if="auth.utilizador?.id_role === 1">Editar</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="cliente in clientes" :key="cliente.id_utilizador">
        <td>{{ cliente.nome_utilizador }} {{ cliente.apelido_utilizador }}</td>
        <td>{{ cliente.email_utilizador }}</td>
        <td>{{ cliente.contacto_utilizador }}</td>
        <td>{{ cliente.nome_role }}</td>
        <td v-if="auth.utilizador?.id_role === 1">
          <button @click="abrirPerfil(cliente.id_utilizador)">Editar</button>
        </td>

      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

const clientes = ref([])
const auth = useAuthStore()
const router = useRouter()

onMounted(async () => {
  const res = await axios.get('http://localhost:3000/api/utilizadores', {
    headers: {
      Authorization: `Bearer ${auth.token}`
    }
  })
  clientes.value = res.data
})

function abrirPerfil(id) {
  router.push({ name: 'EditarCliente', params: { id } })
}
</script>
<style src="@/assets/styles/dashboard_css/clientes.css"></style>
