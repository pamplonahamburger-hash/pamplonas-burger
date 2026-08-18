// ==========================================
// PROTEÇÃO DO PAINEL
// ==========================================

const tokenAdmin = localStorage.getItem("tokenAdmin");

if (!tokenAdmin) {

    window.location.href = "admin.html";

}


// ==========================================
// VARIÁVEIS
// ==========================================

let produtosAtuais = [];


// ==========================================
// CARREGAR PRODUTOS
// ==========================================

async function carregarProdutos() {

    const tbody =
        document.getElementById("listaProdutos");

    tbody.innerHTML = `
        <tr>
            <td colspan="7">
                Carregando produtos...
            </td>
        </tr>
    `;

    try {

        produtosAtuais =
            await buscarProdutosAdmin();

        tbody.innerHTML = "";

        if (!produtosAtuais.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        Nenhum produto encontrado.
                    </td>
                </tr>
            `;

            return;

        }

        produtosAtuais.forEach(function(produto, indice) {

            const linha =
                document.createElement("tr");

            const imagem =
                produto.Imagem || "";

            const disponivel =
                String(produto["Disponível"])
                    .toLowerCase() === "sim";

            const destaque =
                String(produto.Destaque)
                    .toLowerCase() === "sim";

            /*
             * A API devolve a linha real da planilha.
             * Se não existir, usamos o índice + 2.
             */
            const numeroLinha =
                produto._linha ||
                (indice + 2);

            linha.innerHTML = `

                <td>

                    ${
                        imagem

                        ? `
                            <img
                                src="${imagem}"
                                alt="${produto.Nome || "Produto"}"
                                style="
                                    width:70px;
                                    height:70px;
                                    object-fit:cover;
                                    border-radius:10px;
                                "
                            >
                          `

                        : "Sem imagem"
                    }

                </td>

                <td>
                    ${produto.Nome || ""}
                </td>

                <td>
                    ${produto.Categoria || ""}
                </td>

                <td>
                    R$ ${formatarPreco(produto.Preço)}
                </td>

                <td>

                    <button
                        type="button"
                        onclick="alternarDisponibilidade(
                            ${numeroLinha},
                            ${indice}
                        )"
                    >
                        ${disponivel ? "✅ Sim" : "❌ Não"}
                    </button>

                </td>

                <td>

                    <button
                        type="button"
                        onclick="alternarDestaque(
                            ${numeroLinha},
                            ${indice}
                        )"
                    >
                        ${destaque ? "⭐ Sim" : "Não"}
                    </button>

                </td>

                <td>

                    <button
                        type="button"
                        onclick="editar(${indice})"
                    >
                        ✏️
                    </button>

                    <button
                        type="button"
                        onclick="excluir(${numeroLinha})"
                    >
                        🗑️
                    </button>

                </td>

            `;

            tbody.appendChild(linha);

        });

    } catch (erro) {

        console.error(
            "Erro no dashboard:",
            erro
        );

        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    Erro ao carregar produtos.
                    <br>
                    ${erro.message}
                </td>
            </tr>
        `;

    }

}


// ==========================================
// FORMATAR PREÇO
// ==========================================

function formatarPreco(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {
        return "0,00";
    }

    const numero =
        Number(
            String(valor)
                .replace("R$", "")
                .replace(",", ".")
                .trim()
        );

    if (isNaN(numero)) {
        return valor;
    }

    return numero.toFixed(2).replace(".", ",");

}


// ==========================================
// NOVO PRODUTO
// ==========================================

async function novoProduto() {

    const nome =
        prompt("Nome do produto:");

    if (!nome) {
        return;
    }

    const categoria =
        prompt("Categoria:");

    if (!categoria) {
        return;
    }

    const preco =
        prompt("Preço:");

    if (!preco) {
        return;
    }

    const imagem =
        prompt("URL da imagem:");

    const disponivel =
        confirm(
            "O produto está disponível?"
        )
            ? "Sim"
            : "Não";

    const destaque =
        confirm(
            "Deseja colocar o produto em destaque?"
        )
            ? "Sim"
            : "Não";

    try {

        await criarProduto({

            Nome: nome,

            Categoria: categoria,

            Preço: preco,

            Imagem: imagem,

            Disponível: disponivel,

            Destaque: destaque

        });

        alert(
            "Produto criado com sucesso!"
        );

        carregarProdutos();

    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao criar produto:\n" +
            erro.message
        );

    }

}


// ==========================================
// EDITAR
// ==========================================

async function editar(indice) {

    const produto =
        produtosAtuais[indice];

    if (!produto) {
        return;
    }

    const linha =
        produto._linha ||
        (indice + 2);

    const nome =
        prompt(
            "Nome do produto:",
            produto.Nome || ""
        );

    if (nome === null) {
        return;
    }

    const categoria =
        prompt(
            "Categoria:",
            produto.Categoria || ""
        );

    if (categoria === null) {
        return;
    }

    const preco =
        prompt(
            "Preço:",
            produto.Preço || ""
        );

    if (preco === null) {
        return;
    }

    const imagem =
        prompt(
            "URL da imagem:",
            produto.Imagem || ""
        );

    if (imagem === null) {
        return;
    }

    const disponivel =
        confirm(
            "Produto disponível?\n\nOK = Sim\nCancelar = Não"
        )
            ? "Sim"
            : "Não";

    const destaque =
        confirm(
            "Produto em destaque?\n\nOK = Sim\nCancelar = Não"
        )
            ? "Sim"
            : "Não";

    try {

        await atualizarProduto(
            linha,
            {

                Nome: nome,

                Categoria: categoria,

                Preço: preco,

                Imagem: imagem,

                Disponível: disponivel,

                Destaque: destaque

            }
        );

        alert(
            "Produto atualizado com sucesso!"
        );

        carregarProdutos();

    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao editar produto:\n" +
            erro.message
        );

    }

}


// ==========================================
// EXCLUIR
// ==========================================

async function excluir(linha) {

    if (
        !confirm(
            "Tem certeza que deseja excluir este produto?"
        )
    ) {
        return;
    }

    try {

        await excluirProduto(linha);

        alert(
            "Produto excluído com sucesso!"
        );

        carregarProdutos();

    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao excluir produto:\n" +
            erro.message
        );

    }

}


// ==========================================
// ALTERAR DISPONIBILIDADE
// ==========================================

async function alternarDisponibilidade(
    linha,
    indice
) {

    const produto =
        produtosAtuais[indice];

    if (!produto) {
        return;
    }

    const atual =
        String(produto["Disponível"])
            .trim()
            .toLowerCase() === "sim";

    const novoValor =
        atual ? "Não" : "Sim";

    try {

        await alterarDisponibilidade(
            linha,
            novoValor
        );

        await carregarProdutos();

    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao alterar disponibilidade:\n" +
            erro.message
        );

    }

}


// ==========================================
// ALTERAR DESTAQUE
// ==========================================

async function alternarDestaque(
    linha,
    indice
) {

    const produto =
        produtosAtuais[indice];

    if (!produto) {
        return;
    }

    const atual =
        String(produto.Destaque)
            .trim()
            .toLowerCase() === "sim";

    const novoValor =
        atual ? "Não" : "Sim";

    try {

        await alterarDestaque(
            linha,
            novoValor
        );

        await carregarProdutos();

    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao alterar destaque:\n" +
            erro.message
        );

    }

}

// ==========================================
// BOTÃO NOVO PRODUTO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const botao =
            document.getElementById(
                "novoProduto"
            );

        if (botao) {

            botao.addEventListener(
                "click",
                novoProduto
            );

        }

        carregarProdutos();

    }
);