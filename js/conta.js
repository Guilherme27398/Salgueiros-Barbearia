/* Perfil do cliente: compras e dados pessoais editáveis. */

const ERROS_DADOS = {
  nome: "Escreva o seu nome.",
  email: "Escreva um email válido, por exemplo nome@exemplo.pt.",
  telemovel: "Escreva um número válido, por exemplo +351 910 000 000.",
};

function renderizarTopo() {
  const desde = new Date(`${UTILIZADOR.clienteDesde}T00:00`).toLocaleDateString("pt-PT", { month: "long", year: "numeric" });

  document.getElementById("perfil-desde").textContent = `Cliente desde ${desde}`;
  atualizarNome();
}

// O nome aparece no topo do perfil e no avatar da navbar.
function atualizarNome() {
  const letras = iniciais(UTILIZADOR.nome);
  document.getElementById("perfil-nome").textContent = `Olá, ${UTILIZADOR.nome.split(" ")[0]}`;
  document.getElementById("perfil-avatar").textContent = letras;
  document.querySelector(".conta-menu .avatar").textContent = letras;
  document.getElementById("conta-botao").setAttribute("aria-label", `Conta de ${UTILIZADOR.nome}`);
}

/* ===== COMPRAS ===== */
const ORDENS_COMPRAS = {
  "data-desc": (a, b) => b.data.localeCompare(a.data),
  "data-asc": (a, b) => a.data.localeCompare(b.data),
  "total-desc": (a, b) => b.total - a.total,
  "total-asc": (a, b) => a.total - b.total,
};

// Cada compra é um cartão com a data, os artigos (quantidade, tamanho e preço) e o total.
function iniciarCompras() {
  const lista = document.getElementById("perfil-compras");
  const ordem = document.getElementById("compras-ordem");

  // Compras de exemplo, feitas e pagas na barbearia: o preço é o atual do produto, e um produto
  // que o administrador entretanto eliminou deixa de aparecer.
  const naBarbearia = UTILIZADOR.compras.map((compra) => ({
    data: compra.data,
    pago: true,
    itens: compra.itens
      .filter((item) => PRODUTOS.some((produto) => produto.nome === item.produto))
      .map((item) => ({ nome: item.produto, tamanho: item.tamanho, quantidade: item.quantidade, preco: PRODUTOS.find((produto) => produto.nome === item.produto).preco })),
  }));
  // Compras que este cliente finalizou no carrinho (ver loja.js): ficam por levantar e pagar na barbearia.
  const noSite = lerListaGuardada("encomendas")
    .filter((encomenda) => encomenda.cliente.email === UTILIZADOR.email)
    .map((encomenda) => ({ data: encomenda.data, pago: false, itens: encomenda.itens }));
  const compras = [...naBarbearia, ...noSite]
    .filter((compra) => compra.itens.length)
    .map((compra) => ({ ...compra, total: arredondar(compra.itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0)) }));

  // "Voltar a comprar" abre o detalhe do produto (data-produto, tratado em loja.js), onde se escolhe o tamanho e a quantidade.
  function voltarAComprarHTML(item) {
    const produto = PRODUTOS.find((candidato) => candidato.nome === item.nome);
    if (!produto) return "";
    return produto.stock > 0
      ? `<button class="encomenda__acao" type="button" data-produto="${PRODUTOS.indexOf(produto)}">Voltar a comprar</button>`
      : '<p class="encomenda__detalhe">Esgotado de momento</p>';
  }

  function compraHTML(compra, indice) {
    const unidades = compra.itens.reduce((soma, item) => soma + item.quantidade, 0);
    // As compras de exemplo só têm o dia; as do site têm também a hora.
    const dia = new Date(compra.data.length === 10 ? `${compra.data}T00:00` : compra.data).toLocaleDateString("pt-PT");
    return `
      <li class="encomenda" style="--i: ${Math.min(indice, 8)}">
        <div class="encomenda__cabecalho">
          <div>
            <h2 class="encomenda__nome">Compra de ${dia}</h2>
            <p class="encomenda__detalhe">${contarArtigos(unidades)} · ${compra.pago ? "comprado na barbearia" : "encomendado no site"}</p>
          </div>
          <span class="badge${compra.pago ? " badge--escuro" : ""}">${compra.pago ? "Pago" : "Por pagar"}</span>
        </div>
        <ul class="encomenda__itens">${compra.itens.map((item) => artigoEncomendaHTML(item, voltarAComprarHTML(item))).join("")}</ul>
        <div class="encomenda__rodape">
          <p class="encomenda__detalhe">${compra.pago ? "Pago na barbearia" : "Levantar e pagar na barbearia"}</p>
          <p class="encomenda__total"><span>${compra.pago ? "Total pago" : "Total a pagar"}</span><strong>${formatarPreco(compra.total)}</strong></p>
        </div>
      </li>`;
  }

  function renderizar() {
    const escolhida = ordem.querySelector("input:checked").value;
    lista.innerHTML = compras.length
      ? [...compras].sort(ORDENS_COMPRAS[escolhida]).map(compraHTML).join("")
      : '<li class="compras__vazio">Ainda não fez compras. Quando comprar um produto, aparece aqui.</li>';
  }

  ordem.addEventListener("change", renderizar);
  renderizar();
}

