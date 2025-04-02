<template>
  <div class="pomodoro-container">
    <div class="mode-selector">
      <button 
        @click="setMode('pomodoro')" 
        :class="{ active: currentMode === 'pomodoro' }"
      >
        Pomodoro
      </button>
      <button 
        @click="setMode('shortBreak')" 
        :class="{ active: currentMode === 'shortBreak' }"
      >
        Short Break
      </button>
      <button 
        @click="setMode('longBreak')" 
        :class="{ active: currentMode === 'longBreak' }"
      >
        Long Break
      </button>
    </div>

    <div class="timer-display">
      <span class="time">{{ formattedTime }}</span>
    </div>

    <div class="controls">
      <button class="control-btn" @click="toggleTimer">
        {{ isRunning ? 'Pause' : 'Start' }}
      </button>
      <button class="control-btn reset-btn" @click="resetTimer">
        Reset
      </button>
    </div>

    <div class="settings">
      <div class="setting-group">
        <label>Pomodoro (minutes)</label>
        <input 
          type="number" 
          v-model.number="settings.pomodoroTime" 
          min="1" 
          max="60"
          :disabled="isRunning"
        >
      </div>
      <div class="setting-group">
        <label>Short Break (minutes)</label>
        <input 
          type="number" 
          v-model.number="settings.shortBreakTime" 
          min="1" 
          max="15"
          :disabled="isRunning"
        >
      </div>
      <div class="setting-group">
        <label>Long Break (minutes)</label>
        <input 
          type="number" 
          v-model.number="settings.longBreakTime" 
          min="1" 
          max="30"
          :disabled="isRunning"
        >
      </div>
      <div class="setting-group">
        <label>Pomodoros before long break</label>
        <input 
          type="number" 
          v-model.number="settings.pomodorosBeforeLongBreak" 
          min="1" 
          max="10"
          :disabled="isRunning"
        >
      </div>
    </div>

    <div class="pomodoro-count">
      <span>Completed Pomodoros: {{ completedPomodoros }}</span>
    </div>

    <div class="task-section" v-if="settings.enableTaskTracking">
      <h3>Current Task</h3>
      <input 
        type="text" 
        v-model="currentTask" 
        placeholder="What are you working on?"
        @keyup.enter="startTimer"
      >
      <ul class="task-list" v-if="taskHistory.length">
        <li v-for="(task, index) in taskHistory" :key="index">
          {{ task.name }} - {{ formatDuration(task.duration) }}
        </li>
      </ul>
    </div>

    <audio ref="alarmSound" src="@/assets/alarm.mp3" preload="auto"></audio>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

