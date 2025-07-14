<template>
  <div class="card mb-3">
    <div class="card-body">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-start">
        <div class="flex-grow-1 mb-3 mb-md-0">
          <h5 class="card-title" :class="{ 'text-decoration-line-through text-muted': todo.completed }">
            {{ todo.title }}
          </h5>
          <p class="card-text" :class="{ 'text-muted': todo.completed }" v-if="todo.description">
            {{ todo.description }}
          </p>
          <small class="text-muted">
            Created: {{ formatDate(todo.created_at) }}
          </small>
        </div>
        <div class="d-flex flex-wrap gap-2 align-self-md-start">
          <button 
            @click="toggleComplete" 
            class="btn btn-sm"
            :class="todo.completed ? 'btn-warning' : 'btn-success'"
          >
            {{ todo.completed ? 'Undo' : 'Complete' }}
          </button>
          <button @click="editTodo" class="btn btn-sm btn-outline-primary">
            Edit
          </button>
          <button @click="deleteTodo" class="btn btn-sm btn-outline-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TodoItem',
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  emits: ['toggle', 'edit', 'delete'],
  methods: {
    toggleComplete() {
      this.$emit('toggle', this.todo.id, !this.todo.completed)
    },
    editTodo() {
      this.$emit('edit', this.todo)
    },
    deleteTodo() {
      if (confirm('Are you sure you want to delete this todo?')) {
        this.$emit('delete', this.todo.id)
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString()
    }
  }
}
</script>
