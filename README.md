# CiberCidadão

Projeto da Global Solution 2026/2 (CitizenTech) - FIAP, Engenharia de Software, 1º ano.

## Descrição

O CiberCidadão vem para ajudar o cidadão brasileiro a aprender a identificar um golpe, mesmo sem acesso a informações técnicas ou ferramentas, de forma rápida e fácil.

Nossa aplicação web inicial é apenas um protótipo, simulando o que acontecerá na versão final. A aplicação foi feita com HTML semântico, CSS e JavaScript, pensando em ser escalável.

A nossa ideia é fazer com que os golpes sejam identificados por sinais e marcadores disponíveis em APIs, que reforçam a chance de ser uma ação maliciosa. Criamos inicialmente verificadores separados para cada item: WhatsApp (número), e-mail (SPF, DKIM e DMARC), link (origem e tempo do domínio e lista de sites maliciosos) e SMS (padrões de mensagem normalmente utilizados por golpistas).

Futuramente, a aplicação vai cruzar todos os dados puxados das APIs, com a lógica em JavaScript, e o resultado aparecerá na tela do usuário mostrando o que fazer de acordo com a situação.

## Como abrir e executar

Não é preciso instalar nada. Basta descompactar a pasta do projeto e abrir o arquivo index.html no navegador. Para testar, entre na página Analisar, escolha o que quer verificar, digite o conteúdo (ou clique em Testar em uma das respostas simuladas) e clique em Verificar.

## Código

Foi pedido que o projeto fosse feito em HTML semântico e tivesse um index.html fácil de abrir no navegador. Nosso projeto tem quatro páginas (index, analisar, impacto e equipe), uma pasta css com o CSS global, uma pasta img com o logo e os ícones, e uma pasta js com os scripts, sendo um arquivo para cada verificador (whatsapp, email, link e sms).

JavaScript: todo o JavaScript foi criado pensando em uma simulação antes de termos as APIs oficiais. Fizemos um "banco de dados" com um array de 10 registros, que simula as respostas que as APIs vão devolver no futuro, e é nele que as funções de cada verificador consultam as condições para validar o resultado. Também temos um JavaScript separado (analisar.js) que identifica qual tipo de análise o usuário deseja (número, link, e-mail etc.) e, a partir da opção escolhida, chama automaticamente o verificador certo.

Um ponto especial: os campos digitáveis têm o tratamento adequado. Por exemplo, se o usuário não digitar um e-mail no formato correto, a aplicação devolve "E-mail inválido. Ex.: nome@empresa.com", e assim por diante em todos os campos.

HTML: os elementos têm id para que o JavaScript os encontre com getElementById e preencha os campos corretos com o resultado das funções, principalmente na página Analisar. As outras páginas apresentam o problema principal e a solução.

CSS: fizemos uma estilização global e declaramos variáveis de cores no início para facilitar. Estilizamos a barra de progresso para chamar a atenção do usuário, ficando vermelha, amarela ou verde conforme o risco. Não podemos deixar de falar da usabilidade: tratamos também o tamanho das fontes, para que diferentes usuários se adaptem da melhor forma, e usamos @media para adaptar a dispositivos menores, com menu hambúrguer e o layout bem encaixado.

## Uso de IA

Usamos IA para praticidade: correção de código, partes mais extensas, algumas estilizações e correção de texto.

## Integrantes

Davi Gonçalves Pereira - RM
Guilherme Luz Rosal - RM
Pedro Manoel Fernandes Nogueira - RM
Gustavo Rodrigues Sanchez de Oliveira - RM

## Vídeo pitch

(link do vídeo)

## lINK DO DEPLOY
https://ciber-cidadao.vercel.app/index.html
