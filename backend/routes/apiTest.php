<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// EN DEHORS de tout middleware
Route::post('/test-register', [AuthController::class, 'register']);
Route::post('/test-login', [AuthController::class, 'login']);

// Test avec curl
// curl -X POST http://localhost:8000/apiTest/test-login ...
