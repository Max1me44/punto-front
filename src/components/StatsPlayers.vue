<template>
  <div class="player-info">
    <div class="player-info-header">
      <h2>Séries Joueurs</h2>
    </div>
    <div class="player-list">
      <div v-for="(joueur, nom) in mainsJoueurs" :key="nom" :class="{ 'active-player': joueurActuelNom === nom }"
           class="player-card">
        <div :class="{ 'player-name': true, 'active': joueurActuelNom === nom }">{{ nom }}</div>
        <div v-if="joueur.series.length === 0" class="no-series">Pas de série</div>
        <div v-for="(serie, serieIndex) in joueur.series" :key="serieIndex" class="serie">
          <div class="serie-number">{{ serieIndex + 1 }}:</div>
          <div class="serie-carte">
            <Carte v-for="(carte, carteIndex) in serie.serie" :key="carteIndex" :nombre="carte.nombre"
                   :couleur="carte.couleur" class="small-carte"/>
          </div>
        </div>
        <hr/>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import Carte from "@/components/Carte.vue";
import {computed, ref, watch} from "vue";

const props = defineProps(['joueurActuel', 'mainsJoueurs']);
const joueurActuelIndex = ref(props.joueurActuel);
const joueurActuelNom = computed(() => Object.keys(props.mainsJoueurs)[joueurActuelIndex.value]);
watch(() => props.joueurActuel, () => joueurActuelIndex.value = props.joueurActuel);
</script>


<style scoped>
.player-info {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: background-color 0.3s ease;
}

.player-info:hover {
  background-color: #e9ecef;
}

.player-info-header {
  margin-bottom: 20px;
}

.player-info-header h2 {
  font-size: 1.8em;
  margin-bottom: 10px;
  color: #343a40;
}

.player-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.player-name {
  font-weight: bold;
  font-size: 1.2em;
}

.player-name.active {
  text-decoration: underline;
}

.no-series {
  font-style: italic;
  color: #6c757d;
}

.serie {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.serie-number {
  margin-right: 10px;
  font-weight: bold;
  color: #28a745;
}

.serie-carte {
  display: flex;
}

.small-carte {
  width: 24px;
  height: 24px;
  margin-right: 5px;
  font-size: 12px;
}
</style>
