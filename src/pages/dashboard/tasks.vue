<template>
  <div class="tasks-container">
    <Notification
      :show="notification.show"
      :message="notification.message"
      :type="notification.type"
      @close="closeNotification"
    />
    
    <div class="tasks-header">
      <h1>My Tasks</h1>
      <div class="filter-controls">
        <button
          @click="filterTasks('all')"
          :class="{ active: filterType === 'all' }"
        >
          All
        </button>
        <button
          @click="filterTasks('active')"
          :class="{ active: filterType === 'active' }"
        >
          Active
        </button>
        <button
          @click="filterTasks('completed')"
          :class="{ active: filterType === 'completed' }"
        >
          Completed
        </button>
      </div>
    </div>
    
    <div class="new-task-container">
      <input
        type="text"
        v-model="newTask.title"
        placeholder="Add a new task..."
        @keyup.enter="addTask"
      />
      <button @click="addTask" class="add-button">
        <span>+</span>
      </button>
    </div>
    
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading your tasks...</p>
    </div>
    
    <div v-else-if="filteredTasks.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <p v-if="filterType === 'all'">You don't have any tasks yet. Add one to get started!</p>
      <p v-else-if="filterType === 'active'">You don't have any active tasks.</p>
      <p v-else>You don't have any completed tasks.</p>
    </div>
    
    <transition-group name="task-list" tag="ul" class="tasks-list">
      <li
        v-for="task in filteredTasks"
        :key="task._id"
        class="task-item"
        :class="{ completed: task.completed }"
        @touchstart.passive="startRaising(task._id, $event)"
        @touchmove.passive="handleTouchMove($event)"
        @touchend="endRaising">
        
        <div class="task-checkbox">
          <input
            type="checkbox"
            :id="'task-' + task._id"
            :checked="task.completed"
            @change="toggleTaskStatus(task)"
          />
          <label :for="'task-' + task._id"></label>
        </div>
        
        <div class="task-content" @click="openTaskDetails(task)">
          <h3 class="task-title">{{ task.title }}</h3>
          <p v-if="task.description" class="task-description">{{ task.description }}</p>
          
          <div class="task-meta">
            <span v-if="task.dueDate" class="due-date">
              <i class="calendar-icon">📅</i>
              {{ formatDate(task.dueDate) }}
            </span>
            <span class="priority-badge" :class="task.priority">
              {{ task.priority }}
            </span>
          </div>
        </div>

        <button class="raise-button" @click.stop="raiseTask(task)" v-if="!isMobile">
          <font-awesome-icon icon="arrow-up" />
        </button>
        <button class="delete-button" @click.stop="deleteTask(task)">
          <span>×</span>
        </button>
      </li>
    </transition-group>
    
    <!-- Task Details Modal -->
    <div v-if="showTaskModal" class="task-modal-overlay" @click="closeTaskModal">
      <div class="task-modal" @click.stop>
        <div class="modal-header">
          <h2>{{ isEditMode ? 'Edit Task' : 'Task Details' }}</h2>
          <button class="close-button" @click="closeTaskModal">×</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label for="modal-title">Title</label>
            <input
              type="text"
              id="modal-title"
              v-model="currentTask.title"
              :readonly="!isEditMode"
              :class="{ 'readonly': !isEditMode }"
            />
          </div>
          
          <div class="form-group">
            <label for="modal-description">Description</label>
            <textarea
              id="modal-description"
              v-model="currentTask.description"
              :readonly="!isEditMode"
              :class="{ 'readonly': !isEditMode }"
              rows="4"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="modal-due-date">Due Date</label>
            <input
              type="date"
              id="modal-due-date"
              v-model="currentTask.dueDate"
              :disabled="!isEditMode"
              :class="{ 'readonly': !isEditMode }"
            />
          </div>
          
          <div class="form-group">
            <label for="modal-priority">Priority</label>
            <select
              id="modal-priority"
              v-model="currentTask.priority"
              :disabled="!isEditMode"
              :class="{ 'readonly': !isEditMode }"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div class="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                v-model="currentTask.completed"
                :disabled="!isEditMode"
              />
              Mark as completed
            </label>
          </div>
        </div>
        
        <div class="modal-footer">
          <button
            v-if="!isEditMode"
            class="edit-button"
            @click="isEditMode = true"
          >
            Edit
          </button>
          <button
            v-if="isEditMode"
            class="save-button"
            @click="saveTaskChanges"
          >
            Save
          </button>
          <button
            v-if="isEditMode"
            class="cancel-button"
            @click="cancelEdit"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Notification from '../../components/Notification.vue';

