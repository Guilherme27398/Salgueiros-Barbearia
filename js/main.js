/*
 * Componentes globais, iguais em todas as páginas: ícones, navbar, menu mobile,
 * rodapé, WhatsApp, cookies, animação de abertura e funções partilhadas.
 * Cada página indica quem é em <body data-pagina="...">.
 */

const PAGINA = document.body.dataset.pagina;
const NA_HOME = PAGINA === "home";
const LINK_INICIO = NA_HOME ? "#topo" : "index.html";
const LINK_SERVICOS = NA_HOME ? "#servicos" : "index.html#servicos";
const LOGO = "assets/images/logo/logo-salgueiros.png";
const MOVIMENTO_REDUZIDO = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Sessão simulada: guarda-se apenas um sinal de "sessão iniciada", nunca a palavra-passe.
const SESSAO = Boolean(lerGuardado("localStorage", "sessao"));
// O administrador (barbeiro) entra com a conta de teste definida em dados.js.
const SESSAO_ADMIN = lerGuardado("localStorage", "sessao") === "admin";

// Dados que o cliente editou no perfil (no protótipo ficam só neste navegador).
try {
  Object.assign(UTILIZADOR, JSON.parse(lerGuardado("localStorage", "perfil")));
} catch {
  /* sem alterações guardadas, ficam os dados de exemplo */
}

/* ===== FUNÇÕES PARTILHADAS ===== */
function formatarData(iso) {
  return new Date(`${iso}T00:00`).toLocaleDateString("pt-PT");
}

function iniciais(nome) {
  const partes = nome.trim().split(/\s+/);
  return (partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : "")).toUpperCase();
}

// Mensagem breve no topo do ecrã, que desaparece sozinha.
let avisoTemporizador;
function mostrarAviso(texto) {
  let aviso = document.getElementById("aviso");
  if (!aviso) {
    document.body.insertAdjacentHTML("beforeend", '<div class="aviso" id="aviso" role="status"></div>');
    aviso = document.getElementById("aviso");
  }
  aviso.textContent = texto;
  aviso.classList.add("aviso--visivel");
  clearTimeout(avisoTemporizador);
  avisoTemporizador = setTimeout(() => aviso.classList.remove("aviso--visivel"), 4000);
}

function terminarSessao() {
  try {
    localStorage.removeItem("sessao");
    localStorage.removeItem("perfil");
  } catch {
    /* sem armazenamento não há sessão para terminar */
  }
  window.location.href = "index.html";
}

function formatarPreco(valor) {
  return Number.isInteger(valor) ? `${valor} €` : `${valor.toFixed(2).replace(".", ",")} €`;
}

// 45 → "45 min", 60 → "1 h", 90 → "1 h 30 min"
function formatarDuracao(minutos) {
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  if (!horas) return `${resto} min`;
  return resto ? `${horas} h ${resto} min` : `${horas} h`;
}

function icone(nome) {
  return `<svg class="icone" aria-hidden="true"><use href="#i-${nome}"></use></svg>`;
}

// Devolve a fotografia ou, se ainda não existir, o espaço reservado com a legenda.
function mediaConteudo(src, alt, label, carregamento = "lazy") {
  if (src) return `<img src="${src}" alt="${alt}" loading="${carregamento}">`;
  return `<span class="media__vazio">${icone("imagem")}<span>${label}</span></span>`;
}

// Cartão de produto, usado no carrossel da home e na página de produtos.
function produtoCardHTML(produto, { titulo = "h3", mostrarDestaque = false } = {}) {
  const esgotado = produto.stock === 0;
  let badge = "";
  if (esgotado) badge = '<span class="badge badge--escuro produto-card__estado">Esgotado</span>';
  else if (mostrarDestaque && produto.destaque) badge = '<span class="badge produto-card__estado">Destaque</span>';

  return `
    <article class="produto-card${esgotado ? " produto-card--esgotado" : ""}">
      <div class="media media--1x1">
        ${mediaConteudo(produto.imagem, produto.nome, "Fotografia do produto · 1:1")}
        ${badge}
      </div>
      <div class="produto-card__corpo">
        <p class="produto-card__marca">${produto.categoria}</p>
        <${titulo} class="produto-card__nome">${produto.nome}</${titulo}>
        <p class="produto-card__preco">${formatarPreco(produto.preco)}</p>
        ${!esgotado && produto.stock <= 3 ? '<p class="produto-card__stock">Últimas unidades</p>' : ""}
      </div>
    </article>`;
}

