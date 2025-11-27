// Constantes de la grille
const POINT_SIZE = 10; // Taille d'un point en pixels
const GRID_WIDTH = 80; // Nombre de points en largeur
const GRID_HEIGHT = 59; // Nombre de points en hauteur
const MOVE_INTERVAL = 100; // 100ms = un dixième de seconde

let canvas;
let ctx;
let gameRunning = true;
let gameInterval;

// Rubans des joueurs
const player1 = {
    x: 1,
    y: 28,
    dx: 1, // Direction horizontale (1 = droite)
    dy: 0, // Direction verticale (0 = pas de mouvement vertical)
    color: '#0000FF', // Bleu
    trail: [] // Historique des positions
};

const player2 = {
    x: 1,
    y: 30,
    dx: 1,
    dy: 0,
    color: '#FF0000', // Rouge
    trail: []
};

// Initialisation au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    
    // Dessiner une grille de référence (optionnel)
    drawGrid();
    
    // Dessiner les positions initiales
    drawRibbon(player1);
    drawRibbon(player2);
    
    // Ajouter l'écouteur de touches
    document.addEventListener('keydown', handleKeyPress);
    
    // Démarrer le mouvement automatique
    gameInterval = setInterval(moveRibbons, MOVE_INTERVAL);
});

// Gestion des touches du clavier
function handleKeyPress(event) {
    const key = event.key.toLowerCase();
    
    // Joueur 1 - ZQSD
    switch(key) {
        case 'q': // Gauche
            player1.dx = -1;
            player1.dy = 0;
            break;
        case 'd': // Droite
            player1.dx = 1;
            player1.dy = 0;
            break;
        case 'z': // Haut
            player1.dx = 0;
            player1.dy = -1;
            break;
        case 's': // Bas
            player1.dx = 0;
            player1.dy = 1;
            break;
    }
    
    // Joueur 2 - OKLM
    switch(key) {
        case 'm': //Droite
            player2.dx = 1;
            player2.dy = 0;
            break;
        case 'o': //Haut
            player2.dx = 0;
            player2.dy = -1;
            break;
        case 'l': //Bas
            player2.dx = 0;
            player2.dy = 1;
            break;
        case 'k': //Gauche
            player2.dx = -1;
            player2.dy = 0;
            break;
    }
}

// Fonction pour faire progresser les rubans
function moveRibbons() {
    if (!gameRunning) return;
    
    // Sauvegarder la position actuelle dans l'historique
    player1.trail.push({ x: player1.x, y: player1.y });
    player2.trail.push({ x: player2.x, y: player2.y });
    
    // Avancer selon la direction actuelle
    player1.x += player1.dx;
    player1.y += player1.dy;
    player2.x += player2.dx;
    player2.y += player2.dy;
    
    // Vérifier les collisions
    const player1Collision = checkCollision(player1, player2);
    const player2Collision = checkCollision(player2, player1);
    
    if (player1Collision && player2Collision) {
        endGame("Match nul !");
        return;
    } else if (player1Collision) {
        endGame("Joueur 2 (Rouge) gagne !");
        return;
    } else if (player2Collision) {
        endGame("Joueur 1 (Bleu) gagne !");
        return;
    }
    
    // Redessiner
    redrawGame();
}

// Fonction pour vérifier les collisions
function checkCollision(player, opponent) {
    // Collision avec les bords du canvas
    if (player.x < 0 || player.x >= GRID_WIDTH || 
        player.y < 0 || player.y >= GRID_HEIGHT) {
        return true;
    }
    
    // Collision avec son propre ruban
    for (let pos of player.trail) {
        if (pos.x === player.x && pos.y === player.y) {
            return true;
        }
    }
    
    // Collision avec le ruban adverse (y compris la tête)
    for (let pos of opponent.trail) {
        if (pos.x === player.x && pos.y === player.y) {
            return true;
        }
    }
    
    // Collision avec la tête adverse
    if (player.x === opponent.x && player.y === opponent.y) {
        return true;
    }
    
    return false;
}

// Fonction pour terminer le jeu
function endGame(message) {
    gameRunning = false;
    clearInterval(gameInterval);
    
    redrawGame();
    
    // Afficher le message de fin
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    
    ctx.font = '24px Arial';
    ctx.fillText('Rechargez la page pour rejouer', canvas.width / 2, canvas.height / 2 + 50);
}

// Fonction pour redessiner tout le jeu
function redrawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawRibbon(player1);
    drawRibbon(player2);
}

// Fonction pour dessiner un ruban complet
function drawRibbon(player) {
    // Dessiner tous les points parcourus (carrés pleins)
    player.trail.forEach(pos => {
        drawPoint(pos.x, pos.y, player.color);
    });
    
    // Dessiner le bout actif (demi-cercle)
    drawSemiCircle(player.x, player.y, player.color);
}

// Fonction pour dessiner un demi-cercle (bout actif du ruban)
function drawSemiCircle(x, y, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    const centerX = x * POINT_SIZE + POINT_SIZE / 2;
    const centerY = y * POINT_SIZE + POINT_SIZE / 2;
    const radius = POINT_SIZE / 2;
    
    // Demi-cercle orienté vers la droite
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(centerX, centerY + radius);
    ctx.lineTo(centerX, centerY - radius);
    ctx.closePath();
    ctx.fill();
}

// Fonction pour dessiner un point à la position [x, y]
function drawPoint(x, y, color = '#000000') {
    if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) {
        console.warn(`Position hors limites: [${x}, ${y}]`);
        return;
    }
    
    ctx.fillStyle = color;
    ctx.fillRect(x * POINT_SIZE, y * POINT_SIZE, POINT_SIZE, POINT_SIZE);
}

// Fonction pour effacer un point à la position [x, y]
function clearPoint(x, y) {
    ctx.clearRect(x * POINT_SIZE, y * POINT_SIZE, POINT_SIZE, POINT_SIZE);
}

// Fonction pour dessiner une grille de référence (optionnel)
function drawGrid() {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    
    // Lignes verticales
    for (let x = 0; x <= GRID_WIDTH; x++) {
        ctx.beginPath();
        ctx.moveTo(x * POINT_SIZE, 0);
        ctx.lineTo(x * POINT_SIZE, canvas.height);
        ctx.stroke();
    }
    
    // Lignes horizontales
    for (let y = 0; y <= GRID_HEIGHT; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * POINT_SIZE);
        ctx.lineTo(canvas.width, y * POINT_SIZE);
        ctx.stroke();
    }
}
