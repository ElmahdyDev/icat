import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import SettingsPage from '../pages/dashboard/settings.vue'
import StatisticsPage from '../pages/dashboard/Statistics.vue'
import TasksPage from '../pages/dashboard/tasks.vue'
import PomodoroPage from '../pages/public/pomodoro.vue'
import LoginPage from '../pages/auth/login.vue'
import SignUpPage from '../pages/auth/Signup.vue'
import NotFound from '../pages/NotFound.vue'
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
  },
  // Catch-all route for 404 pages
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Check authentication for protected routes
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authService.isAuthenticated()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router