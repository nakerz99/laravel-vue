/**
 * API Service Module
 * 
 * This module encapsulates all API calls to the backend server.
 * It provides two main services:
 * 1. todoAPI - for todo CRUD operations
 * 2. authAPI - for authentication operations
 */

import axios from 'axios'  // Import axios for HTTP requests

/**
 * Base URL for the backend API
 * In a real production environment, this would typically come from environment variables
 */
const API_BASE_URL = 'http://127.0.0.1:8000/api'

/**
 * Create a configured axios instance
 * This instance is pre-configured with:
 * - Base URL for all requests
 * - Default headers for JSON communication
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',  // Send requests as JSON
    'Accept': 'application/json'         // Expect JSON responses
  }
})

/**
 * Request Interceptor
 * 
 * Automatically adds the authentication token to all outgoing requests if available.
 * This ensures authenticated API calls without manually specifying the token each time.
 */
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')  // Get token from localStorage
  if (token) {
    // Add Authorization header with Bearer token
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Todo API Service
 * 
 * Provides methods for interacting with the todo endpoints of the backend API.
 * Handles CRUD operations for todo items.
 */
export const todoAPI = {
  /**
   * Get all todos for the authenticated user
   * @returns {Promise<Array>} List of todo items
   */
  async getTodos() {
    const response = await api.get('/todos')  // GET request to /todos endpoint
    return response.data                       // Return the response data
  },

  /**
   * Create a new todo
   * @param {Object} todo - Todo object with title and optional description
   * @returns {Promise<Object>} Created todo with server-generated ID
   */
  async createTodo(todo) {
    const response = await api.post('/todos', todo)  // POST request with todo data
    return response.data                             // Return the created todo
  },

  /**
   * Update an existing todo
   * @param {Number} id - ID of the todo to update
   * @param {Object} todo - Updated todo data
   * @returns {Promise<Object>} Updated todo from server
   */
  async updateTodo(id, todo) {
    const response = await api.put(`/todos/${id}`, todo)  // PUT request with updated data
    return response.data                                  // Return the updated todo
  },

  /**
   * Delete a todo
   * @param {Number} id - ID of the todo to delete
   * @returns {Promise<void>} No return value on success
   */
  async deleteTodo(id) {
    await api.delete(`/todos/${id}`)  // DELETE request to remove todo
  },

  /**
   * Toggle the completed status of a todo
   * @param {Number} id - ID of the todo to toggle
   * @param {Boolean} completed - New completed status
   * @returns {Promise<Object>} Updated todo from server
   */
  async toggleTodo(id, completed) {
    const response = await api.put(`/todos/${id}`, { completed })  // PUT request with just the completed status
    return response.data                                           // Return the updated todo
  }
}

/**
 * Authentication API Service
 * 
 * Provides methods for user authentication, registration, and profile management.
 * Communicates with the Laravel Sanctum authentication endpoints.
 */
export const authAPI = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data (name, email, password)
   * @returns {Promise<Object>} User data and authentication token
   * @throws {Error} On registration failure with descriptive message
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)  // POST to register endpoint
      return response.data  // Return user data and token on success
    } catch (error) {
      // Format error message from server response or use default
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  },

  /**
   * Login an existing user
   * @param {Object} credentials - Login credentials (email, password)
   * @returns {Promise<Object>} User data and authentication token
   * @throws {Error} On login failure with descriptive message
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)  // POST to login endpoint
      return response.data  // Return user data and token on success
    } catch (error) {
      // Pass through the entire error object so components can access detailed error data
      error.message = error.response?.data?.message || 'Login failed'
      throw error
    }
  },

  /**
   * Get current user data
   * @returns {Promise<Object>} Current authenticated user data
   * @throws {Error} If not authenticated or API failure
   */
  async getUser() {
    try {
      const response = await api.get('/auth/user')  // GET authenticated user data
      return response.data  // Return user profile data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user data')
    }
  },

  /**
   * Update user profile
   * @param {Object} userData - Updated user data (name, email)
   * @returns {Promise<Object>} Updated user profile
   * @throws {Error} On update failure with descriptive message
   */
  async updateProfile(userData) {
    try {
      const response = await api.put('/auth/user', userData)  // PUT updated user data
      return response.data  // Return updated profile
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile')
    }
  },

  /**
   * Logout the current user
   * @returns {Promise<void>} No return value on success
   * 
   * Note: Errors are logged but not propagated to caller because local logout
   * should proceed even if the API logout fails
   */
  async logout() {
    try {
      await api.post('/auth/logout')  // POST to logout endpoint (invalidates token on server)
    } catch (error) {
      console.error('Logout error:', error)
      // Continue with local logout even if API call fails
      // This ensures user can still logout locally if server is unreachable
    }
  }
}
