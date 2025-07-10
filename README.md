# Laravel + Vue.js Todo Application

A full-stack Todo application built with Laravel 11 backend API and Vue.js 3 frontend, featuring complete CRUD functionality with modern UI and responsive design.

## 🚀 Project Overview

This project consists of two separate applications:

1. **Laravel Todo API** (`laravel-todo-api/`) - RESTful API backend
2. **Vue Todo App** (`vue-todo-app/`) - Frontend web application

## ✨ Features

### Backend (Laravel 11)
- ✅ RESTful API with CRUD operations
- ✅ MySQL database with migrations
- ✅ Input validation and error handling
- ✅ CORS configured for frontend communication

### Frontend (Vue.js 3)
- ✅ Modern, responsive UI with Bootstrap 5
- ✅ Create, edit, delete, and toggle todos
- ✅ Filter todos by status (All, Pending, Completed)
- ✅ Real-time feedback and error handling
- ✅ JavaScript only (no TypeScript)

## 🛠️ Tech Stack

### Backend
- **Laravel 11** - PHP framework
- **MySQL** - Database
- **PHP 8.2+** - Programming language

### Frontend
- **Vue.js 3** - JavaScript framework
- **Vite** - Build tool and dev server
- **Bootstrap 5** - CSS framework
- **Axios** - HTTP client

## 📋 Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- npm
- MySQL 8.0+

## 🚀 Quick Start

### 1. Backend Setup (Laravel API)

```bash
cd laravel-todo-api

# Install dependencies
composer install

# Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials

# Generate application key
php artisan key:generate

# Create database
mysql -u root -pqweqweqwe -e "CREATE DATABASE IF NOT EXISTS laravel_todo;"

# Run migrations
php artisan migrate

# Seed database with sample todos (optional)
php artisan db:seed --class=TodoSeeder

# Start API server
php artisan serve --port=8000
```

### 2. Frontend Setup (Vue.js)

```bash
cd vue-todo-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:5174 (or the port shown in your terminal)
- **Backend API**: http://127.0.0.1:8000

## 📁 Project Structure

```
laraveVue/
├── laravel-todo-api/          # Laravel backend
│   ├── app/
│   │   ├── Http/Controllers/TodoController.php
│   │   └── Models/Todo.php
│   ├── database/
│   │   ├── migrations/
│   │   ├── factories/TodoFactory.php
│   │   └── seeders/TodoSeeder.php
│   ├── routes/api.php
│   ├── tests/
│   │   ├── Unit/TodoModelTest.php
│   │   └── Feature/TodoApiTest.php
│   └── config/cors.php
├── vue-todo-app/              # Vue frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── TodoForm.vue
│   │   │   ├── TodoItem.vue
│   │   │   └── TodoList.vue
│   │   ├── services/api.js
│   │   ├── App.vue
│   │   └── main.js
│   └── index.html
└── README.md                  # This file
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| POST | `/api/todos` | Create a new todo |
| GET | `/api/todos/{id}` | Get a specific todo |
| PUT | `/api/todos/{id}` | Update a todo |
| DELETE | `/api/todos/{id}` | Delete a todo |

## 🎯 Usage

1. **Add Todo**: Fill out the form with title and optional description
2. **Edit Todo**: Click "Edit" button on any todo item
3. **Complete Todo**: Click "Complete" to mark as done
4. **Filter Todos**: Use the filter buttons to view All, Pending, or Completed todos
5. **Delete Todo**: Click "Delete" with confirmation

## 🧪 Testing

### Backend Testing
```bash
cd laravel-todo-api
# Run all tests (24 tests with 82 assertions)
php artisan test

# Run specific test types
php artisan test --testsuite=Unit    # Unit tests
php artisan test --testsuite=Feature # Feature tests

# Run with coverage (requires xdebug)
php artisan test --coverage
```

#### Test Coverage
- ✅ **Unit Tests**: Todo model validation, factory, fillable attributes, and casts
- ✅ **Feature Tests**: Complete API endpoint testing (CRUD operations)
- ✅ **Validation Tests**: Input validation and error handling
- ✅ **Database Tests**: Data persistence and retrieval

### Frontend Testing
```bash
cd vue-todo-app
# Testing framework would need to be set up first
# npm install --save-dev @vue/test-utils vitest jsdom
```

## 🔧 Development

### Backend Development
- API routes defined in `routes/api.php`
- Controller logic in `app/Http/Controllers/TodoController.php`
- Model in `app/Models/Todo.php`
- Database schema in `database/migrations/`
- Sample data seeder in `database/seeders/TodoSeeder.php`

### Frontend Development
- Main app component: `src/App.vue`
- Individual components in `src/components/`
- API service: `src/services/api.js`
- Styling with Bootstrap 5

## 📝 Configuration

### Database Configuration (.env)
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_todo
DB_USERNAME=root
DB_PASSWORD=qweqweqwe
```

### CORS Configuration
CORS is automatically configured in Laravel to allow requests from the Vue frontend.

### Sample Data
The application includes a seeder that creates 15 sample todos:
- 10 realistic project-related todos (some completed, some pending)
- 5 additional random todos generated using the factory

```bash
# To populate the database with sample data
php artisan db:seed --class=TodoSeeder

# To refresh database and reseed (warning: this deletes all data)
php artisan migrate:fresh --seed
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**: Verify MySQL credentials in `.env`
2. **Port Conflicts**: Change ports if 8000 or 5174 are in use
3. **API Connection**: Ensure backend is running before starting frontend

### Solutions

- Check both servers are running
- Verify database connection
- Check browser console for errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both backend and frontend
5. Submit a pull request

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 📞 Support

For support and questions:
- Review the troubleshooting section
- Check the browser console and Laravel logs for errors
- Ensure both backend and frontend servers are running

---

**Enjoy building with Laravel and Vue.js! 🎉**
