# 🚀 Laravel + Vue.js Todo Application - Complete Technical Documentation

## 📋 Project Overview

This document explains the complete full-stack Todo application built with Laravel 11 backend API and Vue.js 3 frontend, including architecture, technologies, workflow, and deployment.

## 🏗️ Architecture Overview

```
Frontend (Vue.js 3)          Backend (Laravel 11)         Database (MySQL)
┌─────────────────────┐     ┌─────────────────────┐      ┌─────────────────┐
│  todolist.tech...  │────▶│ todolist-api.tech.. │────▶ │     MySQL       │
│                     │     │                     │      │                 │
│ - Vue.js 3 SPA      │     │ - RESTful API       │      │ - todos table   │
│ - Bootstrap 5 UI    │     │ - Laravel 11        │      │ - migrations    │
│ - Axios HTTP        │     │ - PHP 8.3           │      │ - seeders       │
│ - Vite build        │     │ - JSON responses    │      │ - factories     │
└─────────────────────┘     └─────────────────────┘      └─────────────────┘
```

## 🛠️ Technology Stack

### **Frontend Technologies**
- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and dev server
- **Bootstrap 5** - CSS framework for responsive design
- **Axios** - HTTP client for API requests
- **JavaScript (ES6+)** - Programming language
- **Vitest** - Testing framework for Vue components
- **Vue Test Utils** - Official testing utilities for Vue

### **Backend Technologies**
- **Laravel 11** - PHP web framework
- **PHP 8.3** - Server-side programming language
- **MySQL** - Relational database
- **Eloquent ORM** - Laravel's database abstraction
- **PHPUnit** - Testing framework for PHP
- **Composer** - PHP dependency manager

### **Web Server & Infrastructure**
- **Nginx** - Web server for production
- **PHP-FPM** - FastCGI Process Manager
- **Let's Encrypt** - SSL certificates
- **Ubuntu Server** - Operating system

## 🔄 Application Workflow

### **User Interaction Flow**
1. **User visits** `https://todolist.techportfolio.space`
2. **Vue.js app loads** in browser (Single Page Application)
3. **User creates/edits todo** → Vue component emits event
4. **Axios sends HTTP request** to `https://todolist-api.techportfolio.space/api/todos`
5. **Laravel processes request** → validates → saves to database
6. **JSON response sent back** to Vue.js
7. **Vue.js updates UI** reactively

### **Data Flow Diagram**
```
User Action → Vue Component → API Service → Laravel Controller → Model → Database
     ↑                                                                      ↓
UI Update ← Vue Component ← JSON Response ← Laravel Response ← Query Result
```

## 📊 Database Design

### **Todos Table Structure**
```sql
CREATE TABLE todos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### **Sample Data**
```sql
INSERT INTO todos (title, description, completed) VALUES
('Setup Laravel project', 'Install Laravel and configure basic setup', true),
('Create Vue.js frontend', 'Build responsive UI with Vue.js 3', true),
('Deploy to production', 'Configure Nginx and SSL certificates', false);
```

## 🎯 API Endpoints Documentation

### **Base URL**: `https://todolist-api.techportfolio.space/api`

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/todos` | Get all todos | - | `{ "data": [todos] }` |
| POST | `/todos` | Create new todo | `{ "title": "string", "description": "string" }` | `{ "data": todo }` |
| GET | `/todos/{id}` | Get specific todo | - | `{ "data": todo }` |
| PUT | `/todos/{id}` | Update todo | `{ "title": "string", "description": "string", "completed": boolean }` | `{ "data": todo }` |
| DELETE | `/todos/{id}` | Delete todo | - | `{ "message": "success" }` |

### **Example API Request/Response**

**Request:**
```javascript
POST /api/todos
Content-Type: application/json

{
  "title": "Learn Vue.js",
  "description": "Study Vue.js 3 composition API"
}
```

**Response:**
```javascript
HTTP/1.1 201 Created
Content-Type: application/json

