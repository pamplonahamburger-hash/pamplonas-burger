// ==========================================
// CONFIGURAÇÃO DA API
// ==========================================

const API_URL = CONFIG.API;


// ==========================================
// BUSCAR PRODUTOS - SITE PÚBLICO
// ==========================================

async function buscarProdutos() {

    try {

        const resposta = await fetch(
            API_URL + "?acao=listar"
        );

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const dados = await resposta.json();

        return Array.isArray(dados) ? dados : [];

    } catch (erro) {

        console.error("Erro ao buscar produtos:", erro);

        return [];

    }

}


// ==========================================
// BUSCAR PRODUTOS - PAINEL ADMIN
// ==========================================

async function buscarProdutosAdmin() {

    const token = localStorage.getItem("tokenAdmin");

    if (!token) {
        throw new Error("Sessão não encontrada.");
    }

    try {

        const resposta = await fetch(
            API_URL +
            "?acao=listarAdmin&token=" +
            encodeURIComponent(token)
        );

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const dados = await resposta.json();

        if (!dados.sucesso) {

            if (dados.autenticado === false) {

                localStorage.removeItem("tokenAdmin");

                window.location.href = "admin.html";

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


// ==========================================
// FUNÇÃO GENÉRICA PARA POST
// ==========================================

async function enviarAdmin(dados) {

    const token = localStorage.getItem("tokenAdmin");

    if (!token) {
        throw new Error("Sessão expirada.");
    }

    dados.token = token;

    const parametros = new URLSearchParams();

    Object.keys(dados).forEach(function(chave) {

        parametros.append(
            chave,
            dados[chave] ?? ""
        );

    });

    const resposta = await fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type":
                "application/x-www-form-urlencoded;charset=UTF-8"
        },

        body: parametros.toString()

    });

    if (!resposta.ok) {

        throw new Error(
            "Erro HTTP: " + resposta.status
        );

    }

    const resultado = await resposta.json();

    if (
        resultado.autenticado === false
    ) {

        localStorage.removeItem("tokenAdmin");

        window.location.href = "admin.html";

        return resultado;

    }

    if (!resultado.sucesso) {

        throw new Error(
            resultado.mensagem ||
            "Erro na operação."
        );

    }

    return resultado;

}


// ==========================================
// CRIAR PRODUTO
// ==========================================

async function criarProduto(produto) {

    return await enviarAdmin({

        acao: "criarProduto",

        nome: produto.Nome,

        categoria: produto.Categoria,

        preco: produto.Preço,

        imagem: produto.Imagem,

        disponivel: produto.Disponível,

        destaque: produto.Destaque

    });

}


// ==========================================
// EDITAR PRODUTO
// ==========================================

async function atualizarProduto(linha, produto) {

    return await enviarAdmin({

        acao: "editarProduto",

        linha: linha,

        nome: produto.Nome,

        categoria: produto.Categoria,

        preco: produto.Preço,

        imagem: produto.Imagem,

        disponivel: produto.Disponível,

        destaque: produto.Destaque

    });

}


// ==========================================
// EXCLUIR PRODUTO
// ==========================================

async function excluirProduto(linha) {

    return await enviarAdmin({

        acao: "excluirProduto",

        linha: linha

    });

}

// ==========================================
// ALTERAR DISPONIBILIDADE
// ==========================================

async function alterarDisponibilidade(linha, valor) {

    return await enviarAdmin({

        acao: "alterarDisponibilidade",

        linha: linha,

        valor: valor

    });

}


// ==========================================
// ALTERAR DESTAQUE
// ==========================================

async function alterarDestaque(linha, valor) {

    return await enviarAdmin({

        acao: "alterarDestaque",

        linha: linha,

        valor: valor

    });

}