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

    // GET /me/adoptions
    public function mine()
    {
        return AdoptionApplication::where('user_id', Auth::id())->get();
    }
}
