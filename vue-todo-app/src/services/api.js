import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

export const todoAPI = {
  // Get all todos
  async getTodos() {
    const response = await api.get('/todos')
    return response.data
  },

  // Create a new todo
  async createTodo(todo) {
    const response = await api.post('/todos', todo)
    return response.data
  },

  // Update a todo
  async updateTodo(id, todo) {
    const response = await api.put(`/todos/${id}`, todo)
    return response.data
  },

  // Delete a todo
  async deleteTodo(id) {
    await api.delete(`/todos/${id}`)
  },

  // Toggle todo completion
  async toggleTodo(id, completed) {
    const response = await api.put(`/todos/${id}`, { completed })
    return response.data
  }
}
