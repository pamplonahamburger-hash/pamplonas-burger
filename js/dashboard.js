// ===============================
// DASHBOARD
// ===============================

async function carregarProdutos() {

    const tbody = document.getElementById("listaProdutos");

    tbody.innerHTML = `
        <tr>
            <td colspan="7">Carregando...</td>
        </tr>
    `;

    try {

        const produtos = await buscarProdutos();

        tbody.innerHTML = "";

        produtos.forEach((produto, indice) => {

            let imagem = produto.Imagem || "";

            const linha = document.createElement("tr");

            linha.innerHTML = `

                <td>

                    <img
                        src="${imagem}"
                        style="
                            width:70px;
                            height:70px;
                            object-fit:cover;
                            border-radius:10px;
                        ">

                </td>

                <td>${produto.Nome}</td>

                <td>${produto.Categoria}</td>

                <td>R$ ${produto.Preço}</td>

                <td>${produto["Disponível"]}</td>

                <td>${produto.Destaque}</td>

                <td>

                    <button onclick="editar(${indice})">

                        ✏️

                    </button>

                    <button onclick="excluir(${indice})">

                        🗑️

                    </button>

                </td>

            `;

            tbody.appendChild(linha);

        });

    }

    catch(e){

        console.error(e);

        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    Erro ao carregar produtos.
                </td>
            </tr>
        `;

    }

}

function editar(id){

    alert("Editar produto " + id);

}

function excluir(id){

    if(confirm("Excluir este produto?")){

        alert("Vamos implementar no próximo passo.");

    }

}

document.addEventListener("DOMContentLoaded", carregarProdutos);