<template>
  <div class="punto-container">
    <div class="main-part">
      <PlateauJeu
          :joueurActuel="joueurActuel"
          :mainsJoueurs="mainsJoueurs"
          :key="reloadPlateauJeu"
          @changement="actualisationPlateauJeu"
      />
    </div>
    <div class="info-part">
      <PlayerInfo :joueurActuel="joueurActuel" :mainsJoueurs="mainsJoueurs"/>
      <br/>
      <StatsPlayers :joueurActuel="joueurActuel" :mainsJoueurs="mainsJoueurs"/>
    </div>
  </div>
</template>


<script setup lang="ts">
import {ref, onMounted} from 'vue';
import PlateauJeu from "@/components/PlateauJeu.vue";
import PlayerInfo from '@/components/PlayerInfo.vue';
import StatsPlayers from "@/components/StatsPlayers.vue";
import {storage} from '@/stores/storage';
import {COULEURS} from "@/constants/common";
import router from "@/router";

const reloadPlateauJeu = ref(0); // Permet de recharger le composant PlateauJeu lorsque les joueurs rejouent

const joueurActuel = ref(0);
const mainsJoueurs = ref<Record<string, {
  pioche: { nombre: number; couleur: string }[],
  cartesJouees: { nombre: number; couleur: string }[],
  series: { serie: { nombre: number; couleur: string }[], totalSerie: number }[],
  cartesVictoire: { nombre: number; couleur: string }[]
}>>({});

onMounted(() => {
  const databaseType = storage.getDatabaseType();
  const joueurListTemp = storage.getPlayersTable();
  const nombreJoueurs = storage.getPlayerCount();
  let joueurList = [];
  if (databaseType && joueurListTemp && nombreJoueurs && nombreJoueurs >= 2 && nombreJoueurs <= 4) {
    for (let i = 0; i < nombreJoueurs; i++) {
      joueurList.push(joueurListTemp[i]);
    }
    distribuerCartes(joueurList);
  } else {
    router.push({name: 'bdd'});
  }
});

/**
 * Distribue les cartes aux joueurs
 * @param joueurList
 */
