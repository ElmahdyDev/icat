<template>
  <div class="not-found">
    <h1>Error 404</h1>
    <p>The page you are looking for was not found.</p>
    <router-link to="/" class="btn">Return Home</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding: 2rem;
}
.not-found h1 {
  font-size: 3rem;
  color: #d32f2f;
  margin-bottom: 1rem;
}
.not-found p {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 2rem;
}
</style>