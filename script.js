// Configuração do canvas responsivo
let canvas, ctx, gridSize, tileCount;

function initCanvas() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Calcula tamanho baseado na tela
    const maxSize = Math.min(window.innerWidth - 40, window.innerHeight - 300, 600);
    const canvasSize = Math.floor(maxSize / 20) * 20; // Múltiplo de 20 para grid perfeito
    
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    
    gridSize = 20;
    tileCount = canvas.width / gridSize;
}

// Tratamento de erros para localStorage
function safeLocalStorage() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return localStorage;
    } catch(e) {
        // Fallback se localStorage não estiver disponível
        return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {}
        };
    }
}

const storage = safeLocalStorage();

let snake = [
    {x: 10, y: 10}
];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let gameRunning = true;
let gameSpeed = 400;
let level = 1;
let obstacles = [];
let currentPlayer = 'Player';
let gameStarted = false;

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    // Verifica se a comida não está na cobra ou em obstáculos
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            return;
        }
    }
    
    for (let obstacle of obstacles) {
        if (obstacle.x === food.x && obstacle.y === food.y) {
            generateFood();
            return;
        }
    }
}

function calculateLevel() {
    return Math.floor(score / 50) + 1;
}

function getLevelColor() {
    const colors = ['#2ecc71', '#3498db', '#9b59b6', '#e67e22', '#e74c3c', '#f39c12'];
    return colors[(level - 1) % colors.length];
}

function generateObstacles() {
    obstacles = [];
    const obstacleCount = Math.min(level - 1, 8);
    
    for (let i = 0; i < obstacleCount; i++) {
        let obstacle;
        let validPosition = false;
        
        while (!validPosition) {
            obstacle = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
            
            validPosition = true;
            
            // Verifica se não está na cobra
            for (let segment of snake) {
                if (segment.x === obstacle.x && segment.y === obstacle.y) {
                    validPosition = false;
                    break;
                }
            }
            
            // Verifica se não está na comida
            if (food.x === obstacle.x && food.y === obstacle.y) {
                validPosition = false;
            }
            
            // Verifica se não está em outros obstáculos
            for (let existingObstacle of obstacles) {
                if (existingObstacle.x === obstacle.x && existingObstacle.y === obstacle.y) {
                    validPosition = false;
                    break;
                }
            }
        }
        
        obstacles.push(obstacle);
    }
}

function drawGame() {
    ctx.fillStyle = '#1a252f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Desenha a cobra com cor da fase
    ctx.fillStyle = getLevelColor();
    for (let segment of snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }
    
    // Desenha a comida
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    
    // Desenha os obstáculos
    ctx.fillStyle = '#95a5a6';
    for (let obstacle of obstacles) {
        ctx.fillRect(obstacle.x * gridSize, obstacle.y * gridSize, gridSize - 2, gridSize - 2);
    }
}

function moveSnake() {
    if (!gameRunning) return;
    
    if (dx === 0 && dy === 0) return;
    
    let head = {x: snake[0].x + dx, y: snake[0].y + dy};
    
    // Wrap around nas bordas
    if (head.x < 0) {
        head.x = tileCount - 1;
    } else if (head.x >= tileCount) {
        head.x = 0;
    }
    
    if (head.y < 0) {
        head.y = tileCount - 1;
    } else if (head.y >= tileCount) {
        head.y = 0;
    }
    
    // Verifica colisão com o próprio corpo
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }
    
    // Verifica colisão com obstáculos
    for (let obstacle of obstacles) {
        if (head.x === obstacle.x && head.y === obstacle.y) {
            gameOver();
            return;
        }
    }
    
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        
        // Verifica mudança de nível
        const newLevel = calculateLevel();
        if (newLevel > level) {
            level = newLevel;
            document.getElementById('level').textContent = level;
            generateObstacles();
        }
        
        generateFood();
        
        // Acelera muito gradualmente: só a cada 50 pontos (5 comidas) e apenas 2ms mais rápido
        if (score % 50 === 0 && score > 0 && gameSpeed > 200) {
            gameSpeed -= 2;
            updateGameSpeed();
        }
    } else {
        snake.pop();
    }
}

function gameOver() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverPlayer').textContent = currentPlayer;
    
    // Verifica se é um high score
    if (isHighScore(score)) {
        saveHighScore(currentPlayer, score, level);
        document.getElementById('newHighScore').style.display = 'block';
    } else {
        document.getElementById('newHighScore').style.display = 'none';
    }
    
    document.getElementById('gameOver').style.display = 'block';
}

function restartGame() {
    initializeGame();
}

function changeDirection(event) {
    if (!gameRunning) return;
    
    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;
    
    // Impede movimento reverso apenas se a cobra tiver mais de 1 segmento
    const preventReverse = snake.length > 1;
    
    if (keyPressed === 37 && (!preventReverse || !goingRight)) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === 38 && (!preventReverse || !goingDown)) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === 39 && (!preventReverse || !goingLeft)) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === 40 && (!preventReverse || !goingUp)) {
        dx = 0;
        dy = 1;
    }
}

function setDirection(newDx, newDy) {
    if (!gameRunning) return;
    
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;
    
    // Impede movimento reverso apenas se a cobra tiver mais de 1 segmento
    const preventReverse = snake.length > 1;
    
    // Evita mudanças de direção inválidas
    if (newDx === -1 && (!preventReverse || !goingRight)) { // Esquerda
        dx = -1;
        dy = 0;
    } else if (newDy === -1 && (!preventReverse || !goingDown)) { // Cima
        dx = 0;
        dy = -1;
    } else if (newDx === 1 && (!preventReverse || !goingLeft)) { // Direita
        dx = 1;
        dy = 0;
    } else if (newDy === 1 && (!preventReverse || !goingUp)) { // Baixo
        dx = 0;
        dy = 1;
    }
}

