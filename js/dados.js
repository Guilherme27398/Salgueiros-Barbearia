/*
 * Dados fictícios do protótipo, todos num só sítio.
 * Na implementação, este ficheiro é substituído por dados vindos do Supabase.
 *
 * FOTOGRAFIAS: para encaixar uma fotografia, basta escrever o caminho no campo
 * "imagem" (ou em IMAGENS). Enquanto o campo estiver vazio (""), o site mostra
 * um espaço reservado com o rácio certo.
 */

/* ===== LIGAÇÕES EXTERNAS ===== */
// Página de marcações na Fresha. Do link original ficaram só os parâmetros da barbearia e do barbeiro;
// saíram os de rastreio (fbclid, utm_*) e o cartId, que pertencia a uma marcação em curso.
const URL_MARCACOES =
  "https://www.fresha.com/pt/a/salgueiros-barbearia-geraz-do-lima-santa-maria-avenida-do-antigo-concelho-jx31dzui/booking?menu=true&share=true&pId=2651092&dppub=true&employeeId=4835059";
const URL_INSTAGRAM = "https://www.instagram.com/salgueiro.s_barbearia/";
const URL_FACEBOOK = "https://www.facebook.com/";
const URL_TIKTOK = "https://www.tiktok.com/";
const URL_WHATSAPP = "https://wa.me/351900000000";
const URL_MAPA = "https://www.google.com/maps/search/?api=1&query=Viana+do+Castelo";

/* ===== FOTOGRAFIAS FIXAS DA HOME ===== */
const IMAGENS = {
  hero: "assets/images/hero/barbearia-hero.png", // 1920×1080 (16:9)
  barbearia: "assets/images/barbearia/barbearia-fachada.webp", // vertical (3:4)
  barbeiro: "",   // assets/images/barbeiro/barbeiro-retrato.webp · 960×1200 (4:5)
  mapa: "",       // assets/images/barbearia/mapa.webp · 1200×675 (16:9)
  login: "assets/images/loginImage/login-barbearia.png", // login e criar conta (vertical ou quadrada)
};

/* ===== SERVIÇOS ===== */
// Lista real do barbeiro (cortes.md), com as descrições encurtadas e passadas a pt-PT.
// "assinatura: true" é o serviço em destaque. "home: true" são os que aparecem na home;
// os restantes só aparecem em servicos.html. "duracao" está em minutos.
const SERVICOS = [
  {
    nome: "ALL IN",
    descricao: "O serviço com tudo incluído: cabelo, barba, sobrancelha e pele, numa só visita.",
    inclui: ["Corte de cabelo", "Barba", "Sobrancelha", "Limpeza de pele"],
    duracao: 90,
    preco: 20,
    assinatura: true,
    home: true,
    imagem: "", // assets/images/servicos/all-in.webp · 1200×900 (4:3)
  },
  { nome: "Corte com degradé", descricao: "Transição suave entre comprimentos, que valoriza o formato do rosto e dá dinamismo ao cabelo.", duracao: 45, preco: 10, home: true },
  { nome: "Corte social", descricao: "Um corte elegante e discreto, adequado a qualquer ocasião.", duracao: 45, preco: 9, home: true },
  // descrição inventada (sem texto em cortes.md)
  { nome: "Cabelo e barba", descricao: "Corte de cabelo e barba aparada e desenhada na mesma visita, para um visual alinhado.", duracao: 45, preco: 14, home: true },
  { nome: "Barba a shaver ou navalha", descricao: "Barbear preciso e confortável, com acabamento impecável a shaver ou a navalha.", duracao: 20, preco: 5, home: true },
  { nome: "Corte com degradé + sobrancelha", descricao: "Corte em degradé com modelação e definição da sobrancelha, para harmonizar o rosto.", duracao: 55, preco: 12, home: true },
  // descrição inventada (sem texto em cortes.md)
  { nome: "Corte de criança", descricao: "Corte para os mais novos, feito com calma e paciência.", duracao: 45, preco: 8, home: true },
  { nome: "Cabelo + barba + sobrancelha", descricao: "Corte de cabelo, barba tratada e sobrancelhas definidas num só serviço.", duracao: 60, preco: 16 },
  { nome: "Rapar cabelo + barba", descricao: "Cabelo rapado e barba desenhada, para um visual limpo e bem definido.", duracao: 60, preco: 12 },
  { nome: "Limpeza de pele", descricao: "Purificação profunda que remove impurezas e células mortas e deixa a pele fresca.", duracao: 60, preco: 5 },
  // descrição inventada (sem texto em cortes.md)
  { nome: "Sobrancelha", descricao: "Limpeza e definição da sobrancelha, com um resultado natural.", duracao: 10, preco: 2 },
];

/* ===== PRODUTOS ===== */
// "destaque: true" coloca o produto no carrossel da home (escolha do barbeiro).
// Fotografias: assets/images/produtos/nome-do-produto.webp · 800×800 (1:1)
const CATEGORIAS = ["Cabelo", "Barba", "Moda"];

