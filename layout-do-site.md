# Layout do Site — Salgueiro's Barbearia

> Protótipo de UI para apresentar ao cliente. Os dados (produtos, preços, barbeiro, horários, morada, contactos) são fictícios e estáticos. As marcações são feitas num site externo, através de hiperligação. O login é um ecrã de demonstração, sem autenticação real nesta fase.

---

## 1. Estrutura geral de páginas

| # | Página | Ficheiro sugerido | Objetivo principal |
|---|--------|-------------------|--------------------|
| 1 | Início | `index.html` | Apresentar a barbearia, o barbeiro, os serviços, os produtos e a galeria |
| 2 | Serviços | `servicos.html` | Lista completa dos serviços, com duração e preço |
| 2b | Produtos | `produtos.html` | Catálogo de produtos da loja (os mesmos do carrossel da home) |
| 3 | Galeria | `galeria.html` | Página completa com os cortes realizados para clientes |
| 4 | Contactos | `contactos.html` | Localização, contactos e horário com mapa |
| 5 | Entrar | `login.html` | Login de cliente (ecrã de demonstração) |
| 6 | Conta | `conta.html` | Dados do cliente e histórico (ecrã de demonstração, a confirmar) |
| 7 | 404 | `404.html` | Página de erro com link para o início |
| 7b | Termos de Utilização | `termos.html` | Condições de uso do site, da conta, das marcações e das encomendas |
| 7c | Política de Privacidade | `privacidade.html` | Dados recolhidos, finalidades, cookies e direitos (RGPD) |
| 8 | Painel do barbeiro | `admin/` | Gerir produtos, serviços, destaques e galeria (acesso só do barbeiro, com login) |

Notas:
- **Serviços:** a home mostra 7 serviços (o destaque e mais 6) e o botão "Ver todos os serviços" leva a `servicos.html`, com a lista completa de 11. O botão "Serviços" da navbar continua a levar à secção da home.
- **Não existe página de Marcações.** As marcações são feitas num site externo, através de hiperligação (secção 8).
- **Não existe página de criação de conta.** Esta funcionalidade foi abandonada.

Páginas fora deste protótipo (fase seguinte): área de administração do barbeiro, pagamentos online e notificações.

---

## 2. Componentes globais (presentes em todas as páginas)

### 2.1 Navbar (cabeçalho)

Em desktop, três zonas:
- **Esquerda:** ícone do Instagram (hiperligação para o perfil da barbearia, em novo separador), botão **Início** e botão **Serviços**.
- **Centro:** logótipo da barbearia (`Imagens/image.png`, a mover para `assets/images/logo/`).
- **Direita:** botão **Produtos**, botão **Marcações** e:
  - **Carrinho:** ícone com o número de artigos. Abre um painel lateral à direita (ver secção 4.1). Com a conta de administrador, no lugar do carrinho aparece um **sino** com o número de encomendas por ver, que leva ao separador "Encomendas" do painel.
  - Sem sessão: ícone de utilizador (leva a `login.html`).
  - Com sessão: avatar dourado com as iniciais do cliente. Ao clicar, abre um menu suspenso com **Ver perfil** (`conta.html`) e **Terminar sessão**. Fecha com Esc e com clique fora.

Destino de cada botão:

| Botão | Comportamento |
|-------|---------------|
| **Início** | Faz scroll para o topo da home. Noutras páginas, leva a `index.html` no topo. |
| **Serviços** | Leva a `servicos.html`, a página com todos os serviços. Na home, o botão "Ver serviços" do hero continua a fazer scroll até à secção `#servicos`. |
| **Produtos** | Leva a `produtos.html`. |
| **Marcações** | Abre o site externo de marcações, em novo separador. O URL fica a definir. |
| **Instagram** | Abre o perfil da barbearia, em novo separador. |

