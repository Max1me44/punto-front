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
      <div v-if="selectedValue">
        <router-link :to="{ name: 'joueurs' }">
          <el-button type="success" @click="saveDatabaseType">Je valide !</el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>


<script setup>
import {ref, onMounted} from 'vue';
import {storage} from "@/stores/storage"; // Gestion du storage

const selectedValue = ref(""); // Valeur sélectionnée

const options = [
  {value: "mysql", text: "MySQL"},
  {value: "mongodb", text: "MongoDB"},
  {value: "sqlite", text: "SQLite"},
];

// Met à jour la valeur sélectionnée
const selectDatabase = (value) => {
  selectedValue.value = value;
};

// Enregistre la valeur sélectionnée dans le storage lorsqu'on clique sur le bouton de validation
const saveDatabaseType = () => {
  storage.setDatabaseType(selectedValue.value);
};

// Check si une valeur est déjà stockée dans le storage
onMounted(() => {
  const storedDatabaseType = storage.getDatabaseType();
  if (storedDatabaseType && options.some(item => item.value === storedDatabaseType)) {
    selectedValue.value = storedDatabaseType;
  }
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
</style>
