/* =========================================================
   Verificador de Link / Site

   Simulação: mostra há quanto tempo o domínio foi registrado,
   se tem HTTPS e se imita alguma marca conhecida.
   Futuro: trocar buscarNoBanco() e simularSite() por consultas
   à API de registro de domínios (RDAP/WHOIS) e à API Google
   Safe Browsing (lista de sites maliciosos).
   ========================================================= */

const encurtadores = ["bit.ly", "tinyurl.com", "cutt.ly", "encurtador.com.br", "rb.gy"];

/* Marcas muito imitadas em golpes e o site oficial de cada uma */
const marcas = [
  { nome: "Itaú", palavra: "itau", oficial: "itau.com.br" },
  { nome: "Bradesco", palavra: "bradesco", oficial: "bradesco.com.br" },
  { nome: "Caixa", palavra: "caixa", oficial: "caixa.gov.br" },
  { nome: "Nubank", palavra: "nubank", oficial: "nubank.com.br" },
  { nome: "Correios", palavra: "correios", oficial: "correios.com.br" },
  { nome: "Mercado Livre", palavra: "mercadolivre", oficial: "mercadolivre.com.br" },
  { nome: "Gov.br", palavra: "gov", oficial: "gov.br" }
];

/* "https://www.site.com/pagina" -> "site.com" */
function extrairDominio(link) {
  let dominio = link.trim().toLowerCase();
  dominio = dominio.replace("https://", "").replace("http://", "").replace("www.", "");
  dominio = dominio.split("/")[0];
  return dominio;
}

/* Se o domínio usa o nome de uma marca mas não é o site oficial,
   retorna o nome da marca. Senão, retorna "". */
function descobrirMarcaImitada(dominio) {
  for (let i = 0; i < marcas.length; i++) {
    const marca = marcas[i];
    const ehOficial = dominio === marca.oficial || dominio.endsWith("." + marca.oficial);
    if (dominio.includes(marca.palavra) && !ehOficial) {
      return marca.nome;
    }
  }
  return "";
}

/* Simula a resposta da API para um domínio fora do array */
function simularSite(dominio, link) {
  const valor = gerarValorSimulado(dominio, 1000);
  let dias = valor % 400;
  if (temTerminacaoSuspeita(dominio) || descobrirMarcaImitada(dominio) !== "") {
    dias = valor % 30;
  }

  return {
    descricao: "",
    registradoHaDias: dias,
    https: !link.trim().toLowerCase().startsWith("http://"),
    imitaMarca: descobrirMarcaImitada(dominio),
    listadoComoMalicioso: false
  };
}

function verificarLink(linkDigitado) {
  const dominio = extrairDominio(linkDigitado);

  let registro = buscarNoBanco("link", dominio);
  if (registro === null) {
    registro = simularSite(dominio, linkDigitado);
  }

  const resultado = {
    consultado: dominio,
    terminal: [
      "> verificando banco de dados...",
      "> consultando domínio " + dominio,
      "> verificando data de registro do domínio...",
      "> verificando certificado de segurança (HTTPS)...",
      "> consultando lista de sites maliciosos (Google Safe Browsing)..."
    ],
    porcentagem: 0,
    golpe: "",
    verificacoes: [],
    dica: "Não digite senhas nem dados do cartão. Acesse o site oficial pelo aplicativo ou digitando o endereço."
  };

  let pontos = 0;

  /* 1. Link encurtado */
  if (encurtadores.includes(dominio)) {
    pontos = pontos + 35;
    resultado.verificacoes.push({ texto: "Link encurtado: o endereço verdadeiro está escondido", suspeito: true });
  }

  /* 2. Data de registro do domínio */
  if (registro.registradoHaDias < 30) {
    pontos = pontos + 30;
    resultado.verificacoes.push({ texto: "Domínio adquirido recentemente: há " + formatarTempo(registro.registradoHaDias), suspeito: true });
  } else {
    resultado.verificacoes.push({ texto: "Domínio registrado há " + formatarTempo(registro.registradoHaDias), suspeito: false });
  }

  /* 3. HTTPS */
  if (registro.https) {
    resultado.verificacoes.push({ texto: "Possui HTTPS (atenção: site falso também pode ter)", suspeito: false });
  } else {
    pontos = pontos + 15;
    resultado.verificacoes.push({ texto: "Sem certificado HTTPS", suspeito: true });
  }

  /* 4. Imitação de marca */
  if (registro.imitaMarca !== "") {
    pontos = pontos + 30;
    resultado.verificacoes.push({ texto: "Imita a marca " + registro.imitaMarca + ", mas não é o site oficial", suspeito: true });
  }

  /* 5. Terminação suspeita */
  if (temTerminacaoSuspeita(dominio)) {
    pontos = pontos + 15;
    resultado.verificacoes.push({ texto: "Terminação de domínio muito usada em golpes", suspeito: true });
  }

  /* 6. Lista de sites maliciosos (Google Safe Browsing) */
  if (registro.listadoComoMalicioso) {
    pontos = pontos + 40;
    resultado.verificacoes.push({ texto: "Listado como site malicioso (Google Safe Browsing)", suspeito: true });
    resultado.golpe = "Site listado como malicioso: " + registro.descricao;
  } else {
    resultado.verificacoes.push({ texto: "Não está na lista de sites maliciosos", suspeito: false });
  }

  resultado.porcentagem = Math.max(Math.min(pontos, 99), 5);
  return resultado;
}
