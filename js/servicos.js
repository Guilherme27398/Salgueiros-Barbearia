/*
 * Serviços: o destaque (assinatura), a grelha de cartões e a janela com o detalhe de cada serviço.
 * Usado na home (só os serviços com "home: true") e em servicos.html (todos).
 */

// O nome é um botão que cobre o cartão todo e abre o detalhe do serviço.
function botaoAbrir(servico) {
  return `<button class="servico-abrir" type="button" data-servico="${SERVICOS.indexOf(servico)}">${servico.nome}</button>`;
}

function renderizarServicos() {
  const assinatura = SERVICOS.find((servico) => servico.assinatura);
  const restantes = SERVICOS.filter((servico) => !servico.assinatura && (!NA_HOME || servico.home));
  const destaque = document.getElementById("servico-assinatura");
  const lista = document.getElementById("servicos-lista");
  // Na home os cartões ficam por baixo de um h2; em servicos.html, por baixo do h1.
  const titulo = NA_HOME ? "h3" : "h2";

  // O administrador pode eliminar o serviço em destaque; nesse caso ficam só os cartões.
  destaque.hidden = !assinatura;
  if (assinatura) destaque.innerHTML = `
    <div class="media media--4x3 assinatura__media">
      ${mediaConteudo(assinatura.imagem, assinatura.nome, "Fotografia do serviço em destaque · 4:3")}
    </div>
    <div class="assinatura__corpo">
      <span class="badge">Tudo incluído</span>
      <${titulo} class="assinatura__nome">${botaoAbrir(assinatura)}</${titulo}>
      <p class="assinatura__descricao">${assinatura.descricao}</p>
      <ul class="assinatura__inclui">
        ${(assinatura.inclui || []).map((item) => `<li>${icone("check")}${item}</li>`).join("")}
      </ul>
      <p class="assinatura__meta">${formatarDuracao(assinatura.duracao)} <span aria-hidden="true">·</span> <strong>${formatarPreco(assinatura.preco, false)}</strong></p>
      <a class="btn btn--primario" data-link="marcacoes" href="#">Marcar o ${assinatura.nome}</a>
    </div>`;

  lista.innerHTML = restantes
    .map(
      (servico) => `
      <li class="servico-card">
        ${servico.imagem ? `<div class="media media--16x9 servico-card__media"><img src="${servico.imagem}" alt="" loading="lazy"></div>` : ""}
        <${titulo} class="servico-card__nome">${botaoAbrir(servico)}</${titulo}>
        <p class="servico-card__descricao">${servico.descricao}</p>
        <div class="servico-card__rodape">
          <p class="servico-card__meta">${formatarDuracao(servico.duracao)} <span aria-hidden="true">·</span> <strong>${formatarPreco(servico.preco, false)}</strong></p>
          <a class="btn btn--texto" data-link="marcacoes" href="#" aria-label="Marcar ${servico.nome}">Marcar ${icone("seta-direita")}</a>
        </div>
      </li>`
    )
    .join("");

  aplicarLigacoes(destaque);
  aplicarLigacoes(lista);
}

/* ===== DETALHE DO SERVIÇO ===== */
// Janela com fotografia de exemplo, nome, tempo, preço, descrição e botão para marcar.
// Usa os estilos da janela de detalhe do produto (.produto-detalhe, em components.css).
function iniciarDetalheServico() {
  document.body.insertAdjacentHTML(
    "beforeend",
    `<dialog class="produto-detalhe" id="servico-detalhe" aria-labelledby="servico-detalhe-nome">
      <div class="produto-detalhe__interior" id="servico-detalhe-interior"></div>
    </dialog>`
  );
  const janela = document.getElementById("servico-detalhe");
  const interior = document.getElementById("servico-detalhe-interior");

  document.addEventListener("click", (evento) => {
    const origem = evento.target.closest("[data-servico]");
    if (!origem) return;
    const servico = SERVICOS[Number(origem.dataset.servico)];
    interior.innerHTML = `
      <button class="navbar__icone produto-detalhe__fechar" type="button" data-fechar aria-label="Fechar">${icone("fechar")}</button>
      <div class="media media--4x3">${mediaConteudo(servico.imagem, servico.nome, "Fotografia de exemplo · 4:3", "eager")}</div>
      <div class="produto-detalhe__corpo">
        <p class="produto-card__marca">Serviço</p>
        <h2 class="produto-detalhe__nome" id="servico-detalhe-nome">${servico.nome}</h2>
        <p class="produto-detalhe__preco">${formatarPreco(servico.preco, false)} <span class="servico-detalhe__duracao">· ${formatarDuracao(servico.duracao)}</span></p>
        <p class="produto-detalhe__descricao">${servico.descricao}</p>
        ${
          servico.inclui
            ? `<ul class="assinatura__inclui">${servico.inclui.map((item) => `<li>${icone("check")}${item}</li>`).join("")}</ul>`
            : ""
        }
        <a class="btn btn--primario produto-detalhe__adicionar" data-link="marcacoes" href="#">Marcar</a>
      </div>`;
    aplicarLigacoes(interior);
    janela.showModal();
  });

  // Fecha com clique fora da janela ou no botão de fecho (e com Esc, que o dialog já trata).
  janela.addEventListener("click", (evento) => {
    if (evento.target === janela || evento.target.closest("[data-fechar]")) janela.close();
  });
}

renderizarServicos();
iniciarDetalheServico();
