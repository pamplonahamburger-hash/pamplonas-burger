// ==========================================
// PROTEÇÃO
// ==========================================

const tokenAdmin =
    localStorage.getItem("tokenAdmin");

if (!tokenAdmin) {

    window.location.href =
        "admin.html";

}


// ==========================================
// VARIÁVEIS
// ==========================================

let produtos = [];

let carrinho = [];


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    iniciar
);


async function iniciar() {

    await carregarProdutos();

    atualizarCarrinho();

}


// ==========================================
// CARREGAR PRODUTOS
// ==========================================

async function carregarProdutos() {

    const lista =
        document.getElementById(
            "listaProdutos"
        );

    try {

        produtos =
            await buscarProdutos();

        produtos = produtos
            .filter(produto =>
                String(
                    produto["Disponível"]
                ).toLowerCase() === "sim"
            )
            .sort((a, b) => {

                const ordemA =
                    Number(a.Ordem) || 999;

                const ordemB =
                    Number(b.Ordem) || 999;

                return ordemA - ordemB;

            });

        lista.innerHTML = "";

        if (!produtos.length) {

            lista.innerHTML =
                "<p>Nenhum produto disponível.</p>";

            return;

        }

        produtos.forEach(
            criarProduto
        );

    } catch (erro) {

        console.error(erro);

        lista.innerHTML =
            "<p>Erro ao carregar produtos.</p>";

    }

}


// ==========================================
// CRIAR PRODUTO
// ==========================================

function criarProduto(produto) {

    const lista =
        document.getElementById(
            "listaProdutos"
        );

    const preco =
        converterPreco(
            produto.Preço
        );

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "produto-pedido";

    card.innerHTML = `

        <div>

            <strong>
                ${produto.Nome || ""}
            </strong>

            <span>
                R$ ${preco
                    .toFixed(2)
                    .replace(".", ",")}
            </span>

        </div>

        <button
            type="button"
            onclick="adicionarProduto(
                ${produtos.indexOf(produto)}
            )">

            + Adicionar

        </button>

    `;

    lista.appendChild(card);

}


// ==========================================
// ADICIONAR
// ==========================================

function adicionarProduto(indice) {

    const produto =
        produtos[indice];

    if (!produto) return;

    const existente =
        carrinho.find(
            item =>
                item.produto.Nome ===
                produto.Nome
        );

    if (existente) {

        existente.quantidade++;

    } else {

        carrinho.push({

            produto: produto,

            quantidade: 1

        });

    }

    atualizarCarrinho();

}


// ==========================================
// DIMINUIR
// ==========================================

function diminuirProduto(indice) {

    const item =
        carrinho[indice];

    if (!item) return;

    item.quantidade--;

    if (item.quantidade <= 0) {

        carrinho.splice(
            indice,
            1
        );

    }

    atualizarCarrinho();

}


// ==========================================
// AUMENTAR
// ==========================================

function aumentarProduto(indice) {

    const item =
        carrinho[indice];

    if (!item) return;

    item.quantidade++;

    atualizarCarrinho();

}


// ==========================================
// CARRINHO
// ==========================================

function atualizarCarrinho() {

    const area =
        document.getElementById(
            "carrinho"
        );

    const totalElemento =
        document.getElementById(
            "total"
        );

    if (!carrinho.length) {

        area.innerHTML = `
            <p class="vazio">
                Nenhum produto adicionado.
            </p>
        `;

        totalElemento.textContent =
            "R$ 0,00";

        return;

    }

    let total = 0;

    area.innerHTML = "";

    carrinho.forEach(
        (item, indice) => {

            const preco =
                converterPreco(
                    item.produto.Preço
                );

            const subtotal =
                preco *
                item.quantidade;

            total += subtotal;

            const linha =
                document.createElement(
                    "div"
                );

            linha.className =
                "item-carrinho";

            linha.innerHTML = `

                <div>

                    <strong>
                        ${item.produto.Nome}
                    </strong>

                    <span>
                        R$ ${subtotal
                            .toFixed(2)
                            .replace(".", ",")}
                    </span>

                </div>

                <div class="quantidade">

                    <button
                        type="button"
                        onclick="diminuirProduto(${indice})">

                        −

                    </button>

                    <strong>
                        ${item.quantidade}
                    </strong>

                    <button
                        type="button"
                        onclick="aumentarProduto(${indice})">

                        +

                    </button>

                </div>

            `;

            area.appendChild(linha);

        }
    );

    totalElemento.textContent =
        "R$ " +
        total
            .toFixed(2)
            .replace(".", ",");

}


// ==========================================
// CONVERTER PREÇO
// ==========================================

function converterPreco(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return 0;

    }

    let texto =
        String(valor)
            .trim()
            .replace("R$", "")
            .replace(/\s/g, "");

    if (
        texto.includes(",") &&
        texto.includes(".")
    ) {

        texto =
            texto
                .replace(/\./g, "")
                .replace(",", ".");

    } else {

        texto =
            texto.replace(",", ".");

    }

    const numero =
        Number(texto);

    return Number.isFinite(numero)
        ? numero
        : 0;

}


// ==========================================
// ENVIAR
// ==========================================

document
    .getElementById(
        "enviarPedido"
    )
    .addEventListener(
        "click",
        enviarPedido
    );


function enviarPedido() {

    if (!carrinho.length) {

        alert(
            "Adicione pelo menos um produto."
        );

        return;

    }

    const cliente =
        document
            .getElementById(
                "cliente"
            )
            .value
            .trim();

    const telefone =
        document
            .getElementById(
                "telefone"
            )
            .value
            .trim();

    const endereco =
        document
            .getElementById(
                "endereco"
            )
            .value
            .trim();

    const observacao =
        document
            .getElementById(
                "observacao"
            )
            .value
            .trim();

    const pagamento =
        document.querySelector(
            'input[name="pagamento"]:checked'
        )?.value || "";

    if (!cliente) {

        alert(
            "Digite o nome do cliente."
        );

        return;

    }

    if (!telefone) {

        alert(
            "Digite o telefone."
        );

        return;

    }

    const pedido = {

        cliente,

        telefone,

        endereco,

        pagamento,

        observacao,

        itens:
            carrinho.map(item => ({

                nome:
                    item.produto.Nome,

                quantidade:
                    item.quantidade,

                preco:
                    converterPreco(
                        item.produto.Preço
                    )

            }))

    };


    console.log(
        "PEDIDO PRONTO:",
        pedido
    );


    alert(
        "Pedido montado com sucesso!\n\n" +
        "A próxima etapa será enviar este pedido para a fila da cozinha."
    );

}