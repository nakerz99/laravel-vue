<template>
  <div class="card mb-4">
    <div class="card-header">
      <h5 class="mb-0">{{ isEditing ? 'Edit Todo' : 'Add New Todo' }}</h5>
    </div>
    <div class="card-body">
      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label for="title" class="form-label">Title *</label>
          <input 
            type="text" 
            class="form-control" 
            id="title"
            v-model="form.title" 
            required
            placeholder="Enter todo title"
          >
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Description</label>
          <textarea 
            class="form-control" 
            id="description"
            v-model="form.description" 
            rows="3"
            placeholder="Enter todo description (optional)"
          ></textarea>
        </div>
        <div class="mb-3">
          <label for="due_date" class="form-label">Due Date</label>
          <input 
            type="date" 
            class="form-control" 
            id="due_date"
            v-model="form.due_date"
            placeholder="Select a due date (optional)"
          >
        </div>
        <div class="d-flex flex-wrap gap-2">
          <button type="submit" class="btn btn-primary">
            {{ isEditing ? 'Update' : 'Add' }} Todo
          </button>
          <button type="button" class="btn btn-secondary" @click="resetForm" v-if="isEditing">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TodoForm',
  props: {
    editingTodo: {
      type: Object,
      default: null
    }
  },
  emits: ['submit', 'cancel'],
  data() {
    return {
      form: {
        title: '',
        description: '',
        completed: false,
        due_date: ''
      }
    }
  },
  computed: {
    isEditing() {
      return this.editingTodo !== null
    }
  },
  watch: {
    editingTodo: {
      handler(newVal) {
        if (newVal) {
          this.form = { ...newVal }
        } else {
          this.resetForm()
        }
      },
      immediate: true
    }
  },
  methods: {
    submitForm() {
      const todoData = {
        title: this.form.title,
        description: this.form.description,
        completed: this.form.completed,
        due_date: this.form.due_date
      }
      
      this.$emit('submit', todoData)
      
      if (!this.isEditing) {
        this.resetForm()
      }
    },
    resetForm() {
      this.form = {
        title: '',
        description: '',
        completed: false,
        due_date: ''
      }
      this.$emit('cancel')
    }
  }
}
</script>
