# Regras e Padrões do Projeto — Salgueiro's Barbearia

Documento de referência para todos os que trabalham no projeto. Quando houver dúvida, este ficheiro prevalece sobre preferências pessoais. Qualquer alteração às regras deve ser discutida e registada aqui.

---

## 1. Âmbito e objetivo

- Projeto de **site para a Salgueiro's Barbearia**, com um **painel de administração** para o barbeiro gerir produtos, serviços e galeria. Não é uma plataforma para várias barbearias.
- **Fase atual: protótipo de UI** para apresentar ao cliente. Mostra aparência, navegação e fluxos.
- Nesta fase, o login é um **ecrã de demonstração**, sem autenticação real. As marcações são feitas num **site externo**, por hiperligação. Produtos e carrinho são simulados.
- A criação de conta foi abandonada: não existe página de registo.
- Todo o conteúdo (nomes, preços, morada, contactos, avaliações, imagens) é **fictício** até ser fornecido o conteúdo real. Deve estar identificado como tal quando relevante.
- A arquitetura deve permitir ligar o painel de administração a um **backend real** (base de dados, uploads e login) sem reescrever o site público.

---

## 2. Identidade visual

### 2.1 Logótipo
- Ficheiro original: `Imagens/image.png` (fundo preto, silhueta de barbeiro com barba a dourado, texto "SALGUEIRO'S BARBEARIA").
- Antes de usar, mover para `assets/images/logo/` e renomear para `logo-salgueiros.png`. Disponibilizar também uma versão SVG quando possível.
- Versões a usar:
  - **Sobre fundo preto:** logótipo original.
  - **Sobre fundo branco:** versão a preto e dourado, ou logótipo a preto com o símbolo a dourado.
- Área de respiro mínima em volta do logótipo: a altura da letra "S" do nome.
- **Não** distorcer, rodar, mudar as cores do logótipo nem aplicar sombras.

### 2.2 Paleta oficial: preto, dourado e branco

Todas as cores são tokens CSS definidos em `:root`. Nunca usar valores de cor soltos no código.

| Token | Uso | Valor |
|-------|-----|-------|
| `--color-black` | Fundo principal de secções escuras, cabeçalho, rodapé, texto em fundos claros | `#0D0D0D` |
| `--color-black-soft` | Cartões sobre fundo preto, separadores | `#1A1A1A` |
| `--color-gold` | Botões principais, destaques, títulos em fundo preto, ícones | `#C9A24A` |
| `--color-gold-hover` | Estado hover dos botões dourados | `#B8913A` |
| `--color-gold-soft` | Bordas e fundos subtis de destaque | `#E9D9AE` |
| `--color-white` | Texto sobre preto, fundos de secções claras | `#FFFFFF` |
| `--color-gray` | Texto secundário e legendas | `#5C5C5C` |
| `--color-danger` | Erros de formulário | `#B42318` |
| `--color-success` | Confirmações | `#2E7D4F` |

- O dourado é o **acento**, não um fundo de grandes áreas. Usar em botões, títulos de secções escuras, ícones, linhas e badges.
- Alternar secções **pretas** e **brancas** para dar ritmo à página. Nunca duas secções pretas seguidas.
- Texto dourado sobre branco **não é permitido** (contraste insuficiente). Sobre branco, o texto é preto e o dourado só aparece em elementos decorativos ou botões com texto preto.
- Botões dourados têm **texto preto**, para cumprir o contraste.
- Os valores do dourado são aproximados à cor do logótipo; confirmar com conta-gotas sobre o ficheiro original antes de fechar.

### 2.3 Contraste
- Mínimo **WCAG AA**: 4.5:1 para texto normal, 3:1 para texto grande e elementos de interface.
- Verificar todas as combinações novas com uma ferramenta de contraste antes de as aplicar.