Comportamento visual:
- **Estado inicial (sobre o hero):** transparente, sem fundo nem linhas. Texto, ícones e logótipo a branco.
- **Ao fazer scroll:** animação suave (fade e pequeno deslize, cerca de 200 ms) para uma barra preta sólida, com linha dourada fina por baixo e ligeira sombra. Fica fixa no topo (sticky).
- Página ativa destacada a dourado.

**Versão mobile:**
- **Esquerda:** ícone de menu (hambúrguer). Abre um painel lateral a ocupar o ecrã com, por esta ordem: texto **"Instagram da loja"**, **Início**, **Serviços**, **Produtos** e **Marcações**.
- **Centro:** logótipo da barbearia.
- **Direita:** botão **"Iniciar sessão"**. Com sessão iniciada, passa a ícone de utilizador, com o mesmo menu suspenso do desktop.
- O painel fecha com **Esc**, com o botão de fecho e com clique fora.

### 2.2 Rodapé
- Ver secção 3.6 (a informação completa fica no rodapé da home). Nas restantes páginas, o rodapé é a versão resumida: logótipo, links rápidos, redes sociais e linha de copyright.

### 2.3 Botão flutuante de WhatsApp
- Canto inferior direito, visível em todas as páginas.
- Abre conversa de WhatsApp com a barbearia (número fictício).

### 2.4 Aviso de cookies
- Barra discreta no fundo, com "Aceitar" e "Saber mais". Só visual no protótipo.

---

## 3. Página Início (`index.html`)

Ordem das secções, de cima para baixo:

### 3.1 Hero (imagem de abertura)
- **Imagem de fundo a ocupar o ecrã inteiro** (fotografia da barbearia), com uma sobreposição preta semitransparente para garantir leitura.
- **Centrado:**
  - Nome da barbearia: **Salgueiro's Barbearia**, em tipografia serif, a branco e dourado (o logótipo pode aparecer por cima do nome).
  - **Slogan** curto (texto de exemplo, ex.: *"Tradição, precisão e um corte à sua medida."*), em branco.
  - Botão dourado grande **"Marcar agora"** (hiperligação para o site externo de marcações).
  - Botão secundário de contorno **"Ver serviços"** (faz scroll até à secção 3.3).
- Indicador de scroll para baixo (seta animada).

### 3.2 Sobre a barbearia e o barbeiro
- Fundo branco. Duas colunas em desktop (fotografia à esquerda, texto à direita); em mobile, empilhadas.
- **Bloco da barbearia:** história da casa (texto fictício), valores e ambiente.
- **Bloco do barbeiro:**
  - Fotografia de retrato (formato 4:5).
  - Nome (fictício, ex.: "Salgueiro"), título e anos de experiência.
  - Pequena biografia e especialidades (etiquetas: "Corte de assinatura", "Barba clássica", "Fade").
  - Dois ou três números de destaque (ex.: "+10 anos", "+5 000 cortes", "4,9 de classificação").
  - Botão "Marcar com [nome]" (hiperligação para o site externo de marcações).

### 3.3 Serviços (âncora `#servicos`)
- Fundo preto, títulos a branco e dourado.
- Título da secção: "Os nossos serviços".
- **Cartão em destaque: Corte de Assinatura** (ocupa a largura toda ou a primeira linha):
  - Badge dourado "Mais pedido" ou "Assinatura da casa".
  - Imagem grande do corte, nome, descrição (o que o inclui: lavagem, corte, acabamento, toalha quente).
  - Duração e preço (ex.: "45 min · 18 €").
  - Botão dourado "Marcar o meu corte" (hiperligação para o site externo de marcações).
- **Restantes serviços** numa grelha de 3 colunas em desktop, 1 em mobile:
  - Corte clássico, Barba, Corte + Barba, Tratamento capilar, Design de sobrancelha (exemplos).
  - Cada cartão: nome, descrição curta, duração, preço e botão "Marcar" (hiperligação para o site externo).
