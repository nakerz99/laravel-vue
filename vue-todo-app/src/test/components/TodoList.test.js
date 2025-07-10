import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoList from '@/components/TodoList.vue'
import TodoItem from '@/components/TodoItem.vue'

describe('TodoList.vue', () => {
  const mockTodos = [
    {
      id: 1,
      title: 'Todo 1',
      description: 'Description 1',
      completed: false,
      created_at: '2025-01-01T00:00:00.000000Z',
      updated_at: '2025-01-01T00:00:00.000000Z'
    },
    {
      id: 2,
      title: 'Todo 2',
      description: 'Description 2',
      completed: true,
      created_at: '2025-01-02T00:00:00.000000Z',
      updated_at: '2025-01-02T00:00:00.000000Z'
    },
    {
      id: 3,
      title: 'Todo 3',
      description: 'Description 3',
      completed: false,
      created_at: '2025-01-03T00:00:00.000000Z',
      updated_at: '2025-01-03T00:00:00.000000Z'
    }
  ]

  it('renders todo list with filter buttons', () => {
    const wrapper = mount(TodoList, {
      props: { todos: mockTodos }
    })

    expect(wrapper.find('h3').text()).toBe('Todo List')
    expect(wrapper.findAll('.btn-group .btn')).toHaveLength(3)
    expect(wrapper.findAll('.btn-group .btn')[0].text()).toContain('All')
    expect(wrapper.findAll('.btn-group .btn')[1].text()).toContain('Pending')
    expect(wrapper.findAll('.btn-group .btn')[2].text()).toContain('Completed')
  })

  it('renders all todos by default', () => {
    const wrapper = mount(TodoList, {
      props: { todos: mockTodos }
    })

    const todoItems = wrapper.findAllComponents(TodoItem)
    expect(todoItems).toHaveLength(3)
  })

  it('shows message when no todos are provided', async () => {
    const wrapper = mount(TodoList, {
      props: { todos: [] }
    })

    expect(wrapper.text()).toContain('No todos')
  })

  it('passes correct props to TodoItem components', () => {
    const wrapper = mount(TodoList, {
      props: { todos: mockTodos }
    })

    const todoItems = wrapper.findAllComponents(TodoItem)
    expect(todoItems[0].props('todo')).toEqual(mockTodos[0])
    expect(todoItems[1].props('todo')).toEqual(mockTodos[1])
    expect(todoItems[2].props('todo')).toEqual(mockTodos[2])
  })

  it('emits events from TodoItem components', async () => {
    const wrapper = mount(TodoList, {
      props: { todos: mockTodos }
    })

    const firstTodoItem = wrapper.findAllComponents(TodoItem)[0]
    
    // Test toggle event
    await firstTodoItem.vm.$emit('toggle', 1, true)
    expect(wrapper.emitted('toggle')).toBeTruthy()

    // Test edit event  
    await firstTodoItem.vm.$emit('edit', mockTodos[0])
    expect(wrapper.emitted('edit')).toBeTruthy()

    // Test delete event
    await firstTodoItem.vm.$emit('delete', 1)
    expect(wrapper.emitted('delete')).toBeTruthy()
  })

  it('displays todo counts in filter buttons', () => {
    const wrapper = mount(TodoList, {
      props: { todos: mockTodos }
    })

    const filterButtons = wrapper.findAll('.btn-group .btn')
    expect(filterButtons[0].text()).toContain('(3)') // All todos
    expect(filterButtons[1].text()).toContain('(2)') // Pending todos  
    expect(filterButtons[2].text()).toContain('(1)') // Completed todos
  })
})
