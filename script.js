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

class Score {
    constructor(manchesGagnantes = 3) {
        this.scoreJ1 = 0;
        this.scoreJ2 = 0;
        this.manchesGagnantes = manchesGagnantes;
    }

    incrementerJ1() {
        this.scoreJ1++;
        this.mettreAJour();
    }

    incrementerJ2() {
        this.scoreJ2++;
        this.mettreAJour();
    }

    reinitialiser() {
        this.scoreJ1 = 0;
        this.scoreJ2 = 0;
        this.mettreAJour();
    }

    mettreAJour() {
        document.getElementById('scoreJ1').textContent = this.scoreJ1;
        document.getElementById('scoreJ2').textContent = this.scoreJ2;
    }

    verifierGagnant() {
        if (this.scoreJ1 >= this.manchesGagnantes) {
            return 1;
        } else if (this.scoreJ2 >= this.manchesGagnantes) {
            return 2;
        }
        return 0;
    }
}

class Joueur extends Grille{
    constructor(positionDepartX, positionDepartY, couleur) {
        super();
        this.positionDepartXInitial = positionDepartX;
        this.positionDepartYInitial = positionDepartY;
        this.positionDepartX = positionDepartX;
        this.positionDepartY = positionDepartY;
        this.couleur = couleur;
        this.directionX = 1;
        this.directionY = 0;
        this.positions = [[positionDepartX, positionDepartY]];
        this.fileDirections = [];
    }

    dessinerJoueur() {
        ctx.fillStyle = this.couleur;
        ctx.fillRect(this.positionDepartX * this.largeurGrille, this.positionDepartY * this.hauteurGrille, this.largeurGrille, this.hauteurGrille);
    }

    changerDirection(dx, dy) {
        let derniereDirectionX = this.directionX;
        let derniereDirectionY = this.directionY;
        
        if (this.fileDirections.length > 0) {
            const derniere = this.fileDirections[this.fileDirections.length - 1];
            derniereDirectionX = derniere.dx;
            derniereDirectionY = derniere.dy;
        }
        
        if (dx === -derniereDirectionX && dy === -derniereDirectionY) {
            return;
        }
        
        if (dx === derniereDirectionX && dy === derniereDirectionY) {
            return;
        }
        
        this.fileDirections.push({ dx, dy });
    }

    avancer() {
        if (this.fileDirections.length > 0) {
            const direction = this.fileDirections.shift();
            this.directionX = direction.dx;
            this.directionY = direction.dy;
        }
        
        this.positionDepartX += this.directionX;
        this.positionDepartY += this.directionY;
        this.positions.push([this.positionDepartX, this.positionDepartY]);
        this.dessinerJoueur();
    }

    verifierCollisionBord() {
        return this.positionDepartX < 0 || 
               this.positionDepartX >= this.nbColonnes || 
               this.positionDepartY < 0 || 
               this.positionDepartY >= this.nbLignes;
    }

    verifierCollision(adversaire) {
        const [x, y] = [this.positionDepartX, this.positionDepartY];
        
        const collisionAdversaire = adversaire.positions.some(([posX, posY]) => posX === x && posY === y);
        const collisionPropre = this.positions.slice(0, -1).some(([posX, posY]) => posX === x && posY === y);
        
        return collisionAdversaire || collisionPropre;
    }

    dessinerComplet() {
        this.positions.forEach(([x, y], index) => {
            ctx.fillStyle = this.couleur;
            if (index === this.positions.length - 1) {
                ctx.beginPath();
                const centreX = x * this.largeurGrille + this.largeurGrille / 2;
                const centreY = y * this.hauteurGrille + this.hauteurGrille / 2;
                const rayon = this.largeurGrille / 2;
                
                let angleDebut, angleFin;
                if (this.directionX === 1) {
                    angleDebut = -Math.PI / 2;
                    angleFin = Math.PI / 2;
                } else if (this.directionX === -1) {
                    angleDebut = Math.PI / 2;
                    angleFin = 3 * Math.PI / 2;
                } else if (this.directionY === -1) {
                    angleDebut = Math.PI;
                    angleFin = 2 * Math.PI;
                } else {
                    angleDebut = 0;
                    angleFin = Math.PI;
                }
                
                ctx.arc(centreX, centreY, rayon, angleDebut, angleFin);
                ctx.fill();
            } else {
                ctx.fillRect(x * this.largeurGrille, y * this.hauteurGrille, this.largeurGrille, this.hauteurGrille);
            }
        });
    }

