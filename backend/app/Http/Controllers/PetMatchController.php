<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pet;
use Illuminate\Support\Facades\Log;

class PetMatchController extends Controller
{
    public function matchPets(Request $request) 
 {
    // Use extractPreferences(UserPreferenceController) result to drive matching
    // Expecting a 'user_message' in the request; if not present, fall back to prior validation shape
    $preferences = null;
    try {
        if ($request->filled('user_message')) {
            // Call the other controller method directly to reuse its normalization
            $prefController = new UserPreferenceController();
            $prefResponse = $prefController->extractPreferences($request);

            if (method_exists($prefResponse, 'getStatusCode') && $prefResponse->getStatusCode() === 200) {
                $payload = $prefResponse->getData(true);
                $preferences = $payload['preferences'] ?? null;
            }
        }
    } catch (\Throwable $e) {
        Log::error('matchPets: failed to extract preferences: ' . $e->getMessage());
    }

    // Fallback: validate raw fields if AI extraction not used or failed
    if ($preferences === null) {
        $validated = $request->validate([
            'species' => 'array|nullable',
            'type' => 'array|nullable',
            'gender' => 'string|nullable',
            'age' => 'array|nullable',
            'age.min' => 'integer|nullable',
            'age.max' => 'integer|nullable',
            'status' => 'string|nullable',
            'keywords' => 'array|nullable',
        ]);
        $preferences = [
            'species' => $validated['species'] ?? [],
            'type' => $validated['type'] ?? [],
            'gender' => $validated['gender'] ?? null,
            'age' => $validated['age'] ?? ['min' => null, 'max' => null],
            'status' => $validated['status'] ?? 'available',
            'keywords' => $validated['keywords'] ?? [],
        ];
    }

    // Ensure defaults and shapes
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
        ], 200);
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

    // Keywords in description
    foreach ($preferences['keywords'] as $keyword) {
        if (!empty($keyword) && stripos((string)($pet->description ?? ''), (string)$keyword) !== false) {
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

    $allMatchingPets = $scoredPets; // all pets by score

    return response()->json([
            'pets' => $allMatchingPets,
            'total' => count($allMatchingPets),
            'message' => 'Here are all available pets, sorted by match score 🐾'
        ]);

  }
  
        
}
