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
// Ficha da barbearia no Google Maps. Do link original saíram os parâmetros de rastreio (entry, g_ep).
const URL_MAPA =
  "https://www.google.com/maps/place/Salgueiro%E2%80%99s+barbearia/@41.7069736,-8.6818397,17z/data=!3m1!4b1!4m6!3m5!1s0xd25b1723eaf4e1f:0xa7e530bae0355a4c!8m2!3d41.7069736!4d-8.6792594!16s%2Fg%2F11vl312r4j?hl=pt-PT";

/* ===== FOTOGRAFIAS FIXAS DA HOME ===== */
const IMAGENS = {
  hero: "assets/images/hero/barbearia-hero.webp", // 1672×941 (16:9) · home e cabeçalho de Serviços
  heroProdutos: "assets/images/hero/produtos-hero.webp", // 1408×768 · cabeçalho de Produtos
  barbearia: "assets/images/barbearia/barbearia-fachada.webp", // vertical (3:4)
  barbeiro: "",   // assets/images/barbeiro/barbeiro-retrato.webp · 960×1200 (4:5)
  mapa: "",       // assets/images/barbearia/mapa.webp · 1200×675 (16:9)
  login: "assets/images/loginImage/login-barbearia.png", // login e criar conta (vertical ou quadrada)
};

/* ===== SERVIÇOS ===== */
// Lista real do barbeiro (cortes.md), com as descrições encurtadas e passadas a pt-PT.
// "assinatura: true" é o serviço em destaque. "home: true" são os que aparecem na home;
// os restantes só aparecem em servicos.html. "duracao" está em minutos.
// As fotografias são de exemplo, tiradas da galeria de cortes, até haver uma própria de cada serviço.
const SERVICOS = [
  {
    nome: "ALL IN",
    descricao: "O serviço com tudo incluído: cabelo, barba, sobrancelha e pele, numa só visita.",
    inclui: ["Corte de cabelo", "Barba", "Sobrancelha", "Limpeza de pele"],
    duracao: 90,
    preco: 20,
    assinatura: true,
    home: true,
    imagem: "assets/images/cortes/taper-fade.jpg", // de exemplo; a definitiva: assets/images/servicos/all-in.webp · 1200×900 (4:3)
  },
  { nome: "Corte com degradé", descricao: "Transição suave entre comprimentos, que valoriza o formato do rosto e dá dinamismo ao cabelo.", duracao: 45, preco: 10, home: true, imagem: "assets/images/cortes/mid-fade.jpg" },
  { nome: "Corte social", descricao: "Um corte elegante e discreto, adequado a qualquer ocasião.", duracao: 45, preco: 9, home: true, imagem: "assets/images/cortes/taper-fade-texturizado.jpg" },
  // descrição inventada (sem texto em cortes.md)
  { nome: "Cabelo e barba", descricao: "Corte de cabelo e barba aparada e desenhada na mesma visita, para um visual alinhado.", duracao: 45, preco: 14, home: true, imagem: "assets/images/cortes/barba-aparada.jpg" },
  { nome: "Barba a shaver ou navalha", descricao: "Barbear preciso e confortável, com acabamento impecável a shaver ou a navalha.", duracao: 20, preco: 5, home: true, imagem: "assets/images/cortes/contorno-de-barba.jpg" },
  { nome: "Corte com degradé + sobrancelha", descricao: "Corte em degradé com modelação e definição da sobrancelha, para harmonizar o rosto.", duracao: 55, preco: 12, home: true, imagem: "assets/images/cortes/drop-fade.jpg" },
  // descrição inventada (sem texto em cortes.md)
  { nome: "Corte de criança", descricao: "Corte para os mais novos, feito com calma e paciência.", duracao: 45, preco: 8, home: true, imagem: "assets/images/cortes/corte-de-crianca.jpg" },
  { nome: "Cabelo + barba + sobrancelha", descricao: "Corte de cabelo, barba tratada e sobrancelhas definidas num só serviço.", duracao: 60, preco: 16, imagem: "assets/images/cortes/low-fade-redondo.jpg" },
  { nome: "Rapar cabelo + barba", descricao: "Cabelo rapado e barba desenhada, para um visual limpo e bem definido.", duracao: 60, preco: 12, imagem: "assets/images/cortes/buzz-cut-com-fade.jpg" },
  { nome: "Limpeza de pele", descricao: "Purificação profunda que remove impurezas e células mortas e deixa a pele fresca.", duracao: 60, preco: 5 },
  // descrição inventada (sem texto em cortes.md)
  { nome: "Sobrancelha", descricao: "Limpeza e definição da sobrancelha, com um resultado natural.", duracao: 10, preco: 2 },
];

