
const API_KEY = "2ef7d5946ba74cf5b824a58f80b9aa6f";


let jogo;

try {
    const jogoSalvo = localStorage.getItem("jogoSelecionado");

    if (jogoSalvo === null) {
        throw new Error("Nenhum jogo selecionado.");
    }

    jogo = JSON.parse(jogoSalvo);

    if (!jogo || !jogo.id) {
        throw new Error("Dados do jogo inválidos.");
    }

} catch (erro) {
    console.error("Erro ao recuperar o jogo:", erro);

    const container = document.querySelector(".detalhes-container");

    container.textContent = "Nenhum jogo selecionado.";

    const link = document.createElement("a");
    link.href = "catalogo.html";
    link.textContent = "Voltar ao catálogo";

    container.appendChild(link);
}


const imagemJogo = document.querySelector("#imagemJogo");
const nomeJogo = document.querySelector("#nomeJogo");
const generoJogo = document.querySelector("#generoJogo");
const plataformaJogo = document.querySelector("#plataformaJogo");
const dataLancamento = document.querySelector("#dataLancamento");
const avaliacaoJogo = document.querySelector("#avaliacaoJogo");
const desenvolvedoraJogo = document.querySelector("#desenvolvedoraJogo");
const descricaoJogo = document.querySelector("#descricaoJogo");
const precoJogo = document.querySelector("#precoJogo");
const statusJogo = document.querySelector("#statusJogo");
const botaoAlugar = document.querySelector("#botaoAlugar");
const mensagemAluguel = document.querySelector("#mensagemAluguel");


function obterAlugueis() {
    try {
        return JSON.parse(localStorage.getItem("alugueis")) || [];
    } catch (erro) {
        console.error("Erro ao recuperar aluguéis:", erro);
        return [];
    }
}


function jogoEstaAlugado() {
    const alugueis = obterAlugueis();

    return alugueis.some(aluguel =>
        aluguel.jogoId === jogo.id &&
        new Date(aluguel.dataExpiracao) > new Date()
    );
}


function atualizarStatus() {
    const alugado = jogoEstaAlugado();

    statusJogo.textContent = alugado
        ? "Alugado"
        : "Disponível";

    statusJogo.className = alugado
        ? "status-alugado"
        : "status-disponivel";

    botaoAlugar.disabled = alugado;

    botaoAlugar.textContent = alugado
        ? "Indisponível"
        : "Alugar jogo";
}


function formatarDataLocal(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}


async function carregarDetalhesAPI() {
    try {
        const resposta = await fetch(
            `https://api.rawg.io/api/games/${jogo.id}?key=${API_KEY}`
        );

        if (!resposta.ok) {
            throw new Error("Erro ao buscar detalhes do jogo.");
        }

        const dados = await resposta.json();

        descricaoJogo.textContent =
            dados.description_raw || "Descrição não disponível.";

        dataLancamento.textContent =
            dados.released || "Não informada";

        avaliacaoJogo.textContent =
            dados.rating ? `${dados.rating}/5` : "Não disponível";

        desenvolvedoraJogo.textContent =
            dados.developers?.map(dev => dev.name).join(", ") ||
            "Não informada";

    } catch (erro) {
        console.error("Erro ao carregar detalhes:", erro);

        descricaoJogo.textContent =
            "Não foi possível carregar a descrição.";

        dataLancamento.textContent = "Não informada";
        avaliacaoJogo.textContent = "Não disponível";
        desenvolvedoraJogo.textContent = "Não informada";
    }
}


function alugarJogo() {
    if (jogoEstaAlugado()) {
        mensagemAluguel.textContent =
            "Este jogo já está alugado!";
        atualizarStatus();
        return;
    }

    const alugueis = obterAlugueis();

    const dataAluguel = new Date();
    const dataExpiracao = new Date(dataAluguel);

    dataExpiracao.setDate(dataExpiracao.getDate() + 7);
    dataExpiracao.setHours(23, 59, 59, 999);

    alugueis.push({
        id: Date.now(),
        jogoId: jogo.id,
        jogo: jogo.nome,
        plataforma: jogo.plataforma,
        capa: jogo.capa,

        dataInicio: formatarDataLocal(dataAluguel),
        dataVencimento: formatarDataLocal(dataExpiracao),

        dataAluguel: dataAluguel.toISOString(),
        dataExpiracao: dataExpiracao.toISOString(),

        status: "Ativo"
    });

    try {
        localStorage.setItem(
            "alugueis",
            JSON.stringify(alugueis)
        );

        mensagemAluguel.textContent =
            "Aluguel realizado com sucesso! Prazo de 7 dias.";

        atualizarStatus();

    } catch (erro) {
        console.error("Erro ao salvar aluguel:", erro);

        mensagemAluguel.textContent =
            "Não foi possível salvar o aluguel.";
    }
}


if (jogo) {
    imagemJogo.src = jogo.capa;
    imagemJogo.alt = `Capa de ${jogo.nome}`;

    nomeJogo.textContent = jogo.nome;
    generoJogo.textContent = jogo.genero;
    plataformaJogo.textContent = jogo.plataforma;

    precoJogo.textContent =
        `R$ ${jogo.valor.toFixed(2).replace(".", ",")} / dia`;

    carregarDetalhesAPI();

    atualizarStatus();

    botaoAlugar.addEventListener("click", alugarJogo);
}
