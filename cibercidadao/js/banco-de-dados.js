/* =========================================================
   CiberCidadão — Respostas simuladas das APIs

   No protótipo, este array simula o que as APIs de verificação
   devolveriam. No futuro, cada verificador (js/verificadores/)
   vai consultar APIs externas no lugar deste array:
     - WhatsApp: APIs das operadoras (Tenure e SIM Swap)
     - E-mail:   consulta de DNS (SPF, DMARC) e registro de domínios
     - Link:     registro de domínios (RDAP/WHOIS) e API Google
                 Safe Browsing (lista de sites maliciosos)

   Todos os números, e-mails e sites abaixo são FICTÍCIOS.
   ========================================================= */

const bancoDeDados = [
  /* ---------- WhatsApp (2) ---------- */
  {
    tipo: "whatsapp",
    valor: "11900000001",
    descricao: "Linha nova e chip trocado: padrão do golpe do falso parente",
    exemploDeGolpe: true,
    tempoDeLinhaDias: 3,
    chipTrocadoHaDias: 3
  },
  {
    tipo: "whatsapp",
    valor: "31988887777",
    descricao: "Linha antiga, sem troca de chip",
    exemploDeGolpe: false,
    tempoDeLinhaDias: 2190,
    chipTrocadoHaDias: 400
  },

  /* ---------- E-mail (2) ---------- */
  {
    tipo: "email",
    valor: "seguranca-itau.com",
    descricao: "Domínio novo, sem SPF, DKIM e DMARC",
    exemploDeGolpe: true,
    criadoHaDias: 6,
    spf: false,
    dkim: false,
    dmarc: false
  },
  {
    tipo: "email",
    valor: "gmail.com",
    descricao: "Domínio antigo, com SPF, DKIM e DMARC",
    exemploDeGolpe: false,
    criadoHaDias: 11000,
    spf: true,
    dkim: true,
    dmarc: true
  },

  /* ---------- SMS (2) ---------- */
  {
    tipo: "sms",
    valor: "BRADESCO: Identificamos uma compra suspeita. Seu acesso sera bloqueado em 24h. Atualize seus dados: bradesco-seguranca.xyz",
    descricao: "Falso banco",
    exemploDeGolpe: true
  },
  {
    tipo: "sms",
    valor: "Parabens! Voce ganhou um premio de R$ 5.000. Clique e resgate agora!",
    descricao: "Prêmio falso",
    exemploDeGolpe: true
  },

  /* ---------- Links / sites (4) ---------- */
  {
    tipo: "link",
    valor: "bradesco-seguranca.xyz",
    descricao: "Página falsa de login do banco",
    exemploDeGolpe: true,
    registradoHaDias: 4,
    https: false,
    imitaMarca: "Bradesco",
    listadoComoMalicioso: true
  },
  {
    tipo: "link",
    valor: "correios-rastreio.top",
    descricao: "Falsa taxa para liberar encomenda",
    exemploDeGolpe: true,
    registradoHaDias: 8,
    https: true,
    imitaMarca: "Correios",
    listadoComoMalicioso: true
  },
  {
    tipo: "link",
    valor: "tenis-original-barato.site",
    descricao: "Loja falsa que não entrega",
    exemploDeGolpe: true,
    registradoHaDias: 20,
    https: true,
    imitaMarca: "",
    listadoComoMalicioso: true
  },
  {
    tipo: "link",
    valor: "gov.br",
    descricao: "Site oficial do governo",
    exemploDeGolpe: false,
    registradoHaDias: 9000,
    https: true,
    imitaMarca: "",
    listadoComoMalicioso: false
  }
];

/* Terminações de domínio muito usadas em golpes */
const terminacoesSuspeitas = [".xyz", ".top", ".online", ".site", ".shop", ".click"];

/* Procura um registro no banco de dados pelo tipo e pelo valor.
   Retorna o registro encontrado ou null. */
function buscarNoBanco(tipo, valor) {
  for (let i = 0; i < bancoDeDados.length; i++) {
    if (bancoDeDados[i].tipo === tipo && bancoDeDados[i].valor === valor) {
      return bancoDeDados[i];
    }
  }
  return null;
}

/* Retorna todos os registros de um tipo (ex.: todos os de WhatsApp) */
function listarPorTipo(tipo) {
  return bancoDeDados.filter(function (registro) {
    return registro.tipo === tipo;
  });
}

/* SIMULAÇÃO: transforma um texto em um número de 0 até (maximo - 1).
   O mesmo texto sempre gera o mesmo número, então o mesmo número de
   telefone, e-mail ou link sempre tem o mesmo resultado simulado.
   No futuro, esses dados viriam das respostas das APIs. */
function gerarValorSimulado(texto, maximo) {
  let soma = 0;
  for (let i = 0; i < texto.length; i++) {
    soma = soma + texto.charCodeAt(i) * (i + 1);
  }
  return soma % maximo;
}

/* 45 -> "45 dias" | 800 -> "2 anos" */
function formatarTempo(dias) {
  if (dias >= 730) {
    return Math.floor(dias / 365) + " anos";
  }
  if (dias >= 365) {
    return "1 ano";
  }
  return dias + " dias";
}

/* Verifica se um domínio termina com alguma terminação suspeita */
function temTerminacaoSuspeita(dominio) {
  for (let i = 0; i < terminacoesSuspeitas.length; i++) {
    if (dominio.endsWith(terminacoesSuspeitas[i])) {
      return true;
    }
  }
  return false;
}
