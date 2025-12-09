// ===== CONFIGURATION DU CANVAS =====
// Récupération de l'élément canvas depuis le HTML
const CANVAS = document.getElementById("myCanvas");
// Définition des dimensions du terrain de jeu
CANVAS.width = 800;
CANVAS.height = 590;
// Obtention du contexte 2D pour dessiner sur le canvas
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

// ===== CLASSE SCORE =====
// Gère le système de points et détermine le gagnant
class Score {
    constructor(manchesGagnantes = 3) {
        this.scoreJ1 = 0;
        this.scoreJ2 = 0;
        // Nombre de manches nécessaires pour remporter la partie
        this.manchesGagnantes = manchesGagnantes;
    }

    // Incrémenter le score du joueur 1
    incrementerJ1() {
        this.scoreJ1++;
        this.mettreAJour();
    }

    // Incrémenter le score du joueur 2
    incrementerJ2() {
        this.scoreJ2++;
        this.mettreAJour();
    }

    // Réinitialiser les scores à zéro
    reinitialiser() {
        this.scoreJ1 = 0;
        this.scoreJ2 = 0;
        this.mettreAJour();
    }

    // Mettre à jour l'affichage des scores dans le HTML
    mettreAJour() {
        document.getElementById('scoreJ1').textContent = this.scoreJ1;
        document.getElementById('scoreJ2').textContent = this.scoreJ2;
    }

    // Vérifier si un joueur a gagné la partie
    // Retourne 1 si joueur 1 gagne, 2 si joueur 2 gagne, 0 sinon
    verifierGagnant() {
        if (this.scoreJ1 >= this.manchesGagnantes) {
            return 1;
        } else if (this.scoreJ2 >= this.manchesGagnantes) {
            return 2;
        }
        return 0;
    }
}

// ===== CLASSE JOUEUR =====
// Représente un joueur avec sa position, direction, traînée et comportement
class Joueur extends Grille{
    constructor(positionDepartX, positionDepartY, couleur, imageMoto) {
        super(); // Hérite des propriétés de Grille
        // Positions initiales (pour réinitialisation)
        this.positionDepartXInitial = positionDepartX;
        this.positionDepartYInitial = positionDepartY;
        // Positions actuelles
        this.positionDepartX = positionDepartX;
        this.positionDepartY = positionDepartY;
        // Couleur de la traînée du joueur
        this.couleur = couleur;
        // Direction actuelle (1,0 = droite par défaut)
        this.directionX = 1;
        this.directionY = 0;
        // Historique de toutes les positions (traînée)
        this.positions = [[positionDepartX, positionDepartY]];
        // File d'attente des changements de direction
        this.fileDirections = [];
        // Image de la moto
        this.imageMoto = new Image();
        this.imageMoto.src = imageMoto;
        this.imageMotoChargee = false;
        // Vérifier quand l'image est chargée
        this.imageMoto.onload = () => {
            this.imageMotoChargee = true;
        };
    }

    // Dessine une cellule du joueur à sa position actuelle
    dessinerJoueur() {
        ctx.fillStyle = this.couleur;
        ctx.fillRect(this.positionDepartX * this.largeurGrille, this.positionDepartY * this.hauteurGrille, this.largeurGrille, this.hauteurGrille);
    }

    // Ajoute un changement de direction à la file d'attente
    changerDirection(dx, dy) {
        // Récupérer la dernière direction (actuelle ou en attente)
        let derniereDirectionX = this.directionX;
        let derniereDirectionY = this.directionY;
        
        if (this.fileDirections.length > 0) {
            const derniere = this.fileDirections[this.fileDirections.length - 1];
            derniereDirectionX = derniere.dx;
            derniereDirectionY = derniere.dy;
        }
        
        // Empêcher le demi-tour (direction opposée)
        if (dx === -derniereDirectionX && dy === -derniereDirectionY) {
            return;
        }
        
        // Empêcher de répéter la même direction
        if (dx === derniereDirectionX && dy === derniereDirectionY) {
            return;
        }
        
        // Ajouter la nouvelle direction à la file
        this.fileDirections.push({ dx, dy });
    }

