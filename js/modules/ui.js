/**
 * Módulo UI - Gerencia interface do usuário
 * Responsável pela navegação entre telas e atualização de elementos da UI
 */

import { generateHighScoresHTML } from './storage.js';

/**
 * IDs das telas principais
 */
const SCREENS = {
    START: 'startScreen',
    GAME: 'gameContainer',
    HIGHSCORES: 'highscoresScreen',
    GAME_OVER: 'gameOver'
};

/**
 * Mostra uma tela específica e esconde as outras
 * @param {string} screenId - ID da tela a ser mostrada
 */
function showScreen(screenId) {
    // Lista de todas as telas
    const screens = [SCREENS.START, SCREENS.GAME, SCREENS.HIGHSCORES];
    
    // Esconde todas as telas
    screens.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });
    
    // Mostra a tela solicitada
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.style.display = screenId === SCREENS.START || screenId === SCREENS.HIGHSCORES ? 'flex' : 'block';
    }
    
    // Esconde tela de game over se não for a tela do jogo
    if (screenId !== SCREENS.GAME) {
        const gameOverScreen = document.getElementById(SCREENS.GAME_OVER);
        if (gameOverScreen) {
            gameOverScreen.style.display = 'none';
        }
    }
}

/**
 * Atualiza informações do jogador na tela do jogo
 * @param {string} playerName - Nome do jogador
 */
function updatePlayerInfo(playerName) {
    const currentPlayerElement = document.getElementById('currentPlayer');
    if (currentPlayerElement) {
        currentPlayerElement.textContent = playerName;
    }
}

/**
 * Atualiza a pontuação na tela
 * @param {number} score - Pontuação atual
 */
function updateScore(score) {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

/**
 * Atualiza o nível na tela
 * @param {number} level - Nível atual
 */
function updateLevel(level) {
    const levelElement = document.getElementById('level');
    if (levelElement) {
        levelElement.textContent = level;
    }
}

/**
 * Mostra a tela de game over com informações da partida
 * @param {string} playerName - Nome do jogador
 * @param {number} finalScore - Pontuação final
 * @param {boolean} isNewHighScore - Se é uma nova pontuação máxima
 */
function showGameOver(playerName, finalScore, isNewHighScore) {
    // Atualiza informações na tela de game over
    const gameOverPlayerElement = document.getElementById('gameOverPlayer');
    const finalScoreElement = document.getElementById('finalScore');
    const newHighScoreElement = document.getElementById('newHighScore');
    
    if (gameOverPlayerElement) {
        gameOverPlayerElement.textContent = playerName;
    }
    
    if (finalScoreElement) {
        finalScoreElement.textContent = finalScore;
    }
    
    // Mostra/esconde mensagem de novo recorde
    if (newHighScoreElement) {
        newHighScoreElement.style.display = isNewHighScore ? 'block' : 'none';
    }
    
    // Mostra a tela de game over
    const gameOverScreen = document.getElementById(SCREENS.GAME_OVER);
    if (gameOverScreen) {
        gameOverScreen.style.display = 'block';
    }
}

/**
 * Atualiza a lista de high scores na tela correspondente
 */
function updateHighScoresList() {
    const highScoresListElement = document.getElementById('highscoresList');
    if (highScoresListElement) {
        highScoresListElement.innerHTML = generateHighScoresHTML();
    }
}

/**
 * Obtém o nome do jogador do input
 * @returns {string} Nome do jogador ou 'Player' como padrão
 */
function getPlayerName() {
    const playerNameInput = document.getElementById('playerName');
    const name = playerNameInput ? playerNameInput.value.trim() : '';
    return name || 'Player';
}

/**
 * Limpa o input do nome do jogador
 */
function clearPlayerNameInput() {
    const playerNameInput = document.getElementById('playerName');
    if (playerNameInput) {
        playerNameInput.value = '';
    }
}

/**
 * Configura event listeners para redimensionamento da tela
 * @param {Function} resizeCallback - Função a ser chamada no redimensionamento
 */
function setupResizeHandler(resizeCallback) {
    window.addEventListener('resize', () => {
        if (typeof resizeCallback === 'function') {
            resizeCallback();
        }
    });
}

/**
 * Mostra/esconde controles mobile baseado no tamanho da tela
 */
function updateMobileControls() {
    const mobileControls = document.getElementById('mobileControls');
    const desktopControls = document.querySelector('.desktop-controls');
    
    const isMobile = window.innerWidth <= 768;
    
    if (mobileControls) {
        mobileControls.style.display = isMobile ? 'block' : 'none';
    }
    
    if (desktopControls) {
        desktopControls.style.display = isMobile ? 'none' : 'block';
    }
}

/**
 * Inicializa elementos da UI
 */
function initUI() {
    // Configura controles mobile baseado no tamanho inicial da tela
    updateMobileControls();
    
    // Atualiza controles mobile quando a tela é redimensionada
    setupResizeHandler(updateMobileControls);
    
    // Foco inicial no input do nome
    const playerNameInput = document.getElementById('playerName');
    if (playerNameInput) {
        playerNameInput.focus();
    }
}

export { 
    SCREENS,
    showScreen, 
    updatePlayerInfo, 
    updateScore, 
    updateLevel, 
    showGameOver, 
    updateHighScoresList,
    getPlayerName,
    clearPlayerNameInput,
    setupResizeHandler,
    updateMobileControls,
    initUI
};