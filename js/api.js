// ==========================================
// CONFIGURAÇÃO DA API
// ==========================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbw5jFPujmLMWDt7VzGlppmja1IHCLtQQzwUoWucgSHpZcTfJepJhGCXEpWJsSDb_IwhUA/exec";


// ==========================================
// BUSCAR PRODUTOS
// ==========================================

async function buscarProdutos() {

    try {

        const resposta = await fetch(
            API_URL + "?acao=listar"
        );

        if (!resposta.ok) {

            throw new Error(
                "Erro HTTP: " + resposta.status
            );

        }

        const dados = await resposta.json();

        // A API pública retorna diretamente o array
        if (Array.isArray(dados)) {

            return dados;

        }

        console.error(
            "Resposta inesperada da API:",
            dados
        );

        return [];

    } catch (erro) {

        console.error(
            "Erro ao buscar produtos:",
            erro
        );

        return [];

    }

}