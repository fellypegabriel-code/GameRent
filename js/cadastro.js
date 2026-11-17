
const formulario = document.querySelector("#cadastroForm");

const nome = document.querySelector("#nome");
const email = document.querySelector("#email");
const senha = document.querySelector("#senha");
const confirmarSenha = document.querySelector("#confirmarSenha");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    
    const valorNome = nome.value.trim();
    const valorEmail = email.value.trim().toLowerCase();
    const valorSenha = senha.value.trim();
    const valorConfirmar = confirmarSenha.value.trim();

    
    if (valorNome === "") {
        alert("Digite seu nome completo!");
        return;
    }

    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valorEmail)) {
        alert("Digite um e-mail válido!");
        return;
    }

    
    if (valorSenha !== valorConfirmar) {
        alert("As senhas não são iguais!");
        return;
    }

    
    const usuario = {
        nome: valorNome,
        email: valorEmail,
        senha: valorSenha
    };

    
    try {
        localStorage.setItem("usuario", JSON.stringify(usuario));

        alert("Cadastro realizado com sucesso!");

        
        window.location.href = "index.html";

    } catch (erro) {
        alert("Não foi possível salvar o cadastro!");
    }
});
