import {createRouter, createWebHistory} from "vue-router";
import ChoixBDD from "@/views/ChoixBDD.vue";
import ChoixJoueurs from "@/views/ChoixJoueurs.vue";
import Punto from "@/views/Punto.vue";
import DisplayStorage from "@/views/DisplayStorage.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/bdd",
            name: "bdd",
            component: ChoixBDD,
        },
        {
            path: "/:pathMatch(.*)*",
            redirect: "bdd",
        },
        {
            path: "/joueurs",
            name: "joueurs",
            component: ChoixJoueurs,
        },
        {
            path: "/punto",
            name: "punto",
            component: Punto,
        },
        {
            path: "/storage",
            name: "storage",
            component: DisplayStorage,
        },
    ],
});

export default router;
