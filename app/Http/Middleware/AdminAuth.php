<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;

class AdminAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::guard('admin')->check()) {
            return $this->redirectToLogin($request);
        }

        // Check session timeout
        if ($this->isSessionExpired($request)) {
            Auth::guard('admin')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            
            // Clear custom admin cookies
            cookie()->queue(cookie()->forget('admin_remember'));
            
            return $this->redirectToLogin($request);
        }

        // Update last activity timestamp
        $request->session()->put('admin_last_activity', now());

        return $next($request);
    }

    /**
     * Check if admin session is expired
     */
    private function isSessionExpired(Request $request): bool
    {
        $lastActivity = $request->session()->get('admin_last_activity');
        $rememberMe = $request->session()->get('admin_remember', false);
        
        if (!$lastActivity) {
            return true;
        }

        $lastActivityTime = Carbon::parse($lastActivity);
        $currentTime = now();
        
        // Check timeout based on remember me setting
        if ($rememberMe) {
            // Remember me: 1 day timeout (1440 minutes)
            $timeoutMinutes = 1440;
        } else {
            // Normal session: 10 minutes timeout
            $timeoutMinutes = 10;
        }
        
        return $currentTime->diffInMinutes($lastActivityTime) > $timeoutMinutes;
    }

    /**
     * Redirect to login page
     */
    private function redirectToLogin(Request $request)
    {
        if ($request->header('X-Inertia')) {
            return response('', 409)->header('X-Inertia-Location', route('control-panel.login'));
        }
        
        return redirect()->route('control-panel.login');
    }
}
