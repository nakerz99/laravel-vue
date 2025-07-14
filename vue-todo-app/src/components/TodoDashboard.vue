<template>
  <!-- Dashboard header -->
  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">
      <i class="bi bi-list-check me-2" aria-hidden="true"></i>Todo Dashboard
    </h1>
    <div class="btn-toolbar mb-2 mb-md-0">
      <button 
        type="button" 
        class="btn btn-sm btn-outline-secondary" 
        @click="fetchTodos"
        aria-label="Refresh todos"
      >
        <i class="bi bi-arrow-clockwise me-1" aria-hidden="true"></i>
        Refresh
      </button>
    </div>
  </div>

  <!-- Loading Spinner -->
  <div v-if="loading" class="text-center py-3">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <!-- Error Alert -->
  <div
    v-if="error"
    class="alert alert-danger alert-dismissible fade show"
    role="alert"
  >
    {{ error }}
    <button
      type="button"
      class="btn-close"
      @click="error = ''"
      aria-label="Close"
    ></button>
  </div>

  <!-- Success Alert -->
  <div
    v-if="success"
    class="alert alert-success alert-dismissible fade show"
    role="alert"
  >
    {{ success }}
    <button
      type="button"
      class="btn-close"
      @click="success = ''"
      aria-label="Close"
    ></button>
  </div>

  <!-- Dashboard Layout -->
  <div class="row">
    <!-- Todo Form Column -->
    <div class="col-md-4 mb-4">
      <div class="sticky-top" style="top: 20px;">
        <TodoForm
          :editing-todo="editingTodo"
          @submit="handleSubmit"
          @cancel="cancelEdit"
        />
        
        <!-- Statistics Card -->
        <div class="card mt-4">
          <div class="card-header bg-light">
            <h6 class="mb-0">
              <i class="bi bi-pie-chart me-2" aria-hidden="true"></i>Statistics
            </h6>
          </div>
          <div class="card-body">
            <div class="row text-center">
              <div class="col-4">
                <div class="stat-item">
                  <i class="bi bi-list text-primary" aria-hidden="true"></i>
                  <div class="stat-number">{{ totalTodos }}</div>
                  <div class="stat-label">Total</div>
                </div>
              </div>
              <div class="col-4">
                <div class="stat-item">
                  <i class="bi bi-hourglass-split text-warning" aria-hidden="true"></i>
                  <div class="stat-number">{{ pendingTodos }}</div>
                  <div class="stat-label">Pending</div>
                </div>
              </div>
              <div class="col-4">
                <div class="stat-item">
                  <i class="bi bi-check-circle text-success" aria-hidden="true"></i>
                  <div class="stat-number">{{ completedTodos }}</div>
                  <div class="stat-label">Done</div>
                </div>
              </div>
            </div>
            
            <!-- Progress Bar -->
            <div class="mt-3">
              <div class="d-flex justify-content-between mb-1">
                <span class="small">Progress</span>
                <span class="small">{{ completionPercentage }}%</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div 
                  class="progress-bar bg-success" 
                  role="progressbar" 
                  :style="{ width: completionPercentage + '%' }"
                  :aria-valuenow="completionPercentage" 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Todo List Column -->
    <div class="col-md-8">
      <TodoList
        :todos="todos"
        @toggle="toggleTodo"
        @edit="startEdit"
        @delete="deleteTodo"
      />
    </div>
  </div>
</template>

<script>
/**
 * TodoDashboard Component
 * 
 * Main dashboard for the todo application.
 * Combines the todo form, todo list, and statistics in a responsive layout.
 * Manages the state and CRUD operations for todo items.
 */

// Import child components and API service
import TodoForm from './TodoForm.vue'       // Component for creating/editing todos
import TodoList from './TodoList.vue'       // Component for displaying the todo list
import { todoAPI } from '../services/api.js' // API service for todo operations

