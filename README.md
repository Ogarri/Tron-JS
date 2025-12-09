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
2. Assurez-vous d'avoir les fichiers suivants :
   - `page.html`
   - `script.js`
   - `style.css`
   - `assets/TRON.png` (logo du jeu)

3. Ouvrez `page.html` dans votre navigateur web moderne (Chrome, Firefox, Edge, Safari)

## 📦 Dépendances

Le projet utilise les bibliothèques suivantes (chargées via CDN) :
- jQuery 3.6.0
- jQuery UI 1.13.2

Aucune installation de package n'est nécessaire.

## 🎯 Comment jouer

1. **Démarrer une partie**
   - Cliquez sur le bouton "Démarrer"
   - Les deux joueurs commencent à avancer automatiquement

2. **Objectif**
   - Évitez de percuter les bords du terrain
   - Évitez votre propre traînée
   - Évitez la traînée de votre adversaire
   - Utilisez le saut pour franchir les obstacles

3. **Victoire**
   - Une manche est gagnée quand l'adversaire percute un obstacle
   - Le premier joueur à remporter 3 manches gagne la partie

4. **Personnalisation**
   - Cliquez sur "Paramètres" pour modifier les touches
   - Cliquez sur "Changer" à côté de chaque action
   - Appuyez sur la nouvelle touche souhaitée
   - Utilisez "Réinitialiser les touches par défaut" pour revenir aux contrôles d'origine

## 🔧 Architecture technique

### Classes principales

- **Grille** : Gère l'affichage de la grille du terrain de jeu
- **Joueur** : Représente un joueur avec sa position, direction et traînée
- **Score** : Gère le système de points et détermine le gagnant

### Fonctionnalités techniques

- Canvas HTML5 (800x590 pixels)
- Système de détection de collision
- File d'attente pour les changements de direction
- LocalStorage pour la sauvegarde des configurations
- Modal jQuery UI pour les paramètres

## 🎨 Personnalisation

Vous pouvez modifier les paramètres suivants dans `script.js` :

```javascript
// Dimensions du canvas
CANVAS.width = 800;
CANVAS.height = 590;

// Nombre de manches pour gagner
var score = new Score(3);

// Vitesse du jeu (en millisecondes)
intervalId = setInterval(() => { ... }, 100);
```

## 🐛 Problèmes connus

- Les touches doivent être uniques pour chaque joueur
- Le jeu nécessite un navigateur moderne avec support Canvas

## 🔮 Améliorations futures

- Faire un mode de jeu solo avec une IA (aucune idée de comment faire actuellement)

## 👥 Crédits

Projet développé dans le cadre de la SAE WEB 2025.

## 📄 Licence

Ce projet est un projet éducatif.

---

**Note** : Pour une meilleure expérience de jeu, utilisez un écran suffisamment large et assurez-vous que votre navigateur est à jour.
