// ==========================================
// CONFIGURAÇÃO DA API
// ==========================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbw5jFPujmLMWDt7VzGlppmja1IHCLtQQzwUoWucgSHpZcTfJepJhGCXEpWJsSDb_IwhUA/exec";


// ==========================================
// BUSCAR PRODUTOS - SITE PÚBLICO
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


// ==========================================
// BUSCAR PRODUTOS - PAINEL ADMIN
// ==========================================

async function buscarProdutosAdmin() {

    const token =
        localStorage.getItem("tokenAdmin");


    if (!token) {

        throw new Error(
            "Sessão não encontrada."
        );

    }


    try {

        const resposta = await fetch(
            API_URL +
            "?acao=listarAdmin&token=" +
            encodeURIComponent(token)
        );


        if (!resposta.ok) {

            throw new Error(
                "Erro HTTP: " + resposta.status
            );

        }


        const dados =
            await resposta.json();


        if (!dados.sucesso) {

            if (dados.autenticado === false) {

                localStorage.removeItem(
                    "tokenAdmin"
                );

                window.location.href =
                    "admin.html";

                return [];

            }


            throw new Error(
                dados.mensagem ||
                "Erro ao carregar produtos."
            );

        }


        return dados.produtos || [];


    } catch (erro) {

        console.error(
            "Erro ao buscar produtos administrativos:",
            erro
        );

        throw erro;

    }

}