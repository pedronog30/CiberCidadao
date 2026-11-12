/* =========================================================
   Verificador de SMS

   Simulação: procura na mensagem palavras e frases que
   aparecem com frequência em SMS de golpe.
   Futuro: análise com inteligência artificial treinada em
   milhares de mensagens denunciadas.
   ========================================================= */

/* Padrões suspeitos (sem acento, em minúsculas) */
const padroesSms = [
  { termo: "urgente", categoria: "Urgência" },
  { termo: "imediatamente", categoria: "Urgência" },
  { termo: "ultimo aviso", categoria: "Urgência" },
  { termo: "24h", categoria: "Urgência" },
  { termo: "bloqueado", categoria: "Ameaça de bloqueio" },
  { termo: "bloqueada", categoria: "Ameaça de bloqueio" },
  { termo: "suspenso", categoria: "Ameaça de bloqueio" },
  { termo: "cancelado", categoria: "Ameaça de bloqueio" },
  { termo: "senha", categoria: "Pedido de dados" },
  { termo: "codigo", categoria: "Pedido de dados" },
  { termo: "atualize seus dados", categoria: "Pedido de dados" },
  { termo: "confirme seus dados", categoria: "Pedido de dados" },
  { termo: "parabens", categoria: "Prêmio falso" },
  { termo: "voce ganhou", categoria: "Prêmio falso" },
  { termo: "premio", categoria: "Prêmio falso" },
  { termo: "resgate", categoria: "Prêmio falso" },
  { termo: "taxa", categoria: "Cobrança" },
  { termo: "pague", categoria: "Cobrança" },
  { termo: "pendente", categoria: "Cobrança" },
  { termo: "compra suspeita", categoria: "Falso banco" },
  { termo: "encomenda", categoria: "Falsa entrega" },
  { termo: "clique", categoria: "Link na mensagem" },
  { termo: "acesse", categoria: "Link na mensagem" }
];

/* Tira os acentos para comparar: "Parabéns" -> "parabens" */
function removerAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function verificarSms(mensagem) {
  const texto = removerAcentos(mensagem.toLowerCase());

  /* Procura cada padrão na mensagem */
  const categoriasEncontradas = [];
  const termosEncontrados = [];

  padroesSms.forEach(function (padrao) {
    if (texto.includes(padrao.termo)) {
      termosEncontrados.push(padrao.termo);
      if (!categoriasEncontradas.includes(padrao.categoria)) {
        categoriasEncontradas.push(padrao.categoria);
      }
    }
  });

  /* Verifica se a mensagem tem um endereço de site */
  const temLink = /[a-z0-9-]+\.(com|br|xyz|top|online|site|shop|net|ly)/.test(texto);

  const resultado = {
    consultado: "mensagem com " + mensagem.length + " caracteres",
    terminal: [
      "> verificando padrão da mensagem...",
      "> comparando com " + padroesSms.length + " padrões suspeitos...",
      "> padrões suspeitos encontrados: " + termosEncontrados.length
    ],
    porcentagem: 0,
    golpe: "",
    verificacoes: [],
    dica: "Não clique no link. Se a mensagem fala do seu banco ou de uma compra, abra o aplicativo oficial e confira por lá."
  };

  /* Monta a lista de verificações */
  categoriasEncontradas.forEach(function (categoria) {
    resultado.verificacoes.push({ texto: "Padrão suspeito: " + categoria, suspeito: true });
  });

  if (termosEncontrados.length > 0) {
    resultado.verificacoes.push({ texto: "Palavras encontradas: " + termosEncontrados.join(", "), suspeito: true });
  }

  if (temLink) {
    resultado.verificacoes.push({ texto: "A mensagem contém um link", suspeito: true });
  }

  if (resultado.verificacoes.length === 0) {
    resultado.verificacoes.push({ texto: "Nenhum padrão suspeito encontrado", suspeito: false });
  }

  /* Calcula o risco: cada tipo de padrão vale 22 pontos e o link vale 15 */
  let pontos = categoriasEncontradas.length * 22;
  if (temLink) {
    pontos = pontos + 15;
  }

  resultado.porcentagem = Math.max(Math.min(pontos, 99), 5);

  if (categoriasEncontradas.length > 0) {
    resultado.golpe = "Padrões de golpe: " + categoriasEncontradas.join(" + ");
  }

  return resultado;
}
