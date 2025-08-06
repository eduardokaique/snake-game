/**
 * Módulo Multiplayer - Sistema de multiplayer local para 2 jogadores
 * Controla duas cobras independentes com controles diferentes
 */

// Estados das cobras dos jogadores
let player1Snake = [{ x: 8, y: 10 }];
let player2Snake = [{ x: 12, y: 10 }];

// Direções das cobras
let player1Direction = { dx: 0, dy: 0 };
let player2Direction = { dx: 0, dy: 0 };

// Estados dos jogadores
let multiplayerGameState = {
    mode: 'singleplayer', // 'singleplayer' ou 'multiplayer'
    isRunning: false,
    isStarted: false,
    gameSpeed: 400,
    player1: {
        score: 0,
        isAlive: true,
        name: 'Player 1',
        color: '#2ecc71'
    },
    player2: {
        score: 0,
        isAlive: true,
        name: 'Player 2', 
        color: '#e74c3c'
    }
};

/**
 * Códigos das teclas para cada jogador
 */
const MULTIPLAYER_KEYS = {
    PLAYER1: {
        LEFT: 65,   // A
        UP: 87,     // W
        RIGHT: 68,  // D
        DOWN: 83    // S
    },
    PLAYER2: {
        LEFT: 37,   // Seta Esquerda
        UP: 38,     // Seta Cima
        RIGHT: 39,  // Seta Direita
        DOWN: 40    // Seta Baixo
    }
};

/**
 * Inicializa estado do multiplayer
 * @param {number} tileCount - Número de tiles no grid
 */
function initMultiplayer(tileCount) {
    const centerY = Math.floor(tileCount / 2);
    const quarterX = Math.floor(tileCount / 4);
    
    // Posiciona jogadores em lados opostos
    player1Snake = [{ x: quarterX, y: centerY }];
    player2Snake = [{ x: tileCount - quarterX, y: centerY }];
    
    // Reseta direções
    player1Direction = { dx: 0, dy: 0 };
    player2Direction = { dx: 0, dy: 0 };
    
    // Reseta estados
    multiplayerGameState.player1.score = 0;
    multiplayerGameState.player1.isAlive = true;
    multiplayerGameState.player2.score = 0;
    multiplayerGameState.player2.isAlive = true;
    multiplayerGameState.isRunning = true;
    multiplayerGameState.isStarted = true;
}

/**
 * Define direção do Player 1
 * @param {number} dx - Direção X
 * @param {number} dy - Direção Y
 */
function setPlayer1Direction(dx, dy) {
    if (!multiplayerGameState.isRunning || !multiplayerGameState.player1.isAlive) return;
    
    // Previne movimento reverso
    const preventReverse = player1Snake.length > 1;
    
    const goingUp = player1Direction.dy === -1;
    const goingDown = player1Direction.dy === 1;
    const goingRight = player1Direction.dx === 1;
    const goingLeft = player1Direction.dx === -1;
    
    if (dx === -1 && (!preventReverse || !goingRight)) {
        player1Direction.dx = -1;
        player1Direction.dy = 0;
    } else if (dy === -1 && (!preventReverse || !goingDown)) {
        player1Direction.dx = 0;
        player1Direction.dy = -1;
    } else if (dx === 1 && (!preventReverse || !goingLeft)) {
        player1Direction.dx = 1;
        player1Direction.dy = 0;
    } else if (dy === 1 && (!preventReverse || !goingUp)) {
        player1Direction.dx = 0;
        player1Direction.dy = 1;
    }
}

/**
 * Define direção do Player 2
 * @param {number} dx - Direção X
 * @param {number} dy - Direção Y
 */
function setPlayer2Direction(dx, dy) {
    if (!multiplayerGameState.isRunning || !multiplayerGameState.player2.isAlive) return;
    
    // Previne movimento reverso
    const preventReverse = player2Snake.length > 1;
    
    const goingUp = player2Direction.dy === -1;
    const goingDown = player2Direction.dy === 1;
    const goingRight = player2Direction.dx === 1;
    const goingLeft = player2Direction.dx === -1;
    
    if (dx === -1 && (!preventReverse || !goingRight)) {
        player2Direction.dx = -1;
        player2Direction.dy = 0;
    } else if (dy === -1 && (!preventReverse || !goingDown)) {
        player2Direction.dx = 0;
        player2Direction.dy = -1;
    } else if (dx === 1 && (!preventReverse || !goingLeft)) {
        player2Direction.dx = 1;
        player2Direction.dy = 0;
    } else if (dy === 1 && (!preventReverse || !goingUp)) {
        player2Direction.dx = 0;
        player2Direction.dy = 1;
    }
}

