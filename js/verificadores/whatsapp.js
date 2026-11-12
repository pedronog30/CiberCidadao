/* =========================================================
   Verificador de WhatsApp

   Verificações REAIS (já funcionam no protótipo):
     - DDD válido no Brasil
     - Número internacional (DDI diferente de +55)

   Verificações SIMULADAS (respostas das APIs das operadoras):
     - Tempo de linha: há quanto tempo o número está ativo
       Futuro: API "Tenure" do Open Gateway (Claro, TIM, Vivo)
     - Troca de chip recente
       Futuro: API "SIM Swap" do Open Gateway
   ========================================================= */

/* DDDs existentes no Brasil (Anatel) */
const dddsValidos = [
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99
];

/* Número de outro país: começa com + mas não com +55 */
function ehInternacional(numeroDigitado) {
  const texto = numeroDigitado.trim();
  return texto.startsWith("+") && !texto.startsWith("+55");
}

/* Deixa só os números e tira o 55 do Brasil, se tiver */
function limparTelefone(numero) {
  let digitos = numero.replace(/\D/g, "");
  if (digitos.length === 13 && digitos.startsWith("55")) {
    digitos = digitos.slice(2);
  }
  return digitos;
}

/* 31999990000 -> (31) 99999-0000 */
function formatarTelefone(digitos) {
  if (digitos.length === 11) {
    return "(" + digitos.slice(0, 2) + ") " + digitos.slice(2, 7) + "-" + digitos.slice(7);
  }
  return "(" + digitos.slice(0, 2) + ") " + digitos.slice(2, 6) + "-" + digitos.slice(6);
}

/* Simula a resposta das APIs para um número fora do array */
function simularNumero(numero) {
  return {
    tempoDeLinhaDias: gerarValorSimulado(numero, 120),
    chipTrocadoHaDias: gerarValorSimulado(numero + "chip", 200)
  };
}

function verificarWhatsapp(numeroDigitado) {
  const internacional = ehInternacional(numeroDigitado);
  const numero = limparTelefone(numeroDigitado);

  let numeroExibido = formatarTelefone(numero);
  if (internacional) {
    numeroExibido = numeroDigitado.trim();
  }

  const resultado = {
    consultado: numeroExibido,
    terminal: [
      "> verificando banco de dados...",
      "> validando DDD e formato do número...",
      "> consultando tempo de linha na operadora...",
      "> verificando troca recente de chip (SIM Swap)..."
    ],
    porcentagem: 0,
    golpe: "",
    verificacoes: [],
    dica: "Se alguém diz que \"trocou de número\", ligue para o número antigo antes de fazer qualquer coisa."
  };

  let pontos = 0;

  /* ---------- Número internacional (verificação real) ---------- */
  if (internacional) {
    pontos = pontos + 45;
    resultado.verificacoes.push({ texto: "Número internacional: muito usado em golpes de vaga falsa e investimento", suspeito: true });
    resultado.verificacoes.push({ texto: "Operadora estrangeira: tempo de linha e troca de chip indisponíveis", suspeito: false });
    resultado.dica = "Desconfie de contatos de outros países oferecendo emprego, renda extra ou investimento.";
    resultado.porcentagem = pontos;
    return resultado;
  }

  /* ---------- DDD (verificação real) ---------- */
  const ddd = Number(numero.slice(0, 2));
  if (dddsValidos.includes(ddd)) {
    resultado.verificacoes.push({ texto: "DDD " + ddd + " válido", suspeito: false });
  } else {
    pontos = pontos + 40;
    resultado.verificacoes.push({ texto: "DDD " + ddd + " não existe no Brasil", suspeito: true });
  }

  /* ---------- Respostas das APIs (simuladas) ---------- */
  let registro = buscarNoBanco("whatsapp", numero);
  if (registro === null) {
    registro = simularNumero(numero);
  }

  /* Tempo de linha */
  if (registro.tempoDeLinhaDias < 30) {
    pontos = pontos + 35;
    resultado.verificacoes.push({ texto: "Tempo de linha: ativa há apenas " + formatarTempo(registro.tempoDeLinhaDias), suspeito: true });
  } else {
    resultado.verificacoes.push({ texto: "Tempo de linha: ativa há " + formatarTempo(registro.tempoDeLinhaDias), suspeito: false });
  }

  /* Troca de chip recente */
  if (registro.chipTrocadoHaDias < 7) {
    pontos = pontos + 30;
    resultado.verificacoes.push({ texto: "Chip trocado há " + registro.chipTrocadoHaDias + " dias: a conta pode ter sido clonada", suspeito: true });
  } else {
    resultado.verificacoes.push({ texto: "Nenhuma troca de chip nos últimos 7 dias", suspeito: false });
  }

  resultado.porcentagem = Math.max(Math.min(pontos, 99), 5);
  return resultado;
}
