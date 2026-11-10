/* Carrossel de produtos em destaque (escolhidos pelo barbeiro em dados.js). */

function renderizarProdutosDestaque() {
  document.getElementById("produtos-pista").innerHTML = PRODUTOS.filter((produto) => produto.destaque)
    .map((produto) => `<li class="carrossel__item">${produtoCardHTML(produto)}</li>`)
    .join("");
}

function iniciarCarrossel(carrossel) {
  const pista = carrossel.querySelector(".carrossel__pista");
  const anterior = carrossel.querySelector("[data-anterior]");
  const seguinte = carrossel.querySelector("[data-seguinte]");
  const pontos = carrossel.querySelector(".carrossel__pontos");
  const comportamento = MOVIMENTO_REDUZIDO ? "auto" : "smooth";

  const espaco = () => parseFloat(getComputedStyle(pista).columnGap) || 0;
  const passo = () => pista.clientWidth + espaco();
  const fim = () => pista.scrollWidth - pista.clientWidth;
  const totalPaginas = () => Math.max(1, Math.ceil(fim() / passo() - 0.01) + 1);
  const paginaAtual = () => (pista.scrollLeft >= fim() - 2 ? totalPaginas() - 1 : Math.round(pista.scrollLeft / passo()));

  function atualizar() {
    const atual = paginaAtual();
    anterior.disabled = pista.scrollLeft <= 2;
    seguinte.disabled = pista.scrollLeft >= fim() - 2;
    pontos.querySelectorAll("button").forEach((ponto, indice) => {
      ponto.classList.toggle("carrossel__ponto--ativo", indice === atual);
      ponto.setAttribute("aria-current", indice === atual ? "true" : "false");
    });
  }

  function criarPontos() {
    pontos.innerHTML = Array.from(
      { length: totalPaginas() },
      (_, indice) => `<button class="carrossel__ponto" type="button" aria-label="Ir para o grupo ${indice + 1}"></button>`
    ).join("");
    atualizar();
  }

  anterior.addEventListener("click", () => pista.scrollBy({ left: -passo(), behavior: comportamento }));
  seguinte.addEventListener("click", () => pista.scrollBy({ left: passo(), behavior: comportamento }));
  pontos.addEventListener("click", (evento) => {
    const indice = [...pontos.children].indexOf(evento.target.closest("button"));
    if (indice >= 0) pista.scrollTo({ left: indice * passo(), behavior: comportamento });
  });
  pista.addEventListener("scroll", atualizar, { passive: true });
  window.addEventListener("resize", criarPontos);
  criarPontos();
}

renderizarProdutosDestaque();
document.querySelectorAll(".carrossel").forEach(iniciarCarrossel);
