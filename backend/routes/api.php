<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PetController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\AdoptionApplicationController;
use App\Http\Controllers\AuthController;

Route::get('/pets', [PetController::class, 'index']);
Route::get('/pets/{pet}', [PetController::class, 'show']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/test', function () {
    return response()->json(['message' => 'API OK']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/pets', [PetController::class, 'store']);
    Route::post('/favorites/{pet}', [FavoriteController::class, 'toggle']);
    Route::post('/pets/{pet}/apply', [AdoptionApplicationController::class, 'store']);
    Route::get('/me/adoptions', [AdoptionApplicationController::class, 'mine']);
    Route::post('/logout', [AuthController::class, 'logout']);

});


