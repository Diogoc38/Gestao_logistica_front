<template>
  <div class="novo-envio">
    <form @submit.prevent="submeterEnvio">
      <div class="linha justificada">
        <span><strong>Este envio será efetuado para o Turno:</strong> <span class="texto-vermelho">1</span></span>
      </div>

      <select v-if="armazens.length > 0" v-model="envio.id_armazem" required>
        <option disabled value="">Selecione um armazém</option>
        <option
            v-for="armazem in armazens"
            :key="armazem.id_armazem"
            :value="armazem.id_armazem"
        >
          {{ armazem.nome_armazem }}
        </option>
      </select>


      <div class="linha">
        <label>Serviço:
          <select v-model="envio.servico_nome" class="campo-select" required>
            <option value="" hidden selected>Serviço</option>
            <option v-for="servico in servicos" :key="servico.id_servico" :value="servico.nome">
              {{ servico.nome }}
            </option>
          </select>
        </label>
        <label>Categoria:
          <select v-model="envio.categoria_nome" class="campo-select" required>
            <option value="" hidden selected>Categoria</option>
            <option v-for="categoria in categorias" :key="categoria.id_categoria" :value="categoria.nome">
              {{ categoria.nome }}
            </option>
          </select>
        </label>

        <!-- Recolha -->
        <div class="coluna">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h4>Recolha</h4>
            <input
                type="checkbox"
                v-model="envio.recolha"
                @change="atualizarTipoEncomenda"
                style="transform: scale(1.2); margin-right: 4px;"
            />
          </div>
          <small class="texto-ajuda">Assinalar se for Recolha</small>
          <div v-if="envio.recolha" class="recolha-lista">
            <div v-if="mensagemRecolha">{{ mensagemRecolha }}</div>
            <ul v-else>
              <li
                  v-for="r in recolhasPendentes"
                  :key="r.id_recolha"
                  @click="aplicarRecolha(r)"
                  class="item-recolha"
              >
                {{ r.nome_cliente }} — {{ r.morada_cliente }} ({{ r.designacao_mercadoria }})
              </li>
            </ul>
          </div>

        </div>

        <!-- Esporádico -->
        <div class="coluna">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h4>Esporádico</h4>
            <input
                type="checkbox"
                v-model="envio.esporadico"
                @change="atualizarTipoEncomenda"
                style="transform: scale(1.2); margin-right: 4px;"
            />
          </div>
          <small class="texto-ajuda">Assinalar se for Esporádico</small>
        </div>



        <label>Portes:
          <select v-model="envio.portes_responsavel" class="campo-select" required>
            <option value="Expedidor">Expedidor</option>
            <option value="Destinatário">Destinatário</option>
          </select>
        </label>
      </div>

      <div class="linha linha-alinhada">
        <div class="campo-flex">
          <label for="nomeReceptor">Nome do Recetor:</label>
          <input id="nomeReceptor" v-model="envio.nome_receptor" type="text" placeholder="Nome completo" />
        </div>

        <div class="botoes-nome">
          <label style="visibility: hidden;">Botões</label>
          <div class="input-com-botoes">
            <button type="button" @click="mostrarLista ? mostrarLista = false : (carregarUtilizadores(), mostrarLista = true)" title="Procurar" class="btn-icone">
              <i class="fas fa-search"></i>
            </button>
            <button v-if="envio.nome_receptor" type="button" @click="limparUtilizador" title="Limpar" class="btn-icone">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div class="campo-flex">
          <label for="nifReceptor">NIF do Recetor:</label>
          <input id="nifReceptor" v-model="envio.niff_receptor" type="number" inputmode="numeric" pattern="[0-9]*" required />
        </div>
      </div>

      <div v-if="mostrarLista" ref="listaRef" class="lista-utilizadores">
        <input type="text" v-model="termoPesquisa" placeholder="Pesquisar nome..." class="input-pesquisa" />
        <ul>
          <li v-for="u in utilizadores.filter(u => (u.nome_utilizador + ' ' + u.apelido_utilizador).toLowerCase().includes(termoPesquisa.toLowerCase()))" :key="u.id_utilizador" @click="selecionarUtilizador(u)">
            <strong>{{ u.nome_utilizador }} {{ u.apelido_utilizador }}</strong><br />
            {{ u.morada_rua }}, {{ u.morada_localidade }}<br />
            Nº Identificação: {{ u.documento_identificacao }}
          </li>
        </ul>
      </div>

      <div class="linha">
        <label>Morada do Recetor:
          <input v-model="envio.morada_destinatario" type="text" placeholder="Morada do destinatário" required />
        </label>
      </div>

      <div class="linha bloco-multi">
        <div class="coluna">
          <h4>Mercadoria</h4>
          <div style="display: flex; gap: 10px; align-items: flex-end;">
            <label style="flex: 1;">Volumes:
              <input v-model.number="envio.volume" type="number" min="1" class="input-pequeno" />
            </label>
            <label> Dimensões:
              <input v-model="envio.dimensoes" placeholder="Ex: 40x30x20cm" />
            </label>
            <label style="flex: 1;">Peso (kg):
              <input v-model.number="envio.peso" type="number" step="0.01" class="input-pequeno" />
            </label>
          </div>
          <label class="label-bloco">Tipo de Embalagem:
            <input v-model="envio.tipo_embalagem" type="text" />
          </label>
        </div>

        <div class="coluna">
          <h4>Carga</h4>
          <div style="display: flex; gap: 10px;">
            <label class="label-bloco">Data:
              <input v-model="envio.data" type="date" />
            </label>
            <label class="label-bloco">Hora:
              <input v-model="envio.hora" type="time" />
            </label>
          </div>
          <label class="label-bloco">Designação da Mercadoria:
            <input v-model="envio.designacao_mercadoria" type="text" />
          </label>
        </div>

        <div class="coluna">
          <h4>Custo Envio</h4>
          <div style="display: flex; gap: 10px;">
            <label class="label-bloco">S/iva:
              <input v-model.number="envio.s_iva" type="number" step="0.01" class="input-pequeno" />
            </label>
            <label class="label-bloco">Iva:
              <input v-model.number="envio.iva" type="number" step="0.01" class="input-pequeno" />
            </label>
          </div>
          <div style="display: flex; gap: 10px; margin-top: 8px;">
            <label class="label-bloco">Pvp:
              <input v-model.number="envio.pvp" type="number" step="0.01" class="input-pequeno" />
            </label>
            <label class="label-bloco">Pvp Acordado:
              <input v-model.number="envio.pvp_acordado" type="number" step="0.01" class="input-pequeno" />
            </label>
          </div>
        </div>
      </div>

      <!-- Observações -->
      <div class="linha">
        <label><strong>Observações:</strong></label>
        <textarea
            v-model="envio.observacoes"
            placeholder="Observações para o envio"
            rows="2"
            class="textarea-observacoes"
        ></textarea>
      </div>

      <!-- Bloco: Reembolso + E-mail -->
      <div class="linha bloco-reembolso-email">
        <!-- Reembolso -->
        <div class="coluna">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h4>Reembolso</h4>
            <input
                type="checkbox"
                v-model="envio.reembolso"
                @change="atualizarTipoEncomenda"
                style="transform: scale(1.2); margin-right: 4px;"
            />
          </div>
          <small class="texto-ajuda">Assinalar se for Reembolso</small>

          <div v-if="envio.reembolso" class="grupo-input" style="margin-top: 10px;">
            <label>Valor do Reembolso: *</label>
            <input
                v-model.number="envio.valor_reembolso"
                type="number"
                step="0.01"
                placeholder="Introduza o valor"
            />
          </div>
        </div>



        <!-- E-mail -->
        <div class="coluna">
          <h4>E-mail</h4>
          <label class="linha-checkbox">
            <input type="checkbox" v-model="envio.enviar_info_email" />
            <span>Enviar Informação sobre Envio/Recolha por E-Mail</span>
          </label>

          <div v-if="envio.enviar_info_email" class="grupo-input">
            <label>E-mail Destinatário:</label>
            <input v-model="envio.email_recetor" type="email" class="input-email-completo" />
            <small class="texto-ajuda">Insira o endereço de email do DESTINATÁRIO para enviar-mos informações sobre o envio</small>
          </div>
        </div>
      </div>

      <!-- Botões finais -->
      <div class="linha linha-botoes-final">
        <button type="button" class="btn-acao btn-cancelar" @click="cancelar">
          CANCELAR »
        </button>

        <button type="submit" class="btn-acao azul" @click.prevent="confirmarEnvio('sem-impressao')">
          <strong>CONFIRMAR »</strong><br /><small>SEM IMPRESSÃO</small>
        </button>

        <button type="submit" class="btn-acao laranja" @click.prevent="confirmarEnvio('etiqueta')">
          <strong>CONFIRMAR »</strong><br /><small>IMPRIMIR ETIQUETA</small>
        </button>

      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../store/auth'

