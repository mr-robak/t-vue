import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import ShowDetails from '@/views/ShowDetails.vue'
import SearchResults from '@/views/SearcResults.vue'

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
  {
    path: '/search',
    name: 'SearchShows',
    component: SearchResults,
  },
  // TODO: add 404 page
  // TODO: add redirect to home page
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