// O armazenamento do navegador pode estar bloqueado (janela privada), por isso nunca pode falhar.
function lerGuardado(armazem, chave) {
  try {
    return window[armazem].getItem(chave);
  } catch {
    return null;
  }
}

function guardar(armazem, chave, valor = "1") {
  try {
    window[armazem].setItem(chave, valor);
  } catch {
    /* sem armazenamento, o site funciona na mesma */
  }
}

/* ===== ESTRUTURA COMUM ===== */
const ICONES = `
  <svg class="sprite" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <symbol id="i-instagram" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/></symbol>
    <symbol id="i-facebook" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></symbol>
    <symbol id="i-tiktok" viewBox="0 0 24 24"><path d="M9 12a4 4 0 1 0 4 4V3a5 5 0 0 0 5 5"/></symbol>
    <symbol id="i-utilizador" viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></symbol>
    <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
    <symbol id="i-fechar" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol>
    <symbol id="i-seta-esquerda" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></symbol>
    <symbol id="i-seta-direita" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></symbol>
    <symbol id="i-seta-baixo" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol>
    <symbol id="i-pesquisa" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></symbol>
    <symbol id="i-imagem" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/></symbol>
    <symbol id="i-telefone" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></symbol>
    <symbol id="i-email" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></symbol>
    <symbol id="i-mensagem" viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/></symbol>
    <symbol id="i-sair" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></symbol>
    <symbol id="i-definicoes" viewBox="0 0 24 24"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></symbol>
    <symbol id="i-editar" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></symbol>
    <symbol id="i-lixo" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/></symbol>
    <symbol id="i-repetir" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></symbol>
  </svg>`;

// Sem sessão: ícone que leva ao login. Com sessão: avatar com menu (Ver perfil e Terminar sessão).
// O administrador tem o painel de administração no lugar do perfil.
function contaHTML() {
  if (!SESSAO) {
    return `<a class="navbar__icone" href="login.html" aria-label="Iniciar sessão">${icone("utilizador")}</a>`;
  }
  const nome = SESSAO_ADMIN ? ADMIN.nome : UTILIZADOR.nome;
  const ligacao = SESSAO_ADMIN
    ? `<a href="admin.html">${icone("definicoes")}Painel de administração</a>`
    : `<a href="conta.html">${icone("utilizador")}Ver perfil</a>`;
  return `
    <div class="conta-menu">
      <button class="conta-menu__botao" id="conta-botao" type="button" aria-expanded="false" aria-controls="conta-lista" aria-label="Conta de ${nome}">
        <span class="avatar">${iniciais(nome)}</span>
      </button>
      <ul class="conta-menu__lista" id="conta-lista" hidden>
        <li>${ligacao}</li>
        <li><button type="button" data-sair>${icone("sair")}Terminar sessão</button></li>
      </ul>
    </div>`;
}

function navLink(pagina, href, texto, extra = "") {
  const ativo = PAGINA === pagina ? " navbar__link--ativo" : "";
  return `<a class="navbar__link${ativo}" href="${href}" ${extra}>${texto}</a>`;
}

