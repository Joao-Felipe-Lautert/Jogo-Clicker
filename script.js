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

// 1. CHAVES DO SERVIDOR MESTRE (DO PROFESSOR)
const configProfessor = {
  apiKey: "AIzaSyAFdzjq2mWquyDR6Gzb2ydkGNJWf0yCl40",
  authDomain: "clicker-multiverso.firebaseapp.com",
  projectId: "clicker-multiverso",
  storageBucket: "clicker-multiverso.firebasestorage.app",
  messagingSenderId: "875785026287",
  appId: "1:875785026287:web:15b0c85034452ee7d1b91a",
};

// 2. INICIALIZAÇÃO DA SEGUNDA CONEXÃO
// O segredo é passar o nome "Multiverso" para o navegador não confundir com o seu banco!
const appMultiverso = firebase.initializeApp(configProfessor, "Multiverso");
const bancoMultiverso = appMultiverso.firestore();

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

function salvarJogo() {
  let nome = document.getElementById("nome-jogador").value;

  // Trava de segurança: não salva sem nome e nem se os pontos forem zero!
  if (nome === "" || pontos === 0) {
    alert("Digite seu nome e comece a jogar antes de salvar!");
    return;
  }

  // 1. EMPACOTANDO OS DADOS
  let dadosDoJogo = {
    jogador: nome,
    score: pontos,
    pps: pontosPorSegundo,
    nomeDoJogo: "Clicker de Tecnologia", // ATENÇÃO: Troque isso para o nome real do seu jogo!
  };

  // 2. SALVA NO SEU BANCO (Para o seu ranking individual funcionar)
  banco.collection("ranking").doc(nome).set(dadosDoJogo);

  // 3. SALVA NO BANCO DO PROFESSOR (Para aparecer na TV da sala)
  // Criamos um ID único juntando seu nome e o nome do seu jogo
  let idUnico = nome + "_Multiverso";
  bancoMultiverso
    .collection("ranking_global")
    .doc(idUnico)
    .set(dadosDoJogo)
    .catch((erro) => {
      console.error("Erro ao enviar para o Multiverso:", erro);
    });
}

// AUTO-SAVE: Roda a cada 05 segundos
setInterval(function () {
  salvarJogo();
}, 5000);

function carregarRanking() {
  let lista = document.getElementById("lista-ranking");
  lista.innerHTML = "<li>Buscando dados na nuvem...</li>";

  // 1. Vai na coleção "ranking"
  // 2. Ordena pelo campo "score" de forma descendente (desc = do maior pro menor)
  // 3. Limita para trazer apenas os 5 melhores
  banco
    .collection("ranking")
    .orderBy("score", "desc")
    .limit(5)
    .get()
    .then((resultado) => {
      lista.innerHTML = ""; // Limpa a mensagem de carregando

      // 4. Faz um Loop (repetição) para desenhar cada jogador na tela
      resultado.forEach((documento) => {
        let dados = documento.data(); // Extrai os dados do Firebase

        // Cria a linha da lista (<li>) e joga no HTML
        lista.innerHTML += `<li>${dados.jogador} ➔ ${dados.score} pts</li>`;
      });
    })
    .catch((erro) => {
      console.error("Erro ao buscar ranking:", erro);
      lista.innerHTML = "<li>Erro ao carregar.</li>";
    });
}

// Executa a função automaticamente assim que a página abrir!
carregarRanking();

setInterval(function () {
  carregarRanking();
}, 15000);

function carregarJogo() {
  let nome = document.getElementById("nome-jogador").value;

  if (nome === "") {
    alert("Digite seu nome para carregar o jogo!");
    return;
  }

  // Busca o documento do jogador no Firebase
  banco
    .collection("ranking")
    .doc(nome)
    .get()
    .then((doc) => {
      if (doc.exists) {
        let dados = doc.data();

        // Atualiza variáveis do jogo
        pontos = dados.score || 0;
        pontosPorSegundo = dados.pps || 0;
        custoUpg1 = dados.custos[0] || 10;
        custoUpg2 = dados.custos[1] || 100;
        custoUpg3 = dados.custos[2] || 2000;

        atualizarTela();

        console.log(`Jogo carregado para ${nome}!`);
      } else {
        alert("Nenhum jogo encontrado para este nome.");
      }
    })
    .catch((erro) => {
      console.error("Erro ao carregar o jogo:", erro);
      alert("Erro ao carregar o jogo. Veja o console para mais detalhes.");
    });
}
