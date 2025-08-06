/**
 * Módulo Power-ups - Sistema de power-ups para o jogo Snake
 * Controla criação, spawn, colisão e efeitos dos power-ups
 */

// Array de power-ups ativos no jogo
let activePowerups = [];

// Power-ups em efeito no jogador
let activePowerupEffects = [];

/**
 * Tipos de power-ups disponíveis
 */
const POWERUP_TYPES = {
    SPEED_BOOST: {
        id: 'speed_boost',
        name: 'Speed Boost',
        color: '#ff6b35',
        symbol: '⚡',
        duration: 5000,
        spawnChance: 0.3
    },
    SLOW_MOTION: {
        id: 'slow_motion', 
        name: 'Slow Motion',
        color: '#4ecdc4',
        symbol: '🐌',
        duration: 8000,
        spawnChance: 0.25
    },
    SCORE_MULTIPLIER: {
        id: 'score_multiplier',
        name: 'Score x2',
        color: '#ffd93d',
        symbol: '✨',
        duration: 10000,
        spawnChance: 0.2
    },
    INVINCIBILITY: {
        id: 'invincibility',
        name: 'Invincible',
        color: '#a8e6cf',
        symbol: '🛡️',
        duration: 6000,
        spawnChance: 0.15
    },
    MAGNET: {
        id: 'magnet',
        name: 'Magnet',
        color: '#ff8b94',
        symbol: '🧲',
        duration: 12000,
        spawnChance: 0.1
    }
};

/**
 * Configurações do sistema de power-ups
 */
const POWERUP_CONFIG = {
    maxActivePowerups: 2,
    spawnInterval: 15000, // 15 segundos
    lifespan: 20000, // 20 segundos antes de desaparecer
    minSpawnLevel: 1
};

/**
 * Cria um novo power-up em posição aleatória
 * @param {number} tileCount - Número de tiles no grid
 * @param {Function} checkCollision - Função para verificar colisões
 * @returns {Object|null} Power-up criado ou null se não conseguir posicionar
 */
function createPowerup(tileCount, checkCollision) {
    // Seleciona tipo aleatório baseado nas chances
    const types = Object.values(POWERUP_TYPES);
    const totalWeight = types.reduce((sum, type) => sum + type.spawnChance, 0);
    let random = Math.random() * totalWeight;
    
    let selectedType = null;
    for (let type of types) {
        random -= type.spawnChance;
        if (random <= 0) {
            selectedType = type;
            break;
        }
    }
    
    if (!selectedType) return null;
    
    // Tenta encontrar posição válida
    let attempts = 0;
    let position;
    
    while (attempts < 50) {
        position = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        // Verifica se posição está livre
        if (!checkCollision(position.x, position.y, true) &&
            !isPowerupAt(position.x, position.y)) {
            break;
        }
        
        attempts++;
    }
    
    if (attempts >= 50) return null;
    
    return {
        ...selectedType,
        x: position.x,
        y: position.y,
        spawnTime: Date.now(),
        blinkPhase: 0
    };
}

/**
 * Verifica se há um power-up em uma posição específica
 * @param {number} x - Coordenada X
 * @param {number} y - Coordenada Y
 * @returns {boolean} True se há power-up na posição
 */
function isPowerupAt(x, y) {
    return activePowerups.some(powerup => powerup.x === x && powerup.y === y);
}

/**
 * Adiciona um power-up ao jogo
 * @param {Object} powerup - Power-up para adicionar
 */
function addPowerup(powerup) {
    if (activePowerups.length < POWERUP_CONFIG.maxActivePowerups) {
        activePowerups.push(powerup);
        return true;
    }
    return false;
}

/**
 * Remove power-ups expirados
 */
function removeExpiredPowerups() {
    const now = Date.now();
    activePowerups = activePowerups.filter(powerup => 
        now - powerup.spawnTime < POWERUP_CONFIG.lifespan
    );
}

/**
 * Verifica colisão da cobra com power-ups
 * @param {number} headX - Coordenada X da cabeça da cobra
 * @param {number} headY - Coordenada Y da cabeça da cobra
 * @returns {Object|null} Power-up coletado ou null
 */
function checkPowerupCollision(headX, headY) {
    const collectedIndex = activePowerups.findIndex(
        powerup => powerup.x === headX && powerup.y === headY
    );
    
    if (collectedIndex !== -1) {
        const powerup = activePowerups[collectedIndex];
        activePowerups.splice(collectedIndex, 1);
        return powerup;
    }
    
    return null;
}

/**
 * Aplica efeito de um power-up
 * @param {Object} powerup - Power-up coletado
 * @param {Object} gameState - Estado atual do jogo
 * @returns {Object} Modificações no estado do jogo
 */
