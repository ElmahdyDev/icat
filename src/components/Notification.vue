<template>
  <transition name="notification">
    <div v-if="show" class="notification" :class="type">
      <div class="notification-content">
        <span class="notification-icon">
          <span v-if="type === 'success'">✓</span>
          <span v-else-if="type === 'error'">✕</span>
          <span v-else>ℹ</span>
        </span>
        <span class="notification-message">{{ message }}</span>
      </div>
      <button class="notification-close" @click="$emit('close')">×</button>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: value => ['success', 'error', 'info'].includes(value)
    }
  },
  emits: ['close']
}
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
  max-width: 450px;
  z-index: 1000;
}

.notification.success {
  background-color: #e8f5e9;
  border-left: 4px solid #34c759;
}

.notification.error {
  background-color: #ffebee;
  border-left: 4px solid #ff3b30;
}

.notification.info {
  background-color: #e3f2fd;
  border-left: 4px solid #007aff;
}

.notification-content {
  display: flex;
  align-items: center;
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 12px;
  font-weight: bold;
}

.success .notification-icon {
  background-color: #34c759;
  color: white;
}

.error .notification-icon {
  background-color: #ff3b30;
  color: white;
}

.info .notification-icon {
  background-color: #007aff;
  color: white;
}

.notification-message {
  font-size: 14px;
  color: #333;
}

.notification-close {
  background: none;
  border: none;
  color: #999;
  font-size: 20px;
  cursor: pointer;
  margin-left: 10px;
}

.notification-close:hover {
  color: #666;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>