const PRODUTOS = [
  { nome: "Pomada Mate", categoria: "Cabelo", preco: 14.9, stock: 12, destaque: true, imagem: "" },
  { nome: "Cera de Brilho", categoria: "Cabelo", preco: 13.5, stock: 8, destaque: true, imagem: "" },
  { nome: "Champô Fortificante", categoria: "Cabelo", preco: 11.5, stock: 20, destaque: true, imagem: "" },
  { nome: "Pó Texturizante", categoria: "Cabelo", preco: 12.9, stock: 6, destaque: false, imagem: "" },
  { nome: "Spray de Sal Marinho", categoria: "Cabelo", preco: 13, stock: 2, destaque: false, imagem: "" },
  { nome: "Óleo de Barba", categoria: "Barba", preco: 16, stock: 5, destaque: true, imagem: "" },
  { nome: "Bálsamo de Barba", categoria: "Barba", preco: 12, stock: 0, destaque: true, imagem: "" },
  { nome: "Pente de Barba", categoria: "Barba", preco: 7, stock: 15, destaque: false, imagem: "" },
  { nome: "Escova de Barba", categoria: "Barba", preco: 9.5, stock: 9, destaque: false, imagem: "" },
  { nome: "T-shirt Salgueiro's", categoria: "Moda", preco: 20, stock: 14, destaque: true, imagem: "" },
  { nome: "Boné Salgueiro's", categoria: "Moda", preco: 18, stock: 3, destaque: false, imagem: "" },
  { nome: "Sweatshirt Salgueiro's", categoria: "Moda", preco: 35, stock: 7, destaque: false, imagem: "" },
];

/* ===== CLIENTE COM SESSÃO INICIADA (exemplo) ===== */
// "produto" e "servico" usam os mesmos nomes de PRODUTOS e SERVICOS.
// O número de cortes e o corte mais habitual são calculados a partir das visitas.
const UTILIZADOR = {
  nome: "João Silva",
  email: "joao.silva@exemplo.pt",
  telemovel: "+351 910 000 000",
  clienteDesde: "2023-03-18",
  visitas: [
    { data: "2026-10-24", servico: "Corte com degradé" },
    { data: "2026-09-12", servico: "Cabelo e barba" },
    { data: "2026-08-08", servico: "Corte com degradé" },
    { data: "2026-06-20", servico: "Corte com degradé" },
    { data: "2026-05-02", servico: "Barba a shaver ou navalha" },
    { data: "2026-03-28", servico: "Corte com degradé" },
    { data: "2026-02-14", servico: "Cabelo e barba" },
    { data: "2026-01-10", servico: "Corte social" },
    { data: "2025-11-29", servico: "Corte com degradé" },
  ],
  compras: [
    { data: "2026-10-24", produto: "Pomada Mate", quantidade: 1 },
    { data: "2026-09-12", produto: "Bálsamo de Barba", quantidade: 1 },
    { data: "2026-09-12", produto: "Óleo de Barba", quantidade: 1 },
    { data: "2026-06-20", produto: "T-shirt Salgueiro's", quantidade: 1 },
    { data: "2026-05-02", produto: "Spray de Sal Marinho", quantidade: 2 },
  ],
};

/* ===== GALERIA DE CORTES ===== */
// Fotografias: assets/images/cortes/nome-do-corte.jpg · retrato, mostradas em 4:5 (mín. 600×750)
const CORTES = [
  { legenda: "Taper fade", imagem: "assets/images/cortes/taper-fade.jpg" },
  { legenda: "Drop fade", imagem: "assets/images/cortes/drop-fade.jpg" },
  { legenda: "Contorno de barba", imagem: "assets/images/cortes/contorno-de-barba.jpg" },
  { legenda: "Mid fade", imagem: "assets/images/cortes/mid-fade.jpg" },
  { legenda: "Corte de criança", imagem: "assets/images/cortes/corte-de-crianca.jpg" },
  { legenda: "Mullet", imagem: "assets/images/cortes/mullet.jpg" },
  { legenda: "Buzz cut com fade", imagem: "assets/images/cortes/buzz-cut-com-fade.jpg" },
  { legenda: "Low fade redondo", imagem: "assets/images/cortes/low-fade-redondo.jpg" },
  { legenda: "Barba aparada", imagem: "assets/images/cortes/barba-aparada.jpg" },
  { legenda: "Taper fade texturizado", imagem: "assets/images/cortes/taper-fade-texturizado.jpg" },
];

/* ===== HORÁRIO ===== */
// Índice 0 = domingo. null = encerrado.
const HORARIO = [
  null,
  null,
  ["09:00", "19:00"],
  ["09:00", "19:00"],
  ["09:00", "19:00"],
  ["09:00", "19:00"],
  ["09:00", "19:00"],
];
const DIAS_SEMANA = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

/* ===== ADMINISTRADOR (conta de teste do protótipo) ===== */
// Credenciais fictícias, só para demonstrar o painel. Na implementação, o acesso do barbeiro
// passa pelo Supabase Auth e nenhuma palavra-passe fica no código.
const ADMIN = { nome: "Administrador", email: "admin@gmail.com", palavraPasse: "123" };

// O que o administrador cria, altera ou elimina fica guardado neste navegador (localStorage)
// e substitui as listas de exemplo acima, para qualquer visitante deste navegador ver as alterações.
const LISTAS_ADMIN = { servicos: SERVICOS, produtos: PRODUTOS, cortes: CORTES };

Object.entries(LISTAS_ADMIN).forEach(([tipo, lista]) => {
  try {
    const guardado = JSON.parse(localStorage.getItem(`admin-${tipo}`));
    if (Array.isArray(guardado)) lista.splice(0, lista.length, ...guardado);
  } catch {
    /* sem alterações guardadas, ficam os dados de exemplo */
  }
});
