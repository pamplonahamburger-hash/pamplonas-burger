// ==========================================
// HEADER AO ROLAR
// ==========================================

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 60) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});

// ==========================================
// SCROLL SUAVE
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (e) {

        const destino = document.querySelector(this.getAttribute("href"));

        if (!destino) return;

        e.preventDefault();

        destino.scrollIntoView({

            behavior: "smooth"

        });

    });

});

// ==========================================
// ANIMAÇÃO DOS CARDS
// ==========================================

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {

    threshold: .15

});

function observarCards() {

    document.querySelectorAll(".product,.card").forEach(card => {

        observer.observe(card);

    });

}

const observerLista = new MutationObserver(() => {

    observarCards();

});

observerLista.observe(document.body, {

    childList: true,
    subtree: true

});

observarCards();
// ==========================================
// CONFIGURAR WHATSAPP
// ==========================================

function configurarWhatsApp() {

    document.querySelectorAll("[data-whatsapp]").forEach(botao => {

        const mensagem = botao.dataset.whatsapp;

        botao.href =
            `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(mensagem)}`;

        botao.target = "_blank";

    });

}

configurarWhatsApp();
// ==========================================
// PEDIDO DO PRODUTO
// ==========================================

function abrirWhatsApp(produto){

    const mensagem =
        `Olá! Quero pedir o ${produto}.`;

    window.open(

        `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(mensagem)}`,

        "_blank"

    );

}