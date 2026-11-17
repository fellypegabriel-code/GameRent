
const formulario = document.querySelector("#perfilForm");
const nome = document.querySelector("#nome");
const email = document.querySelector("#email");
const senha = document.querySelector("#senha");
const confirmarSenha = document.querySelector("#confirmarSenha");
const mensagem = document.querySelector("#mensagem");


let usuario;

try {
    usuario = JSON.parse(localStorage.getItem("usuario"));
} catch (erro) {
    console.error("Erro ao recuperar usuário:", erro);
    usuario = null;
}

if (!usuario) {
    alert("Faça login para acessar seu perfil!");
    window.location.href = "index.html";
} else {
    nome.value = usuario.nome || "";
    email.value = usuario.email || "";
}


formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const novoNome = nome.value.trim();
    const novoEmail = email.value.trim().toLowerCase();
    const novaSenha = senha.value.trim();
    const confirmar = confirmarSenha.value.trim();

    
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoEmail);

    if (!novoNome || !emailValido) {
        mensagem.textContent = "Preencha o nome e um e-mail válido!";
        return;
    }

    
    if (novaSenha !== "" || confirmar !== "") {

        if (!novaSenha || !confirmar) {
            mensagem.textContent = "Preencha os dois campos de senha!";
            return;
        }

        if (novaSenha !== confirmar) {
            mensagem.textContent = "As senhas não são iguais!";
            return;
        }

        usuario.senha = novaSenha;
    }

    
    usuario.nome = novoNome;
    usuario.email = novoEmail;

   
    try {
        localStorage.setItem("usuario", JSON.stringify(usuario));

        senha.value = "";
        confirmarSenha.value = "";

        mensagem.textContent = "Perfil atualizado com sucesso!";

    } catch (erro) {
        console.error("Erro ao salvar perfil:", erro);
        mensagem.textContent = "Não foi possível salvar as alterações.";
    }
});
