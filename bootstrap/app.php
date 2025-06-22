<?php

use App\Http\Middleware\AdminAuth;
use App\Http\Middleware\CacheStaticAssets;
use App\Http\Middleware\DdosProtectionMiddleware;
use App\Http\Middleware\ForceHttps;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SeoMiddleware;
use App\Http\Middleware\SecurityMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->alias([
            'admin.auth' => AdminAuth::class,
        ]);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            SeoMiddleware::class,
        ]);

        // Add global middleware for security and protection
        $middleware->append(CacheStaticAssets::class);
        $middleware->prepend(ForceHttps::class);
        
        // Add security middleware to block suspicious requests
        $middleware->prepend(SecurityMiddleware::class);
        
        // Add DDoS protection middleware (highest priority)
        $middleware->prepend(DdosProtectionMiddleware::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