/* ===== PRODUTOS ===== */
// "destaque: true" coloca o produto no carrossel da home (escolha do barbeiro).
// "tamanhos" são as opções que o cliente escolhe antes de comprar (ml ou tamanho de roupa), cada uma com
// o seu stock; o "stock" do produto é a soma, calculada no fim deste ficheiro. Sem tamanhos, o produto é
// de tamanho único e tem só "stock". No protótipo, o preço é igual em todos os tamanhos.
// Fotografias: assets/images/produtos/nome-do-produto.webp · 800×800 (1:1)
const CATEGORIAS = ["Cabelo", "Barba", "Moda"];
// Subcategorias de cada categoria, usadas nos filtros da página de produtos e no painel de administração.
const SUBCATEGORIAS = {
  Cabelo: ["Ceras e pomadas", "Champôs", "Pós e sprays"],
  Barba: ["Óleos e bálsamos", "Pentes e escovas"],
  Moda: ["T-shirts", "Bonés", "Sweatshirts"],
};

const PRODUTOS = [
  {
    nome: "Pomada Mate",
    categoria: "Cabelo",
    subcategoria: "Ceras e pomadas",
    preco: 14.9,
    destaque: true,
    imagem: "assets/images/produtos/pomada-mate.webp",
    descricao: "Pasta de fixação forte com acabamento mate, sem brilho. Dá textura e controlo durante todo o dia e sai facilmente com água.",
    tamanhos: [{ nome: "100 ml", stock: 7 }, { nome: "150 ml", stock: 5 }],
  },
  {
    nome: "Cera de Brilho",
    categoria: "Cabelo",
    subcategoria: "Ceras e pomadas",
    preco: 13.5,
    destaque: true,
    imagem: "assets/images/produtos/cera-de-brilho.webp",
    descricao: "Gel-cera de fixação ultra forte com brilho intenso. Ideal para penteados clássicos, riscas marcadas e cabelo penteado para trás.",
    tamanhos: [{ nome: "100 ml", stock: 5 }, { nome: "250 ml", stock: 3 }],
  },
  {
    nome: "Champô Fortificante",
    categoria: "Cabelo",
    subcategoria: "Champôs",
    preco: 11.5,
    destaque: true,
    imagem: "assets/images/produtos/champo-fortificante.webp",
    descricao: "Champô de uso diário que limpa sem secar, reduz a quebra e deixa o cabelo mais denso e com brilho. Para todos os tipos de cabelo.",
    tamanhos: [{ nome: "250 ml", stock: 12 }, { nome: "500 ml", stock: 8 }],
  },
  {
    nome: "Pó Texturizante",
    categoria: "Cabelo",
    subcategoria: "Pós e sprays",
    preco: 12.9,
    stock: 6,
    destaque: false,
    imagem: "assets/images/produtos/po-texturizante.webp",
    descricao: "Pó leve que dá volume e textura na raiz, com acabamento mate. Basta polvilhar um pouco e moldar com os dedos.",
  },
  {
    nome: "Spray de Sal Marinho",
    categoria: "Cabelo",
    subcategoria: "Pós e sprays",
    preco: 13,
    destaque: false,
    imagem: "assets/images/produtos/spray-de-sal-marinho.webp",
    descricao: "Spray com sal marinho para um efeito de praia, com volume e textura natural. Aplicar no cabelo húmido antes de secar.",
    tamanhos: [{ nome: "100 ml", stock: 1 }, { nome: "170 ml", stock: 1 }],
  },
  {
    nome: "Óleo de Barba",
    categoria: "Barba",
    subcategoria: "Óleos e bálsamos",
    preco: 16,
    destaque: true,
    imagem: "assets/images/produtos/oleo-de-barba.webp",
    descricao: "Óleo que hidrata a barba e a pele, amacia os pelos e deixa um perfume discreto. Bastam algumas gotas por dia.",
    tamanhos: [{ nome: "30 ml", stock: 4 }, { nome: "50 ml", stock: 1 }],
  },
  {
    nome: "Bálsamo de Barba",
    categoria: "Barba",
    subcategoria: "Óleos e bálsamos",
    preco: 12,
    destaque: true,
    imagem: "assets/images/produtos/balsamo-de-barba.webp",
    descricao: "Bálsamo que nutre e disciplina a barba, ajuda a preencher as falhas e reduz a comichão dos primeiros dias.",
    tamanhos: [{ nome: "60 ml", stock: 0 }, { nome: "100 ml", stock: 0 }],
  },
  {
    nome: "Pente de Barba",
    categoria: "Barba",
    subcategoria: "Pentes e escovas",
    preco: 7,
    stock: 15,
    destaque: false,
    imagem: "assets/images/produtos/pente-de-barba.webp",
    descricao: "Pente de madeira com dentes largos e finos, para desembaraçar e alinhar a barba sem eletricidade estática. Cabe no bolso.",
  },
  {
    nome: "Escova de Barba",
    categoria: "Barba",
    subcategoria: "Pentes e escovas",
    preco: 9.5,
    stock: 9,
    destaque: false,
    imagem: "assets/images/produtos/escova-de-barba.webp",
    descricao: "Escova de cerdas macias com cabo de madeira, para espalhar o produto, levantar os pelos e fazer uma espuma cremosa.",
  },
  {
    nome: "T-shirt Salgueiro's",
    categoria: "Moda",
    subcategoria: "T-shirts",
    preco: 20,
    destaque: true,
    imagem: "assets/images/produtos/t-shirt-salgueiros.webp",
    descricao: "T-shirt preta de algodão, de corte direito e gola redonda. Confortável para o dia a dia.",
    tamanhos: [{ nome: "S", stock: 3 }, { nome: "M", stock: 5 }, { nome: "L", stock: 5 }, { nome: "XL", stock: 1 }],
  },
  {
    nome: "Boné Salgueiro's",
    categoria: "Moda",
    subcategoria: "Bonés",
    preco: 18,
    stock: 3,
    destaque: false,
    imagem: "assets/images/produtos/bone-salgueiros.webp",
    descricao: "Boné de aba curva em algodão, com bordado à frente e fecho ajustável atrás. Tamanho único.",
  },
  {
    nome: "Sweatshirt Salgueiro's",
    categoria: "Moda",
    subcategoria: "Sweatshirts",
    preco: 35,
    destaque: false,
    imagem: "assets/images/produtos/sweatshirt-salgueiros.webp",
    descricao: "Sweatshirt com capuz e bolso canguru, em algodão grosso e de corte largo. Quente e confortável.",
    tamanhos: [{ nome: "S", stock: 0 }, { nome: "M", stock: 3 }, { nome: "L", stock: 3 }, { nome: "XL", stock: 1 }],
  },
];

