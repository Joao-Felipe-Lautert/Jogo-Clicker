let pontos = 0;

function registrarClique(evento) {
    // 1. Aumenta a pontuação
    pontos++;
    document.getElementById("pontuacao").innerText = pontos;
    
    // 2. Animação de pulsar a imagem principal
    const img = document.getElementById("imagem-principal");
    img.style.transform = "scale(0.90)"; 
    setTimeout(() => { img.style.transform = "scale(1)"; }, 100);

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