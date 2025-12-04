<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PetController extends Controller
{
    // GET /pets - liste des animaux
    public function index()
    {
        return Pet::with('shelter')->get('*') ; //pagination gérée coté front end
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
        ]);

        // Assigner automatiquement le refuge de l'admin connecté
        $data['shelter_id'] = Auth::user()->shelter_id;

        // Enregistrer l'utilisateur qui ajoute
        $data['added_by'] = Auth::id();

        $pet = Pet::create($data);

        return response()->json($pet, 201);
    }
}
