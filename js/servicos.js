/*
 * Serviços: o destaque (assinatura) e a grelha de cartões.
 * Usado na home (só os serviços com "home: true") e em servicos.html (todos).
 */

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
      <${titulo} class="assinatura__nome">${assinatura.nome}</${titulo}>
      <p class="assinatura__descricao">${assinatura.descricao}</p>
      <ul class="assinatura__inclui">
        ${(assinatura.inclui || []).map((item) => `<li>${icone("check")}${item}</li>`).join("")}
      </ul>
      <p class="assinatura__meta">${formatarDuracao(assinatura.duracao)} <span aria-hidden="true">·</span> <strong>${formatarPreco(assinatura.preco)}</strong></p>
      <a class="btn btn--primario" data-link="marcacoes" href="#">Marcar o ${assinatura.nome}</a>
    </div>`;

  lista.innerHTML = restantes
    .map(
      (servico) => `
      <li class="servico-card">
        ${servico.imagem ? `<div class="media media--16x9 servico-card__media"><img src="${servico.imagem}" alt="" loading="lazy"></div>` : ""}
        <${titulo} class="servico-card__nome">${servico.nome}</${titulo}>
        <p class="servico-card__descricao">${servico.descricao}</p>
        <div class="servico-card__rodape">
          <p class="servico-card__meta">${formatarDuracao(servico.duracao)} <span aria-hidden="true">·</span> <strong>${formatarPreco(servico.preco)}</strong></p>
          <a class="btn btn--texto" data-link="marcacoes" href="#" aria-label="Marcar ${servico.nome}">Marcar ${icone("seta-direita")}</a>
        </div>
      </li>`
    )
    .join("");

  aplicarLigacoes(destaque);
  aplicarLigacoes(lista);
}

renderizarServicos();
