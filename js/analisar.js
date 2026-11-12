/* =========================================================
   CiberCidadão — Página Analisar

   Conforme a opção escolhida, chama o verificador certo:
     WhatsApp -> verificarWhatsapp()  (js/verificadores/whatsapp.js)
     E-mail   -> verificarEmail()     (js/verificadores/email.js)
     Link     -> verificarLink()      (js/verificadores/link.js)
     SMS      -> verificarSms()       (js/verificadores/sms.js)

   Todo verificador devolve um resultado no mesmo formato:
     { consultado, terminal, porcentagem, golpe, verificacoes, dica }
   ========================================================= */

/* ---------- Elementos da página ---------- */
const formulario = document.getElementById("formulario");
const opcoesCanal = document.querySelectorAll('input[name="canal"]');
const erroCanal = document.getElementById("erro-canal");
const avisoCanal = document.getElementById("aviso-canal");

const grupoValor = document.getElementById("grupo-valor");
const rotuloValor = document.getElementById("rotulo-valor");
const campoValor = document.getElementById("valor");
const dicaValor = document.getElementById("dica-valor");
const erroValor = document.getElementById("erro-valor");

const grupoMensagem = document.getElementById("grupo-mensagem");
const campoMensagem = document.getElementById("mensagem");
const erroMensagem = document.getElementById("erro-mensagem");

const botaoVerificar = document.getElementById("botao-verificar");
const mensagemStatus = document.getElementById("mensagem-status");
const terminal = document.getElementById("terminal");

const secaoResultado = document.getElementById("resultado");
const porcentagem = document.getElementById("porcentagem");
const barraRisco = document.getElementById("barra-risco");
const selo = document.getElementById("selo");
const resultadoTitulo = document.getElementById("resultado-titulo");
const consultado = document.getElementById("consultado");
const alertaGolpe = document.getElementById("alerta-golpe");
const listaVerificacoes = document.getElementById("lista-verificacoes");
const listaAcoes = document.getElementById("lista-acoes");

const tituloRespostas = document.getElementById("titulo-respostas");
const descricaoRespostas = document.getElementById("descricao-respostas");
const listaRespostas = document.getElementById("lista-respostas");

/* Textos de cada opção */
const textosCanal = {
  whatsapp: {
    nome: "WhatsApp",
    rotulo: "/ Número do WhatsApp",
    exemplo: "Ex.: (31) 99999-0000",
    dica: "Digite o número com DDD. Número de outro país? Comece com + e o código do país."
  },
  email: {
    nome: "E-mail",
    rotulo: "/ E-mail do remetente",
    exemplo: "Ex.: atendimento@empresa.com",
    dica: "Copie o endereço que aparece ao lado do nome de quem enviou."
  },
  link: {
    nome: "Site",
    rotulo: "/ Link ou site",
    exemplo: "Ex.: www.site.com.br",
    dica: "Cole o link sem abrir o site."
  },
  sms: {
    nome: "SMS"
  }
};

let canalEscolhido = "";

/* =========================================================
   1. ESCOLHA DA OPÇÃO
   ========================================================= */

opcoesCanal.forEach(function (opcao) {
  opcao.addEventListener("change", function () {
    escolherCanal(opcao.value);
  });
});

function escolherCanal(canal) {
  canalEscolhido = canal;
  document.getElementById("canal-" + canal).checked = true;

  limparErros();
  secaoResultado.hidden = true;
  terminal.hidden = true;
  avisoCanal.hidden = true;

  /* SMS usa a caixa de texto; os outros usam o campo de uma linha */
  if (canal === "sms") {
    grupoValor.hidden = true;
    grupoMensagem.hidden = false;
  } else {
    grupoMensagem.hidden = true;
    grupoValor.hidden = false;
    rotuloValor.textContent = textosCanal[canal].rotulo;
    campoValor.placeholder = textosCanal[canal].exemplo;
    dicaValor.textContent = textosCanal[canal].dica;
    campoValor.value = "";
  }

  mostrarRespostasSimuladas();
}

/* =========================================================
   2. VALIDAÇÃO DO FORMULÁRIO
   ========================================================= */

function limparErros() {
  erroCanal.textContent = "";
  erroValor.textContent = "";
  erroMensagem.textContent = "";
  campoValor.removeAttribute("aria-invalid");
  campoMensagem.removeAttribute("aria-invalid");
  mensagemStatus.textContent = "";
  mensagemStatus.className = "mensagem-status";
}

