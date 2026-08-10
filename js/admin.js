const API = "https://script.google.com/macros/s/AKfycbw5jFPujmLMWDt7VzGlppmja1IHCLtQQzwUoWucgSHpZcTfJepJhGCXEpWJsSDb_IwhUA/exec";

document.getElementById("loginForm").addEventListener("submit", function (e) {

    e.preventDefault();

    fazerLogin();

});

async function fazerLogin() {

    const senha = document.getElementById("senha").value;

    const erro = document.getElementById("erro");

    erro.textContent = "";

    const form = new URLSearchParams();

    form.append("senha", senha);

    try {

        const resposta = await fetch(API + "?acao=login", {

            method: "POST",

            body: form

        });

        const dados = await resposta.json();

        if (!dados.sucesso) {

            erro.textContent = dados.mensagem;

            return;

        }

        localStorage.setItem("tokenAdmin", dados.token);

        window.location.href = "dashboard.html";

    } catch (e) {

        console.error(e);

        erro.textContent = "Erro ao conectar.";

    }

}