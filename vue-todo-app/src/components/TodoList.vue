<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3>Todo List</h3>
      <div class="btn-group" role="group">
        <input type="radio" class="btn-check" name="filter" id="all" autocomplete="off" 
               v-model="filter" value="all">
        <label class="btn btn-outline-primary" for="all">All ({{ todos.length }})</label>

        <input type="radio" class="btn-check" name="filter" id="pending" autocomplete="off" 
               v-model="filter" value="pending">
        <label class="btn btn-outline-warning" for="pending">Pending ({{ pendingCount }})</label>

        <input type="radio" class="btn-check" name="filter" id="completed" autocomplete="off" 
               v-model="filter" value="completed">
        <label class="btn btn-outline-success" for="completed">Completed ({{ completedCount }})</label>
      </div>
    </div>

    <div v-if="filteredTodos.length === 0" class="text-center py-5">
      <div class="text-muted">
        <h5>No todos {{ filter === 'all' ? '' : filter }} yet!</h5>
        <p>{{ filter === 'all' ? 'Add your first todo above.' : `Switch to "All" to see other todos.` }}</p>
      </div>
    </div>

    <TodoItem 
      v-for="todo in filteredTodos" 
      :key="todo.id"
      :todo="todo"
      @toggle="handleToggle"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />
  </div>
</template>

<script>
import TodoItem from './TodoItem.vue'

export default {
  name: 'TodoList',
  components: {
    TodoItem
  },
  props: {
    todos: {
      type: Array,
      required: true
    }
  },
  emits: ['toggle', 'edit', 'delete'],
  data() {
    return {
      filter: 'all'
    }
  },
  computed: {
    filteredTodos() {
      switch (this.filter) {
        case 'pending':
          return this.todos.filter(todo => !todo.completed)
        case 'completed':
          return this.todos.filter(todo => todo.completed)
        default:
          return this.todos
      }
    },
    pendingCount() {
      return this.todos.filter(todo => !todo.completed).length
    },
    completedCount() {
      return this.todos.filter(todo => todo.completed).length
    }
  },
  methods: {
    handleToggle(id, completed) {
      this.$emit('toggle', id, completed)
    }
  }
}
</script>
