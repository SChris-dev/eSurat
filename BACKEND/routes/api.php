<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DownloadController;
use App\Http\Controllers\LetterController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserController;

// Authentication routes
Route::post('/v1/login', [AuthController::class, 'login']);
Route::post('/v1/register', [AuthController::class, 'register']);
Route::post('/v1/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Protected routes (harus login)
Route::middleware('auth:sanctum')->group(function () {

    // Letter Routes
    Route::get('/v1/letters', [LetterController::class, 'index']);
    Route::post('/v1/letters', [LetterController::class, 'store']);
    Route::get('/v1/letters/{id}', [LetterController::class, 'show']);
    Route::put('/v1/letters/{id}', [LetterController::class, 'update']);
    Route::delete('/v1/letters/{id}', [LetterController::class, 'destroy']);

    // Download Routes
    Route::get('/v1/downloads', [DownloadController::class, 'index']);
    Route::post('/v1/letters/{id}/download', [DownloadController::class, 'store']);

    // Category Routes (admin only)
    Route::get('/v1/categories', [CategoryController::class, 'index']);
    Route::post('/v1/categories', [CategoryController::class, 'store']);
    Route::get('/v1/categories/{id}', [CategoryController::class, 'show']);
    Route::put('/v1/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/v1/categories/{id}', [CategoryController::class, 'destroy']);

    // User Routes (admin only)
    Route::get('/v1/users', [UserController::class, 'index']);
    Route::post('/v1/users', [UserController::class, 'store']);
    Route::put('/v1/users/{id}', [UserController::class, 'update']);
    Route::delete('/v1/users/{id}', [UserController::class, 'destroy']);
});