{
  "data": {
    "id": 1,
    "title": "Learn Vue.js",
    "description": "Study Vue.js 3 composition API",
    "completed": false,
    "created_at": "2025-07-10T10:30:00.000000Z",
    "updated_at": "2025-07-10T10:30:00.000000Z"
  }
}
```

## 📁 Project Structure Deep Dive

### **Backend Structure (Laravel)**
```
laravel-todo-api/
├── app/
│   ├── Http/Controllers/
│   │   └── TodoController.php          # CRUD operations
│   └── Models/
│       └── Todo.php                    # Eloquent model
├── database/
│   ├── migrations/
│   │   └── create_todos_table.php      # Database schema
│   ├── factories/
│   │   └── TodoFactory.php             # Test data generation
│   └── seeders/
│       └── TodoSeeder.php              # Sample data
├── routes/
│   └── api.php                         # API route definitions
├── tests/
│   ├── Unit/
│   │   └── TodoModelTest.php           # Model unit tests
│   └── Feature/
│       └── TodoApiTest.php             # API integration tests
├── config/
│   └── cors.php                        # CORS configuration
└── .env                                # Environment configuration
```

### **Frontend Structure (Vue.js)**
```
vue-todo-app/
├── src/
│   ├── components/
│   │   ├── TodoForm.vue                # Create/edit todo form
│   │   ├── TodoItem.vue                # Individual todo display
│   │   └── TodoList.vue                # Todo list container
│   ├── services/
│   │   └── api.js                      # HTTP API service
│   ├── test/
│   │   ├── components/                 # Component tests
│   │   └── services/                   # Service tests
│   ├── App.vue                         # Root component
│   └── main.js                         # Application entry point
├── dist/                               # Built files for production
├── package.json                        # Dependencies and scripts
├── vite.config.js                      # Build configuration
└── index.html                          # HTML template
```

## 🔧 Key Code Components

### **Laravel Todo Model**
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Todo extends Model
{
    use HasFactory;
    
    protected $fillable = ['title', 'description', 'completed'];
    
    protected $casts = [
        'completed' => 'boolean',
    ];
}
```

### **Laravel Todo Controller**
```php
<?php
namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    public function index()
    {
        $todos = Todo::orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $todos]);
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        
        $todo = Todo::create($request->all());
        return response()->json(['data' => $todo], 201);
    }
    
    // ... other CRUD methods
}
```

### **Vue.js API Service**
```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://todolist-api.techportfolio.space/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true
})

export const todoService = {
  async getAllTodos() {
    const response = await api.get('/todos')
    return response.data
  },
  
  async createTodo(todo) {
    const response = await api.post('/todos', todo)
    return response.data
  },
  
  // ... other API methods
}
```

### **Vue.js Todo Component**
```vue
<template>
  <div class="todo-item card mb-2">
    <div class="card-body">
      <h5 class="card-title">{{ todo.title }}</h5>
      <p class="card-text">{{ todo.description }}</p>
      <div class="btn-group">
        <button @click="toggleComplete" 
                :class="todo.completed ? 'btn-success' : 'btn-outline-success'"
                class="btn">
          {{ todo.completed ? 'Completed' : 'Mark Complete' }}
        </button>
        <button @click="editTodo" class="btn btn-primary">Edit</button>
        <button @click="deleteTodo" class="btn btn-danger">Delete</button>
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
  methods: {
    toggleComplete() {
      this.$emit('toggle-complete', this.todo.id)
    },
    editTodo() {
      this.$emit('edit', this.todo)
    },
    deleteTodo() {
      this.$emit('delete', this.todo.id)
    }
  }
}
</script>
```

## 🌐 Deployment Architecture

### **Domain Structure**
- **Frontend**: `todolist.techportfolio.space` → Serves Vue.js SPA
- **Backend**: `todolist-api.techportfolio.space` → Serves Laravel API

### **Nginx Configuration**
```nginx
# Frontend (todolist.techportfolio.space)
server {
    listen 443 ssl http2;
    server_name todolist.techportfolio.space;
    root /var/www/laravel-vue/vue-todo-app/dist;
    
    # Vue.js SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Backend API (todolist-api.techportfolio.space)
server {
    listen 443 ssl http2;
    server_name todolist-api.techportfolio.space;
    root /var/www/laravel-vue/laravel-todo-api/public;
    
    # Laravel PHP processing
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        include fastcgi_params;
    }
}
```

### **SSL/HTTPS Setup**
```bash
# Get SSL certificates for both domains
sudo certbot --nginx -d todolist.techportfolio.space
sudo certbot --nginx -d todolist-api.techportfolio.space
```

## 🧪 Testing Strategy

### **Backend Testing (Laravel)**
- **Unit Tests**: Test individual models and business logic
- **Feature Tests**: Test complete API endpoints
- **Coverage**: 24 tests covering all CRUD operations

```php
// Example test
public function test_can_create_todo()
{
    $todoData = [
        'title' => 'Test Todo',
        'description' => 'Test Description'
    ];
    
    $response = $this->postJson('/api/todos', $todoData);
    
    $response->assertStatus(201)
             ->assertJsonStructure(['data' => ['id', 'title', 'description']]);
}
```

