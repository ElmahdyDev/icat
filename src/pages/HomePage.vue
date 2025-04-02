<script>
import Navbar from '../components/navbar.vue'
</script>

<template>
  <div>
    <Navbar />
    
    <main class="container">
      <div class="flex justify-between items-center mt-xl mb-xl">
        <div class="text-left">
          <h1 class="text-primary mb-md">iCAT</h1>
          <p class="text-medium mb-lg">The best way to Study and get things done</p>
          <button class="btn btn-primary btn-lg">Get Started</button>
        </div>
        
        <div class="flex justify-center">
          <img src="/logo-black.png" alt="iCAT" class="img-fluid animate-float" />
        </div>
      </div>
      
      <section class="card mt-xl">
        <h2 class="mb-lg">Features</h2>
        <div class="flex gap-lg">
          <div class="card p-lg">
            <h4 class="mb-md">Pomodoro Timer</h4>
            <p>Stay focused and manage your time effectively.</p>
          </div>
          <div class="card p-lg">
            <h4 class="mb-md">Smart Notes</h4>
            <p>Take and organize your study notes.</p>
          </div>
          <div class="card p-lg">
            <h4 class="mb-md">Study Stats</h4>
            <p>Track your progress with detailed statistics.</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>