// Controles touch para mobile
function initTouchControls() {
    document.getElementById('upBtn').addEventListener('click', () => setDirection(0, -1));
    document.getElementById('downBtn').addEventListener('click', () => setDirection(0, 1));
    document.getElementById('leftBtn').addEventListener('click', () => setDirection(-1, 0));
    document.getElementById('rightBtn').addEventListener('click', () => setDirection(1, 0));
    
    // Controles de swipe
    let touchStartX = 0;
    let touchStartY = 0;
    
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: false });
    
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (!touchStartX || !touchStartY) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        const minSwipeDistance = 30;
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (Math.abs(diffX) > minSwipeDistance) {
                if (diffX > 0) {
                    setDirection(-1, 0); // Esquerda
                } else {
                    setDirection(1, 0); // Direita
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(diffY) > minSwipeDistance) {
                if (diffY > 0) {
                    setDirection(0, -1); // Cima
                } else {
                    setDirection(0, 1); // Baixo
                }
            }
        }
        
        touchStartX = 0;
        touchStartY = 0;
    }, { passive: false });
}

function gameLoop() {
    // Performance optimization: só executa se o jogo estiver rodando
    if (!gameRunning) return;
    
    moveSnake();
    drawGame();
}

// Otimização: use requestAnimationFrame para melhor performance
function startGameLoop() {
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    
    // Usa requestAnimationFrame para sincronizar com o refresh rate da tela
    let lastTime = 0;
    
    function loop(currentTime) {
        if (currentTime - lastTime >= gameSpeed) {
            gameLoop();
            lastTime = currentTime;
        }
        
        if (gameRunning) {
            requestAnimationFrame(loop);
        }
    }
    
    // Fallback para setInterval se requestAnimationFrame não estiver disponível
    if (typeof requestAnimationFrame === 'undefined') {
        gameInterval = setInterval(gameLoop, gameSpeed);
    } else {
        requestAnimationFrame(loop);
    }
}

let gameInterval;

function updateGameSpeed() {
    if (gameRunning) {
        startGameLoop();
    }
}

// Funções de navegação e highscores
function startGame() {
    const playerNameInput = document.getElementById('playerName');
    currentPlayer = playerNameInput.value.trim() || 'Player';
    
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('highscoresScreen').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    document.getElementById('currentPlayer').textContent = currentPlayer;
    
    gameStarted = true;
    initializeGame();
}

function backToStart() {
    document.getElementById('startScreen').style.display = 'flex';
    document.getElementById('highscoresScreen').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'none';
    gameStarted = false;
    gameRunning = false;
    if (gameInterval) {
        clearInterval(gameInterval);
    }
}

function showHighScores() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('highscoresScreen').style.display = 'flex';
    displayHighScores();
}

function getHighScores() {
    try {
        const scores = storage.getItem('snakeHighScores');
        return scores ? JSON.parse(scores) : [];
    } catch(e) {
        console.warn('Error loading high scores:', e);
        return [];
    }
}

function saveHighScore(name, score, level) {
    const highScores = getHighScores();
    const newScore = {
        name: name,
        score: score,
        level: level,
        date: new Date().toLocaleDateString()
    };
    
    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    
    // Manter apenas os top 10
    if (highScores.length > 10) {
        highScores.splice(10);
    }
    
    try {
        storage.setItem('snakeHighScores', JSON.stringify(highScores));
    } catch(e) {
        console.warn('Error saving high score:', e);
    }
    return highScores.findIndex(s => s === newScore) + 1; // Retorna a posição do novo score
}

function isHighScore(score) {
    const highScores = getHighScores();
    return highScores.length < 10 || score > highScores[highScores.length - 1].score;
}

function displayHighScores() {
    const highScores = getHighScores();
    const highScoresList = document.getElementById('highscoresList');
    
    if (highScores.length === 0) {
        highScoresList.innerHTML = '<p style="color: #bdc3c7; font-style: italic;">No high scores yet!</p>';
        return;
    }
    
    let html = '';
    highScores.forEach((score, index) => {
        const rank = index + 1;
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
        html += `
            <div class="highscore-item">
                <div class="highscore-rank">${rank}${medal}</div>
                <div class="highscore-name">${score.name}</div>
                <div class="highscore-score">${score.score}</div>
            </div>
        `;
    });
    
    highScoresList.innerHTML = html;
}

function initializeGame() {
    initCanvas(); // Inicializa canvas responsivo
    
    // Posição inicial segura (centro do grid)
    const centerX = Math.floor(tileCount / 2);
    const centerY = Math.floor(tileCount / 2);
    
    snake = [{x: centerX, y: centerY}];
    dx = 0;
    dy = 0;
    score = 0;
    level = 1;
    obstacles = [];
    gameRunning = true;
    gameSpeed = 400;
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('gameOver').style.display = 'none';
    generateFood();
    startGameLoop();
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    try {
        initCanvas();
        initTouchControls();
        
        // Permitir Enter para iniciar o jogo
        document.getElementById('playerName').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                startGame();
            }
        });
        
        // Redimensiona canvas quando a tela muda
        window.addEventListener('resize', function() {
            if (gameStarted && canvas) {
                initCanvas();
            }
        });
        
        // Só gera comida inicial, não inicia o loop
        generateFood();
        
    } catch(error) {
        console.error('Error initializing game:', error);
        // Fallback em caso de erro
        document.body.innerHTML = '<div style="text-align: center; color: white; padding: 50px;"><h1>😔 Game Error</h1><p>Sorry, the game failed to load. Please refresh the page.</p></div>';
    }
});

document.addEventListener('keydown', changeDirection);