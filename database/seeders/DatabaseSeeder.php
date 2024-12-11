<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
        
        // Run seeders
        $this->call([
            PermissionSeeder::class,
            RolePermissionSeeder::class,
            // ... other seeders
        ]);
        
        // Assign admin role to user
        $user->assignRole('Administrator');

        $this->call([
            ViolationSeeder::class,
        ]);
    }
}
