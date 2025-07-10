<?php

namespace Tests\Unit;

use App\Models\Todo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TodoModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_todo_can_be_created_with_required_fields(): void
    {
        $todo = Todo::create([
            'title' => 'Test Todo',
            'description' => 'Test Description',
            'completed' => false
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
            'completed' => false
        ]);

        $this->assertInstanceOf(Todo::class, $todo);
        $this->assertEquals('Test Todo', $todo->title);
        $this->assertNull($todo->description);
        $this->assertFalse($todo->completed);
    }

    public function test_todo_completed_defaults_to_false(): void
    {
        $todo = Todo::create([
            'title' => 'Test Todo'
        ]);

        $this->assertFalse($todo->completed);
    }

    public function test_todo_completed_is_cast_to_boolean(): void
    {
        $todo = Todo::create([
            'title' => 'Test Todo',
            'completed' => 1
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
        
        $expectedFillable = ['title', 'description', 'completed'];
        $this->assertEquals($expectedFillable, $todo->getFillable());
    }

    public function test_todo_casts_attributes(): void
    {
        $todo = new Todo();
        
        // Laravel 11 automatically adds 'id' => 'int' cast
        $casts = $todo->getCasts();
        $this->assertArrayHasKey('completed', $casts);
        $this->assertEquals('boolean', $casts['completed']);
    }
}
