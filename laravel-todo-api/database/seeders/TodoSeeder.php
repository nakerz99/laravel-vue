<?php

namespace Database\Seeders;

use App\Models\Todo;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TodoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some specific realistic todos
        $todos = [
            [
                'title' => 'Learn Laravel 11 new features',
                'description' => 'Explore the new features and improvements in Laravel 11, including the new directory structure and API improvements.',
                'completed' => true
            ],
            [
                'title' => 'Build Vue.js frontend components',
                'description' => 'Create reusable components for the todo application using Vue.js 3 and Bootstrap 5.',
                'completed' => true
            ],
            [
                'title' => 'Set up MySQL database',
                'description' => 'Configure MySQL database connection and run migrations for the todo application.',
                'completed' => true
            ],
            [
                'title' => 'Implement CRUD API endpoints',
                'description' => 'Create RESTful API endpoints for creating, reading, updating, and deleting todos.',
                'completed' => false
            ],
            [
                'title' => 'Add input validation',
                'description' => 'Implement proper validation for API requests to ensure data integrity.',
                'completed' => false
            ],
            [
                'title' => 'Write comprehensive tests',
                'description' => 'Create unit and feature tests to ensure the application works correctly.',
                'completed' => false
            ],
            [
                'title' => 'Deploy to production',
                'description' => 'Set up deployment pipeline and deploy the application to a production server.',
                'completed' => false
            ],
            [
                'title' => 'Optimize performance',
                'description' => 'Review and optimize database queries and frontend performance.',
                'completed' => false
            ],
            [
                'title' => 'Add user authentication',
                'description' => 'Implement user registration and login functionality using Laravel Sanctum.',
                'completed' => false
            ],
            [
                'title' => 'Document the API',
                'description' => 'Create comprehensive API documentation with examples and usage instructions.',
                'completed' => false
            ]
        ];

        // Get the first user (Test User) or create one if none exists
        $user = \App\Models\User::first() ?: \App\Models\User::factory()->create();

        foreach ($todos as $todo) {
            // Assign todos to the first user
            $todo['user_id'] = $user->id;
            Todo::create($todo);
        }

        // Also create some additional random todos using the factory with the user_id
        Todo::factory()->count(5)->create(['user_id' => $user->id]);
    }
}
