import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/assets/styles/_global.scss'

const app = createApp(App)
const pinia = createPinia()

console.log('test deploy')

app.use(router)
app.use(pinia)
app.mount('#app')
