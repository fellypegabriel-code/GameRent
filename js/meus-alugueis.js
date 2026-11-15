
const CHAVE_ALUGUEIS = "alugueis";

const pesquisaJogo = document.getElementById("pesquisaJogo");
const filtroStatus = document.getElementById("filtroStatus");
const listaAlugueis = document.getElementById("listaAlugueis");
const mensagem = document.getElementById("mensagem");

function carregarAlugueis() {
    return JSON.parse(localStorage.getItem(CHAVE_ALUGUEIS)) || [];
}

function salvarAlugueis(alugueis) {
    localStorage.setItem(CHAVE_ALUGUEIS, JSON.stringify(alugueis));
}

function obterStatus(aluguel) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const vencimento = new Date(aluguel.dataVencimento + "T00:00:00");

    return vencimento >= hoje ? "ativo" : "vencido";
}

function formatarData(data) {
    if (!data) return "Não informada";

    return new Date(data + "T00:00:00").toLocaleDateString("pt-BR");
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
            nome.includes(pesquisa) || plataforma.includes(pesquisa);

        const correspondeStatus =
            statusSelecionado === "todos" ||
            status === statusSelecionado;

        return correspondePesquisa && correspondeStatus;
    });

    listaAlugueis.innerHTML = "";

    if (filtrados.length === 0) {
        mensagem.innerHTML = `
            <p>Nenhum aluguel encontrado.</p>
        `;
        return;
    }

    mensagem.innerHTML = "";

    filtrados.forEach(aluguel => {
        const status = obterStatus(aluguel);
        const ativo = status === "ativo";

        const imagem = aluguel.capa
            ? escaparHTML(aluguel.capa)
            : "";

        listaAlugueis.innerHTML += `
            <article class="card-jogo">

                ${
                    imagem
                        ? `<img src="${imagem}"
                            alt="Capa de ${escaparHTML(aluguel.jogo)}">`
                        : ""
                }

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

                    <span class="${ativo ? "status-disponivel" : "status-alugado"}">
                        ${ativo ? "Aluguel ativo" : "Aluguel vencido"}
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
            </article>
        `;
    });
}

pesquisaJogo.addEventListener("input", renderizarAlugueis);
filtroStatus.addEventListener("change", renderizarAlugueis);

listaAlugueis.addEventListener("click", event => {
    const botao = event.target.closest("[data-renovar]");

    if (!botao) return;

    const id = botao.dataset.renovar;
    const alugueis = carregarAlugueis();

    const aluguel = alugueis.find(item => String(item.id) === id);

    if (!aluguel) return;

    const vencimento = new Date(aluguel.dataVencimento + "T00:00:00");
    vencimento.setDate(vencimento.getDate() + 7);

    const ano = vencimento.getFullYear();
    const mes = String(vencimento.getMonth() + 1).padStart(2, "0");
    const dia = String(vencimento.getDate()).padStart(2, "0");

    aluguel.dataVencimento = `${ano}-${mes}-${dia}`;

    salvarAlugueis(alugueis);
    renderizarAlugueis();

    mensagem.innerHTML = `
        <p class="mensagem-sucesso">
            Aluguel renovado com sucesso!
        </p>
    `;
});

renderizarAlugueis();
