<?php

namespace App\Http\Controllers\ControlPanel;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show the login form
     */
    public function showLogin()
    {
        // Redirect to dashboard if already logged in
        if (Auth::guard('admin')->check()) {
            return redirect()->route('control-panel.dashboard');
        }

        return Inertia::render('ControlPanel/Login');
    }

    /**
     * Handle login request
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        $credentials = $request->only('email', 'password');
        $remember = $request->filled('remember');

        if (Auth::guard('admin')->attempt($credentials, $remember)) {
            $request->session()->regenerate();
            
            // Set custom session lifetime based on remember me
            if ($remember) {
                // Remember me: 1 day (1440 minutes)
                config(['session.lifetime' => 1440]);
                $request->session()->put('admin_remember', true);
                $request->session()->put('admin_login_time', now());
                // Set cookie for 1 day
                cookie()->queue('admin_remember', 'true', 1440);
            } else {
                // Normal login: 10 minutes
                config(['session.lifetime' => 10]);
                $request->session()->put('admin_remember', false);
                $request->session()->put('admin_login_time', now());
                // Set cookie for 10 minutes
                cookie()->queue('admin_remember', 'false', 10);
            }
            
            // Store login timestamp for validation
            $request->session()->put('admin_last_activity', now());
            
            // Check if this is an Inertia request
            if ($request->header('X-Inertia')) {
                return Inertia::location(route('control-panel.dashboard'));
            }
            
            return redirect()->route('control-panel.dashboard');
        }

        return back()->withErrors([
            'login' => 'Email atau password tidak valid.',
        ])->onlyInput('email');
    }

    /**
     * Handle logout request
     */
    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();
        
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        // Clear custom admin cookies
        cookie()->queue(cookie()->forget('admin_remember'));
        
        // Check if this is an Inertia request
        if ($request->header('X-Inertia')) {
            return Inertia::location(route('control-panel.login'));
        }
        
        return redirect()->route('control-panel.login');
    }

    /**
     * Show the dashboard
     */
    public function dashboard(Request $request)
    {
        return Inertia::render('ControlPanel/Dashboard', [
            'admin' => Auth::guard('admin')->user(),
            'remember_me' => $request->session()->get('admin_remember', false)
        ]);
    }
}
