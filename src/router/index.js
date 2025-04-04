import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import SettingsPage from '../pages/dashboard/settings.vue'
import StatisticsPage from '../pages/dashboard/statistics.vue'
import TasksPage from '../pages/dashboard/tasks.vue'
import PomodoroPage from '../pages/public/pomodoro.vue'
import LoginPage from '../pages/auth/login.vue'
import SignUpPage from '../pages/auth/signup.vue'
import authService from '../services/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/pomodoro',
    name: 'Pomodoro',
    component: PomodoroPage
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpPage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: StatisticsPage
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsPage
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: TasksPage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to check authentication for protected routes
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // This route requires auth, check if logged in
    if (!authService.isAuthenticated()) {
      // Not logged in, redirect to login page
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      // Logged in, proceed to route
      next()
    }
  } else {
    // Not a protected route, proceed
    next()
  }
})

export default router