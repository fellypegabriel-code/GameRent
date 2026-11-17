
const CHAVE_ALUGUEIS = "alugueis";

const pesquisaJogo = document.getElementById("pesquisaJogo");
const filtroStatus = document.getElementById("filtroStatus");
const listaAlugueis = document.getElementById("listaAlugueis");
const mensagem = document.getElementById("mensagem");


function carregarAlugueis() {
    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE_ALUGUEIS)) || [];
        return Array.isArray(dados) ? dados : [];
    } catch (erro) {
        console.error("Erro ao carregar aluguéis:", erro);
        return [];
    }
}


function salvarAlugueis(alugueis) {
    try {
        localStorage.setItem(CHAVE_ALUGUEIS, JSON.stringify(alugueis));
        return true;
    } catch (erro) {
        console.error("Erro ao salvar aluguéis:", erro);
        mensagem.textContent = "Não foi possível salvar os dados.";
        return false;
    }
}


function obterStatus(aluguel) {
    if (aluguel.status === "Cancelado") {
        return "cancelado";
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const vencimento = new Date(
        aluguel.dataVencimento + "T00:00:00"
    );

    return vencimento >= hoje ? "ativo" : "vencido";
}


function formatarData(data) {
    if (!data) return "Não informada";

    const partes = data.split("-");
    if (partes.length !== 3) return "Data inválida";

    return new Date(
        Number(partes[0]),
        Number(partes[1]) - 1,
        Number(partes[2])
    ).toLocaleDateString("pt-BR");
}


function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}


function renderizarAlugueis() {
    const alugueis = carregarAlugueis();

    const pesquisa = pesquisaJogo.value.toLowerCase().trim();
    const statusSelecionado = filtroStatus.value;

    const filtrados = alugueis.filter(aluguel => {
        const nome = String(aluguel.jogo || "").toLowerCase();
        const plataforma = String(aluguel.plataforma || "").toLowerCase();
        const status = obterStatus(aluguel);

        const correspondePesquisa =
            nome.includes(pesquisa) ||
            plataforma.includes(pesquisa);

        const correspondeStatus =
            statusSelecionado === "todos" ||
            status === statusSelecionado;

        return correspondePesquisa && correspondeStatus;
    });

    listaAlugueis.innerHTML = "";

    if (filtrados.length === 0) {
        mensagem.textContent = "Nenhum aluguel encontrado.";
        return;
    }

    mensagem.textContent = "";

    filtrados.forEach(aluguel => {
        const status = obterStatus(aluguel);
        const ativo = status === "ativo";

        const artigo = document.createElement("article");
        artigo.className = "card-jogo";

        const imagem = aluguel.capa
            ? `<img src="${escaparHTML(aluguel.capa)}"
                alt="Capa de ${escaparHTML(aluguel.jogo)}">`
            : "";

        artigo.innerHTML = `
            ${imagem}

            <div class="informacoes-jogo">
                <h3>${escaparHTML(aluguel.jogo)}</h3>

                <p>
                    Plataforma: ${escaparHTML(aluguel.plataforma)}
                </p>

                <p>
                    Início: ${formatarData(aluguel.dataInicio)}
                </p>

                <p>
                    Vencimento: ${formatarData(aluguel.dataVencimento)}
                </p>

                <span class="${
                    status === "ativo"
                        ? "status-disponivel"
                        : status === "cancelado"
                            ? "status-alugado"
                            : "status-alugado"
                }">
                    ${
                        status === "ativo"
                            ? "Aluguel ativo"
                            : status === "cancelado"
                                ? "Aluguel cancelado"
                                : "Aluguel vencido"
                    }
                </span>

                ${
                    ativo
                        ? `<button class="botao-renovar"
                            data-renovar="${escaparHTML(aluguel.id)}">
                            Renovar por 7 dias
                        </button>`
                        : ""
                }
            </div>
        `;

        listaAlugueis.appendChild(artigo);
    });
}


pesquisaJogo.addEventListener("input", renderizarAlugueis);
filtroStatus.addEventListener("change", renderizarAlugueis);


listaAlugueis.addEventListener("click", event => {
    const botao = event.target.closest("[data-renovar]");

    if (!botao) return;

    const id = botao.dataset.renovar;
    const alugueis = carregarAlugueis();

    const aluguel = alugueis.find(
        item => String(item.id) === id
    );

    if (!aluguel || obterStatus(aluguel) !== "ativo") {
        return;
    }

    const vencimento = new Date(
        aluguel.dataVencimento + "T00:00:00"
    );

    vencimento.setDate(vencimento.getDate() + 7);

    const ano = vencimento.getFullYear();
    const mes = String(vencimento.getMonth() + 1).padStart(2, "0");
    const dia = String(vencimento.getDate()).padStart(2, "0");

    aluguel.dataVencimento = `${ano}-${mes}-${dia}`;

    
    const dataExpiracao = new Date(vencimento);
    dataExpiracao.setHours(23, 59, 59, 999);
    aluguel.dataExpiracao = dataExpiracao.toISOString();

    if (salvarAlugueis(alugueis)) {
        renderizarAlugueis();
        mensagem.textContent = "Aluguel renovado com sucesso!";
    }
});


renderizarAlugueis();
