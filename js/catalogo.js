let jogos = [];

const API_KEY = "2ef7d5946ba74cf5b824a58f80b9aa6f";
const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=20`;

async function carregarJogos() {
    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Erro ao consultar a API");
        }

        const dados = await resposta.json();

        jogos = dados.results.map(jogo => ({
            id: jogo.id,
            nome: jogo.name,
            genero: jogo.genres?.[0]?.name || "Não informado",
            plataforma: jogo.platforms?.[0]?.platform?.name || "Não informado",
            valor: 9.90,
            capa: jogo.background_image || "https://placehold.co/400x250"
        }));

        mostrarJogos(jogos);

    } catch (erro) {
        console.error("Erro ao carregar jogos:", erro);
        mensagemCatalogo.textContent = "Não foi possível carregar os jogos.";
    }
}

const listaJogos = document.querySelector("#listaJogos");
const pesquisa = document.querySelector("#pesquisa");
const filtroGenero = document.querySelector("#filtroGenero");
const filtroPlataforma = document.querySelector("#filtroPlataforma");
const mensagemCatalogo = document.querySelector("#mensagemCatalogo");

// Recupera os aluguéis salvos
function obterAlugueis() {
    return JSON.parse(localStorage.getItem("alugueis")) || [];
}

// Verifica se o jogo está alugado
function jogoEstaAlugado(id) {
    const alugueis = obterAlugueis();

    return alugueis.some(aluguel =>
        aluguel.jogoId === id &&
        new Date(aluguel.dataExpiracao) > new Date()
    );
}

// Monta os cards
function mostrarJogos(lista) {
    listaJogos.innerHTML = "";

    if (lista.length === 0) {
        mensagemCatalogo.textContent = "Nenhum jogo encontrado.";
        return;
    }
mensagemCatalogo.textContent = `${lista.length} jogo(s) encontrado(s).`;

    lista.forEach(jogo => {
        const alugado = jogoEstaAlugado(jogo.id);

        const card = document.createElement("article");
        card.classList.add("card-jogo");

        card.innerHTML = `
            <img src="${jogo.capa}" alt="Capa de ${jogo.nome}">

            <div class="informacoes-jogo">
                <h3>${jogo.nome}</h3>

                <p>Gênero: ${jogo.genero}</p>
                <p>Plataforma: ${jogo.plataforma}</p>

                <p class="preco-jogo">
                    R$ ${jogo.valor.toFixed(2).replace(".", ",")} / dia
                </p>

                <span class="${alugado ? "status-alugado" : "status-disponivel"}">
                    ${alugado ? "Alugado" : "Disponível"}
                </span>

                <button
                    class="botao-alugar"
                    data-id="${jogo.id}"
                    ${alugado ? "disabled" : ""}
                >
                    ${alugado ? "Indisponível" : "Alugar jogo"}
                </button>

                 <button
                    class="botao-detalhes"
                    data-id="${jogo.id}"
                >
                    Ver detalhes
                </button>

            </div>
        `;

        listaJogos.appendChild(card);
    });
}

// Pesquisa e filtros
function filtrarJogos() {
    const texto = pesquisa.value.toLowerCase();
    const genero = filtroGenero.value;
    const plataforma = filtroPlataforma.value;

    const resultado = jogos.filter(jogo => {
        return (
            jogo.nome.toLowerCase().includes(texto) &&
            (genero === "" || jogo.genero === genero) &&
            (plataforma === "" || jogo.plataforma === plataforma)
        );
    });

    mostrarJogos(resultado);
}

// Registra o aluguel por 7 dias
function alugarJogo(id) {
    const alugueis = obterAlugueis();

    if (jogoEstaAlugado(id)) {
        alert("Este jogo já está alugado!");
        return;
    }

    const jogo = jogos.find(item => item.id === id);

    if (!jogo) {
        alert("Jogo não encontrado!");
        return;
    }

    const dataAluguel = new Date();
    const dataExpiracao = new Date(dataAluguel);

    dataExpiracao.setDate(dataExpiracao.getDate() + 7);

    // Formata a data no horário local
    function formatarDataLocal(data) {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const dia = String(data.getDate()).padStart(2, "0");

        return `${ano}-${mes}-${dia}`;
    }

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

    localStorage.setItem("alugueis", JSON.stringify(alugueis));

    alert("Jogo alugado com sucesso! Prazo de 7 dias.");

    filtrarJogos();
}
// Eventos
pesquisa.addEventListener("input", filtrarJogos);
filtroGenero.addEventListener("change", filtrarJogos);
filtroPlataforma.addEventListener("change", filtrarJogos);

listaJogos.addEventListener("click", function(event) {

    if (event.target.classList.contains("botao-alugar")) {
        const id = Number(event.target.dataset.id);
        alugarJogo(id);
    }

    if (event.target.classList.contains("botao-detalhes")) {
        const id = Number(event.target.dataset.id);

        const jogoSelecionado = jogos.find(jogo => jogo.id === id);

        localStorage.setItem(
            "jogoSelecionado",
            JSON.stringify(jogoSelecionado)
        );

        window.location.href = "detalhes-jogo.html";
    }

});

// Inicializa o catálogo
carregarJogos();