/* ===== OS MEUS DADOS ===== */
function iniciarDados() {
  const formulario = document.getElementById("perfil-form");
  const campos = [...formulario.querySelectorAll(".campo__controlo")];
  const editar = document.getElementById("dados-editar");
  const acoes = document.getElementById("dados-acoes");
  const cancelar = document.getElementById("dados-cancelar");

  function preencher() {
    campos.forEach((campo) => {
      campo.value = UTILIZADOR[campo.name];
      campo.removeAttribute("aria-invalid");
      document.getElementById(`${campo.id}-erro`).textContent = "";
    });
  }

  function modoEdicao(ativo) {
    campos.forEach((campo) => (campo.readOnly = !ativo));
    editar.hidden = ativo;
    acoes.hidden = !ativo;
    formulario.classList.toggle("perfil-dados--edicao", ativo);
  }

  function validar(campo) {
    const valido = campo.value.trim() !== "" && campo.checkValidity();
    document.getElementById(`${campo.id}-erro`).textContent = valido ? "" : ERROS_DADOS[campo.name];
    campo.setAttribute("aria-invalid", String(!valido));
    return valido;
  }

  editar.addEventListener("click", () => {
    modoEdicao(true);
    campos[0].focus();
  });

  cancelar.addEventListener("click", () => {
    preencher();
    modoEdicao(false);
    editar.focus();
  });

  // Depois de um erro, a mensagem desaparece assim que o campo fica correto.
  campos.forEach((campo) => campo.addEventListener("input", () => campo.getAttribute("aria-invalid") === "true" && validar(campo)));

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const invalidos = campos.filter((campo) => !validar(campo));
    if (invalidos.length) return invalidos[0].focus();

    const dados = {};
    campos.forEach((campo) => (dados[campo.name] = campo.value.trim()));
    Object.assign(UTILIZADOR, dados);
    guardar("localStorage", "perfil", JSON.stringify(dados));

    preencher();
    modoEdicao(false);
    atualizarNome();
    mostrarAviso("Dados atualizados.");
    editar.focus();
  });

  preencher();
}

function iniciarConta() {
  // Página só para clientes com sessão iniciada; o administrador tem o painel dele.
  if (!SESSAO || SESSAO_ADMIN) {
    window.location.replace(SESSAO_ADMIN ? "admin.html" : "login.html");
    return;
  }
  renderizarTopo();
  iniciarSeparadores();
  iniciarCompras();
  iniciarDados();
}

iniciarConta();