const distribuerCartes = (joueurList: string[]) => {
  const cartes: { nombre: number; couleur: string }[] = [];

  // Crée un jeu de cartes
  for (let couleur of COULEURS) {
    for (let nombre = 1; nombre <= 9; nombre++) {
      cartes.push({nombre, couleur});
      cartes.push({nombre, couleur});
    }
  }

  // Mélange les cartes
  for (let i = cartes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cartes[i], cartes[j]] = [cartes[j], cartes[i]];
  }

  // Crée les mains des joueurs
  const tempMainsJoueurs: Record<string, {
    pioche: { nombre: number; couleur: string }[],
    cartesJouees: { nombre: number; couleur: string }[],
    series: { serie: { nombre: number; couleur: string }[], totalSerie: number }[],
    cartesVictoire: { nombre: number; couleur: string }[]
  }> = {};

  if (joueurList.length === 2) {
    const couleursJoueur1 = COULEURS.slice(0, 2);
    const couleursJoueur2 = COULEURS.slice(2);

    tempMainsJoueurs[joueurList[0]] = {
      pioche: cartes.filter(carte => couleursJoueur1.includes(carte.couleur)),
      cartesJouees: [],
      series: [],
      cartesVictoire: []
    };
    tempMainsJoueurs[joueurList[1]] = {
      pioche: cartes.filter(carte => couleursJoueur2.includes(carte.couleur)),
      cartesJouees: [],
      series: [],
      cartesVictoire: []
    };
  } else if (joueurList.length === 4) {
    const couleursJoueur1 = COULEURS.slice(0, 1);
    const couleursJoueur2 = COULEURS.slice(1, 2);
    const couleursJoueur3 = COULEURS.slice(2, 3);
    const couleursJoueur4 = COULEURS.slice(3);

    tempMainsJoueurs[joueurList[0]] = {
      pioche: cartes.filter(carte => couleursJoueur1.includes(carte.couleur)),
      cartesJouees: [],
      series: [],
      cartesVictoire: []
    };
    tempMainsJoueurs[joueurList[1]] = {
      pioche: cartes.filter(carte => couleursJoueur2.includes(carte.couleur)),
      cartesJouees: [],
      series: [],
      cartesVictoire: []
    };
    tempMainsJoueurs[joueurList[2]] = {
      pioche: cartes.filter(carte => couleursJoueur3.includes(carte.couleur)),
      cartesJouees: [],
      series: [],
      cartesVictoire: []
    };
    tempMainsJoueurs[joueurList[3]] = {
      pioche: cartes.filter(carte => couleursJoueur4.includes(carte.couleur)),
      cartesJouees: [],
      series: [],
      cartesVictoire: []
    };
  } else if (joueurList.length === 3) {
    const couleursJoueur1 = COULEURS.slice(0, 1);
    const couleursJoueur2 = COULEURS.slice(1, 2);
    const couleursJoueur3 = COULEURS.slice(2, 3);

    tempMainsJoueurs[joueurList[0]] = {
      pioche: cartes.filter(carte => couleursJoueur1.includes(carte.couleur)),
      cartesJouees: [],
      series: [],
      cartesVictoire: []
    };
    tempMainsJoueurs[joueurList[1]] = {
      pioche: cartes.filter(carte => couleursJoueur2.includes(carte.couleur)),
      cartesJouees: [],
      series: [],
      cartesVictoire: []
    };
    tempMainsJoueurs[joueurList[2]] = {
      pioche: cartes.filter(carte => couleursJoueur3.includes(carte.couleur)),
      cartesJouees: [],
      series: [],
      cartesVictoire: []
    };

    // Distribue 6 cartes au hasard de la couleur neutre (couleur non utilisée)
    const couleurNeutre = COULEURS.find(couleur => !couleursJoueur1.includes(couleur) && !couleursJoueur2.includes(couleur) && !couleursJoueur3.includes(couleur));
    const cartesCouleurNeutre = cartes.filter(carte => carte.couleur === couleurNeutre);
    for (let i = 0; i < joueurList.length; i++) {
      tempMainsJoueurs[joueurList[i]].pioche.push(...cartesCouleurNeutre.splice(0, 6));
      // Mélange les cartes du joueur
      tempMainsJoueurs[joueurList[i]].pioche = tempMainsJoueurs[joueurList[i]].pioche.sort(() => Math.random() - 0.5);
    }
  }
  mainsJoueurs.value = tempMainsJoueurs;
};

/**
 * Attend un évènement a chaque action d'un joueur (emis par le composant PlateauJeu)
 */
const actualisationPlateauJeu = (typeChangement: number) => {
  if (typeChangement === 0) {
    joueurActuel.value = (joueurActuel.value + 1) % Object.keys(mainsJoueurs.value).length;
  } else if (typeChangement === 1) {
    joueurActuel.value = (joueurActuel.value - 1) % Object.keys(mainsJoueurs.value).length;
    rejouer()
  } else if (typeChangement === -1) {
    // Rien à faire car le joueur actuel reste le même (carte qu'il a voulu jouer n'est pas valide)
  }
};

/**
 * Redistribue les cartes aux joueurs et réinitialise le plateau de jeu
 */
const rejouer = () => {
  // Transfert les cartes jouées dans la pioche, puis mélange la pioche
  for (let joueur in mainsJoueurs.value) {
    mainsJoueurs.value[joueur].pioche.push(...mainsJoueurs.value[joueur].cartesJouees);
    mainsJoueurs.value[joueur].cartesJouees = [];
    mainsJoueurs.value[joueur].series = [];
    mainsJoueurs.value[joueur].pioche = mainsJoueurs.value[joueur].pioche.sort(() => Math.random() - 0.5);
  }
  // Réinitialise le plateau de jeu
  reloadPlateauJeu.value += 1;
  // Passe au joueur suivant
  joueurActuel.value = (joueurActuel.value + 1) % Object.keys(mainsJoueurs.value).length;
}
</script>


<style scoped>
.punto-container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  height: 100vh;
}

.main-part {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-part {
  width: 300px;
  height: 90%;
  margin-left: 20px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
