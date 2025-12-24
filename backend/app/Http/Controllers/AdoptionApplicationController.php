<?php

namespace App\Http\Controllers;

use App\Models\AdoptionApplication;
use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdoptionApplicationController extends Controller
{
    // POST /pets/{pet}/apply
    public function store(Request $request, Pet $pet)
    {
        $data = $request->validate([
            'form_data' => 'required|array',
        ]);

        $app = AdoptionApplication::create([
            'user_id' => Auth::id(),
            'pet_id' => $pet->id,
            'form_data' => $data['form_data'],
            'status' => 'pending',
        ]);

        return response()->json($app, 201);
    }

    // GET /me/adoptions (User's own applications)
    public function mine()
    {
        $applications = AdoptionApplication::where('user_id', Auth::id())
            ->with(['pet', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($applications, 200);
    }

    // GET /admin/adoption-applications (Admin views all applications for their shelter)
    public function forMyShelter()
    {
        $admin = Auth::user();
        
        // Get all applications for pets belonging to the admin's shelter
        $applications = AdoptionApplication::whereHas('pet', function ($query) use ($admin) {
            $query->where('shelter_id', $admin->shelter_id);
        })
        ->with(['pet', 'user'])
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json($applications, 200);
    }

    // GET /adoption-applications/{adoptionApplication} (View single application)
    public function show(AdoptionApplication $adoptionApplication)
    {
        $user = Auth::user();

        // Check authorization: user must own it OR be admin of the shelter
        if ($user->role === 'user') {
            if ($adoptionApplication->user_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        } elseif ($user->role === 'admin') {
            if ($adoptionApplication->pet->shelter_id !== $user->shelter_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        $adoptionApplication->load(['pet', 'user']);
        return response()->json($adoptionApplication, 200);
    }

    // PUT /adoptions/{adoptionApplication} (User edits their own application)
    public function update(Request $request, AdoptionApplication $adoptionApplication)
    {
        // Ensure user owns this application
        if ($adoptionApplication->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Only allow editing pending applications
        if ($adoptionApplication->status !== 'pending') {
            return response()->json(['message' => 'Cannot edit non-pending applications'], 400);
        }

        $data = $request->validate([
            'form_data' => 'required|array',
        ]);

        $adoptionApplication->update([
            'form_data' => $data['form_data'],
        ]);

        $adoptionApplication->load(['pet', 'user']);
        return response()->json($adoptionApplication, 200);
    }

    // PUT /adoptions/{adoptionApplication}/cancel (User cancels their application)
    public function cancel(AdoptionApplication $adoptionApplication)
    {
        // Ensure user owns this application
        if ($adoptionApplication->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Only allow canceling pending applications
        if ($adoptionApplication->status !== 'pending') {
            return response()->json(['message' => 'Can only cancel pending applications'], 400);
        }

        $adoptionApplication->update(['status' => 'canceled']);
        $adoptionApplication->load(['pet', 'user']);

        return response()->json([
            'message' => 'Application canceled successfully',
            'application' => $adoptionApplication
        ], 200);
    }

    // PUT /admin/adoption-applications/{adoptionApplication}/status (Admin approves/denies)
    public function updateStatus(Request $request, AdoptionApplication $adoptionApplication)
    {
        $admin = Auth::user();

        // Ensure admin manages the shelter that owns this pet
        if ($adoptionApplication->pet->shelter_id !== $admin->shelter_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'status' => 'required|in:pending,approved,denied,canceled',
        ]);

        $adoptionApplication->update([
            'status' => $data['status'],
        ]);

        $adoptionApplication->load(['pet', 'user']);

        return response()->json([
            'message' => "Application {$data['status']} successfully",
            'application' => $adoptionApplication
        ], 200);
    }
}