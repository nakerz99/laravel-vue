// Import CSS styles
import './assets/main.css'                           // Custom application styles
import 'bootstrap/dist/css/bootstrap.min.css'        // Bootstrap 5 CSS framework
import 'bootstrap/dist/js/bootstrap.bundle.min.js'   // Bootstrap 5 JavaScript (includes Popper.js)
import 'bootstrap-icons/font/bootstrap-icons.css'    // Bootstrap Icons library

// Import Vue core functionality
import { createApp } from 'vue'                      // Vue 3 createApp function for initializing the application
import App from './App.vue'                          // Root App component
import router from './router'                        // Vue Router configuration

// Create and mount the Vue application
// 1. Create a new Vue application instance using the App component as the root
// 2. Add the router plugin to enable routing functionality
// 3. Mount the application to the DOM element with id="app" in the index.html
createApp(App).use(router).mount('#app')
