/**
 * Módulo Game Logic - Contém a lógica principal do jogo
 * Responsável pelo movimento da cobra, detecção de colisões e geração de elementos
 */

import { snake, direction, gameState, food, obstacles, powerupSpawnTimer, lastPowerupSpawn } from './gameState.js';
import { 
    POWERUP_CONFIG, 
    createPowerup, 
    addPowerup, 
    removeExpiredPowerups,
    checkPowerupCollision,
    applyPowerupEffect,
    updatePowerupEffects,
    getScoreMultiplier,
    isInvincible,
    applyMagnetEffect,
    clearAllPowerups,
    updatePowerupAnimation,
    isPowerupAt
} from './powerups.js';

/**
 * Gera uma nova posição para a comida
 * Garante que a comida não apareça na cobra ou em obstáculos
 * @param {number} tileCount - Número de tiles no grid
 */
function generateFood(tileCount) {
    let newFood;
    let validPosition = false;
    
    while (!validPosition) {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        validPosition = true;
        
        // Verifica se não está na cobra
        for (let segment of snake) {
            if (segment.x === newFood.x && segment.y === newFood.y) {
                validPosition = false;
                break;
            }
        }
        
        // Verifica se não está em obstáculos
        if (validPosition) {
            for (let obstacle of obstacles) {
                if (obstacle.x === newFood.x && obstacle.y === newFood.y) {
                    validPosition = false;
                    break;
                }
            }
        }
        
        // Verifica se não está em power-ups
        if (validPosition && isPowerupAt(newFood.x, newFood.y)) {
            validPosition = false;
        }
    }
    
    food.x = newFood.x;
    food.y = newFood.y;
}

/**
 * Gera obstáculos baseados no nível atual
 * Obstáculos aparecem a partir do nível 2
 * @param {number} tileCount - Número de tiles no grid
 */
function generateObstacles(tileCount) {
    obstacles.length = 0; // Limpa obstáculos existentes
    
    // Número de obstáculos baseado no nível (máximo 8)
    const obstacleCount = Math.min(gameState.level - 1, 8);
    
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
            if (validPosition && food.x === obstacle.x && food.y === obstacle.y) {
                validPosition = false;
            }
            
            // Verifica se não está em outros obstáculos
            if (validPosition) {
                for (let existingObstacle of obstacles) {
                    if (existingObstacle.x === obstacle.x && existingObstacle.y === obstacle.y) {
                        validPosition = false;
                        break;
                    }
                }
            }
            
            // Verifica se não está em power-ups
            if (validPosition && isPowerupAt(obstacle.x, obstacle.y)) {
                validPosition = false;
            }
        }
        
        obstacles.push(obstacle);
    }
}

/**
 * Atualiza sistema de power-ups
 * @param {number} tileCount - Número de tiles no grid
 */
function updatePowerups(tileCount) {
    const now = Date.now();
    
    // Atualiza animações
    updatePowerupAnimation();
    
    // Remove power-ups expirados
    removeExpiredPowerups();
    
    // Verifica se deve spawnar novo power-up
    if (gameState.level >= POWERUP_CONFIG.minSpawnLevel && 
        now - lastPowerupSpawn >= POWERUP_CONFIG.spawnInterval) {
        
        const newPowerup = createPowerup(tileCount, checkCollision);
        if (newPowerup && addPowerup(newPowerup)) {
            lastPowerupSpawn = now;
        }
    }
}

/**
 * Move a cobra baseado na direção atual
 * Verifica colisões e processa a lógica do jogo
 * @param {number} tileCount - Número de tiles no grid
 * @returns {string} 'continue', 'food-eaten', 'level-up', ou 'game-over'
 */
function moveSnake(tileCount) {
    if (!gameState.isRunning || (direction.dx === 0 && direction.dy === 0)) {
        return 'continue';
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
    
    // Verifica colisão com o próprio corpo
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameState.isRunning = false;
            return 'game-over';
        }
    }
    
    // Verifica colisão com obstáculos (apenas se não estiver invencível)
    if (!isInvincible()) {
        for (let obstacle of obstacles) {
            if (head.x === obstacle.x && head.y === obstacle.y) {
                gameState.isRunning = false;
                return 'game-over';
            }
        }
    }
    
    // Adiciona nova cabeça
    snake.unshift(head);
    
    // Verifica colisão com power-ups
    const collectedPowerup = checkPowerupCollision(head.x, head.y);
    if (collectedPowerup) {
        const stateChanges = applyPowerupEffect(collectedPowerup, gameState);
        
        // Aplica mudanças no estado do jogo
        if (stateChanges.speed !== undefined) {
            gameState.speed = stateChanges.speed;
        }
        
        return 'powerup-collected';
    }
    
    // Aplica efeito magnético na comida
    const magnetFood = applyMagnetEffect(food, head, tileCount);
    if (magnetFood) {
        food.x = magnetFood.x;
        food.y = magnetFood.y;
    }
    
    // Verifica se comeu a comida
    if (head.x === food.x && head.y === food.y) {
        const basePoints = 10;
        const multiplier = getScoreMultiplier();
        gameState.score += basePoints * multiplier;
        
        // Verifica se subiu de nível
        const oldLevel = gameState.level;
        const newLevel = Math.floor(gameState.score / 50) + 1;
        
        if (newLevel > oldLevel) {
            gameState.level = newLevel;
            // Acelera o jogo gradualmente
            if (gameState.speed > 200) {
                gameState.speed -= 2;
            }
            generateObstacles(tileCount);
            generateFood(tileCount);
            return 'level-up';
        } else {
            generateFood(tileCount);
            return 'food-eaten';
        }
    } else {
        // Remove cauda se não comeu
        snake.pop();
        return 'continue';
    }
}

/**
 * Verifica se há colisão em uma posição específica
 * @param {number} x - Coordenada X
 * @param {number} y - Coordenada Y
 * @param {boolean} includeHead - Se deve incluir a cabeça da cobra na verificação
 * @returns {boolean} True se há colisão
 */
function checkCollision(x, y, includeHead = true) {
    // Verifica colisão com cobra
    const startIndex = includeHead ? 0 : 1;
    for (let i = startIndex; i < snake.length; i++) {
        if (snake[i].x === x && snake[i].y === y) {
            return true;
        }
    }
    
    // Verifica colisão com obstáculos
    for (let obstacle of obstacles) {
        if (obstacle.x === x && obstacle.y === y) {
            return true;
        }
    }
    
    return false;
}

export { generateFood, generateObstacles, moveSnake, checkCollision, updatePowerups };