### **Frontend Testing (Vue.js)**
- **Component Tests**: Test Vue component behavior
- **Service Tests**: Test API service functionality
- **Coverage**: 27 tests covering all components and services

```javascript
// Example test
it('emits toggle-complete event when button clicked', async () => {
  const todo = { id: 1, title: 'Test', completed: false }
  const wrapper = mount(TodoItem, { props: { todo } })
  
  await wrapper.find('.btn-outline-success').trigger('click')
  
  expect(wrapper.emitted('toggle-complete')).toBeTruthy()
  expect(wrapper.emitted('toggle-complete')[0]).toEqual([1])
})
```

## 🔒 Security Features

### **Backend Security**
- **Input Validation**: Laravel form requests
- **CORS Configuration**: Specific origin allowance
- **SQL Injection Prevention**: Eloquent ORM
- **HTTPS Enforcement**: SSL certificates
- **Environment Variables**: Sensitive data protection

### **Frontend Security**
- **HTTPS Only**: Secure communication
- **CORS Compliance**: Proper header handling
- **Input Sanitization**: Vue.js built-in protection
- **CSP Headers**: Content Security Policy

## ⚡ Performance Optimizations

### **Frontend Optimizations**
- **Vite Build**: Fast bundling and tree-shaking
- **Static File Caching**: Nginx cache headers
- **Gzip Compression**: Reduced file sizes
- **SPA Architecture**: Fast navigation

### **Backend Optimizations**
- **Laravel Caching**: Config, route, and view caching
- **Database Indexing**: Optimized queries
- **PHP-FPM**: Efficient PHP processing
- **Nginx Proxy**: Static file serving

## 🚀 Development Workflow

### **Local Development**
```bash
# Backend
cd laravel-todo-api
php artisan serve --port=8000

# Frontend
cd vue-todo-app
npm run dev  # Usually runs on port 5174
```

