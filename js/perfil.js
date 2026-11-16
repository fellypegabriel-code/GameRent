const formulario = document.querySelector("#perfilForm");

const nome = document.querySelector("#nome");
const email = document.querySelector("#email");
const senha = document.querySelector("#senha");
const confirmarSenha = document.querySelector("#confirmarSenha");
const mensagem = document.querySelector("#mensagem");

// Carregar os dados salvos
const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
    alert("Faça login para acessar seu perfil!");
    window.location.href = "index.html";
} else {
    nome.value = usuario.nome || "";
    email.value = usuario.email || "";
}

// Salvar alterações
formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const novoNome = nome.value.trim();
    const novoEmail = email.value.trim();
    const novaSenha = senha.value.trim();
    const confirmar = confirmarSenha.value.trim();

    if (!novoNome || !novoEmail || !novoEmail.includes("@")) {
        mensagem.textContent = "Preencha os dados corretamente!";
        return;
    }

    if (novaSenha !== confirmar) {
        mensagem.textContent = "As senhas não são iguais!";
        return;
    }

    usuario.nome = novoNome;
    usuario.email = novoEmail;

    if (novaSenha !== "") {
        usuario.senha = novaSenha;
    }

    localStorage.setItem("usuario", JSON.stringify(usuario));

    senha.value = "";
    confirmarSenha.value = "";

    mensagem.textContent = "Perfil atualizado com sucesso!";
});