<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Find the first user
        $user = DB::table('users')->first();
        
        if ($user) {
            // Update all existing todos without a user_id to use this user
            DB::table('todos')
                ->whereNull('user_id')
                ->update(['user_id' => $user->id]);
        }
    }

    /**
     * Reverse the migrations.
     * 
     * No need to reverse this as it's just data cleanup
     */
    public function down(): void
    {
        // No action needed for rollback
    }
};