/* Retorna o que foi digitado, ou "" se tiver erro */
function validarFormulario() {
  limparErros();

  if (canalEscolhido === "") {
    erroCanal.textContent = "Escolha o que você quer verificar.";
    opcoesCanal[0].focus();
    return "";
  }

  /* SMS: caixa de texto */
  if (canalEscolhido === "sms") {
    const mensagem = campoMensagem.value.trim();

    if (mensagem === "") {
      erroMensagem.textContent = "Cole a mensagem que você recebeu.";
    } else if (mensagem.length < 10) {
      erroMensagem.textContent = "A mensagem está muito curta. Cole o texto completo (mínimo de 10 caracteres).";
    }

    if (erroMensagem.textContent !== "") {
      campoMensagem.setAttribute("aria-invalid", "true");
      campoMensagem.focus();
      return "";
    }
    return mensagem;
  }

  /* WhatsApp, e-mail e link: campo de uma linha */
  const valor = campoValor.value.trim();

  if (valor === "") {
    erroValor.textContent = "Este campo é obrigatório.";
  } else if (canalEscolhido === "whatsapp") {
    const digitos = valor.replace(/\D/g, "");
    const internacional = valor.startsWith("+") && !valor.startsWith("+55");
    if (internacional && (digitos.length < 8 || digitos.length > 15)) {
      erroValor.textContent = "Número internacional inválido. Ex.: +1 555 123 4567.";
    } else if (!internacional && (digitos.length < 10 || digitos.length > 13)) {
      erroValor.textContent = "Número inválido. Digite com DDD, ex.: (31) 99999-0000.";
    }
  } else if (canalEscolhido === "email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
      erroValor.textContent = "E-mail inválido. Ex.: nome@empresa.com";
    }
  } else if (canalEscolhido === "link") {
    if (valor.includes(" ") || !valor.includes(".")) {
      erroValor.textContent = "Link inválido. Ex.: www.site.com.br";
    }
  }

  if (erroValor.textContent !== "") {
    campoValor.setAttribute("aria-invalid", "true");
    campoValor.focus();
    return "";
  }
  return valor;
}

/* =========================================================
   3. ENVIO: CHAMA O VERIFICADOR DA OPÇÃO ESCOLHIDA
   ========================================================= */

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const valor = validarFormulario();
  if (valor === "") {
    mensagemStatus.textContent = "Corrija o campo destacado para continuar.";
    mensagemStatus.className = "mensagem-status status-erro";
    return;
  }

  let resultado;

  switch (canalEscolhido) {
    case "whatsapp":
      resultado = verificarWhatsapp(valor);
      break;
    case "email":
      resultado = verificarEmail(valor);
      break;
    case "link":
      resultado = verificarLink(valor);
      break;
    case "sms":
      resultado = verificarSms(valor);
      break;
  }

  botaoVerificar.disabled = true;
  secaoResultado.hidden = true;

  mostrarTerminal(resultado.terminal, function () {
    mostrarResultado(resultado);
    botaoVerificar.disabled = false;
    mensagemStatus.textContent = "Verificação concluída: " + resultado.porcentagem + "% de chance de golpe.";
    mensagemStatus.className = "mensagem-status status-sucesso";
    secaoResultado.scrollIntoView({ behavior: "smooth" });
  });
});

formulario.addEventListener("reset", function () {
  limparErros();
  secaoResultado.hidden = true;
  terminal.hidden = true;
});

/* =========================================================
   4. "TERMINAL": MOSTRA AS ETAPAS UMA POR UMA
   ========================================================= */

function mostrarTerminal(linhas, quandoTerminar) {
  terminal.innerHTML = "";
  terminal.hidden = false;

  linhas.forEach(function (linha, indice) {
    setTimeout(function () {
      const item = document.createElement("li");
      item.textContent = linha;
      terminal.appendChild(item);

      /* Depois da última linha, mostra o resultado */
      if (indice === linhas.length - 1) {
        setTimeout(quandoTerminar, 500);
      }
    }, indice * 450);
  });
}

/* =========================================================
   5. RESULTADO
   ========================================================= */

