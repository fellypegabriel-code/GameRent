
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

    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valorEmail)) {
        alert("Digite um e-mail válido!");
        return;
    }

    
    const usuarioSalvo = localStorage.getItem("usuario");

    if (usuarioSalvo === null) {
        alert("Nenhum usuário cadastrado!");
        return;
    }

   
    let usuarioObjeto;

    try {
        usuarioObjeto = JSON.parse(usuarioSalvo);
    } catch (erro) {
        alert("Não foi possível ler os dados do usuário!");
        return;
    }

    
    if (!usuarioObjeto.email || !usuarioObjeto.senha) {
        alert("Dados de cadastro inválidos!");
        return;
    }

    
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
