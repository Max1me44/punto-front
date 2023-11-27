<template>
  <div>
    <div class="plateau-jeu">
      <div v-for="(row, rowIndex) in plateau" :key="rowIndex" class="plateau-row">
        <div v-for="(cell, colIndex) in row" :key="colIndex" class="plateau-cell">
          <div v-if="cell.injouable" class="case-injouable"></div>
          <div v-else-if="cell.carteVide" class="empty-case" @click="placerCarte(rowIndex, colIndex)"
               :class="{ 'case-desactive': !cell.active }">
          </div>
          <Carte v-else-if="!cell.carteVide"
                 :nombre="cell.nombre"
                 :couleur="cell.couleur"
                 @click="placerCarte(rowIndex, colIndex)"
          />
        </div>
      </div>
    </div>
    <div class="alerte-container">
      <el-alert
          :title="alerte.title"
          :type="alerte.type"
          :description="alerte.description"
          :closable="false"
          v-if="alerte.show"
          show-icon
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Carte from '@/components/Carte.vue';
import {ref, onMounted, watch} from 'vue';
import {ElAlert} from 'element-plus';
import {TAILLE_PLATEAU} from "@/constants/common";
import {ElMessage, ElMessageBox} from 'element-plus'

const props = defineProps(['joueurActuel', 'mainsJoueurs']);
const emit = defineEmits();
const plateau = ref<Array<Array<{
  active: boolean,
  carteVide: boolean,
  injouable: boolean,
  nombre: number | null,
  couleur: string | null
}>>>([]);
const alerte = ref({
  show: false,
  title: 'Erreur de placement',
  type: 'error',
  description: ''
});

onMounted(() => {
  initialiserPlateau();
});

watch(() => props.joueurActuel, (nouveauJoueurActuel) => {
  const joueurActuel = Object.keys(props.mainsJoueurs)[nouveauJoueurActuel];
  if (peutJouer(joueurActuel)) {
    // Ne fait rien, attends que le joueur actuel pose une carte
  } else {
    findGagnant();
  }
});

/**
 * Vérifie si le joueur peut jouer une carte
 * @param joueur joueur actuel
 * @returns true si le joueur peut jouer une carte, false sinon
 */
