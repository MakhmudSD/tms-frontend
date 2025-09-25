<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>🚛 TMS Login</h1>
        <p>Transport Management System</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            :disabled="loading"
            placeholder="Enter your username"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            :disabled="loading"
            placeholder="Enter your password"
          />
        </div>
        
        <button type="submit" :disabled="loading" class="login-btn">
          <span v-if="loading">Logging in...</span>
          <span v-else>Login</span>
        </button>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>
      
      <div class="signup-section">
        <h3>New User?</h3>
        <p><strong>⚠️ Admin already exists!</strong> Only the first user can become admin. Contact the existing admin to create your account.</p>
        <button @click="showSignup = true" class="signup-btn">Try Create Account</button>
      </div>
    </div>

    <!-- Signup Modal -->
    <div v-if="showSignup" class="modal-overlay" @click="showSignup = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Create Account</h2>
          <button @click="showSignup = false" class="close-btn">&times;</button>
        </div>
        
        <div class="modal-info">
          <p><strong>⚠️ Warning:</strong> Admin already exists! Signup will be blocked. Contact the existing admin to create your account.</p>
        </div>
        
        <form @submit.prevent="handleSignup" class="signup-form">
          <div class="form-group">
            <label for="signup-username">Username</label>
            <input
              id="signup-username"
              v-model="signupForm.username"
              type="text"
              required
              :disabled="loading"
              placeholder="Choose a username"
            />
          </div>
          
          <div class="form-group">
            <label for="signup-password">Password</label>
            <input
              id="signup-password"
              v-model="signupForm.password"
              type="password"
              required
              :disabled="loading"
              placeholder="Choose a password"
            />
          </div>
          
          <div class="form-group">
            <label for="signup-name">Full Name</label>
            <input
              id="signup-name"
              v-model="signupForm.name"
              type="text"
              :disabled="loading"
              placeholder="Your full name"
            />
          </div>
          
          <div class="form-group">
            <label for="signup-email">Email</label>
            <input
              id="signup-email"
              v-model="signupForm.email"
              type="email"
              :disabled="loading"
              placeholder="your@email.com"
            />
          </div>
          
          <button type="submit" :disabled="loading" class="signup-submit-btn">
            <span v-if="loading">Creating Account...</span>
            <span v-else>Create Account</span>
          </button>
          
          <div v-if="signupError" class="error-message">
            {{ signupError }}
          </div>
          
          <div v-if="signupSuccess" class="success-message">
            {{ signupSuccess }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import type { LoginRequest } from '../types'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive<LoginRequest>({
  username: '',
  password: ''
})

const signupForm = reactive({
  username: '',
  password: '',
  name: '',
  email: ''
})

const loading = ref(false)
const error = ref('')
const showSignup = ref(false)
const signupError = ref('')
const signupSuccess = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.login(form)
    router.push('/orders')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}

const handleSignup = async () => {
  loading.value = true
  signupError.value = ''
  signupSuccess.value = ''
  
  try {
    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupForm),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed')
    }
    
    signupSuccess.value = data.message
    if (data.isAdmin) {
      signupSuccess.value += ' You are now the admin!'
    }
    
    // Clear form
    Object.assign(signupForm, {
      username: '',
      password: '',
      name: '',
      email: ''
    })
    
    // Close modal after 2 seconds
    setTimeout(() => {
      showSignup.value = false
      signupSuccess.value = ''
    }, 2000)
    
  } catch (err: any) {
    signupError.value = err.message || 'Signup failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  padding: 3rem;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.login-header p {
  color: #666;
  font-size: 1rem;
}

.login-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.login-btn {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
}

.signup-section {
  background-color: #fff3cd;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
  text-align: center;
}

.signup-section h3 {
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 1.1rem;
}

.signup-section p {
  margin-bottom: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.signup-btn {
  background-color: #ffc107;
  color: #212529;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.signup-btn:hover {
  background-color: #e0a800;
  transform: translateY(-1px);
}

/* Modal Styles */
.modal-overlay {
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

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e1e5e9;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.modal-info {
  padding: 1rem 1.5rem;
  background-color: #fff3cd;
  border-bottom: 1px solid #ffc107;
}

.modal-info p {
  margin: 0;
  color: #856404;
  font-size: 0.9rem;
  text-align: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.signup-form {
  padding: 1.5rem;
}

.signup-submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.signup-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.signup-submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
  border: 1px solid #c3e6cb;
}

@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
  }
  
  .login-card {
    padding: 2rem;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-header {
    padding: 1rem;
  }
  
  .signup-form {
    padding: 1rem;
  }
}
</style>
