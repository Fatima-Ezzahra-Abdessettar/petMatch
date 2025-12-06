<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PetController extends Controller //theres no need for implementing middleware here as it's done in routes/api.php
{
    // GET /pets - liste des animaux
    public function index()
    {
        return Pet::with('shelter')->get('*'); //pagination gérée coté front end
    }

    // GET /pets/{id}
    public function show(Pet $pet)
    {
        return $pet->load('shelter');
    }

    // POST /pets - ajouter un animal (protégé par auth)
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'species' => 'required|string',
            'type' => 'nullable|string',
            'age' => 'nullable|integer',
            'description' => 'nullable|string',
            'gender' => 'required|in:male,female,unknown',
            'status' => 'required|in:available,pending,adopted',
            'profile_picture' => 'required|image|max:2048', // 2MB
        ]);
        $path = $request->file('profile_picture')->store('pets', 'public');
        $data['profile_picture'] = '/storage/' . $path;

        // Assigner automatiquement le refuge de l'admin connecté
        $data['shelter_id'] = Auth::user()->shelter_id;

        // Enregistrer l'utilisateur qui ajoute
        $data['added_by'] = Auth::id();

        $pet = Pet::create($data);

        return response()->json($pet, 201);
    }

    // PUT /pets/{id} - mettre à jour un animal (protégé par auth)
    public function update(Request $request, Pet $pet)
    {
        // Authorization check 
        // we can either do it here or create a Policy for Pet model
        //        if (Auth::user()->id !== $pet->added_by) if we wanna be strict but logically a shelter admin can change , 
        // so an other admin taking care of the same shelter should be able to update too
        if (Auth::user()->shelter_id !== $pet->shelter_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'species' => 'sometimes|required|string|max:100',
            // These can be null in DB → allow null if sent
            'type' => 'sometimes|nullable|string|max:100',
            'age' => 'sometimes|nullable|integer|min:0',
            'description' => 'sometimes|nullable|string',
            // These are NOT nullable in DB → never allow null
            'gender' => ['sometimes', 'required', 'in:male,female,unknown'],
            'status' => ['sometimes', 'required', 'in:available,pending,adopted'],
            'profile_picture' => 'sometimes|required|image|max:2048', // 2MB
        ]);
        if ($request->hasFile('profile_picture')) {
            // delete old image if it's local
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
            'pet' => $pet->fresh()
        ]);
    }

}
