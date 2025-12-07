<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PetController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\AdoptionApplicationController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Mail;

Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');// 10 tentatives d'inscription / heure
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');// 10 tentatives de connexion / minute (contre brute force)

Route::get('/pets', [PetController::class, 'index']); 
// un visiteur peut voir les pets mais ne peut ni favoriser ni adopter ni voir les détails

// Email verification route (accessible without auth)
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->name('verification.verify');

// resend verification email
Route::post('/email/resend', [AuthController::class, 'resendVerificationEmail']);
Route::get('/test-mail', function () {
    Mail::raw('MAIL IS WORKING 🎉', function ($m) {
        $m->to('test@test.com')->subject('Test Mail');
    });

    return 'mail sent';
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me/adoptions', [AdoptionApplicationController::class, 'mine']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/pets', [PetController::class, 'store']);
    Route::get('/pets/{pet}', [PetController::class, 'show']); // détails d'un animal
    Route::put('/pets/{pet}', [PetController::class, 'update']); // modifier un animal
    Route::delete('/pets/{pet}', [PetController::class, 'destroy']); // supprimer un animal
    Route::resource('adoption-applications', App\Http\Controllers\AdoptionApplicationController::class)->only(['store', 'index', 'show']); // déposer une demande d'adoption, voir toutes mes demandes, voir une demande spécifique
    // Ajouter/supprimer un favori pour un animal - LOGIQUE TOGGLE
    Route::post('/pets/{pet}/apply', [AdoptionApplicationController::class, 'store']); // apply for adopting
    Route::post('/pets/{pet}/favorites', [FavoriteController::class, 'store']); // ajouter aux favoris via toggle 
    Route::delete('/pets/{pet}/favorites', [FavoriteController::class, 'destroy']); // retirer des favoris also via toggle
    // Voir MES favoris
    Route::get('/me/favorites', [FavoriteController::class, 'index']); // liste des favoris de l'utilisateur connecté
});

// Routes admin protégées par le middleware 'role:admin' // uniquement accessibles aux admins // defined in CheckRole middleware 
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    // Routes admin spécifiques
    Route::post('/pets', [PetController::class, 'store']);
    Route::put('/pets/{pet}', [PetController::class, 'update']);
    Route::delete('/pets/{pet}', [PetController::class, 'destroy']);
    Route::get('/pets/stats', [PetController::class, 'stats']);
});