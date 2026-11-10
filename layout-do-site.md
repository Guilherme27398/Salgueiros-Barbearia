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
  - Sem sessão: ícone de utilizador (leva a `login.html`).
  - Com sessão: avatar dourado com as iniciais do cliente. Ao clicar, abre um menu suspenso com **Ver perfil** (`conta.html`) e **Terminar sessão**. Fecha com Esc e com clique fora.

Destino de cada botão:

| Botão | Comportamento |
|-------|---------------|
| **Início** | Faz scroll para o topo da home. Noutras páginas, leva a `index.html` no topo. |
| **Serviços** | Faz scroll até à secção de serviços da home (âncora `#servicos`). Noutras páginas, leva a `index.html#servicos`. |
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
4. **Horário de funcionamento** por dia da semana (ex.: Ter–Sáb 09:00–19:00 · Dom e Seg encerrado). Indicação "Aberto agora" / "Fechado" calculada pela hora atual (no protótipo, pode ser fixa).
5. **Redes sociais:** ícones de Instagram, Facebook e TikTok (links de exemplo).
6. **Links rápidos:** Início, Serviços, Produtos e Marcações.
7. **Linha final:** copyright, "Política de Privacidade" e "Termos de Utilização" (páginas placeholder).

---

## 4. Página Produtos (`produtos.html`)

1. **Cabeçalho da página** em fundo preto, com o título "Produtos" e breadcrumb (Início > Produtos).
2. **Barra de pesquisa:** procura por nome ou categoria, ignorando maiúsculas e acentos.
3. **Filtro por categoria:** Todos, Cabelo, Barba e Moda (a barbearia também vende roupa).
4. **Ordenação:** Nome (A–Z, por defeito), Nome (Z–A), Preço (mais baixo) e Preço (mais alto).
5. **Contagem** de resultados e mensagem "Nenhum produto encontrado" com botão "Limpar filtros".
6. **Grelha de produtos** (4 colunas em desktop, 3 em tablet, 2 em mobile): imagem, categoria, nome e preço.
7. **Etiquetas:** "Destaque" nos produtos escolhidos pelo barbeiro, "Esgotado" com stock a 0 e "Últimas unidades" com stock até 3.
8. **Animações:** os cartões entram em cascata sempre que a lista muda.
9. Sem carrinho nem compra online: os produtos são vendidos na barbearia.

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
- **Topo (fundo preto):** avatar com as iniciais, "Olá, [nome]", desde quando é cliente e botão "Marcar próximo corte" (site externo). Por baixo, uma faixa com três números: cortes feitos, corte mais habitual e última visita.
- **Dois separadores**, para mostrar só um assunto de cada vez:
  - **Compras:** cartões dos produtos já adquiridos, com fotografia, data da compra, nome e preço atual. Cada um tem o botão "Voltar a comprar"; se o produto estiver sem stock, o botão aparece desativado como "Esgotado".
  - **Os meus dados:** nome, email e telemóvel em modo de leitura. "Editar dados" torna os campos editáveis, com "Guardar alterações" e "Cancelar" e validação junto a cada campo. Ao guardar, o nome e as iniciais atualizam-se no topo e na navbar. No fim, "Terminar sessão".
- No protótipo, os dados editados ficam guardados só no navegador e voltam ao exemplo ao terminar sessão.
- "Voltar a comprar" é simulado no protótipo: mostra o aviso "Reserva feita" e o botão passa a "Reservado". Não há carrinho nem pagamento.
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
- **Topo preto** igual ao do perfil, com o número de serviços, produtos e fotografias da galeria, e o botão "Ver o site".
- **Três separadores:** Serviços, Produtos e Galeria. Em cada um, o formulário fica à esquerda e a lista do que existe no site à direita (em mobile, formulário por cima).
- **Serviços:** adicionar, alterar e eliminar. Formulário com nome, descrição, preço, tempo estimado (minutos), fotografia opcional e a opção "Mostrar também na página inicial". A fotografia aparece no topo do cartão do serviço.
- **Produtos:** adicionar, alterar e eliminar. Formulário com nome, categoria, preço, quantidade em stock, fotografia opcional e a opção de aparecer no carrossel de destaques.
- **Galeria:** adicionar (nome do corte + fotografia obrigatória) e remover fotografias do carrossel da home.
- Eliminar pede um segundo clique ("Confirmar?"). Alterar preenche o formulário, que fica com contorno dourado e o botão "Guardar alterações".
- **Onde fica guardado:** no `localStorage` do navegador. Qualquer visitante que abra o site nesse navegador, mesmo sem sessão, vê as alterações. O botão "Repor dados de exemplo" apaga tudo o que o administrador fez.

---

## 10. Estados e comportamentos a mostrar no protótipo

- **Animação de abertura:** ecrã preto com o logótipo, uma linha dourada e o nome, que desliza para cima ao fim de cerca de 2 segundos. Aparece só na primeira página aberta em cada visita (não se repete ao navegar entre páginas) e não aparece com `prefers-reduced-motion`.
- Entrada em cascata do conteúdo do hero e do cabeçalho das páginas interiores.
- Navbar transparente sobre o hero, que passa a sólida com animação ao fazer scroll. Nas páginas interiores, é sempre sólida.
- Âncora "Serviços" com scroll suave até à secção.
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
- **Morada:** Rua de exemplo, 123 — 4900-000 Viana do Castelo (fictícia).
- **Telemóvel:** +351 900 000 000 (fictício).
- **Email:** geral@salgueiros-barbearia.pt (fictício).
- **Horário:** Ter–Sáb 09:00–19:00 · Dom e Seg encerrado (exemplo).
- **URL de marcações (real):** página da barbearia na Fresha, definida em `URL_MARCACOES` (`js/dados.js`).
- **Instagram (real):** `https://www.instagram.com/salgueiro.s_barbearia/`, definido em `URL_INSTAGRAM`.
- **Imagens:** placeholders identificados como "imagem de exemplo" até chegarem as fotografias reais.