### 2.4 Tipografia
- **Títulos:** serif com carácter clássico (sugestão: *Playfair Display*), em maiúsculas espaçadas nos nomes de secção.
- **Texto corrido e interface:** sans-serif legível (sugestão: *Inter*).
- Fontes carregadas do Google Fonts ou localmente em `assets/fonts/`.
- Escala fixa definida em `base.css`: 14 / 16 / 18 / 24 / 32 / 48 / 64 px.
- Tamanho mínimo do corpo: **16 px**. Altura de linha: 1.5 no corpo, 1.2 nos títulos.

---

## 3. Stack e estrutura

- **Front-end:** HTML5, CSS3 e JavaScript puro (decidido).
- **Implementação (depois do protótipo):** Supabase para base de dados (Postgres), login do barbeiro (Auth) e fotografias (Storage). O site fala diretamente com o Supabase através de `supabase-js`, com **Row Level Security** a limitar a escrita ao administrador. Edge Functions só para o que exigir segredos ou lógica de servidor (emails, APIs externas, webhooks). A chave `service_role` nunca entra no front-end.
- **Fotografias no protótipo:** os caminhos ficam em `js/dados.js`. Com o campo `imagem` vazio, o site mostra um espaço reservado com o rácio certo.
- **Sem dependências desnecessárias.** Bibliotecas externas só se forem essenciais e aprovadas pela equipa.
- **Estrutura de pastas:**

```
Salgueiros-Barbearia/
├── index.html
├── servicos.html
├── produtos.html
├── galeria.html
├── contactos.html
├── login.html
├── conta.html
├── termos.html          # Termos de Utilização
├── privacidade.html     # Política de Privacidade
├── 404.html
├── admin.html           # painel do barbeiro (no protótipo: conta de teste)
├── css/
│   ├── base.css          # reset, tokens de cor, tipografia, espaçamentos
│   ├── components.css    # botões, cartões, formulários, carrossel, lightbox
│   ├── layout.css        # grelhas, header, footer
│   └── pages/            # estilos específicos por página (produtos, conta, admin e legal)
├── js/
│   ├── main.js           # navbar, menu mobile, rodapé, animação de abertura e funções partilhadas
│   ├── loja.js           # detalhe do produto, carrinho e encomendas (protótipo, em localStorage)
│   ├── servicos.js       # destaque e cartões de serviços (home e servicos.html)
│   ├── produtos.js       # pesquisa, filtros e ordenação da página de produtos
│   ├── carrossel.js      # carrossel de produtos
│   ├── galeria.js        # lightbox
│   ├── auth.js           # login (simulado)
│   ├── conta.js          # perfil do cliente: dados, resumo e últimas compras
│   └── dados.js          # dados fictícios: serviços, produtos, barbeiro, horários
├── assets/
│   ├── images/
│   │   ├── logo/         # logo-salgueiros.png (e versões SVG)
│   │   ├── hero/
│   │   ├── barbeiro/
│   │   ├── cortes/       # galeria de clientes
│   │   └── produtos/
│   ├── icons/
│   └── fonts/
└── docs/                 # documentação (este ficheiro e o layout)
```

- Um ficheiro HTML por página. Cabeçalho, rodapé, botão WhatsApp e banner de cookies são **idênticos** em todas as páginas: são montados por `js/main.js` e nunca copiados à mão. Exceção: `login.html` e `registo.html` são ecrãs isolados, sem cabeçalho nem rodapé. Cada página identifica-se com `<body data-pagina="...">`.
- Dados fictícios num **único sítio** (`js/dados.js`). Ao passar a SaaS, este ficheiro será substituído por dados vindos do backend, por isso não espalhar dados pelo HTML.

---

## 4. Idioma e conteúdo