const CABECALHO = `
  <header class="navbar${NA_HOME ? "" : " navbar--solida"}" id="navbar">
    <nav class="navbar__interior container" aria-label="Navegação principal">
      <div class="navbar__zona">
        <button class="navbar__icone navbar__icone--menu" id="menu-abrir" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu-mobile">${icone("menu")}</button>
        <a class="navbar__icone navbar__icone--instagram" data-link="instagram" href="#" aria-label="Instagram da Salgueiro's Barbearia">${icone("instagram")}</a>
        ${navLink("home", LINK_INICIO, "Início", 'data-nav="inicio"')}
        ${navLink("servicos", LINK_SERVICOS, "Serviços", 'data-nav="servicos"')}
      </div>
      <a class="navbar__logo" href="${LINK_INICIO}" aria-label="Salgueiro's Barbearia, voltar ao início">
        <img src="${LOGO}" alt="" width="56" height="56">
      </a>
      <div class="navbar__zona navbar__zona--direita">
        ${navLink("produtos", "produtos.html", "Produtos")}
        <a class="navbar__link" data-link="marcacoes" href="#">Marcações</a>
        ${contaHTML()}
      </div>
    </nav>
  </header>

  <dialog class="menu-mobile" id="menu-mobile" aria-label="Menu">
    <div class="menu-mobile__interior">
      <button class="navbar__icone menu-mobile__fechar" type="button" data-fechar aria-label="Fechar menu">${icone("fechar")}</button>
      <ul class="menu-mobile__lista">
        <li><a class="menu-mobile__instagram" data-link="instagram" href="#">${icone("instagram")}Instagram da loja</a></li>
        <li><a href="${LINK_INICIO}">Início</a></li>
        <li><a href="${LINK_SERVICOS}">Serviços</a></li>
        <li><a href="produtos.html">Produtos</a></li>
        <li><a data-link="marcacoes" href="#">Marcações</a></li>
      </ul>
    </div>
  </dialog>`;

const RODAPE = `
  <footer class="rodape" id="contactos">
    <div class="container">
      <div class="rodape__grelha">
        <div class="rodape__marca">
          <img src="${LOGO}" alt="Salgueiro's Barbearia" width="88" height="88" loading="lazy">
          <p class="rodape__slogan">Tradição, precisão e um corte à sua medida.</p>
          <ul class="rodape__redes">
            <li><a data-link="instagram" href="#" aria-label="Instagram da Salgueiro's Barbearia">${icone("instagram")}</a></li>
            <li><a data-link="facebook" href="#" aria-label="Facebook da Salgueiro's Barbearia">${icone("facebook")}</a></li>
            <li><a data-link="tiktok" href="#" aria-label="TikTok da Salgueiro's Barbearia">${icone("tiktok")}</a></li>
          </ul>
        </div>
        <div class="rodape__coluna">
          <h2 class="rodape__titulo">Localização</h2>
          <address>Rua de exemplo, 123<br>4900-000 Viana do Castelo</address>
          <div class="rodape__mapa media media--16x9" data-imagem="mapa" data-alt="Mapa com a localização da barbearia" data-label="Mapa da localização · 16:9"></div>
          <a class="btn btn--texto" data-link="mapa" href="#">Como chegar ${icone("seta-direita")}</a>
        </div>
        <div class="rodape__coluna">
          <h2 class="rodape__titulo">Contactos</h2>
          <ul class="rodape__contactos">
            <li><a href="tel:+351900000000">${icone("telefone")}+351 900 000 000</a></li>
            <li><a href="mailto:geral@salgueiros-barbearia.pt">${icone("email")}geral@salgueiros-barbearia.pt</a></li>
          </ul>
          <a class="btn btn--secundario" data-link="whatsapp" href="#">Falar no WhatsApp</a>
        </div>
        <div class="rodape__coluna">
          <h2 class="rodape__titulo">Horário</h2>
          <p class="estado" id="horario-estado"></p>
          <ul class="horario" id="horario-lista"></ul>
        </div>
      </div>
      <div class="rodape__fundo">
        <p>© ${new Date().getFullYear()} Salgueiro's Barbearia. Todos os direitos reservados.</p>
        <ul class="rodape__links">
          <li><a href="${LINK_INICIO}">Início</a></li>
          <li><a href="${LINK_SERVICOS}">Serviços</a></li>
          <li><a href="produtos.html">Produtos</a></li>
          <li><a data-link="marcacoes" href="#">Marcações</a></li>
          <li><a href="#">Política de Privacidade</a></li>
          <li><a href="#">Termos de Utilização</a></li>
        </ul>
      </div>
    </div>
  </footer>

  <a class="whatsapp" data-link="whatsapp" href="#" aria-label="Falar connosco no WhatsApp">${icone("mensagem")}</a>`;

