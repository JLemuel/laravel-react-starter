<?php

namespace App\Http\Controllers;

use App\Models\Violation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ViolationController extends Controller
{
    public function index()
    {
        $violations = Violation::all();

        return Inertia::render('Violations/Index', [
            'violations' => $violations,
            'flash' => [
                'message' => session('message')
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'ordinance_number' => 'required|string|max:255',
            'penalties' => 'required|array',
            'penalties.*.offense' => 'required|string',
            'penalties.*.amount' => 'required|numeric',
        ]);

        Violation::create($validated);

        return redirect()->back()->with('message', [
            'type' => 'success',
            'text' => 'Violation added successfully'
        ]);
    }

    public function update(Request $request, Violation $violation)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'ordinance_number' => 'required|string|max:255',
            'penalties' => 'required|array',
            'penalties.*.offense' => 'required|string',
            'penalties.*.amount' => 'required|numeric',
        ]);

        $violation->update($validated);

        return redirect()->back()->with('message', [
            'type' => 'success',
            'text' => 'Violation updated successfully'
        ]);
    }

    public function destroy(Violation $violation)
    {
        $violation->delete();

        return redirect()->back()->with('message', [
            'type' => 'success',
            'text' => 'Violation deleted successfully'
        ]);
    }
} 