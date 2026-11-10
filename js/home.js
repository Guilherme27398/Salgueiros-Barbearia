/* Próprio da home: destaque da navbar conforme a secção visível. Os serviços estão em servicos.js. */

// Destaca "Serviços" na navbar enquanto a secção está no ecrã; caso contrário, "Início".
function iniciarDestaqueNavbar() {
  const linkInicio = document.querySelector('[data-nav="inicio"]');
  const linkServicos = document.querySelector('[data-nav="servicos"]');
  const observador = new IntersectionObserver(
    ([entrada]) => {
      linkServicos.classList.toggle("navbar__link--ativo", entrada.isIntersecting);
      linkInicio.classList.toggle("navbar__link--ativo", !entrada.isIntersecting);
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  observador.observe(document.getElementById("servicos"));
}

iniciarDestaqueNavbar();
