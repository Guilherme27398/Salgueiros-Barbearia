/*
 * Loja (protótipo): detalhe do produto, carrinho e encomendas.
 * Não há servidor nem pagamento: o carrinho e as encomendas ficam no localStorage (chaves
 * "carrinho" e "encomendas"). Ao finalizar a compra, a encomenda fica registada e o administrador
 * é avisado no sino da navbar; a lista completa está no separador "Encomendas" do painel (admin.js).
 * Carregado depois de main.js em todas as páginas com navbar.
 */

function lerListaGuardada(chave) {
  try {
    const lista = JSON.parse(lerGuardado("localStorage", chave));
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

// Evita totais como 44,699999 ao multiplicar preços com cêntimos.
function arredondar(valor) {
  return Math.round(valor * 100) / 100;
}

function contarArtigos(total) {
  return total === 1 ? "1 artigo" : `${total} artigos`;
}

// Seletor de quantidade ("−  2  +"), usado no detalhe do produto e em cada linha do carrinho.
function quantidadeHTML(valor, podeMais) {
  return `
    <div class="quantidade">
      <button type="button" data-quantidade="-1" aria-label="Menos uma unidade"${valor <= 1 ? " disabled" : ""}>${icone("menos")}</button>
      <span class="quantidade__valor" aria-live="polite">${valor}</span>
      <button type="button" data-quantidade="1" aria-label="Mais uma unidade"${podeMais ? "" : " disabled"}>${icone("mais")}</button>
    </div>`;
}

// Linha de um artigo numa encomenda (painel de administração e compras do perfil): fotografia do
// produto (se ainda existir), nome, tamanho, quantidade e subtotal. "extra" fica por baixo do detalhe.
function artigoEncomendaHTML(item, extra = "") {
  const produto = PRODUTOS.find((candidato) => candidato.nome === item.nome);
  return `
    <li class="encomenda__item">
      <span class="media media--1x1 encomenda__foto">${mediaConteudo(produto ? produto.imagem : "", "", "")}</span>
      <div class="encomenda__artigo">
        <p class="encomenda__produto">${item.nome}</p>
        <p class="encomenda__detalhe">${item.tamanho ? `${item.tamanho} · ` : ""}${item.quantidade} × ${formatarPreco(item.preco)}</p>
        ${extra}
      </div>
      <p class="encomenda__subtotal">${formatarPreco(arredondar(item.preco * item.quantidade))}</p>
    </li>`;
}

/* ===== CARRINHO: DADOS ===== */
// Cada linha tem { nome, tamanho, quantidade }; o preço e o stock vêm sempre de PRODUTOS.
function produtoDaLinha(linha) {
  return PRODUTOS.find((produto) => produto.nome === linha.nome);
}

// O stock que conta é o do tamanho escolhido (ml ou tamanho de roupa) ou, sem tamanhos, o do produto.
function stockDisponivel(produto, tamanho) {
  if (!tamanho) return produto.stock;
  const opcao = (produto.tamanhos || []).find((item) => item.nome === tamanho);
  return opcao ? opcao.stock : 0;
}

// Um produto que o administrador entretanto eliminou ou que esgotou sai do carrinho;
// se o stock desceu, a quantidade desce com ele.
const carrinho = lerListaGuardada("carrinho")
  .filter(produtoDaLinha)
  .map((linha) => ({ ...linha, quantidade: Math.min(linha.quantidade, stockDisponivel(produtoDaLinha(linha), linha.tamanho)) }))
  .filter((linha) => linha.quantidade > 0);

function unidadesNoCarrinho(nome, tamanho) {
  const linha = carrinho.find((item) => item.nome === nome && item.tamanho === tamanho);
  return linha ? linha.quantidade : 0;
}

function totalCarrinho() {
  return arredondar(carrinho.reduce((soma, linha) => soma + produtoDaLinha(linha).preco * linha.quantidade, 0));
}

function guardarCarrinho() {
  guardar("localStorage", "carrinho", JSON.stringify(carrinho));
  renderizarCarrinho();
}

function adicionarAoCarrinho(produto, tamanho, quantidade) {
  const unidades = Math.min(quantidade, stockDisponivel(produto, tamanho) - unidadesNoCarrinho(produto.nome, tamanho));
  if (unidades <= 0) return;
  const linha = carrinho.find((item) => item.nome === produto.nome && item.tamanho === tamanho);
  if (linha) linha.quantidade += unidades;
  else carrinho.push({ nome: produto.nome, tamanho, quantidade: unidades });
  guardarCarrinho();
}

/* ===== CARRINHO: PAINEL LATERAL ===== */
const CARRINHO_BOTAO = `
  <button class="navbar__icone navbar__icone--contador" id="carrinho-abrir" type="button" aria-haspopup="dialog">
    ${icone("carrinho")}<span class="contador" id="carrinho-contador" hidden></span>
  </button>`;

const CARRINHO_PAINEL = `
  <dialog class="carrinho" id="carrinho" aria-labelledby="carrinho-titulo">
    <div class="carrinho__interior">
      <div class="carrinho__topo">
        <h2 class="carrinho__titulo" id="carrinho-titulo">Carrinho</h2>
        <button class="navbar__icone" type="button" data-fechar aria-label="Fechar carrinho">${icone("fechar")}</button>
      </div>
      <div class="carrinho__corpo" id="carrinho-corpo"></div>
    </div>
  </dialog>`;

function renderizarCarrinho() {
  const unidades = carrinho.reduce((soma, linha) => soma + linha.quantidade, 0);
  const contador = document.getElementById("carrinho-contador");
  contador.textContent = unidades;
  contador.hidden = !unidades;
  document.getElementById("carrinho-abrir").setAttribute("aria-label", unidades ? `Carrinho: ${contarArtigos(unidades)}` : "Carrinho vazio");

  const corpo = document.getElementById("carrinho-corpo");
  if (!carrinho.length) {
    corpo.innerHTML = `
      <div class="carrinho__mensagem">
        ${icone("carrinho")}
        <p class="carrinho__mensagem-titulo">O carrinho está vazio</p>
        <p>Escolha um produto e adicione-o ao carrinho.</p>
        ${PAGINA === "produtos" ? '<button class="btn btn--contorno" type="button" data-fechar>Ver produtos</button>' : '<a class="btn btn--contorno" href="produtos.html">Ver produtos</a>'}
      </div>`;
    return;
  }

  corpo.innerHTML = `
    <ul class="carrinho__lista">
      ${carrinho
        .map((linha, indice) => {
          const produto = produtoDaLinha(linha);
          return `
          <li class="carrinho__linha" data-linha="${indice}">
            <span class="media media--1x1 carrinho__foto">${mediaConteudo(produto.imagem, "", "")}</span>
            <div class="carrinho__texto">
              <p class="carrinho__nome">${produto.nome}</p>
              <p class="carrinho__detalhe">${linha.tamanho ? `${linha.tamanho} · ` : ""}${formatarPreco(produto.preco)} cada</p>
              <div class="carrinho__acoes">
                ${quantidadeHTML(linha.quantidade, linha.quantidade < stockDisponivel(produto, linha.tamanho))}
                <button class="carrinho__remover" type="button" data-remover aria-label="Remover ${produto.nome} do carrinho">${icone("lixo")}</button>
              </div>
            </div>
            <p class="carrinho__subtotal">${formatarPreco(arredondar(produto.preco * linha.quantidade))}</p>
          </li>`;
        })
        .join("")}
    </ul>
    <div class="carrinho__rodape">
      <p class="carrinho__total"><span>Total (${contarArtigos(unidades)})</span><strong>${formatarPreco(totalCarrinho())}</strong></p>
      <p class="carrinho__nota">Protótipo: não há pagamento online. Levante e pague na barbearia.</p>
      <p class="campo__erro" id="carrinho-erro" role="alert"></p>
      ${
        SESSAO
          ? '<button class="btn btn--primario" type="button" data-finalizar>Finalizar compra</button>'
          : '<a class="btn btn--primario" href="login.html">Iniciar sessão para finalizar</a>'
      }
    </div>`;
}

// Regista a encomenda para o administrador ver e esvazia o carrinho.
function finalizarCompra() {
  const encomenda = {
    id: Date.now(),
    data: new Date().toISOString(),
    cliente: { nome: UTILIZADOR.nome, email: UTILIZADOR.email, telemovel: UTILIZADOR.telemovel },
    itens: carrinho.map((linha) => ({ ...linha, preco: produtoDaLinha(linha).preco })),
    total: totalCarrinho(),
    vista: false,
  };
  try {
    localStorage.setItem("encomendas", JSON.stringify([...lerListaGuardada("encomendas"), encomenda]));
  } catch {
    document.getElementById("carrinho-erro").textContent = "Não foi possível registar a compra neste navegador. Tente novamente.";
    return;
  }

  carrinho.length = 0;
  guardarCarrinho();
  document.getElementById("carrinho-corpo").innerHTML = `
    <div class="carrinho__mensagem carrinho__mensagem--sucesso">
      ${icone("check")}
      <p class="carrinho__mensagem-titulo">Compra registada</p>
      <p>O barbeiro já foi avisado da sua encomenda. Levante e pague na barbearia.</p>
      <button class="btn btn--contorno" type="button" data-fechar>Continuar</button>
    </div>`;
}

function abrirCarrinho() {
  renderizarCarrinho();
  document.getElementById("carrinho").showModal();
}

function iniciarCarrinho() {
  document.querySelector(".navbar__zona--direita").lastElementChild.insertAdjacentHTML("beforebegin", CARRINHO_BOTAO);
  document.body.insertAdjacentHTML("beforeend", CARRINHO_PAINEL);
  const painel = document.getElementById("carrinho");
  renderizarCarrinho();

  document.getElementById("carrinho-abrir").addEventListener("click", abrirCarrinho);
  painel.addEventListener("click", (evento) => {
    // Fecha com clique fora do painel ou no botão de fecho.
    if (evento.target === painel || evento.target.closest("[data-fechar]")) return painel.close();
    if (evento.target.closest("[data-finalizar]")) return finalizarCompra();

    const elemento = evento.target.closest("[data-linha]");
    if (!elemento) return;
    const indice = Number(elemento.dataset.linha);
    const passo = evento.target.closest("[data-quantidade]");
    if (passo) {
      carrinho[indice].quantidade += Number(passo.dataset.quantidade);
      guardarCarrinho();
      // A lista foi redesenhada: o foco volta ao mesmo botão (ou ao outro, se esse ficou desativado).
      const botoes = painel.querySelectorAll(`[data-linha="${indice}"] [data-quantidade]:not(:disabled)`);
      ([...botoes].find((botao) => botao.dataset.quantidade === passo.dataset.quantidade) || botoes[0]).focus();
    } else if (evento.target.closest("[data-remover]")) {
      carrinho.splice(indice, 1);
      guardarCarrinho();
      painel.querySelector("[data-fechar]").focus();
    }
  });
}

/* ===== DETALHE DO PRODUTO ===== */
// Abre ao clicar em qualquer elemento com data-produto (posição do produto em PRODUTOS).
const detalhe = { produto: null, tamanho: "", quantidade: 1 };

// Unidades do tamanho escolhido que o cliente ainda pode pôr no carrinho.
function unidadesLivres() {
  const { produto, tamanho } = detalhe;
  return stockDisponivel(produto, tamanho) - unidadesNoCarrinho(produto.nome, tamanho);
}

// Zona de compra do detalhe; é redesenhada sempre que o cliente muda de tamanho.
function compraHTML() {
  const { produto } = detalhe;
  const tamanhos = produto.tamanhos || [];
  if (produto.stock === 0) return '<button class="btn btn--primario produto-detalhe__adicionar" type="button" disabled>Esgotado</button>';
  // O administrador gere a loja; quem compra são os clientes.
  if (SESSAO_ADMIN) {
    const porTamanho = tamanhos.map((tamanho) => `${tamanho.nome}: ${tamanho.stock}`).join(" · ");
    return `<p class="produto-detalhe__nota">${produto.stock} em stock${porTamanho ? ` (${porTamanho})` : ""}. Com a conta de administrador não é possível comprar.</p>`;
  }

  return `
    ${
      tamanhos.length
        ? `<div role="group" aria-labelledby="produto-detalhe-tamanho">
            <p class="produto-detalhe__rotulo" id="produto-detalhe-tamanho">Tamanho</p>
            <div class="chips">
              ${tamanhos
                .map(
                  (tamanho, indice) =>
                    `<button class="chip" type="button" data-tamanho="${indice}" aria-pressed="${tamanho.nome === detalhe.tamanho}"${tamanho.stock === 0 ? " disabled" : ""}>${tamanho.nome}${tamanho.stock === 0 ? '<span class="sr-only"> (esgotado)</span>' : ""}</button>`
                )
                .join("")}
            </div>
          </div>`
        : ""
    }
    ${
      unidadesLivres() > 0
        ? `<div role="group" aria-labelledby="produto-detalhe-quantidade">
            <p class="produto-detalhe__rotulo" id="produto-detalhe-quantidade">Quantidade</p>
            ${quantidadeHTML(detalhe.quantidade, detalhe.quantidade < unidadesLivres())}
          </div>
          ${ultimasUnidades(stockDisponivel(produto, detalhe.tamanho)) ? '<p class="produto-card__stock">Últimas unidades</p>' : ""}
          <button class="btn btn--primario produto-detalhe__adicionar" type="button" data-adicionar>${icone("carrinho")}Adicionar ao carrinho</button>`
        : `<p class="produto-detalhe__nota">Já tem no carrinho todas as unidades disponíveis${tamanhos.length ? " deste tamanho" : ""}.</p>
          <button class="btn btn--contorno produto-detalhe__adicionar" type="button" data-ver-carrinho>Ver carrinho</button>`
    }`;
}

function abrirProduto(produto) {
  // Começa no primeiro tamanho que ainda tem stock.
  const tamanhos = produto.tamanhos || [];
  const inicial = tamanhos.find((tamanho) => tamanho.stock > 0) || tamanhos[0];
  Object.assign(detalhe, { produto, tamanho: inicial ? inicial.nome : "", quantidade: 1 });
  // No protótipo cada produto tem uma só fotografia; a galeria já aceita várias.
  const fotos = [produto.imagem].filter(Boolean);

  document.getElementById("produto-detalhe-interior").innerHTML = `
    <button class="navbar__icone produto-detalhe__fechar" type="button" data-fechar aria-label="Fechar">${icone("fechar")}</button>
    <div class="produto-detalhe__fotos">
      <div class="media media--1x1" id="produto-detalhe-foto">${mediaConteudo(produto.imagem, produto.nome, "Fotografia do produto · 1:1", "eager")}</div>
      ${
        fotos.length
          ? `<ul class="produto-detalhe__miniaturas" aria-label="Fotografias do produto">
              ${fotos
                .map(
                  (foto, indice) =>
                    `<li><button class="media media--1x1 produto-detalhe__miniatura" type="button" data-foto="${foto}" aria-pressed="${indice === 0}" aria-label="Fotografia ${indice + 1} de ${fotos.length}"><img src="${foto}" alt=""></button></li>`
                )
                .join("")}
            </ul>`
          : ""
      }
    </div>
    <div class="produto-detalhe__corpo">
      <p class="produto-card__marca">${produto.categoria}${produto.subcategoria ? ` · ${produto.subcategoria}` : ""}</p>
      <h2 class="produto-detalhe__nome" id="produto-detalhe-nome">${produto.nome}</h2>
      <p class="produto-detalhe__preco">${formatarPreco(produto.preco)}</p>
      ${produto.descricao ? `<p class="produto-detalhe__descricao">${produto.descricao}</p>` : ""}
      <div class="produto-detalhe__compra" id="produto-detalhe-compra">${compraHTML()}</div>
    </div>`;
  document.getElementById("produto-detalhe").showModal();
}

function iniciarDetalheProduto() {
  document.body.insertAdjacentHTML(
    "beforeend",
    `<dialog class="produto-detalhe" id="produto-detalhe" aria-labelledby="produto-detalhe-nome">
      <div class="produto-detalhe__interior" id="produto-detalhe-interior"></div>
    </dialog>`
  );
  const janela = document.getElementById("produto-detalhe");

  document.addEventListener("click", (evento) => {
    const origem = evento.target.closest("[data-produto]");
    if (origem) abrirProduto(PRODUTOS[Number(origem.dataset.produto)]);
  });

  janela.addEventListener("click", (evento) => {
    if (evento.target === janela || evento.target.closest("[data-fechar]")) return janela.close();

    const foto = evento.target.closest("[data-foto]");
    const tamanho = evento.target.closest("[data-tamanho]");
    const passo = evento.target.closest("[data-quantidade]");
    if (foto) {
      janela.querySelector("#produto-detalhe-foto img").src = foto.dataset.foto;
      janela.querySelectorAll("[data-foto]").forEach((botao) => botao.setAttribute("aria-pressed", String(botao === foto)));
    } else if (tamanho) {
      // Cada tamanho tem o seu stock, por isso a quantidade recomeça e a zona de compra é redesenhada.
      Object.assign(detalhe, { tamanho: detalhe.produto.tamanhos[Number(tamanho.dataset.tamanho)].nome, quantidade: 1 });
      document.getElementById("produto-detalhe-compra").innerHTML = compraHTML();
      janela.querySelector(`[data-tamanho="${tamanho.dataset.tamanho}"]`).focus();
    } else if (passo) {
      detalhe.quantidade += Number(passo.dataset.quantidade);
      janela.querySelector(".quantidade__valor").textContent = detalhe.quantidade;
      janela.querySelector('[data-quantidade="-1"]').disabled = detalhe.quantidade <= 1;
      janela.querySelector('[data-quantidade="1"]').disabled = detalhe.quantidade >= unidadesLivres();
    } else if (evento.target.closest("[data-adicionar]")) {
      adicionarAoCarrinho(detalhe.produto, detalhe.tamanho, detalhe.quantidade);
      janela.close();
      abrirCarrinho(); // o cliente vê logo o que ficou no carrinho
    } else if (evento.target.closest("[data-ver-carrinho]")) {
      janela.close();
      abrirCarrinho();
    }
  });
}

/* ===== AVISO DE ENCOMENDAS (ADMINISTRADOR) ===== */
// Sino na navbar com o número de encomendas que o administrador ainda não viu.
function atualizarSino() {
  const porVer = lerListaGuardada("encomendas").filter((encomenda) => !encomenda.vista).length;
  const contador = document.getElementById("encomendas-contador");
  contador.textContent = porVer;
  contador.hidden = !porVer;
  document.getElementById("encomendas-sino").setAttribute("aria-label", porVer ? `Encomendas: ${porVer} por ver` : "Encomendas");
  return porVer;
}

function iniciarSino() {
  document.querySelector(".navbar__zona--direita").lastElementChild.insertAdjacentHTML(
    "beforebegin",
    `<a class="navbar__icone navbar__icone--contador" id="encomendas-sino" href="admin.html#encomendas">
      ${icone("sino")}<span class="contador" id="encomendas-contador" hidden></span>
    </a>`
  );
  const porVer = atualizarSino();
  if (porVer) mostrarAviso(porVer === 1 ? "Tem 1 encomenda nova." : `Tem ${porVer} encomendas novas.`);
}

iniciarDetalheProduto();
if (SESSAO_ADMIN) iniciarSino();
else iniciarCarrinho();
