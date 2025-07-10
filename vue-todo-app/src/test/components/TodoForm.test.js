import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoForm from '@/components/TodoForm.vue'

describe('TodoForm.vue', () => {
  it('renders form with correct initial state', () => {
    const wrapper = mount(TodoForm)

    expect(wrapper.find('h5').text()).toBe('Add New Todo')
    expect(wrapper.find('input[type="text"]').element.value).toBe('')
    expect(wrapper.find('textarea').element.value).toBe('')
    expect(wrapper.find('button[type="submit"]').text()).toBe('Add Todo')
  })

  it('renders form in edit mode when editingTodo prop is provided', () => {
    const editingTodo = {
      id: 1,
      title: 'Edit Todo',
      description: 'Edit description'
    }

    const wrapper = mount(TodoForm, {
      props: { editingTodo }
    })

    expect(wrapper.find('h5').text()).toBe('Edit Todo')
    expect(wrapper.find('input[type="text"]').element.value).toBe('Edit Todo')
    expect(wrapper.find('textarea').element.value).toBe('Edit description')
    expect(wrapper.find('button[type="submit"]').text()).toBe('Update Todo')
  })

  it('updates form data when user types', async () => {
    const wrapper = mount(TodoForm)

    const titleInput = wrapper.find('input[type="text"]')
    const descriptionTextarea = wrapper.find('textarea')

    await titleInput.setValue('New Todo Title')
    await descriptionTextarea.setValue('New Todo Description')

    expect(titleInput.element.value).toBe('New Todo Title')
    expect(descriptionTextarea.element.value).toBe('New Todo Description')
  })

  it('emits submit event with form data when submitted', async () => {
    const wrapper = mount(TodoForm)

    await wrapper.find('input[type="text"]').setValue('Test Todo')
    await wrapper.find('textarea').setValue('Test Description')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')[0]).toEqual([{
      title: 'Test Todo',
      description: 'Test Description',
      completed: false
    }])
  })

  it('emits submit event when updating existing todo', async () => {
    const editingTodo = {
      id: 1,
      title: 'Original Title',
      description: 'Original Description',
      completed: false
    }

    const wrapper = mount(TodoForm, {
      props: { editingTodo }
    })

    await wrapper.find('input[type="text"]').setValue('Updated Title')
    await wrapper.find('textarea').setValue('Updated Description')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toBeTruthy()
    // The component only emits the form data, not the id
    expect(wrapper.emitted('submit')[0]).toEqual([{
      title: 'Updated Title',
      description: 'Updated Description',
      completed: false
    }])
  })

  it('emits submit even when title is empty (component behavior)', async () => {
    const wrapper = mount(TodoForm)

    // Component allows empty title submission
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')[0]).toEqual([{
      title: '',
      description: '',
      completed: false
    }])
  })

  it('resets form after successful submission', async () => {
    const wrapper = mount(TodoForm)

    await wrapper.find('input[type="text"]').setValue('Test Todo')
    await wrapper.find('textarea').setValue('Test Description')
    await wrapper.find('form').trigger('submit.prevent')

    // Form should be reset after submission
    expect(wrapper.find('input[type="text"]').element.value).toBe('')
    expect(wrapper.find('textarea').element.value).toBe('')
  })

  it('emits cancel event when cancel button is clicked', async () => {
    const editingTodo = {
      id: 1,
      title: 'Edit Todo',
      description: 'Edit description'
    }

    const wrapper = mount(TodoForm, {
      props: { editingTodo }
    })

    await wrapper.find('.btn-secondary').trigger('click')

    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('handles missing description in editing todo', () => {
    const editingTodo = {
      id: 1,
      title: 'Edit Todo',
      description: null
    }

    const wrapper = mount(TodoForm, {
      props: { editingTodo }
    })

    expect(wrapper.find('textarea').element.value).toBe('')
  })

  it('shows cancel button only in edit mode', () => {
    const wrapper = mount(TodoForm)
    expect(wrapper.find('.btn-secondary').exists()).toBe(false)

    const editingTodo = { id: 1, title: 'Edit Todo' }
    const editWrapper = mount(TodoForm, {
      props: { editingTodo }
    })
    expect(editWrapper.find('.btn-secondary').exists()).toBe(true)
  })

  it('updates form when editingTodo prop changes', async () => {
    const wrapper = mount(TodoForm)
    
    expect(wrapper.find('input[type="text"]').element.value).toBe('')
    
    await wrapper.setProps({
      editingTodo: { id: 1, title: 'New Title', description: 'New Description' }
    })
    
    expect(wrapper.find('input[type="text"]').element.value).toBe('New Title')
    expect(wrapper.find('textarea').element.value).toBe('New Description')
  })
})
