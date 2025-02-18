import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import ShowDetails from '@/views/ShowDetails.vue'
import SearchResults from '@/views/SearchResults.vue'
import GenreView from '@/views/GenreView.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/genre/:genre',
    name: 'Genre',
    component: GenreView,
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
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
