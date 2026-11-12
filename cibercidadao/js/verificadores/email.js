/* =========================================================
   Verificador de E-mail

   Simulação: mostra se o domínio do e-mail tem SPF, DKIM e
   DMARC (as "assinaturas" que provam que um e-mail veio mesmo
   de quem diz ter enviado) e há quanto tempo ele existe.
   Futuro: trocar buscarNoBanco() e simularDominioEmail() por
   consultas de DNS (SPF, DMARC) e à API de registro de
   domínios. O DKIM é verificado no cabeçalho do e-mail.
   ========================================================= */

/* Provedores conhecidos, sempre com as proteções configuradas */
const provedoresConhecidos = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com", "icloud.com"];

/* Simula a resposta da API para um domínio fora do array */
function simularDominioEmail(dominio) {
  if (provedoresConhecidos.includes(dominio)) {
    return { criadoHaDias: 5000, spf: true, dkim: true, dmarc: true };
  }

  const valor = gerarValorSimulado(dominio, 1000);

  /* Terminações suspeitas: domínio novo e sem proteções */
  if (temTerminacaoSuspeita(dominio)) {
    return { criadoHaDias: valor % 30, spf: false, dkim: false, dmarc: false };
  }

  return {
    criadoHaDias: valor % 400,
    spf: valor % 2 === 0,
    dkim: valor % 3 === 0,
    dmarc: valor % 5 === 0
  };
}

function verificarEmail(emailDigitado) {
  const email = emailDigitado.trim().toLowerCase();
  const dominio = email.split("@")[1];

  let registro = buscarNoBanco("email", dominio);
  if (registro === null) {
    registro = simularDominioEmail(dominio);
  }

  const resultado = {
    consultado: email,
    terminal: [
      "> verificando banco de dados...",
      "> consultando domínio @" + dominio,
      "> verificando registros SPF, DKIM e DMARC...",
      "> verificando idade do domínio..."
    ],
    porcentagem: 0,
    golpe: "",
    verificacoes: [],
    dica: "Não clique em links nem baixe anexos. Acesse o site oficial digitando o endereço você mesmo."
  };

  let pontos = 0;

  /* 1. SPF */
  if (registro.spf) {
    resultado.verificacoes.push({ texto: "SPF configurado", suspeito: false });
  } else {
    pontos = pontos + 20;
    resultado.verificacoes.push({ texto: "Sem SPF: qualquer servidor pode enviar em nome deste domínio", suspeito: true });
  }

  /* 2. DKIM */
  if (registro.dkim) {
    resultado.verificacoes.push({ texto: "DKIM configurado", suspeito: false });
  } else {
    pontos = pontos + 20;
    resultado.verificacoes.push({ texto: "Sem DKIM: o e-mail não tem assinatura digital", suspeito: true });
  }

  /* 3. DMARC */
  if (registro.dmarc) {
    resultado.verificacoes.push({ texto: "DMARC configurado", suspeito: false });
  } else {
    pontos = pontos + 20;
    resultado.verificacoes.push({ texto: "Sem DMARC: e-mails falsos deste domínio não são bloqueados", suspeito: true });
  }

  /* 4. Idade do domínio */
  if (registro.criadoHaDias < 30) {
    pontos = pontos + 25;
    resultado.verificacoes.push({ texto: "Domínio criado há apenas " + formatarTempo(registro.criadoHaDias), suspeito: true });
  } else {
    resultado.verificacoes.push({ texto: "Domínio criado há " + formatarTempo(registro.criadoHaDias), suspeito: false });
  }

  resultado.porcentagem = Math.max(Math.min(pontos, 99), 5);
  return resultado;
}
