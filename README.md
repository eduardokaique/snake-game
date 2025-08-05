# 🐍 Snake Game - Versão Refatorada

Um jogo da cobrinha clássico e responsivo implementado de forma **modular e didática** com HTML5, CSS3 e JavaScript ES6+.

![Snake Game](https://img.shields.io/badge/Game-Snake-brightgreen) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) ![ES6 Modules](https://img.shields.io/badge/ES6-Modules-yellow)

## 📚 Sobre Esta Versão

Esta é uma versão **refatorada e organizada** do jogo Snake, criada com foco na **educação e manutenibilidade**. O código foi dividido em módulos lógicos para facilitar o entendimento e a expansão do projeto.

## 🚀 Características

- **Arquitetura Modular**: Código separado em módulos ES6 com responsabilidades bem definidas
- **Comentários Didáticos**: Documentação extensa para facilitar o aprendizado
- **Responsivo**: Funciona perfeitamente em desktop e dispositivos móveis
- **Controles Intuitivos**: 
  - Desktop: Setas do teclado
  - Mobile: Botões touch e gestos de swipe
- **Sistema de Níveis**: Progressão automática com aumento de dificuldade
- **Obstáculos**: Aparecem a partir do nível 2
- **High Scores**: Sistema de pontuação máxima com localStorage
- **Design Moderno**: Interface limpa e atraente
- **Acessibilidade**: Otimizado para leitores de tela e navegação por teclado

## 🎮 Como Jogar

1. Digite seu nickname (opcional)
2. Clique em "Start Game"
3. Use as setas do teclado (desktop) ou controles touch (mobile) para mover a cobra
4. Colete comida para aumentar sua pontuação
5. Evite colidir com obstáculos ou com o próprio corpo da cobra
6. A cada 50 pontos você sobe de nível com mais obstáculos

## 🏗️ Arquitetura do Projeto

### 📁 Estrutura Organizada

```
snake-game/
├── index.html              # Página principal
├── css/                    # Estilos organizados
│   ├── main.css           # Arquivo principal que importa todos os módulos
│   ├── base.css           # Reset, acessibilidade e estilos base
│   ├── screens.css        # Telas inicial e high scores
│   ├── game.css           # Tela principal do jogo
│   ├── controls.css       # Controles desktop e mobile
│   └── responsive.css     # Media queries responsivas
├── js/                     # JavaScript modular
│   ├── main.js            # Arquivo principal e orquestrador
│   └── modules/           # Módulos específicos
│       ├── canvas.js      # Gerenciamento do canvas
│       ├── gameState.js   # Estado do jogo (score, nível, cobra)
│       ├── gameLogic.js   # Lógica principal (movimento, colisões)
│       ├── controls.js    # Controles (teclado, touch, swipe)
│       ├── storage.js     # localStorage e high scores
│       └── ui.js          # Interface do usuário
├── README.md              # Documentação
└── style.css              # CSS antigo (mantido para compatibilidade)
```

### 🧩 Módulos JavaScript

| Módulo | Responsabilidade | Principais Funções |
|--------|-----------------|-------------------|
| **canvas.js** | Renderização e canvas | `initCanvas()`, `drawGame()` |
| **gameState.js** | Estado do jogo | `resetGameState()`, `updateScore()`, `setDirection()` |
| **gameLogic.js** | Lógica principal | `moveSnake()`, `generateFood()`, `generateObstacles()` |
| **controls.js** | Controles | `handleKeyboard()`, `initTouchControls()` |
| **storage.js** | Persistência | `saveHighScore()`, `getHighScores()` |
| **ui.js** | Interface | `showScreen()`, `updateScore()`, `showGameOver()` |
| **main.js** | Orquestração | `startGame()`, `gameLoop()`, `initGame()` |

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
- [ ] Sistema de power-ups
- [ ] Diferentes tipos de obstáculos
- [ ] Modo multiplayer local
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
- **Linhas de código**: ~1000 (bem distribuídas)
- **Funções**: ~40 (média de 25 linhas cada)
- **Modules**: 7 (organização lógica)
- **Comentários**: >200 linhas (documentação extensa)

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