- **Serviços reais** (vindos de `cortes.md`): o destaque é o **ALL IN** (cabelo, barba, sobrancelha e pele; 1 h 30 min; 20 €) e os seis cartões são Corte com degradé, Corte social, Cabelo e barba, Barba a shaver ou navalha, Corte com degradé + sobrancelha e Corte de criança.
- Botão "Ver todos os serviços" (leva a `servicos.html`), onde aparecem também Cabelo + barba + sobrancelha, Rapar cabelo + barba, Limpeza de pele e Sobrancelha.
- Quais aparecem na home define-se com `home: true` em `SERVICOS` (`js/dados.js`); o destaque com `assinatura: true`.

- **Detalhe do serviço:** clicar num serviço (na home ou em `servicos.html`) abre uma janela com a fotografia de exemplo (espaço reservado enquanto o serviço não tiver fotografia), nome, preço, tempo, descrição e o botão "Marcar", que leva ao site de marcações. Fecha no "X", com Esc ou com clique fora. O botão "Marcar" de cada cartão continua a ir direto para as marcações.

### 3.4 Produtos em destaque (carrossel)
- Fundo branco.
- Título: "Mais vendidos da loja".
- **Carrossel** de cartões de produto: imagem, nome, marca, preço e botão "Adicionar" (simulado).
- Controlos: setas anterior/seguinte, indicadores (pontos) e deslize por toque em mobile.
- Apresenta 4 produtos em desktop, 2 em tablet e 1 em mobile.
- **Destaques escolhidos pelo barbeiro:** os produtos a aparecer no carrossel são marcados como "em destaque" pelo barbeiro (campo de dados no protótipo, a simular com `destaque: true`). No protótipo, mostram-se 6 produtos fictícios.
- Link: "Ver todos os produtos" (leva a `produtos.html`).

### 3.5 Galeria de cortes de clientes
- Fundo preto ou cinzento-escuro, com títulos a dourado.
- Título: "Cortes dos nossos clientes".
- Carrossel contínuo de fotografias de cortes (formato retrato 4:5), de uma ponta à outra do ecrã: **2 faixas** em todos os ecrãs.
- As faixas deslizam sozinhas e sem fim, em sentidos alternados e a velocidades ligeiramente diferentes. Cada faixa mostra todas as fotografias, a começar num ponto diferente.
- Ao passar o rato por cima, o carrossel **para** e a fotografia em causa fica em destaque: cresce um pouco, ganha contorno dourado e legenda com o nome do corte, e as restantes escurecem.
- Ao clicar, abre uma visualização em ecrã inteiro (lightbox) com setas e fecho por Esc.
- Com "reduzir movimento" ativo no sistema, as faixas ficam paradas e percorrem-se com scroll horizontal.
- Link: "Ver galeria completa" (leva a `galeria.html`).

### 3.6 Rodapé com informação completa (Contactos)
Fundo preto, texto branco e detalhes a dourado. Organizado em colunas (desktop) ou em blocos empilhados (mobile):

1. **Logótipo e slogan** curto.
2. **Localização:** morada completa (fictícia) e mapa embutido ou imagem estática do mapa, com botão "Como chegar".
3. **Contactos:**
   - Telemóvel (ligação `tel:` clicável)
   - Email (ligação `mailto:` clicável)
   - Botão "Falar no WhatsApp"
4. **Horário de funcionamento** por dia da semana (horário real: Ter, Qua e Sex 09:30–12:30 e 14:00–20:00 · Qui 09:30–12:30 e 14:00–19:20 · Sáb 09:00–12:30 e 14:00–20:00 · Dom e Seg encerrado). Indicação "Aberto agora" / "Fechado" calculada pela hora atual (no protótipo, pode ser fixa).
5. **Redes sociais:** ícones de Instagram, Facebook e TikTok (links de exemplo).
6. **Links rápidos:** Início, Serviços, Produtos e Marcações.
7. **Linha final:** copyright, "Política de Privacidade" e "Termos de Utilização" (páginas placeholder).

