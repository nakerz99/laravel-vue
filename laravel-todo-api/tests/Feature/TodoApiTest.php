<?php

namespace Tests\Feature;

use App\Models\Todo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TodoApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function test_can_get_all_todos(): void
    {
        // Create some test todos
        Todo::factory()->count(3)->create();

        $response = $this->getJson('/api/todos');

        $response->assertStatus(200)
                 ->assertJsonCount(3)
                 ->assertJsonStructure([
                     '*' => ['id', 'title', 'description', 'completed', 'created_at', 'updated_at']
                 ]);
    }

    public function test_can_create_todo_with_title_and_description(): void
    {
        $todoData = [
            'title' => 'Test Todo',
            'description' => 'Test Description'
        ];

        $response = $this->postJson('/api/todos', $todoData);

        $response->assertStatus(201)
                 ->assertJsonStructure(['id', 'title', 'description', 'completed', 'created_at', 'updated_at'])
                 ->assertJson([
                     'title' => 'Test Todo',
                     'description' => 'Test Description',
                     'completed' => false
                 ]);

        $this->assertDatabaseHas('todos', $todoData);
    }

    public function test_can_create_todo_with_only_title(): void
    {
        $todoData = [
            'title' => 'Test Todo'
        ];

        $response = $this->postJson('/api/todos', $todoData);

        $response->assertStatus(201)
                 ->assertJson([
                     'title' => 'Test Todo',
                     'completed' => false
                 ])
                 ->assertJsonStructure(['id', 'title', 'completed', 'created_at', 'updated_at']);

        // Check that description is null in the database
        $this->assertDatabaseHas('todos', [
            'title' => 'Test Todo',
            'description' => null,
            'completed' => false
        ]);
    }

    public function test_cannot_create_todo_without_title(): void
    {
        $response = $this->postJson('/api/todos', [
            'description' => 'Test Description'
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors('title');
    }

    public function test_title_must_not_exceed_255_characters(): void
    {
        $response = $this->postJson('/api/todos', [
            'title' => str_repeat('a', 256)
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors('title');
    }

    public function test_can_get_single_todo(): void
    {
        $todo = Todo::factory()->create();

        $response = $this->getJson("/api/todos/{$todo->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $todo->id,
                     'title' => $todo->title,
                     'description' => $todo->description,
                     'completed' => $todo->completed
                 ]);
    }

    public function test_returns_404_for_non_existent_todo(): void
    {
        $response = $this->getJson('/api/todos/999');

        $response->assertStatus(404);
    }

    public function test_can_update_todo(): void
    {
        $todo = Todo::factory()->create([
            'title' => 'Original Title',
            'completed' => false
        ]);

        $updateData = [
            'title' => 'Updated Title',
            'completed' => true
        ];

        $response = $this->putJson("/api/todos/{$todo->id}", $updateData);

        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $todo->id,
                     'title' => 'Updated Title',
                     'completed' => true
                 ]);

        $this->assertDatabaseHas('todos', [
            'id' => $todo->id,
            'title' => 'Updated Title',
            'completed' => true
        ]);
    }

    public function test_can_partial_update_todo(): void
    {
        $todo = Todo::factory()->create([
            'title' => 'Original Title',
            'completed' => false
        ]);

        $response = $this->putJson("/api/todos/{$todo->id}", [
            'completed' => true
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $todo->id,
                     'title' => 'Original Title', // Should remain unchanged
                     'completed' => true
                 ]);
    }

    public function test_can_delete_todo(): void
    {
        $todo = Todo::factory()->create();

        $response = $this->deleteJson("/api/todos/{$todo->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('todos', ['id' => $todo->id]);
    }

    public function test_returns_404_when_deleting_non_existent_todo(): void
    {
        $response = $this->deleteJson('/api/todos/999');

        $response->assertStatus(404);
    }

    public function test_todos_are_ordered_by_created_at_desc(): void
    {
        // Create todos with specific timestamps
        $todo1 = Todo::factory()->create(['title' => 'First Todo']);
        sleep(1); // Ensure different timestamps
        $todo2 = Todo::factory()->create(['title' => 'Second Todo']);
        sleep(1);
        $todo3 = Todo::factory()->create(['title' => 'Third Todo']);

        $response = $this->getJson('/api/todos');

        $response->assertStatus(200);
        
        $todos = $response->json();
        
        // Should be ordered by created_at desc (newest first)
        $this->assertEquals('Third Todo', $todos[0]['title']);
        $this->assertEquals('Second Todo', $todos[1]['title']);
        $this->assertEquals('First Todo', $todos[2]['title']);
    }

    public function test_completed_field_is_boolean_in_response(): void
    {
        $todo = Todo::factory()->completed()->create();

        $response = $this->getJson("/api/todos/{$todo->id}");

        $response->assertStatus(200);
        $this->assertTrue(is_bool($response->json('completed')));
    }
}
