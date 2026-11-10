/* Galeria de cortes: faixas de fotografias em movimento contínuo e visualização em ecrã inteiro (lightbox). */

const GALERIA_FAIXAS = 2;
const GALERIA_MINIMO = 10; // fotografias por metade da pista, para nunca ficar um espaço vazio

function galeriaItemHTML(indice, copia) {
  const corte = CORTES[indice];
  return `
    <li class="galeria__celula${copia ? " galeria__celula--copia" : ""}"${copia ? ' aria-hidden="true"' : ""}>
      <button class="galeria__item" type="button" data-indice="${indice}" aria-label="Ampliar: ${corte.legenda}"${copia ? ' tabindex="-1"' : ""}>
        <span class="media media--4x5">${mediaConteudo(corte.imagem, corte.legenda, "Fotografia de corte · 4:5", "eager")}</span>
        <span class="galeria__legenda">${corte.legenda}</span>
      </button>
    </li>`;
}

// Cada faixa mostra todas as fotografias, a começar num ponto diferente.
// A lista vai duas vezes seguidas: a animação anda metade da pista e recomeça sem se notar o corte.
// Com poucas fotografias, cada metade repete-as até encher a largura do ecrã.
function galeriaFaixaHTML(faixa) {
  const inicio = Math.floor((CORTES.length * faixa) / GALERIA_FAIXAS);
  const total = CORTES.length * Math.ceil(GALERIA_MINIMO / CORTES.length);
  const itens = (metade) =>
    Array.from({ length: total }, (_, i) => galeriaItemHTML((i + inicio) % CORTES.length, metade > 0 || i >= CORTES.length)).join("");
  // A velocidade mantém-se igual seja qual for o número de fotografias.
  const duracao = total * 6 * (faixa % 2 ? 1.25 : 1);
  return `
    <div class="galeria__faixa">
      <ul class="galeria__pista" style="animation-duration: ${duracao}s">${itens(0)}${itens(1)}</ul>
    </div>`;
}

function iniciarGaleria() {
  const faixas = document.getElementById("galeria-faixas");
  const lightbox = document.getElementById("lightbox");
  const palco = lightbox.querySelector(".lightbox__palco");
  const legenda = lightbox.querySelector(".lightbox__legenda");
  let atual = 0;

  // Sem fotografias (o administrador pode removê-las todas), a secção deixa de aparecer.
  if (!CORTES.length) {
    document.getElementById("galeria").hidden = true;
    return;
  }

  faixas.innerHTML = Array.from({ length: GALERIA_FAIXAS }, (_, faixa) => galeriaFaixaHTML(faixa)).join("");

  function mostrar(indice) {
    atual = (indice + CORTES.length) % CORTES.length;
    const corte = CORTES[atual];
    palco.innerHTML = mediaConteudo(corte.imagem, corte.legenda, "Fotografia de corte · 4:5", "eager");
    legenda.textContent = `${corte.legenda} · ${atual + 1} de ${CORTES.length}`;
  }

  faixas.addEventListener("click", (evento) => {
    const item = evento.target.closest(".galeria__item");
    if (!item) return;
    mostrar(Number(item.dataset.indice));
    lightbox.showModal();
  });

  lightbox.addEventListener("click", (evento) => {
    if (evento.target === lightbox || evento.target.closest("[data-fechar]")) lightbox.close();
    else if (evento.target.closest("[data-anterior]")) mostrar(atual - 1);
    else if (evento.target.closest("[data-seguinte]")) mostrar(atual + 1);
  });

  // O Esc já fecha o <dialog>; aqui ficam só as setas do teclado.
  lightbox.addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowLeft") mostrar(atual - 1);
    if (evento.key === "ArrowRight") mostrar(atual + 1);
  });
}

iniciarGaleria();
