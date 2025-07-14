<template>
  <div class="d-flex vh-100 justify-content-center align-items-center">
    <div class="card p-4 shadow-sm" style="max-width:360px; width:100%">
      <div class="text-center mb-4">
        <h4 class="mb-0">
          <i class="bi bi-box-arrow-in-right me-2" aria-hidden="true"></i>Login
        </h4>
      </div>
      
      <!-- Error Alert -->
      <div v-if="error" class="alert alert-danger alert-dismissible fade show mb-3" role="alert">
        {{ error }}
        <button type="button" class="btn-close" @click="error = ''" aria-label="Close"></button>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-floating mb-3">
          <input 
            type="email" 
            class="form-control" 
            id="email"
            v-model="form.email" 
            required
            placeholder="Email address"
            aria-label="Email address"
          >
          <label for="email">Email Address</label>
        </div>

        <div class="form-floating mb-3 position-relative">
          <input 
            :type="showPassword ? 'text' : 'password'" 
            class="form-control" 
            id="password"
            v-model="form.password" 
            required
            placeholder="Password"
            aria-label="Password"
          >
          <label for="password">Password</label>
          <button 
            type="button" 
            class="btn btn-sm position-absolute"
            style="top: 0.75rem; right: 0.75rem"
            @click="showPassword = !showPassword"
            aria-label="Toggle password visibility"
          >
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" aria-hidden="true"></i>
          </button>
        </div>

        <div class="form-check mb-3">
          <input 
            type="checkbox" 
            class="form-check-input" 
            id="remember"
            v-model="form.remember"
          >
          <label class="form-check-label" for="remember">
            Remember me
          </label>
        </div>

        <button 
          type="submit" 
          class="btn btn-primary w-100 mb-2"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          <i v-else class="fas fa-sign-in-alt me-2" aria-hidden="true"></i>
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <hr class="my-4">
      
      <p class="text-center mb-0">
        Don't have an account?
        <router-link to="/register" class="link-primary">
          Create Account
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: {
        email: '',
        password: '',
        remember: false
      },
      showPassword: false,
      loading: false,
      error: ''
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      this.error = ''
      
      try {
        const credentials = {
          email: this.form.email,
          password: this.form.password
        }
        
        // Try to use real API if backend auth is implemented
        try {
          // Real API login
          const { authAPI } = await import('../services/api.js')
          const response = await authAPI.login(credentials)
          
          // Store token and user data in localStorage
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
          
          this.$emit('login-success', response.user)
          
        } catch (apiError) {
          console.error('Login failed:', apiError)
          
          // Show appropriate error message based on API response
          if (apiError.response?.data?.message) {
            if (apiError.response.data.message === 'User not found') {
              this.error = 'This account does not exist. Please register first.'
            } else if (apiError.response.data.message === 'Invalid password') {
              this.error = 'Incorrect password. Please try again.'
            } else {
              this.error = apiError.response.data.message
            }
          } else if (apiError.message.includes('401') || apiError.message.includes('Unauthorized')) {
            this.error = 'Invalid email or password. Please try again.'
          } else {
            this.error = 'Login failed. Please try again later.'
          }
          
          throw apiError; // Re-throw to prevent further processing
        }
        
        // Navigate to dashboard after successful login
        this.$router.push('/')
        
      } catch (error) {
        this.error = 'Invalid email or password. Please try again.'
        console.error('Login error:', error)
      } finally {
        this.loading = false
      }
    }
  },
  emits: ['login-success']
}
</script>

<style scoped>
.card {
  border: none;
  border-radius: 12px;
  animation: fadeIn 0.5s;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.form-floating > .form-control:focus ~ label,
.form-floating > .form-control:not(:placeholder-shown) ~ label {
  opacity: 0.8;
  transform: scale(0.85) translateY(-0.5rem) translateX(0.15rem);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Adjust for small screens */
@media (max-width: 576px) {
  .vh-100 {
    min-height: 100vh;
    height: auto !important;
    padding: 2rem 1rem;
  }
}

.btn {
  padding: 0.6rem 1rem;
  font-weight: 500;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}
</style>
