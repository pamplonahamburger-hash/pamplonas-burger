// ==========================================
// CONFIGURAÇÃO
// ==========================================

const API =
    "https://script.google.com/macros/s/AKfycbw5jFPujmLMWDt7VzGlppmja1IHCLtQQzwUoWucgSHpZcTfJepJhGCXEpWJsSDb_IwhUA/exec";


// ==========================================
// LOGIN
// ==========================================

document
    .getElementById("loginForm")
    .addEventListener("submit", function (e) {

        e.preventDefault();

        fazerLogin();

    });


// ==========================================
// FAZER LOGIN
// ==========================================

async function fazerLogin() {

    const senha =
        document.getElementById("senha").value.trim();

    const erro =
        document.getElementById("erro");

    erro.textContent = "";

    if (!senha) {

        erro.textContent =
            "Digite a senha.";

        return;

    }

    const form =
        new URLSearchParams();

    form.append("senha", senha);

    try {

        const resposta =
            await fetch(
                API + "?acao=login",
                {
                    method: "POST",
                    body: form
                }
            );

        if (!resposta.ok) {

            throw new Error(
                "Erro HTTP: " + resposta.status
            );

        }

        const dados =
            await resposta.json();

        if (!dados.sucesso) {

            erro.textContent =
                dados.mensagem || "Senha inválida.";

            return;

        }

        // Guarda o token somente após login válido
        localStorage.setItem(
            "tokenAdmin",
            dados.token
        );

        // Vai para o painel
        window.location.href =
            "dashboard.html";

    } catch (e) {

        console.error(
            "Erro no login:",
            e
        );

        erro.textContent =
            "Erro ao conectar ao servidor.";

    }

}