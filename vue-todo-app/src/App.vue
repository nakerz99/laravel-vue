<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="text-center mb-4">
          <h1 class="display-4 text-primary">Todo App</h1>
          <p class="lead">Manage your tasks efficiently</p>
        </div>

        <!-- Loading Spinner -->
        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Error Alert -->
        <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
          {{ error }}
          <button type="button" class="btn-close" @click="error = ''" aria-label="Close"></button>
        </div>

        <!-- Success Alert -->
        <div v-if="success" class="alert alert-success alert-dismissible fade show" role="alert">
          {{ success }}
          <button type="button" class="btn-close" @click="success = ''" aria-label="Close"></button>
        </div>

        <!-- Todo Form -->
        <TodoForm 
          :editing-todo="editingTodo"
          @submit="handleSubmit"
          @cancel="cancelEdit"
        />

        <!-- Todo List -->
        <TodoList 
          :todos="todos"
          @toggle="toggleTodo"
          @edit="startEdit"
          @delete="deleteTodo"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TodoForm from './components/TodoForm.vue'
import TodoList from './components/TodoList.vue'
import { todoAPI } from './services/api.js'

export default {
  name: 'App',
  components: {
    TodoForm,
    TodoList
  },
  data() {
    return {
      todos: [],
      editingTodo: null,
      loading: false,
      error: '',
      success: ''
    }
  },
  async mounted() {
    await this.loadTodos()
  },
  methods: {
    async loadTodos() {
      this.loading = true
      this.error = ''
      try {
        this.todos = await todoAPI.getTodos()
      } catch (error) {
        this.error = 'Failed to load todos. Please check if the backend is running.'
        console.error('Error loading todos:', error)
      } finally {
        this.loading = false
      }
    },

    async handleSubmit(todoData) {
      this.error = ''
      this.success = ''
      
      try {
        if (this.editingTodo) {
          // Update existing todo
          const updatedTodo = await todoAPI.updateTodo(this.editingTodo.id, todoData)
          const index = this.todos.findIndex(t => t.id === this.editingTodo.id)
          if (index !== -1) {
            this.todos.splice(index, 1, updatedTodo)
          }
          this.success = 'Todo updated successfully!'
          this.editingTodo = null
        } else {
          // Create new todo
          const newTodo = await todoAPI.createTodo(todoData)
          this.todos.unshift(newTodo)
          this.success = 'Todo created successfully!'
        }
      } catch (error) {
        this.error = this.editingTodo ? 'Failed to update todo.' : 'Failed to create todo.'
        console.error('Error submitting todo:', error)
      }
    },

    async toggleTodo(id, completed) {
      this.error = ''
      try {
        const updatedTodo = await todoAPI.toggleTodo(id, completed)
        const index = this.todos.findIndex(t => t.id === id)
        if (index !== -1) {
          this.todos.splice(index, 1, updatedTodo)
        }
        this.success = `Todo marked as ${completed ? 'completed' : 'pending'}!`
      } catch (error) {
        this.error = 'Failed to update todo status.'
        console.error('Error toggling todo:', error)
      }
    },

    startEdit(todo) {
      this.editingTodo = { ...todo }
      this.error = ''
      this.success = ''
    },

    cancelEdit() {
      this.editingTodo = null
    },

    async deleteTodo(id) {
      this.error = ''
      try {
        await todoAPI.deleteTodo(id)
        this.todos = this.todos.filter(t => t.id !== id)
        this.success = 'Todo deleted successfully!'
      } catch (error) {
        this.error = 'Failed to delete todo.'
        console.error('Error deleting todo:', error)
      }
    }
  }
}
</script>

<style>
body {
  background-color: #f8f9fa;
}
</style>
