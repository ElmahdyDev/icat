<template>
  <div class="signup-container">
    <div class="signup-card">
      <h1>Create an Account</h1>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div v-if="success" class="success-message">
        {{ success }}
      </div>
      
      <form @submit.prevent="handleSignup">
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            required
            placeholder="Choose a username"
          />
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required
            placeholder="Enter your email"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            placeholder="Create a password"
          />
        </div>
        
        <div class="form-group">
          <label for="grade">Grade</label>
          <select id="grade" v-model="grade" required>
            <option value="" disabled>Select your grade</option>
            <option value="freshman">Low School</option>
            <option value="sophomore">Middle School</option>
            <option value="junior">High School</option>
          </select>
        </div>
        
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
        </button>
        
        <div class="login-link">
          Already have an account? <router-link to="/login">Log in</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      grade: '',
      error: '',
      success: '',
      isLoading: false
    }
  },
  methods: {
    async handleSignup() {
      this.error = '';
      this.success = '';
      this.isLoading = true;
      
      try {
        const response = await fetch('https://serveriicat.vercel.app/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            password: this.password,
            grade: this.grade
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to create account');
        }
        
        this.success = data.message;
        this.username = '';
        this.email = '';
        this.password = '';
        this.grade = '';
        
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
        
      } catch (error) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.signup-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 450px;
}

h1 {
  text-align: center;
  margin-bottom: 24px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #555;
}

input, select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus, select:focus {
  border-color: #4a90e2;
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3a7bc8;
}

button:disabled {
  background-color: #a0c0e8;
  cursor: not-allowed;
}

.error-message {
  background-color: #ffebee;
  color: #d32f2f;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.success-message {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-link a {
  color: #4a90e2;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>