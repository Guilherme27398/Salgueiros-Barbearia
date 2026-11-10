/* Página de produtos: pesquisa, filtro por categoria e ordenação. */

const ORDENACOES = {
  "nome-asc": (a, b) => a.nome.localeCompare(b.nome, "pt"),
  "nome-desc": (a, b) => b.nome.localeCompare(a.nome, "pt"),
  "preco-asc": (a, b) => a.preco - b.preco,
  "preco-desc": (a, b) => b.preco - a.preco,
};

// Ignora maiúsculas e acentos, para "oleo" encontrar "Óleo".
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function iniciarProdutos() {
  const formulario = document.getElementById("produtos-filtros");
  const pesquisa = document.getElementById("pesquisa");
  const categorias = document.getElementById("categorias");
  const ordem = document.getElementById("ordem");
  const grelha = document.getElementById("produtos-grelha");
  const contagem = document.getElementById("produtos-contagem");
  const vazio = document.getElementById("produtos-vazio");
  const estado = { pesquisa: "", categoria: "Todos", ordem: ordem.value };

  categorias.innerHTML = ["Todos", ...CATEGORIAS]
    .map((nome) => `<button class="chip" type="button" data-categoria="${nome}" aria-pressed="${nome === "Todos"}">${nome}</button>`)
    .join("");

  function renderizar() {
    const termo = normalizar(estado.pesquisa.trim());
    const lista = PRODUTOS.filter(
      (produto) =>
        (estado.categoria === "Todos" || produto.categoria === estado.categoria) &&
        normalizar(`${produto.nome} ${produto.categoria}`).includes(termo)
    ).sort(ORDENACOES[estado.ordem]);

    grelha.innerHTML = lista
      .map((produto, indice) => `<li style="--i: ${Math.min(indice, 8)}">${produtoCardHTML(produto, { titulo: "h2", mostrarDestaque: true })}</li>`)
      .join("");
    contagem.textContent = lista.length === 1 ? "1 produto" : `${lista.length} produtos`;
    vazio.hidden = lista.length > 0;
  }

  pesquisa.addEventListener("input", () => {
    estado.pesquisa = pesquisa.value;
    renderizar();
  });

  categorias.addEventListener("click", (evento) => {
    const chip = evento.target.closest(".chip");
    if (!chip) return;
    estado.categoria = chip.dataset.categoria;
    categorias.querySelectorAll(".chip").forEach((el) => el.setAttribute("aria-pressed", String(el === chip)));
    renderizar();
  });

  ordem.addEventListener("change", () => {
    estado.ordem = ordem.value;
    renderizar();
  });

  formulario.addEventListener("submit", (evento) => evento.preventDefault());

  vazio.querySelector("[data-limpar]").addEventListener("click", () => {
    pesquisa.value = "";
    estado.pesquisa = "";
    categorias.querySelector('[data-categoria="Todos"]').click();
  });

  renderizar();
}

iniciarProdutos();
