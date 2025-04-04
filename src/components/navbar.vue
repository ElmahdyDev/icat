<template>
  <nav class="main-nav">
    <div class="nav-container">
      <router-link to="/" class="nav-logo">iCat</router-link>
      
      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/tasks" class="nav-link">Tasks</router-link>
        <router-link to="/pomodoro" class="nav-link">Pomodoro</router-link>
        <router-link to="/settings" class="nav-link">Settings</router-link>
      </div>
      
      <div class="auth-links">
        <template v-if="isLoggedIn">
          <span class="username">{{ username }}</span>
          <button @click="logout" class="logout-btn">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login" class="auth-link">Login</router-link>
          <router-link to="/signup" class="auth-link signup">Sign Up</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import authService from '../services/auth';

export default {
  data() {
    return {
      isLoggedIn: false,
      username: ''
    };
  },
  created() {
    this.checkAuthStatus();
  },
  watch: {
    $route() {
      // Check auth status on route change
      this.checkAuthStatus();
    }
  },
  methods: {
    checkAuthStatus() {
      this.isLoggedIn = authService.isAuthenticated();
      if (this.isLoggedIn) {
        const user = authService.getUser();
        this.username = user ? user.username : '';
      }
    },
    logout() {
      authService.logout();
      this.isLoggedIn = false;
      this.username = '';
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.main-nav {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-size: 24px;
  font-weight: 700;
  color: #007aff;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: #555;
  text-decoration: none;
  font-weight: 500;
  padding: 5px 0;
  position: relative;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #007aff;
}

.nav-link.router-link-active {
  color: #007aff;
}

.nav-link.router-link-active:after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #007aff;
}

.auth-links {
  display: flex;
  align-items: center;
  gap: 15px;
}

.auth-link {
  color: #555;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.auth-link:hover {
  color: #007aff;
}

.auth-link.signup {
  background-color: #007aff;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.auth-link.signup:hover {
  background-color: #0062cc;
  color: white;
}

.username {
  color: #555;
  font-weight: 500;
}

.logout-btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 6px 12px;
  color: #555;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background-color: #f2f2f2;
  border-color: #ccc;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 15px;
  }
  
  .nav-links {
    width: 100%;
    justify-content: space-between;
  }
  
  .auth-links {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>