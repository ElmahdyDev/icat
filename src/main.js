import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import setupSwipeNavigation from './swipeNavigation'
import './style.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
setupSwipeNavigation(router)