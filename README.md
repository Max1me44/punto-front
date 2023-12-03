# Punto Front-end

## Présentation

Bienvenue dans Punto, une application de jeu de société en ligne basée sur le célèbre jeu "Punto" ! Ce front-end
fonctionne de pair avec une [API](https://github.com/Max1me44/punto-api) afin de stocker les données des joueurs et des
parties.

## Installation

1. Assurez-vous d'avoir [Node.js](https://nodejs.org/) installé sur votre machine.
2. Clonez ce dépôt avec la commande :
    ```bash
    git clone https://github.com/Max1me44/punto-front.git
    cd punto-front
    ```
3. Installez les dépendances avec la commande :
    ```bash
    npm install
    ```
4. Lancez le serveur de développement avec la commande :
    ```bash
    npm run dev
    ```
5. Rendez-vous sur http://localhost:5173/ pour voir le résultat !

## Technologies utilisées

### Global

- [Vue.js](https://vuejs.org/)
- [Node.js](https://nodejs.org/)

### Dans le projet

- Axios pour les requêtes HTTP
- Element Plus pour les composants graphiques
- Vue Router pour la gestion des routes
- Pinia pour la gestion de l'état de l'application

## Interfaces

L'enssemble des rèfles du Punto ont été respectées sauf le jeu 2vs2.

### Choix de la base de données

Au lancement de l'application, l'utilisateur arrive sur la page d'accueil. Il doit alors choisir une base de données (
MySQL, MongoDB ou SQLite). Au moment du choix de la base de donné, l'application va gérer en arrière plan la
synchnonisation des données entre la base de données. C'est à dire qu'elle va récupérer les données des autres bases de
données et les stocker dans la base de données choisie. Le type de base de données choisie est alors stocké dans le
local storage.  
![Choix_BDD.png](annexe%2FChoix_BDD.png)

### Configuration des joueurs

Pour accéder à la page de configuration des joueurs l'utilsateur est doit obligatoirement avoir choisi une base de
données. Si cela n'est pas fait alors l'applications le redirige vers la page du choix de base de données.
Sur cette page on retrouvera des boutons radio pour choisir le nombre de joueurs (2 à 4 joueurs). En fonction du nombre
de joueur choisi, des champs de texte apparaîtront pour renseigner le nom des joueurs.  
![Choix_joueurs.png](annexe%2FChoix_joueurs.png)

Tous les champs de texte sont obligatoires. Si un champ n'est pas renseigné, un message d'erreur apparaîtra en
dessous.  
![Formulaire_joueurVide.png](annexe%2FFormulaire_joueurVide.png)

Il ne peut pas y avoir de doublons dans les noms des joueurs. Si un doublon est détecté, un message d'erreur
apparaîtra.  
![Formulaire_joueurIdentique.png](annexe%2FFormulaire_joueurIdentique.png)

Une fois les joueurs renseignés, l'utilisateur peut cliquer sur le bouton pour accéder à la page de jeu.

### Page de jeu

La page de jeu est composée de 3 parties : plateaux des joueurs, affichage données sur le joueur sensé jouer et
affichage des séries des joueurs. Le premier joueur ne peux jouer qu'au milieu du plateau. Lorsqu'un joueur pose une
carte sur le plateau, on passe au joueur suivant.
![InterfaceJeu.png](annexe%2FInterfaceJeu.png)

La partie de gauche affiche des informations sur le joueur qui doit jouer. On retrouve son nom, son nombre de parties
jouées, son nombre de parties gagnées, son nombre de carte restante sur la partie actualle et la carte qu'il doit jouer.
Chaque fois qu'il y aura un changement de joueur, les informations seront mises à jour. Le bouton "Ajouter données" est
la pour tester l'ajout de données dans la base de données (joueurs, parties).  
![InfosJoueur.png](annexe%2FInfosJoueur.png)

La partie du milieu est le plateau de jeu. Il est composé d'un carré de 11x11 cases. Lorsqu'un joueur pose une carte, la
case est colorée en fonction de la couleur de la carte et comporte le nombre de la carte. Exemple de plateau d'une
partie en cours. Certaines cases sont grisé car elles sont injouables, les joueurs ne peuvent jouer que dans un
périmètre de 6x6. Les joueurs peuvent pose leurs carte sur une carte déjà exitante si le nombre de la carte est
supérieur à la carte existante.  
![ExemplePlateau.png](annexe%2FExemplePlateau.png)  
Si un joueur essaye de poser une carte sur une case injouable, un message d'erreur apparaîtra.  
![ErreurPlacement.png](annexe%2FErreurPlacement.png)

La partie de droite est l'affichage des séries des joueurs. Une série de carte est lorsque le joueur arrive à aligner 3
cartes (4 cartes lorsque 2 joueurs) de la même couleur. Lorsqu'un joueur possède une série, elle est affichée dans la
partie de droite. Exemple de séries dans une partie en cours :  
![ExempleSeries.png](annexe%2FExempleSeries.png)

Lorsqu'un joueur arrive à aligner 4 cartes de la même couleur (5 cartes lorsque 2 joueurs), il gagne la partie. Un
message s'affiche alors le gagnant.  
![Gagnant.png](annexe%2FGagnant.png)

### Enregistrement des données

Au moment de la configuration des joueurs. Si le nom d'un joueur n'est pas présent dans la base de données, il est alors
ajouté.

Lorsque qu'une partie est terminée, les données de la partie sont enregistrées dans la base de données. On stocke si le
joueur à gagné ou non sur une partie.