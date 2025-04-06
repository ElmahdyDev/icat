<script>
import Navbar from '../components/navbar.vue'
</script>

<template>
  <div>
    <Navbar />
    
    <main class="container">
      <section class="hero">
        <div class="hero-content">
          <h1>iCAT</h1>
          <p>The best way to Study and get things done with our powerful productivity tools</p>
          <button class="btn">Get Started</button>
        </div>
        
        <div class="hero-image">
          <img src="/logo-black.png" alt="iCAT" class="animate-float" />
        </div>
      </section>
      
      <section class="features">
        <h2>Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">⏱️</div>
            <h3>Pomodoro Timer</h3>
            <p>Stay focused and manage your time effectively with customizable work and break intervals.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📝</div>
            <h3>Smart Notes</h3>
            <p>Take and organize your study notes with our intelligent note-taking system that adapts to your needs.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Study Stats</h3>
            <p>Track your progress with detailed statistics and visualize your improvement over time.</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
