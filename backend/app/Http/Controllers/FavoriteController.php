<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Pet;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
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
}
