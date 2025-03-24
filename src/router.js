import { createRouter, createWebHistory } from 'vue-router'
import FormulaireView from './views/FormulaireView.vue'
import TraitementView from './views/TraitementView.vue'

const routes = [
  {
    path: '/',
    name: 'formulaire',
    component: FormulaireView
  },
  {
    path: '/traitement',
    name: 'traitement',
    component: TraitementView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router