    // Fait avancer le joueur d'une case dans sa direction actuelle
    avancer() {
        // Appliquer le prochain changement de direction s'il existe
        if (this.fileDirections.length > 0) {
            const direction = this.fileDirections.shift();
            this.directionX = direction.dx;
            this.directionY = direction.dy;
        }
        
        // Calculer la nouvelle position
        this.positionDepartX += this.directionX;
        this.positionDepartY += this.directionY;
        // Ajouter la nouvelle position à l'historique
        this.positions.push([this.positionDepartX, this.positionDepartY]);
        this.dessinerJoueur();
    }

    // Fait sauter le joueur par-dessus 2 cases (pour éviter les obstacles)
    sauter(adversaire) {
        // Calculer les positions des 2 cases à sauter
        const case1X = this.positionDepartX + this.directionX;
        const case1Y = this.positionDepartY + this.directionY;
        const case2X = this.positionDepartX + (this.directionX * 2);
        const case2Y = this.positionDepartY + (this.directionY * 2);
        
        // Retirer ces cases de la traînée du joueur
        this.positions = this.positions.filter(([x, y]) => 
            !(x === case1X && y === case1Y) && !(x === case2X && y === case2Y)
        );
        
        // Retirer ces cases de la traînée de l'adversaire
        adversaire.positions = adversaire.positions.filter(([x, y]) => 
            !(x === case1X && y === case1Y) && !(x === case2X && y === case2Y)
        );
        
        // Déplacer le joueur à la position finale
        this.positionDepartX = case2X;
        this.positionDepartY = case2Y;
        
        // Ajouter les nouvelles positions à la traînée
        this.positions.push([case1X, case1Y]);
        this.positions.push([case2X, case2Y]);
        
        this.dessinerJoueur();
    }

    // Vérifie si le joueur touche un bord du terrain
    verifierCollisionBord() {
        return this.positionDepartX < 0 || 
               this.positionDepartX >= this.nbColonnes || 
               this.positionDepartY < 0 || 
               this.positionDepartY >= this.nbLignes;
    }

    // Vérifie si le joueur touche une traînée (la sienne ou celle de l'adversaire)
    verifierCollision(adversaire) {
        const [x, y] = [this.positionDepartX, this.positionDepartY];
        
        // Collision avec la traînée de l'adversaire
        const collisionAdversaire = adversaire.positions.some(([posX, posY]) => posX === x && posY === y);
        // Collision avec sa propre traînée (sauf la position actuelle)
        const collisionPropre = this.positions.slice(0, -1).some(([posX, posY]) => posX === x && posY === y);
        
        return collisionAdversaire || collisionPropre;
    }

    // Dessine la traînée complète du joueur
    dessinerComplet() {
        this.positions.forEach(([x, y], index) => {
            ctx.fillStyle = this.couleur;
            // La dernière position (tête) est dessinée avec l'image de la moto
            if (index === this.positions.length - 1) {
                if (this.imageMotoChargee) {
                    // Sauvegarder le contexte pour la rotation
                    ctx.save();
                    
                    // Calculer le centre de la case
                    const centreX = x * this.largeurGrille + this.largeurGrille / 2;
                    const centreY = y * this.hauteurGrille + this.hauteurGrille / 2;
                    
                    // Déplacer l'origine au centre de la case
                    ctx.translate(centreX, centreY);
                    
                    // Calculer l'angle de rotation selon la direction
                    let angle = 0;
                    if (this.directionX === 1) { // Droite
                        angle = 0;
                    } else if (this.directionX === -1) { // Gauche
                        angle = Math.PI;
                    } else if (this.directionY === -1) { // Haut
                        angle = -Math.PI / 2;
                    } else if (this.directionY === 1) { // Bas
                        angle = Math.PI / 2;
                    }
                    
                    // Appliquer la rotation
                    ctx.rotate(angle);
                    
                    // Dessiner l'image étirée en longueur
                    // Largeur (dans le sens de déplacement) : 4x plus grande
                    // Hauteur (perpendiculaire) : 2x plus grande
                    const largeur = this.largeurGrille * 4;
                    const hauteur = this.hauteurGrille * 2;
                    ctx.drawImage(this.imageMoto, -largeur / 2, -hauteur / 2, largeur, hauteur);
                    
                    // Restaurer le contexte
                    ctx.restore();
                } else {
                    // Si l'image n'est pas encore chargée, dessiner un carré temporaire
                    ctx.fillRect(x * this.largeurGrille, y * this.hauteurGrille, this.largeurGrille, this.hauteurGrille);
                }
            } else {
                // Les autres positions sont des carrés (la traînée)
                ctx.fillRect(x * this.largeurGrille, y * this.hauteurGrille, this.largeurGrille, this.hauteurGrille);
            }
        });
    }

