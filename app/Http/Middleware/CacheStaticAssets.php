<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CacheStaticAssets
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Add cache headers for static assets
        if ($this->isStaticAsset($request)) {
            $response->headers->set('Cache-Control', 'public, max-age=31536000, immutable');
            $response->headers->set('Expires', gmdate('D, d M Y H:i:s \G\M\T', time() + 31536000));
        }

        // Add compression headers
        $response->headers->set('Vary', 'Accept-Encoding');
        
        // Add security headers
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        return $response;
    }

    /**
     * Check if the request is for a static asset
     */
    private function isStaticAsset(Request $request): bool
    {
        $path = $request->path();
        
        return preg_match('/\.(css|js|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot)$/i', $path) ||
               str_starts_with($path, 'build/') ||
               str_starts_with($path, 'assets/') ||
               str_starts_with($path, 'images/');
    }
} 