---

## 4. Página Produtos (`produtos.html`)

- **Cabeçalho:** faixa de cerca de 300 px com uma fotografia própria (`IMAGENS.heroProdutos`), enquadrada na prateleira de frascos do lado direito. Caminho, título e texto ficam à esquerda, por cima da sobreposição preta. A página de Serviços usa a mesma faixa com a fotografia do hero da home, enquadrada na cadeira de barbeiro.

1. **Cabeçalho da página** em fundo preto, com o título "Produtos" e breadcrumb (Início > Produtos).
2. **Barra de pesquisa grande**, a toda a largura, por cima de tudo: procura por nome, categoria ou subcategoria, ignorando maiúsculas e acentos.
3. **Filtros na coluna da esquerda** (280 px, acompanha o scroll). Em tablet e mobile ficam numa caixa "Filtros" que abre e fecha, com o número de filtros ativos.
   - **Categorias e subcategorias**, com o número de produtos de cada uma: Cabelo (Ceras e pomadas, Champôs, Pós e sprays), Barba (Óleos e bálsamos, Pentes e escovas) e Moda (T-shirts, Bonés, Sweatshirts).
   - **Preço:** barra com dois cursores para arrastar (mínimo e máximo) e dois campos para escrever os valores à mão. Os limites vêm do produto mais barato e do mais caro.
   - **Ordenar por:** Nome (A–Z, por defeito), Nome (Z–A), Preço (mais baixo primeiro) e Preço (mais alto primeiro).
   - **Disponibilidade:** "Só produtos em stock" e "Só destaques do barbeiro".
   - Botão **"Limpar filtros"**, que repõe tudo, incluindo a pesquisa.
4. **Contagem** de resultados e mensagem "Nenhum produto encontrado" com botão "Limpar filtros".
5. **Grelha de produtos** (3 colunas em desktop e tablet, 2 em mobile): imagem, categoria, nome e preço.
6. No painel de administração, cada produto tem categoria e subcategoria.
7. **Etiquetas:** "Destaque" nos produtos escolhidos pelo barbeiro, "Esgotado" com stock a 0 e "Últimas unidades" com menos de 2 unidades em stock (`STOCK_BAIXO`, em `js/main.js`). No cartão conta o stock total do produto; no detalhe, o stock do tamanho escolhido.
8. **Animações:** os cartões entram em cascata sempre que a lista muda.
9. Clicar num produto (aqui ou no carrossel da home) abre o detalhe, de onde se adiciona ao carrinho.

### 4.1 Detalhe do produto, carrinho e encomendas (`js/loja.js`)

- **Detalhe do produto:** janela com a fotografia grande e as miniaturas (no protótipo, uma fotografia por produto), categoria, nome, preço e descrição. Conforme o produto, escolhe-se o **tamanho** (em ml ou tamanho de roupa; os produtos sem tamanhos são de tamanho único) e a **quantidade**. Cada tamanho tem o seu stock: um tamanho esgotado aparece riscado e não se pode escolher, a quantidade é limitada ao stock desse tamanho e "Últimas unidades" aparece quando o tamanho escolhido tem menos de 2 unidades. "Adicionar ao carrinho" fecha a janela e abre o carrinho. Um produto esgotado mostra o botão desativado "Esgotado".
- **Carrinho:** painel lateral à direita, aberto pelo ícone da navbar. Cada linha tem fotografia, nome, tamanho, preço, seletor de quantidade (mais e menos unidades), botão de remover e subtotal. Em baixo, o total e "Finalizar compra". Sem sessão, o botão é "Iniciar sessão para finalizar" e leva ao login; o carrinho mantém-se.
- **Finalizar compra:** no protótipo não há pagamento. A compra fica registada como encomenda, o carrinho esvazia e aparece "Compra registada" (levantar e pagar na barbearia). As compras feitas passam a aparecer no separador "Compras" do perfil.
- **Aviso ao administrador:** com a conta de administrador, o sino da navbar mostra quantas encomendas há por ver e aparece o aviso "Tem N encomendas novas". No painel, o separador **Encomendas** é o primeiro e abre por defeito. Cada encomenda é um cartão com o avatar e o nome do cliente, o número e a data, o email e o telemóvel (clicáveis), os artigos (fotografia, produto, tamanho, quantidade e subtotal) e o total. As novas têm a etiqueta "Nova" e uma faixa dourada no topo; deixam de contar no sino assim que o painel é aberto. Podem ser eliminadas.
- **Onde fica guardado:** no `localStorage` (chaves `carrinho` e `encomendas`), por isso o cliente e o administrador têm de usar o mesmo navegador. O stock não é descontado ao finalizar. O preço é igual em todos os tamanhos.

