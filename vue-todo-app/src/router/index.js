// Import Vue Router functions
import { createRouter, createWebHistory } from 'vue-router'

// Import page components
import TodoDashboard from '../components/TodoDashboard.vue'  // Main dashboard component for todos
import Login from '../components/Login.vue'                  // User login page
import Register from '../components/Register.vue'            // User registration page
import Profile from '../components/Profile.vue'              // User profile page

/**
 * Define application routes
 * Each route maps a URL path to a component
 * Meta fields provide additional information for navigation guards
 */
const routes = [
  {
    path: '/',                          // Root path
    name: 'Dashboard',                  // Route name for programmatic navigation
    component: TodoDashboard,           // Component to render
    meta: { requiresAuth: true }        // This route requires authentication
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }       // Only guests (non-authenticated users) can access this route
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }       // Only guests can access this route
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }        // This route requires authentication
  },
  {
    // Catch-all route - redirects any unmatched paths to dashboard
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

/**
 * Create router instance
 * @param {Object} options - Router configuration options
 * @param {History} options.history - History mode (web history provides clean URLs without hash)
 * @param {Array} options.routes - Array of route definitions
 * @param {Function} options.scrollBehavior - Controls scroll position after navigation
 */
const router = createRouter({
  history: createWebHistory(),          // Use HTML5 history mode for cleaner URLs
  routes,                               // Our defined routes
  scrollBehavior(to, from, savedPosition) {
    // If user navigated back/forward and has a saved position, restore it
    if (savedPosition) {
      return savedPosition
    } else {
      // Otherwise scroll to top when navigating to a new page
      return { top: 0 }
    }
  }
})

/**
 * Navigation guards
 * Run before each route navigation to protect routes and handle redirects
 * 
 * @param {Route} to - Target route being navigated to
 * @param {Route} from - Current route being navigated from
 * @param {Function} next - Function to resolve the navigation
 */
router.beforeEach((to, from, next) => {
  // Check if user is authenticated by looking for token in localStorage
  const isAuthenticated = !!localStorage.getItem('token')
  
  // Route protection logic
  if (to.meta.requiresAuth && !isAuthenticated) {
    // If route requires authentication but user is not logged in, redirect to login
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    // If route is for guests only but user is logged in, redirect to dashboard
    next('/')
  } else {
    // Otherwise allow navigation to proceed
    next()
  }
})

export default router