export default {
  name: 'TodoDashboard',
  
  // Register child components
  components: {
    TodoForm,  // Form for creating and editing todos
    TodoList   // List display for todos
  },
  
  /**
   * Props received from parent
   * Even though we might not directly use all of these props,
   * we need to declare them to avoid Vue warnings since App.vue passes them
   */
  props: {
    user: {
      type: Object,
      default: null  // User data from authentication
    }
  },
  
  /**
   * Events that this component might emit
   * These are declared for documentation purposes and to avoid Vue warnings
   * Even though this component might not actually emit these events,
   * parent components are listening for them
   */
  emits: ['login-success', 'register-success', 'profile-updated', 'account-deleted'],
  
  /**
   * Component local state
   * @returns {Object} Component data
   */
  data() {
    return {
      todos: [],            // Array of todo items from the API
      editingTodo: null,    // Currently editing todo (null when creating new)
      loading: false,       // Loading state for API operations
      error: '',            // Error message to display
      success: ''           // Success message to display
    }
  },
  
  /**
   * Computed properties for statistics
   * These automatically update when the todos array changes
   */
  computed: {
    /**
     * Total number of todos
     * @returns {Number} Total count of todos
     */
    totalTodos() {
      return this.todos.length
    },
    
    /**
     * Number of pending (incomplete) todos
     * @returns {Number} Count of incomplete todos
     */
    pendingTodos() {
      return this.todos.filter(todo => !todo.completed).length
    },
    
    /**
     * Number of completed todos
     * @returns {Number} Count of completed todos
     */
    completedTodos() {
      return this.todos.filter(todo => todo.completed).length
    },
    
    /**
     * Completion percentage for progress bar
     * @returns {Number} Percentage of completed todos (0-100)
     */
    completionPercentage() {
      if (this.totalTodos === 0) return 0 // Avoid division by zero
      return Math.round((this.completedTodos / this.totalTodos) * 100)
    }
  },
  
  /**
   * Lifecycle hook: When component is mounted to the DOM
   * Load todos from the API when the component is first displayed
   */
  async mounted() {
    await this.loadTodos() // Load todos when the component mounts
  },
  /**
   * Component methods
   * These methods handle all the user interactions and API operations
   */
  methods: {
    /**
     * Load todos from the API
     * Called on component mount and refresh button click
     */
    async loadTodos() {
      this.loading = true  // Set loading state
      this.error = ''      // Clear any previous errors
      
      try {
        // Fetch todos from the API
        this.todos = await todoAPI.getTodos()
      } catch (error) {
        // Handle API error
        this.error = 'Failed to load todos. Please check if the backend is running.'
        console.error('Error loading todos:', error)
      } finally {
        // Always stop loading state regardless of success/failure
        this.loading = false
      }
    },

    /**
     * Handle form submission for creating or updating a todo
     * @param {Object} todoData - Form data with title and description
     */
    async handleSubmit(todoData) {
      // Clear messages
      this.error = ''
      this.success = ''

      try {
        if (this.editingTodo) {
          // UPDATE FLOW: Updating an existing todo
          
          // 1. Send update to API
          const updatedTodo = await todoAPI.updateTodo(this.editingTodo.id, todoData)
          
          // 2. Find and replace the todo in the local array
          const index = this.todos.findIndex(t => t.id === this.editingTodo.id)
          if (index !== -1) {
            this.todos.splice(index, 1, updatedTodo) // Replace with updated version
          }
          
          // 3. Show success and exit edit mode
          this.success = 'Todo updated successfully!'
          this.editingTodo = null
        } else {
          // CREATE FLOW: Creating a new todo
          
          // 1. Send new todo to API
          const newTodo = await todoAPI.createTodo(todoData)
          
          // 2. Add the new todo to the beginning of the array
          this.todos.unshift(newTodo)
          
          // 3. Show success message
          this.success = 'Todo created successfully!'
        }
      } catch (error) {
        // Display appropriate error message based on operation
        this.error = this.editingTodo
          ? 'Failed to update todo.'
          : 'Failed to create todo.'
        console.error('Error submitting todo:', error)
      }
    },

    /**
     * Toggle the completed status of a todo
     * @param {Number} id - ID of the todo to toggle
     * @param {Boolean} completed - New completed status
     */
    async toggleTodo(id, completed) {
      this.error = ''
      
      try {
        // 1. Send toggle status to API
        const updatedTodo = await todoAPI.toggleTodo(id, completed)
        
        // 2. Find and update the todo in the local array
        const index = this.todos.findIndex(t => t.id === id)
        if (index !== -1) {
          this.todos.splice(index, 1, updatedTodo) // Replace with updated version
        }
        
        // 3. Show success message with appropriate text
        this.success = `Todo marked as ${completed ? 'completed' : 'pending'}!`
      } catch (error) {
        // Handle API error
        this.error = 'Failed to update todo status.'
        console.error('Error toggling todo:', error)
      }
    },

    /**
     * Start editing a todo
     * @param {Object} todo - Todo item to edit
     */
    startEdit(todo) {
      // 1. Create a copy of the todo to prevent direct mutation
      this.editingTodo = { ...todo }
      
      // 2. Clear any messages
      this.error = ''
      this.success = ''
      
      // 3. On mobile devices, scroll to the form for better UX
      if (window.innerWidth < 992) {
        document.querySelector('.col-lg-4').scrollIntoView({ 
          behavior: 'smooth',  // Smooth scrolling
          block: 'start'       // Align to the top
        })
      }
    },

    /**
     * Cancel editing and return to create mode
     */
    cancelEdit() {
      this.editingTodo = null  // Clear editing state
    },

    /**
     * Delete a todo
     * @param {Number} id - ID of the todo to delete
     */
    async deleteTodo(id) {
      this.error = ''
      
      try {
        // 1. Send delete request to API
        await todoAPI.deleteTodo(id)
        
        // 2. Remove the todo from the local array
        this.todos = this.todos.filter(t => t.id !== id)
        
        // 3. Show success message
        this.success = 'Todo deleted successfully!'
      } catch (error) {
        // Handle API error
        this.error = 'Failed to delete todo.'
        console.error('Error deleting todo:', error)
      }
    }
  }
}
</script>

<style scoped>
.stat-item {
  padding: 0.5rem 0;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.25rem 0;
}

.stat-label {
  font-size: 0.75rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.progress {
  border-radius: 10px;
}

.progress-bar {
  border-radius: 10px;
}

@media (max-width: 991.98px) {
  .sticky-top {
    position: relative !important;
    top: auto !important;
  }
}

/* Better spacing for wide screens */
@media (min-width: 1400px) {
  .container-fluid {
    max-width: 1400px;
  }
}
</style>