- **Idioma:** Português de Portugal (pt-PT). Ex.: "marcar", "telemóvel", "ecrã", "palavra-passe".
- `lang="pt-PT"` em todas as páginas.
- **Tom de voz:** sóbrio, confiante e acolhedor, com um toque de tradição. Frases curtas e diretas. Evitar gíria e exclamações em excesso.
- **Sem lorem ipsum** em secções visíveis.
- **Nome da marca:** "Salgueiro's Barbearia" (com apóstrofo). No logótipo, manter a grafia do ficheiro original.
- Preços dos produtos sempre com cêntimos: `18,00 €`. Preços dos serviços sem cêntimos quando são certos: `18 €`. Espaço antes do símbolo. Horas: `09:00`. Datas: `DD/MM/AAAA`. Telemóvel: `+351 900 000 000`.
- Nomes de serviços como o barbeiro os usa, só com a primeira letra em maiúscula: "Corte com degradé", "Cabelo e barba". Exceção: "ALL IN".
- Textos vindos do cliente em português do Brasil ("seu visual", "você") são adaptados a pt-PT e encurtados antes de entrarem no site.

---

## 5. Componentes e padrões de interface

### 5.1 Botões
- Variantes: **primário** (dourado, texto preto), **secundário** (contorno dourado sobre preto ou contorno preto sobre branco), **texto** (links de ação).
- Altura mínima **44 px** (área de toque).
- Estados obrigatórios: normal, hover, focus visível, ativo, desativado.
- Texto curto com verbo: "Marcar agora", "Ver serviços", "Entrar".
- Só **um** botão primário por bloco visível.

### 5.2 Cartões
- Mesma estrutura em todas as páginas: imagem (se existir), nome, descrição, metadados (duração, preço) e ação.
- Fundo preto com borda dourada fina, ou fundo branco com sombra suave. Não misturar os dois estilos na mesma grelha.
- O serviço em destaque (atualmente o **ALL IN**) tem um estilo próprio (badge dourado e cartão maior). Não repetir este estilo noutros serviços.

### 5.3 Formulários
- `label` visível e associado a cada campo (sem depender só de placeholder).
- Erros junto ao campo, ligados por `aria-describedby`, com texto explicativo.
- Campos de palavra-passe com botão mostrar/ocultar.

### 5.4 Carrossel e galeria
- Carrossel com setas, indicadores e deslize por toque. Sem avanço automático, ou com pausa ao passar o rato e ao focar.
- Galeria da home: faixas em movimento contínuo feitas só com CSS (`@keyframes`), com a lista de fotografias duplicada para o recomeço não se notar. Pausa ao passar o rato e ao focar com o teclado; a cópia duplicada fica fora da leitura de ecrã e da navegação por teclado; parada com `prefers-reduced-motion`.
- Lightbox com setas, fecho por **Esc** e foco preso dentro do diálogo enquanto estiver aberto.

### 5.5 Imagens
- Formatos: **WebP** preferencial, JPG ou PNG como alternativa.
- Peso máximo: **300 KB** por imagem; **500 KB** para a imagem de hero.
- Rácios fixos: hero 16:9 (ou ecrã inteiro com recorte central), barbeiro 4:5, cortes 4:5 (retrato), produtos 1:1.
- `alt` obrigatório. Imagens decorativas com `alt=""`.
- `loading="lazy"` em tudo o que estiver fora do primeiro ecrã.

### 5.6 Ícones
- Um único conjunto (sugestão: Lucide). Ícones decorativos com `aria-hidden="true"`.
- Redes sociais com ícones oficiais e `aria-label` no link (ex.: "Instagram da Salgueiro's Barbearia").

### 5.7 Hero da home
- A fotografia, a sobreposição preta e o texto branco vivem na classe partilhada `.pagina-hero` (`css/layout.css`), usada no hero da home e nos cabeçalhos de Produtos e Serviços. Os caminhos das fotografias existem num só sítio (`IMAGENS.hero` para a home e Serviços, `IMAGENS.heroProdutos` para Produtos, em `js/dados.js`).
- Cada página só muda o enquadramento com variáveis: `--hero-posicao` (zona da fotografia), `--hero-foco`, `--hero-foco-tamanho` e `--hero-foco-nucleo` (zona mais escura por trás do texto) e `--hero-sobreposicao` (opacidade).
- Texto sobre a fotografia com contraste mínimo de 4,5:1, medido sobre a captura do ecrã e não só calculado.
- A imagem de fundo tem sempre uma sobreposição preta (mínimo 40% de opacidade) para garantir leitura do nome e do slogan.
- Nome e slogan centrados horizontal e verticalmente.

