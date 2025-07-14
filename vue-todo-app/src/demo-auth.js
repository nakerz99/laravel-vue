/**
 * Demo Authentication Flow
 * 
 * This file shows example code for integrating with the Laravel backend authentication endpoints.
 * The code in App.vue already includes most of these concepts, but this provides standalone examples.
 */

// Using the authAPI service from our api.js file
import { authAPI } from './services/api.js';

/**
 * Example: User Registration
 */
async function registerUser() {
  try {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'SecurePassword123!', 
      password_confirmation: 'SecurePassword123!'
    };
    
    // Call the register API
    const response = await authAPI.register(userData);
    
    // Store authentication data in localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    console.log('Registration successful');
    return response;
  } catch (error) {
    console.error('Registration failed:', error.message);
    throw error;
  }
}

/**
 * Example: User Login
 */
async function loginUser() {
  try {
    const credentials = {
      email: 'john.doe@example.com',
      password: 'SecurePassword123!'
    };
    
    // Call the login API
    const response = await authAPI.login(credentials);
    
    // Store authentication data in localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    console.log('Login successful');
    return response;
  } catch (error) {
    console.error('Login failed:', error.message);
    throw error;
  }
}

/**
 * Example: Get Current User
 */
async function getCurrentUser() {
  try {
    // Get the user data from the API
    const userData = await authAPI.getUser();
    
    console.log('User data retrieved:', userData);
    return userData;
  } catch (error) {
    console.error('Failed to get user data:', error.message);
    throw error;
  }
}

/**
 * Example: Update User Profile
 */
async function updateUserProfile() {
  try {
    const updatedData = {
      name: 'John Updated',
      email: 'john.updated@example.com'
    };
    
    // Update the user profile
    const response = await authAPI.updateProfile(updatedData);
    
    // Update stored user data
    localStorage.setItem('user', JSON.stringify(response.user));
    
    console.log('Profile updated successfully');
    return response;
  } catch (error) {
    console.error('Failed to update profile:', error.message);
    throw error;
  }
}

/**
 * Example: User Logout
 */
async function logoutUser() {
  try {
    // Call the logout API
    await authAPI.logout();
    
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    console.log('Logout successful');
  } catch (error) {
    console.error('Logout failed:', error.message);
    
    // Even if server-side logout fails, clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

/**
 * Example: Check if User is Authenticated
 */
function isAuthenticated() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  return !!token && !!user;
}

export {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
  logoutUser,
  isAuthenticated
};
