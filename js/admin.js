/*
 * Painel de administração (protótipo): o barbeiro gere serviços, produtos e as fotografias da galeria,
 * e vê as encomendas que os clientes fizeram no carrinho.
 * Não há servidor: cada lista alterada é guardada no localStorage (chaves "admin-servicos",
 * "admin-produtos" e "admin-cortes") e dados.js volta a lê-la em todas as páginas.
 * Na implementação, isto passa para o Supabase (tabelas + Storage) protegido por Row Level Security.
 */

const ERROS_ADMIN = {
  nome: "Escreva o nome.",
  descricao: "Escreva uma descrição.",
  preco: "Escreva um preço maior que 0.",
  duracao: "Escreva o tempo em minutos (número inteiro maior que 0).",
  stock: "Escreva a quantidade em stock (número inteiro, 0 ou mais).",
  legenda: "Escreva o nome do corte.",
  imagem: "Escolha uma fotografia.",
};

const TEXTOS_ADMIN = {
  servicos: { novo: "Novo serviço", alterar: "Alterar serviço", adicionar: "Adicionar serviço", criado: "Serviço adicionado.", alterado: "Serviço alterado.", eliminado: "Serviço eliminado.", vazio: "Ainda não há serviços." },
  produtos: { novo: "Novo produto", alterar: "Alterar produto", adicionar: "Adicionar produto", criado: "Produto adicionado.", alterado: "Produto alterado.", eliminado: "Produto eliminado.", vazio: "Ainda não há produtos." },
  cortes: { novo: "Nova fotografia", adicionar: "Adicionar à galeria", criado: "Fotografia adicionada à galeria.", eliminado: "Fotografia removida da galeria.", vazio: "A galeria está vazia e não aparece na página inicial." },
};

