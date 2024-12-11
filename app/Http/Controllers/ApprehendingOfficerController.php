<?php

namespace App\Http\Controllers;

use App\Http\Requests\ApprehendingOfficerRequest;
use App\Http\Resources\ApprehendingOfficerResource;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApprehendingOfficerController extends Controller
{
    public function index()
    {
        $officers = User::role('Apprehending Officer')
            ->with('officerProfile')
            ->get();

        return Inertia::render('ApprehendingOfficers/Index', [
            'officers' => ApprehendingOfficerResource::collection($officers),
            'flash' => [
                'message' => session('message')
            ],
        ]);
    }

    public function store(ApprehendingOfficerRequest $request)
    {
        try {
            $validated = $request->validated();

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'username' => $validated['username'],
                'password' => bcrypt($validated['password']),
            ]);

            $user->assignRole('Apprehending Officer');

            $user->officerProfile()->create([
                'designation' => $validated['designation'],
                'contact_number' => $validated['contact_number'],
            ]);

            return redirect()->back()->with('message', [
                'type' => 'success',
                'text' => 'Officer added successfully'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => 'Failed to create officer: ' . $e->getMessage()
            ]);
        }
    }

    public function update(ApprehendingOfficerRequest $request, User $apprehendingOfficer)
    {
        try {
            $validated = $request->validated();

            $apprehendingOfficer->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'username' => $validated['username'],
            ]);

            $apprehendingOfficer->officerProfile->update([
                'designation' => $validated['designation'],
                'contact_number' => $validated['contact_number'],
                'status' => $validated['status'],
            ]);

            return back()->with('message', [
                'type' => 'success',
                'text' => 'Officer updated successfully'
            ]);
        } catch (\Exception $e) {
            return back()->with('message', [
                'type' => 'error',
                'text' => $e->getMessage()
            ]);
        }
    }

    public function destroy(User $apprehendingOfficer)
    {
        try {
            $apprehendingOfficer->delete();
            
            return redirect()->back()->with('message', [
                'type' => 'success',
                'text' => 'Officer deleted successfully'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => 'Failed to delete officer'
            ]);
        }
    }
} 