---

### 5.8 Navbar
- Transparente sobre o hero, sem linhas nem sombras. Ao fazer scroll, passa para fundo preto sólido com linha dourada fina, com transição de cerca de 200 ms (desativada com `prefers-reduced-motion`).
- Ordem fixa em desktop: à esquerda Instagram, Início e Serviços; ao centro o logótipo; à direita Produtos, Marcações e "Iniciar sessão" (ou ícone de utilizador com sessão iniciada).
- Início faz scroll para o topo da home. Serviços leva à página `servicos.html`, com todos os serviços. Marcações abre o site externo de marcações em novo separador.
- O ícone de utilizador abre um menu suspenso com "Ver perfil" e "Terminar sessão". Fecha com **Esc** e com clique fora.
- O link do Instagram abre em novo separador com `rel="noopener noreferrer"` e `aria-label` descritivo.
- Estado ativo a dourado e foco visível por teclado em todos os itens.
- Em mobile, o menu hambúrguer abre um painel a ocupar o ecrã, com "Instagram da loja" em texto, Início, Serviços, Produtos e Marcações. Fecha com **Esc**, com o botão de fecho e com clique fora. A barra inferior fixa não é usada.

---

## 6. Responsividade

- **Mobile-first:** escrever CSS para ecrãs pequenos primeiro e usar `min-width` para ecrãs maiores.
- Breakpoints:
  - `768px` (tablet)
  - `1024px` (desktop)
  - `1280px` (desktop largo, opcional)
- Testar sempre em **375 px**, **768 px** e **1440 px** antes de dar uma tarefa por concluída.
- **Nunca** deve existir scroll horizontal na página (exceto dentro do carrossel).
- Em mobile, a navbar tem menu hambúrguer à esquerda, logótipo ao centro e "Iniciar sessão" (ou ícone de utilizador) à direita (ver 5.8).

---

## 7. Acessibilidade

- HTML semântico: `header`, `nav`, `main`, `section`, `article`, `footer`. Um único `h1` por página.
- Hierarquia de títulos sem saltos (h1 → h2 → h3).
- Todos os elementos interativos acessíveis por teclado, com foco visível (contorno dourado ou branco conforme o fundo).
- Menus, carrossel e lightbox com `aria-expanded`, `aria-label` e fecho com **Esc**.
- Respeitar `prefers-reduced-motion`: desativar animações e o avanço automático do carrossel.
- Links de email e telefone com `mailto:` e `tel:`.

---

## 8. Código

### 8.1 HTML
- Indentação de **2 espaços**.
- Atributos entre aspas duplas. Tags e atributos em minúsculas.
- Comentários só para separar secções grandes, ex.: `<!-- ===== SOBRE O BARBEIRO ===== -->`.

### 8.2 CSS
- Nomenclatura **BEM**: `bloco__elemento--modificador`. Ex.: `servico-card__preco--destaque`.
- Usar sempre os tokens (`var(--color-gold)`), nunca valores repetidos.
- Ordem das propriedades: posicionamento → caixa → tipografia → visual → animação.
- Não usar `!important` (exceto em casos justificados e comentados) nem IDs para estilizar.

### 8.3 JavaScript
- **ES6+**, sem `var`. `const` por defeito, `let` quando necessário.
- Variáveis e funções em **camelCase**; constantes globais em **MAIUSCULAS_COM_UNDERSCORE**.
- Um ficheiro JS por funcionalidade, carregado com `defer`.
- Proibido código inline em HTML (`onclick="..."`).
- Funções curtas com um propósito. Comentar o "porquê", não o "o quê".
- Sem dados fictícios espalhados pelo código: usar `js/dados.js`.

---

## 9. Nomes de ficheiros e pastas

