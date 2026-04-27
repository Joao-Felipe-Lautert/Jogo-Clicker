let pontos = 0;

// Variáveis da Loja
let pontosPorSegundo = 0;
let custoUpg1 = 10;

// Configuração do Firebase (COLE A SUA CHAVE AQUI DENTRO)
const firebaseConfig = {
  apiKey: "COLE_SUA_CHAVE_AQUI",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:12345:web:abcde",
};

// Inicia o Banco de Dados
firebase.initializeApp(firebaseConfig);
const banco = firebase.firestore();

function registrarClique(evento) {
  // 1. Aumenta a pontuação
  pontos++;
  document.getElementById("pontuacao").innerText = pontos;

  // 2. Animação de pulsar a imagem principal
  const img = document.getElementById("imagem-principal");
  img.style.transform = "scale(0.90)";
  setTimeout(() => {
    img.style.transform = "scale(1)";
  }, 100);

  // 3. Chama a função do efeito especial
  criarParticula(evento);
}

// Função para criar o "+1" flutuante na ponta do mouse
function criarParticula(evento) {
  // Cria uma div nova
  let particula = document.createElement("div");
  particula.innerText = "+1💲";
  particula.className = "texto-flutuante";

  // Pega as coordenadas X e Y de onde o mouse clicou
  particula.style.left = evento.clientX + "px";
  particula.style.top = evento.clientY + "px";

  // Joga a div na tela
  document.body.appendChild(particula);

  // Destrói a div depois de 1 segundo para não travar o PC
  setTimeout(() => {
    particula.remove();
  }, 1000);
}

// 1. Função de Comprar na Loja
function comprarUpgrade1() {
  if (pontos >= custoUpg1) {
    pontos -= custoUpg1; // Paga o item
    pontosPorSegundo += 1; // Ganha o poder
    custoUpg1 = Math.floor(custoUpg1 * 1.5); // Aumenta o preço em 50% para a próxima compra

    atualizarTela();
  } else {
    alert("Pontos insuficientes!");
  }
}

// 2. Atualiza os textos da tela
function atualizarTela() {
  document.getElementById("pontuacao").innerText = pontos;
  document.getElementById("pontos-por-segundo").innerText = pontosPorSegundo;
  document.getElementById(
    "btn-upg1"
  ).innerText = `Comprar (Custo: ${custoUpg1})`;
}

// 3. O Motor Automático (Roda infinitamente a cada 1 segundo)
setInterval(() => {
  if (pontosPorSegundo > 0) {
    pontos += pontosPorSegundo;
    atualizarTela();
  }
}, 1000);

// 4. Salvar na Nuvem (Firebase)
function salvarJogo() {
  let nome = document.getElementById("nome-jogador").value;

  if (nome === "") {
    alert("Digite seu nome antes de salvar!");
    return;
  }

  // Cria o objeto com seus dados
  let dadosDoJogo = {
    jogador: nome,
    score: pontos,
    pps: pontosPorSegundo,
  };

  // Salva na Coleção "ranking", criando um Documento com o nome do jogador
  banco
    .collection("ranking")
    .doc(nome)
    .set(dadosDoJogo)
    .then(() => {
      alert("Progresso salvo com sucesso!");
    })
    .catch((erro) => {
      console.error("Erro ao salvar:", erro);
    });
}