const COOKIES = `
  <div class="cookies" id="cookies" role="region" aria-label="Aviso de cookies">
    <p>Usamos cookies para melhorar a sua experiência. <a href="#">Saber mais</a></p>
    <button class="btn btn--primario" type="button" data-aceitar>Aceitar</button>
  </div>`;

// Login e criar conta são ecrãs isolados: sem navbar, sem rodapé e sem botão de WhatsApp.
const ECRA_ISOLADO = PAGINA === "login" || PAGINA === "registo";

function montarEstrutura() {
  document.body.insertAdjacentHTML("afterbegin", ECRA_ISOLADO ? ICONES : ICONES + CABECALHO);
  if (!ECRA_ISOLADO) document.body.insertAdjacentHTML("beforeend", RODAPE);
}

/* ===== LIGAÇÕES EXTERNAS ===== */
const LIGACOES = {
  marcacoes: URL_MARCACOES,
  instagram: URL_INSTAGRAM,
  facebook: URL_FACEBOOK,
  tiktok: URL_TIKTOK,
  whatsapp: URL_WHATSAPP,
  mapa: URL_MAPA,
};

function aplicarLigacoes(raiz = document) {
  raiz.querySelectorAll("[data-link]").forEach((el) => {
    el.href = LIGACOES[el.dataset.link];
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });
}

/* ===== FOTOGRAFIAS FIXAS ===== */
function preencherImagens() {
  document.querySelectorAll("[data-imagem]").forEach((el) => {
    const chave = el.dataset.imagem;
    const carregamento = chave === "hero" ? "eager" : "lazy";
    el.innerHTML = mediaConteudo(IMAGENS[chave], el.dataset.alt, el.dataset.label, carregamento);
  });
}

/* ===== NAVBAR ===== */
function iniciarNavbar() {
  // Só a home tem hero; nas outras páginas a navbar é sempre sólida.
  if (!NA_HOME) return;
  const navbar = document.getElementById("navbar");
  const atualizar = () => navbar.classList.toggle("navbar--solida", window.scrollY > 40);
  atualizar();
  window.addEventListener("scroll", atualizar, { passive: true });
}

function iniciarMenuMobile() {
  const menu = document.getElementById("menu-mobile");
  const botaoAbrir = document.getElementById("menu-abrir");

  botaoAbrir.addEventListener("click", () => {
    menu.showModal();
    botaoAbrir.setAttribute("aria-expanded", "true");
  });
  menu.addEventListener("close", () => botaoAbrir.setAttribute("aria-expanded", "false"));
  menu.addEventListener("click", (evento) => {
    // Fecha com clique fora do painel, no botão de fecho ou em qualquer ligação.
    if (evento.target === menu || evento.target.closest("a, [data-fechar]")) menu.close();
  });
}

/* ===== MENU DA CONTA ===== */
function iniciarMenuConta() {
  const botao = document.getElementById("conta-botao");
  if (!botao) return;
  const lista = document.getElementById("conta-lista");

  const alternar = (abrir) => {
    lista.hidden = !abrir;
    botao.setAttribute("aria-expanded", String(abrir));
  };

  botao.addEventListener("click", () => alternar(lista.hidden));
  lista.querySelector("[data-sair]").addEventListener("click", terminarSessao);
  document.addEventListener("click", (evento) => {
    if (!evento.target.closest(".conta-menu")) alternar(false);
  });
  document.addEventListener("keydown", (evento) => {
    if (evento.key !== "Escape" || lista.hidden) return;
    alternar(false);
    botao.focus();
  });
}

