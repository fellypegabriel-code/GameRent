
// Recupera o jogo selecionado no catálogo
const jogoSalvo = localStorage.getItem("jogoSelecionado");
const API_KEY = "2ef7d5946ba74cf5b824a58f80b9aa6f";

const dataLancamento = document.querySelector("#dataLancamento");
const avaliacaoJogo = document.querySelector("#avaliacaoJogo");
const desenvolvedoraJogo = document.querySelector("#desenvolvedoraJogo");

// Elementos da página
const imagemJogo = document.querySelector("#imagemJogo");
const nomeJogo = document.querySelector("#nomeJogo");
const generoJogo = document.querySelector("#generoJogo");
const plataformaJogo = document.querySelector("#plataformaJogo");
const descricaoJogo = document.querySelector("#descricaoJogo");
const precoJogo = document.querySelector("#precoJogo");
const statusJogo = document.querySelector("#statusJogo");
const botaoAlugar = document.querySelector("#botaoAlugar");
const mensagemAluguel = document.querySelector("#mensagemAluguel");

// Verifica se existe um jogo selecionado
if (jogoSalvo === null) {
    document.querySelector(".detalhes-container").innerHTML = `
        <h2>Nenhum jogo selecionado!</h2>
        <a href="catalogo.html">Voltar ao catálogo</a>
    `;
} else {
    const jogo = JSON.parse(jogoSalvo);
    async function carregarDetalhesAPI() {
    try {
        const resposta = await fetch(
            `https://api.rawg.io/api/games/${jogo.id}?key=${API_KEY}`
        );

        if (!resposta.ok) {
            throw new Error("Erro ao buscar detalhes do jogo");
        }

        const dados = await resposta.json();

        descricaoJogo.textContent =
    dados.description_raw || "Descrição não disponível.";

    
        if (dataLancamento) {
            dataLancamento.textContent =
                dados.released || "Não informada";
        }

        if (avaliacaoJogo) {
            avaliacaoJogo.textContent =
                dados.rating ? `${dados.rating}/5` : "Não disponível";
        }

        if (desenvolvedoraJogo) {
            desenvolvedoraJogo.textContent =
                dados.developers?.map(dev => dev.name).join(", ")
                || "Não informada";
        }

    } catch (erro) {
        console.error("Erro:", erro);
        descricaoJogo.textContent =
            "Não foi possível carregar a descrição.";
    }
}

carregarDetalhesAPI();

    // Preenche as informações do jogo
    imagemJogo.src = jogo.capa;
    imagemJogo.alt = `Capa de ${jogo.nome}`;

    nomeJogo.textContent = jogo.nome;
    generoJogo.textContent = jogo.genero;
    plataformaJogo.textContent = jogo.plataforma;


    precoJogo.textContent =
        `R$ ${jogo.valor.toFixed(2).replace(".", ",")} / dia`;

    // Verifica disponibilidade
    function jogoEstaAlugado() {
        const alugueis =
            JSON.parse(localStorage.getItem("alugueis")) || [];

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

    // Realiza o aluguel
    botaoAlugar.addEventListener("click", function() {
        if (jogoEstaAlugado()) {
            mensagemAluguel.textContent =
                "Este jogo já está alugado!";
            return;
        }

        const alugueis =
            JSON.parse(localStorage.getItem("alugueis")) || [];

        const dataAluguel = new Date();
        const dataExpiracao = new Date(dataAluguel);

        dataExpiracao.setDate(dataExpiracao.getDate() + 7);

        alugueis.push({
            id: Date.now(),
            jogoId: jogo.id,
            dataAluguel: dataAluguel.toISOString(),
            dataExpiracao: dataExpiracao.toISOString(),
            status: "Ativo"
        });

        localStorage.setItem(
            "alugueis",
            JSON.stringify(alugueis)
        );

        mensagemAluguel.textContent =
            "Aluguel realizado com sucesso! Prazo de 7 dias.";

        atualizarStatus();
    });

    atualizarStatus();
}
