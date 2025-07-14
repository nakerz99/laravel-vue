<template>
  <div class="d-flex vh-100 justify-content-center align-items-center">
    <div class="card p-4 shadow-sm" style="max-width:360px; width:100%">
      <div class="text-center mb-4">
        <h4 class="mb-0">
          <i class="fas fa-user-plus me-2" aria-hidden="true"></i>Create Account
        </h4>
      </div>
      
      <!-- Error Alert -->
      <div v-if="error" class="alert alert-danger alert-dismissible fade show mb-3" role="alert">
        {{ error }}
        <button type="button" class="btn-close" @click="error = ''" aria-label="Close"></button>
      </div>

      <form @submit.prevent="handleRegister">
        <div class="form-floating mb-3">
          <input 
            type="text" 
            class="form-control" 
            id="name"
            v-model="form.name" 
            required
            placeholder="Full Name"
            aria-label="Full Name"
          >
          <label for="name">Full Name</label>
        </div>

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
            minlength="8"
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
        <div class="form-text mb-3">Password must be at least 8 characters long.</div>

        <div class="form-floating mb-3 position-relative">
          <input 
            :type="showConfirmPassword ? 'text' : 'password'" 
            class="form-control" 
            id="password_confirmation"
            v-model="form.password_confirmation" 
            required
            placeholder="Confirm Password"
            aria-label="Confirm Password"
          >
          <label for="password_confirmation">Confirm Password</label>
          <button 
            type="button" 
            class="btn btn-sm position-absolute"
            style="top: 0.75rem; right: 0.75rem"
            @click="showConfirmPassword = !showConfirmPassword"
            aria-label="Toggle password visibility"
          >
            <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" aria-hidden="true"></i>
          </button>
        </div>
        <div v-if="form.password !== form.password_confirmation && form.password_confirmation" class="form-text text-danger mb-3">
          Passwords do not match.
        </div>

        <div class="form-check mb-3">
          <input 
            type="checkbox" 
            class="form-check-input" 
            id="terms"
            v-model="form.acceptTerms"
            required
            aria-label="Accept Terms and Conditions"
          >
          <label class="form-check-label" for="terms">
            I agree to the <a href="#" class="text-decoration-none">Terms and Conditions</a>
          </label>
        </div>

        <button 
          type="submit" 
          class="btn btn-primary w-100 mb-2"
          :disabled="loading || !isFormValid"
          aria-label="Create Account"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          <i v-else class="fas fa-user-plus me-2" aria-hidden="true"></i>
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>

      <hr class="my-4">
      
      <p class="text-center mb-0">
        Already have an account?
        <router-link to="/login" class="link-primary">
          Sign In
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        acceptTerms: false
      },
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      error: ''
    }
  },
  computed: {
    isFormValid() {
      return (
        this.form.name &&
        this.form.email &&
        this.form.password &&
        this.form.password === this.form.password_confirmation &&
        this.form.acceptTerms &&
        this.form.password.length >= 8
      )
    }
  },
  methods: {
    async handleRegister() {
      if (!this.isFormValid) {
        this.error = 'Please fill all fields correctly.'
        return
      }

      this.loading = true
      this.error = ''
      
      try {
        const userData = {
          name: this.form.name,
          email: this.form.email,
          password: this.form.password,
          password_confirmation: this.form.password_confirmation
        }
        
        // Try to use real API if backend auth is implemented
        try {
          // Real API registration
          const { authAPI } = await import('../services/api.js')
          const response = await authAPI.register(userData)
          
          // Store token and user data in localStorage
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
          
          this.$emit('register-success', response.user)
          
        } catch (apiError) {
          console.error('Registration failed:', apiError)
          
          // Check for specific error types
          if (apiError.message.includes('422') || apiError.response?.data?.errors) {
            // Validation errors
            const errors = apiError.response?.data?.errors;
            if (errors) {
              if (errors.email) {
                this.error = errors.email[0]; // Usually "email already taken"
              } else if (errors.password) {
                this.error = errors.password[0]; // Password validation error
              } else {
                this.error = 'Please check your form input and try again.';
              }
            } else {
              this.error = 'Validation failed. Please check your information.';
            }
          } else {
            this.error = 'Registration failed. Please try again later.';
          }
          
          throw apiError; // Re-throw to prevent further processing
        }
        
        // Navigate to dashboard after successful registration
        this.$router.push('/')
        
      } catch (error) {
        this.error = 'Registration failed. Please try again.'
        console.error('Registration error:', error)
      } finally {
        this.loading = false
      }
    }
  },
  emits: ['register-success']
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
</style>
