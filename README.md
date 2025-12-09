# 🎮 TRON - Jeu de Course de Motos Lumineuses

Un jeu multijoueur inspiré du classique TRON, développé en JavaScript avec Canvas HTML5.

## 📋 Description

TRON est un jeu compétitif à deux joueurs où chaque joueur contrôle une moto lumineuse qui laisse une traînée derrière elle. Le but est d'éviter les collisions avec les murs, sa propre traînée et celle de l'adversaire. Le premier joueur à remporter 3 manches gagne la partie !

## ✨ Fonctionnalités

- 🎯 **Mode 2 joueurs** : Affrontez un ami sur le même clavier
- 🏆 **Système de score** : Premier à 3 manches gagnées
- ⚙️ **Touches personnalisables** : Configurez vos propres contrôles
- 💾 **Sauvegarde automatique** : Vos configurations de touches sont conservées
- 🎨 **Interface moderne** : Design épuré inspiré du film TRON
- ⚡ **Fonction de saut** : Sautez par-dessus les traînées adverses
- 🏍️ **Motos animées** : Les joueurs sont représentés par des images de motos qui tournent selon leur direction
- 🎵 **Effets sonores** : Sons de démarrage de match et de victoire
- 🎶 **Musique de fond** : Thème musical qui accompagne toute la partie

## 🎮 Contrôles par défaut

### Joueur 1 (Bleu)
- **Haut** : Z
- **Bas** : S
- **Gauche** : Q
- **Droite** : D
- **Sauter** : Espace

### Joueur 2 (Rouge)
- **Haut** : O
- **Bas** : L
- **Gauche** : K
- **Droite** : M
- **Sauter** : Entrée

## 🚀 Installation

1. Clonez ou téléchargez ce repository
2. Assurez-vous d'avoir la structure de fichiers suivante :
   ```
   SAE WEB/
   ├── page.html
   ├── script.js
   ├── style.css
   ├── README.md
   └── assets/
       ├── TRON.png (logo du jeu)
       ├── moto_bleu.png (image de la moto bleue)
       ├── moto_rouge.png (image de la moto rouge)
       ├── main_theme.mp3 (musique de fond)
       ├── match_start.mp3 (son de démarrage)
       ├── player1_wins.mp3 (son de victoire joueur 1)
       └── player2_wins.mp3 (son de victoire joueur 2)
   ```

3. Ouvrez `page.html` dans votre navigateur web moderne (Chrome, Firefox, Edge, Safari)

## 📦 Dépendances

Le projet utilise les bibliothèques suivantes (chargées via CDN) :
- jQuery 3.6.0
- jQuery UI 1.13.2

Aucune installation de package n'est nécessaire.

## 🎯 Comment jouer

1. **Démarrer une partie**
   - Cliquez sur le bouton "Démarrer"
   - Un son de démarrage retentit et la musique commence
   - Les deux joueurs commencent à avancer automatiquement

2. **Objectif**
   - Évitez de percuter les bords du terrain
   - Évitez votre propre traînée
   - Évitez la traînée de votre adversaire
   - Utilisez le saut pour franchir les obstacles (saute 2 cases)

3. **Victoire**
   - Une manche est gagnée quand l'adversaire percute un obstacle
   - Le premier joueur à remporter 3 manches gagne la partie
   - Un son de victoire se joue pour le gagnant
   - La musique de fond s'arrête à la fin de la partie

4. **Personnalisation**
   - Cliquez sur "Paramètres" pour modifier les touches
   - Cliquez sur "Changer" à côté de chaque action
   - Appuyez sur la nouvelle touche souhaitée
   - Utilisez "Réinitialiser les touches par défaut" pour revenir aux contrôles d'origine

## 🏗️ Structure du projet

```
SAE WEB/
│
├── page.html           # Interface HTML principale
├── script.js           # Logique du jeu (classes et gameplay)
├── style.css           # Styles et mise en page
├── README.md           # Documentation (ce fichier)
└── assets/
    ├── TRON.png        # Logo du jeu
    ├── moto_bleu.png   # Image de la moto du joueur 1
    ├── moto_rouge.png  # Image de la moto du joueur 2
    ├── main_theme.mp3  # Musique de fond en boucle
    ├── match_start.mp3 # Son de démarrage de match
    ├── player1_wins.mp3 # Son de victoire joueur 1
    └── player2_wins.mp3 # Son de victoire joueur 2
```

## 🔧 Architecture technique

### Classes principales

- **Grille** : Gère l'affichage de la grille du terrain de jeu
- **Joueur** : Représente un joueur avec sa position, direction, traînée et image de moto
- **Score** : Gère le système de points et détermine le gagnant

### Fonctionnalités techniques

- Canvas HTML5 (800x590 pixels)
- Système de détection de collision
- File d'attente pour les changements de direction
- LocalStorage pour la sauvegarde des configurations
- Modal jQuery UI pour les paramètres
- Gestion audio HTML5 pour les sons et la musique
- Rotation dynamique des images de motos selon la direction

### Détails des motos

- Les motos sont représentées par des images PNG
- Elles tournent automatiquement selon la direction du joueur
- Taille : 4x la largeur d'une case (en longueur) × 2x la hauteur (en largeur)
- Les images sont étirées dans le sens du mouvement pour un effet dynamique

### Audio

- **Musique de fond** : Se joue en boucle pendant toute la partie
- **Son de démarrage** : Joué au début de chaque nouvelle partie
- **Sons de victoire** : Sons différents selon le joueur gagnant
- Tous les sons sont au format MP3

## 🎨 Personnalisation

Vous pouvez modifier les paramètres suivants dans `script.js` :

```javascript
// Dimensions du canvas
CANVAS.width = 800;
CANVAS.height = 590;

// Taille de la grille
this.hauteurGrille = 10;
this.largeurGrille = 10;

// Nombre de manches pour gagner
var score = new Score(3);

// Vitesse du jeu (en millisecondes)
intervalId = setInterval(() => { ... }, 100);

// Taille des images de motos
const largeur = this.largeurGrille * 4;
const hauteur = this.hauteurGrille * 2;
```

## 🐛 Problèmes connus

- Les touches doivent être uniques pour chaque joueur
- Le jeu nécessite un navigateur moderne avec support Canvas et Audio HTML5
- L'autoplay de la musique peut être bloqué par certains navigateurs (nécessite une interaction utilisateur)

## 🔮 Améliorations futures

- Mode de jeu solo avec une IA
- Différents niveaux de difficulté
- Power-ups sur le terrain
- Modes de jeu alternatifs (ex: contre-la-montre)
- Tableau des scores persistant
- Mode plein écran

## 👥 Crédits

Projet développé dans le cadre de la SAE WEB 2025.

## 📄 Licence

Ce projet est un projet éducatif.

---

**Note** : Pour une meilleure expérience de jeu, utilisez un écran suffisamment large et assurez-vous que votre navigateur est à jour. Autorisez la lecture audio pour profiter pleinement de l'ambiance sonore !
