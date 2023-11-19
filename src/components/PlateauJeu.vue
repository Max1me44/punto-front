<template>
  <div class="plateau-jeu">
    <div v-for="(row, rowIndex) in plateau" :key="rowIndex" class="plateau-row">
      <div v-for="(cartePresente, colIndex) in row" :key="colIndex" class="plateau-cell">
        <Carte
            v-if="cartePresente"
            :nombre="cartePresente.nombre"
            :couleur="cartePresente.couleur"
            @click="placerCarte(rowIndex, colIndex)"
        />
        <div v-else class="empty-case" @click="placerCarte(rowIndex, colIndex)"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Carte from '@/components/Carte.vue';
import {ref, onMounted} from 'vue';
import {TAILLE_PLATEAU} from "@/constants/common";

const props = defineProps(['joueurActuel', 'mainsJoueurs']);
const emit = defineEmits();
const plateau = ref<Array<Array<{ nombre: number; couleur: string } | null>>>([]);

const initialiserPlateau = () => {
  for (let i = 0; i < TAILLE_PLATEAU; i++) {
    plateau.value.push([]);
    for (let j = 0; j < TAILLE_PLATEAU; j++) {
      plateau.value[i].push(null);
    }
  }
};

const placerCarte = (row: number, col: number) => {
  const joueurActuel = Object.keys(props.mainsJoueurs)[props.joueurActuel];
  if (props.mainsJoueurs[joueurActuel].length === 0) {
    return;
  } else {
    // récupère la première carte du joueur actuel, on la pose sur le plateau et la supp de la main du joueur
    const carte = props.mainsJoueurs[joueurActuel].shift();
    plateau.value[row][col] = carte;
    console.log(`Carte ${carte.couleur} ${carte.nombre} (${row}, ${col}) par le joueur ${joueurActuel}`);
    emit('change-joueur'); // évènement pour passer au joueur suivant
  }
};

onMounted(() => {
  initialiserPlateau();
});
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

.empty-case {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 5px; /* Ajoutez cette ligne pour arrondir les bords du plateau */
}

.empty-case:hover {
  background-color: #e0e0e0;
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
</style>
