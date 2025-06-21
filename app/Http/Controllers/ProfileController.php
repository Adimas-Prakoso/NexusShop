<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit()
    {
        return Inertia::render('Profile', [
            'user' => Auth::user(),
        ]);
    }

    public function update(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        
        if (!$user) {
            return redirect('/login');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'current_password' => ['nullable', 'required_with:password'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        // If current password is provided, verify it
        if ($request->filled('current_password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return back()->withErrors([
                    'current_password' => 'The provided password does not match your current password.',
                ]);
            }
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if ($request->filled('password')) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return back()->with('message', 'Profile updated successfully.');
    }

    public function orders()
    {
        $orders = Order::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'product_name' => $order->product_name,
                    'amount' => $order->amount,
                    'status' => $order->status,
                    'payment_method' => $order->payment_method,
                    'created_at' => $order->created_at,
                ];
            });

        return Inertia::render('Order/History', [
            'orders' => $orders,
        ]);
    }
} 