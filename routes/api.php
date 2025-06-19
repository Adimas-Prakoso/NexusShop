<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CallbackController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make routes for use
| with API!
|
*/

// API Callback route for all payment providers (IAK, MedanPedia, VIPReseller, APIGames, etc.)
Route::match(['get', 'post'], '/callback', [CallbackController::class, 'handle'])->name('api.callback');

// You can also use source parameter to specify the provider:
// Example: /api/callback?source=iak
// Example: /api/callback?source=medanpedia
