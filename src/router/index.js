import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import SettingsPage from '../pages/settings.vue'
import PomodoroPage from '../pages/pomodoro.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsPage
  },
  {
    path: '/pomodoro',
    name: 'Pomodoro',
    component: PomodoroPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router