function applyPowerupEffect(powerup, gameState) {
    const effect = {
        id: powerup.id,
        type: powerup.id,
        startTime: Date.now(),
        duration: powerup.duration,
        originalValues: {}
    };
    
    let stateChanges = {};
    
    switch (powerup.id) {
        case 'speed_boost':
            effect.originalValues.speed = gameState.speed;
            stateChanges.speed = Math.max(gameState.speed / 2, 100);
            break;
            
        case 'slow_motion':
            effect.originalValues.speed = gameState.speed;
            stateChanges.speed = Math.min(gameState.speed * 2, 800);
            break;
            
        case 'score_multiplier':
            effect.multiplier = 2;
            break;
            
        case 'invincibility':
            effect.invincible = true;
            break;
            
        case 'magnet':
            effect.magnetRange = 3;
            break;
    }
    
    // Remove efeitos conflitantes
    removeConflictingEffects(powerup.id);
    
    // Adiciona novo efeito
    activePowerupEffects.push(effect);
    
    return stateChanges;
}

/**
 * Remove efeitos conflitantes
 * @param {string} newEffectType - Tipo do novo efeito
 */
function removeConflictingEffects(newEffectType) {
    const conflicts = {
        'speed_boost': ['slow_motion'],
        'slow_motion': ['speed_boost']
    };
    
    if (conflicts[newEffectType]) {
        activePowerupEffects = activePowerupEffects.filter(
            effect => !conflicts[newEffectType].includes(effect.type)
        );
    }
}

/**
 * Atualiza efeitos ativos e remove expirados
 * @param {Object} gameState - Estado atual do jogo
 * @returns {Object} Modificações no estado do jogo
 */
function updatePowerupEffects(gameState) {
    const now = Date.now();
    let stateChanges = {};
    
    // Remove efeitos expirados
    const expiredEffects = activePowerupEffects.filter(
        effect => now - effect.startTime >= effect.duration
    );
    
    // Restaura valores originais dos efeitos expirados
    for (let effect of expiredEffects) {
        if (effect.originalValues.speed !== undefined) {
            stateChanges.speed = effect.originalValues.speed;
        }
    }
    
    // Remove efeitos expirados
    activePowerupEffects = activePowerupEffects.filter(
        effect => now - effect.startTime < effect.duration
    );
    
    return stateChanges;
}

/**
 * Verifica se um efeito específico está ativo
 * @param {string} effectType - Tipo do efeito
 * @returns {Object|null} Efeito ativo ou null
 */
function getActiveEffect(effectType) {
    return activePowerupEffects.find(effect => effect.type === effectType) || null;
}

/**
 * Calcula multiplicador de pontos atual
 * @returns {number} Multiplicador de pontos
 */
function getScoreMultiplier() {
    const multiplierEffect = getActiveEffect('score_multiplier');
    return multiplierEffect ? multiplierEffect.multiplier : 1;
}

/**
 * Verifica se o jogador está invencível
 * @returns {boolean} True se invencível
 */
function isInvincible() {
    return getActiveEffect('invincibility') !== null;
}

/**
 * Verifica efeito magnético e atrai comida se necessário
 * @param {Object} food - Posição atual da comida
 * @param {Object} snakeHead - Posição da cabeça da cobra
 * @param {number} tileCount - Número de tiles no grid
 * @returns {Object|null} Nova posição da comida ou null
 */
function applyMagnetEffect(food, snakeHead, tileCount) {
    const magnetEffect = getActiveEffect('magnet');
    if (!magnetEffect) return null;
    
    const distance = Math.abs(food.x - snakeHead.x) + Math.abs(food.y - snakeHead.y);
    
    if (distance <= magnetEffect.magnetRange && distance > 1) {
        // Move comida em direção à cobra
        let newFood = { ...food };
        
        if (food.x < snakeHead.x) newFood.x++;
        else if (food.x > snakeHead.x) newFood.x--;
        
        if (food.y < snakeHead.y) newFood.y++;
        else if (food.y > snakeHead.y) newFood.y--;
        
        return newFood;
    }
    
    return null;
}

/**
 * Obtém lista de todos os power-ups ativos
 * @returns {Array} Array de power-ups ativos
 */
function getActivePowerups() {
    return [...activePowerups];
}

/**
 * Obtém lista de todos os efeitos ativos
 * @returns {Array} Array de efeitos ativos
 */
function getActivePowerupEffects() {
    return [...activePowerupEffects];
}

/**
 * Limpa todos os power-ups e efeitos
 */
function clearAllPowerups() {
    activePowerups = [];
    activePowerupEffects = [];
}

/**
 * Atualiza animação de piscar dos power-ups
 */
function updatePowerupAnimation() {
    const now = Date.now();
    activePowerups.forEach(powerup => {
        powerup.blinkPhase = (now / 200) % (Math.PI * 2);
    });
}

export {
    POWERUP_TYPES,
    POWERUP_CONFIG,
    createPowerup,
    addPowerup,
    removeExpiredPowerups,
    checkPowerupCollision,
    applyPowerupEffect,
    updatePowerupEffects,
    getActiveEffect,
    getScoreMultiplier,
    isInvincible,
    applyMagnetEffect,
    getActivePowerups,
    getActivePowerupEffects,
    clearAllPowerups,
    updatePowerupAnimation,
    isPowerupAt
};