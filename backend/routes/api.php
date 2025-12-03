<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PetController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\AdoptionApplicationController;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');// 10 tentatives d'inscription / heure
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');// 10 tentatives de connexion / minute (contre brute force)

Route::get('/pets', [PetController::class, 'index']); 
// un visiteur peut voir les pets mais ne peut ni favoriser ni adopter ni voir les détails

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
    Route::post('/pets/{pet}/favorites', [FavoriteController::class, 'store']); // ajouter aux favoris
    Route::delete('/pets/{pet}/favorites', [FavoriteController::class, 'destroy']); // retirer des favoris
    // Voir MES favoris
    Route::get('/me/favorites', [FavoriteController::class, 'index']); // liste des favoris de l'utilisateur connecté
});
