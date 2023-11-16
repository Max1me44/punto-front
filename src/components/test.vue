<script setup lang="ts">
import {useTestStore} from "@/stores/test-store";
import {ref} from "vue";
import type {Test} from "@/types/Test.types";

const tabTests = ref([] as Test[]);

const testStore = useTestStore();
testStore.loadTests().then(() => {
  tabTests.value = testStore.getTests();
});
</script>

<template>
  <table>
    <tr v-for="test in tabTests">
      <td>{{ test.msg }}</td>
    </tr>
  </table>
</template>

<style scoped>
</style>