function mostrarResultado(resultado) {
  /* Nível de risco conforme a porcentagem */
  let nivel = "baixo";
  let textoSelo = "Baixo risco";
  let titulo = "Nenhum sinal forte encontrado";
  let acoes = [
    "Isso não garante que é seguro: golpes novos surgem todos os dias.",
    "Se pedirem dinheiro ou dados, confirme por outro canal antes."
  ];

  if (resultado.porcentagem >= 60) {
    nivel = "alto";
    textoSelo = "Alto risco";
    titulo = "Alta chance de golpe";
    acoes = [
      "Não clique em links e não responda.",
      "Não faça Pix, transferência nem pague boletos.",
      "Se já pagou ou passou dados: ligue agora para o seu banco e registre um boletim de ocorrência."
    ];
  } else if (resultado.porcentagem >= 30) {
    nivel = "medio";
    textoSelo = "Atenção";
    titulo = "Sinais suspeitos encontrados";
    acoes = [
      "Não aja com pressa: confirme por um canal oficial.",
      "Não informe senhas, códigos ou dados do cartão."
    ];
  }

  secaoResultado.className = "resultado risco-" + nivel;
  porcentagem.textContent = resultado.porcentagem + "%";
  barraRisco.value = resultado.porcentagem;
  selo.textContent = textoSelo;
  selo.className = "selo selo-" + nivel;
  resultadoTitulo.textContent = titulo;
  consultado.textContent = "Consultado: " + resultado.consultado;

  alertaGolpe.textContent = resultado.golpe;
  alertaGolpe.hidden = resultado.golpe === "";

  /* Verificações: ✗ suspeito / ✓ ok */
  listaVerificacoes.innerHTML = "";
  resultado.verificacoes.forEach(function (verificacao) {
    const item = document.createElement("li");
    if (verificacao.suspeito) {
      item.className = "suspeito";
      item.textContent = "✗ " + verificacao.texto;
    } else {
      item.className = "ok";
      item.textContent = "✓ " + verificacao.texto;
    }
    listaVerificacoes.appendChild(item);
  });

  /* O que fazer agora: a dica do verificador + as ações do nível */
  listaAcoes.innerHTML = "";
  [resultado.dica].concat(acoes).forEach(function (acao) {
    const item = document.createElement("li");
    item.textContent = acao;
    listaAcoes.appendChild(item);
  });

  secaoResultado.hidden = false;
}

/* =========================================================
   6. RESPOSTAS SIMULADAS DAS APIs (array exibido na tela)
   ========================================================= */

function mostrarRespostasSimuladas() {
  let registros = bancoDeDados;
  tituloRespostas.textContent = "Respostas simuladas das APIs";
  descricaoRespostas.textContent = "Escolha uma opção no formulário para ver os registros daquele tipo e testar.";

  if (canalEscolhido !== "") {
    registros = listarPorTipo(canalEscolhido);
    tituloRespostas.textContent = "Respostas simuladas das APIs: " + textosCanal[canalEscolhido].nome;
    descricaoRespostas.textContent = registros.length + " respostas simuladas. Clique em \"Testar\" para verificar uma delas.";
  }

  listaRespostas.innerHTML = "";
  registros.forEach(function (registro) {
    listaRespostas.appendChild(criarCartao(registro));
  });
}

function criarCartao(registro) {
  /* Como o valor aparece no cartão e como ele vai para o formulário */
  let valorNaTela = registro.valor;
  let valorParaTestar = registro.valor;

  if (registro.tipo === "whatsapp") {
    valorNaTela = formatarTelefone(registro.valor);
    valorParaTestar = valorNaTela;
  } else if (registro.tipo === "email") {
    valorNaTela = "@" + registro.valor;
    valorParaTestar = "contato@" + registro.valor;
  }

  /* SMS mostra a mensagem inteira; os outros, o valor em destaque */
  let conteudo = '<h3 class="valor">' + valorNaTela + "</h3>";
  if (registro.tipo === "sms") {
    conteudo = '<p class="mensagem-sms">' + registro.valor + "</p>";
  }

  let tipoExemplo = "Exemplo seguro";
  let classeCartao = "cartao registro cartao-destaque";
  if (registro.exemploDeGolpe) {
    tipoExemplo = "Exemplo de golpe";
    classeCartao = "cartao registro cartao-golpe";
  }

  const cartao = document.createElement("article");
  cartao.className = classeCartao;
  cartao.innerHTML =
    '<p class="etiqueta">' + textosCanal[registro.tipo].nome + "</p>" +
    conteudo +
    "<p>" + registro.descricao + "</p>" +
    '<p class="tipo-exemplo">' + tipoExemplo + "</p>";

  /* Botão "Testar": preenche o formulário com este registro */
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "botao-testar";
  botao.textContent = "Testar";
  botao.setAttribute("aria-label", "Testar: " + registro.descricao);
  botao.addEventListener("click", function () {
    escolherCanal(registro.tipo);
    if (registro.tipo === "sms") {
      campoMensagem.value = valorParaTestar;
    } else {
      campoValor.value = valorParaTestar;
    }
    formulario.scrollIntoView({ behavior: "smooth" });
    botaoVerificar.focus();
  });

  cartao.appendChild(botao);
  return cartao;
}

/* Ao abrir a página, mostra todas as respostas simuladas */
mostrarRespostasSimuladas();
