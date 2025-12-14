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

    public function update(Request $request, AdoptionApplication $adoptionApplication) {
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

        return response()->json($adoptionApplication, 200);
    }

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

        return response()->json(['message' => 'Application canceled successfully'], 200);
    }
}
