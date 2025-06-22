<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForceHttps
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Set trusted proxies for Cloudflare and other CDNs
        if (app()->environment('production')) {
            $request->setTrustedProxies(
                ['0.0.0.0/0'], 
                Request::HEADER_X_FORWARDED_FOR | 
                Request::HEADER_X_FORWARDED_HOST | 
                Request::HEADER_X_FORWARDED_PORT | 
                Request::HEADER_X_FORWARDED_PROTO
            );
        }

        // Skip HTTPS redirect for local development
        if (app()->environment('local') || app()->environment('development')) {
            return $next($request);
        }

        // Skip HTTPS redirect for localhost and development domains
        $host = $request->getHost();
        $isLocalhost = in_array($host, ['localhost', '127.0.0.1', '::1']) || 
                      str_contains($host, 'localhost') ||
                      str_contains($host, '127.0.0.1') ||
                      str_contains($host, '.test') ||
                      str_contains($host, '.local') ||
                      str_contains($host, '.dev');

        if ($isLocalhost) {
            return $next($request);
        }

        // Only force HTTPS in production and not on localhost
        if (app()->environment('production') && !$request->secure()) {
            return redirect()->secure($request->getRequestUri());
        }

        return $next($request);
    }
} 