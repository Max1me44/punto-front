<template>
  <div class="carte" :class="couleurClass">
    {{ nombre }}
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';

const props = defineProps(['nombre', 'couleur']);

const couleurClass = computed(() => {
  return `couleur-${props.couleur.toLowerCase()}`;
});
</script>

<style scoped>
.carte {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  border-radius: 5px;
  user-select: none; /* Empêche la sélection du texte */
}

.couleur-rouge {
  background-color: #ff6961;
  color: white;
}

.couleur-bleu {
  background-color: #6495ed;
  color: white;
}

.couleur-jaune {
  background-color: #ffd700;
  color: black;
}

.couleur-vert {
  background-color: #7cfc00;
  color: black;
}
</style>
