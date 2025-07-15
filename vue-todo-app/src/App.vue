<template>
  <div>
    <Navigation 
      v-if="!isAuthPage"
      :is-authenticated="isAuthenticated" 
      :user="user"
      @logout="logout"
    />
    
    <router-view 
      v-if="isAuthPage"
      @login-success="handleLoginSuccess" 
      @register-success="handleRegisterSuccess" 
      @profile-updated="handleProfileUpdated"
      @account-deleted="logout"
      :user="user"
    ></router-view>
    
    <div v-else class="container-fluid">
      <div class="row">
        <nav class="col-md-2 d-none d-md-block bg-light sidebar">
          <div class="position-sticky pt-3">
            <ul class="nav flex-column">
              <li class="nav-item">
                <router-link to="/" class="nav-link" active-class="active">
                  <i class="bi bi-house me-2"></i> Dashboard
                </router-link>
              </li>
              <li class="nav-item" v-if="isAuthenticated">
                <router-link to="/profile" class="nav-link" active-class="active">
                  <i class="bi bi-person me-2"></i> Profile
                </router-link>
              </li>
            </ul>
          </div>
        </nav>
        
        <main class="col-md-10 ms-sm-auto px-4">
          <router-view
            @login-success="handleLoginSuccess" 
            @register-success="handleRegisterSuccess" 
            @profile-updated="handleProfileUpdated"
            @account-deleted="logout"
            :user="user"
          ></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * App.vue - Root Component
 * 
 * This is the main application component that:
 * 1. Manages global authentication state
 * 2. Defines the overall layout structure
 * 3. Routes between pages using vue-router
 * 4. Maintains the user session
 */

import Navigation from './components/Navigation.vue'
import { todoAPI, authAPI } from './services/api.js'

export default {
  name: 'App',
  components: {
    Navigation
  },
  data() {
    /**
     * Central application state
     * Contains authentication state and user information
     */
    return {
      isAuthenticated: false,
      authLoading: false,
      user: {
        name: '',
        email: ''
      },
      token: '',
      error: '',
      success: '',
      authPages: ['/login', '/register']
    }
  },
  computed: {
    /**
     * Determine if current route is an authentication page
     */
    isAuthPage() {
      return this.authPages.includes(this.$route.path)
    }
  },
  async mounted() {
    this.checkAuthentication();
  },
  methods: {
    /**
     * Check if user is authenticated from localStorage
     */
    checkAuthentication() {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        this.token = token;
        this.user = JSON.parse(userData);
        this.isAuthenticated = true;
      }
    },

    /**
     * Handle successful login event from Login component
     */
    handleLoginSuccess(userData) {
      this.user = userData;
      this.isAuthenticated = true;
      this.success = 'Successfully logged in!';
    },

    /**
     * Handle successful registration event from Register component
     */
    handleRegisterSuccess(userData) {
      this.user = userData;
      this.isAuthenticated = true;
      this.success = 'Account created successfully!';
    },

    /**
     * Handle profile update event from Profile component
     */
    handleProfileUpdated(userData) {
      this.user = userData;
      this.success = 'Profile updated successfully!';
    },

    /**
     * Log out the current user
     */
    async logout() {
      this.authLoading = true;
      
      try {
        try {
          await authAPI.logout();
        } catch (apiError) {
          console.log('Auth API logout not available yet, using local logout');
        }
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        this.isAuthenticated = false;
        this.user = {
          name: '',
          email: ''
        };
        this.token = '';
        
        this.success = 'You have been logged out.';
        this.authLoading = false;
        
        this.$router.push('/login');
      }
    }
  }
}
</script>

<style>
body {
  background-color: #f8f9fa;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Mobile responsive improvements */
@media (max-width: 576px) {
  .display-4 {
    font-size: 2.5rem;
  }
  
  .lead {
    font-size: 1rem;
  }
  
  .container-fluid {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Tablet and up */
@media (min-width: 768px) {
  .container-fluid {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

/* Large screens - prevent content from being too wide */
@media (min-width: 1400px) {
  .container-fluid {
    max-width: 1400px;
    margin: 0 auto;
  }
}

/* Extra large screens */
@media (min-width: 1920px) {
  .container-fluid {
    max-width: 1600px;
  }
}

/* Ultra-wide screens */
@media (min-width: 2560px) {
  .container-fluid {
    max-width: 1800px;
  }
}

/* Card improvements */
.card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* Button improvements */
.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

/* Form improvements */
.form-control {
  border-radius: 8px;
  border: 1px solid #dee2e6;
  transition: all 0.2s ease;
}

.form-control:focus {
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  border-color: #86b7fe;
}

/* Alert improvements */
.alert {
  border-radius: 10px;
  border: none;
}

/* Main layout */
.row {
  --bs-gutter-x: 1.5rem;
}

/* Two column layout adjustments */
@media (min-width: 992px) {
  .row > .col-lg-5 + .col-lg-6 {
    border-left: 1px solid #dee2e6;
    padding-left: 2rem;
  }
  
  .sticky-lg-top {
    padding-right: 1rem;
  }
}
</style>
