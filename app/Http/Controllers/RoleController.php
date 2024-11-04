<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->get()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'totalUsers' => $role->users()->count(),
                'permissions' => $this->formatPermissions($role->permissions)
            ];
        });

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ],
        ]);
    }

    private function formatPermissions($permissions)
    {
        $formattedPermissions = [
            'administrator' => false,
            'dashboard' => [
                'view' => false,
                'manage' => false
            ],
            'violationRegistry' => [
                'view' => false,
                'create' => false,
                'edit' => false,
                'delete' => false
            ],
            'reports' => [
                'view' => false,
                'generate' => false,
                'create' => false
            ],
            'maintenance' => [
                'view' => false,
                'edit' => false,
                'manage' => false
            ],
        ];

        foreach ($permissions as $permission) {
            // Check for administrator role
            if ($permission->name === 'administrator.access') {
                $formattedPermissions['administrator'] = true;
                continue;
            }

            // Parse permission name (e.g., "violation_registry.view" => ["violation_registry", "view"])
            [$module, $action] = explode('.', $permission->name);

            // Map the permissions to our structure
            switch ($module) {
                case 'dashboard':
                    $formattedPermissions['dashboard'][$action] = true;
                    break;

                case 'violation_registry':
                    $formattedPermissions['violationRegistry'][$action] = true;
                    break;

                case 'violation_report':
                case 'order_of_payment':
                    $formattedPermissions['reports'][$action] = true;
                    break;

                case 'violation_list':
                case 'apprehending_officers':
                case 'booklet_inventory':
                    $formattedPermissions['maintenance'][$action] = true;
                    break;
            }
        }

        return $formattedPermissions;
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name',
            'permissions' => 'required|array'
        ]);

        $role = Role::create(['name' => $request->name]);
        
        // Sync permissions
        $permissions = $this->mapPermissionsToDatabase($request->permissions);
        $role->syncPermissions($permissions);

        return redirect()->route('roles.index')->with('success', 'Role created successfully.');
    }

    public function edit(Role $role)
    {
        $formattedRole = [
            'id' => $role->id,
            'name' => $role->name,
            'permissions' => $this->formatPermissions($role->permissions)
        ];

        return Inertia::render('Roles/Edit', ['role' => $formattedRole]);
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|unique:roles,name,' . $role->id,
            'permissions' => 'required|array'
        ]);

        // Update role name
        $role->name = $request->name;
        $role->save();

        // Sync permissions
        $permissions = $this->mapPermissionsToDatabase($request->permissions);
        $role->syncPermissions($permissions);

        return redirect()->route('roles.index')->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role)
    {
        // Prevent deletion if users are assigned to this role
        if ($role->users()->count() > 0) {
            return back()->with('error', 'Cannot delete role with assigned users.');
        }

        $role->delete();
        return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
    }

    private function mapPermissionsToDatabase($permissions)
    {
        // Get all valid permissions from database
        $validPermissions = Permission::pluck('name')->toArray();
        $dbPermissions = [];

        // Handle administrator permission
        if ($permissions['administrator'] && in_array('administrator.access', $validPermissions)) {
            $dbPermissions[] = 'administrator.access';
        }

        // Map dashboard permissions
        if ($permissions['dashboard']['view'] && in_array('dashboard.view', $validPermissions)) $dbPermissions[] = 'dashboard.view';
        if ($permissions['dashboard']['manage'] && in_array('dashboard.manage', $validPermissions)) $dbPermissions[] = 'dashboard.manage';

        // Map violation registry permissions
        if ($permissions['violationRegistry']['view'] && in_array('violation_registry.view', $validPermissions)) $dbPermissions[] = 'violation_registry.view';
        if ($permissions['violationRegistry']['edit'] && in_array('violation_registry.edit', $validPermissions)) $dbPermissions[] = 'violation_registry.edit';
        if ($permissions['violationRegistry']['create'] && in_array('violation_registry.create', $validPermissions)) $dbPermissions[] = 'violation_registry.create';
        if ($permissions['violationRegistry']['delete'] && in_array('violation_registry.delete', $validPermissions)) $dbPermissions[] = 'violation_registry.delete';

        // Map reports permissions
        if ($permissions['reports']['view']) {
            $reportViewPermissions = ['violation_report.view', 'order_of_payment.view'];
            $dbPermissions = array_merge($dbPermissions, array_intersect($reportViewPermissions, $validPermissions));
        }
        if ($permissions['reports']['generate']) {
            $reportGeneratePermissions = ['violation_report.generate', 'order_of_payment.generate'];
            $dbPermissions = array_merge($dbPermissions, array_intersect($reportGeneratePermissions, $validPermissions));
        }
        if ($permissions['reports']['create']) {
            $reportCreatePermissions = ['violation_report.create', 'order_of_payment.create'];
            $dbPermissions = array_merge($dbPermissions, array_intersect($reportCreatePermissions, $validPermissions));
        }

        // Map maintenance permissions
        $maintenanceModules = ['violation_list', 'apprehending_officers', 'booklet_inventory'];
        foreach ($maintenanceModules as $module) {
            if ($permissions['maintenance']['view']) {
                $viewPermission = "$module.view";
                if (in_array($viewPermission, $validPermissions)) $dbPermissions[] = $viewPermission;
            }
            if ($permissions['maintenance']['edit']) {
                $editPermission = "$module.edit";
                if (in_array($editPermission, $validPermissions)) $dbPermissions[] = $editPermission;
            }
            if ($permissions['maintenance']['manage']) {
                $managePermission = "$module.manage";
                if (in_array($managePermission, $validPermissions)) $dbPermissions[] = $managePermission;
            }
        }

        return $dbPermissions;
    }
}
