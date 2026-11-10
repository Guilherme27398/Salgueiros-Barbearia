/*
 * Login e criação de conta de demonstração: não há verificação real, exceto para a
 * conta de teste do administrador (ADMIN, em dados.js), que abre o painel de administração.
 * Guarda-se apenas um sinal de sessão iniciada e os dados do perfil, nunca a palavra-passe.
 * Na implementação, isto é substituído pelo Supabase Auth.
 */

const ERROS_AUTH = {
  nome: "Escreva o seu nome.",
  telemovel: "Escreva um número válido, por exemplo +351 910 000 000.",
  email: "Escreva um email válido, por exemplo nome@exemplo.pt.",
  "email-confirmar": "Os dois emails têm de ser iguais.",
  "palavra-passe": "Escreva a sua palavra-passe.",
  "palavra-passe-nova": "A palavra-passe tem de ter pelo menos 8 caracteres.",
  termos: "Para criar conta, tem de aceitar os termos e a política de privacidade.",
};

function iniciarFormularioAuth(formulario, aoEntrar) {
  const campos = [...formulario.querySelectorAll(".campo__controlo, .campo__caixa")];

  function validar(campo) {
    // O navegador só aplica o minlength ao que é escrito à mão, por isso o tamanho é verificado aqui também.
    let valido = campo.value.trim() !== "" && campo.checkValidity() && campo.value.length >= campo.minLength;
    if (campo.type === "checkbox") valido = campo.checked;
    // A confirmação tem de repetir o email, sem diferenças de maiúsculas ou espaços.
    if (valido && campo.dataset.igualA) {
      const original = document.getElementById(campo.dataset.igualA);
      valido = campo.value.trim().toLowerCase() === original.value.trim().toLowerCase();
    }
    document.getElementById(`${campo.id}-erro`).textContent = valido ? "" : ERROS_AUTH[campo.name];
    campo.setAttribute("aria-invalid", String(!valido));
    return valido;
  }

  // Depois de um erro, a mensagem desaparece assim que o campo fica correto.
  campos.forEach((campo) => campo.addEventListener("input", () => campo.getAttribute("aria-invalid") === "true" && validar(campo)));

  formulario.querySelectorAll(".campo__alternar").forEach((botao) => {
    const campo = document.getElementById(botao.getAttribute("aria-controls"));
    botao.addEventListener("click", () => {
      const mostrar = campo.type === "password";
      campo.type = mostrar ? "text" : "password";
      botao.textContent = mostrar ? "Ocultar" : "Mostrar";
      botao.setAttribute("aria-pressed", String(mostrar));
    });
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const invalidos = campos.filter((campo) => !validar(campo));
    if (invalidos.length) return invalidos[0].focus();

    // "false" significa que o formulário já tratou da entrada (ou a recusou).
    if (aoEntrar() === false) return;
    guardar("localStorage", "sessao");
    window.location.href = "conta.html";
  });
}

function iniciarAuth() {
  // Quem já tem sessão iniciada não precisa de ver estes formulários.
  if (SESSAO) {
    window.location.replace(SESSAO_ADMIN ? "admin.html" : "conta.html");
    return;
  }

  const login = document.getElementById("login-form");
  if (login) {
    iniciarFormularioAuth(login, () => {
      const email = document.getElementById("email").value.trim().toLowerCase();
      const palavraPasse = document.getElementById("palavra-passe");
      if (email !== ADMIN.email) return true;

      if (palavraPasse.value !== ADMIN.palavraPasse) {
        document.getElementById("palavra-passe-erro").textContent = "Palavra-passe errada para a conta de administrador.";
        palavraPasse.setAttribute("aria-invalid", "true");
        palavraPasse.focus();
        return false;
      }
      guardar("localStorage", "sessao", "admin");
      window.location.href = "admin.html";
      return false;
    });
  }

  const registo = document.getElementById("registo-form");
  if (registo) {
    iniciarFormularioAuth(registo, () => {
      // A conta nova fica com os dados escritos; o histórico mostrado no perfil é o de exemplo.
      const valor = (id) => document.getElementById(id).value.trim();
      guardar("localStorage", "perfil", JSON.stringify({ nome: valor("nome"), email: valor("email"), telemovel: valor("telemovel") }));
    });
  }
}

iniciarAuth();