const authStore = useAuthStore()
const utilizadorAtual = authStore.utilizador || {}

const envio = ref({
  id_utilizador: utilizadorAtual.id_utilizador || null,
  servico_nome: '',
  categoria_nome: '',
  recolha: false,
  esporadico: false,
  reembolso: false,
  portes_responsavel: '',
  nome_receptor: '',
  niff_receptor: '',
  tipo_embalagem: '',
  peso: '',
  dimensoes: '',
  descricao: '',
  assinatura: '',
  id_custo_envio: 1,
  s_iva: null,
  iva: null,
  pvp: null,
  pvp_acordado: null,
  morada_destinatario: '',
  data: '',
  hora: '',
  designacao_mercadoria: '',
  volume: null,
  observacoes: '',
  valor_reembolso: null,
  enviar_info_email: false,
  email_recetor: '',
  id_recolha:null,
  id_armazem: null,
  id_tipo_encomenda: 1
})

const servicos = ref([])
const categorias = ref([])
const utilizadores = ref([])
const armazens = ref([])
const mostrarLista = ref(false)
const termoPesquisa = ref('')
const listaRef = ref(null)
const recolhasPendentes = ref([]);
const recolhaSelecionada = ref(null);
const mensagemRecolha = ref('');

onMounted(async () => {
  const token = authStore.token
  const role = authStore.utilizador?.id_role
  if (!token || (role !== 1 && role !== 2)) return

  try {
    const [resServicos, resCategorias, resArmazens] = await Promise.all([
      axios.get('http://localhost:3000/api/servicos', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://localhost:3000/api/categorias', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://localhost:3000/api/armazens', { headers: { Authorization: `Bearer ${token}` } })
    ])
    servicos.value = resServicos.data
    categorias.value = resCategorias.data
    armazens.value = resArmazens.data
  } catch (err) {
    console.error('Erro ao carregar dados:', err)
  }
})

const carregarUtilizadores = async () => {
  const token = authStore.token
  const res = await axios.get('http://localhost:3000/api/utilizadores', {
    headers: { Authorization: `Bearer ${token}` }
  })
  utilizadores.value = res.data
}

const carregarRecolhasPendentes = async () => {
  try {
    const token = authStore.token;
    const res = await axios.get('http://localhost:3000/api/recolhas/pendentes', {
      headers: { Authorization: `Bearer ${token}` }
    });
    recolhasPendentes.value = res.data;
    if (!res.data.length) {
      mensagemRecolha.value = 'Não existem recolhas pendentes no momento.';
    } else {
      mensagemRecolha.value = '';
    }
  } catch (err) {
    console.error('Erro ao carregar recolhas:', err);
    mensagemRecolha.value = 'Erro ao carregar recolhas.';
  }
};


const selecionarRecolha = (recolha) => {
  recolhaSelecionada.value = recolha;
  envio.value.id_recolha = recolha.id_recolha;
  envio.value.nome_receptor = recolha.nome_cliente;
  envio.value.niff_receptor = recolha.nif_cliente;
  envio.value.morada_destinatario = recolha.morada_cliente;
  envio.value.peso = recolha.peso;
  envio.value.volume = recolha.volume;
  envio.value.tipo_embalagem = recolha.tipo_embalagem;
  envio.value.designacao_mercadoria = recolha.designacao_mercadoria;
  envio.value.observacoes = recolha.observacoes;
};


const selecionarUtilizador = (u) => {
  envio.value.nome_receptor = u.nome_utilizador + ' ' + u.apelido_utilizador
  envio.value.niff_receptor = u.documento_identificacao
  envio.value.morada_destinatario = `${u.morada_rua}, ${u.morada_localidade} ${u.morada_cod_postal}`
  envio.value.id_utilizador_cliente = u.id_utilizador
  mostrarLista.value = false
}

const limparUtilizador = () => {
  envio.value.nome_receptor = ''
  envio.value.niff_receptor = ''
  envio.value.morada_destinatario = ''
  envio.value.id_utilizador_cliente = null
  mostrarLista.value = false
}

const cancelar = () => window.history.back()

const submeterEnvio = async () => {
  try {
    const token = authStore.token
    const payload = {
      ...envio.value,
      id_recolha: envio.value.id_recolha ?? null
    };

    if (!payload.designacao_mercadoria) delete payload.designacao_mercadoria
    if (!payload.tipo_embalagem) delete payload.tipo_embalagem

    payload.peso = parseFloat(payload.peso.toString().replace(',', '.'));

    await axios.post('http://localhost:3000/api/encomendas', payload, {
      headers: { Authorization: `Bearer ${token}` }
    })
  } catch (err) {
    console.error('Erro ao submeter envio:', err)
    throw err
  }
}

const confirmarEnvio = async (tipo) => {
  try {
    const camposEmFalta = [];

    if (!envio.value.nome_receptor) camposEmFalta.push('Nome do Recetor');
    if (!envio.value.niff_receptor) camposEmFalta.push('NIF do Recetor');
    if (!envio.value.morada_destinatario) camposEmFalta.push('Morada do Recetor');
    if (!envio.value.peso || envio.value.peso <= 0) camposEmFalta.push('Peso');
    if (!envio.value.volume || envio.value.volume <= 0) camposEmFalta.push('Volume');

    if (camposEmFalta.length > 0) {
      alert(`Por favor preenche os seguintes campos: ${camposEmFalta.join(', ')}`);
      return;
    }

    const servicoSelecionado = servicos.value.find(s => s.nome === envio.value.servico_nome);
    const categoriaSelecionada = categorias.value.find(c => c.nome === envio.value.categoria_nome);

    if (!servicoSelecionado || !categoriaSelecionada) {
      alert('Serviço ou categoria inválida.');
      return;
    }

    envio.value.servico_nome = servicoSelecionado.nome;
    envio.value.categoria_nome = categoriaSelecionada.nome;

    if (!envio.value.data) {
      envio.value.data = new Date().toISOString().slice(0, 10);
    }

    if (!envio.value.hora) {
      const now = new Date();
      envio.value.hora = now.toTimeString().slice(0, 5);
    }

    await submeterEnvio();

    if (envio.value.id_recolha) {
      await marcarRecolhaAssociada(envio.value.id_recolha);
      await carregarRecolhasPendentes();
    }

    if (tipo === 'etiqueta') {
      alert('Encomenda criada e etiqueta impressa.');
    } else if (tipo === 'guia') {
      alert('Encomenda criada e guia impressa.');
    } else {
      alert('Encomenda criada sem impressão.');
    }
  } catch (err) {
    if (err.response?.data) {
      console.error('Erro detalhado ao criar encomenda:', err.response.data);
    } else {
      console.error('Erro inesperado:', err.message || err);
    }

    const mensagem =
        err.response?.data?.erro === 'É necessário ter um turno ativo para realizar esta ação.'
            ? 'Não tens um turno ativo. Vai à página de turno e inicia o turno antes de criar uma encomenda.'
            : err.response?.data?.erro || 'Erro ao criar encomenda.';

    alert(mensagem);
  }

}



watch(() => envio.value.peso, async (novoPeso) => {
  if (!novoPeso) return;
  try {
    const token = authStore.token;
    const res = await axios.get(`http://localhost:3000/api/custos_envio/por-peso/${novoPeso}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const custo = res.data;
    envio.value.s_iva = custo.s_iva;
    envio.value.iva = custo.iva;
    envio.value.pvp = custo.pvp;
    envio.value.pvp_acordado = custo.pvp;
    envio.value.id_custo_envio = custo.id_custo_envio;
  } catch (err) {
    console.error('Erro ao obter custo por peso:', err);
  }
});

const atualizarTipoEncomenda = () => {
  if (envio.value.recolha) {
    envio.value.esporadico = false;
    envio.value.reembolso = false;
    envio.value.id_tipo_encomenda = 4;
    carregarRecolhasPendentes();
  } else if (envio.value.esporadico) {
    envio.value.recolha = false;
    envio.value.reembolso = false;
    envio.value.id_tipo_encomenda = 2;
  } else if (envio.value.reembolso) {
    envio.value.recolha = false;
    envio.value.esporadico = false;
    envio.value.id_tipo_encomenda = 3;
  } else {
    envio.value.id_tipo_encomenda = 1;
  }
};

const marcarRecolhaAssociada = async (id_recolha) => {
  const token = authStore.token;
  try {
    await axios.patch(`http://localhost:3000/api/recolhas/${id_recolha}/associar`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    console.error('Erro ao marcar recolha como associada:', err.response?.data || err);
    alert('Erro ao marcar recolha como associada: ' + (err.response?.data?.erro || err.message));
  }
};




const aplicarRecolha = async (recolha) => {
  envio.value.id_recolha = recolha.id_recolha;
  envio.value.nome_receptor = recolha.nome_destinatario;
  envio.value.niff_receptor = recolha.nif_destinatario;
  envio.value.morada_destinatario = recolha.morada_destinatario;
  envio.value.peso = recolha.peso;
  envio.value.volume = recolha.volume;
  envio.value.tipo_embalagem = recolha.tipo_embalagem;
  envio.value.designacao_mercadoria = recolha.designacao_mercadoria;
  envio.value.observacoes = recolha.observacoes;
  envio.value.email_recetor = recolha.email_cliente;
  recolhaSelecionada.value = recolha;
};






</script>


<style src="@/assets/styles/dashboard_css/novo_envio.css"></style>




