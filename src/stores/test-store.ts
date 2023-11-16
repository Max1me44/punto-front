import { defineStore } from "pinia";
import TestService from "@/services/testService";
import type { Test } from "@/types/Test.types";

export const useTestStore = defineStore({
    id: "test",

    state: () => ({
        tests: [] as Test[]
    }),

    actions: {
        async loadTests() {
            this.tests = await TestService.get('/all');
        },

        getTests() {
            return this.tests;
        }
    }
});
