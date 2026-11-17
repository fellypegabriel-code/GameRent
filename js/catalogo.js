
let jogos = [];

const API_KEY = "2ef7d5946ba74cf5b824a58f80b9aa6f";
const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=20`;

const listaJogos = document.querySelector("#listaJogos");
const pesquisa = document.querySelector("#pesquisa");
const filtroGenero = document.querySelector("#filtroGenero");
const filtroPlataforma = document.querySelector("#filtroPlataforma");
const mensagemCatalogo = document.querySelector("#mensagemCatalogo");


function traduzirGenero(genero) {
    const traducoes = {
        Action: "Ação",
        Adventure: "Aventura",
        Sports: "Esporte",
        Racing: "Corrida"
    };

    return traducoes[genero] || genero;
}


async function carregarJogos() {
    mensagemCatalogo.textContent = "Carregando jogos...";

    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Erro ao consultar a API");
        }

        const dados = await resposta.json();

        jogos = dados.results.map(jogo => {
            const generos = jogo.genres?.map(item =>
                traduzirGenero(item.name)
            ) || [];

            const plataformas = jogo.platforms?.map(item =>
                item.platform.name
            ) || [];

            return {
                id: jogo.id,
                nome: jogo.name,
                generos: generos,
                plataformas: plataformas,
                genero: generos.join(", ") || "Não informado",
                plataforma: plataformas.join(", ") || "Não informado",
                valor: 9.90,
                capa: jogo.background_image ||
                    "https://placehold.co/400x250"
            };
        });

        mostrarJogos(jogos);

    } catch (erro) {
        console.error("Erro ao carregar jogos:", erro);
        mensagemCatalogo.textContent =
            "Não foi possível carregar os jogos. Tente novamente.";
    }
}


function obterAlugueis() {
    try {
        return JSON.parse(localStorage.getItem("alugueis")) || [];
    } catch (erro) {
        console.error("Erro ao ler os aluguéis:", erro);
        return [];
    }
}


function jogoEstaAlugado(id) {
    const alugueis = obterAlugueis();

    return alugueis.some(aluguel =>
        aluguel.jogoId === id &&
        new Date(aluguel.dataExpiracao) > new Date()
    );
}


function mostrarJogos(lista) {
    listaJogos.innerHTML = "";

    if (lista.length === 0) {
        mensagemCatalogo.textContent = "Nenhum jogo encontrado.";
        return;
    }

    mensagemCatalogo.textContent =
        `${lista.length} jogo(s) encontrado(s).`;

    lista.forEach(jogo => {
        const alugado = jogoEstaAlugado(jogo.id);

        const card = document.createElement("article");
        card.classList.add("card-jogo");

        const imagem = document.createElement("img");
        imagem.src = jogo.capa;
        imagem.alt = `Capa de ${jogo.nome}`;

        const informacoes = document.createElement("div");
        informacoes.classList.add("informacoes-jogo");

        const titulo = document.createElement("h3");
        titulo.textContent = jogo.nome;

        const genero = document.createElement("p");
        genero.textContent = `Gênero: ${jogo.genero}`;

        const plataforma = document.createElement("p");
        plataforma.textContent = `Plataforma: ${jogo.plataforma}`;

        const preco = document.createElement("p");
        preco.classList.add("preco-jogo");
        preco.textContent =
            `R$ ${jogo.valor.toFixed(2).replace(".", ",")} / dia`;

        const status = document.createElement("span");
        status.classList.add(
            alugado ? "status-alugado" : "status-disponivel"
        );
        status.textContent = alugado ? "Alugado" : "Disponível";

        const botaoAlugar = document.createElement("button");
        botaoAlugar.classList.add("botao-alugar");
        botaoAlugar.dataset.id = jogo.id;
        botaoAlugar.disabled = alugado;
        botaoAlugar.textContent =
            alugado ? "Indisponível" : "Alugar jogo";

        const botaoDetalhes = document.createElement("button");
        botaoDetalhes.classList.add("botao-detalhes");
        botaoDetalhes.dataset.id = jogo.id;
        botaoDetalhes.textContent = "Ver detalhes";

        informacoes.append(
            titulo,
            genero,
            plataforma,
            preco,
            status,
            botaoAlugar,
            botaoDetalhes
        );

        card.append(imagem, informacoes);
        listaJogos.appendChild(card);
    });
}


function filtrarJogos() {
    const texto = pesquisa.value.toLowerCase().trim();
    const genero = filtroGenero.value;
    const plataforma = filtroPlataforma.value;

    const resultado = jogos.filter(jogo => {
        const nomeCombina =
            jogo.nome.toLowerCase().includes(texto);

        const generoCombina =
            genero === "" || jogo.generos.includes(genero);

        const plataformaCombina =
            plataforma === "" ||
            jogo.plataformas.some(item =>
                item.toLowerCase().includes(plataforma.toLowerCase())
            );

        return nomeCombina && generoCombina && plataformaCombina;
    });

    mostrarJogos(resultado);
}


function formatarDataLocal(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}


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
        localStorage.setItem("alugueis", JSON.stringify(alugueis));

        alert("Jogo alugado com sucesso! Prazo de 7 dias.");
        filtrarJogos();

    } catch (erro) {
        console.error("Erro ao salvar aluguel:", erro);
        alert("Não foi possível salvar o aluguel.");
    }
}


pesquisa.addEventListener("input", filtrarJogos);
filtroGenero.addEventListener("change", filtrarJogos);
filtroPlataforma.addEventListener("change", filtrarJogos);


listaJogos.addEventListener("click", function(event) {
    const botao = event.target.closest("button");

    if (!botao) {
        return;
    }

    const id = Number(botao.dataset.id);

    if (botao.classList.contains("botao-alugar")) {
        alugarJogo(id);
    }

    if (botao.classList.contains("botao-detalhes")) {
        const jogoSelecionado = jogos.find(jogo => jogo.id === id);

        if (!jogoSelecionado) {
            return;
        }

        localStorage.setItem(
            "jogoSelecionado",
            JSON.stringify(jogoSelecionado)
        );

        window.location.href = "detalhes-jogo.html";
    }
});


carregarJogos();
