/**
 * Módulo Canvas - Responsável pela configuração e manipulação do canvas
 * Este módulo gerencia o canvas do jogo, incluindo dimensionamento responsivo
 */

let canvas, ctx, gridSize, tileCount;

/**
 * Inicializa o canvas com dimensões responsivas
 * Calcula o tamanho ideal baseado na tela do dispositivo
 */
function initCanvas() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Calcula tamanho baseado na tela (máximo 600px, múltiplo de 20 para grid perfeito)
    const maxSize = Math.min(window.innerWidth - 40, window.innerHeight - 300, 600);
    const canvasSize = Math.floor(maxSize / 20) * 20;
    
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    
    gridSize = 20;
    tileCount = canvas.width / gridSize;
}

/**
 * Desenha um power-up no canvas
 * @param {Object} powerup - Power-up para desenhar
 */
function drawPowerup(powerup) {
    const x = powerup.x * gridSize;
    const y = powerup.y * gridSize;
    const centerX = x + gridSize / 2;
    const centerY = y + gridSize / 2;
    
    // Efeito de piscada baseado na fase
    const alpha = 0.7 + 0.3 * Math.sin(powerup.blinkPhase);
    
    // Fundo do power-up com transparência
    ctx.globalAlpha = alpha;
    ctx.fillStyle = powerup.color;
    ctx.fillRect(x + 1, y + 1, gridSize - 2, gridSize - 2);
    
    // Borda brilhante
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, gridSize - 2, gridSize - 2);
    
    // Desenha símbolo do power-up
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.font = `${gridSize * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(powerup.symbol, centerX, centerY);
}

/**
 * Desenha efeitos visuais para cobra invencível
 * @param {Array} snake - Array com os segmentos da cobra
 */
function drawInvincibilityEffect(snake) {
    const time = Date.now() / 100;
    
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        const x = segment.x * gridSize;
        const y = segment.y * gridSize;
        
        // Efeito de brilho pulsante
        const alpha = 0.3 + 0.2 * Math.sin(time + i * 0.5);
        
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#a8e6cf';
        ctx.fillRect(x - 2, y - 2, gridSize + 2, gridSize + 2);
    }
    
    ctx.globalAlpha = 1;
}

/**
 * Desenha efeitos visuais para multiplicador de pontos
 * @param {Object} food - Posição da comida
 */
function drawScoreMultiplierEffect(food) {
    const x = food.x * gridSize;
    const y = food.y * gridSize;
    const time = Date.now() / 100;
    
    // Partículas douradas ao redor da comida
    for (let i = 0; i < 8; i++) {
        const angle = (time + i * Math.PI / 4) % (Math.PI * 2);
        const radius = 15 + 5 * Math.sin(time * 2);
        const particleX = x + gridSize/2 + Math.cos(angle) * radius;
        const particleY = y + gridSize/2 + Math.sin(angle) * radius;
        
        ctx.fillStyle = '#ffd93d';
        ctx.globalAlpha = 0.6 + 0.4 * Math.sin(time * 3 + i);
        ctx.fillRect(particleX - 1, particleY - 1, 2, 2);
    }
    
    ctx.globalAlpha = 1;
}

/**
 * Desenha duas cobras no modo multiplayer
 * @param {Array} player1Snake - Cobra do jogador 1
 * @param {Array} player2Snake - Cobra do jogador 2
 * @param {string} player1Color - Cor do jogador 1
 * @param {string} player2Color - Cor do jogador 2
 * @param {boolean} player1Alive - Se jogador 1 está vivo
 * @param {boolean} player2Alive - Se jogador 2 está vivo
 */
function drawMultiplayerSnakes(player1Snake, player2Snake, player1Color, player2Color, player1Alive, player2Alive) {
    // Desenha cobra do jogador 1
    ctx.fillStyle = player1Alive ? player1Color : '#7f8c8d';
    ctx.globalAlpha = player1Alive ? 1 : 0.5;
    for (let segment of player1Snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }
    
    // Desenha cobra do jogador 2
    ctx.fillStyle = player2Alive ? player2Color : '#7f8c8d';
    ctx.globalAlpha = player2Alive ? 1 : 0.5;
    for (let segment of player2Snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }
    
    ctx.globalAlpha = 1;
}

/**
 * Desenha o jogo no canvas
 * @param {Array} snake - Array com os segmentos da cobra
 * @param {Object} food - Objeto com a posição da comida
 * @param {Array} obstacles - Array com os obstáculos
 * @param {string} snakeColor - Cor da cobra baseada no nível
 */
function drawGame(snake, food, obstacles, snakeColor, powerups = [], activePowerupEffects = [], multiplayerData = null) {
    // Limpa o canvas com cor de fundo
    ctx.fillStyle = '#1a252f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Modo multiplayer ou single player
    if (multiplayerData) {
        // Desenha cobras do multiplayer
        drawMultiplayerSnakes(
            multiplayerData.player1Snake,
            multiplayerData.player2Snake,
            multiplayerData.player1Color,
            multiplayerData.player2Color,
            multiplayerData.player1Alive,
            multiplayerData.player2Alive
        );
    } else {
        // Desenha efeito de invencibilidade antes da cobra (single player)
        if (activePowerupEffects.some(effect => effect.type === 'invincibility')) {
            drawInvincibilityEffect(snake);
        }
        
        // Desenha a cobra com cor do nível atual (single player)
        ctx.fillStyle = snakeColor;
        for (let segment of snake) {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        }
    }
    
    // Desenha efeito de multiplicador de pontos na comida (apenas single player)
    if (!multiplayerData && activePowerupEffects.some(effect => effect.type === 'score_multiplier')) {
        drawScoreMultiplierEffect(food);
    }
    
    // Desenha a comida em vermelho
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    
    // Desenha os obstáculos em cinza (apenas single player)
    if (!multiplayerData) {
        ctx.fillStyle = '#95a5a6';
        for (let obstacle of obstacles) {
            ctx.fillRect(obstacle.x * gridSize, obstacle.y * gridSize, gridSize - 2, gridSize - 2);
        }
    }
    
    // Desenha todos os power-ups (apenas single player)
    if (!multiplayerData) {
        for (let powerup of powerups) {
            drawPowerup(powerup);
        }
    }
    
    // Restaura configurações do canvas
    ctx.globalAlpha = 1;
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
}

// Exporta as funções para uso em outros módulos
export { initCanvas, drawGame, canvas, ctx, gridSize, tileCount };