---

## 5. Página Galeria (`galeria.html`)

1. **Cabeçalho da página** com título e breadcrumb.
2. **Filtros:** Todos, Cortes, Barbas, Antes e depois.
3. **Grelha de imagens** (2, 3 ou 4 colunas consoante o ecrã), com legendas.
4. **Lightbox** com setas, fecho por Esc e navegação por teclado.
5. **Secção "Antes e depois"** com comparação lado a lado (slider opcional).
6. **CTA:** "Quer um resultado destes? Marque já" (hiperligação para o site externo de marcações).

---

## 6. Página Contactos (`contactos.html`)

1. **Cabeçalho da página** com título e breadcrumb.
2. **Dados de contacto:** morada, telemóvel, email, WhatsApp e horário.
3. **Mapa:** placeholder ou embed do mapa.
4. **Formulário de contacto:** nome, email, assunto, mensagem e botão "Enviar" (simulado, mostra mensagem de sucesso).
5. **Perguntas frequentes (FAQ):** 4 a 5 perguntas em acordeão (ex.: "Aceitam cartão?", "Posso cancelar uma marcação?").

---

## 7. Páginas de conta (ecrãs de demonstração)

Login e criar conta partilham a mesma disposição em duas metades: **formulário à esquerda** em fundo branco (logótipo, título com linha dourada, campos e botão dourado) e **fotografia à direita** a ocupar a altura toda. Em telemóvel e tablet, a fotografia desaparece e fica só o formulário. São **ecrãs isolados, sem navbar, sem rodapé e sem botão de WhatsApp**: o logótipo e a ligação "Voltar ao site" levam à home. A fotografia define-se em `IMAGENS.login`, em `js/dados.js` (vertical, 4:5).

### 7.1 Entrar (`login.html`)
- Campos de email e palavra-passe (com botão mostrar/ocultar) e botão dourado "Entrar".
- Ligação "Ainda não tem conta? Criar conta" (leva a `registo.html`).

### 7.2 Criar conta (`registo.html`)
- Formulário curto: nome, telemóvel, email, confirmar email, palavra-passe (mínimo de 8 caracteres, com botão mostrar/ocultar) e caixa obrigatória de aceitação dos Termos e da Política de Privacidade.
- Validação junto a cada campo; a confirmação tem de repetir o email.
- Ao criar a conta, a sessão fica iniciada e o cliente segue para o perfil.
- Ligações cruzadas: "Já tem conta? Iniciar sessão" aqui e "Ainda não tem conta? Criar conta" no login.
- No protótipo, a conta não é criada de verdade: o perfil mostra os dados escritos, com o histórico de exemplo.

