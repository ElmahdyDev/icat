<template>
  <div id="app">
    <Navbar />
    <router-view v-slot="{ Component, route }">
      <transition 
        :name="'page'" 
        :class="transitionClass"
        @before-leave="beforeLeave"
        @enter="enter">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { ref } from 'vue'
import Navbar from './components/navbar.vue'
export default {
  setup() {
    const transitionClass = ref('');
    const beforeLeave = (el) => {
      el.classList.add(transitionClass.value);
    };
    
    const enter = (el) => {
      el.classList.add(transitionClass.value);
    };
    window.addEventListener('swipe-left', () => {
      transitionClass.value = 'swipe-left';
    });
    
    window.addEventListener('swipe-right', () => {
      transitionClass.value = 'swipe-right';
    });
    
    return {
      transitionClass,
      beforeLeave,
      enter
    };
  }
  name: 'App',
  components: {
    Navbar
  }
}
</script>
<style>
@import './assets/transitions.css';
</style>