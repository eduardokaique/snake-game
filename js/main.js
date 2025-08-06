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
import { generateFood, generateObstacles, moveSnake, updatePowerups } from './modules/gameLogic.js';
import { updatePowerupEffects, clearAllPowerups, getActivePowerups, getActivePowerupEffects } from './modules/powerups.js';
import { 
    initMultiplayer, 
    handleMultiplayerControls, 
    updateMultiplayerGame,
    setGameMode,
    getGameMode,
    getPlayerSnakes,
    getMultiplayerState,
    clearMultiplayerState,
    multiplayerGameState
} from './modules/multiplayer.js';
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
    try {
        setGameMode('singleplayer');
        const playerName = getPlayerName();
        
        // Atualiza variável global do jogador atual
        Object.assign(gameState, { currentPlayer: playerName });
        
        // Muda para tela do jogo
        showScreen(SCREENS.GAME);
        setupSinglePlayerUI();
        updatePlayerInfo(playerName);
        
        // Inicializa o jogo
        initializeGame();
    } catch (error) {
        console.error('Error starting game:', error);
    }
}

/**
 * Inicializa todos os componentes do jogo
 */
function initializeGame() {
    try {
        // Configura canvas responsivo
        initCanvas();
        
        // Reseta estado do jogo
        resetGameState(tileCount);
        
        // Limpa power-ups anteriores
        clearAllPowerups();
        
        // Atualiza UI
        updateScore(gameState.score);
        updateLevel(gameState.level);
        
        // Gera comida inicial
        generateFood(tileCount);
        
        // Inicia loop do jogo
        startGameLoop();
    } catch (error) {
        console.error('Error initializing game:', error);
    }
}

/**
 * Loop principal do jogo
 * Controla movimento, renderização e lógica do jogo
 */
function gameLoop() {
    const currentMode = getGameMode();
    
    if (currentMode === 'multiplayer') {
        multiplayerGameLoop();
        return;
    }
    
    if (!gameState.isRunning) return;
    
    // Atualiza sistema de power-ups
    updatePowerups(tileCount);
    
    // Atualiza efeitos dos power-ups
    const powerupStateChanges = updatePowerupEffects(gameState);
    if (powerupStateChanges.speed !== undefined) {
        gameState.speed = powerupStateChanges.speed;
        updateGameSpeed();
    }
    
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
            
        case 'powerup-collected':
            // Power-up coletado, efeitos já aplicados
            updateGameSpeed();
            break;
            
        case 'game-over':
            endGame();
            return;
    }
    
    // Renderiza o jogo com power-ups e efeitos
    drawGame(snake, food, obstacles, getLevelColor(), getActivePowerups(), getActivePowerupEffects());
}

/**
 * Loop do jogo multiplayer
 */
function multiplayerGameLoop() {
    if (!multiplayerGameState.isRunning) return;
    
    const result = updateMultiplayerGame(tileCount, food, (tc) => generateFood(tc));
    
    // Processa eventos do multiplayer
    for (let event of result.events) {
        switch (event.type) {
            case 'food_eaten':
                updateMultiplayerScores();
                break;
            case 'player_died':
                updatePlayerStatus(event.player, false);
                break;
            case 'head_collision':
                updatePlayerStatus('player1', false);
                updatePlayerStatus('player2', false);
                break;
        }
    }
    
    // Verifica fim de jogo
    if (result.status === 'game_over') {
        endMultiplayerGame(result.winner);
        return;
    }
    
    // Renderiza jogo multiplayer
    const playerSnakes = getPlayerSnakes();
    const mpState = getMultiplayerState();
    
    drawGame(null, food, [], '#2ecc71', [], [], {
        player1Snake: playerSnakes.player1,
        player2Snake: playerSnakes.player2,
        player1Color: mpState.player1.color,
        player2Color: mpState.player2.color,
        player1Alive: mpState.player1.isAlive,
        player2Alive: mpState.player2.isAlive
    });
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
        const currentMode = getGameMode();
        const speed = currentMode === 'multiplayer' ? multiplayerGameState.gameSpeed : gameState.speed;
        const isRunning = currentMode === 'multiplayer' ? multiplayerGameState.isRunning : gameState.isRunning;
        
        if (currentTime - lastTime >= speed) {
            gameLoop();
            lastTime = currentTime;
        }
        
        if (isRunning) {
            animationId = requestAnimationFrame(loop);
        }
    }
    
    // Inicia o loop
    if (typeof requestAnimationFrame !== 'undefined') {
        animationId = requestAnimationFrame(loop);
    } else {
        // Fallback para navegadores antigos
        const currentMode = getGameMode();
        const speed = currentMode === 'multiplayer' ? multiplayerGameState.gameSpeed : gameState.speed;
        gameInterval = setInterval(gameLoop, speed);
    }
}

/**
 * Atualiza a velocidade do jogo (quando muda de nível)
 */
