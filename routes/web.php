<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ViolationController;
use App\Http\Controllers\ApprehendingOfficerController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    Route::resource('roles', RoleController::class);
    Route::resource('users', UserController::class);
    Route::patch('/users/{user}/roles', [UserController::class, 'updateRoles'])->name('users.roles.update');
    Route::patch('/users/{user}/password', [UserController::class, 'updatePassword'])->name('users.password.update');

    Route::resource('violations', ViolationController::class);
    Route::resource('apprehending-officers', ApprehendingOfficerController::class)
        ->parameters([
            'apprehending-officers' => 'apprehendingOfficer'
        ])
        ->middleware(['auth', 'verified']);
});


require __DIR__.'/auth.php';
