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

alert("Campos preenchidos com sucesso!");

if (!valorEmail.includes("@")) {
    alert("Digite um e-mail válido!");
    return;
}

});

const emailTeste = "teste@gmail.com";

console.log(emailTeste.includes("@"));