// --- VARIÁVEIS TÉCNICAS ---
let pontos = 0;
let pontosPorSegundo = 0;

// Preços iniciais
let custoUpg1 = 10;
let custoUpg2 = 100;
let custoUpg3 = 2000;

// --- CONFIGURAÇÃO FIREBASE ---
// IMPORTANTE: Cole aqui os dados do seu console Firebase!
const firebaseConfig = {
  apiKey: "AIzaSyCz4mTfCtXcw1Sq9YakHgBXnrZ22FV8p1o",
  authDomain: "jogo-clicker.firebaseapp.com",
  projectId: "jogo-clicker",
  storageBucket: "jogo-clicker.firebasestorage.app",
  messagingSenderId: "597576726004",
  appId: "1:597576726004:web:c2d818a2ab75ba52ee35a1",
};

firebase.initializeApp(firebaseConfig);
const banco = firebase.firestore();

// --- SISTEMA DE CLIQUE ---
function registrarClique(evento) {
  pontos++;
  atualizarTela();

  // Efeito Visual na imagem
  const img = document.getElementById("imagem-principal");
  img.style.transform = "scale(0.95)";
  setTimeout(() => {
    img.style.transform = "scale(1)";
  }, 100);

  // Efeito flutuante
  criarParticula(evento);
}

function criarParticula(evento) {
  let particula = document.createElement("div");
  particula.innerText = "+1💲";
  particula.className = "texto-flutuante";
  particula.style.left = evento.clientX + "px";
  particula.style.top = evento.clientY + "px";
  document.body.appendChild(particula);
  setTimeout(() => {
    particula.remove();
  }, 1000);
}

// --- LÓGICA DA LOJA (DESAFIO 1) ---
function comprarUpgrade1() {
  if (pontos >= custoUpg1) {
    pontos -= custoUpg1;
    pontosPorSegundo += 1;
    custoUpg1 = Math.floor(custoUpg1 * 1.5);
    atualizarTela();
  } else {
    alert("Pontos insuficientes!");
  }
}

function comprarUpgrade2() {
  if (pontos >= custoUpg2) {
    pontos -= custoUpg2;
    pontosPorSegundo += 5;
    custoUpg2 = Math.floor(custoUpg2 * 1.5);
    atualizarTela();
  } else {
    alert("Pontos insuficientes!");
  }
}

function comprarUpgrade3() {
  if (pontos >= custoUpg3) {
    pontos -= custoUpg3;
    pontosPorSegundo += 50;
    custoUpg3 = Math.floor(custoUpg3 * 1.5);
    atualizarTela();
  } else {
    alert("Pontos insuficientes!");
  }
}

function atualizarTela() {
  document.getElementById("pontuacao").innerText = Math.floor(pontos);
  document.getElementById("pontos-por-segundo").innerText = pontosPorSegundo;
  document.getElementById("btn-upg1").innerText = `Comprar (${custoUpg1})`;
  document.getElementById("btn-upg2").innerText = `Comprar (${custoUpg2})`;
  document.getElementById("btn-upg3").innerText = `Comprar (${custoUpg3})`;
}

// --- MOTOR DO JOGO (GAME LOOP) ---
setInterval(() => {
  if (pontosPorSegundo > 0) {
    pontos += pontosPorSegundo;
    atualizarTela();
  }
}, 1000);

// --- FIREBASE: SALVAR (DESAFIO 2) ---
function salvarJogo() {
  let nome = document.getElementById("nome-jogador").value;
  if (nome === "") {
    console.log("Auto-save cancelado: Nome vazio.");
    return;
  }

  let dadosDoJogo = {
    jogador: nome,
    score: pontos,
    pps: pontosPorSegundo,
    custos: [custoUpg1, custoUpg2, custoUpg3],
    ultimaAtualizacao: new Date(),
  };

  banco
    .collection("ranking")
    .doc(nome)
    .set(dadosDoJogo)
    .then(() => {
      console.log("Progresso salvo na nuvem!");
    })
    .catch((erro) => {
      console.error("Erro no Firebase:", erro);
    });
}

// AUTO-SAVE: Roda a cada 30 segundos
setInterval(salvarJogo, 30000);
