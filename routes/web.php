<?php

use App\Http\Controllers\ControlPanel\AuthController;
use App\Http\Controllers\SocialMediaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Make sure the route for the welcome page exists and uses proper capitalization
Route::get('/', function () {
    return inertia('Welcome');
});

// Products page route
Route::get('/products', function () {
    return inertia('Products');
});

// Terms of Service page
Route::get('/tos', function () {
    return inertia('TermsOfService');
})->name('tos');

// Social media products route
Route::get('/products/social/{category}', [SocialMediaController::class, 'show'])->name('products.social');

// API route for searching services
Route::get('/api/services/search', [SocialMediaController::class, 'search'])->name('services.search');

// Order routes
Route::get('/order/create', [App\Http\Controllers\OrderController::class, 'create'])->name('order.create');
Route::post('/order/store', [App\Http\Controllers\OrderController::class, 'store'])->name('order.store');
Route::get('/order/{orderId}/payment', [App\Http\Controllers\OrderController::class, 'payment'])->name('order.payment');
Route::get('/order/{orderId}/status', [App\Http\Controllers\OrderController::class, 'status'])->name('order.status');
Route::get('/order/{orderId}/check-status', [App\Http\Controllers\OrderController::class, 'checkStatus'])->name('order.check-status');
Route::post('/webhook/midtrans', [App\Http\Controllers\OrderController::class, 'webhook'])->name('webhook.midtrans');

// Control Panel Routes
Route::prefix('control-panel')->name('control-panel.')->group(function () {
    // Redirect /control-panel to login
    Route::get('/', function () {
        return redirect()->route('control-panel.login');
    });
    
    // Login routes (accessible without authentication)
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.submit');
    
    // Protected routes (require admin authentication)
    Route::middleware('admin.auth')->group(function () {
        Route::get('/dashboard', [AuthController::class, 'dashboard'])->name('dashboard');
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    });
});

// Test routes for error pages
Route::get('/error/{code}', function ($code) {
    abort($code);
})->where('code', '401|403|404|419|429|500|503');

// Add error handling fallback routes
Route::fallback(function () {
    return inertia('errors/ErrorPage', [
        'status' => 404,
        'statusText' => 'Not Found',
        'message' => 'The page you are looking for could not be found.'
    ]);
});

// Add test route for error page
Route::get('/test-error', function () {
    return inertia('errors/ErrorPage', [
        'status' => 500,
        'statusText' => 'Server Error',
        'message' => 'This is a test error page.'
    ]);
});

// Test route that forces a 404
Route::get('/force-404', function () {
    abort(404);
});