    // Réinitialise le joueur à sa position de départ
    reinitialiser() {
        this.positionDepartX = this.positionDepartXInitial;
        this.positionDepartY = this.positionDepartYInitial;
        this.directionX = 1;
        this.directionY = 0;
        this.positions = [[this.positionDepartXInitial, this.positionDepartYInitial]];
        this.fileDirections = [];
    }
}

// ===== INITIALISATION DU JEU =====
// Créer la grille et la dessiner
var grille = new Grille();
grille.dessinerGrille();

// Créer les deux joueurs avec leurs images de motos respectives
var joueur1 = new Joueur(1, 28, "blue", "assets/moto_bleu.png");
var joueur2 = new Joueur(1, 30, "red", "assets/moto_rouge.png");
// Créer le système de score (premier à 3 manches)
var score = new Score(3);
// Variables d'état du jeu
var jeuEnCours = false;
var partieCommencee = false;
var intervalId = null;

// ===== CONFIGURATION DES TOUCHES =====
// Configuration des touches par défaut pour les deux joueurs
const touchesParDefaut = {
    joueur1: {
        haut: 'z',
        bas: 's',
        gauche: 'q',
        droite: 'd',
        sauter: ' '
    },
    joueur2: {
        haut: 'o',
        bas: 'l',
        gauche: 'k',
        droite: 'm',
        sauter: 'Enter'
    }
};

// Configuration des touches actuelle (copie des touches par défaut)
let touchesConfig = JSON.parse(JSON.stringify(touchesParDefaut));

// Charger les touches personnalisées depuis le localStorage si elles existent
if (localStorage.getItem('touchesConfig')) {
    touchesConfig = JSON.parse(localStorage.getItem('touchesConfig'));
}

// ===== RÉCUPÉRATION DES BOUTONS =====
const btnDemarrer = document.getElementById('btnDemarrer');
const btnReinitialiser = document.getElementById('btnReinitialiser');
const btnParametres = document.getElementById('btnParametres');

// ===== INITIALISATION DE LA MODAL JQUERY UI =====
$(document).ready(function() {
    // Configurer la modal de paramètres
    $("#dialogParametres").dialog({
        autoOpen: false, // Ne pas ouvrir automatiquement
        modal: true, // Bloquer l'interaction avec le reste de la page
        width: 600,
        buttons: {
            "Fermer": function() {
                $(this).dialog("close");
            }
        }
    });

    // Afficher les touches actuelles dans les champs de la modal
    afficherTouchesActuelles();

    // ===== GESTION DU CHANGEMENT DE TOUCHES =====
    // Écouter les clics sur les boutons "Changer"
    $('.btn-changer').on('click', function() {
        // Récupérer les données du bouton (joueur et direction)
        const joueur = $(this).data('joueur'); // 1 ou 2
        const direction = $(this).data('direction'); // haut, bas, gauche, droite, sauter
        const bouton = $(this);
        
        // Construire l'ID de l'input correspondant (ex: j1Haut, j2Bas)
        const directionCapitalisee = direction.charAt(0).toUpperCase() + direction.slice(1);
        const inputId = `#j${joueur}${directionCapitalisee}`;
        const input = $(inputId);
        
        // Changer l'apparence du bouton pour indiquer l'attente
        bouton.text('Appuyez sur une touche...').addClass('en-attente');
        input.val('...');
        
        // Créer un écouteur pour capturer la prochaine touche pressée
        const ecouteur = function(e) {
            e.preventDefault(); // Empêcher le comportement par défaut de la touche
            
            const nouvelleTouche = e.key; // Récupérer la touche pressée
            // Déterminer à quel joueur appartient cette configuration
            const joueurKey = joueur === 1 ? 'joueur1' : 'joueur2';
            // Mettre à jour la configuration
            touchesConfig[joueurKey][direction] = nouvelleTouche;
            
            // Sauvegarder dans le localStorage pour persistence
            localStorage.setItem('touchesConfig', JSON.stringify(touchesConfig));
            
            // Mettre à jour l'affichage
            afficherTouchesActuelles();
            bouton.text('Changer').removeClass('en-attente');
            
            // Retirer l'écouteur pour éviter de capturer d'autres touches
            $(document).off('keydown', ecouteur);
        };
        
        // Ajouter l'écouteur au document
        $(document).on('keydown', ecouteur);
    });

    // ===== BOUTON DE RÉINITIALISATION DES TOUCHES =====
    $('#btnReinitialiserTouches').on('click', function() {
        // Restaurer les touches par défaut
        touchesConfig = JSON.parse(JSON.stringify(touchesParDefaut));
        // Sauvegarder dans le localStorage
        localStorage.setItem('touchesConfig', JSON.stringify(touchesConfig));
        // Mettre à jour l'affichage
        afficherTouchesActuelles();
    });
});

