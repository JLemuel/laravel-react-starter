<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            // Dashboard
            'dashboard.view',
            'dashboard.manage',

            // Violation Registry
            'violation_registry.view',
            'violation_registry.create',
            'violation_registry.edit',
            'violation_registry.delete',

            // Reports
            'violation_report.view',
            'violation_report.create',
            'violation_report.generate',
            'order_of_payment.view',
            'order_of_payment.create',
            'order_of_payment.generate',

            // Maintenance
            'violation_list.view',
            'violation_list.edit',
            'violation_list.manage',
            'apprehending_officers.view',
            'apprehending_officers.edit',
            'apprehending_officers.manage',
            'booklet_inventory.view',
            'booklet_inventory.edit',
            'booklet_inventory.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        Permission::create(['name' => 'administrator.access', 'guard_name' => 'web']);
    }
}