    reinitialiser() {
        this.positionDepartX = this.positionDepartXInitial;
        this.positionDepartY = this.positionDepartYInitial;
        this.directionX = 1;
        this.directionY = 0;
        this.positions = [[this.positionDepartXInitial, this.positionDepartYInitial]];
        this.fileDirections = [];
    }
}

var grille = new Grille();
grille.dessinerGrille();

var joueur1 = new Joueur(1, 28, "blue");
var joueur2 = new Joueur(1, 30, "red");
var score = new Score(3);
var jeuEnCours = false;
var partieCommencee = false;
var intervalId = null;

const btnDemarrer = document.getElementById('btnDemarrer');
const btnReinitialiser = document.getElementById('btnReinitialiser');

function verifierFinPartie() {
    const gagnant = score.verifierGagnant();
    if (gagnant === 1) {
        afficherGagnant("Joueur 1 (Bleu) remporte la partie!");
        btnDemarrer.disabled = false;
        btnDemarrer.textContent = "Nouvelle partie";
        partieCommencee = false;
        return true;
    } else if (gagnant === 2) {
        afficherGagnant("Joueur 2 (Rouge) remporte la partie!");
        btnDemarrer.disabled = false;
        btnDemarrer.textContent = "Nouvelle partie";
        partieCommencee = false;
        return true;
    }
    return false;
}

function lancerNouvelleManche() {
    joueur1.reinitialiser();
    joueur2.reinitialiser();
    jeuEnCours = true;
    dessinerTout();
}

function demarrerPartie() {
    score.reinitialiser();
    joueur1.reinitialiser();
    joueur2.reinitialiser();
    jeuEnCours = true;
    partieCommencee = true;
    btnDemarrer.disabled = true;
    btnDemarrer.textContent = "Partie en cours...";
    dessinerTout();
    
    if (intervalId) {
        clearInterval(intervalId);
    }
    
    intervalId = setInterval(() => {
        if (!jeuEnCours) return;
        
        joueur1.avancer();
        joueur2.avancer();
        dessinerTout();
        
        let collision1 = joueur1.verifierCollisionBord() || joueur1.verifierCollision(joueur2);
        let collision2 = joueur2.verifierCollisionBord() || joueur2.verifierCollision(joueur1);
        
        if (collision1 || collision2) {
            jeuEnCours = false;
            
            if (collision1 && collision2) {
                dessinerTout();
                ctx.fillStyle = "white";
                ctx.font = "32px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("Égalité!", CANVAS.width / 2, CANVAS.height / 2);
            } else if (collision1) {
                score.incrementerJ2();
            } else if (collision2) {
                score.incrementerJ1();
            }
            
            setTimeout(() => {
                if (!verifierFinPartie()) {
                    lancerNouvelleManche();
                }
            }, 1500);
        }
    }, 100);
}

function reinitialiserPartie() {
    if (intervalId) {
        clearInterval(intervalId);
    }
    
    jeuEnCours = false;
    partieCommencee = false;
    score.reinitialiser();
    joueur1.reinitialiser();
    joueur2.reinitialiser();
    
    btnDemarrer.disabled = false;
    btnDemarrer.textContent = "Démarrer";
    
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
    dessinerTout();
}

btnDemarrer.addEventListener('click', demarrerPartie);
btnReinitialiser.addEventListener('click', reinitialiserPartie);

function afficherGagnant(gagnant) {
    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(gagnant, CANVAS.width / 2, CANVAS.height / 2);
}

function dessinerTout() {
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
    joueur1.dessinerComplet();
    joueur2.dessinerComplet();
}
dessinerTout();

document.addEventListener('keydown', function(event) {
    if (!jeuEnCours || !partieCommencee) return;
    
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

/*Reste à faire :
- Ajouter une touche pour chaque joueur qui permet de sauter par dessus un obstacle (une seule case). Le tracé recouvre l'obstacle et continue au-delà de l'obstacle, si c'est possible.
- Ajouter un bouton pour permettre aux joueurs de configurer les touches de direction. Ceci devra se faire dans une fenêtre modale (utiliser par exemple la fonction dialog() de Jquery UI). */