/* ===== SEPARADORES (perfil e painel de administração) ===== */
function iniciarSeparadores() {
  const separadores = [...document.querySelectorAll('[role="tab"]')];

  function selecionar(escolhido) {
    separadores.forEach((separador) => {
      const ativo = separador === escolhido;
      separador.setAttribute("aria-selected", String(ativo));
      separador.tabIndex = ativo ? 0 : -1;
      document.getElementById(separador.getAttribute("aria-controls")).hidden = !ativo;
    });
  }

  separadores.forEach((separador, indice) => {
    separador.addEventListener("click", () => selecionar(separador));
    separador.addEventListener("keydown", (evento) => {
      if (evento.key !== "ArrowRight" && evento.key !== "ArrowLeft") return;
      const passo = evento.key === "ArrowRight" ? 1 : -1;
      const seguinte = separadores[(indice + passo + separadores.length) % separadores.length];
      selecionar(seguinte);
      seguinte.focus();
    });
  });
}

/* ===== HORÁRIO ===== */
function renderizarHorario() {
  const agora = new Date();
  const hoje = agora.getDay();
  const ordem = [1, 2, 3, 4, 5, 6, 0]; // semana a começar na segunda

  document.getElementById("horario-lista").innerHTML = ordem
    .map((dia) => {
      const horas = HORARIO[dia];
      const classe = dia === hoje ? ' class="horario__dia--hoje"' : "";
      return `<li${classe}><span>${DIAS_SEMANA[dia]}</span><span>${horas ? `${horas[0]} – ${horas[1]}` : "Encerrado"}</span></li>`;
    })
    .join("");

  const horasHoje = HORARIO[hoje];
  const horaAtual = agora.toTimeString().slice(0, 5);
  const aberto = Boolean(horasHoje) && horaAtual >= horasHoje[0] && horaAtual < horasHoje[1];
  const estado = document.getElementById("horario-estado");
  estado.textContent = aberto ? `Aberto agora · fecha às ${horasHoje[1]}` : "Fechado de momento";
  estado.classList.toggle("estado--aberto", aberto);
}

/* ===== COOKIES ===== */
function iniciarCookies() {
  if (lerGuardado("localStorage", "cookies-aceites")) return;
  document.body.insertAdjacentHTML("beforeend", COOKIES);
  const banner = document.getElementById("cookies");
  banner.querySelector("[data-aceitar]").addEventListener("click", () => {
    guardar("localStorage", "cookies-aceites");
    banner.remove();
  });
}

/* ===== ANIMAÇÃO DE ABERTURA ===== */
// Aparece só na primeira página aberta em cada visita (sessão do navegador).
function iniciarIntro() {
  if (MOVIMENTO_REDUZIDO || lerGuardado("sessionStorage", "intro-vista")) return;
  guardar("sessionStorage", "intro-vista");

  document.documentElement.classList.add("com-intro");
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="intro" id="intro" aria-hidden="true">
      <div class="intro__conteudo">
        <img class="intro__logo" src="${LOGO}" alt="" width="120" height="120">
        <span class="intro__linha"></span>
        <p class="intro__nome">Salgueiro's <span>Barbearia</span></p>
      </div>
    </div>`
  );
  const intro = document.getElementById("intro");
  const remover = () => intro.remove();
  intro.addEventListener("animationend", (evento) => {
    if (evento.target === intro) remover();
  });
  setTimeout(remover, 3000); // rede de segurança caso a animação não chegue ao fim
}

/* ===== ANIMAÇÃO DE ENTRADA AO FAZER SCROLL ===== */
function iniciarRevelar() {
  if (MOVIMENTO_REDUZIDO) return;
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("revelar--visivel");
        observador.unobserve(entrada.target);
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll("[data-revelar]").forEach((el) => {
    el.classList.add("revelar");
    observador.observe(el);
  });
}

iniciarIntro();
montarEstrutura();
preencherImagens();
aplicarLigacoes();
if (!ECRA_ISOLADO) {
  renderizarHorario();
  iniciarNavbar();
  iniciarMenuMobile();
  iniciarMenuConta();
}
iniciarCookies();
iniciarRevelar();
