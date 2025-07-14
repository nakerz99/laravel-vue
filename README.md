# Laravel + Vue.js Todo Application

A full-stack Todo application built with Laravel 11 backend API and Vue.js 3 frontend, featuring complete CRUD functionality with modern UI and responsive design. The application now includes authentication with login, registration, and user profile pages.

## 🚀 Project Overview

This project consists of two separate applications:

1. **Laravel Todo API** (`laravel-todo-api/`) - RESTful API backend
2. **Vue Todo App** (`vue-todo-app/`) - Frontend web application

## ✨ Features

### Backend (Laravel 11)
- ✅ RESTful API with CRUD operations
- ✅ User authentication with Laravel Sanctum
- ✅ User-specific todo items
- ✅ MySQL database with migrations
- ✅ Input validation and error handling
- ✅ CORS configured for frontend communication

### Frontend (Vue.js 3)
- ✅ Modern, responsive UI with Bootstrap 5
- ✅ Authentication with login, registration, and profile management
- ✅ Create, edit, delete, and toggle todos
- ✅ Filter todos by status (All, Pending, Completed)
- ✅ Real-time feedback and error handling
- ✅ Modal-based authentication forms
- ✅ Responsive design for mobile, tablet, and desktop
- ✅ JavaScript only (no TypeScript)

## 🛠️ Tech Stack

### Backend
- **Laravel 11** - PHP framework
- **MySQL** - Database
- **Sanctum** - API authentication

### Frontend
- **Vue.js 3** - JavaScript framework
- **Bootstrap 5** - CSS framework
- **Axios** - HTTP client
- **Font Awesome** - Icon library

## 🔐 Authentication

The application now supports user authentication with the following features:

- **User Registration**: Create a new account with name, email, and password
- **User Login**: Authenticate with email and password
- **User Profile**: View and update your profile information
- **Todo Ownership**: Users can only see and manage their own todo items

### How Authentication Works

1. When a user registers or logs in, the backend returns a token
2. The token is stored in the browser's localStorage
3. All API requests include the token in the Authorization header
4. Protected routes in Laravel verify the token for each request
5. Todo items are filtered by the authenticated user's ID

## 📱 Responsive Design

The application is fully responsive and works well on:

- Mobile devices (small screens)
- Tablets (medium screens)
- Desktops (large screens)
- Wide screens (with max-width constraints for optimal readability)

The layout automatically adjusts based on screen size:
- Single column layout on mobile devices
- Two-column layout on larger screens (form on the left, list on the right)
- Maximum width constraints on ultra-wide screens for better readability

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
│   │   ├── Http/Controllers/AuthController.php
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
│   │   ├── views/
│   │   │   ├── Login.vue
│   │   │   ├── Register.vue
│   │   │   └── Profile.vue
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
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Authenticate a user |
| GET | `/api/user` | Get authenticated user details |

## 🎯 Usage

1. **Register**: Create a new account with email and password
2. **Login**: Access your account using email and password
3. **Add Todo**: Fill out the form with title and optional description
4. **Edit Todo**: Click "Edit" button on any todo item
5. **Complete Todo**: Click "Complete" to mark as done
6. **Filter Todos**: Use the filter buttons to view All, Pending, or Completed todos
7. **Delete Todo**: Click "Delete" with confirmation
8. **Logout**: End your session and return to the login page

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
- ✅ **Authentication Tests**: User registration, login, and profile access

### Frontend Testing
```bash
cd vue-todo-app
# Testing framework would need to be set up first
# npm install --save-dev @vue/test-utils vitest jsdom
```

## 🔧 Development

### Backend Development
- API routes defined in `routes/api.php`
- Controller logic in `app/Http/Controllers/TodoController.php` and `app/Http/Controllers/AuthController.php`
- Model in `app/Models/Todo.php`
- Database schema in `database/migrations/`
- Sample data seeder in `database/seeders/TodoSeeder.php`

### Frontend Development
- Main app component: `src/App.vue`
- Individual components in `src/components/` and `src/views/`
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

### Authentication Configuration
Laravel Sanctum is used for API token authentication. The frontend communicates with the backend using Axios to handle login, registration, and todo CRUD operations.

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
4. **Authentication Errors**: Check if the user is registered and credentials are correct

### Solutions

- Check both servers are running
- Verify database connection
- Check browser console for errors
- Use Postman or similar tool to test API endpoints directly

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
