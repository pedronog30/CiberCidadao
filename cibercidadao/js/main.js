/* =========================================================
   CiberCidadão — Script usado em todas as páginas
   - Menu no celular
   - Acessibilidade: tamanho do texto e alto contraste
   ========================================================= */

/* ---------- Menu no celular ---------- */
const botaoMenu = document.querySelector(".botao-menu");
const areaMenu = document.getElementById("area-menu");

botaoMenu.addEventListener("click", function () {
  const estaAberto = areaMenu.classList.toggle("aberto");
  botaoMenu.setAttribute("aria-expanded", estaAberto);
});

/* ---------- Tamanho do texto (A− e A+) ---------- */
const tamanhos = ["fonte-0", "fonte-1", "fonte-2", "fonte-3", "fonte-4"];
let tamanhoAtual = 1; // fonte-1 é o tamanho normal

const botaoDiminuir = document.getElementById("diminuir-fonte");
const botaoAumentar = document.getElementById("aumentar-fonte");

function aplicarTamanho() {
  document.documentElement.classList.remove(...tamanhos);
  document.documentElement.classList.add(tamanhos[tamanhoAtual]);
  botaoDiminuir.disabled = tamanhoAtual === 0;
  botaoAumentar.disabled = tamanhoAtual === tamanhos.length - 1;
}

botaoDiminuir.addEventListener("click", function () {
  tamanhoAtual--;
  aplicarTamanho();
});

botaoAumentar.addEventListener("click", function () {
  tamanhoAtual++;
  aplicarTamanho();
});

aplicarTamanho();

/* ---------- Alto contraste ---------- */
const botaoContraste = document.getElementById("botao-contraste");

botaoContraste.addEventListener("click", function () {
  const ativo = document.body.classList.toggle("alto-contraste");
  botaoContraste.setAttribute("aria-pressed", ativo);
});