### **Production Build**
```bash
# Frontend build process
cd vue-todo-app
npm install
npm run build  # Creates optimized dist/ folder

# Backend optimization
cd laravel-todo-api
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 📈 Scalability Considerations

### **Horizontal Scaling**
- **Load Balancers**: Multiple server instances
- **Database Clustering**: MySQL replication
- **CDN Integration**: Static asset delivery
- **Caching Layers**: Redis/Memcached

### **Monitoring & Logging**
- **Application Logs**: Laravel logging
- **Web Server Logs**: Nginx access/error logs
- **Performance Monitoring**: Response times
- **Error Tracking**: Exception handling

## 🎓 Learning Outcomes

### **Frontend Skills Demonstrated**
- Vue.js 3 Composition API and Options API
- Component-based architecture
- State management and event handling
- HTTP client integration (Axios)
- Modern JavaScript (ES6+)
- Responsive design with Bootstrap
- Testing with Vitest and Vue Test Utils

### **Backend Skills Demonstrated**
- Laravel 11 framework features
- RESTful API design
- Eloquent ORM usage
- Database migrations and seeding
- Input validation and error handling
- Testing with PHPUnit
- CORS configuration

### **DevOps Skills Demonstrated**
- Nginx web server configuration
- SSL certificate management
- Production deployment strategies
- Environment configuration
- Database management
- Server security hardening

## 📋 Summary

This full-stack Todo application demonstrates modern web development practices using:

- **Separation of Concerns**: Frontend and backend as separate applications
- **RESTful Architecture**: Clean API design
- **Modern Frameworks**: Latest versions of Laravel and Vue.js
- **Production-Ready Deployment**: Nginx, SSL, proper security
- **Comprehensive Testing**: Both unit and integration tests
- **Professional Development Practices**: Version control, documentation, deployment scripts

The application showcases the ability to build, test, and deploy a complete web application using industry-standard tools and practices.

---

**Live Application:**
- Frontend: https://todolist.techportfolio.space
- Backend API: https://todolist-api.techportfolio.space

**Technologies Used:** Laravel 11, Vue.js 3, MySQL, Nginx, PHP 8.3, Bootstrap 5, Vite, Axios, PHPUnit, Vitest

## 📄 File Structure and Functionalities

### **Backend Files (Laravel)**

#### **Models**
**`app/Models/Todo.php`**
- **Purpose**: Eloquent model representing the Todo entity
- **Functionality**:
  - Defines database table structure
  - Specifies fillable fields (`title`, `description`, `completed`)
  - Casts `completed` field to boolean
  - Provides factory support for testing
- **Key Methods**: Inherits from Model (save, update, delete, find, etc.)

#### **Controllers**
**`app/Http/Controllers/TodoController.php`**
- **Purpose**: Handles HTTP requests and responses for Todo operations
- **Functionality**:
  - `index()`: Returns all todos ordered by creation date
  - `store(Request $request)`: Creates new todo with validation
  - `show($id)`: Returns specific todo by ID
  - `update(Request $request, $id)`: Updates existing todo
  - `destroy($id)`: Deletes todo by ID
- **Validation Rules**:
  - Title: required, string, max 255 characters
  - Description: optional, string
  - Completed: boolean

#### **Database Files**
**`database/migrations/create_todos_table.php`**
- **Purpose**: Database schema definition
- **Functionality**:
  - Creates `todos` table with id, title, description, completed, timestamps
  - Sets up proper data types and constraints
  - Enables rollback functionality

**`database/factories/TodoFactory.php`**
- **Purpose**: Generates fake data for testing
- **Functionality**:
  - Creates realistic todo titles and descriptions
  - Randomizes completion status
  - Supports mass data generation for testing

**`database/seeders/TodoSeeder.php`**
- **Purpose**: Populates database with sample data
- **Functionality**:
  - Creates 10 realistic project-related todos
  - Generates 5 additional random todos using factory
  - Provides demonstration data for the application

#### **Routes**
**`routes/api.php`**
- **Purpose**: Defines API endpoints
- **Functionality**:
  - Maps HTTP methods to controller actions
  - Groups routes under `/api` prefix
  - Applies middleware (CORS, throttling)
- **Endpoints**:
  ```php
  Route::apiResource('todos', TodoController::class);
  ```

#### **Configuration**
**`config/cors.php`**
- **Purpose**: Cross-Origin Resource Sharing configuration
- **Functionality**:
  - Allows frontend domain access
  - Specifies allowed methods (GET, POST, PUT, DELETE)
  - Sets allowed headers for API requests

**`.env`**
- **Purpose**: Environment configuration
- **Functionality**:
  - Database connection settings
  - Application key and debug mode
  - CORS domain configuration
  - Mail and cache settings

### **Frontend Files (Vue.js)**

#### **Main Application**
**`src/App.vue`**
- **Purpose**: Root component of the Vue.js application
- **Functionality**:
  - **Template**: 
    - Bootstrap container layout
    - Loading spinner display
    - Error and success alerts
    - Component integration (TodoForm, TodoList)
  - **Script**:
    - Application state management (todos, loading, error, success)
    - API integration methods
    - Event handling for CRUD operations
  - **Methods**:
    - `loadTodos()`: Fetches all todos from API
    - `handleSubmit()`: Creates or updates todos
    - `toggleTodo()`: Changes completion status
    - `startEdit()`: Initiates todo editing
    - `deleteTodo()`: Removes todo from list

**`src/main.js`**
- **Purpose**: Application entry point
- **Functionality**:
  - Creates Vue application instance
  - Imports Bootstrap CSS
  - Mounts app to DOM element

#### **Components**

**`src/components/TodoForm.vue`**
- **Purpose**: Form component for creating and editing todos
- **Functionality**:
  - **Props**: `editingTodo` (for edit mode)
  - **Template**:
    - Bootstrap form with title and description fields
    - Dynamic submit button text
    - Form validation feedback
  - **Methods**:
    - `submitForm()`: Validates and emits form data
    - `cancel()`: Resets form and cancels editing
  - **Events Emitted**:
    - `submit`: When form is successfully submitted
    - `cancel`: When editing is cancelled

**`src/components/TodoItem.vue`**
- **Purpose**: Individual todo display component
- **Functionality**:
  - **Props**: `todo` object
  - **Template**:
    - Bootstrap card layout
    - Conditional styling based on completion status
    - Action buttons (Complete, Edit, Delete)
  - **Methods**:
    - `toggleComplete()`: Emits toggle event
    - `editTodo()`: Emits edit event
    - `deleteTodo()`: Emits delete event with confirmation
  - **Events Emitted**:
    - `toggle`: When completion status changes
    - `edit`: When edit button is clicked
    - `delete`: When delete is confirmed

**`src/components/TodoList.vue`**
- **Purpose**: Container component for displaying todos
- **Functionality**:
  - **Props**: `todos` array
  - **Template**:
    - Filter buttons (All, Pending, Completed)
    - Todo count display
    - TodoItem components rendering
  - **Computed Properties**:
    - `filteredTodos`: Filters todos based on selected filter
    - `pendingCount`: Counts incomplete todos
    - `completedCount`: Counts completed todos
  - **Methods**:
    - Filter management (`showAll`, `showPending`, `showCompleted`)
  - **Events Handled**: Passes through events from TodoItem to parent

#### **Services**

**`src/services/api.js`**
- **Purpose**: HTTP API service layer
- **Functionality**:
  - **Axios Configuration**:
    - Base URL for API requests
    - Request/response interceptors
    - Error handling and logging
  - **API Methods**:
    - `getTodos()`: Fetches all todos
    - `createTodo(todo)`: Creates new todo
    - `updateTodo(id, todo)`: Updates existing todo
    - `toggleTodo(id, completed)`: Updates completion status
    - `deleteTodo(id)`: Deletes todo
  - **Error Handling**: Consistent error formatting and logging

#### **Testing Files**

**`src/test/setup.js`**
- **Purpose**: Test environment configuration
- **Functionality**:
  - Global test setup
  - Mock configurations
  - Test utilities

**`src/test/components/TodoForm.test.js`**
- **Purpose**: TodoForm component tests
- **Functionality**:
  - Tests form rendering
  - Validates form submission
  - Tests edit mode functionality
  - Verifies event emission

**`src/test/components/TodoItem.test.js`**
- **Purpose**: TodoItem component tests
- **Functionality**:
  - Tests todo display
  - Validates button interactions
  - Tests event emission
  - Verifies conditional rendering

**`src/test/components/TodoList.test.js`**
- **Purpose**: TodoList component tests
- **Functionality**:
  - Tests list rendering
  - Validates filtering functionality
  - Tests count calculations
  - Verifies event propagation

**`src/test/services/api.test.js`**
- **Purpose**: API service tests
- **Functionality**:
  - Tests service structure
  - Validates method existence
  - Tests configuration

#### **Configuration Files**

**`package.json`**
- **Purpose**: Project dependencies and scripts
- **Functionality**:
  - Lists production dependencies (Vue, Axios, Bootstrap)
  - Lists development dependencies (Vite, Vitest, testing tools)
  - Defines npm scripts (dev, build, test, preview)

**`vite.config.js`**
- **Purpose**: Build tool configuration
- **Functionality**:
  - Vue plugin configuration
  - Test environment setup
  - Build optimization settings

**`index.html`**
- **Purpose**: HTML template
- **Functionality**:
  - Defines document structure
  - Links to app entry point
  - Sets up viewport and meta tags

### **Testing Files (Laravel)**

**`tests/Unit/TodoModelTest.php`**
- **Purpose**: Unit tests for Todo model
- **Functionality**:
  - Tests model creation and validation
  - Tests factory functionality
  - Tests model attributes and casting
  - Validates fillable fields

**`tests/Feature/TodoApiTest.php`**
- **Purpose**: Integration tests for API endpoints
- **Functionality**:
  - Tests all CRUD operations
  - Validates request/response formats
  - Tests error handling
  - Verifies database interactions

### **Deployment Files**

**Nginx Configuration Files**
- **`todolist.techportfolio.space`**: Frontend server configuration
- **`todolist-api.techportfolio.space`**: Backend API server configuration
- **Functionality**:
  - SSL termination
  - Static file serving
  - PHP-FPM integration
  - Security headers
  - Compression and caching

**Environment Files**
- **`.env.production`**: Production environment configuration
- **`api.production.js`**: Production API configuration
- **Functionality**:
  - Database connection settings
  - CORS configuration
  - SSL and security settings

## 🔄 File Interaction Flow

### **Data Flow Between Files**

1. **User Request** → `index.html` → `main.js` → `App.vue`
2. **Component Interaction** → `TodoForm.vue` ↔ `TodoList.vue` ↔ `TodoItem.vue`
3. **API Calls** → `api.js` → Laravel API → `TodoController.php`
4. **Database Operations** → `Todo.php` model → MySQL database
5. **Response Flow** → Database → Model → Controller → JSON → API service → Vue components

### **Component Communication**

```
App.vue (Parent)
├── TodoForm.vue (Child)
│   ├── Emits: submit, cancel
│   └── Props: editingTodo
└── TodoList.vue (Child)
    ├── Props: todos
    ├── Emits: toggle, edit, delete
    └── TodoItem.vue (Grandchild)
        ├── Props: todo
        └── Emits: toggle, edit, delete
```

### **API Request Lifecycle**

1. **User Action** in Vue component
2. **Event Handler** calls API service method
3. **Axios Request** to Laravel backend
4. **Route Matching** in `api.php`
5. **Controller Method** execution
6. **Model Interaction** with database
7. **JSON Response** back to frontend
8. **UI Update** in Vue component

This file structure provides a complete separation of concerns, making the application maintainable, testable, and scalable.
