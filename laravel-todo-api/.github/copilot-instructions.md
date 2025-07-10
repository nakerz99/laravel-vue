<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a Laravel 11 API project for a Todo application.

## Project Guidelines:
- Use Laravel 11 features and conventions
- API routes are defined in routes/api.php (installed via `php artisan install:api`)
- Use resource controllers for CRUD operations
- Models should use $fillable for mass assignment protection
- Use proper HTTP status codes for API responses
- Include CORS configuration for frontend communication
- Use MySQL database with proper migrations
- Follow PSR-12 coding standards

## Key Files:
- routes/api.php - API routes
- app/Http/Controllers/TodoController.php - Todo CRUD controller
- app/Models/Todo.php - Todo model
- database/migrations/*_create_todos_table.php - Todo table migration
- config/cors.php - CORS configuration
