/**
 * Módulo Storage - Gerencia armazenamento local e high scores
 * Responsável por salvar e carregar pontuações máximas do localStorage
 */

/**
 * Função segura para acessar localStorage
 * Retorna um objeto fallback se localStorage não estiver disponível
 * @returns {Object} Objeto localStorage ou fallback
 */
function safeLocalStorage() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return localStorage;
    } catch(e) {
        console.warn('localStorage não disponível, usando fallback');
        // Fallback se localStorage não estiver disponível
        return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {}
        };
    }
}

const storage = safeLocalStorage();

/**
 * Carrega as pontuações máximas do localStorage
 * @returns {Array} Array com as pontuações ou array vazio
 */
function getHighScores() {
    try {
        const scores = storage.getItem('snakeHighScores');
        return scores ? JSON.parse(scores) : [];
    } catch(e) {
        console.warn('Erro ao carregar high scores:', e);
        return [];
    }
}

/**
 * Salva uma nova pontuação máxima
 * @param {string} name - Nome do jogador
 * @param {number} score - Pontuação obtida
 * @param {number} level - Nível alcançado
 * @returns {number} Posição do novo score (1-10) ou -1 se não entrou no ranking
 */
function saveHighScore(name, score, level) {
    const highScores = getHighScores();
    
    const newScore = {
        name: name,
        score: score,
        level: level,
        date: new Date().toLocaleDateString('pt-BR')
    };
    
    highScores.push(newScore);
    
    // Ordena por pontuação (maior para menor)
    highScores.sort((a, b) => b.score - a.score);
    
    // Mantém apenas os top 10
    if (highScores.length > 10) {
        highScores.splice(10);
    }
    
    try {
        storage.setItem('snakeHighScores', JSON.stringify(highScores));
        
        // Retorna a posição do novo score
        const position = highScores.findIndex(s => 
            s.name === name && 
            s.score === score && 
            s.level === level && 
            s.date === newScore.date
        );
        
        return position + 1; // Posição baseada em 1
        
    } catch(e) {
        console.warn('Erro ao salvar high score:', e);
        return -1;
    }
}

/**
 * Verifica se uma pontuação é suficiente para entrar no ranking
 * @param {number} score - Pontuação a ser verificada
 * @returns {boolean} True se a pontuação entra no top 10
 */
function isHighScore(score) {
    const highScores = getHighScores();
    
    // Se há menos de 10 scores, sempre é high score
    if (highScores.length < 10) {
        return true;
    }
    
    // Verifica se a pontuação é maior que a menor do ranking
    const lowestScore = highScores[highScores.length - 1].score;
    return score > lowestScore;
}

/**
 * Gera HTML para exibir a lista de high scores
 * @returns {string} HTML formatado com a lista de pontuações
 */
function generateHighScoresHTML() {
    const highScores = getHighScores();
    
    if (highScores.length === 0) {
        return '<p style="color: #bdc3c7; font-style: italic; text-align: center; margin: 40px 0;">Nenhuma pontuação ainda!<br>Seja o primeiro a jogar! 🎮</p>';
    }
    
    let html = '';
    highScores.forEach((score, index) => {
        const rank = index + 1;
        const medal = getMedalForRank(rank);
        
        html += `
            <div class="highscore-item">
                <div class="highscore-rank">${rank}${medal}</div>
                <div class="highscore-name">${escapeHTML(score.name)}</div>
                <div class="highscore-details">
                    <div class="highscore-score">${score.score}</div>
                    <div class="highscore-level">Nível ${score.level}</div>
                </div>
            </div>
        `;
    });
    
    return html;
}

/**
 * Retorna emoji de medalha baseado na posição
 * @param {number} rank - Posição no ranking (1-10)
 * @returns {string} Emoji da medalha ou string vazia
 */
function getMedalForRank(rank) {
    switch (rank) {
        case 1: return ' 🥇';
        case 2: return ' 🥈';
        case 3: return ' 🥉';
        default: return '';
    }
}

/**
 * Escapa caracteres HTML para prevenir XSS
 * @param {string} text - Texto a ser escapado
 * @returns {string} Texto escapado
 */
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Limpa todos os high scores (útil para desenvolvimento/debug)
 */
function clearHighScores() {
    try {
        storage.removeItem('snakeHighScores');
        console.log('High scores limpos com sucesso');
    } catch(e) {
        console.warn('Erro ao limpar high scores:', e);
    }
}

export { 
    getHighScores, 
    saveHighScore, 
    isHighScore, 
    generateHighScoresHTML,
    clearHighScores 
};