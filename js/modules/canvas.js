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
 * Desenha o jogo no canvas
 * @param {Array} snake - Array com os segmentos da cobra
 * @param {Object} food - Objeto com a posição da comida
 * @param {Array} obstacles - Array com os obstáculos
 * @param {string} snakeColor - Cor da cobra baseada no nível
 */
function drawGame(snake, food, obstacles, snakeColor) {
    // Limpa o canvas com cor de fundo
    ctx.fillStyle = '#1a252f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Desenha a cobra com cor do nível atual
    ctx.fillStyle = snakeColor;
    for (let segment of snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }
    
    // Desenha a comida em vermelho
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    
    // Desenha os obstáculos em cinza
    ctx.fillStyle = '#95a5a6';
    for (let obstacle of obstacles) {
        ctx.fillRect(obstacle.x * gridSize, obstacle.y * gridSize, gridSize - 2, gridSize - 2);
    }
}

// Exporta as funções para uso em outros módulos
export { initCanvas, drawGame, canvas, ctx, gridSize, tileCount };