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
        <span class="card-info">{{ prochaineCarte.couleur }} {{ prochaineCarte.nombre }}</span>
      </div>
      <span v-else class="no-card-info">Jeu de carte vide</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import Carte from "@/components/Carte.vue";

const props = defineProps(['joueurActuel', 'mainsJoueurs', 'tirerCarte']);

// Retourne le nom du joueur actuel
const joueurList = computed(() => {
  return Object.keys(props.mainsJoueurs);
});

// Retourne le nombre de cartes restantes pour le joueur actuel
const nombreCartesRestantes = computed(() => {
  const joueurActuel = joueurList.value[props.joueurActuel];
  return props.mainsJoueurs[joueurActuel] ? props.mainsJoueurs[joueurActuel].length : 0;
});

// Retourne la prochaine carte du joueur actuel
const prochaineCarte = computed(() => {
  return props.mainsJoueurs[joueurList.value[props.joueurActuel]][0];
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
}

.card-info {
  margin-left: 10px;
  font-weight: bold;
}

.no-card-info {
  font-style: italic;
}

button {
  padding: 10px 15px;
  cursor: pointer;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #45a049;
}
</style>
