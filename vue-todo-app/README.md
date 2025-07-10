# Vue Todo App

A modern, responsive Todo application frontend built with Vue.js 3, Bootstrap 5, and Vite. This app connects to a Laravel API backend to provide full CRUD functionality for managing todos.

## Features

- ✅ Create, read, update, and delete todos
- ✅ Mark todos as completed/pending
- ✅ Filter todos by status (All, Pending, Completed)
- ✅ Edit todos inline
- ✅ Responsive design with Bootstrap 5
- ✅ Real-time feedback with success/error messages
- ✅ Clean, modern UI with loading states

## Tech Stack

- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and development server
- **Bootstrap 5** - CSS framework for responsive design
- **Axios** - HTTP client for API communication
- **JavaScript** - No TypeScript, pure JavaScript implementation

## Requirements

- Node.js 18+
- npm or yarn
- Laravel Todo API backend running on port 8000

## Installation

1. Install dependencies:
```bash
npm install
```

2. Ensure the Laravel API backend is running:
   - Backend should be accessible at `http://127.0.0.1:8000`
   - API endpoints should be available at `/api/todos`

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown (typically `http://localhost:5174`)

## Project Structure

```
src/
├── App.vue                 # Main application component
├── main.js                 # Application entry point
├── components/
│   ├── TodoForm.vue        # Form for adding/editing todos
│   ├── TodoItem.vue        # Individual todo item component
│   └── TodoList.vue        # Todo list with filtering
├── services/
│   └── api.js              # API service for backend communication
└── assets/
    └── main.css            # Additional styles
```

## Components Overview

### App.vue
- Main application component
- Manages global state (todos, loading, errors)
- Handles all API interactions
- Provides error handling and user feedback

### TodoForm.vue
- Handles both adding new todos and editing existing ones
- Form validation and submission
- Switches between "Add" and "Edit" modes

### TodoList.vue
- Displays filtered list of todos
- Provides filtering buttons (All, Pending, Completed)
- Shows counts for each filter category
- Emits events for todo actions

### TodoItem.vue
- Individual todo item display
- Toggle completion status
- Edit and delete actions
- Responsive card layout

## API Integration

The app communicates with a Laravel backend API:

```javascript
// API Base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api'

// Available methods
todoAPI.getTodos()           // GET /api/todos
todoAPI.createTodo(data)     // POST /api/todos
todoAPI.updateTodo(id, data) // PUT /api/todos/{id}
todoAPI.deleteTodo(id)       // DELETE /api/todos/{id}
todoAPI.toggleTodo(id, bool) // PUT /api/todos/{id} (completion status)
```

## Available Scripts

### Development
```bash
npm run dev          # Start development server with hot reload
```

### Production
```bash
npm run build        # Build for production
npm run preview      # Preview production build locally
```

## Features in Detail

### Todo Management
- **Add Todo**: Fill out the form with title and optional description
- **Edit Todo**: Click "Edit" button on any todo item
- **Delete Todo**: Click "Delete" with confirmation dialog
- **Toggle Status**: Click "Complete" or "Undo" to change status

### Filtering
- **All**: Shows all todos with total count
- **Pending**: Shows only incomplete todos
- **Completed**: Shows only completed todos

### User Experience
- Loading spinners during API calls
- Success messages for completed actions
- Error messages with user-friendly descriptions
- Responsive design for mobile and desktop
- Clean, modern Bootstrap styling

## Testing

### How to Test This Vue.js Application

#### 1. Unit Testing (Recommended Setup)
Install Vue testing utilities:
```bash
npm install --save-dev @vue/test-utils vitest @vitest/ui jsdom
```

Example component tests:
```javascript
// TodoForm.test.js
import { mount } from '@vue/test-utils'
import TodoForm from '@/components/TodoForm.vue'

describe('TodoForm', () => {
  test('emits submit event with form data', async () => {
    const wrapper = mount(TodoForm)
    
    await wrapper.find('#title').setValue('Test Todo')
    await wrapper.find('#description').setValue('Test Description')
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.emitted()).toHaveProperty('submit')
    expect(wrapper.emitted().submit[0][0]).toEqual({
      title: 'Test Todo',
      description: 'Test Description',
      completed: false
    })
  })
})
```

#### 2. End-to-End Testing
Use Cypress or Playwright:
```bash
npm install --save-dev cypress
```

#### 3. Manual Testing
- Test all CRUD operations
- Test responsive design on different screen sizes
- Test error handling (disconnect backend)
- Test form validation
- Test filtering functionality

#### 4. API Integration Testing
- Mock API responses for isolated testing
- Test error scenarios (network failures, API errors)
- Test loading states and user feedback

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure Laravel backend has CORS properly configured
2. **API Connection**: Verify backend is running on `http://127.0.0.1:8000`
3. **Port Conflicts**: If port 5174 is busy, Vite will try another port
4. **Build Errors**: Clear node_modules and reinstall dependencies

### Development Tips

- Use Vue DevTools browser extension for debugging
- Check browser console for API errors
- Use network tab to inspect API requests/responses
- Ensure backend API is running before starting frontend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
