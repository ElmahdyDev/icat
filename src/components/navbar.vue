<template>
  <nav class="main-nav">
    <div class="nav-container">
      <router-link to="/" class="nav-logo">iCat</router-link>
      
      <button @click="toggleMenu" class="menu-toggle" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <div class="nav-content" :class="{ 'active': menuOpen }">
        <div class="nav-links">
          <router-link to="/" class="nav-link" @click="closeMenu">Home</router-link>
          <router-link to="/tasks" class="nav-link" @click="closeMenu">Tasks</router-link>
          <router-link to="/pomodoro" class="nav-link" @click="closeMenu">Pomodoro</router-link>
          <router-link to="/settings" class="nav-link" @click="closeMenu">Settings</router-link>
        </div>
        
        <div class="auth-links">
          <template v-if="isLoggedIn">
            <span class="username">{{ username }}</span>
            <button @click="logout" class="logout-btn">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="auth-link" @click="closeMenu">Login</router-link>
            <router-link to="/signup" class="auth-link signup" @click="closeMenu">Sign Up</router-link>
          </template>
        </div>
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
      username: '',
      menuOpen: false
    };
  },
  created() {
    this.checkAuthStatus();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  watch: {
    $route() {
      this.checkAuthStatus();
      this.closeMenu();
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
      this.closeMenu();
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
      if (this.menuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },
    closeMenu() {
      if (this.menuOpen) {
        this.menuOpen = false;
        document.body.style.overflow = '';
      }
    },
    handleResize() {
      if (window.innerWidth > 768 && this.menuOpen) {
        this.closeMenu();
      }
    }
  }
};
</script>

<style scoped>
.main-nav {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.nav-logo {
  font-size: 26px;
  font-weight: 700;
  color: #007aff;
  text-decoration: none;
  z-index: 101;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
  margin-left: 40px;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  color: #555;
  text-decoration: none;
  font-weight: 500;
  padding: 6px 0;
  position: relative;
  transition: color 0.3s ease;
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
  gap: 16px;
}

.auth-link {
  color: #555;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.auth-link:hover {
  color: #007aff;
}

.auth-link.signup {
  background-color: #007aff;
  color: white;
  padding: 10px 18px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 600;
}

.auth-link.signup:hover {
  background-color: #0062cc;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

.username {
  color: #555;
  font-weight: 500;
}

.logout-btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 14px;
  color: #555;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: #f5f5f5;
  border-color: #bbb;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  width: 30px;
  height: 24px;
  position: relative;
  z-index: 101;
  padding: 0;
}

.menu-toggle span {
  display: block;
  width: 100%;
  height: 2px;
  background-color: #333;
  margin: 5px 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }
  
  .nav-content {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: white;
    flex-direction: column;
    justify-content: center;
    gap: 40px;
    margin: 0;
    padding: 24px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 100;
  }
  
  .nav-content.active {
    transform: translateX(0);
  }
  
  .nav-links {
    flex-direction: column;
    align-items: center;
    gap: 24px;
    width: 100%;
  }
  
  .nav-link {
    font-size: 20px;
    text-align: center;
    padding: 8px 0;
  }
  
  .auth-links {
    flex-direction: column;
    width: 100%;
    gap: 16px;
    align-items: center;
  }
  
  .auth-link, .logout-btn {
    width: 100%;
    max-width: 200px;
    text-align: center;
    padding: 12px;
  }
  
  .menuOpen .menu-toggle span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  
  .menuOpen .menu-toggle span:nth-child(2) {
    opacity: 0;
  }
  
  .menuOpen .menu-toggle span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 16px;
  }
  
  .nav-logo {
    font-size: 22px;
  }
}
</style>