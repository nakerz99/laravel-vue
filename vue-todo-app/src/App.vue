<template>
  <div>
    <!-- 
      NAVIGATION BAR
      - Only shown on regular pages (not login/register)
      - Passes authentication state and user data as props
      - Listens for logout event from Navigation component
    -->
    <Navigation 
      v-if="!isAuthPage"
      :is-authenticated="isAuthenticated" 
      :user="user"
      @logout="logout"
    />
    
    <!-- 
      AUTHENTICATION PAGES (Login/Register)
      - Simple layout without sidebar for auth pages
      - Renders the appropriate component via router-view
      - Listens for various authentication events from child components
      - Passes user data to components that need it
    -->
    <router-view 
      v-if="isAuthPage"
      @login-success="handleLoginSuccess" 
      @register-success="handleRegisterSuccess" 
      @profile-updated="handleProfileUpdated"
      @account-deleted="logout"
      :user="user"
    ></router-view>
    
    <!-- 
      MAIN APPLICATION LAYOUT
      - Two-column layout for authenticated pages
      - Includes sidebar navigation and main content area
      - Responsive: sidebar hides on small screens (mobile)
    -->
    <div v-else class="container-fluid">
      <div class="row">
        <!-- 
          SIDEBAR NAVIGATION
          - Left side navigation menu
          - Only visible on medium screens and larger (d-none d-md-block)
          - Sticky positioning keeps it visible when scrolling
        -->
        <nav class="col-md-2 d-none d-md-block bg-light sidebar">
          <div class="position-sticky pt-3">
            <ul class="nav flex-column">
              <!-- Dashboard link - always visible -->
              <li class="nav-item">
                <router-link to="/" class="nav-link" active-class="active">
                  <i class="bi bi-house me-2"></i> Dashboard
                </router-link>
              </li>
              <!-- Profile link - only visible when authenticated -->
              <li class="nav-item" v-if="isAuthenticated">
                <router-link to="/profile" class="nav-link" active-class="active">
                  <i class="bi bi-person me-2"></i> Profile
                </router-link>
              </li>
            </ul>
          </div>
        </nav>
        
        <!-- 
          MAIN CONTENT AREA
          - Right side content area that takes 10/12 columns on medium+ screens
          - Automatically shifts when sidebar is hidden on small screens
          - Contains the router-view which displays the current route's component
        -->
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

// Import components and services
import Navigation from './components/Navigation.vue'   // Navigation bar component
import { todoAPI, authAPI } from './services/api.js'   // API service for backend communication

export default {
  name: 'App',
  components: {
    Navigation  // Register the Navigation component for use in the template
  },
  data() {
    /**
     * Central application state
     * Contains authentication state and user information
     * @returns {Object} Application data state
     */
    return {
      // Authentication state
      isAuthenticated: false,               // Whether user is logged in
      authLoading: false,                   // Loading state for auth operations
      user: {                               // Current user data
        name: '',
        email: ''
      },
      token: '',                            // Authentication token
      error: '',                            // Error message for display
      success: '',                          // Success message for display
      // Layout configuration
      authPages: ['/login', '/register']    // Routes that use authentication layout
    }
  },
  computed: {
    /**
     * Determine if current route is an authentication page
     * Used to apply different layouts for login/register vs. main app
     * @returns {Boolean} True if current route is login or register
     */
    isAuthPage() {
      return this.authPages.includes(this.$route.path)
    }
  },
  async mounted() {
    /**
     * When component mounts:
     * 1. Check if user is already authenticated (from localStorage)
     * 2. Restore session if token exists
     */
    this.checkAuthentication();
  },
  methods: {
    /**
     * Check if user is authenticated from localStorage
     * Restores user session if valid token is found
     */
    checkAuthentication() {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        // If we have a token and user data, restore the session
        this.token = token;
        this.user = JSON.parse(userData);
        this.isAuthenticated = true;
      }
    },

    /**
     * Handle successful login event from Login component
     * @param {Object} userData - User data from successful login
     */
    handleLoginSuccess(userData) {
      this.user = userData;                       // Store user data
      this.isAuthenticated = true;                // Update authentication state
      this.success = 'Successfully logged in!';   // Set success message
    },

    /**
     * Handle successful registration event from Register component
     * @param {Object} userData - User data from successful registration
     */
    handleRegisterSuccess(userData) {
      this.user = userData;                        // Store user data
      this.isAuthenticated = true;                 // Update authentication state
      this.success = 'Account created successfully!'; // Set success message
    },

    /**
     * Handle profile update event from Profile component
     * @param {Object} userData - Updated user data
     */
    handleProfileUpdated(userData) {
      this.user = userData;                          // Update user data
      this.success = 'Profile updated successfully!'; // Set success message
    },

    /**
     * Log out the current user
     * 1. Call backend logout API if available
     * 2. Clear local storage and session data
     * 3. Reset application state
     * 4. Redirect to login page
     */
    async logout() {
      this.authLoading = true;  // Start loading state
      
      try {
        // Try to call the backend logout endpoint
        try {
          await authAPI.logout();  // Call backend API to invalidate token
        } catch (apiError) {
          console.log('Auth API logout not available yet, using local logout');
          // Continue with local logout even if API call fails
        }
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Always perform these cleanup steps regardless of API success/failure
        
        // Clear authentication data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Reset application state
        this.isAuthenticated = false;
        this.user = {
          name: '',
          email: ''
        };
        this.token = '';
        
        // Set success message and finish loading state
        this.success = 'You have been logged out.';
        this.authLoading = false;
        
        // Redirect to login page
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
