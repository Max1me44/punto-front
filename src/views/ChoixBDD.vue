<template>
  <div class="container">
    <div class="content">
      <img src="../assets/img/database-icon.png" alt="Database Icon" class="database-icon"/>
      <h1>Sélectionnez une base de données</h1>
      <div class="button-container">
        <el-button
            v-for="item in options"
            :key="item.value"
            :type="selectedValue === item.value ? 'primary' : 'default'"
            @click="selectDatabase(item.value)"
        >{{ item.text }}
        </el-button>
      </div>
      <div v-if="selectedValue" class="btn_next">
        <el-button color="#626aef" size="large" :icon="Delete" @click="deleteAllData">et continuer</el-button>
        <el-button type="success" size="large" :icon="UploadFilled" @click="synchronizeAllData">et continuer</el-button>
      </div>
    </div>
  </div>
</template>


<script setup>
import {ref, onMounted} from 'vue';
import {storage} from "@/stores/storage"; // Gestion du storage
import {UploadFilled, Delete} from '@element-plus/icons-vue'
import axios from "axios";
import {URL_API} from "@/constants/common";
import router from '@/router/index';

const selectedValue = ref(""); // Valeur sélectionnée

const options = [
  {value: "mysql", text: "MySQL"},
  {value: "mongodb", text: "MongoDB"},
  {value: "sqlite", text: "SQLite"},
];

// Check si une valeur est déjà stockée dans le storage
onMounted(() => {
  const storedDatabaseType = storage.getDatabaseType();
  if (storedDatabaseType && options.some(item => item.value === storedDatabaseType)) {
    selectedValue.value = storedDatabaseType;
  }
});

/**
 * Met à jour la valeur sélectionnée
 * @param value Valeur sélectionnée
 */
const selectDatabase = (value) => {
  selectedValue.value = value;
};

/**
 * Supprime les données de toutes les bases de données
 */
const deleteAllData = async () => {
  try {
    for (let i = 0; i < options.length; i++) {
      await axios.post(URL_API + options[i].value + `/reset/all`);
    }
  } catch (e) {
    console.log(e);
  }
  saveDatabaseType();
};

/**
 * Synchronise les données de toutes les bases de données sur le BDD selectionnée
 */
const synchronizeAllData = async () => {
  // TODO : récupère toutes les données de toutes les BDD et les ajoutes dans la BDD selectionnée
  saveDatabaseType();
};

/**
 * Enregistre la valeur sélectionnée dans le storage
 */
const saveDatabaseType = () => {
  storage.setDatabaseType(selectedValue.value);
  router.push({name: 'joueurs'});
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

.database-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}

.button-container {
  margin-top: 20px;
}

.el-button {
  margin: 5px;
}

.btn_next .el-button {
  font-size: 20px;
}
</style>
