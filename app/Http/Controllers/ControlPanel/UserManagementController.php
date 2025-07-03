<?php

namespace App\Http\Controllers\ControlPanel;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Events\RecentActivityCreated;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserManagementController extends Controller
{
    /**
     * Display a listing of the users
     */
    public function index(Request $request)
    {
        $query = User::query();
        
        // Handle search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%');
            });
        }
        
        // Handle sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);
        
        $users = $query->paginate(10)->withQueryString();
        
        return Inertia::render('ControlPanel/UserManagement/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'sort_field', 'sort_direction']),
        ]);
    }
    
    /**
     * Show the form for creating a new user
     */
    public function create()
    {
        return Inertia::render('ControlPanel/UserManagement/Create');
    }
    
    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);
        
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);
        
        $admin = Auth::guard('admin')->user();
        $activity = $admin->activities()->create([
            'type' => 'user_created',
            'description' => 'Admin ' . $admin->name . ' created user ' . $user->name,
        ]);
        event(new RecentActivityCreated($activity));
        
        return redirect()->route('control-panel.users.index')
            ->with('success', 'User created successfully.');
    }
    
    /**
     * Show the form for editing a user
     */
    public function edit(User $user)
    {
        return Inertia::render('ControlPanel/UserManagement/Edit', [
            'user' => $user,
        ]);
    }
    
    /**
     * Update the specified user
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
        ]);
        
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        
        $user->save();
        
        $admin = Auth::guard('admin')->user();
        $activity = $admin->activities()->create([
            'type' => 'user_updated',
            'description' => 'Admin ' . $admin->name . ' updated user ' . $user->name,
        ]);
        event(new RecentActivityCreated($activity));
        
        return redirect()->route('control-panel.users.index')
            ->with('success', 'User updated successfully.');
    }
    
    /**
     * Delete the specified user
     */
    public function destroy(User $user)
    {
        $userName = $user->name;
        $user->delete();
        
        $admin = Auth::guard('admin')->user();
        $activity = $admin->activities()->create([
            'type' => 'user_deleted',
            'description' => 'Admin ' . $admin->name . ' deleted user ' . $userName,
        ]);
        event(new RecentActivityCreated($activity));
        
        return redirect()->route('control-panel.users.index')
            ->with('success', 'User deleted successfully.');
    }
} 