export default {
  name: 'PomodoroPage',
  setup() {
    // Timer state
    const currentMode = ref('pomodoro')
    const timeLeft = ref(0)
    const isRunning = ref(false)
    const timerInterval = ref(null)
    const completedPomodoros = ref(0)
    const alarmSound = ref(null)
    const currentTask = ref('')
    const taskStartTime = ref(null)
    const taskHistory = ref([])

    // Settings
    const settings = ref({
      pomodoroTime: 25,
      shortBreakTime: 5,
      longBreakTime: 15,
      pomodorosBeforeLongBreak: 4,
      autoStartNextRound: true,
      enableTaskTracking: true,
      alarmVolume: 0.5
    })

    // Initialize timer
    onMounted(() => {
      loadSettings()
      resetTimer()
    })

    // Clean up interval when component unmounts
    onUnmounted(() => {
      clearInterval(timerInterval.value)
    })

    // Load settings from localStorage
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('pomodoroSettings')
      if (savedSettings) {
        settings.value = JSON.parse(savedSettings)
      }
    }

    // Save settings to localStorage
    const saveSettings = () => {
      localStorage.setItem('pomodoroSettings', JSON.stringify(settings.value))
    }

    // Watch for settings changes
    watch(settings, (newSettings) => {
      saveSettings()
      if (!isRunning.value) {
        resetTimer()
      }
    }, { deep: true })

    // Format time as MM:SS
    const formattedTime = computed(() => {
      const minutes = Math.floor(timeLeft.value / 60)
      const seconds = timeLeft.value % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    })

    // Set the current mode
    const setMode = (mode) => {
      currentMode.value = mode
      resetTimer()
    }

    // Start the timer
    const startTimer = () => {
      if (isRunning.value) return
      
      // Start task tracking if enabled
      if (settings.value.enableTaskTracking && currentTask.value && !taskStartTime.value) {
        taskStartTime.value = new Date()
      }
      
      isRunning.value = true
      timerInterval.value = setInterval(() => {
        timeLeft.value -= 1
        
        if (timeLeft.value <= 0) {
          timerComplete()
        }
      }, 1000)
    }

    // Pause the timer
    const pauseTimer = () => {
      clearInterval(timerInterval.value)
      isRunning.value = false
    }

    // Toggle between start/pause
    const toggleTimer = () => {
      if (isRunning.value) {
        pauseTimer()
      } else {
        startTimer()
      }
    }

    // Reset the timer
    const resetTimer = () => {
      pauseTimer()
      
      switch (currentMode.value) {
        case 'pomodoro':
          timeLeft.value = settings.value.pomodoroTime * 60
          break
        case 'shortBreak':
          timeLeft.value = settings.value.shortBreakTime * 60
          break
        case 'longBreak':
          timeLeft.value = settings.value.longBreakTime * 60
          break
      }
    }

    // Handle timer completion
    const timerComplete = () => {
      pauseTimer()
      playAlarm()
      
      // Record task if tracking is enabled
      if (settings.value.enableTaskTracking && taskStartTime.value && currentTask.value) {
        const endTime = new Date()
        const duration = (endTime - taskStartTime.value) / 1000 // in seconds
        taskHistory.value.unshift({
          name: currentTask.value,
          duration,
          date: endTime
        })
        taskStartTime.value = null
      }
      
      // Update pomodoro count
      if (currentMode.value === 'pomodoro') {
        completedPomodoros.value += 1
        
        // Check if it's time for a long break
        if (completedPomodoros.value % settings.value.pomodorosBeforeLongBreak === 0) {
          currentMode.value = 'longBreak'
        } else {
          currentMode.value = 'shortBreak'
        }
      } else {
        currentMode.value = 'pomodoro'
      }
      
      resetTimer()
      
      // Auto-start next round if enabled
      if (settings.value.autoStartNextRound) {
        startTimer()
      }
    }

    // Play alarm sound
    const playAlarm = () => {
      if (alarmSound.value) {
        alarmSound.value.volume = settings.value.alarmVolume
        alarmSound.value.currentTime = 0
        alarmSound.value.play()
      }
    }

    // Format duration for task history
    const formatDuration = (seconds) => {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}m ${secs}s`
    }

    return {
      currentMode,
      timeLeft,
      isRunning,
      formattedTime,
      completedPomodoros,
      settings,
      currentTask,
      taskHistory,
      alarmSound,
      setMode,
      toggleTimer,
      resetTimer,
      startTimer,
      formatDuration
    }
  }
}
</script>

<style scoped>
.pomodoro-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.mode-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.mode-selector button {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 20px;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.mode-selector button.active {
  background-color: #4361ee;
  color: white;
}

.mode-selector button:hover:not(.active) {
  background-color: #e0e0e0;
}

.timer-display {
  font-size: 6rem;
  font-weight: 600;
  margin: 1rem 0;
  font-family: 'Courier New', monospace;
  color: #333;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.control-btn {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 8px;
  background-color: #4361ee;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background-color: #3a56d4;
  transform: translateY(-2px);
}

.reset-btn {
  background-color: #f0f0f0;
  color: #333;
}

.reset-btn:hover {
  background-color: #e0e0e0;
}

.settings {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: left;
}

.setting-group {
  margin-bottom: 1rem;
}

.setting-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.setting-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.pomodoro-count {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: #555;
}

.task-section {
  text-align: left;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.task-section h3 {
  margin-bottom: 1rem;
  color: #333;
}

.task-section input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.task-list {
  list-style: none;
  padding: 0;
}

.task-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .timer-display {
    font-size: 4rem;
  }
  
  .mode-selector {
    flex-wrap: wrap;
  }
}
</style>