const formulario = document.querySelector("#recuperarForm");
const email = document.querySelector("#email");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const valorEmail = email.value.trim();

    const usuarioSalvo = localStorage.getItem("usuario");

    if (usuarioSalvo === null) {
        alert("Nenhum usuário cadastrado!");
        return;
    }

    const usuario = JSON.parse(usuarioSalvo);

    if (valorEmail === usuario.email) {
        alert("E-mail encontrado! A recuperação de senha foi simulada com sucesso.");
    } else {
        alert("Este e-mail não está cadastrado!");
    }
});
