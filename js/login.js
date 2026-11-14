const formulario = document.querySelector("#loginForm");
const email = document.querySelector("#email");
const senha = document.querySelector("#senha");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const valorEmail = email.value.trim();
    const valorSenha = senha.value.trim();

    if (valorEmail === "" || valorSenha === "") {
        alert("Preencha o e-mail e a senha!");
        return;
    }

    if (!valorEmail.includes("@")) {
        alert("Digite um e-mail válido!");
        return;
    }


    const usuarioSalvo = localStorage.getItem("usuario");

    if (usuarioSalvo === null) {
        alert("Nenhum usuário cadastrado!");
        return;
    }

    const usuarioObjeto = JSON.parse(usuarioSalvo);

    if (
        valorEmail === usuarioObjeto.email &&
        valorSenha === usuarioObjeto.senha
    ) {
        alert("Login realizado com sucesso!");
        window.location.href = "catalogo.html";
    } else {
        alert("E-mail ou senha incorretos!");
    }
});