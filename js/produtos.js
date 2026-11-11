/* Página de produtos: pesquisa e filtros (categoria e subcategoria, preço, ordenação e disponibilidade). */

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
    .replace(/[\u0300-\u036f]/g, "");
}

function iniciarProdutos() {
  const pesquisa = document.getElementById("pesquisa");
  const caixa = document.getElementById("filtros");
  const formulario = document.getElementById("produtos-filtros");
  const categorias = document.getElementById("categorias");
  const intervalo = document.getElementById("preco-intervalo");
  const barraMin = document.getElementById("preco-min-barra");
  const barraMax = document.getElementById("preco-max-barra");
  const campoMin = document.getElementById("preco-min");
  const campoMax = document.getElementById("preco-max");
  const soStock = document.getElementById("so-stock");
  const soDestaques = document.getElementById("so-destaques");
  const ativos = document.getElementById("filtros-ativos");
  const grelha = document.getElementById("produtos-grelha");
  const contagem = document.getElementById("produtos-contagem");
  const vazio = document.getElementById("produtos-vazio");

  // Os limites do preço vêm dos produtos que existem, arredondados ao euro.
  const precos = PRODUTOS.map((produto) => produto.preco);
  const LIMITE_MIN = precos.length ? Math.floor(Math.min(...precos)) : 0;
  const LIMITE_MAX = precos.length ? Math.ceil(Math.max(...precos)) : 1;

  const INICIAL = { pesquisa: "", categoria: "Todos", subcategoria: "", ordem: "nome-asc", precoMin: LIMITE_MIN, precoMax: LIMITE_MAX, soStock: false, soDestaques: false };
  const estado = { ...INICIAL };

  /* ===== CATEGORIAS E SUBCATEGORIAS ===== */
  function botaoCategoria(texto, categoria, subcategoria = "") {
    const total = PRODUTOS.filter(
      (produto) => (categoria === "Todos" || produto.categoria === categoria) && (!subcategoria || produto.subcategoria === subcategoria)
    ).length;
    return `<button class="filtros__categoria${subcategoria ? " filtros__categoria--sub" : ""}" type="button" data-categoria="${categoria}" data-subcategoria="${subcategoria}" aria-pressed="false">${texto}<span>${total}</span></button>`;
  }

  // Botão "+" / "−" que abre e fecha a lista indicada (o sinal é desenhado no CSS, conforme aria-expanded).
  function botaoExpandir(lista, nome, aberto) {
    return `<button class="filtros__expandir" type="button" aria-expanded="${aberto}" aria-controls="${lista}" aria-label="Abrir ou fechar ${nome}"></button>`;
  }

  // "Todos" abre e fecha a lista de categorias; cada categoria abre e fecha as suas subcategorias.
  categorias.innerHTML = `
    <li>
      <div class="filtros__linha">${botaoCategoria("Todos", "Todos")}${botaoExpandir("lista-categorias", "as categorias", true)}</div>
      <ul id="lista-categorias">
        ${CATEGORIAS.map((categoria, indice) => {
          const subcategorias = SUBCATEGORIAS[categoria] || [];
          if (!subcategorias.length) return `<li><div class="filtros__linha">${botaoCategoria(categoria, categoria)}</div></li>`;
          return `
          <li>
            <div class="filtros__linha">${botaoCategoria(categoria, categoria)}${botaoExpandir(`lista-sub-${indice}`, `as subcategorias de ${categoria}`, false)}</div>
            <ul id="lista-sub-${indice}" hidden>
              ${subcategorias.map((sub) => `<li>${botaoCategoria(sub, categoria, sub)}</li>`).join("")}
            </ul>
          </li>`;
        }).join("")}
      </ul>
    </li>`;

  function expandir(botao, abrir) {
    botao.setAttribute("aria-expanded", String(abrir));
    document.getElementById(botao.getAttribute("aria-controls")).hidden = !abrir;
  }

  /* ===== PREÇO ===== */
  [barraMin, barraMax, campoMin, campoMax].forEach((el) => {
    el.min = LIMITE_MIN;
    el.max = LIMITE_MAX;
  });

  // Mantém o mínimo abaixo do máximo e dentro dos limites; "mexido" diz qual dos dois o cliente alterou.
  function definirPreco(minimo, maximo, mexido) {
    const limitar = (valor, reserva) => (Number.isFinite(valor) ? Math.min(LIMITE_MAX, Math.max(LIMITE_MIN, valor)) : reserva);
    minimo = limitar(minimo, LIMITE_MIN);
    maximo = limitar(maximo, LIMITE_MAX);
    if (minimo > maximo) {
      if (mexido === "min") minimo = maximo;
      else maximo = minimo;
    }
    estado.precoMin = minimo;
    estado.precoMax = maximo;
  }

  /* ===== O QUE SE VÊ ===== */
  function atualizarControlos() {
    pesquisa.value = estado.pesquisa;
    categorias.querySelectorAll(".filtros__categoria").forEach((botao) => {
      botao.setAttribute("aria-pressed", String(botao.dataset.categoria === estado.categoria && botao.dataset.subcategoria === estado.subcategoria));
    });

    barraMin.value = estado.precoMin;
    barraMax.value = estado.precoMax;
    // Um campo de preço que o cliente está a escrever não é reescrito a meio.
    if (document.activeElement !== campoMin) campoMin.value = estado.precoMin;
    if (document.activeElement !== campoMax) campoMax.value = estado.precoMax;
    const amplitude = LIMITE_MAX - LIMITE_MIN || 1;
    intervalo.style.setProperty("--de", `${((estado.precoMin - LIMITE_MIN) / amplitude) * 100}%`);
    intervalo.style.setProperty("--ate", `${((estado.precoMax - LIMITE_MIN) / amplitude) * 100}%`);
    // Com os dois cursores encostados à direita, o do mínimo tem de ficar por cima para se poder arrastar.
    barraMin.style.zIndex = estado.precoMin >= LIMITE_MAX ? 2 : "";

    formulario.querySelector(`[name="ordem"][value="${estado.ordem}"]`).checked = true;
    soStock.checked = estado.soStock;
    soDestaques.checked = estado.soDestaques;

    const total =
      (estado.categoria !== "Todos") + (estado.precoMin > LIMITE_MIN || estado.precoMax < LIMITE_MAX) + estado.soStock + estado.soDestaques;
    ativos.textContent = total ? `(${total})` : "";
  }

  function renderizar() {
    const termo = normalizar(estado.pesquisa.trim());
    const lista = PRODUTOS.filter(
      (produto) =>
        (estado.categoria === "Todos" || produto.categoria === estado.categoria) &&
        (!estado.subcategoria || produto.subcategoria === estado.subcategoria) &&
        produto.preco >= estado.precoMin &&
        produto.preco <= estado.precoMax &&
        (!estado.soStock || produto.stock > 0) &&
        (!estado.soDestaques || produto.destaque) &&
        normalizar(`${produto.nome} ${produto.categoria} ${produto.subcategoria || ""}`).includes(termo)
    ).sort(ORDENACOES[estado.ordem]);

    grelha.innerHTML = lista
      .map((produto, indice) => `<li style="--i: ${Math.min(indice, 8)}">${produtoCardHTML(produto, { titulo: "h2", mostrarDestaque: true })}</li>`)
      .join("");
    contagem.textContent = lista.length === 1 ? "1 produto" : `${lista.length} produtos`;
    vazio.hidden = lista.length > 0;
    atualizarControlos();
  }

  /* ===== EVENTOS ===== */
  pesquisa.addEventListener("input", () => {
    estado.pesquisa = pesquisa.value;
    renderizar();
  });
  document.getElementById("produtos-pesquisa").addEventListener("submit", (evento) => evento.preventDefault());
  formulario.addEventListener("submit", (evento) => evento.preventDefault());

  categorias.addEventListener("click", (evento) => {
    const sinal = evento.target.closest(".filtros__expandir");
    if (sinal) return expandir(sinal, sinal.getAttribute("aria-expanded") !== "true");

    const botao = evento.target.closest(".filtros__categoria");
    if (!botao) return;
    // Escolher uma categoria mostra logo as subcategorias dela.
    const sinalDaLinha = botao.parentElement.querySelector(".filtros__expandir");
    if (sinalDaLinha && botao.dataset.categoria !== "Todos") expandir(sinalDaLinha, true);
    estado.categoria = botao.dataset.categoria;
    estado.subcategoria = botao.dataset.subcategoria;
    renderizar();
  });

  barraMin.addEventListener("input", () => {
    definirPreco(Number(barraMin.value), estado.precoMax, "min");
    renderizar();
  });
  barraMax.addEventListener("input", () => {
    definirPreco(estado.precoMin, Number(barraMax.value), "max");
    renderizar();
  });
  campoMin.addEventListener("input", () => {
    definirPreco(campoMin.value === "" ? NaN : Number(campoMin.value), estado.precoMax, "min");
    renderizar();
  });
  campoMax.addEventListener("input", () => {
    definirPreco(estado.precoMin, campoMax.value === "" ? NaN : Number(campoMax.value), "max");
    renderizar();
  });
  // Ao sair do campo, mostra o valor que ficou mesmo a contar (ex.: depois de escrever fora dos limites).
  [campoMin, campoMax].forEach((campo) => campo.addEventListener("blur", atualizarControlos));

  formulario.addEventListener("change", (evento) => {
    if (evento.target.name === "ordem") estado.ordem = evento.target.value;
    else if (evento.target === soStock) estado.soStock = soStock.checked;
    else if (evento.target === soDestaques) estado.soDestaques = soDestaques.checked;
    else return;
    renderizar();
  });

  document.querySelectorAll("[data-limpar]").forEach((botao) =>
    botao.addEventListener("click", () => {
      Object.assign(estado, INICIAL);
      renderizar();
    })
  );

  // Em ecrãs largos os filtros estão sempre à vista; nos estreitos abrem e fecham no botão "Filtros".
  const ecraLargo = window.matchMedia("(min-width: 1024px)");
  const ajustarCaixa = () => (caixa.open = ecraLargo.matches);
  ecraLargo.addEventListener("change", ajustarCaixa);
  ajustarCaixa();

  renderizar();
}

iniciarProdutos();
