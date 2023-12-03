<template>
  <div class="container">
    <div class="content">
      <img src="../assets/img/game-icon.png" alt="Game Icon" class="game-icon"/>
      <h1>Configuration des joueurs</h1>
      <el-form :model="form" ref="playerForm">
        <el-form-item label="Nombre de joueurs">
          <el-radio-group v-model="form.playerCount">
            <el-radio :label="2">2 joueurs</el-radio>
            <el-radio :label="3">3 joueurs</el-radio>
            <el-radio :label="4">4 joueurs</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-for="index in form.playerCount" :key="index" :label="'Joueur ' + index">
          <el-input v-model="form.players[index - 1].name" placeholder="Nom du joueur" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <div class="button-container">
            <el-button type="success" @click="validateForm">Confirmer et lancer le jeu</el-button>
          </div>
        </el-form-item>
      </el-form>
      <el-alert
          v-if="error"
          type="error"
          :title="error"
          :closable="false"
          show-icon
      >
      </el-alert>
    </div>
  </div>
</template>


<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {ElForm, ElRadioGroup, ElRadio, ElInput, ElButton, ElAlert} from 'element-plus';
import {storage} from '@/stores/storage';
import router from '@/router/index';
import axios from 'axios';
import {URL_API} from "@/constants/common";

const form = ref({
  playerCount: 2,
  players: Array.from({length: 4}, (_, index) => ({name: ''})),
});

const playerFormRef = ref(null); // Référence au formulaire
const error = ref(''); // Message d'erreur si formulaire invalide

// Check si les valeurs est déjà stockée dans le storage
onMounted(() => {
  const databaseType = storage.getDatabaseType();
  if (databaseType) {
    const storedPlayerConfig = storage.getPlayerConfig();
    if (storedPlayerConfig) {
      form.value.playerCount = storedPlayerConfig.playerCount;
      form.value.players = storedPlayerConfig.players;
    }
  } else {
    router.push({name: 'bdd'});
  }
});

/**
 * Valide le formulaire et stocke les données dans le storage si valide
 */
const validateForm = async () => {
  try {
    if (playerFormRef.value) {
      await playerFormRef.value.validate(); // Référence au formulaire
    }

    const activePlayerNames = form.value.players
        .slice(0, form.value.playerCount)
        .map((player) => player.name.trim());
    const uniqueNames = new Set(activePlayerNames);

    if (activePlayerNames.some((name) => !name)) {
      error.value = 'Le nom du joueur est obligatoire';
    } else if (activePlayerNames.length !== uniqueNames.size) {
      error.value = 'Les noms des joueurs doivent être uniques';
    } else {
      error.value = ''; // Réinitialise l'erreur

      // Réinitialise les noms des joueurs inactifs
      for (let i = form.value.playerCount; i < form.value.players.length; i++) {
        form.value.players[i].name = '';
      }

      // Stockage des données dans le storage
      storage.setPlayerConfig({
        playerCount: form.value.playerCount,
        players: form.value.players,
      });

      // Ajoute les joueurs dans la bdd choisie
      try {
        for (let i = 0; i < form.value.playerCount; i++) {
          const response = await axios.post(URL_API + storage.getDatabaseType() + `/joueurs/create/?nom=${form.value.players[i].name}`);
        }
      } catch (e) {
        console.log(e);
      }

      // Redirection vers la page de jeu
      router.push({name: 'punto'});
    }
  } catch (e) {
    error.value = 'Erreur inconue';
  }
};
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

.game-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}

.button-container {
  margin-left: auto;
  margin-right: auto;
}
</style>