/**
 * Processa controles do multiplayer
 * @param {KeyboardEvent} event - Evento do teclado
 */
function handleMultiplayerControls(event) {
    if (multiplayerGameState.mode !== 'multiplayer') return;
    
    const keyPressed = event.keyCode;
    
    // Controles Player 1 (WASD)
    switch (keyPressed) {
        case MULTIPLAYER_KEYS.PLAYER1.LEFT:  // A
            setPlayer1Direction(-1, 0);
            break;
        case MULTIPLAYER_KEYS.PLAYER1.UP:    // W
            setPlayer1Direction(0, -1);
            break;
        case MULTIPLAYER_KEYS.PLAYER1.RIGHT: // D
            setPlayer1Direction(1, 0);
            break;
        case MULTIPLAYER_KEYS.PLAYER1.DOWN:  // S
            setPlayer1Direction(0, 1);
            break;
    }
    
    // Controles Player 2 (Setas)
    switch (keyPressed) {
        case MULTIPLAYER_KEYS.PLAYER2.LEFT:  // Seta Esquerda
            setPlayer2Direction(-1, 0);
            break;
        case MULTIPLAYER_KEYS.PLAYER2.UP:    // Seta Cima
            setPlayer2Direction(0, -1);
            break;
        case MULTIPLAYER_KEYS.PLAYER2.RIGHT: // Seta Direita
            setPlayer2Direction(1, 0);
            break;
        case MULTIPLAYER_KEYS.PLAYER2.DOWN:  // Seta Baixo
            setPlayer2Direction(0, 1);
            break;
    }
}

/**
 * Move uma cobra específica
 * @param {Array} snake - Array da cobra
 * @param {Object} direction - Direção da cobra
 * @param {number} tileCount - Número de tiles no grid
 * @param {string} playerName - Nome do jogador
 * @returns {Object} Resultado do movimento
 */
function movePlayerSnake(snake, direction, tileCount, playerName) {
    if (direction.dx === 0 && direction.dy === 0) {
        return { status: 'continue' };
    }
    
    // Calcula nova posição da cabeça
    let head = {
        x: snake[0].x + direction.dx,
        y: snake[0].y + direction.dy
    };
    
    // Implementa wrap-around nas bordas
    if (head.x < 0) head.x = tileCount - 1;
    else if (head.x >= tileCount) head.x = 0;
    
    if (head.y < 0) head.y = tileCount - 1;
    else if (head.y >= tileCount) head.y = 0;
    
    // Verifica colisão com próprio corpo
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            return { status: 'collision', type: 'self' };
        }
    }
    
    // Verifica colisão com a outra cobra
    const otherSnake = playerName === 'player1' ? player2Snake : player1Snake;
    for (let segment of otherSnake) {
        if (head.x === segment.x && head.y === segment.y) {
            return { status: 'collision', type: 'opponent' };
        }
    }
    
    // Adiciona nova cabeça
    snake.unshift(head);
    
    return { status: 'moved', newHead: head };
}

/**
 * Verifica se há colisão entre as duas cobras
 * @returns {boolean} True se há colisão
 */
function checkSnakeCollision() {
    const head1 = player1Snake[0];
    const head2 = player2Snake[0];
    
    // Verifica se as cabeças colidiram
    if (head1.x === head2.x && head1.y === head2.y) {
        return true;
    }
    
    return false;
}

/**
 * Processa colisão com comida para multiplayer
 * @param {Array} snake - Cobra do jogador
 * @param {Object} food - Posição da comida
 * @param {Object} playerState - Estado do jogador
 * @returns {boolean} True se comeu comida
 */
function checkFoodCollisionMultiplayer(snake, food, playerState) {
    const head = snake[0];
    
    if (head.x === food.x && head.y === food.y) {
        playerState.score += 10;
        return true;
    }
    
    // Remove cauda se não comeu
    snake.pop();
    return false;
}

/**
 * Atualiza estado do jogo multiplayer
 * @param {number} tileCount - Número de tiles no grid
 * @param {Object} food - Posição da comida
 * @param {Function} generateFood - Função para gerar nova comida
 * @returns {Object} Estado do jogo após atualização
 */
