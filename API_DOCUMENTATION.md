# Todo App API Documentation

This document provides comprehensive documentation for all available API endpoints in the Laravel Todo application.

## Base Information

- **Base URL**: `http://127.0.0.1:8000/api`
- **Content Type**: `application/json`
- **Accept**: `application/json`

## Table of Contents

1. [Authentication](#authentication)
2. [Todo Endpoints](#todo-endpoints)
3. [Data Models](#data-models)
4. [Error Handling](#error-handling)
5. [Examples](#examples)

## Authentication

Currently, the Todo API endpoints are publicly accessible. However, there is one protected endpoint:

### Get User Information
- **Endpoint**: `GET /api/user`
- **Authentication**: Required (Sanctum)
- **Description**: Get authenticated user details

## Todo Endpoints

### 1. Get All Todos

- **Endpoint**: `GET /api/todos`
- **Method**: GET
- **Authentication**: Not required
- **Description**: Retrieve all todos ordered by creation date (newest first)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Sample Todo",
    "description": "Optional description",
    "completed": false,
    "created_at": "2024-01-01T12:00:00.000000Z",
    "updated_at": "2024-01-01T12:00:00.000000Z"
  }
]
```

**Status Codes:**
- `200` - Success

---

### 2. Create Todo

- **Endpoint**: `POST /api/todos`
- **Method**: POST
- **Authentication**: Not required
- **Description**: Create a new todo item

**Request Body:**
```json
{
  "title": "Buy groceries",           // Required: string, max 255 characters
  "description": "Milk, eggs, bread", // Optional: string
  "completed": false                  // Optional: boolean, defaults to false
}
```

**Response:**
```json
{
  "id": 2,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2024-01-01T12:30:00.000000Z",
  "updated_at": "2024-01-01T12:30:00.000000Z"
}
```

**Status Codes:**
- `201` - Created successfully
- `422` - Validation error

**Validation Rules:**
- `title`: Required, string, maximum 255 characters
- `description`: Optional, string
- `completed`: Optional, boolean

---

### 3. Get Single Todo

- **Endpoint**: `GET /api/todos/{id}`
- **Method**: GET
- **Authentication**: Not required
- **Description**: Retrieve a specific todo by ID

**URL Parameters:**
- `id` (integer, required): The ID of the todo

**Response:**
```json
{
  "id": 1,
  "title": "Sample Todo",
  "description": "Optional description",
  "completed": false,
  "created_at": "2024-01-01T12:00:00.000000Z",
  "updated_at": "2024-01-01T12:00:00.000000Z"
}
```

**Status Codes:**
- `200` - Success
- `404` - Todo not found

---

### 4. Update Todo

- **Endpoint**: `PUT /api/todos/{id}` or `PATCH /api/todos/{id}`
- **Method**: PUT or PATCH
- **Authentication**: Not required
- **Description**: Update a specific todo

**URL Parameters:**
- `id` (integer, required): The ID of the todo

**Request Body (all fields optional for partial updates):**
```json
{
  "title": "Updated todo title",
  "description": "Updated description",
  "completed": true
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Updated todo title",
  "description": "Updated description",
  "completed": true,
  "created_at": "2024-01-01T12:00:00.000000Z",
  "updated_at": "2024-01-01T13:00:00.000000Z"
}
```

**Status Codes:**
- `200` - Updated successfully
- `404` - Todo not found
- `422` - Validation error

**Validation Rules:**
- `title`: Optional (if provided: required, string, maximum 255 characters)
- `description`: Optional, string
- `completed`: Optional, boolean

---

### 5. Delete Todo

- **Endpoint**: `DELETE /api/todos/{id}`
- **Method**: DELETE
- **Authentication**: Not required
- **Description**: Delete a specific todo

**URL Parameters:**
- `id` (integer, required): The ID of the todo

**Response:**
- Empty response body

**Status Codes:**
- `204` - Deleted successfully
- `404` - Todo not found

---

## Data Models

### Todo Model

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | integer | Auto | Primary key, auto-incremented |
| title | string | Yes | Todo title (max 255 characters) |
| description | string | No | Todo description |
| completed | boolean | No | Completion status (defaults to false) |
| created_at | timestamp | Auto | Creation timestamp |
| updated_at | timestamp | Auto | Last update timestamp |

## Error Handling

### Common HTTP Status Codes

- `200` - OK: Request successful
- `201` - Created: Resource created successfully
- `204` - No Content: Resource deleted successfully
- `404` - Not Found: Resource not found
- `422` - Unprocessable Entity: Validation errors
- `500` - Internal Server Error: Server error

### Error Response Format

For validation errors (422):
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "title": [
      "The title field is required."
    ]
  }
}
```

For not found errors (404):
```json
{
  "message": "No query results for model [App\\Models\\Todo] 1"
}
```

## Examples

### Complete CRUD Operations

#### 1. Create a Todo
```bash
curl -X POST http://127.0.0.1:8000/api/todos \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "title": "Learn Vue.js",
    "description": "Complete the Vue.js tutorial",
    "completed": false
  }'
```

#### 2. Get All Todos
```bash
curl -X GET http://127.0.0.1:8000/api/todos \
  -H "Accept: application/json"
```

#### 3. Get Single Todo
```bash
curl -X GET http://127.0.0.1:8000/api/todos/1 \
  -H "Accept: application/json"
```

#### 4. Update a Todo
```bash
curl -X PUT http://127.0.0.1:8000/api/todos/1 \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "completed": true
  }'
```

#### 5. Delete a Todo
```bash
curl -X DELETE http://127.0.0.1:8000/api/todos/1 \
  -H "Accept: application/json"
```

### JavaScript/Axios Examples

#### Using the Vue.js API Service

```javascript
import { todoAPI } from './services/api.js'

// Get all todos
const todos = await todoAPI.getTodos()

// Create a new todo
const newTodo = await todoAPI.createTodo({
  title: "New Task",
  description: "Task description",
  completed: false
})

// Update a todo
const updatedTodo = await todoAPI.updateTodo(1, {
  title: "Updated Task",
  completed: true
})

// Toggle todo completion
const toggledTodo = await todoAPI.toggleTodo(1, true)

// Delete a todo
await todoAPI.deleteTodo(1)
```

## Implementation Notes

### Current Vue.js API Usage

The Vue.js frontend currently implements these API endpoints:

✅ **Implemented:**
- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/{id}` - Update todo (full update and toggle)
- `DELETE /api/todos/{id}` - Delete todo

❌ **Not Implemented:**
- `GET /api/todos/{id}` - Get single todo
- `GET /api/user` - User authentication

### Backend Controller

The API is implemented in `app/Http/Controllers/TodoController.php` using Laravel's `apiResource` routing, which automatically provides all RESTful endpoints.

### Database

Todos are stored in a MySQL database with the following table structure:
- `id` (Primary Key)
- `title` (VARCHAR 255)
- `description` (TEXT, nullable)
- `completed` (BOOLEAN, default false)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### CORS Configuration

The API supports CORS for frontend integration, configured in `config/cors.php`.

---

*Last updated: July 14, 2025*
