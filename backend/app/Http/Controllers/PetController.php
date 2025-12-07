<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use App\Models\Shelter;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Auth\Access\AuthorizationException;

class PetController extends Controller
{
    // ==========================================
    // PUBLIC ROUTES
    // ==========================================

    // GET /pets - List all pets (public)
    public function index()
    {
        return Pet::with('shelter')->get();
    }

    // GET /pets/{pet} - View single pet 
    public function show(Pet $pet)
    {
        return $pet->load('shelter');
    }

    // ==========================================
    // ADMIN-ONLY ROUTES
    // ==========================================

    // GET /admin/pets - List MY shelter's pets
    public function myPets()
    {
        $user = Auth::user();
        
        // Check if user is admin with shelter
        if ($user->role !== 'admin' || !$user->shelter_id) {
            throw new AuthorizationException('Unauthorized. Only shelter admins can access this.');
        }

        return Pet::with('shelter')
            ->where('shelter_id', $user->shelter_id)
            ->get();
    }

    // POST /admin/pets - Create pet (admin only)
    public function store(Request $request)
    {
        // Check authorization using policy
        $this->authorize('create', Pet::class);

        $data = $request->validate([
            'name' => 'required|string',
            'species' => 'required|string',
            'type' => 'nullable|string',
            'age' => 'nullable|integer',
            'description' => 'nullable|string',
            'gender' => 'required|in:male,female,unknown',
            'status' => 'nullable|in:available,pending,adopted',
            'profile_picture' => 'required|image|max:2048',
        ]);

        // Handle image upload
        $path = $request->file('profile_picture')->store('pets', 'public');
        $data['profile_picture'] = '/storage/' . $path;

        // Auto-assign from logged-in admin
        $data['shelter_id'] = Auth::user()->shelter_id;
        $data['added_by'] = Auth::id();

        $pet = Pet::create($data);

        return response()->json([
            'message' => 'Pet created successfully',
            'pet' => $pet->load('shelter')
        ], 201);
    }

    // PUT /admin/pets/{pet} - Update pet (admin only)
    public function update(Request $request, Pet $pet)
    {
        // Check authorization using policy
        $this->authorize('update', $pet);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'species' => 'sometimes|required|string|max:100',
            'type' => 'sometimes|nullable|string|max:100',
            'age' => 'sometimes|nullable|integer|min:0',
            'description' => 'sometimes|nullable|string',
            'gender' => ['sometimes', 'required', 'in:male,female,unknown'],
            'status' => ['sometimes', 'required', 'in:available,pending,adopted'],
            'profile_picture' => 'sometimes|image|max:2048',
        ]);

        // Handle image if provided
        if ($request->hasFile('profile_picture')) {
            // Delete old image if it's local
            if ($pet->profile_picture && str_starts_with($pet->profile_picture, '/storage/')) {
                Storage::disk('public')->delete(
                    str_replace('/storage/', '', $pet->profile_picture)
                );
            }

            $path = $request->file('profile_picture')->store('pets', 'public');
            $data['profile_picture'] = '/storage/' . $path;
        }

        $pet->update($data);

        return response()->json([
            'message' => 'Pet updated successfully',
            'pet' => $pet->fresh()->load('shelter')
        ]);
    }

    // DELETE /admin/pets/{pet} - Delete pet (admin only)
    public function destroy(Pet $pet)
    {
        // Check authorization using policy
        $this->authorize('delete', $pet);

        // Delete image
        if ($pet->profile_picture && str_starts_with($pet->profile_picture, '/storage/')) {
            Storage::disk('public')->delete(
                str_replace('/storage/', '', $pet->profile_picture)
            );
        }

        $pet->delete();

        return response()->json([
            'message' => 'Pet deleted successfully'
        ], 200);
    }

    // GET /admin/pets/stats - Stats for MY shelter (admin only)
    public function stats()
    {
        $user = Auth::user();
        
        // Check if user is admin with shelter
        if ($user->role !== 'admin' || !$user->shelter_id) {
            throw new AuthorizationException('Unauthorized. Only shelter admins can access this.');
        }

        $shelterId = $user->shelter_id;

        return response()->json([
            'total' => Pet::where('shelter_id', $shelterId)->count(),
            'available' => Pet::where('shelter_id', $shelterId)->where('status', 'available')->count(),
            'pending' => Pet::where('shelter_id', $shelterId)->where('status', 'pending')->count(),
            'adopted' => Pet::where('shelter_id', $shelterId)->where('status', 'adopted')->count(),
        ]);
    }
}