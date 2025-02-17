import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import ShowDetails from '@/views/ShowDetails.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/shows/:id',
    name: 'ShowDetails',
    component: ShowDetails,
  },
  // TODO: add 404 page
  // TODO: add redirect to home page
  // TODO: add route for search page
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