export default {
  components: {
    Notification
  },
  data() {
    return {
      notification: {
        show: false,
        message: '',
        type: 'info',
        timeout: null
      },
      tasks: [],
      loading: true,
      filterType: 'all',
      newTask: {
        title: '',
        description: '',
        dueDate: null,
        priority: 'medium'
      },
      showTaskModal: false,
      currentTask: null,
      originalTask: null,
      isEditMode: false,
      activeTask: null,
      touchStartY: null
    };
  },
   computed: {
    isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
  },
    filteredTasks() {
      if (this.filterType === 'all') {
        return this.tasks;
      } else if (this.filterType === 'active') {
        return this.tasks.filter(task => !task.completed);
      } else {
        return this.tasks.filter(task => task.completed);
      }
    }
  },
  mounted() {
    console.log('Tasks page mounted');
    this.fetchTasks().catch(error => {
      console.error('Error in mounted hook:', error);
      this.loading = false;
      this.showNotification('Failed to load tasks: ' + error.message, 'error');
    });
  },
  methods: {
    filterTasks(type) {
      this.filterType = type;
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    
    showNotification(message, type = 'info') {
      // Clear any existing timeout
      if (this.notification.timeout) {
        clearTimeout(this.notification.timeout);
      }
      
      // Show new notification
      this.notification.message = message;
      this.notification.type = type;
      this.notification.show = true;
      
      // Auto-hide after 3 seconds
      this.notification.timeout = setTimeout(() => {
        this.closeNotification();
      }, 3000);
    },
    
    closeNotification() {
      this.notification.show = false;
    },
    
    async fetchTasks() {
  console.log('Fetching tasks...');
  this.loading = true;
 
  try {
    const token = localStorage.getItem('token');
    console.log('Token available:', !!token);
   
    if (!token) {
      this.$router.push('/login');
      return;
    }
   
    // First, let's make sure we're using the correct API endpoint
    const API_URL = 'https://serveriicat.vercel.app/api/tasks'; // Verify this URL
   
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Change to Bearer token format if needed
        'x-auth-token': token, // Keep this if your API expects it
        'Content-Type': 'application/json'
      }
    });
   
    console.log('Response status:', response.status);
   
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error response:', errorData);
      throw new Error(errorData.message || `Server responded with ${response.status}`);
    }
   
    const data = await response.json();
    console.log('Response data:', data);
   
    // Set tasks based on response format
    if (Array.isArray(data)) {
      this.tasks = data;
    } else if (data.tasks && Array.isArray(data.tasks)) {
      this.tasks = data.tasks;
    } else {
      console.warn('Unexpected response format:', data);
      this.tasks = [];
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    this.showNotification('Error: ' + error.message, 'error');
    this.tasks = []; // Set empty array on error
  } finally {
    this.loading = false;
  }
},
    
    async addTask() {
  console.log('Adding task:', this.newTask.title);
  if (!this.newTask.title.trim()) {
    console.log('Task title is empty, not adding');
    this.showNotification('Task title cannot be empty', 'error');
    return;
  }
  
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      this.$router.push('/login');
      return;
    }
    
    const taskData = {
      ...this.newTask,
      // Ensure date format is correct if a date is provided
      dueDate: this.newTask.dueDate || undefined
    };
    
    console.log('Sending task data:', taskData);
    
     const response = await fetch('https://serveriicat.vercel.app/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify(taskData)
        });
    
    console.log('Add task response status:', response.status);
    
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    if (!response.ok) {
      let errorMessage = `Failed to add task (${response.status})`;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use the raw text
        errorMessage = responseText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      throw new Error('Invalid response format from server');
    }
    
    console.log('Add task parsed response:', result);
    
    // Handle different response structures
    let newTask;
    if (result.task) {
      newTask = result.task;
    } else if (result._id) {
      newTask = result;
    } else {
      console.warn('Unexpected response format, fetching all tasks instead');
      await this.fetchTasks();
      this.newTask.title = '';
      this.newTask.description = '';
      this.newTask.dueDate = null;
      this.showNotification('Task added successfully', 'success');
      return;
    }
    
    this.tasks.unshift(newTask);
    this.newTask.title = '';
    this.newTask.description = '';
    this.newTask.dueDate = null;
    
    this.showNotification('Task added successfully', 'success');
  } catch (error) {
    console.error('Error adding task:', error);
    this.showNotification('Failed to add task: ' + error.message, 'error');
  }
},
    
    async toggleTaskStatus(task) {
      console.log('Toggling task status:', task._id);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        
        const updateData = {
          ...task,
          completed: !task.completed
        };
        
        const response = await fetch(`https://serveriicat.vercel.app/api/tasks/${task._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify(updateData)
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to update task (${response.status})`);
        }
        
        const result = await response.json();
        console.log('Update task response:', result);
        
        // Handle different response structures
        let updatedTask;
        if (result.task) {
          updatedTask = result.task;
        } else if (result._id) {
          updatedTask = result;
        } else {
          console.warn('Unexpected response format, using local update');
          updatedTask = { ...task, completed: !task.completed };
        }
        
        // Update task in the list
        const index = this.tasks.findIndex(t => t._id === task._id);
        if (index !== -1) {
          this.tasks[index].completed = updatedTask.completed;
        }
        
        if (this.currentTask && this.currentTask._id === task._id) {
          this.currentTask.completed = updatedTask.completed;
        }
        
        this.showNotification('Task updated successfully', 'success');
      } catch (error) {
        console.error('Error updating task:', error);
        this.showNotification('Failed to update task: ' + error.message, 'error');
      }
    },
    
    async deleteTask(task) {
      if (!confirm('Are you sure you want to delete this task?')) {
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        
        const response = await fetch(`https://serveriicat.vercel.app/api/tasks/${task._id}`, {
          method: 'DELETE',
          headers: {
            'x-auth-token': token
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to delete task (${response.status})`);
        }
        
        // Remove task from the list
        this.tasks = this.tasks.filter(t => t._id !== task._id);
        
        // If the task is currently open in the modal, close it
        if (this.currentTask && this.currentTask._id === task._id) {
          this.closeTaskModal();
        }
        
        this.showNotification('Task deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting task:', error);
        this.showNotification('Failed to delete task: ' + error.message, 'error');
      }
    },

    raiseTask(task) {
      const index = this.tasks.findIndex(t => t._id === task._id);
      if (index > 0) {
        const newTasks = [...this.tasks];
        [newTasks[index - 1], newTasks[index]] = [newTasks[index], newTasks[index - 1]];
        this.tasks = newTasks;
      }
    },
    
    openTaskDetails(task) {
      this.currentTask = { ...task };
      if (this.currentTask.dueDate) {
        // Format date for input element
        this.currentTask.dueDate = new Date(this.currentTask.dueDate).toISOString().split('T')[0];
      }
      this.originalTask = { ...this.currentTask };
      this.showTaskModal = true;
      this.isEditMode = false;
    },
    
    closeTaskModal() {
      this.showTaskModal = false;
      this.currentTask = null;
      this.originalTask = null;
      this.isEditMode = false;
    },
    
    cancelEdit() {
      this.currentTask = { ...this.originalTask };
      this.isEditMode = false;
    },
    
    async saveTaskChanges() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      this.$router.push('/login');
      return;
    }
    
    const updateData = { ...this.currentTask };
    console.log('Sending update data:', updateData);
    
    const response = await fetch(`https://serveriicat.vercel.app/api/tasks/${this.currentTask._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(updateData)
    });
    
    console.log('Update response status:', response.status);
    
    const responseText = await response.text();
    console.log('Raw update response:', responseText);
    
    if (!response.ok) {
      throw new Error(`Failed to update task (${response.status}): ${responseText}`);
    }
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      throw new Error('Invalid response format from server');
    }
    
    console.log('Update task parsed response:', result);
    
    // Handle different response structures
    let updatedTask;
    if (result.task) {
      updatedTask = result.task;
    } else if (result._id) {
      updatedTask = result;
    } else {
      console.warn('Unexpected response format, using local update');
      updatedTask = { ...this.currentTask };
      // Refresh all tasks to ensure consistency
      await this.fetchTasks();
      this.isEditMode = false;
      this.closeTaskModal();
      this.showNotification('Task updated successfully', 'success');
      return;
    }
    
    // Update task in the list
    const index = this.tasks.findIndex(t => t._id === updatedTask._id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
    }
    
    this.isEditMode = false;
    this.originalTask = { ...updatedTask };
    this.showNotification('Task updated successfully', 'success');
  } catch (error) {
        console.error('Error saving task changes:', error);
        this.showNotification('Failed to update task: ' + error.message, 'error');
      }
    },
    
    startRaising(taskId, event) {
    this.touchStartY = event.touches[0].clientY;
    this.activeTask = taskId;
  },

  handleTouchMove(event) {
    if (!this.activeTask || !this.touchStartY) return;
    
    const currentY = event.touches[0].clientY;
    const deltaY = this.touchStartY - currentY;
    
    if (deltaY > 50) { // Threshold for moving up
      const index = this.tasks.findIndex(t => t._id === this.activeTask);
      if (index > 0) {
        // Use the same logic as raiseTask
        const newTasks = [...this.tasks];
        [newTasks[index - 1], newTasks[index]] = [newTasks[index], newTasks[index - 1]];
        this.tasks = newTasks;
        this.touchStartY = currentY;
      }
    }
  },

  endRaising() {
    this.activeTask = null;
    this.touchStartY = null;
  },
  }
}
</script>
<style scoped>
.tasks-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
  min-height: 100vh;
  background-color: #f9f9f9;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.tasks-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.filter-controls {
  display: flex;
  background-color: #e9e9e9;
  border-radius: 8px;
  overflow: hidden;
}

