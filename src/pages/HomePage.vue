<script>
import Navbar from '../components/navbar.vue'

export default {
  mounted() {
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('.feature-card, .hero-content').forEach(el => {
      observer.observe(el)
    })
  }
}
</script>

<template>
  <div class="page-wrapper">
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

<style scoped>
/* Base Styles */
.page-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.hero {
  min-height: 80vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 60px 0;
  gap: 40px;
}

.hero-content {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease-out;
}

.hero-content.visible {
  opacity: 1;
  transform: translateY(0);
}

.hero-content h1 {
  font-size: 4rem;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 700;
}

.hero-content p {
  font-size: 1.2rem;
  color: #666;
  max-width: 500px;
  margin-bottom: 30px;
}

.btn {
  padding: 12px 32px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
  background: #2980b9;
}

/* Floating Animation */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
  max-width: 100%;
  height: auto;
}

/* Features Section */
.features {
  padding: 80px 0;
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 60px;
  color: #2c3e50;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.feature-card {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
}

.feature-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 40px 0;
  }
  
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .hero-image {
    max-width: 300px;
    margin: 0 auto;
  }
  
  .features {
    padding: 40px 0;
  }
  
  .features h2 {
    font-size: 2rem;
  }
}
</style>