/**
 * Módulo Game State - Gerencia o estado do jogo
 * Controla variáveis como pontuação, nível, velocidade e estado da cobra
 */

// Estado da cobra
let snake = [{ x: 10, y: 10 }];
let direction = { dx: 0, dy: 0 };

// Estado do jogo
let gameState = {
    score: 0,
    level: 1,
    speed: 400,
    isRunning: true,
    isStarted: false
};

// Objetos do jogo
let food = {};
let obstacles = [];

// Jogador atual
let currentPlayer = 'Player';

/**
 * Reseta o estado do jogo para o início
 * @param {number} tileCount - Número de tiles no grid
 */
function resetGameState(tileCount) {
    // Posiciona a cobra no centro do grid
    const centerX = Math.floor(tileCount / 2);
    const centerY = Math.floor(tileCount / 2);
    
    snake = [{ x: centerX, y: centerY }];
    direction = { dx: 0, dy: 0 };
    
    gameState = {
        score: 0,
        level: 1,
        speed: 400,
        isRunning: true,
        isStarted: true
    };
    
    obstacles = [];
}

/**
 * Atualiza a pontuação e verifica mudança de nível
 * @param {number} points - Pontos a serem adicionados
 */
function updateScore(points) {
    gameState.score += points;
    
    // Calcula novo nível (a cada 50 pontos)
    const newLevel = Math.floor(gameState.score / 50) + 1;
    if (newLevel > gameState.level) {
        gameState.level = newLevel;
        // Acelera o jogo gradualmente (máximo de velocidade: 200ms)
        if (gameState.speed > 200) {
            gameState.speed -= 2;
        }
        return true; // Indica que houve mudança de nível
    }
    return false;
}

/**
 * Retorna a cor da cobra baseada no nível atual
 * @returns {string} Cor hexadecimal
 */
function getLevelColor() {
    const colors = ['#2ecc71', '#3498db', '#9b59b6', '#e67e22', '#e74c3c', '#f39c12'];
    return colors[(gameState.level - 1) % colors.length];
}

/**
 * Define a direção da cobra (com prevenção de movimento reverso)
 * @param {number} newDx - Nova direção X (-1, 0, 1)
 * @param {number} newDy - Nova direção Y (-1, 0, 1)
 */
function setDirection(newDx, newDy) {
    if (!gameState.isRunning) return;
    
    // Previne movimento reverso apenas se a cobra tiver mais de 1 segmento
    const preventReverse = snake.length > 1;
    
    const goingUp = direction.dy === -1;
    const goingDown = direction.dy === 1;
    const goingRight = direction.dx === 1;
    const goingLeft = direction.dx === -1;
    
    // Verifica se o movimento é válido
    if (newDx === -1 && (!preventReverse || !goingRight)) { // Esquerda
        direction.dx = -1;
        direction.dy = 0;
    } else if (newDy === -1 && (!preventReverse || !goingDown)) { // Cima
        direction.dx = 0;
        direction.dy = -1;
    } else if (newDx === 1 && (!preventReverse || !goingLeft)) { // Direita
        direction.dx = 1;
        direction.dy = 0;
    } else if (newDy === 1 && (!preventReverse || !goingUp)) { // Baixo
        direction.dx = 0;
        direction.dy = 1;
    }
}

// Exporta o estado e funções para outros módulos
export { 
    snake, 
    direction, 
    gameState, 
    food, 
    obstacles, 
    currentPlayer, 
    resetGameState, 
    updateScore, 
    getLevelColor, 
    setDirection 
};