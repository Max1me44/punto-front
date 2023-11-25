<template>
  <div class="player-info">
    <div class="player-info-header">
      <h2>{{ joueurList[joueurActuel] }}</h2>
      <p>Cartes restantes: {{ nombreCartesRestantes }}</p>
    </div>
    <div class="next-card">
      <p>Prochaine carte:</p>
      <div v-if="nombreCartesRestantes > 0" class="next-card-info">
        <Carte :nombre="prochaineCarte.nombre" :couleur="prochaineCarte.couleur"/>
      </div>
      <span v-else class="no-card-info">Jeu de carte vide</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import Carte from "@/components/Carte.vue";

const props = defineProps(['joueurActuel', 'mainsJoueurs']);

/**
 * Renvoie le nom du joueur actuel
 */
const joueurList = computed(() => {
  return Object.keys(props.mainsJoueurs);
});

/**
 * Renvoie le nombre de cartes restantes pour le joueur actuel
 */
const nombreCartesRestantes = computed(() => {
  const joueurActuel = joueurList.value[props.joueurActuel];
  return props.mainsJoueurs[joueurActuel] ? props.mainsJoueurs[joueurActuel].pioche.length : 0;
});

/**
 * Renvoie la prochaine carte du joueur actuel
 */
const prochaineCarte = computed(() => {
  return props.mainsJoueurs[joueurList.value[props.joueurActuel]].pioche[0];
});
</script>

<style scoped>
.player-info {
  background-color: #fff;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: background-color 0.3s ease;
}

.player-info:hover {
  background-color: #f0f0f0;
}

.player-info-header {
  margin-bottom: 15px;
}

.player-info-header h2 {
  font-size: 1.5em;
  margin-bottom: 5px;
}

.next-card {
  margin-bottom: 15px;
}

.next-card-info {
  display: flex;
  align-items: center;
  margin-top: 10px;
  justify-content: center;
}

.no-card-info {
  font-style: italic;
}
</style>