### 7.3 Perfil (`conta.html`)
- Acessível pelo menu do avatar ("Ver perfil") com sessão iniciada. Sem sessão, redireciona para `login.html`.
- **Topo (fundo preto):** avatar com as iniciais, "Olá, [nome]", desde quando é cliente e botão "Marcar próximo corte" (site externo).
- **Dois separadores**, para mostrar só um assunto de cada vez:
  - **Compras:** um cartão por compra, com a data, o estado ("Pago" nas compras feitas na barbearia, "Por pagar" nas encomendas do site), os artigos (fotografia, produto, tamanho, quantidade × preço e subtotal) e o total. Cada artigo tem "Voltar a comprar", ou "Esgotado de momento" se não houver stock. À esquerda (por cima, em ecrãs estreitos) há opções para organizar por data da compra (mais recentes ou mais antigas primeiro) ou por preço (total mais alto ou mais baixo primeiro).
  - **Os meus dados:** cartão "Dados pessoais" com nome, email e telemóvel, um por linha e cada um com o seu ícone, em modo de leitura. "Editar dados" (no topo do cartão) torna os campos editáveis, com "Guardar alterações" e "Cancelar" e validação junto a cada campo. Ao guardar, o nome e as iniciais atualizam-se no topo e na navbar. "Terminar sessão" está só no menu do avatar.
- No protótipo, os dados editados ficam guardados só no navegador e voltam ao exemplo ao terminar sessão.
- "Voltar a comprar" abre o detalhe do produto, para escolher o tamanho e a quantidade e adicionar ao carrinho (secção 4.1).
- O cliente de exemplo e o seu histórico estão em `UTILIZADOR`, em `js/dados.js`.

---

## 8. Marcações (hiperligação externa)

- Não existe página de marcação no site. Todos os botões de marcação (navbar, hero, serviços, sobre o barbeiro, galeria) são **hiperligações para o site externo de marcações**.
- Abrem sempre em **novo separador**, com `rel="noopener noreferrer"`.
- Um único URL configurável em `js/dados.js` (ex.: `URL_MARCACOES`), para mudar em todos os botões de uma vez.
- URL a definir pelo cliente.

---

## 9. Painel do barbeiro (`admin/`)

Acesso só para o barbeiro, com login. Os clientes não veem este painel. No protótipo é um ecrã de demonstração.

- **Menu lateral** (desktop) ou menu no topo (mobile): Produtos, Serviços, Destaques, Galeria e Sair.
- **Produtos:** lista com imagem, nome, preço, stock e estado. Botão "Adicionar produto" abre o formulário com nome, marca, categoria, descrição, fotografias (1 a 5), preço e preço promocional, quantidade em stock, visibilidade na loja e destaque no carrossel.
- **Serviços:** lista e formulário com nome, descrição, duração, preço, categoria, fotografia e estado ativo/inativo.
- **Destaques:** escolha dos produtos do carrossel da home e respetiva ordem.
- **Galeria:** envio de fotografias de cortes, com legenda e categoria, e remoção ou ocultação.
- Remover pede confirmação. Produto com stock a 0 aparece como "Esgotado" na loja.

Detalhes e validações na secção 14 de `regras-e-padroes.md`.

### 9.1 O que o protótipo já tem (`admin.html`)

- **Entrada:** em `login.html`, com a conta de teste `admin@gmail.com` e a palavra-passe `123`. O avatar da navbar passa a ter "Painel de administração" no lugar de "Ver perfil". Quem não é administrador e abre `admin.html` é enviado para o login (ou para o perfil, se for cliente).
- **Topo preto** igual ao do perfil, com o botão "Ver o site".
- **Quatro separadores:** Encomendas (as compras dos clientes, ver secção 4.1; é o que abre por defeito), Serviços, Produtos e Galeria. Nos três últimos, a lista do que existe no site ocupa a largura toda e tem por cima o botão "Adicionar serviço", "Adicionar produto" ou "Adicionar fotografia", que abre o formulário numa janela (pop-up). A janela fecha no "X", em "Cancelar" ou com Esc.
- **Serviços:** adicionar, alterar e eliminar. Formulário com nome, descrição, preço, tempo estimado (minutos), fotografia opcional e a opção "Mostrar também na página inicial". A fotografia aparece no topo do cartão do serviço.
- **Produtos:** adicionar, alterar e eliminar. Formulário com nome, categoria, descrição opcional, preço, quantidade em stock, tamanhos opcionais (ml ou tamanho de roupa, cada um com o seu stock; com tamanhos, o stock do produto passa a ser a soma e deixa de se escrever), fotografia opcional e a opção de aparecer no carrossel de destaques.
- **Galeria:** adicionar (nome do corte + fotografia obrigatória) e remover fotografias do carrossel da home.
- Eliminar pede um segundo clique ("Confirmar?"). Alterar (lápis) abre a mesma janela já preenchida, com o título "Alterar…" e o botão "Guardar alterações".
- **Onde fica guardado:** no `localStorage` do navegador. Qualquer visitante que abra o site nesse navegador, mesmo sem sessão, vê as alterações. O botão "Repor dados de exemplo" apaga tudo o que o administrador fez.

