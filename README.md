# 🐍 Snake Game - Versão Standalone

Um jogo da cobrinha clássico e responsivo implementado de forma **otimizada e completa** em um único arquivo HTML para máxima compatibilidade e facilidade de uso.

![Snake Game](https://img.shields.io/badge/Game-Snake-brightgreen) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) ![Standalone](https://img.shields.io/badge/Format-Standalone-blue)

## 📚 Sobre Esta Versão

Esta é uma versão **standalone completa** do jogo Snake, criada para **máxima compatibilidade** e facilidade de distribuição. Todo o código (HTML, CSS e JavaScript) está integrado em um único arquivo, eliminando problemas de CORS e dependências externas.

## 🚀 Características

### ✨ **Funcionalidades Principais**
- **Arquivo Único**: Todo o jogo em um só arquivo HTML - sem dependências externas
- **Zero CORS Issues**: Funciona diretamente no navegador sem necessidade de servidor
- **Responsivo 100%**: Adapta-se perfeitamente a desktop, tablet e mobile
- **Compatibilidade Universal**: Funciona em qualquer navegador moderno

### 🎮 **Modos de Jogo**
- **Single Player**: Jogo clássico com power-ups e níveis progressivos
- **Multiplayer Local**: Modo 2 jogadores (disponível apenas em desktop)
  - Player 1: Controles WASD
  - Player 2: Setas do teclado

### 🏆 **Sistema de Progressão**
- **Níveis Infinitos**: Dificuldade cresce automaticamente a cada 50 pontos
- **Obstáculos Dinâmicos**: Aparecem e aumentam conforme o nível
- **Cores Evolutivas**: 6 cores diferentes da cobra (nunca vermelha para não confundir com comida)
- **High Scores**: Ranking local salvo no navegador

### ⚡ **Sistema de Power-ups** (Single Player)
- **Speed Boost** ⚡: Aumenta velocidade temporariamente (5s)
- **Score Multiplier** ✨: Duplica pontuação da comida (8s) 
- **Invincibility** 🛡️: Proteção contra colisões (6s)
- **Aparição Inteligente**: Spawn a cada 8-12 segundos, máximo 2 ativos
- **Efeitos Visuais**: Animações pulsantes e indicadores visuais

### 🎯 **Controles Otimizados**
- **Desktop**: Setas do teclado (responsivo e preciso)
- **Mobile**: Controles touch dedicados com feedback visual
- **Multiplayer**: Detecção automática - oculta em mobile para melhor UX

## 🎮 Como Jogar

### 🎯 Single Player
1. **Inicie**: Digite seu nickname (opcional) e clique em "Single Player"
2. **Mova**: Use setas do teclado (desktop) ou botões touch (mobile)
3. **Colete**: Pegue comida vermelha (🍎) para aumentar pontuação
4. **Power-ups**: Colete power-ups coloridos para vantagens temporárias:
   - ⚡ **Speed Boost** (laranja): Velocidade aumentada
   - ✨ **Score Multiplier** (amarelo): Pontos em dobro
   - 🛡️ **Invincibility** (verde): Proteção contra colisões
5. **Sobreviva**: Evite colidir com obstáculos, paredes ou próprio corpo
6. **Progrida**: A cada 50 pontos você sobe de nível com mais obstáculos

### 🏆 Multiplayer Local (2 Jogadores - Desktop Only)
1. **Inicie**: Clique em "Multiplayer (2P)" (disponível apenas em desktop)
2. **Controles**: 
   - **Player 1** (verde): WASD (W=↑, A=←, S=↓, D=→)
   - **Player 2** (laranja): Setas do teclado (↑↓←→)
3. **Compete**: Colete comida para aumentar sua pontuação individual
4. **Batalhe**: Evite colidir com seu oponente ou próprio corpo
5. **Vença**: O último jogador vivo vence a partida!

## 🏗️ Arquitetura Standalone

### 📁 Estrutura Simplificada

```
snake-game/
├── index.html              # 🎯 ARQUIVO PRINCIPAL - Contém TUDO
│                          #    ├── HTML estrutural
│                          #    ├── CSS inline completo
│                          #    └── JavaScript integrado
├── js/                     # 📚 Versão modular (legado)
├── css/                    # 🎨 Estilos modulares (legado)  
└── README.md              # 📖 Documentação
```

### 🎯 **Vantagens da Arquitetura Standalone**
- ✅ **Zero Dependencies**: Sem arquivos externos ou imports
- ✅ **CORS-Free**: Funciona diretamente no navegador (file://)
- ✅ **Portável**: Fácil distribuição - apenas um arquivo
- ✅ **Rápido**: Carregamento instantâneo - sem múltiplas requisições
- ✅ **Confiável**: Sem problemas de ES6 modules ou servidor

### 🧩 Componentes Integrados (index.html)

| Componente | Responsabilidade | Principais Funções |
|------------|-----------------|-------------------|
| **🖼️ Canvas & Rendering** | Renderização visual | `initCanvas()`, `drawGame()`, `drawPowerup()` |
| **🎮 Game Logic** | Lógica principal | `singlePlayerGameLoop()`, `multiplayerGameLoop()` |
| **🎯 Game State** | Estado do jogo | `startGame()`, `endGame()`, `generateFood()` |
| **⚡ Power-ups System** | Sistema de power-ups | `spawnPowerup()`, `checkPowerupCollision()`, `applyPowerupEffect()` |
| **🏆 Multiplayer** | Modo 2 jogadores | `startMultiplayer()`, `updateMultiplayerScores()` |
| **🎛️ Controls** | Controles e input | `initMobileControls()`, `handleKeyboard()` |
| **💾 Storage** | Persistência local | `saveScore()`, `getHighScores()` |
| **🎨 UI Management** | Interface usuário | `showScreen()`, `updateScore()`, `showGameOver()` |
| **📱 Mobile Detection** | Otimização UX | `isMobileDevice()`, controles adaptativos |

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e Canvas API
- **CSS3**: Flexbox, Grid, CSS Imports, Media Queries
- **JavaScript ES6+**: Modules, Classes, Arrow Functions, Destructuring
- **Progressive Enhancement**: Funciona mesmo em navegadores mais antigos

## 🎓 Aspectos Educacionais

Este projeto é ideal para aprender:

### JavaScript Moderno
- **ES6 Modules**: Import/Export para organização de código
- **Arrow Functions**: Sintaxe moderna e escopo léxico
- **Destructuring**: Extração elegante de propriedades
- **Template Literals**: Strings interpoladas e multilinhas

### Arquitetura de Software
- **Separação de Responsabilidades**: Cada módulo tem uma função específica
- **Single Responsibility Principle**: Funções com propósito único
- **Modularização**: Código reutilizável e fácil de manter

### Desenvolvimento Web
- **Canvas API**: Renderização 2D em tempo real
- **Event Handling**: Teclado, touch e resize
- **Local Storage**: Persistência de dados no navegador
- **Responsive Design**: Adaptação para diferentes dispositivos

## 🚀 Como Executar

### Método 1: Servidor Local (Recomendado)
Para ES6 modules funcionarem corretamente:

```bash
# Com Python 3
python -m http.server 8000

# Com Node.js (http-server)
npx http-server

# Com Live Server (VS Code)
# Instale a extensão Live Server e clique em "Go Live"
```

### Método 2: Acesso Direto
Acesse: [https://eduardokaique.github.io/snake-game/](https://eduardokaique.github.io/snake-game/)

## 🔧 Personalização

### Adicionando Novos Níveis
```javascript
// Em gameState.js
function getLevelColor() {
    const colors = ['#2ecc71', '#3498db', '#9b59b6', '#e67e22', '#e74c3c', '#f39c12', '#sua-cor'];
    return colors[(gameState.level - 1) % colors.length];
}
```

### Modificando Velocidade
```javascript
// Em gameLogic.js - função updateScore
if (gameState.speed > 150) { // Velocidade mínima alterada
    gameState.speed -= 5; // Aceleração maior
}
```

### Novos Tipos de Comida
```javascript
// Em gameLogic.js
const foodTypes = [
    { color: '#e74c3c', points: 10 },
    { color: '#f39c12', points: 20 },
    { color: '#9b59b6', points: 50 }
];
```

## ⚙️ Configuração do Jogo

### Parâmetros Principais (gameState.js)
```javascript
// Configurações de velocidade
let gameSpeed = 400;        // Velocidade inicial (ms)
const minSpeed = 200;       // Velocidade máxima

// Sistema de pontuação
const pointsPerFood = 10;   // Pontos por comida
const levelThreshold = 50;  // Pontos para próximo nível

// Canvas e grid
const gridSize = 20;        // Tamanho de cada célula
const maxObstacles = 8;     // Máximo de obstáculos por nível
```

### Power-ups (powerups.js)
```javascript
// Tipos de power-ups disponíveis
POWERUP_TYPES = {
    SPEED_BOOST: { duration: 5000, spawnChance: 0.3 },
    SLOW_MOTION: { duration: 8000, spawnChance: 0.25 },
    SCORE_MULTIPLIER: { duration: 10000, spawnChance: 0.2 },
    INVINCIBILITY: { duration: 6000, spawnChance: 0.15 },
    MAGNET: { duration: 12000, spawnChance: 0.1 }
}
```

### Multiplayer (multiplayer.js)
```javascript
// Controles dos jogadores
MULTIPLAYER_KEYS = {
    PLAYER1: { LEFT: 65, UP: 87, RIGHT: 68, DOWN: 83 }, // WASD
    PLAYER2: { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 }  // Setas
}
```

### Cores e Temas (CSS)
```css
/* Em css/base.css */
:root {
  --snake-color: #2ecc71;      /* Cor da cobra */
  --food-color: #e74c3c;       /* Cor da comida */
  --obstacle-color: #95a5a6;   /* Cor dos obstáculos */
  --bg-color: #1a252f;         /* Fundo do jogo */
}
```

## 📱 Compatibilidade

- ✅ Chrome 60+ (ES6 Modules)
- ✅ Firefox 55+ (ES6 Modules)
- ✅ Safari 12+ (ES6 Modules)
- ✅ Edge 79+ (ES6 Modules)
- ✅ Dispositivos móveis (iOS/Android)

## 🎯 Possíveis Melhorias

### Funcionalidades
- [x] Sistema de power-ups
- [ ] Diferentes tipos de obstáculos
- [x] Modo multiplayer local
- [ ] Temas visuais alternativos
- [ ] Sistema de conquistas
- [ ] Salvamento em nuvem
- [ ] Modo training (sem game over)

### Técnicas
- [ ] Service Worker para funcionamento offline
- [ ] Web Audio API para sons
- [ ] WebGL para gráficos avançados
- [ ] PWA (Progressive Web App)

## 🔍 Análise de Código

### Complexidade
- **Cyclomatic Complexity**: Baixa (funções pequenas e focadas)
- **Coupling**: Baixo (módulos independentes)
- **Cohesion**: Alto (responsabilidades bem definidas)

### Métricas de Qualidade
- **Linhas de código**: ~1500 (bem distribuídas)
- **Funções**: ~60 (média de 25 linhas cada)
- **Modules**: 9 (organização lógica)
- **Comentários**: >300 linhas (documentação extensa)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona NovaFeature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

### Guidelines de Desenvolvimento
- Mantenha a separação de módulos
- Adicione comentários para código complexo
- Teste em múltiplos dispositivos
- Siga os padrões de nomenclatura existentes

## 📚 Recursos de Aprendizado

### Para Iniciantes
- [MDN Web Docs - Canvas API](https://developer.mozilla.org/pt-BR/docs/Web/API/Canvas_API)
- [JavaScript.info - Modules](https://javascript.info/modules-intro)
- [CSS Grid Complete Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)

### Para Intermediários
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [JavaScript Design Patterns](https://addyosmani.com/resources/essentialjsdesignpatterns/book/)
- [Web Performance Best Practices](https://developers.google.com/web/fundamentals/performance)

### Para Avançados
- [ES6 Modules Deep Dive](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)
- [Canvas Optimization Techniques](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)

## 🐛 Debugging e Solução de Problemas

### Problemas Comuns

1. **ES6 Modules não funcionam**
   - Solução: Use um servidor local (http-server, Live Server)
   - Alternativa: Mude para `script` tags tradicionais

2. **Controles touch não respondem**
   - Verificar: `touch-action: manipulation` no CSS
   - Verificar: Event listeners com `{ passive: false }`

3. **Performance baixa em mobile**
   - Reduzir frequência do game loop
   - Otimizar renderização do canvas

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- Comunidade de desenvolvedores por compartilhar conhecimento
- Inspirado no clássico Snake da Nokia
- Documentação MDN pela excelente referência
- Contributors e feedback da comunidade

---

⭐ **Se este projeto ajudou você a aprender, considere dar uma estrela!**

📚 **Projeto ideal para estudantes de programação e desenvolvimento web**

🎓 **Perfeito para portfolios e demonstração de habilidades em JavaScript moderno**