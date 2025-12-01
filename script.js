const CANVAS = document.getElementById("myCanvas");
CANVAS.width = 800;
CANVAS.height = 590;
const ctx = CANVAS.getContext("2d");


class Grille {
    constructor() {
        this.hauteurGrille = 10;
        this.largeurGrille = 10;
        this.largeur = CANVAS.width;
        this.hauteur = CANVAS.height;
        this.nbColonnes = this.largeur / this.largeurGrille;
        this.nbLignes = this.hauteur / this.hauteurGrille;
    }

    dessinerGrille() {
        ctx.strokeStyle = "#e0e0e0";
        ctx.lineWidth = 0.5;
        
        for (let x = 0; x <= this.largeur; x += this.largeurGrille) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.hauteur);
            ctx.stroke();
        }
        
        for (let y = 0; y <= this.hauteur; y += this.hauteurGrille) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.largeur, y);
            ctx.stroke();
        }
    }
    
    
}
var grille = new Grille();
grille.dessinerGrille();

class Joueur extends Grille{
    constructor(positionDepartX, positionDepartY, couleur) {
        super();
        this.positionDepartX = positionDepartX;
        this.positionDepartY = positionDepartY;
        this.couleur = couleur;
        this.directionX = 1;
        this.directionY = 0;
        this.positions = [[positionDepartX, positionDepartY]];
    }

    dessinerJoueur() {
        ctx.fillStyle = this.couleur;
        ctx.fillRect(this.positionDepartX * this.largeurGrille, this.positionDepartY * this.hauteurGrille, this.largeurGrille, this.hauteurGrille);
    }

    changerDirection(dx, dy) {
        this.directionX = dx;
        this.directionY = dy;
    }

    avancer() {
        this.positionDepartX += this.directionX;
        this.positionDepartY += this.directionY;
        this.positions.push([this.positionDepartX, this.positionDepartY]);
        this.dessinerJoueur();
    }

}

var joueur1 = new Joueur(1, 28, "blue");
var joueur2 = new Joueur(1, 30, "red");
var jeuEnCours = true;
var intervalId;

function verifierCollisionBord(joueur) {
    return joueur.positionDepartX < 0 || 
           joueur.positionDepartX >= grille.nbColonnes || 
           joueur.positionDepartY < 0 || 
           joueur.positionDepartY >= grille.nbLignes;
}

function verifierCollisionJoueur(joueur, adversaire) {
    const [x, y] = [joueur.positionDepartX, joueur.positionDepartY];
    return adversaire.positions.some(([posX, posY]) => posX === x && posY === y);
}

function afficherGagnant(gagnant) {
    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${gagnant} a gagné!`, CANVAS.width / 2, CANVAS.height / 2);
}

function dessinerJoueurComplet(joueur) {
    joueur.positions.forEach(([x, y], index) => {
        ctx.fillStyle = joueur.couleur;
        if (index === joueur.positions.length - 1) {
            // Dernier point : dessiner un demi-cercle
            ctx.beginPath();
            const centreX = x * grille.largeurGrille + grille.largeurGrille / 2;
            const centreY = y * grille.hauteurGrille + grille.hauteurGrille / 2;
            const rayon = grille.largeurGrille / 2;
            
            let angleDebut, angleFin;
            if (joueur.directionX === 1) {
                angleDebut = -Math.PI / 2;
                angleFin = Math.PI / 2;
            } else if (joueur.directionX === -1) {
                angleDebut = Math.PI / 2;
                angleFin = 3 * Math.PI / 2;
            } else if (joueur.directionY === -1) {
                angleDebut = Math.PI;
                angleFin = 2 * Math.PI;
            } else {
                angleDebut = 0;
                angleFin = Math.PI;
            }
            
            ctx.arc(centreX, centreY, rayon, angleDebut, angleFin);
            ctx.fill();
        } else {
            ctx.fillRect(x * grille.largeurGrille, y * grille.hauteurGrille, grille.largeurGrille, grille.hauteurGrille);
        }
    });
}

function dessinerTout() {
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
    dessinerJoueurComplet(joueur1);
    dessinerJoueurComplet(joueur2);
}
dessinerTout();

intervalId = setInterval(() => {
    if (!jeuEnCours) return;
    
    joueur1.avancer();
    joueur2.avancer();
    dessinerTout();
    
    if (verifierCollisionBord(joueur1)) {
        jeuEnCours = false;
        clearInterval(intervalId);
        afficherGagnant("Joueur 2 (Rouge)");
    } else if (verifierCollisionBord(joueur2)) {
        jeuEnCours = false;
        clearInterval(intervalId);
        afficherGagnant("Joueur 1 (Bleu)");
    }
    else if (verifierCollisionJoueur(joueur1, joueur2)) {
        jeuEnCours = false;
        clearInterval(intervalId);
        afficherGagnant("Joueur 2 (Rouge)");
    } else if (verifierCollisionJoueur(joueur2, joueur1)) {
        jeuEnCours = false;
        clearInterval(intervalId);
        afficherGagnant("Joueur 1 (Bleu)");
    }
}, 100);

document.addEventListener('keydown', function(event) {
    if (!jeuEnCours) return;
    
    switch(event.key) {
        case 'd':
            joueur1.changerDirection(1, 0);
            break;
        case 'q':
            joueur1.changerDirection(-1, 0);
            break;
        case 'z':
            joueur1.changerDirection(0, -1);
            break;
        case 's':
            joueur1.changerDirection(0, 1);
            break;
        case 'm':
            joueur2.changerDirection(1, 0);
            break;
        case 'k':
            joueur2.changerDirection(-1, 0);
            break;
        case 'o':
            joueur2.changerDirection(0, -1);
            break;
        case 'l':
            joueur2.changerDirection(0, 1);
            break;
    }
});