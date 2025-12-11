<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Pet;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    // Lister mes favoris (GET /me/favorites)
    public function index()
    {
        $favorites = Auth::user()->favoritePets()->get(); // Utilise belongsToMany pour charger pets
        return response()->json($favorites);
    }

    public function toggle(Pet $pet)
    {
        $favorite = Favorite::where('user_id', Auth::id())
            ->where('pet_id', $pet->id)
            ->first();

        if ($favorite) {
            $favorite->delete();
            return ['message' => 'Removed from favorites'];
        }

        Favorite::create([
            'user_id' => Auth::id(),
            'pet_id' => $pet->id,
        ]);

        return ['message' => 'Added to favorites'];
    }

    // Add favorite (POST /pets/{pet}/favorites)
    public function store(Pet $pet)
    {
        $existing = Favorite::where('user_id', Auth::id())
            ->where('pet_id', $pet->id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Already in favorites'], 200);
        }

        $favorite = Favorite::create([
            'user_id' => Auth::id(),
            'pet_id' => $pet->id,
        ]);

        return response()->json(['message' => 'Added to favorites', 'favorite' => $favorite], 201);
    }

    // Remove favorite (DELETE /pets/{pet}/favorites)
    public function destroy(Pet $pet)
    {
        $favorite = Favorite::where('user_id', Auth::id())
            ->where('pet_id', $pet->id)
            ->first();

        if (!$favorite) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $favorite->delete();

        return response()->json(['message' => 'Removed from favorites'], 200);
    }
}