- Minúsculas, sem espaços, sem acentos e sem caracteres especiais.
- Palavras separadas por hífen: `corte-assinatura.webp`, `barbeiro-retrato.webp`.
- Imagens com nome descritivo. Não manter nomes como `IMG_2034.jpg`.
- Pasta `Imagens/` (com maiúscula) da raiz deve ser movida para `assets/images/` para respeitar esta convenção.

---

## 10. Controlo de versões (Git)

- Branch principal: `main`. Trabalhar em branches de funcionalidade: `feature/pagina-servicos`, `fix/menu-mobile`.
- **Commits pequenos e frequentes**, um por alteração lógica.
- Mensagens no imperativo, consistentes:
  - Bom: `Adiciona carrossel de produtos em destaque`
  - Mau: `alterações`, `wip`, `coisas`
- Prefixos opcionais: `feat:`, `fix:`, `style:`, `docs:`, `refactor:`.
- **Nunca** fazer commit de dados pessoais reais, palavras-passe, chaves de API ou tokens.
- Fazer `pull` antes de iniciar trabalho novo.

---

## 11. Segurança e privacidade (desde já)

- Mesmo no protótipo, **não** guardar palavras-passe em `localStorage`, nem em texto simples em nenhum ficheiro.
- **Exceção assumida no protótipo:** a conta de teste do administrador (`admin@gmail.com` / `123`) está escrita em `js/dados.js`, a pedido, só para demonstrar o painel. Não é uma credencial real e sai do código quando o login passar para o Supabase Auth. A sessão guardada continua a ser só um sinal (`sessao = "admin"`), nunca a palavra-passe.
- Campos de palavra-passe sempre `type="password"`.
- Dados de clientes reais nunca entram no repositório. Usar apenas dados fictícios.
- Links externos (redes sociais, site de marcações) com `rel="noopener noreferrer"` quando abrem em novo separador.
- Política de Privacidade e Termos de Utilização obrigatórios antes de qualquer utilização real (RGPD).

---

## 12. Qualidade e revisão

Antes de considerar uma tarefa concluída:

- [ ] Funciona em mobile, tablet e desktop.
- [ ] Sem erros nem avisos na consola do navegador.
- [ ] Navegação por teclado funcional (menu, carrossel, lightbox, formulários).
- [ ] Contraste verificado nas combinações preto, dourado e branco.
- [ ] Botões dourados com texto preto.
- [ ] Imagens com `alt` e dentro do limite de peso.
- [ ] Textos revistos (ortografia pt-PT, sem lorem ipsum).
- [ ] Links internos funcionais (sem 404 entre páginas).
- [ ] Valores de cor e dados fictícios centralizados (tokens e `dados.js`).

---

## 13. Consistência entre páginas

- Cabeçalho, rodapé, botão WhatsApp e banner de cookies **idênticos** em todas as páginas.
- Cartões de serviço, produto e galeria usam **os mesmos componentes**.
- Títulos de página, breadcrumbs e CTAs seguem o mesmo padrão.
- Páginas de conta (`login`, `conta`) partilham o mesmo cartão centrado e o mesmo estilo de formulário.
- Componente novo e reutilizável: criar em `components.css` e documentar aqui.

---

## 14. Painel do barbeiro (`admin/`)

- Acesso **só para o barbeiro**, através de login. Os clientes não têm conta nem acesso ao painel.
- O barbeiro gere os dados sem precisar de mexer em código.
- No protótipo, é um ecrã de demonstração sem segurança real (`admin.html` + `js/admin.js` + `css/pages/admin.css`). A autenticação verdadeira fica para a fase de desenvolvimento.
- No protótipo, as alterações do administrador ficam no `localStorage` (chaves `admin-servicos`, `admin-produtos` e `admin-cortes`, cada uma com a lista completa). `js/dados.js` lê-as no arranque de todas as páginas e substitui as listas de exemplo. Na implementação, passam para tabelas e Storage do Supabase.
- No protótipo, as fotografias enviadas são reduzidas no navegador (lado maior até 900 px, JPEG) e guardadas como texto, para caberem no limite do `localStorage` (cerca de 5 MB). Se o espaço acabar, a alteração não é guardada e aparece um aviso.
- O texto escrito pelo administrador é guardado com os caracteres de HTML já escapados, porque entra nos modelos das páginas.
- Eliminar exige um segundo clique no mesmo botão ("Confirmar?"), em vez de uma janela de confirmação do navegador.
- Imagens enviadas são convertidas automaticamente para WebP e reduzidas ao limite de peso da secção 5.5.

