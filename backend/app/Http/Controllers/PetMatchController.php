<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pet;

class PetMatchController extends Controller
{
    public function matchPets(Request $request) 
 {
    $preferences = $request->validate([
    'species' => 'array|nullable',
    'type' => 'array|nullable',
    'gender' => 'string|nullable',
    'age' => 'array|nullable',
    'age.min' => 'integer|nullable',
    'age.max' => 'integer|nullable',
    'status' => 'string|nullable',
    'keywords' => 'array|nullable',
    ]);

    // Set defaults if missing
    $preferences['species'] = $preferences['species'] ?? [];
    $preferences['type'] = $preferences['type'] ?? [];
    $preferences['gender'] = $preferences['gender'] ?? null;
    $preferences['age'] = $preferences['age'] ?? ['min' => null, 'max' => null];
    $preferences['status'] = $preferences['status'] ?? 'available';
    $preferences['keywords'] = $preferences['keywords'] ?? [];

    $pets = Pet::where('status', $preferences['status'])
    ->get();

    if ($pets->isEmpty()) {
        return response()->json([
            'pets' => [],
            'total' => 0,
            'message' => 'No available pets found at the moment 😔'
        ], 200); // 200 = OK, même si vide (c’est une réponse normale)
    }

    $scoredPets = [];

foreach ($pets as $pet) {
    $score = 0;

    // Species match
    if (!empty($preferences['species']) && in_array(strtolower($pet->species), array_map('strtolower', $preferences['species']))) {
        $score += 30;
    }

    // Type match
    if (!empty($preferences['type']) && in_array(strtolower($pet->type), array_map('strtolower', $preferences['type']))) {
        $score += 20;
    }

    // Gender match
    if ($preferences['gender'] && strtolower($pet->gender) === strtolower($preferences['gender'])) {
        $score += 10;
    }

    // Age match
    $ageMin = $preferences['age']['min'];
    $ageMax = $preferences['age']['max'];
    if (($ageMin === null || $pet->age >= $ageMin) && ($ageMax === null || $pet->age <= $ageMax)) {
        $score += 20;
    }

    // Keywords in description (check if any keyword is in the pet's description)
    foreach ($preferences['keywords'] as $keyword) {
        if (stripos($pet->description, $keyword) !== false) {
            $score += 10;
        }
    }

    // Store the pet with its score
    $scoredPets[] = [
        'id' => $pet->id,
        'name' => $pet->name,
        'species' => $pet->species,
        'type' => $pet->type,
        'age' => $pet->age,
        'gender' => $pet->gender,
        'description' => $pet->description,
        'profile_picture' => $pet->profile_picture,
        'score' => $score,
    ];
}
// Sort by score descending
usort($scoredPets, function ($a, $b) {
    return $b['score'] <=> $a['score'];
});

    /*
    // Optional: Filter out low scores (e.g., below 50)
    $scoredPets = array_filter($scoredPets, function ($pet) {
        return $pet['score'] >= 50;  // Adjust threshold
    });

    // Limit to top 10
    $topPets = array_slice($scoredPets, 0, 10);
    */
    
    $allMatchingPets = $scoredPets; // all pets by score

    return response()->json([
            'pets' => $allMatchingPets,
            'total' => count($allMatchingPets), // Bonus : on dit combien il y en a
            'message' => 'Here are all available pets, sorted by match score 🐾'
        ]);

  }
  
        
}
