/*
 * Painel de administração (protótipo): o barbeiro gere serviços, produtos e as fotografias da galeria.
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

// Só troca a lista do site depois de a conseguir guardar.
function guardarLista(tipo, nova) {
  try {
    localStorage.setItem(`admin-${tipo}`, JSON.stringify(nova));
  } catch {
    mostrarAviso("Não foi possível guardar: o espaço deste navegador está cheio. Remova fotografias ou reponha os dados de exemplo.");
    return false;
  }
  LISTAS_ADMIN[tipo].splice(0, LISTAS_ADMIN[tipo].length, ...nova);
  return true;
}

function renderizarResumoAdmin() {
  document.getElementById("admin-resumo").innerHTML = `
    <div><dt>Serviços</dt><dd>${SERVICOS.length}</dd></div>
    <div><dt>Produtos</dt><dd>${PRODUTOS.length}</dd></div>
    <div><dt>Fotografias na galeria</dt><dd>${CORTES.length}</dd></div>`;
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
 * "detalhe" devolve a linha pequena por baixo do nome; "campoNome" é o campo usado como título.
 */
function iniciarGestao(tipo, { campoNome = "nome", detalhe = () => "", editavel = true } = {}) {
  const itens = LISTAS_ADMIN[tipo];
  const textos = TEXTOS_ADMIN[tipo];
  const formulario = document.getElementById(`form-${tipo}`);
  const lista = document.getElementById(`lista-${tipo}`);
  const campos = [...formulario.querySelectorAll(".campo__controlo, .campo__caixa")];
  const ficheiro = formulario.querySelector(".admin-form__ficheiro");
  const previa = formulario.querySelector("[data-previa]");
  const semFoto = formulario.querySelector("[data-sem-foto]");
  const titulo = formulario.querySelector("[data-titulo]");
  const submeter = formulario.querySelector("[data-submeter]");
  const cancelar = formulario.querySelector("[data-cancelar]");
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
    renderizarResumoAdmin();
  }

  function limpar() {
    emEdicao = null;
    imagemAtual = "";
    formulario.reset();
    formulario.classList.remove("admin-form--edicao");
    formulario.querySelectorAll(".campo__erro").forEach((erro) => (erro.textContent = ""));
    campos.forEach((campo) => campo.removeAttribute("aria-invalid"));
    titulo.textContent = textos.novo;
    submeter.textContent = textos.adicionar;
    cancelar.hidden = true;
    mostrarPrevia();
  }

  function editar(indice) {
    const item = itens[indice];
    limpar();
    emEdicao = indice;
    imagemAtual = item.imagem || "";
    campos.forEach((campo) => {
      if (campo.type === "checkbox") campo.checked = Boolean(item[campo.name]);
      else campo.value = textoSimples(String(item[campo.name] ?? ""));
    });
    formulario.classList.add("admin-form--edicao");
    titulo.textContent = textos.alterar;
    submeter.textContent = "Guardar alterações";
    cancelar.hidden = false;
    mostrarPrevia();
    formulario.scrollIntoView({ behavior: MOVIMENTO_REDUZIDO ? "auto" : "smooth", block: "nearest" });
    campos[0].focus({ preventScroll: true });
  }

  function validar(campo) {
    if (campo.type === "checkbox") return true;
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

  cancelar.addEventListener("click", limpar);

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const invalidos = campos.filter((campo) => !validar(campo));
    const imagemValida = validarImagem();
    if (invalidos.length) return invalidos[0].focus();
    if (!imagemValida) return ficheiro.focus();

    // Ao alterar, mantêm-se os campos que o formulário não mostra (ex.: o destaque do ALL IN).
    const item = { ...(emEdicao === null ? {} : itens[emEdicao]), imagem: imagemAtual };
    campos.forEach((campo) => {
      if (campo.type === "checkbox") item[campo.name] = campo.checked;
      else if (campo.type === "number") item[campo.name] = Number(campo.value);
      else item[campo.name] = escaparHTML(campo.value.trim());
    });

    const nova = [...itens];
    if (emEdicao === null) nova.push(item);
    else nova[emEdicao] = item;
    if (!guardarLista(tipo, nova)) return;

    mostrarAviso(emEdicao === null ? textos.criado : textos.alterado);
    limpar();
    renderizarLista();
  });

  lista.addEventListener("click", (evento) => {
    const botaoEditar = evento.target.closest("[data-editar]");
    if (botaoEditar) return editar(Number(botaoEditar.dataset.editar));

    const botaoEliminar = evento.target.closest("[data-eliminar]");
    if (!botaoEliminar || !confirmarAoSegundoClique(botaoEliminar, "Confirmar?")) return;
    const nova = itens.filter((_, indice) => indice !== Number(botaoEliminar.dataset.eliminar));
    if (!guardarLista(tipo, nova)) return;
    mostrarAviso(textos.eliminado);
    limpar(); // as posições mudaram, por isso uma alteração a meio é abandonada
    renderizarLista();
  });

  limpar();
  renderizarLista();
}

function iniciarAdmin() {
  // Página só para o administrador.
  if (!SESSAO_ADMIN) {
    window.location.replace(SESSAO ? "conta.html" : "login.html");
    return;
  }

  document.getElementById("admin-conta").textContent = `Sessão iniciada como ${ADMIN.email}`;
  document.getElementById("produto-categoria").innerHTML = CATEGORIAS.map((nome) => `<option>${nome}</option>`).join("");
  iniciarSeparadores();

  iniciarGestao("servicos", {
    detalhe: (servico) => {
      let onde = "Só na página de serviços";
      if (servico.assinatura) onde = "Em destaque";
      else if (servico.home) onde = "Na página inicial";
      return `${formatarDuracao(servico.duracao)} · ${formatarPreco(servico.preco)} · ${onde}`;
    },
  });
  iniciarGestao("produtos", {
    detalhe: (produto) =>
      `${produto.categoria} · ${formatarPreco(produto.preco)} · ${produto.stock === 0 ? "Esgotado" : `${produto.stock} em stock`}${produto.destaque ? " · Em destaque" : ""}`,
  });
  iniciarGestao("cortes", { campoNome: "legenda", editavel: false });

  const repor = document.getElementById("admin-repor");
  repor.addEventListener("click", () => {
    if (!confirmarAoSegundoClique(repor, "Confirmar: apagar as alterações?")) return;
    Object.keys(LISTAS_ADMIN).forEach((tipo) => localStorage.removeItem(`admin-${tipo}`));
    window.location.reload();
  });
  document.getElementById("admin-sair").addEventListener("click", terminarSessao);
}

iniciarAdmin();
