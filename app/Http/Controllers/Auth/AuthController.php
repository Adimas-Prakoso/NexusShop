<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required'],
            ]);

            if (Auth::attempt($credentials, $request->boolean('remember'))) {
                $request->session()->regenerate();
                return redirect()->intended('/');
            }

            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        } catch (ValidationException $e) {
            return back()->withErrors([
                'message' => $e->getMessage(),
                'email' => $e->errors()['email'] ?? [],
                'password' => $e->errors()['password'] ?? [],
            ]);
        }
    }

    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            Auth::login($user);

            return redirect('/');
        } catch (ValidationException $e) {
            return back()->withErrors([
                'message' => 'Registration failed. Please check your input.',
                'name' => $e->errors()['name'] ?? [],
                'email' => $e->errors()['email'] ?? [],
                'password' => $e->errors()['password'] ?? [],
            ]);
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => 'An error occurred during registration.',
            ]);
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
} 