// ==========================================
// PROTEÇÃO DO PAINEL
// ==========================================

const tokenAdmin = localStorage.getItem("tokenAdmin");

if (!tokenAdmin) {

    window.location.href = "admin.html";

}


// ==========================================
// DASHBOARD
// ==========================================

async function carregarProdutos() {

    const tbody =
        document.getElementById("listaProdutos");


    tbody.innerHTML = `
        <tr>
            <td colspan="7">
                Carregando...
            </td>
        </tr>
    `;


    try {

        // IMPORTANTE:
        // O dashboard usa a função protegida.
        const produtos =
            await buscarProdutosAdmin();


        tbody.innerHTML = "";


        if (!produtos.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        Nenhum produto encontrado.
                    </td>
                </tr>
            `;

            return;

        }


        produtos.forEach((produto, indice) => {

            const imagem =
                produto.Imagem || "";


            const linha =
                document.createElement("tr");


            linha.innerHTML = `

                <td>

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

                </td>

                <td>
                    ${produto.Nome || ""}
                </td>

                <td>
                    ${produto.Categoria || ""}
                </td>

                <td>
                    R$ ${produto.Preço || "0,00"}
                </td>

                <td>
                    ${produto["Disponível"] || ""}
                </td>

                <td>
                    ${produto.Destaque || ""}
                </td>

                <td>

                    <button
                        type="button"
                        onclick="editar(${indice})">

                        ✏️

                    </button>

                    <button
                        type="button"
                        onclick="excluir(${indice})">

                        🗑️

                    </button>

                </td>

            `;


            tbody.appendChild(linha);

        });


    } catch (e) {

        console.error(
            "Erro no dashboard:",
            e
        );


        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    Erro ao carregar produtos.
                </td>
            </tr>
        `;

    }

}


// ==========================================
// EDITAR
// ==========================================

function editar(id) {

    alert(
        "Editar produto " +
        id +
        " será implementado em seguida."
    );

}


// ==========================================
// EXCLUIR
// ==========================================

function excluir(id) {

    if (!confirm("Excluir este produto?")) {

        return;

    }


    alert(
        "A exclusão será implementada em seguida."
    );

}


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    carregarProdutos
);