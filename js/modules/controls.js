/**
 * Módulo Controls - Gerencia controles do jogo
 * Responsável pelos controles de teclado, touch e botões mobile
 */

import { setDirection } from './gameState.js';

/**
 * Códigos das teclas de direção
 */
const KEYS = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};

/**
 * Processa eventos de teclado
 * @param {KeyboardEvent} event - Evento do teclado
 */
function handleKeyboard(event) {
    const keyPressed = event.keyCode;
    
    switch (keyPressed) {
        case KEYS.LEFT:
            setDirection(-1, 0);
            break;
        case KEYS.UP:
            setDirection(0, -1);
            break;
        case KEYS.RIGHT:
            setDirection(1, 0);
            break;
        case KEYS.DOWN:
            setDirection(0, 1);
            break;
    }
}

/**
 * Inicializa controles touch para dispositivos móveis
 */
function initTouchControls() {
    // Botões direcionais
    const buttons = {
        up: document.getElementById('upBtn'),
        down: document.getElementById('downBtn'),
        left: document.getElementById('leftBtn'),
        right: document.getElementById('rightBtn')
    };
    
    // Adiciona event listeners aos botões
    buttons.up?.addEventListener('click', () => setDirection(0, -1));
    buttons.down?.addEventListener('click', () => setDirection(0, 1));
    buttons.left?.addEventListener('click', () => setDirection(-1, 0));
    buttons.right?.addEventListener('click', () => setDirection(1, 0));
    
    // Controles de swipe no canvas
    initSwipeControls();
}

/**
 * Inicializa controles de swipe no canvas
 */
function initSwipeControls() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    
    let touchStart = { x: 0, y: 0 };
    
    // Início do toque
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchStart.x = e.touches[0].clientX;
        touchStart.y = e.touches[0].clientY;
    }, { passive: false });
    
    // Fim do toque - processa swipe
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        
        if (!touchStart.x || !touchStart.y) return;
        
        const touchEnd = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        };
        
        processSwipe(touchStart, touchEnd);
        
        // Reset touch start
        touchStart = { x: 0, y: 0 };
    }, { passive: false });
}

/**
 * Processa movimento de swipe e converte em direção
 * @param {Object} touchStart - Posição inicial do toque
 * @param {Object} touchEnd - Posição final do toque
 */
function processSwipe(touchStart, touchEnd) {
    const diffX = touchStart.x - touchEnd.x;
    const diffY = touchStart.y - touchEnd.y;
    const minSwipeDistance = 30;
    
    // Determina se é swipe horizontal ou vertical
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Swipe horizontal
        if (Math.abs(diffX) > minSwipeDistance) {
            if (diffX > 0) {
                setDirection(-1, 0); // Esquerda
            } else {
                setDirection(1, 0); // Direita
            }
        }
    } else {
        // Swipe vertical
        if (Math.abs(diffY) > minSwipeDistance) {
            if (diffY > 0) {
                setDirection(0, -1); // Cima
            } else {
                setDirection(0, 1); // Baixo
            }
        }
    }
}

/**
 * Inicializa todos os controles do jogo
 */
function initControls() {
    // Controles de teclado
    document.addEventListener('keydown', handleKeyboard);
    
    // Controles touch
    initTouchControls();
    
    // Enter para iniciar o jogo na tela inicial
    const playerNameInput = document.getElementById('playerName');
    if (playerNameInput) {
        playerNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                // Chama função startGame se existir
                if (typeof window.startGame === 'function') {
                    window.startGame();
                }
            }
        });
    }
}

export { initControls, handleKeyboard };