const peutJouer = (joueur: string) => {
  if (props.mainsJoueurs[joueur].pioche.length === 0) {
    return false;
  }
  // parcour le plateau et vérifier si le joueur peut jouer sa carte
  for (let row = 0; row < TAILLE_PLATEAU; row++) {
    for (let col = 0; col < TAILLE_PLATEAU; col++) {
      if (carteJouable(row, col)) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Initialisation du plateau de jeu, rempli le plateau de cases vides et place la carte active au milieu du plateau
 */
const initialiserPlateau = () => {
  for (let i = 0; i < TAILLE_PLATEAU; i++) {
    plateau.value.push([]);
    for (let j = 0; j < TAILLE_PLATEAU; j++) {
      if (i === 5 && j === 5) { // seul carte active au debut du jeu
        plateau.value[i].push({
          active: true,
          carteVide: true,
          injouable: false,
          nombre: null,
          couleur: null
        });
      } else {
        plateau.value[i].push({
          active: false,
          carteVide: true,
          injouable: false,
          nombre: null,
          couleur: null
        });
      }
    }
  }
};

/**
 * Place la carte sur le plateau lorsqu'on clique sur une case
 * @param row ligne de la case
 * @param col colonne de la case
 */
const placerCarte = (row: number, col: number) => {
  const joueurActuel = Object.keys(props.mainsJoueurs)[props.joueurActuel];

  // Vérifie si la case est vide ou si la carte est active
  if (plateau.value[row][col].carteVide === true || carteJouable(row, col)) {
    // Récupère la première carte du joueur actuel, on la pose sur le plateau et la supprime de la main du joueur
    const carte = props.mainsJoueurs[joueurActuel].pioche.shift(); // supprime la carte de pioche
    props.mainsJoueurs[joueurActuel].cartesJouees.push(carte); // ajoute la carte dans les cartes jouées
    plateau.value[row][col].carteVide = false;
    plateau.value[row][col].nombre = carte.nombre;
    plateau.value[row][col].couleur = carte.couleur;
    verifierVictoire(row, col, carte.couleur); // Vérifie si le joueur actuel a gagné
    verifierSerie(row, col, carte.couleur); // Vérifie si le joueur actuel a une série
    actualiserPlateau(row, col);
    emit('change-joueur'); // Evènement pour passer au joueur suivant
  } else {
    afficherAlerte("Vous ne pouvez pas placer cette carte car elle est inférieure à la carte présente sur le plateau.");
  }
};

/**
 * Vérifie si la carte peut être jouée, carte avec nombre supérieur à la carte présente sur le plateau
 * @param row ligne de la case
 * @param col colonne de la case
 * @returns true si la carte peut être jouée, false sinon
 */
const carteJouable = (row: number, col: number) => {
  const cartePlateau = plateau.value[row][col];
  if (!cartePlateau || cartePlateau.injouable || !cartePlateau.active) {
    return false;
  }
  if (cartePlateau.active && cartePlateau.carteVide) {
    return true;
  }
  const joueurActuel = Object.keys(props.mainsJoueurs)[props.joueurActuel];
  const carteMain = props.mainsJoueurs[joueurActuel].pioche[0];
  return cartePlateau.active && !cartePlateau.carteVide && cartePlateau.nombre && carteMain.nombre > cartePlateau.nombre;
};

/**
 * Affiche une alerte lorsqu'on ne peut pas placer la carte
 * @param message message à afficher dans l'alerte
 */
const afficherAlerte = (message: string) => {
  alerte.value.description = message;
  alerte.value.show = true;

  // Masquer l'alerte après un certain délai (par exemple, 2 secondes)
  setTimeout(() => {
    alerte.value.show = false;
  }, 5000);
};

/**
 * Actualise le plateau de jeu en fonction de la carte posée (case active, case injouable, etc.)
 * @param row ligne de la case
 * @param col colonne de la case
 */
const actualiserPlateau = (row: number, col: number) => {
  // Carte active à droite
  if (col + 1 < TAILLE_PLATEAU && plateau.value[row][col + 1].carteVide === true) {
    plateau.value[row][col + 1].active = true;
  }

  // Carte active à gauche
  if (col - 1 >= 0 && plateau.value[row][col - 1].carteVide === true) {
    plateau.value[row][col - 1].active = true;
  }

  // Carte active en haut
  if (row - 1 >= 0 && plateau.value[row - 1][col].carteVide === true) {
    plateau.value[row - 1][col].active = true;
  }

  // Carte active en bas
  if (row + 1 < TAILLE_PLATEAU && plateau.value[row + 1][col].carteVide === true) {
    plateau.value[row + 1][col].active = true;
  }

  // Carte active en haut à droite (diagonale)
  if (row - 1 >= 0 && col + 1 < TAILLE_PLATEAU && plateau.value[row - 1][col + 1].carteVide === true) {
    plateau.value[row - 1][col + 1].active = true;
  }

  // Carte active en bas à gauche (diagonale)
  if (row + 1 < TAILLE_PLATEAU && col - 1 >= 0 && plateau.value[row + 1][col - 1].carteVide === true) {
    plateau.value[row + 1][col - 1].active = true;
  }

  // Carte active en haut à gauche (diagonale)
  if (row - 1 >= 0 && col - 1 >= 0 && plateau.value[row - 1][col - 1].carteVide === true) {
    plateau.value[row - 1][col - 1].active = true;
  }

  // Carte active en bas à droite (diagonale)
  if (row + 1 < TAILLE_PLATEAU && col + 1 < TAILLE_PLATEAU && plateau.value[row + 1][col + 1].carteVide === true) {
    plateau.value[row + 1][col + 1].active = true;
  }

  // Mettre à jour les cases injouables en fonction de la position de la carte posée
  for (let i = 0; i < plateau.value.length; i++) {
    for (let j = 0; j < plateau.value[i].length; j++) {
      const distanceX = Math.abs(col - j);
      const distanceY = Math.abs(row - i);

      // Si la carte posée dépasse le carré de 6x6, la case devient injouable
      if (distanceX >= 6 || distanceY >= 6) {
        plateau.value[i][j].injouable = true;
      }
    }
  }
};

/**
 * Vérifie si le joueur actuel a gagné
 * @param row ligne de la case
 * @param col colonne de la case
 * @param couleur couleur de la carte posée
 */
const verifierVictoire = (row: number, col: number, couleur: string) => {
  // Victoire horizontale
  if (verifierDirection(row, col, 0, 1, couleur, 'victoire')) {
    return;
  }

  // Victoire verticale
  if (verifierDirection(row, col, 1, 0, couleur, 'victoire')) {
    return;
  }

  // Victoire diagonale (\)
  if (verifierDirection(row, col, 1, 1, couleur, 'victoire')) {
    return;
  }

  // Victoire diagonale (/)
  if (verifierDirection(row, col, 1, -1, couleur, 'victoire')) {
    return;
  }
};

/**
 * Vérifie si le joueur actuel est une série
 * @param row ligne de la case
 * @param col colonne de la case
 * @param couleur couleur de la carte posée
 */
const verifierSerie = (row: number, col: number, couleur: string) => {
  // Vérifie la série horizontale
  verifierDirection(row, col, 0, 1, couleur, 'serie');

  // Vérifie la série verticale
  verifierDirection(row, col, 1, 0, couleur, 'serie');

  // Vérifie la série diagonale (\)
  verifierDirection(row, col, 1, 1, couleur, 'serie');

  // Vérifie la série diagonale (/)
  verifierDirection(row, col, 1, -1, couleur, 'serie');
};

/**
 * Vérifie si le joueur actuel a une série ou une victoire dans la direction donnée
 * @param row ligne de la case
 * @param col colonne de la case
 * @param dirX direction X
 * @param dirY direction Y
 * @param couleur couleur de la carte posée
 * @param type type de vérification (victoire ou série)
 */
const verifierDirection = (row: number, col: number, dirX: number, dirY: number, couleur: string, type: 'victoire' | 'serie'): boolean => {
  let count = 0;
  const nbJoueurs = Object.keys(props.mainsJoueurs).length;
  const condition = type === 'victoire' ? (nbJoueurs === 2 ? 5 : 4) : (nbJoueurs === 2 ? 4 : 3);

  for (let i = -(condition - 1); i <= condition - 1; i++) {
    const newRow = row + i * dirY;
    const newCol = col + i * dirX;
    if (newRow >= 0 && newRow < TAILLE_PLATEAU && newCol >= 0 && newCol < TAILLE_PLATEAU) {
      const caseCourante = plateau.value[newRow][newCol];
      if (!caseCourante.carteVide && caseCourante.couleur === couleur) {
        count++;
      } else {
        count = 0;
      }
      if (count === condition) {
        if (type === 'victoire') {
          const conditionVictoire = Object.keys(props.mainsJoueurs).length === 2 ? 5 : 4;
          afficherVictoire(Object.keys(props.mainsJoueurs)[props.joueurActuel], `Victoire en alignant ${conditionVictoire} cartes`);
        } else {
          stockerSerie(row, col, i, dirX, dirY);
        }
        return true;
      }
    }
  }
  return false;
};

/**
 * Stocke une série dans la mainsJoueurs
 * @param row ligne de la case
 * @param col colonne de la case
 * @param index index de la série dans la mainsJoueurs
 * @param dirX déplacement horizontale
 * @param dirY déplacement verticale
 */
const stockerSerie = (row: number, col: number, index: number, dirX: number, dirY: number) => {
  const joueurActuel = Object.keys(props.mainsJoueurs)[props.joueurActuel];
  const conditionSerie = Object.keys(props.mainsJoueurs).length === 2 ? 4 : 3;

  // Série trouvée, stocke la série dans la mainsJoueurs
  const nouvelleSerie: {
    nombre: number;
    couleur: string
  }[] = [];
  for (let j = index - (conditionSerie - 1); j <= index; j++) {
    const carte = plateau.value[row + j * dirY][col + j * dirX];
    if (carte && !carte.carteVide) {
      nouvelleSerie.push({
        nombre: carte.nombre!,
        couleur: carte.couleur!
      });
    }
  }

  // Ajoute la série à une nouvelle ligne dans mainsJoueurs.series
  props.mainsJoueurs[joueurActuel].series.push(nouvelleSerie);
};

/**
 * Affiche le gagnant de la partie
 * @param joueur joueur gagnant
 * @param typeVictoire type de victoire (victoire ou série)
 */
const afficherVictoire = (joueur: string, typeVictoire: string) => {
  openVictoire(joueur, typeVictoire);
};

/**
 * Trouve le gagnant de la partie lorsqu'un joueur ne peut plus jouer
 */
const findGagnant = () => {
  // le joueur qui a le plus de série gagne. En cas d‘égalité, la série avec le moins de points (somme des cartes de la série) gagne.
  const joueurList = Object.keys(props.mainsJoueurs);
  let joueurGagnant = joueurList[0];
  let gagnePlusDeSeries = false;
  for (let i = 1; i < joueurList.length; i++) {
    const joueur = joueurList[i];
    if (props.mainsJoueurs[joueur].series.length > props.mainsJoueurs[joueurGagnant].series.length) {
      gagnePlusDeSeries = true;
      joueurGagnant = joueur;
    } else if (props.mainsJoueurs[joueur].series.length === props.mainsJoueurs[joueurGagnant].series.length) {
      let sommeJoueur = 0;
      let sommeJoueurGagnant = 0;
      for (let serie of props.mainsJoueurs[joueur].series) {
        for (let carte of serie) {
          sommeJoueur += carte.nombre;
        }
      }
      for (let serie of props.mainsJoueurs[joueurGagnant].series) {
        for (let carte of serie) {
          sommeJoueurGagnant += carte.nombre;
        }
      }
      if (sommeJoueur < sommeJoueurGagnant) {
        joueurGagnant = joueur;
        gagnePlusDeSeries = false;
      }
    }
  }
  let typeVictoire = 'Victoire car possède la série la moins chère';
  if (gagnePlusDeSeries) {
    typeVictoire = 'Victoire car possède le plus de séries';
  }
  afficherVictoire(joueurGagnant, `Plus de cartes jouables. ${typeVictoire}`);
};

/**
 * Ouvre une fenêtre de victoire
 * @param joueur joueur gagnant
 * @param typeVictoire type de victoire (victoire ou série)
 */
const openVictoire = (joueur: string, typeVictoire: string) => {
  ElMessageBox.confirm(
      typeVictoire,
      `Victoire du joueur ${joueur} ! ✌️🏆`,
      {
        confirmButtonText: 'Rejouer',
        cancelButtonText: 'Quitter',
        type: 'success',
        center: true,
        showClose: false,
        closeOnPressEscape: false,
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = 'Chargement...'
            setTimeout(() => {
              done()
              setTimeout(() => {
                instance.confirmButtonLoading = false
              }, 300)
            }, 3000)
          } else {
            done()
          }
        },
      }
  )
      .then(() => {
        ElMessage({
          type: 'success',
          message: 'Partie relancée, vous pouvez rejouer !',
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Fin de la partie, à bientôt !',
        })
      })
}
</script>

<style scoped>
.plateau-jeu {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
  width: 400px;
  height: 400px;
}

.plateau-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-bottom: 5px;
}

.empty-case, .case-desactive, .case-injouable {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  border-radius: 5px;
}

.case-desactive {
  background-color: #ddd;
  pointer-events: none !important;
}

.case-injouable {
  background-color: dimgray;
  pointer-events: none !important;
}

.carte {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}

.alerte-container {
  position: absolute;
  margin-top: 10px;
  width: 370px;

}
</style>
