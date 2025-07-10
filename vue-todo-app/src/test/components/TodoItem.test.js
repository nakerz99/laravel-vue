import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoItem from '@/components/TodoItem.vue'

describe('TodoItem.vue', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    description: 'Test description',
    completed: false,
    created_at: '2025-01-01T00:00:00.000000Z',
    updated_at: '2025-01-01T00:00:00.000000Z'
  }

  const mockCompletedTodo = {
    ...mockTodo,
    id: 2,
    completed: true
  }

  it('renders todo item correctly', () => {
    const wrapper = mount(TodoItem, {
      props: { todo: mockTodo }
    })

    expect(wrapper.find('.card-title').text()).toBe('Test Todo')
    expect(wrapper.find('.card-text').text()).toBe('Test description')
    expect(wrapper.find('.btn-success').text()).toBe('Complete')
  })

  it('renders completed todo with correct styling', () => {
    const wrapper = mount(TodoItem, {
      props: { todo: mockCompletedTodo }
    })

    expect(wrapper.find('.card-title').classes()).toContain('text-decoration-line-through')
    expect(wrapper.find('.btn-warning').text()).toBe('Undo')
  })

  it('emits toggle event when complete/undo button is clicked', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo: mockTodo }
    })

    await wrapper.find('.btn-success').trigger('click')
    
    expect(wrapper.emitted('toggle')).toBeTruthy()
    expect(wrapper.emitted('toggle')[0]).toEqual([mockTodo.id, true])
  })

  it('emits edit event when edit button is clicked', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo: mockTodo }
    })

    await wrapper.find('.btn-outline-primary').trigger('click')
    
    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')[0]).toEqual([mockTodo])
  })

  it('shows delete confirmation and emits delete when confirmed', async () => {
    // Mock window.confirm
    window.confirm = vi.fn(() => true)
    
    const wrapper = mount(TodoItem, {
      props: { todo: mockTodo }
    })

    await wrapper.find('.btn-outline-danger').trigger('click')
    
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this todo?')
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')[0]).toEqual([mockTodo.id])
  })

  it('does not emit delete when confirmation is cancelled', async () => {
    // Mock window.confirm to return false
    window.confirm = vi.fn(() => false)
    
    const wrapper = mount(TodoItem, {
      props: { todo: mockTodo }
    })

    await wrapper.find('.btn-outline-danger').trigger('click')
    
    expect(window.confirm).toHaveBeenCalled()
    expect(wrapper.emitted('delete')).toBeFalsy()
  })

  it('handles todo without description', () => {
    const todoWithoutDescription = {
      ...mockTodo,
      description: null
    }
    
    const wrapper = mount(TodoItem, {
      props: { todo: todoWithoutDescription }
    })

    expect(wrapper.find('.card-title').text()).toBe('Test Todo')
    expect(wrapper.find('.card-text').exists()).toBe(false)
  })

  it('displays formatted creation date', () => {
    const wrapper = mount(TodoItem, {
      props: { todo: mockTodo }
    })

    expect(wrapper.text()).toContain('Created:')
  })
})
