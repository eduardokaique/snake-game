/**
 * Snake Game - Arquivo Principal
 * 
 * Este é o jogo da cobrinha clássico implementado de forma modular e didática.
 * O jogo é totalmente responsivo e funciona em desktop e mobile.
 * 
 * Características:
 * - Sistema de níveis progressivos
 * - Obstáculos que aparecem conforme o nível
 * - Controles touch para mobile
 * - Sistema de high scores com localStorage
 * - Design responsivo
 * 
 * Autor: Snake Game Team
 * Versão: 2.0 - Refatorada
 */

// Importa todos os módulos necessários
import { initCanvas, drawGame, tileCount } from './modules/canvas.js';
import { 
    snake, 
    direction, 
    gameState, 
    food, 
    obstacles, 
    currentPlayer, 
    resetGameState, 
    getLevelColor 
} from './modules/gameState.js';
import { generateFood, generateObstacles, moveSnake } from './modules/gameLogic.js';
import { initControls } from './modules/controls.js';
import { saveHighScore, isHighScore } from './modules/storage.js';
import { 
    SCREENS,
    showScreen, 
    updatePlayerInfo, 
    updateScore, 
    updateLevel, 
    showGameOver, 
    updateHighScoresList,
    getPlayerName,
    initUI
} from './modules/ui.js';

/**
 * Variáveis globais do loop do jogo
 */
let gameInterval;
let animationId;

/**
 * Inicia uma nova partida
 * Configura o estado inicial e começa o loop do jogo
 */
function startGame() {
    const playerName = getPlayerName();
    
    // Atualiza variável global do jogador atual
    Object.assign(gameState, { currentPlayer: playerName });
    
    // Muda para tela do jogo
    showScreen(SCREENS.GAME);
    updatePlayerInfo(playerName);
    
    // Inicializa o jogo
    initializeGame();
}

/**
 * Inicializa todos os componentes do jogo
 */
function initializeGame() {
    // Configura canvas responsivo
    initCanvas();
    
    // Reseta estado do jogo
    resetGameState(tileCount);
    
    // Atualiza UI
    updateScore(gameState.score);
    updateLevel(gameState.level);
    
    // Gera comida inicial
    generateFood(tileCount);
    
    // Inicia loop do jogo
    startGameLoop();
}

/**
 * Loop principal do jogo
 * Controla movimento, renderização e lógica do jogo
 */
function gameLoop() {
    if (!gameState.isRunning) return;
    
    // Move a cobra e processa lógica
    const result = moveSnake(tileCount);
    
    // Processa resultado do movimento
    switch (result) {
        case 'food-eaten':
            updateScore(gameState.score);
            break;
            
        case 'level-up':
            updateScore(gameState.score);
            updateLevel(gameState.level);
            updateGameSpeed();
            break;
            
        case 'game-over':
            endGame();
            return;
    }
    
    // Renderiza o jogo
    drawGame(snake, food, obstacles, getLevelColor());
}

/**
 * Inicia o loop do jogo com controle de velocidade
 */
function startGameLoop() {
    // Para loop anterior se existir
    if (gameInterval) clearInterval(gameInterval);
    if (animationId) cancelAnimationFrame(animationId);
    
    // Usa requestAnimationFrame para melhor performance
    let lastTime = 0;
    
    function loop(currentTime) {
        if (currentTime - lastTime >= gameState.speed) {
            gameLoop();
            lastTime = currentTime;
        }
        
        if (gameState.isRunning) {
            animationId = requestAnimationFrame(loop);
        }
    }
    
    // Inicia o loop
    if (typeof requestAnimationFrame !== 'undefined') {
        animationId = requestAnimationFrame(loop);
    } else {
        // Fallback para navegadores antigos
        gameInterval = setInterval(gameLoop, gameState.speed);
    }
}

/**
 * Atualiza a velocidade do jogo (quando muda de nível)
 */
function updateGameSpeed() {
    if (gameState.isRunning) {
        startGameLoop();
    }
}

/**
 * Finaliza o jogo e mostra tela de game over
 */
function endGame() {
    gameState.isRunning = false;
    
    // Para o loop do jogo
    if (gameInterval) clearInterval(gameInterval);
    if (animationId) cancelAnimationFrame(animationId);
    
    // Verifica se é high score
    const isNewHighScore = isHighScore(gameState.score);
    
    // Salva high score se aplicável
    if (isNewHighScore) {
        saveHighScore(gameState.currentPlayer, gameState.score, gameState.level);
    }
    
    // Mostra tela de game over
    showGameOver(gameState.currentPlayer, gameState.score, isNewHighScore);
}

/**
 * Reinicia o jogo (botão Play Again)
 */
function restartGame() {
    initializeGame();
}

/**
 * Volta para a tela inicial
 */
function backToStart() {
    // Para o jogo se estiver rodando
    gameState.isRunning = false;
    gameState.isStarted = false;
    
    if (gameInterval) clearInterval(gameInterval);
    if (animationId) cancelAnimationFrame(animationId);
    
    // Volta para tela inicial
    showScreen(SCREENS.START);
}

/**
 * Mostra tela de high scores
 */
function showHighScores() {
    showScreen(SCREENS.HIGHSCORES);
    updateHighScoresList();
}

/**
 * Manipula redimensionamento da janela
 */
function handleResize() {
    if (gameState.isStarted) {
        initCanvas();
        // Redesenha o jogo se estiver rodando
        if (gameState.isRunning) {
            drawGame(snake, food, obstacles, getLevelColor());
        }
    }
}

/**
 * Inicialização quando a página carrega
 */
function initGame() {
    try {
        // Inicializa canvas
        initCanvas();
        
        // Inicializa controles
        initControls();
        
        // Inicializa UI
        initUI();
        
        // Configura redimensionamento
        window.addEventListener('resize', handleResize);
        
        // Gera comida inicial para visualização
        generateFood(tileCount);
        drawGame(snake, food, obstacles, getLevelColor());
        
        console.log('🐍 Snake Game inicializado com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao inicializar o jogo:', error);
        
        // Mostra mensagem de erro para o usuário
        document.body.innerHTML = `
            <div style="
                display: flex; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh; 
                background-color: #2c3e50; 
                color: white; 
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
            ">
                <div>
                    <h1>😔 Erro no Jogo</h1>
                    <p>Desculpe, ocorreu um erro ao carregar o jogo.</p>
                    <p>Por favor, recarregue a página.</p>
                    <button onclick="window.location.reload()" style="
                        background-color: #e74c3c; 
                        color: white; 
                        border: none; 
                        padding: 15px 30px; 
                        border-radius: 5px; 
                        cursor: pointer; 
                        font-size: 16px;
                        margin-top: 20px;
                    ">
                        Recarregar Página
                    </button>
                </div>
            </div>
        `;
    }
}

/**
 * Expõe funções globais para uso no HTML
 * (Necessário para compatibilidade com onclick handlers)
 */
window.startGame = startGame;
window.restartGame = restartGame;
window.backToStart = backToStart;
window.showHighScores = showHighScores;

/**
 * Inicializa o jogo quando o DOM estiver pronto
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}