// ===== FONCTION D'AFFICHAGE DES TOUCHES =====
// Met à jour tous les champs d'input avec les touches actuelles
function afficherTouchesActuelles() {
    // Joueur 1
    $('#j1Haut').val(afficherNomTouche(touchesConfig.joueur1.haut));
    $('#j1Bas').val(afficherNomTouche(touchesConfig.joueur1.bas));
    $('#j1Gauche').val(afficherNomTouche(touchesConfig.joueur1.gauche));
    $('#j1Droite').val(afficherNomTouche(touchesConfig.joueur1.droite));
    $('#j1Sauter').val(afficherNomTouche(touchesConfig.joueur1.sauter));
    
    // Joueur 2
    $('#j2Haut').val(afficherNomTouche(touchesConfig.joueur2.haut));
    $('#j2Bas').val(afficherNomTouche(touchesConfig.joueur2.bas));
    $('#j2Gauche').val(afficherNomTouche(touchesConfig.joueur2.gauche));
    $('#j2Droite').val(afficherNomTouche(touchesConfig.joueur2.droite));
    $('#j2Sauter').val(afficherNomTouche(touchesConfig.joueur2.sauter));
}

// ===== FONCTION DE CONVERSION DES NOMS DE TOUCHES =====
// Convertit les touches spéciales en noms lisibles
function afficherNomTouche(touche) {
    const nomsSpeciaux = {
        ' ': 'Espace',
        'Enter': 'Entrée',
        'ArrowUp': '↑',
        'ArrowDown': '↓',
        'ArrowLeft': '←',
        'ArrowRight': '→',
        'Shift': 'Maj',
        'Control': 'Ctrl',
        'Alt': 'Alt'
    };
    // Retourner le nom spécial ou la touche en majuscule
    return nomsSpeciaux[touche] || touche.toUpperCase();
}

// ===== OUVERTURE DE LA MODAL DE PARAMÈTRES =====
btnParametres.addEventListener('click', function() {
    $("#dialogParametres").dialog("open");
});

// ===== FONCTION DE VÉRIFICATION DE FIN DE PARTIE =====
// Vérifie si un joueur a remporté suffisamment de manches
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

// ===== FONCTION DE LANCEMENT D'UNE NOUVELLE MANCHE =====
// Réinitialise les joueurs sans toucher au score
function lancerNouvelleManche() {
    joueur1.reinitialiser();
    joueur2.reinitialiser();
    jeuEnCours = true;
    dessinerTout();
}

