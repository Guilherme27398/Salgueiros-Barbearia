/* Perfil do cliente: resumo na barbearia, compras e dados pessoais editáveis. */

const ERROS_DADOS = {
  nome: "Escreva o seu nome.",
  email: "Escreva um email válido, por exemplo nome@exemplo.pt.",
  telemovel: "Escreva um número válido, por exemplo +351 910 000 000.",
};

function resumoVisitas(visitas) {
  const contagem = {};
  visitas.forEach((visita) => {
    contagem[visita.servico] = (contagem[visita.servico] || 0) + 1;
  });
  const habitual = Object.entries(contagem).sort((a, b) => b[1] - a[1])[0][0];
  const ultima = [...visitas].sort((a, b) => b.data.localeCompare(a.data))[0];
  return { total: visitas.length, habitual, ultima };
}

function renderizarTopo() {
  const resumo = resumoVisitas(UTILIZADOR.visitas);
  const desde = new Date(`${UTILIZADOR.clienteDesde}T00:00`).toLocaleDateString("pt-PT", { month: "long", year: "numeric" });

  document.getElementById("perfil-desde").textContent = `Cliente desde ${desde}`;
  document.getElementById("perfil-resumo").innerHTML = `
    <div><dt>Cortes feitos</dt><dd>${resumo.total}</dd></div>
    <div><dt>Corte mais habitual</dt><dd>${resumo.habitual}</dd></div>
    <div><dt>Última visita</dt><dd>${formatarData(resumo.ultima.data)}</dd></div>`;
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
function iniciarCompras() {
  const lista = document.getElementById("perfil-compras");
  // Um produto que o administrador entretanto eliminou deixa de aparecer nas compras.
  const compras = [...UTILIZADOR.compras]
    .filter((compra) => PRODUTOS.some((item) => item.nome === compra.produto))
    .sort((a, b) => b.data.localeCompare(a.data));

  lista.innerHTML = compras
    .map((compra, indice) => {
      const produto = PRODUTOS.find((item) => item.nome === compra.produto);
      const emStock = produto.stock > 0;
      return `
      <li style="--i: ${indice}">
        <article class="produto-card compra-card${emStock ? "" : " produto-card--esgotado"}">
          <div class="media media--1x1">${mediaConteudo(produto.imagem, produto.nome, "Fotografia do produto · 1:1")}</div>
          <div class="produto-card__corpo">
            <p class="produto-card__marca">Comprado a ${formatarData(compra.data)}</p>
            <h2 class="produto-card__nome">${produto.nome}</h2>
            <p class="produto-card__preco">${formatarPreco(produto.preco)}</p>
            ${
              emStock
                ? `<button class="btn btn--contorno compra-card__acao" type="button" data-recomprar="${indice}">Voltar a comprar</button>`
                : '<button class="btn btn--contorno compra-card__acao" type="button" disabled>Esgotado</button>'
            }
          </div>
        </article>
      </li>`;
    })
    .join("");

  // Compra simulada: no protótipo não há carrinho nem pagamento.
  lista.addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-recomprar]");
    if (!botao) return;
    botao.disabled = true;
    botao.innerHTML = `${icone("check")}Reservado`;
    mostrarAviso(`Reserva feita: ${compras[Number(botao.dataset.recomprar)].produto}. Levante e pague na barbearia.`);
  });
}

/* ===== OS MEUS DADOS ===== */
function iniciarDados() {
  const formulario = document.getElementById("perfil-form");
  const campos = [...formulario.querySelectorAll(".campo__controlo")];
  const editar = document.getElementById("dados-editar");
  const guardarBotao = document.getElementById("dados-guardar");
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
    guardarBotao.hidden = !ativo;
    cancelar.hidden = !ativo;
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
  document.getElementById("perfil-sair").addEventListener("click", terminarSessao);
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
