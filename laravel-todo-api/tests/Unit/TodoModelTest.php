<?php

namespace Tests\Unit;

use App\Models\Todo;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TodoModelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a test user for todos
        User::factory()->create([
            'id' => 1,
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }

    public function test_todo_can_be_created_with_required_fields(): void
    {
        $todo = Todo::create([
            'title' => 'Test Todo',
            'description' => 'Test Description',
            'completed' => false,
            'user_id' => 1
        ]);

        $this->assertInstanceOf(Todo::class, $todo);
        $this->assertEquals('Test Todo', $todo->title);
        $this->assertEquals('Test Description', $todo->description);
        $this->assertFalse($todo->completed);
    }

    public function test_todo_can_be_created_without_description(): void
    {
        $todo = Todo::create([
            'title' => 'Test Todo',
            'completed' => false,
            'user_id' => 1
        ]);

        $this->assertInstanceOf(Todo::class, $todo);
        $this->assertEquals('Test Todo', $todo->title);
        $this->assertNull($todo->description);
        $this->assertFalse($todo->completed);
    }

    public function test_todo_completed_defaults_to_false(): void
    {
        $todo = Todo::create([
            'title' => 'Test Todo',
            'user_id' => 1
        ]);

        $this->assertFalse($todo->completed);
    }

    public function test_todo_completed_is_cast_to_boolean(): void
    {
        $todo = Todo::create([
            'title' => 'Test Todo',
            'completed' => 1,
            'user_id' => 1
        ]);

        $this->assertTrue($todo->completed);
        $this->assertIsBool($todo->completed);
    }

    public function test_todo_factory_creates_valid_todo(): void
    {
        $todo = Todo::factory()->create();

        $this->assertInstanceOf(Todo::class, $todo);
        $this->assertNotEmpty($todo->title);
        $this->assertIsBool($todo->completed);
    }

    public function test_todo_factory_can_create_completed_todo(): void
    {
        $todo = Todo::factory()->completed()->create();

        $this->assertTrue($todo->completed);
    }

    public function test_todo_factory_can_create_pending_todo(): void
    {
        $todo = Todo::factory()->pending()->create();

        $this->assertFalse($todo->completed);
    }

    public function test_todo_fillable_attributes(): void
    {
        $todo = new Todo();
        
        $expectedFillable = ['title', 'description', 'completed', 'user_id', 'due_date'];
        $this->assertEquals($expectedFillable, $todo->getFillable());
    }

    public function test_todo_casts_attributes(): void
    {
        $todo = new Todo();
        
        // Laravel 11 automatically adds 'id' => 'int' cast
        $casts = $todo->getCasts();
        $this->assertArrayHasKey('completed', $casts);
        $this->assertEquals('boolean', $casts['completed']);
        $this->assertArrayHasKey('due_date', $casts);
        $this->assertEquals('date', $casts['due_date']);
    }

    public function test_todo_due_date_can_be_set(): void
    {
        $dueDate = new \DateTime('2025-08-15');
        $todo = Todo::create([
            'title' => 'Test Todo',
            'due_date' => $dueDate
        ]);

        $this->assertInstanceOf(Todo::class, $todo);
        $this->assertEquals('Test Todo', $todo->title);
        $this->assertInstanceOf(\DateTime::class, $todo->due_date);
        $this->assertEquals($dueDate->format('Y-m-d'), $todo->due_date->format('Y-m-d'));
    }

    public function test_todos_are_ordered_by_due_date_desc(): void
    {
        // Create todos with different due dates
        $todo1 = Todo::create([
            'title' => 'Todo 1',
            'due_date' => new \DateTime('2025-08-01')
        ]);

        $todo2 = Todo::create([
            'title' => 'Todo 2',
            'due_date' => new \DateTime('2025-08-15')
        ]);

        $todo3 = Todo::create([
            'title' => 'Todo 3',
            'due_date' => null
        ]);

        // Get todos ordered by due_date desc
        $todos = Todo::orderBy('due_date', 'desc')->get();

        // Todos with due dates should come first, in descending order, then null due dates
        $this->assertEquals($todo2->id, $todos[0]->id);
        $this->assertEquals($todo1->id, $todos[1]->id);
        $this->assertEquals($todo3->id, $todos[2]->id);
    }
}
