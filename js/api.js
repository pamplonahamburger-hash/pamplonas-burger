// ==========================================
// CONFIGURAÇÃO DA API
// ==========================================

const API_URL =
"https://script.google.com/macros/s/AKfycbw5jFPujmLMWDt7VzGlppmja1IHCLtQQzwUoWucgSHpZcTfJepJhGCXEpWJsSDb_IwhUA/exec";

// ==========================================
// BUSCAR PRODUTOS
// ==========================================

// ==========================================
// CONFIGURAÇÃO DA API
// ==========================================

async function buscarProdutos() {

    try {

        const resposta = await fetch(CONFIG.API);

        const produtos = await resposta.json();

        return produtos;

    } catch (erro) {

        console.error("Erro ao buscar produtos:", erro);

        return [];

    }

}