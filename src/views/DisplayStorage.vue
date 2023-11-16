<template>
  <div class="container">
    <div class="content">
      <h1>Données de configuration</h1>
      <div>
        <p>Database Type: {{ databaseType }}</p>
        <p>Player Config: {{ playerConfig }}</p>
      </div>
    </div>
  </div>
</template>


<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue';
import {storage} from "@/stores/storage";

const databaseType = ref('');
const playerConfig = ref('');

const updateLocalStorageValues = () => {
  databaseType.value = storage.getDatabaseType() || 'Non spécifié';
  playerConfig.value = JSON.stringify(storage.getPlayerConfig()) || 'Non spécifié';
};

onMounted(() => {
  updateLocalStorageValues();
  window.addEventListener('storage', updateLocalStorageValues);
});

onBeforeUnmount(() => {
  window.removeEventListener('storage', updateLocalStorageValues);
});
</script>


<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.content {
  text-align: center;
}
</style>