// O que o administrador escreve entra no HTML das páginas, por isso guarda-se já sem caracteres perigosos.
function escaparHTML(texto) {
  return texto.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

// O inverso, para voltar a mostrar o texto num campo do formulário.
function textoSimples(html) {
  const area = document.createElement("textarea");
  area.innerHTML = html;
  return area.value;
}

// Reduz a fotografia e devolve-a em texto (data URL), para caber no localStorage.
function lerFotografia(ficheiro, ladoMaximo = 900) {
  return new Promise((resolver, rejeitar) => {
    const url = URL.createObjectURL(ficheiro);
    const imagem = new Image();
    imagem.onload = () => {
      const escala = Math.min(1, ladoMaximo / Math.max(imagem.width, imagem.height));
      const tela = document.createElement("canvas");
      tela.width = Math.round(imagem.width * escala);
      tela.height = Math.round(imagem.height * escala);
      const contexto = tela.getContext("2d");
      contexto.fillStyle = "#fff"; // os PNG transparentes ficam com fundo branco
      contexto.fillRect(0, 0, tela.width, tela.height);
      contexto.drawImage(imagem, 0, 0, tela.width, tela.height);
      URL.revokeObjectURL(url);
      resolver(tela.toDataURL("image/jpeg", 0.82));
    };
    imagem.onerror = () => {
      URL.revokeObjectURL(url);
      rejeitar();
    };
    imagem.src = url;
  });
}

const ERRO_ESPACO = "Não foi possível guardar: o espaço deste navegador está cheio. Remova fotografias ou reponha os dados de exemplo.";

// Só troca a lista do site depois de a conseguir guardar; se falhar, quem chamou mostra ERRO_ESPACO.
function guardarLista(tipo, nova) {
  try {
    localStorage.setItem(`admin-${tipo}`, JSON.stringify(nova));
  } catch {
    return false;
  }
  LISTAS_ADMIN[tipo].splice(0, LISTAS_ADMIN[tipo].length, ...nova);
  return true;
}

// Botão que só atua ao segundo clique ("Confirmar?"), para não eliminar por engano.
function confirmarAoSegundoClique(botao, texto) {
  if (botao.dataset.confirmar) return true;
  const original = botao.innerHTML;
  botao.dataset.confirmar = "1";
  botao.textContent = texto;
  setTimeout(() => {
    if (!botao.isConnected) return;
    delete botao.dataset.confirmar;
    botao.innerHTML = original;
  }, 3000);
  return false;
}

/*
 * Liga um formulário e uma lista a uma das listas do site.
 * O formulário está numa janela (dialog), aberta pelo botão "Adicionar" ou pelo lápis de cada item.
 * "detalhe" devolve a linha pequena por baixo do nome; "campoNome" é o campo usado como título;
 * "antesDePreencher" prepara o formulário para um item (ou para um novo, com null);
 * "depoisDePreencher" corre quando os campos já têm os valores.
 * "validarExtra" e "completar" tratam do que não é um campo simples (os tamanhos do produto).
 */
function iniciarGestao(tipo, { campoNome = "nome", detalhe = () => "", editavel = true, antesDePreencher = () => {}, depoisDePreencher = () => {}, validarExtra = () => true, completar = () => {} } = {}) {
  const itens = LISTAS_ADMIN[tipo];
  const textos = TEXTOS_ADMIN[tipo];
  const formulario = document.getElementById(`form-${tipo}`);
  const janela = document.getElementById(`janela-${tipo}`);
  const lista = document.getElementById(`lista-${tipo}`);
  const campos = [...formulario.querySelectorAll(".campo__controlo, .campo__caixa")];
  const ficheiro = formulario.querySelector(".admin-form__ficheiro");
  const previa = formulario.querySelector("[data-previa]");
  const semFoto = formulario.querySelector("[data-sem-foto]");
  const titulo = formulario.querySelector("[data-titulo]");
  const submeter = formulario.querySelector("[data-submeter]");
  const erroGeral = formulario.querySelector("[data-erro-geral]");
  const erroImagem = document.getElementById(`${ficheiro.id}-erro`);
  let emEdicao = null; // posição do item que está a ser alterado
  let imagemAtual = "";

  function mostrarPrevia() {
    previa.innerHTML = mediaConteudo(imagemAtual, "", "");
    semFoto.hidden = !imagemAtual;
  }

  function renderizarLista() {
    lista.innerHTML = itens.length
      ? itens
          .map((item, indice) => {
            const nome = item[campoNome];
            return `
            <li class="admin-item">
              <span class="media media--1x1 admin-item__foto">${mediaConteudo(item.imagem, "", "")}</span>
              <div class="admin-item__texto">
                <p class="admin-item__nome">${nome}</p>
                <p class="admin-item__detalhe">${detalhe(item)}</p>
              </div>
              <div class="admin-item__acoes">
                ${editavel ? `<button class="admin-item__botao" type="button" data-editar="${indice}" aria-label="Alterar ${nome}">${icone("editar")}</button>` : ""}
                <button class="admin-item__botao admin-item__botao--eliminar" type="button" data-eliminar="${indice}" aria-label="Eliminar ${nome}">${icone("lixo")}</button>
              </div>
            </li>`;
          })
          .join("")
      : `<li class="admin-lista__vazio">${textos.vazio}</li>`;
  }

  function limpar() {
    emEdicao = null;
    imagemAtual = "";
    formulario.reset();
    antesDePreencher(null);
    formulario.querySelectorAll(".campo__erro").forEach((erro) => (erro.textContent = ""));
    campos.forEach((campo) => campo.removeAttribute("aria-invalid"));
    titulo.textContent = textos.novo;
    submeter.textContent = textos.adicionar;
    mostrarPrevia();
    depoisDePreencher();
  }

  function editar(indice) {
    const item = itens[indice];
    limpar();
    emEdicao = indice;
    imagemAtual = item.imagem || "";
    antesDePreencher(item);
    campos.forEach((campo) => {
      if (campo.type === "checkbox") campo.checked = Boolean(item[campo.name]);
      else campo.value = textoSimples(String(item[campo.name] ?? ""));
    });
    titulo.textContent = textos.alterar;
    submeter.textContent = "Guardar alterações";
    mostrarPrevia();
    depoisDePreencher();
    janela.showModal();
    campos[0].focus();
  }

  function validar(campo) {
    // Caixas de seleção e campos opcionais vazios (ex.: sem subcategoria) são sempre válidos.
    if (campo.type === "checkbox" || (!campo.required && campo.value === "")) return true;
    const valido = campo.value.trim() !== "" && campo.checkValidity();
    document.getElementById(`${campo.id}-erro`).textContent = valido ? "" : ERROS_ADMIN[campo.name];
    campo.setAttribute("aria-invalid", String(!valido));
    return valido;
  }

  function validarImagem() {
    const valido = !ficheiro.required || Boolean(imagemAtual);
    erroImagem.textContent = valido ? "" : ERROS_ADMIN.imagem;
    return valido;
  }

  // Depois de um erro, a mensagem desaparece assim que o campo fica correto.
  campos.forEach((campo) => campo.addEventListener("input", () => campo.getAttribute("aria-invalid") === "true" && validar(campo)));

  ficheiro.addEventListener("change", async () => {
    if (!ficheiro.files[0]) return;
    try {
      imagemAtual = await lerFotografia(ficheiro.files[0]);
      erroImagem.textContent = "";
    } catch {
      ficheiro.value = "";
      erroImagem.textContent = "Não foi possível abrir este ficheiro. Escolha uma fotografia JPG, PNG ou WebP.";
    }
    mostrarPrevia();
  });

  semFoto.addEventListener("click", () => {
    imagemAtual = "";
    ficheiro.value = "";
    mostrarPrevia();
  });

  document.querySelector(`[data-novo="${tipo}"]`).addEventListener("click", () => {
    limpar();
    janela.showModal();
    campos[0].focus();
  });
  // A janela só fecha no "X", em "Cancelar" ou com Esc; um clique fora não deita fora o que já foi escrito.
  formulario.querySelectorAll("[data-cancelar]").forEach((botao) => botao.addEventListener("click", () => janela.close()));

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const invalidos = campos.filter((campo) => !validar(campo));
    const imagemValida = validarImagem();
    const extraValido = validarExtra();
    if (invalidos.length) return invalidos[0].focus();
    if (!imagemValida) return ficheiro.focus();
    if (!extraValido) return;

    // Ao alterar, mantêm-se os campos que o formulário não mostra (ex.: o destaque do ALL IN).
    const item = { ...(emEdicao === null ? {} : itens[emEdicao]), imagem: imagemAtual };
    campos.forEach((campo) => {
      if (campo.type === "checkbox") item[campo.name] = campo.checked;
      else if (campo.type === "number") item[campo.name] = Number(campo.value);
      else item[campo.name] = escaparHTML(campo.value.trim());
    });
    completar(item);

    const nova = [...itens];
    if (emEdicao === null) nova.push(item);
    else nova[emEdicao] = item;
    // O aviso do topo ficaria tapado pela janela, por isso o erro aparece dentro do formulário.
    if (!guardarLista(tipo, nova)) return (erroGeral.textContent = ERRO_ESPACO);

    janela.close();
    mostrarAviso(emEdicao === null ? textos.criado : textos.alterado);
    renderizarLista();
  });

  lista.addEventListener("click", (evento) => {
    const botaoEditar = evento.target.closest("[data-editar]");
    if (botaoEditar) return editar(Number(botaoEditar.dataset.editar));

    const botaoEliminar = evento.target.closest("[data-eliminar]");
    if (!botaoEliminar || !confirmarAoSegundoClique(botaoEliminar, "Confirmar?")) return;
    const nova = itens.filter((_, indice) => indice !== Number(botaoEliminar.dataset.eliminar));
    if (!guardarLista(tipo, nova)) return mostrarAviso(ERRO_ESPACO);
    mostrarAviso(textos.eliminado);
    renderizarLista();
  });

  limpar();
  renderizarLista();
}

