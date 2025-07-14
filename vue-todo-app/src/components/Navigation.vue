<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/" aria-label="Todo App">
        <i class="bi bi-list-check me-2" aria-hidden="true"></i>Todo App
      </router-link>
      
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" aria-label="Dashboard">
              <i class="bi bi-house me-1" aria-hidden="true"></i>Dashboard
            </router-link>
          </li>
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link class="nav-link" to="/login" aria-label="Login">
              <i class="bi bi-box-arrow-in-right me-1" aria-hidden="true"></i>Login
            </router-link>
          </li>
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link class="nav-link" to="/register" aria-label="Register">
              <i class="bi bi-person-plus me-1" aria-hidden="true"></i>Register
            </router-link>
          </li>
          <li class="nav-item dropdown" v-if="isAuthenticated">
            <a 
              class="nav-link dropdown-toggle" 
              href="#" 
              id="navbarDropdown" 
              role="button" 
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-person me-1" aria-hidden="true"></i>{{ user?.name || 'User' }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li>
                <router-link class="dropdown-item" to="/profile" aria-label="Profile">
                  <i class="bi bi-person-circle me-2" aria-hidden="true"></i>Profile
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button class="dropdown-item" type="button" @click="logout" aria-label="Logout">
                  <i class="bi bi-box-arrow-right me-2" aria-hidden="true"></i>Logout
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navigation',
  props: {
    isAuthenticated: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: null
    }
  },
  emits: ['logout'],
  methods: {
    logout() {
      this.$emit('logout')
    }
  }
}
</script>

<style scoped>
.navbar {
  border-bottom: 1px solid #eaeaea;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  transition: background-color 0.2s ease;
}

.dropdown-item:active, 
.dropdown-item:focus {
  background-color: #f8f9fa;
  color: #212529;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border-radius: 0.5rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.navbar-brand {
  font-weight: 600;
}
</style>