/* ===== CLIENTE COM SESSÃO INICIADA (exemplo) ===== */
// "produto" usa os mesmos nomes de PRODUTOS.
const UTILIZADOR = {
  nome: "João Silva",
  email: "joao.silva@exemplo.pt",
  telemovel: "+351 910 000 000",
  clienteDesde: "2023-03-18",
  // Compras antigas, feitas e pagas na barbearia, cada uma com os seus artigos.
  // No perfil juntam-se a estas as que o cliente finaliza no carrinho do site.
  compras: [
    { data: "2026-10-24", itens: [{ produto: "Pomada Mate", tamanho: "100 ml", quantidade: 1 }] },
    {
      data: "2026-09-12",
      itens: [
        { produto: "Bálsamo de Barba", tamanho: "60 ml", quantidade: 1 },
        { produto: "Óleo de Barba", tamanho: "30 ml", quantidade: 1 },
      ],
    },
    { data: "2026-06-20", itens: [{ produto: "T-shirt Salgueiro's", tamanho: "M", quantidade: 1 }] },
    { data: "2026-05-02", itens: [{ produto: "Spray de Sal Marinho", tamanho: "100 ml", quantidade: 2 }] },
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
// Horário real da barbearia. Índice 0 = domingo. null = encerrado.
// Cada dia tem os seus períodos [abre, fecha]; a barbearia fecha à hora de almoço.
const HORARIO = [
  null,
  null,
  [["09:30", "12:30"], ["14:00", "20:00"]],
  [["09:30", "12:30"], ["14:00", "20:00"]],
  [["09:30", "12:30"], ["14:00", "19:20"]],
  [["09:30", "12:30"], ["14:00", "20:00"]],
  [["09:00", "12:30"], ["14:00", "20:00"]],
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

// O stock de um produto com tamanhos é a soma do stock de cada tamanho.
PRODUTOS.forEach((produto) => {
  if (!produto.tamanhos || !produto.tamanhos.length) return;
  // Produtos guardados antes de haver stock por tamanho: o total é repartido pelos tamanhos.
  if (typeof produto.tamanhos[0] === "string") {
    const total = produto.tamanhos.length;
    produto.tamanhos = produto.tamanhos.map((nome, indice) => ({ nome, stock: Math.floor(produto.stock / total) + (indice < produto.stock % total ? 1 : 0) }));
  }
  produto.stock = produto.tamanhos.reduce((soma, tamanho) => soma + tamanho.stock, 0);
});