function updateMultiplayerGame(tileCount, food, generateFood) {
    if (!multiplayerGameState.isRunning) {
        return { status: 'stopped' };
    }
    
    let gameResult = { status: 'continue', events: [] };
    
    // Move Player 1
    if (multiplayerGameState.player1.isAlive) {
        const result1 = movePlayerSnake(player1Snake, player1Direction, tileCount, 'player1');
        
        if (result1.status === 'collision') {
            multiplayerGameState.player1.isAlive = false;
            gameResult.events.push({ type: 'player_died', player: 'player1', cause: result1.type });
        } else if (result1.status === 'moved') {
            // Verifica se comeu comida
            if (checkFoodCollisionMultiplayer(player1Snake, food, multiplayerGameState.player1)) {
                generateFood(tileCount);
                gameResult.events.push({ type: 'food_eaten', player: 'player1' });
            }
        }
    }
    
    // Move Player 2
    if (multiplayerGameState.player2.isAlive) {
        const result2 = movePlayerSnake(player2Snake, player2Direction, tileCount, 'player2');
        
        if (result2.status === 'collision') {
            multiplayerGameState.player2.isAlive = false;
            gameResult.events.push({ type: 'player_died', player: 'player2', cause: result2.type });
        } else if (result2.status === 'moved') {
            // Verifica se comeu comida
            if (checkFoodCollisionMultiplayer(player2Snake, food, multiplayerGameState.player2)) {
                generateFood(tileCount);
                gameResult.events.push({ type: 'food_eaten', player: 'player2' });
            }
        }
    }
    
    // Verifica colisão frontal entre cobras
    if (multiplayerGameState.player1.isAlive && multiplayerGameState.player2.isAlive && checkSnakeCollision()) {
        multiplayerGameState.player1.isAlive = false;
        multiplayerGameState.player2.isAlive = false;
        gameResult.events.push({ type: 'head_collision' });
    }
    
    // Verifica fim de jogo
    if (!multiplayerGameState.player1.isAlive && !multiplayerGameState.player2.isAlive) {
        multiplayerGameState.isRunning = false;
        gameResult.status = 'game_over';
        gameResult.winner = 'draw';
    } else if (!multiplayerGameState.player1.isAlive) {
        multiplayerGameState.isRunning = false;
        gameResult.status = 'game_over';
        gameResult.winner = 'player2';
    } else if (!multiplayerGameState.player2.isAlive) {
        multiplayerGameState.isRunning = false;
        gameResult.status = 'game_over';
        gameResult.winner = 'player1';
    }
    
    return gameResult;
}

/**
 * Define modo de jogo
 * @param {string} mode - 'singleplayer' ou 'multiplayer'
 */
function setGameMode(mode) {
    multiplayerGameState.mode = mode;
}

/**
 * Obtém modo de jogo atual
 * @returns {string} Modo atual
 */
function getGameMode() {
    return multiplayerGameState.mode;
}

/**
 * Obtém estados das cobras dos jogadores
 * @returns {Object} Estados das cobras
 */
function getPlayerSnakes() {
    return {
        player1: [...player1Snake],
        player2: [...player2Snake]
    };
}

/**
 * Obtém estado completo do multiplayer
 * @returns {Object} Estado do multiplayer
 */
function getMultiplayerState() {
    return { ...multiplayerGameState };
}

/**
 * Limpa estado do multiplayer
 */
function clearMultiplayerState() {
    player1Snake = [{ x: 8, y: 10 }];
    player2Snake = [{ x: 12, y: 10 }];
    player1Direction = { dx: 0, dy: 0 };
    player2Direction = { dx: 0, dy: 0 };
    
    multiplayerGameState.isRunning = false;
    multiplayerGameState.isStarted = false;
    multiplayerGameState.player1.score = 0;
    multiplayerGameState.player1.isAlive = true;
    multiplayerGameState.player2.score = 0;
    multiplayerGameState.player2.isAlive = true;
}

export {
    initMultiplayer,
    handleMultiplayerControls,
    updateMultiplayerGame,
    setGameMode,
    getGameMode,
    getPlayerSnakes,
    getMultiplayerState,
    clearMultiplayerState,
    multiplayerGameState,
    MULTIPLAYER_KEYS
};