### 14.1 Produtos
- Lista com imagem, nome, preço, stock, estado (ativo/inativo) e se está em destaque.
- Formulário de novo produto e de edição:
  - Nome e categoria (Cabelo, Barba, Moda)
  - Descrição
  - Fotografias (1 a 5, com pré-visualização; a primeira é a principal)
  - Preço em euros e preço promocional opcional
  - Quantidade em stock (número inteiro, mínimo 0)
  - Tamanhos opcionais (ml ou tamanho de roupa), cada um com o seu stock
  - Alerta de stock baixo ("Últimas unidades", abaixo de 2 unidades)
  - Visível na loja (sim/não)
  - Em destaque no carrossel da home (sim/não)
- Remover pede confirmação.
- Com stock a 0, o produto aparece como "Esgotado" na loja, sem ser removido.

### 14.2 Serviços
- Nome, descrição, duração, preço, categoria e fotografia opcional.
- Ativo/inativo, "em destaque" (um só serviço) e "mostrar na home" (até seis, além do destaque).

### 14.3 Destaques
- Escolher os produtos do carrossel da home e a respetiva ordem.

### 14.4 Galeria
- Enviar fotografias de cortes, com legenda e categoria (Cortes, Barbas, Antes e depois).
- Remover ou ocultar fotografias.

### 14.5 Validações
- Preço maior que 0. Stock inteiro e não negativo.
- Pelo menos uma fotografia para publicar um produto.
- Campos obrigatórios assinalados junto ao campo.

---

## 15. Decisões em aberto (a confirmar com o cliente)

1. **Serviço em destaque:** escolhi o ALL IN por ser o mais completo. Confirmar com o barbeiro se prefere destacar outro (por exemplo o Corte com degradé) e quais os seis que quer na home.
1b. **Preços e durações a confirmar:** em `cortes.md`, a Limpeza de pele aparece com 5 € e 1 hora, e Cabelo e barba com os mesmos 45 min do corte simples.
2. **Cores exatas:** confirmar os valores do dourado com o ficheiro original do logótipo.
3. **Tipografia:** aprovar a dupla serif (títulos) + sans-serif (texto).
4. **Barbeiro:** um só barbeiro em destaque ou mais barbeiros no futuro (impacta a página `equipa.html`).
5. **Produtos em destaque:** o barbeiro escolhe os destaques de forma livre, ou há um limite (ex.: máximo 6)?
6. **Conteúdo real:** morada, contactos, horários, preços, fotografias do barbeiro, da barbearia, dos cortes e dos produtos.
7. **Logótipo em alta resolução:** o ficheiro atual tem 128×144 px e é uma captura de ecrã. Pedir o original (idealmente SVG ou PNG grande com fundo transparente).
8. **Login:** métodos de entrada (email e palavra-passe, Google, telemóvel por SMS).
9. **Idioma:** pt-PT apenas ou também inglês.
10. **Contas de cliente:** o cliente cria a conta no site (`registo.html`). Falta decidir como os cortes e as compras feitos na loja ficam registados no perfil (o barbeiro regista-os no painel?) e se o email tem de ser confirmado por mensagem.
12. **Compras no site:** no protótipo, finalizar a compra regista uma encomenda para levantar e pagar na barbearia, sem pagamento. Confirmar se será reserva, encomenda com pagamento online ou só um pedido por WhatsApp.
11. **URL do site de marcações:** fornecer o endereço externo para ligar todos os botões de marcação (ver `URL_MARCACOES` em `js/dados.js`).
