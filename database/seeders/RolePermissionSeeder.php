<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin Role
        $adminRole = Role::create(['name' => 'Administrator']);
        $adminRole->givePermissionTo(Permission::all());

        // Create Officer Role
        $officerRole = Role::create(['name' => 'Officer']);
        $officerRole->givePermissionTo([
            'dashboard.view',
            'violation_registry.view',
            'violation_registry.create',
            'violation_report.view',
            'order_of_payment.view',
            'violation_list.view',
            'apprehending_officers.view',
            'booklet_inventory.view',
        ]);

        // Create Reports Manager Role
        $reportsRole = Role::create(['name' => 'Reports Manager']);
        $reportsRole->givePermissionTo([
            'dashboard.view',
            'violation_report.view',
            'violation_report.generate',
            'order_of_payment.view',
            'order_of_payment.create',
        ]);
    }
}
