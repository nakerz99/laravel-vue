# Laravel Todo API

A RESTful API backend for a Todo application built with Laravel 11.

## Features

- ✅ CRUD operations for todos
- ✅ MySQL database with migrations
- ✅ CORS enabled for frontend communication
- ✅ Laravel Sanctum ready for authentication (future use)
- ✅ Resource controller with proper HTTP status codes
- ✅ Input validation and error handling

## Requirements

- PHP 8.2+
- Composer
- MySQL 8.0+
- Laravel 11

## Installation

1. Install dependencies:
```bash
composer install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Configure your database in `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_todo
DB_USERNAME=root
DB_PASSWORD=qweqweqwe
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Create database:
```bash
mysql -u root -pqweqweqwe -e "CREATE DATABASE IF NOT EXISTS laravel_todo;"
```

6. Run migrations:
```bash
php artisan migrate
```

7. Start the development server:
```bash
php artisan serve --port=8000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| POST | `/api/todos` | Create a new todo |
| GET | `/api/todos/{id}` | Get a specific todo |
| PUT | `/api/todos/{id}` | Update a todo |
| DELETE | `/api/todos/{id}` | Delete a todo |

## Todo Model Structure

```json
{
  "id": 1,
  "title": "Learn Laravel",
  "description": "Complete the Laravel tutorial",
  "completed": false,
  "created_at": "2025-07-10T01:10:13.000000Z",
  "updated_at": "2025-07-10T01:10:13.000000Z"
}
```

## Usage Examples

### Create a Todo
```bash
curl -X POST http://127.0.0.1:8000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Laravel","description":"Complete the Laravel tutorial"}'
```

### Get All Todos
```bash
curl http://127.0.0.1:8000/api/todos
```

### Update a Todo
```bash
curl -X PUT http://127.0.0.1:8000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

### Delete a Todo
```bash
curl -X DELETE http://127.0.0.1:8000/api/todos/1
```

## Testing

### How to Test This Application

This Laravel API can be tested using several approaches:

#### 1. Feature Tests (Recommended)
Create feature tests to test the API endpoints:

```bash
php artisan make:test TodoApiTest
```

Example test structure:
```php
public function test_can_create_todo()
{
    $response = $this->postJson('/api/todos', [
        'title' => 'Test Todo',
        'description' => 'Test Description'
    ]);

    $response->assertStatus(201)
             ->assertJsonStructure(['id', 'title', 'description', 'completed']);
}

public function test_can_list_todos()
{
    Todo::factory()->count(3)->create();
    
    $response = $this->getJson('/api/todos');
    
    $response->assertStatus(200)
             ->assertJsonCount(3);
}

public function test_can_update_todo()
{
    $todo = Todo::factory()->create();
    
    $response = $this->putJson("/api/todos/{$todo->id}", [
        'completed' => true
    ]);
    
    $response->assertStatus(200);
    $this->assertTrue($todo->fresh()->completed);
}
```

#### 2. Unit Tests
Test individual model methods and validation:

```bash
php artisan make:test TodoModelTest --unit
```

#### 3. Manual Testing
- Use Postman or Insomnia to test endpoints
- Use curl commands as shown in the usage examples
- Test with the Vue.js frontend

#### 4. Database Testing
- Use SQLite in-memory database for tests
- Configure `phpunit.xml` for test environment
- Use factories and seeders for test data

Run tests with:
```bash
php artisan test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
