<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;

class DdosProtectionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $ip = $this->getRealIp($request);
        $userAgent = $request->userAgent() ?? '';
        $path = $request->path();
        
        // Skip protection for whitelisted IPs
        if ($this->isWhitelistedIp($ip)) {
            return $next($request);
        }
        
        // Check for DDoS patterns
        if ($this->isDdosAttack($request)) {
            Log::critical('DDoS attack detected', [
                'ip' => $ip,
                'user_agent' => $userAgent,
                'path' => $path,
                'method' => $request->method(),
                'headers' => $request->headers->all()
            ]);
            
            // Block IP temporarily
            $this->blockIp($ip);
            
            // Return custom service unavailable page
            return $this->renderServiceUnavailablePage($request, true);
        }
        
        // Check rate limiting (less aggressive)
        if ($this->isRateLimited($request)) {
            Log::warning('Rate limit exceeded', [
                'ip' => $ip,
                'path' => $path
            ]);
            
            return $this->renderServiceUnavailablePage($request, false);
        }
        
        return $next($request);
    }
    
    /**
     * Render custom service unavailable page
     */
    private function renderServiceUnavailablePage(Request $request, bool $isDdos): Response
    {
        // Check if request expects JSON
        if ($request->expectsJson() || $request->header('X-Inertia')) {
            return response()->json([
                'error' => 'Service temporarily unavailable',
                'message' => $isDdos ? 'Security protection active' : 'Rate limit exceeded',
                'retry_after' => 30
            ], 503);
        }
        
        // For regular requests, redirect to custom page
        return redirect()->route('service.unavailable', ['ddos' => $isDdos])->setStatusCode(503);
    }
    
    /**
     * Get real IP address considering Cloudflare
     */
    private function getRealIp(Request $request): string
    {
        // Trust Cloudflare headers
        $cloudflareIp = $request->header('CF-Connecting-IP');
        if ($cloudflareIp) {
            return $cloudflareIp;
        }
        
        // Fallback to other headers
        $forwardedIp = $request->header('X-Forwarded-For');
        if ($forwardedIp) {
            return trim(explode(',', $forwardedIp)[0]);
        }
        
        return $request->ip();
    }
    
    /**
     * Check if IP is whitelisted
     */
    private function isWhitelistedIp(string $ip): bool
    {
        $whitelist = [
            '127.0.0.1',
            '::1',
            'localhost',
            // Add your IP here if needed
        ];
        
        return in_array($ip, $whitelist);
    }
    
    /**
     * Check if request is part of DDoS attack (less aggressive)
     */
    private function isDdosAttack(Request $request): bool
    {
        $ip = $this->getRealIp($request);
        $path = $request->path();
        $method = $request->method();
        
        // Check for rapid requests from same IP (increased threshold)
        $requestCount = Cache::get("ddos_count_{$ip}", 0);
        $timeWindow = 60; // 1 minute window
        
        if ($requestCount > 500) { // Increased from 100 to 500
            return true;
        }
        
        // Check for suspicious patterns (less aggressive)
        $suspiciousPatterns = [
            // Rapid POST requests (increased threshold)
            $method === 'POST' && $requestCount > 200, // Increased from 50 to 200
            
            // Rapid requests to same endpoint (increased threshold)
            Cache::get("path_count_{$ip}_{$path}", 0) > 100, // Increased from 30 to 100
            
            // Requests with suspicious headers
            $this->hasSuspiciousHeaders($request),
            
            // Requests with suspicious payload
            $this->hasSuspiciousPayload($request),
            
            // Requests from blocked IP
            Cache::get("blocked_ip_{$ip}", false),
        ];
        
        // Update counters
        Cache::put("ddos_count_{$ip}", $requestCount + 1, $timeWindow);
        Cache::put("path_count_{$ip}_{$path}", 
            Cache::get("path_count_{$ip}_{$path}", 0) + 1, $timeWindow);
        
        return in_array(true, $suspiciousPatterns);
    }
    
    /**
     * Check for suspicious headers (less aggressive)
     */
    private function hasSuspiciousHeaders(Request $request): bool
    {
        $suspiciousHeaders = [
            'X-Forwarded-For' => ['127.0.0.1', 'localhost', '::1'],
            'X-Real-IP' => ['127.0.0.1', 'localhost', '::1'],
            'X-Originating-IP' => ['127.0.0.1', 'localhost', '::1'],
            // Removed CF-Connecting-IP from suspicious list
        ];
        
        foreach ($suspiciousHeaders as $header => $suspiciousValues) {
            $value = $request->header($header);
            if ($value && in_array($value, $suspiciousValues)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Check for suspicious payload
     */
    private function hasSuspiciousPayload(Request $request): bool
    {
        $content = $request->getContent();
        
        $suspiciousPatterns = [
            'eval(', 'exec(', 'system(', 'shell_exec(',
            'base64_decode(', 'gzinflate(', 'str_rot13(',
            'javascript:', 'vbscript:', 'onload=',
            'union select', 'drop table', 'insert into',
            'script>', '<iframe', 'javascript:alert(',
        ];
        
        foreach ($suspiciousPatterns as $pattern) {
            if (stripos($content, $pattern) !== false) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Check rate limiting (less aggressive)
     */
    private function isRateLimited(Request $request): bool
    {
        $ip = $this->getRealIp($request);
        $key = "rate_limit_{$ip}";
        
        return RateLimiter::tooManyAttempts($key, 300); // Increased from 60 to 300 requests per minute
    }
    
    /**
     * Block IP temporarily
     */
    private function blockIp(string $ip): void
    {
        Cache::put("blocked_ip_{$ip}", true, 1800); // Reduced from 3600 to 1800 seconds (30 minutes)
    }
} 