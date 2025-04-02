<template>
  <nav class="navbar">
    <div class="navbar-logo">
      <img src="/logo-black.png" alt="iCAT" class="navbar-logo-img" />
      <span class="navbar-logo-text">iCAT</span>
    </div>
    
    <ul class="navbar-links">
      <li v-for="(link, index) in navLinks" :key="index">
        <router-link :to="link.url" class="navbar-link" 
          :class="{ active: $route.path === link.url }">
          {{ link.text }}
        </router-link>
      </li>
    </ul>
    
    <button class="btn btn-outline btn-md">Login</button>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      navLinks: [
        { text: 'Home', url: '/' },
        { text: 'Settings', url: '/settings' },
        { text: 'Pomodoro', url: '/pomodoro' }
      ]
    }
  }
}
</script>

<style>
/* يمكن إزالة scoped لتطبيق الأنماط عالميًا */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2.5rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
  z-index: 10;
}

.navbar-logo {
  display: flex;
  align-items: center;
}

.navbar-logo-img {
  height: 32px;
  width: auto;
  margin-right: 8px;
}

.navbar-logo-text {
  font-weight: 700;
  font-size: 1.25rem;
  color: #4a6bff;
}

.navbar-links {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.navbar-link {
  text-decoration: none;
  color: #555;
  font-weight: 500;
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.navbar-link:hover {
  color: #4a6bff;
  background-color: rgba(74, 107, 255, 0.1);
}

.navbar-link.active {
  color: #4a6bff;
  background-color: rgba(74, 107, 255, 0.15);
}

.btn {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-outline {
  background-color: transparent;
  border: 2px solid #4a6bff;
  color: #4a6bff;
}

.btn-outline:hover {
  background-color: #4a6bff;
  color: white;
}

.btn-sm {
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }
  
  .navbar-links {
    display: none;
  }
}
</style>