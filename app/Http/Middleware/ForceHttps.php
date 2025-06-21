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

        // Only force HTTPS in production and not on localhost
        if (app()->environment('production') && 
            !$request->is('localhost') && 
            !$request->is('127.0.0.1') && 
            !$request->is('::1') && 
            !str_contains($request->getHost(), 'localhost') &&
            !str_contains($request->getHost(), '127.0.0.1') &&
            !$request->secure()) {
            return redirect()->secure($request->getRequestUri());
        }

        return $next($request);
    }
} 