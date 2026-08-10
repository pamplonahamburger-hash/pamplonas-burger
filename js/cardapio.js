// ==========================================
// CARDÁPIO V2
// ==========================================

let todosProdutos = [];
let categoriaAtual = "Todos";
document.addEventListener("DOMContentLoaded", async () => {

    todosProdutos = await buscarProdutos();
    criarFiltros(todosProdutos);
    renderizarCardapio(todosProdutos);

    const pesquisa = document.getElementById("pesquisa");

    pesquisa.addEventListener("input", pesquisarProdutos);

});

// ==========================================
// PESQUISA
// ==========================================

function pesquisarProdutos(){

    const texto = document
        .getElementById("pesquisa")
        .value
        .toLowerCase()
        .trim();

    let lista = todosProdutos;

    if(categoriaAtual !== "Todos"){

        lista = lista.filter(p => p.Categoria === categoriaAtual);

    }

    lista = lista.filter(produto => {

        const nome = (produto.Nome || "").toLowerCase();
        const descricao = (produto.Descrição || "").toLowerCase();
        const categoria = (produto.Categoria || "").toLowerCase();

        return (
            nome.includes(texto) ||
            descricao.includes(texto) ||
            categoria.includes(texto)
        );

    });

    renderizarCardapio(lista);

}
// ==========================================
// RENDERIZAR CARDÁPIO
// ==========================================

function renderizarCardapio(produtos) {

    const lista = document.getElementById("listaProdutos");

    lista.innerHTML = "";

    const produtosDisponiveis = produtos
    .filter(produto => String(produto["Disponível"]).toLowerCase() === "sim")
    .sort((a, b) => {

        const ordemA = Number(a.Ordem) || 999;
        const ordemB = Number(b.Ordem) || 999;

        return ordemA - ordemB;

    });

    const categorias = {};

    produtosDisponiveis.forEach(produto => {

        const categoria = (produto.Categoria || "Outros").trim();

        if (!categorias[categoria]) {

            categorias[categoria] = [];

        }

        categorias[categoria].push(produto);

    });

    Object.keys(categorias).forEach(categoria => {

        const section = document.createElement("section");

        section.className = "categoria";

        section.innerHTML = `

            <h3>${emojiCategoria(categoria)} ${categoria}</h3>

            <div class="products">

                ${categorias[categoria].map(criarCard).join("")}

            </div>

        `;

        lista.appendChild(section);

    });

}

// ==========================================
// CARD
// ==========================================

function criarCard(produto){

    let imagem = produto.Imagem || "";

    if(!imagem.startsWith("http")){

        imagem = "assets/images/" + imagem;

    }

    let preco = Number(
        String(produto.Preço).replace(",", ".")
    );

    if(isNaN(preco)){

        preco = 0;

    }

    const destaque = String(produto.Destaque).toLowerCase() === "sim";

    return `

    <article class="product">

        ${destaque ? '<div class="badge">⭐ Destaque</div>' : ""}

        <img
            loading="lazy"
            src="${imagem}"
            alt="${produto.Nome}">

        <div class="product-info">

            <h3>${produto.Nome}</h3>

            <p>${produto.Descrição}</p>

            <div class="product-footer">

                <span class="price">
                    R$ ${preco.toFixed(2).replace(".", ",")}
                </span>

                <a
    class="btn-buy"
    href="#"
    onclick="abrirWhatsApp('${produto.Nome}'); return false;">

    🍔 Pedir Agora

</a>

            </div>

        </div>

    </article>

    `;

}

// ==========================================
// EMOJIS
// ==========================================

function emojiCategoria(categoria) {

    const nome = categoria.toLowerCase();

    if (nome.includes("hamb")) return "🍔";

    if (nome.includes("batata")) return "🍟";

    if (nome.includes("acomp")) return "🍟";

    if (nome.includes("beb")) return "🥤";

    if (nome.includes("refri")) return "🥤";

    if (nome.includes("sobrem")) return "🍰";

    if (nome.includes("molho")) return "🥫";

    return "⭐";

}
function criarFiltros(produtos){

    const div = document.getElementById("filtros");

    const categorias = [...new Set(produtos.map(p=>p.Categoria))];

    categorias.unshift("Todos");

    div.innerHTML="";

    categorias.forEach(cat=>{

        const botao=document.createElement("button");

        botao.className="filtro";

        if(cat==="Todos"){

            botao.classList.add("ativo");

        }

        botao.innerText=cat;

        botao.onclick=()=>{

            categoriaAtual=cat;

            document
            .querySelectorAll(".filtro")
            .forEach(b=>b.classList.remove("ativo"));

            botao.classList.add("ativo");

            pesquisarProdutos();

        };

        div.appendChild(botao);

    });

}