
const formulario = document.querySelector("#recuperarForm");
const email = document.querySelector("#email");
const mensagem = document.querySelector("#mensagem");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const valorEmail = email.value.trim().toLowerCase();

    
    let usuario;

    try {
        usuario = JSON.parse(localStorage.getItem("usuario"));
    } catch (erro) {
        console.error("Erro ao recuperar usuário:", erro);
        mensagem.textContent = "Não foi possível consultar os dados.";
        return;
    }

    
    if (!usuario) {
        mensagem.textContent = "Nenhum usuário cadastrado!";
        return;
    }

   
    const emailSalvo = String(usuario.email || "").toLowerCase();

    if (valorEmail === emailSalvo) {
        mensagem.textContent =
            "E-mail encontrado! A recuperação de senha foi simulada com sucesso.";
    } else {
        mensagem.textContent = "Este e-mail não está cadastrado!";
    }
});