---

## 10. Estados e comportamentos a mostrar no protótipo

- **Animação de abertura:** ecrã preto com a imagem do logótipo dourado ao centro (`assets/images/logo/splash-salgueiros.webp`), que surge suavemente e desliza para cima ao fim de cerca de 1 segundo. Aparece só na primeira página aberta em cada visita (não se repete ao navegar entre páginas) e não aparece com `prefers-reduced-motion`.
- Entrada em cascata do conteúdo do hero e do cabeçalho das páginas interiores.
- Navbar transparente sobre o hero, que passa a sólida com animação ao fazer scroll. Nas páginas interiores, é sempre sólida.
- Botão "Ver serviços" do hero com scroll suave até à secção de serviços da home.
- Painel hambúrguer aberto e fechado com animação suave (mobile).
- Menu suspenso do utilizador (Ver perfil e Terminar sessão) com sessão iniciada.
- Hover nos cartões e botões (elevação ou ligeiro brilho dourado).
- Estados de botão: normal, hover, focus visível, ativo, desativado.
- Carrossel com deslize e indicadores.
- Lightbox na galeria.
- Mensagens de sucesso e erro no formulário de contactos e no login.
- Página 404 simples.
- Animações leves ao fazer scroll (desativadas se `prefers-reduced-motion`).

---

## 10. Responsividade (resumo)

| Breakpoint | Largura | Comportamento |
|------------|---------|---------------|
| Mobile | até 767 px | Coluna única, navbar com menu hambúrguer à esquerda, logótipo ao centro e "Iniciar sessão" à direita, botões em largura total, carrossel de 1 item |
| Tablet | 768 px – 1023 px | Grelhas de 2 colunas, carrossel de 2 itens |
| Desktop | 1024 px ou mais | Grelhas de 3–4 colunas, navbar horizontal completa, carrossel de 4 itens |

---

## 11. Conteúdo fictício a usar no protótipo

- **Nome:** Salgueiro's Barbearia.
- **Slogan (exemplo):** "Tradição, precisão e um corte à sua medida."
- **Barbeiro (exemplo):** Salgueiro, 10 anos de experiência.
- **Morada (real):** Avenida do Antigo Concelho, 365 — 4905-604 Geraz do Lima (Santa Maria).
- **Telemóvel:** +351 900 000 000 (fictício).
- **Email:** geral@salgueiros-barbearia.pt (fictício).
- **Horário (real):** Ter, Qua e Sex 09:30–12:30 e 14:00–20:00 · Qui 09:30–12:30 e 14:00–19:20 · Sáb 09:00–12:30 e 14:00–20:00 · Dom e Seg encerrado.
- **URL de marcações (real):** página da barbearia na Fresha, definida em `URL_MARCACOES` (`js/dados.js`).
- **Instagram (real):** `https://www.instagram.com/salgueiro.s_barbearia/`, definido em `URL_INSTAGRAM`.
- **Imagens:** placeholders identificados como "imagem de exemplo" até chegarem as fotografias reais.