/* ===== ENCOMENDAS ===== */
// Compras que os clientes finalizaram no carrinho (loja.js), da mais recente para a mais antiga.
function iniciarEncomendas() {
  const lista = document.getElementById("lista-encomendas");
  const separador = document.getElementById("sep-encomendas");
  let encomendas = lerListaGuardada("encomendas");

  function guardarEncomendas() {
    guardar("localStorage", "encomendas", JSON.stringify(encomendas));
    atualizarSino();
  }

  function encomendaHTML(encomenda, indice) {
    const { cliente, itens } = encomenda;
    const nome = escaparHTML(cliente.nome);
    const email = escaparHTML(cliente.email);
    const telemovel = escaparHTML(cliente.telemovel);
    const unidades = itens.reduce((soma, item) => soma + item.quantidade, 0);
    const quando = new Date(encomenda.data).toLocaleString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    return `
      <li class="encomenda${encomenda.vista ? "" : " encomenda--nova"}">
        <div class="encomenda__topo">
          <span class="avatar" aria-hidden="true">${escaparHTML(iniciais(cliente.nome))}</span>
          <div class="encomenda__cliente">
            <p class="encomenda__nome">${nome}${encomenda.vista ? "" : '<span class="badge">Nova</span>'}</p>
            <p class="encomenda__detalhe">Encomenda n.º ${indice + 1} · ${quando}</p>
          </div>
          <button class="admin-item__botao admin-item__botao--eliminar" type="button" data-eliminar="${encomenda.id}" aria-label="Eliminar a encomenda de ${nome}">${icone("lixo")}</button>
        </div>
        <ul class="encomenda__contactos">
          <li><a href="mailto:${email}">${icone("email")}${email}</a></li>
          <li><a href="tel:${telemovel.replace(/\s/g, "")}">${icone("telefone")}${telemovel}</a></li>
        </ul>
        <ul class="encomenda__itens">${itens.map((item) => artigoEncomendaHTML(item)).join("")}</ul>
        <div class="encomenda__rodape">
          <p class="encomenda__detalhe">${contarArtigos(unidades)} · levantar e pagar na barbearia</p>
          <p class="encomenda__total"><span>Total</span><strong>${formatarPreco(encomenda.total)}</strong></p>
        </div>
      </li>`;
  }

  function renderizar() {
    lista.innerHTML = encomendas.length
      ? encomendas
          .map(encomendaHTML)
          .reverse()
          .join("")
      : '<li class="admin-lista__vazio">Ainda não há encomendas. Aparecem aqui quando um cliente finalizar uma compra no carrinho.</li>';
  }

  // As novas continuam assinaladas nesta visita, mas deixam de contar no sino.
  function marcarVistas() {
    if (encomendas.every((encomenda) => encomenda.vista)) return;
    encomendas = encomendas.map((encomenda) => ({ ...encomenda, vista: true }));
    guardarEncomendas();
  }

  lista.addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-eliminar]");
    if (!botao || !confirmarAoSegundoClique(botao, "Confirmar?")) return;
    encomendas = encomendas.filter((encomenda) => encomenda.id !== Number(botao.dataset.eliminar));
    guardarEncomendas();
    renderizar();
    mostrarAviso("Encomenda eliminada.");
  });

  // O sino da navbar leva a admin.html#encomendas; se o painel já estiver aberto noutro separador, volta a este.
  window.addEventListener("hashchange", () => window.location.hash === "#encomendas" && separador.click());

  // Este separador é o que abre por defeito, por isso o administrador vê as encomendas assim que entra.
  renderizar();
  marcarVistas();
}

