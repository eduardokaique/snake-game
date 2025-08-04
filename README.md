# 🐍 Snake Game

A modern, responsive implementation of the classic Snake game built with HTML5, CSS3, and JavaScript. Features progressive difficulty, high scores, and mobile-friendly controls.

![Snake Game](https://img.shields.io/badge/Game-Snake-brightgreen) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 🎮 Features

- **Classic Gameplay**: Control your snake to eat food and grow longer
- **Progressive Difficulty**: New levels every 50 points with increasing obstacles
- **High Score System**: Track your best scores with local storage
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Touch Controls**: Swipe gestures and virtual buttons for mobile play
- **Keyboard Support**: Arrow key controls for desktop
- **Wrap-around Edges**: Snake wraps around screen boundaries
- **Level System**: Dynamic obstacle generation based on current level
- **Player Profiles**: Custom nickname support

## 🚀 Demo

[Play the game online](https://your-username.github.io/snake-game) *(Replace with your actual GitHub Pages URL)*

## 📱 Screenshots

*Add screenshots of your game here showing desktop and mobile versions*

## 🎯 How to Play

### Desktop Controls
- Use **Arrow Keys** (↑↓←→) to control the snake's direction
- Avoid hitting your own body or obstacles
- Eat red food blocks to grow and increase your score
- Each level adds new obstacles to increase difficulty

### Mobile Controls
- **Swipe** on the game canvas to change direction
- Use the **virtual D-pad** buttons below the game area
- Tap and drag gestures are optimized for touch screens

### Game Rules
- **Score**: Gain 10 points for each food item eaten
- **Levels**: Progress to new level every 50 points
- **Speed**: Game gradually increases speed as you progress
- **Obstacles**: Gray blocks appear starting from level 2
- **Game Over**: Touching your own body or obstacles ends the game

## 🛠️ Technical Features

### Performance Optimizations
- **RequestAnimationFrame**: Smooth 60fps gameplay when possible
- **Responsive Canvas**: Automatic sizing based on screen dimensions
- **Touch Optimization**: Prevents zoom and improves mobile experience
- **Memory Management**: Efficient game loop with proper cleanup

### Accessibility
- **Keyboard Navigation**: Full keyboard support with focus indicators
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Reduced Motion**: Respects user's motion preferences
- **Color Contrast**: High contrast colors for better visibility

### Browser Compatibility
- Modern browsers supporting HTML5 Canvas
- Mobile browsers with touch event support
- Fallback mechanisms for older environments

## 📂 Project Structure

```
snake-game/
├── index.html          # Main HTML file with game structure
├── script.js          # Game logic and functionality
├── style.css          # Responsive styling and animations
├── .gitignore         # Git ignore file
└── README.md          # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/snake-game.git
   cd snake-game
   ```

2. **Open the game**
   - **Option 1**: Double-click `index.html` to open in your browser
   - **Option 2**: Use a local server for development:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (with http-server installed)
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```

3. **Start playing!**
   - Enter your nickname
   - Click "Start Game"
   - Use arrow keys or touch controls to play

## ⚙️ Configuration

The game includes several configurable parameters in `script.js`:

```javascript
// Game settings
let gameSpeed = 400;        // Initial game speed (ms)
const gridSize = 20;        // Size of each grid cell
const maxObstacles = 8;     // Maximum obstacles per level

// Scoring
const pointsPerFood = 10;   // Points gained per food item
const levelThreshold = 50;  // Points needed for next level
```

## 🎨 Customization

### Colors and Themes
Modify the color scheme in `style.css`:

```css
:root {
  --primary-color: #2ecc71;    /* Snake color */
  --food-color: #e74c3c;       /* Food color */
  --background-color: #1a252f; /* Game background */
  --obstacle-color: #95a5a6;   /* Obstacle color */
}
```

### Game Mechanics
- **Speed progression**: Adjust `gameSpeed` decrease rate
- **Level difficulty**: Modify obstacle generation in `generateObstacles()`
- **Scoring system**: Change point values and level thresholds

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Test on multiple devices and browsers
- Ensure accessibility standards are maintained
- Add comments for complex game logic

## 🐛 Known Issues

- None currently known. Please report any bugs in the [Issues](https://github.com/your-username/snake-game/issues) section.

## 📈 Roadmap

- [ ] Sound effects and background music
- [ ] Power-ups and special food items
- [ ] Multiplayer support
- [ ] Game themes and skins
- [ ] Leaderboard with online scores
- [ ] Achievement system
- [ ] Save/load game state

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the classic Nokia Snake game
- Built with modern web technologies
- Thanks to the web development community for best practices

## 📞 Contact

- **GitHub**: [@your-username](https://github.com/your-username)
- **Project Link**: [https://github.com/your-username/snake-game](https://github.com/your-username/snake-game)

---

**Enjoy playing! 🎮** If you like this project, please consider giving it a ⭐ on GitHub!