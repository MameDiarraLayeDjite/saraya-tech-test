import { createRouter, createWebHistory } from 'vue-router'
import RequestForm from '../views/RequestForm.vue'
import RequestList from '../views/RequestList.vue'

// Configuration des routes
const routes = [
  {
    path: '/',
    redirect: '/form' // Redirection par défaut
  },
  {
    path: '/form',
    name: 'Form',
    component: RequestForm
  },
  {
    path: '/requests',
    name: 'Requests',
    component: RequestList
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})