function iniciarAdmin() {
  // Página só para o administrador.
  if (!SESSAO_ADMIN) {
    window.location.replace(SESSAO ? "conta.html" : "login.html");
    return;
  }

  document.getElementById("admin-conta").textContent = `Sessão iniciada como ${ADMIN.email}`;
  // As subcategorias dependem da categoria escolhida.
  const categoria = document.getElementById("produto-categoria");
  const subcategoria = document.getElementById("produto-subcategoria");
  categoria.innerHTML = CATEGORIAS.map((nome) => `<option>${nome}</option>`).join("");
  const mostrarSubcategorias = (nome) => {
    subcategoria.innerHTML =
      '<option value="">Sem subcategoria</option>' + (SUBCATEGORIAS[nome] || []).map((sub) => `<option>${sub}</option>`).join("");
  };
  categoria.addEventListener("change", () => mostrarSubcategorias(categoria.value));
  iniciarSeparadores();

  // O tempo escreve-se em minutos; a partir de 60, o formulário mostra como fica em horas no site.
  const duracao = document.getElementById("servico-duracao");
  const mostrarDuracao = () => {
    const minutos = Number(duracao.value);
    document.getElementById("servico-duracao-ajuda").textContent =
      Number.isInteger(minutos) && minutos >= 60 ? `Aparece no site como ${formatarDuracao(minutos)}.` : "";
  };
  duracao.addEventListener("input", mostrarDuracao);

  iniciarGestao("servicos", {
    depoisDePreencher: mostrarDuracao,
    detalhe: (servico) => {
      let onde = "Só na página de serviços";
      if (servico.assinatura) onde = "Em destaque";
      else if (servico.home) onde = "Na página inicial";
      return `${formatarDuracao(servico.duracao)} · ${formatarPreco(servico.preco, false)} · ${onde}`;
    },
  });
  /* Tamanhos do produto (ml ou tamanho de roupa), cada um com o seu stock */
  const tamanhosLista = document.getElementById("produto-tamanhos");
  const tamanhosErro = document.getElementById("produto-tamanhos-erro");
  const stockTotal = document.getElementById("produto-stock");

  function linhaTamanho(nome = "", stock = "") {
    tamanhosLista.insertAdjacentHTML(
      "beforeend",
      `<li class="admin-tamanhos__linha">
        <input class="campo__controlo" type="text" data-tamanho-nome maxlength="12" placeholder="Ex.: 100 ml ou M" aria-label="Tamanho" value="${nome}">
        <input class="campo__controlo" type="number" data-tamanho-stock min="0" step="1" inputmode="numeric" placeholder="Stock" aria-label="Stock deste tamanho" value="${stock}">
        <button class="admin-item__botao admin-item__botao--eliminar" type="button" data-tamanho-remover aria-label="Remover este tamanho">${icone("lixo")}</button>
      </li>`
    );
  }

  // Com tamanhos, o stock do produto é a soma e deixa de se escrever à mão.
  function atualizarStockTotal() {
    const stocks = [...tamanhosLista.querySelectorAll("[data-tamanho-stock]")];
    stockTotal.readOnly = stocks.length > 0;
    if (stocks.length) stockTotal.value = stocks.reduce((soma, campo) => soma + (Number(campo.value) || 0), 0);
    document.getElementById("produto-stock-ajuda").textContent = stocks.length ? "Soma do stock dos tamanhos." : "";
  }

  function validarTamanhos() {
    const linhas = [...tamanhosLista.children];
    const nomes = linhas.map((linha) => linha.querySelector("[data-tamanho-nome]").value.trim().toLowerCase());
    const invalida = linhas.find((linha, indice) => {
      const stock = linha.querySelector("[data-tamanho-stock]");
      return !nomes[indice] || nomes.indexOf(nomes[indice]) !== indice || stock.value === "" || !stock.checkValidity();
    });
    tamanhosErro.textContent = invalida ? "Em cada tamanho, escreva um nome diferente (ex.: 100 ml ou M) e o stock (número inteiro, 0 ou mais)." : "";
    if (invalida) invalida.querySelector("input").focus();
    return !invalida;
  }

  document.getElementById("produto-tamanho-novo").addEventListener("click", () => {
    linhaTamanho();
    atualizarStockTotal();
    tamanhosLista.lastElementChild.querySelector("input").focus();
  });
  tamanhosLista.addEventListener("input", atualizarStockTotal);
  tamanhosLista.addEventListener("click", (evento) => {
    const remover = evento.target.closest("[data-tamanho-remover]");
    if (!remover) return;
    remover.closest("li").remove();
    atualizarStockTotal();
  });

  iniciarGestao("produtos", {
    antesDePreencher: (produto) => {
      mostrarSubcategorias(produto ? produto.categoria : CATEGORIAS[0]);
      tamanhosLista.innerHTML = "";
      tamanhosErro.textContent = "";
      ((produto && produto.tamanhos) || []).forEach((tamanho) => linhaTamanho(tamanho.nome, tamanho.stock));
    },
    depoisDePreencher: atualizarStockTotal,
    validarExtra: validarTamanhos,
    completar: (produto) => {
      const tamanhos = [...tamanhosLista.children].map((linha) => ({
        nome: escaparHTML(linha.querySelector("[data-tamanho-nome]").value.trim()),
        stock: Number(linha.querySelector("[data-tamanho-stock]").value),
      }));
      if (tamanhos.length) produto.tamanhos = tamanhos;
      else delete produto.tamanhos;
    },
    detalhe: (produto) => {
      const porTamanho = (produto.tamanhos || []).map((tamanho) => `${tamanho.nome}: ${tamanho.stock}`).join(", ");
      const stock = produto.stock === 0 ? "Esgotado" : `${produto.stock} em stock${porTamanho ? ` (${porTamanho})` : ""}`;
      return `${produto.categoria}${produto.subcategoria ? ` › ${produto.subcategoria}` : ""} · ${formatarPreco(produto.preco)} · ${stock}${produto.destaque ? " · Em destaque" : ""}`;
    },
  });
  iniciarGestao("cortes", { campoNome: "legenda", editavel: false });
  iniciarEncomendas();

  const repor = document.getElementById("admin-repor");
  repor.addEventListener("click", () => {
    if (!confirmarAoSegundoClique(repor, "Confirmar: apagar as alterações?")) return;
    Object.keys(LISTAS_ADMIN).forEach((tipo) => localStorage.removeItem(`admin-${tipo}`));
    window.location.reload();
  });
  document.getElementById("admin-sair").addEventListener("click", terminarSessao);
}

iniciarAdmin();
