<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use App\Http\Requests\UserRequest;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'roles' => $user->roles->pluck('name'),
                'created_at' => $user->created_at->format('M d, Y')
            ];
        });

        return Inertia::render('Users/Index', [
            'users' => $users,
            'availableRoles' => Role::all()->pluck('name'),
            'flash' => [
                'message' => session('message')
            ],
        ]);
    }

    public function updateRoles(Request $request, User $user)
    {
        $request->validate([
            'roles' => ['required', 'array'],
            'roles.*' => ['required', 'string', Rule::exists('roles', 'name')]
        ]);

        $user->syncRoles($request->roles);

        return redirect()->back()->with('message', [
            'type' => 'success',
            'text' => 'User roles updated successfully'
        ]);
    }

    public function store(UserRequest $request)
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->syncRoles($validated['roles']);

        return redirect()->back()->with('message', [
            'type' => 'success',
            'text' => 'User created successfully'
        ]);
    }

    public function destroy(User $user)
    {
        if (auth()->id() === $user->id) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => 'You cannot delete your own account.'
            ]);
        }

        $user->delete();
        
        return redirect()->back()->with('message', [
            'type' => 'success',
            'text' => 'User deleted successfully'
        ]);
    }

    public function updatePassword(Request $request, User $user)
    {
        $validated = $request->validate([
            'password' => ['required', Password::defaults()],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->back()->with('message', [
            'type' => 'success',
            'text' => 'Password updated successfully'
        ]);
    }

    public function update(UserRequest $request, User $user)
    {
        $validated = $request->validated();
        
        $userData = [
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
        ];

        if (!empty($validated['password'])) {
            $userData['password'] = Hash::make($validated['password']);
        }

        $user->update($userData);
        $user->syncRoles($validated['roles']);

        return redirect()->back()->with('message', [
            'type' => 'success',
            'text' => 'User updated successfully'
        ]);
    }
}
