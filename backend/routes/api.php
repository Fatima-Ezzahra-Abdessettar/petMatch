<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PetController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\AdoptionApplicationController;
use App\Http\Controllers\AuthController;

// ==========================================
// PUBLIC ROUTES
// ==========================================

Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:10,1');

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:10,1');

Route::get('/pets', [PetController::class, 'index']);

Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->name('verification.verify');

Route::post('/email/resend', [AuthController::class, 'resendVerificationEmail']);

// ==========================================
// AUTHENTICATED ROUTES (Both users & admins)
// ==========================================

Route::middleware('auth:sanctum')->group(function () {
    // Profile management (shared by both roles)
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // View pet details (both roles can view)
    Route::get('/pets/{pet}', [PetController::class, 'show']); // ← MOVED HERE!
});

// ==========================================
// USER ROUTES (Adopters only)
// ==========================================

Route::middleware(['auth:sanctum', 'role:user'])->group(function () {
    // Favorites (users only)
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/pets/{pet}/favorites', [FavoriteController::class, 'store']);
    Route::delete('/pets/{pet}/favorites', [FavoriteController::class, 'destroy']);
    
    // Adoption applications (users only)
    Route::get('/adoptions', [AdoptionApplicationController::class, 'mine']);
    Route::post('/adoption-applications', [AdoptionApplicationController::class, 'store']);
    Route::get('/adoption-applications/{adoptionApplication}', [AdoptionApplicationController::class, 'show']);
});

// ==========================================
// ADMIN ROUTES (Shelter staff only)
// ==========================================

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    // Pet management
    Route::get('/pets', [PetController::class, 'myPets']);
    Route::post('/pets', [PetController::class, 'store']);
    Route::put('/pets/{pet}', [PetController::class, 'update']);
    Route::delete('/pets/{pet}', [PetController::class, 'destroy']);
    Route::get('/pets/stats', [PetController::class, 'stats']);
    
    // Adoption application management
    Route::get('/adoption-applications', [AdoptionApplicationController::class, 'forMyShelter']);
    Route::get('/adoption-applications/{adoptionApplication}', [AdoptionApplicationController::class, 'show']);
    Route::put('/adoption-applications/{adoptionApplication}/status', [AdoptionApplicationController::class, 'updateStatus']);
});