// ===== FONCTION DE DÉMARRAGE DE LA PARTIE =====
// Réinitialise tout et démarre le jeu
function demarrerPartie() {
    // Réinitialiser le score et les joueurs
    score.reinitialiser();
    joueur1.reinitialiser();
    joueur2.reinitialiser();
    jeuEnCours = true;
    partieCommencee = true;
    btnDemarrer.disabled = true;
    btnDemarrer.textContent = "Partie en cours...";
    dessinerTout();
    
    // Nettoyer l'ancien intervalle s'il existe
    if (intervalId) {
        clearInterval(intervalId);
    }
    
    // ===== BOUCLE DE JEU PRINCIPALE =====
    // Exécutée toutes les 100ms (10 fois par seconde)
    intervalId = setInterval(() => {
        if (!jeuEnCours) return;
        
        // Faire avancer les deux joueurs
        joueur1.avancer();
        joueur2.avancer();
        dessinerTout();
        
        // Vérifier les collisions pour chaque joueur
        let collision1 = joueur1.verifierCollisionBord() || joueur1.verifierCollision(joueur2);
        let collision2 = joueur2.verifierCollisionBord() || joueur2.verifierCollision(joueur1);
        
        // Si au moins un joueur a une collision
        if (collision1 || collision2) {
            jeuEnCours = false;
            
            // Cas d'égalité : les deux joueurs se percutent en même temps
            if (collision1 && collision2) {
                dessinerTout();
                ctx.fillStyle = "white";
                ctx.font = "32px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("Égalité!", CANVAS.width / 2, CANVAS.height / 2);
            } 
            // Le joueur 1 a perdu
            else if (collision1) {
                score.incrementerJ2();
            } 
            // Le joueur 2 a perdu
            else if (collision2) {
                score.incrementerJ1();
            }
            
            // Attendre 1.5 secondes avant de lancer la prochaine manche ou partie
            setTimeout(() => {
                if (!verifierFinPartie()) {
                    lancerNouvelleManche();
                }
            }, 1500);
        }
    }, 100);
}

// ===== FONCTION DE RÉINITIALISATION =====
// Arrête le jeu et remet tout à zéro
function reinitialiserPartie() {
    // Arrêter la boucle de jeu
    if (intervalId) {
        clearInterval(intervalId);
    }
    
    // Réinitialiser l'état du jeu
    jeuEnCours = false;
    partieCommencee = false;
    score.reinitialiser();
    joueur1.reinitialiser();
    joueur2.reinitialiser();
    
    // Réactiver le bouton démarrer
    btnDemarrer.disabled = false;
    btnDemarrer.textContent = "Démarrer";
    
    // Redessiner le terrain vide
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
    dessinerTout();
}

// ===== ASSIGNATION DES ÉVÉNEMENTS AUX BOUTONS =====
btnDemarrer.addEventListener('click', demarrerPartie);
btnReinitialiser.addEventListener('click', reinitialiserPartie);

// ===== FONCTION D'AFFICHAGE DU GAGNANT =====
// Affiche un message au centre du canvas
function afficherGagnant(gagnant) {
    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(gagnant, CANVAS.width / 2, CANVAS.height / 2);
}

// ===== FONCTION DE DESSIN GLOBAL =====
// Efface et redessine tout le canvas
function dessinerTout() {
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
    joueur1.dessinerComplet();
    joueur2.dessinerComplet();
}
dessinerTout();

document.addEventListener('keydown', function(event) {
    if (!jeuEnCours || !partieCommencee) return;
    
    // Joueur 1
    if (event.key === touchesConfig.joueur1.droite) {
        joueur1.changerDirection(1, 0);
    } else if (event.key === touchesConfig.joueur1.gauche) {
        joueur1.changerDirection(-1, 0);
    } else if (event.key === touchesConfig.joueur1.haut) {
        joueur1.changerDirection(0, -1);
    } else if (event.key === touchesConfig.joueur1.bas) {
        joueur1.changerDirection(0, 1);
    } else if (event.key === touchesConfig.joueur1.sauter) {
        joueur1.sauter(joueur2);
        dessinerTout();
    }
    
    // Joueur 2
    if (event.key === touchesConfig.joueur2.droite) {
        joueur2.changerDirection(1, 0);
    } else if (event.key === touchesConfig.joueur2.gauche) {
        joueur2.changerDirection(-1, 0);
    } else if (event.key === touchesConfig.joueur2.haut) {
        joueur2.changerDirection(0, -1);
    } else if (event.key === touchesConfig.joueur2.bas) {
        joueur2.changerDirection(0, 1);
    } else if (event.key === touchesConfig.joueur2.sauter) {
        joueur2.sauter(joueur1);
        dessinerTout();
    }
});