.filter-controls button {
  background: none;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-controls button.active {
  background-color: #007aff;
  color: white;
}

.new-task-container {
  display: flex;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  background-color: white;
}

.new-task-container input {
  flex: 1;
  padding: 15px 20px;
  border: none;
  font-size: 16px;
}

.new-task-container input:focus {
  outline: none;
}

.add-button {
  background-color: #007aff;
  color: white;
  border: none;
  width: 50px;
  font-size: 24px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.add-button:hover {
  background-color: #0062cc;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 122, 255, 0.2);
  border-radius: 50%;
  border-top-color: #007aff;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 50px 0;
  color: #666;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.tasks-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  margin-bottom: 15px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.task-item.completed {
  opacity: 0.7;
}

.task-item.completed .task-title {
  text-decoration: line-through;
  color: #999;
}

.task-checkbox {
  margin-right: 15px;
}

.task-checkbox input[type="checkbox"] {
  display: none;
}

.task-checkbox label {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 2px solid #007aff;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.task-checkbox input[type="checkbox"]:checked + label {
  background-color: #007aff;
}

.task-checkbox input[type="checkbox"]:checked + label:after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
}

.task-content {
  flex: 1;
  cursor: pointer;
}

.task-title {
  margin: 0 0 5px 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.task-description {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-meta {
  display: flex;
  align-items: center;
  font-size: 12px;
}

.due-date {
  display: flex;
  align-items: center;
  color: #666;
  margin-right: 10px;
}

.calendar-icon {
  margin-right: 4px;
  font-style: normal;
}

.priority-badge {
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.priority-badge.low {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.priority-badge.medium {
  background-color: #fff8e1;
  color: #ff8f00;
}

.priority-badge.high {
  background-color: #ffebee;
  color: #d32f2f;
}

.delete-button {
  background: none;
  border: none;
  color: #ccc;
  font-size: 20px;
  cursor: pointer;
  padding: 0 5px;
  transition: color 0.2s ease;
}

.delete-button:hover {
  color: #ff3b30;
}

.raise-button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 5px 8px;
  transition: color 0.2s ease;
  margin-right: 5px;
}

.raise-button:hover {
  color: #007aff;
}

.raise-button svg {
  width: 16px;
  height: 16px;
}

@media (max-width: 768px) {
  .raise-button {
    display: none;
  }
}

/* Task list animations */
.task-list-enter-active, .task-list-leave-active {
  transition: all 0.5s ease;
}

.task-list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.task-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Modal styles */
.task-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.task-modal {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: modal-in 0.3s ease-out;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #007aff;
  outline: none;
}

.form-group input.readonly,
.form-group textarea.readonly,
.form-group select.readonly {
  background-color: #f9f9f9;
  color: #666;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  margin-bottom: 0;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
}

.modal-footer {
  padding: 15px 20px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.edit-button, .save-button, .cancel-button {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.edit-button {
  background-color: #007aff;
  color: white;
  border: none;
}

.edit-button:hover {
  background-color: #0062cc;
}

.save-button {
  background-color: #34c759;
  color: white;
  border: none;
}

.save-button:hover {
  background-color: #28a745;
}

.cancel-button {
  background-color: #f2f2f2;
  color: #333;
  border: none;
}

.cancel-button:hover {
  background-color: #e6e6e6;
}
</style>