function updateGameSpeed() {
    const currentMode = getGameMode();
    
    if (currentMode === 'singleplayer' && gameState.isRunning) {
        startGameLoop();
    } else if (currentMode === 'multiplayer' && multiplayerGameState.isRunning) {
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
    
    // Limpa estado do multiplayer
    clearMultiplayerState();
    setGameMode('singleplayer');
    
    // Esconde telas de game over
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('multiplayerGameOver').style.display = 'none';
    
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
            drawGame(snake, food, obstacles, getLevelColor(), getActivePowerups(), getActivePowerupEffects());
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
        drawGame(snake, food, obstacles, getLevelColor(), getActivePowerups(), getActivePowerupEffects());
        
        
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
 * Inicia jogo multiplayer
 */
function startMultiplayer() {
    try {
        setGameMode('multiplayer');
        showScreen(SCREENS.GAME);
        
        // Configura UI para multiplayer
        setupMultiplayerUI();
        
        // Inicializa canvas
        initCanvas();
        
        // Inicializa multiplayer
        initMultiplayer(tileCount);
        
        // Gera comida inicial
        generateFood(tileCount);
        
        // Inicia loop do jogo
        startGameLoop();
    } catch (error) {
        console.error('Error starting multiplayer game:', error);
    }
}

/**
 * Configura UI para modo multiplayer
 */
function setupMultiplayerUI() {
    try {
        document.getElementById('singlePlayerInfo').style.display = 'none';
        document.getElementById('multiplayerInfo').style.display = 'block';
        document.getElementById('controlsText').textContent = '🎮 Player 1: WASD • Player 2: Arrow Keys';
        
        updateMultiplayerScores();
        updatePlayerStatus('player1', true);
        updatePlayerStatus('player2', true);
    } catch (error) {
        console.error('Error setting up multiplayer UI:', error);
    }
}

/**
 * Configura UI para modo single player
 */
function setupSinglePlayerUI() {
    document.getElementById('singlePlayerInfo').style.display = 'block';
    document.getElementById('multiplayerInfo').style.display = 'none';
    document.getElementById('controlsText').textContent = '🖮 Use arrow keys to control the snake';
}

/**
 * Atualiza pontuações do multiplayer
 */
function updateMultiplayerScores() {
    const mpState = getMultiplayerState();
    document.getElementById('player1Score').textContent = mpState.player1.score;
    document.getElementById('player2Score').textContent = mpState.player2.score;
}

/**
 * Atualiza status do jogador
 */
function updatePlayerStatus(player, isAlive) {
    const statusElement = document.getElementById(`${player}Status`);
    if (isAlive) {
        statusElement.textContent = '🐍 Alive';
        statusElement.className = 'player-status alive';
    } else {
        statusElement.textContent = '💀 Dead';
        statusElement.className = 'player-status dead';
    }
}

/**
 * Finaliza jogo multiplayer
 */
function endMultiplayerGame(winner) {
    const mpState = getMultiplayerState();
    
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('multiplayerGameOver').style.display = 'block';
    
    document.getElementById('player1FinalScore').textContent = mpState.player1.score;
    document.getElementById('player2FinalScore').textContent = mpState.player2.score;
    
    let winnerText = '';
    if (winner === 'draw') {
        winnerText = "🤝 It's a Draw!";
        document.getElementById('multiplayerResultTitle').textContent = "Draw!";
    } else if (winner === 'player1') {
        winnerText = "🏆 Player 1 Wins!";
        document.getElementById('multiplayerResultTitle').textContent = "Player 1 Wins!";
    } else if (winner === 'player2') {
        winnerText = "🏆 Player 2 Wins!";
        document.getElementById('multiplayerResultTitle').textContent = "Player 2 Wins!";
    }
    
    document.getElementById('multiplayerWinner').textContent = winnerText;
}

/**
 * Reinicia jogo multiplayer
 */
function restartMultiplayer() {
    document.getElementById('multiplayerGameOver').style.display = 'none';
    
    // Reinicia multiplayer
    initMultiplayer(tileCount);
    generateFood(tileCount);
    
    // Atualiza UI
    updateMultiplayerScores();
    updatePlayerStatus('player1', true);
    updatePlayerStatus('player2', true);
    
    // Inicia loop
    startGameLoop();
}

/**
 * Expõe funções globais para uso no HTML e inicializa o jogo
 * (Necessário para compatibilidade com onclick handlers)
 */
function exposeGlobalFunctions() {
    window.startGame = startGame;
    window.startMultiplayer = startMultiplayer;
    window.restartGame = restartGame;
    window.restartMultiplayer = restartMultiplayer;
    window.backToStart = backToStart;
    window.showHighScores = showHighScores;
}

/**
 * Inicializa o jogo quando o DOM estiver pronto
 */
function initializeApp() {
    initGame();
    exposeGlobalFunctions();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}