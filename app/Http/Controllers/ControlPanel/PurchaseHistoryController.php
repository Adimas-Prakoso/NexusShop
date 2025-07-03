<?php

namespace App\Http\Controllers\ControlPanel;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Payment;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PurchaseHistoryController extends Controller
{
    /**
     * Display a listing of the purchases
     */
    public function index(Request $request)
    {
        $query = Order::with('payment', 'user');
        
        // Handle search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('order_id', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%')
                  ->orWhere('service_name', 'like', '%' . $search . '%')
                  ->orWhere('target', 'like', '%' . $search . '%');
            });
        }
        
        // Handle filters
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        // Handle date range
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        
        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }
        
        // Handle sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);
        
        $orders = $query->paginate(15)->withQueryString();
        
        // Calculate total sales
        $totalSales = Payment::where('status', 'paid')
            ->orWhere('status', 'success')
            ->sum('amount');
            
        // Status options for filter
        $statusOptions = [
            'all' => 'All',
            'pending' => 'Pending',
            'processing' => 'Processing',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
            'partial' => 'Partial',
        ];
        
        return Inertia::render('ControlPanel/PurchaseHistory/Index', [
            'orders' => $orders,
            'filters' => $request->only([
                'search', 'status', 'from_date', 'to_date', 'sort_field', 'sort_direction'
            ]),
            'statusOptions' => $statusOptions,
            'totalSales' => $totalSales,
        ]);
    }
    
    /**
     * Display the specified order details
     */
    public function show(Order $order)
    {
        $order->load('payment', 'user', 'activities');
        
        return Inertia::render('ControlPanel/PurchaseHistory/Show', [
            'order' => $order,
        ]);
    }
    
    /**
     * Update the order status
     */
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,processing,completed,cancelled,partial',
        ]);
        
        $oldStatus = $order->status;
        $order->status = $validated['status'];
        $order->save();
        
        $admin = Auth::guard('admin')->user();
        $activity = $admin->activities()->create([
            'type' => 'order_status_updated',
            'description' => "Admin {$admin->name} updated order {$order->order_id} status from {$oldStatus} to {$validated['status']}",
        ]);
        
        return redirect()->back()->with('success', 'Order status updated successfully.');
    }
    
    /**
     * Export orders to CSV
     */
    public function export(Request $request)
    {
        $query = Order::with('payment', 'user');
        
        // Apply the same filters as index
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        
        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }
        
        $orders = $query->get();
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="orders-export-' . date('Y-m-d') . '.csv"',
        ];
        
        $columns = [
            'Order ID', 'User', 'Email', 'Service', 'Target', 'Quantity', 
            'Price', 'Status', 'Payment Status', 'Created At'
        ];
        
        $callback = function() use ($orders, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            
            foreach ($orders as $order) {
                fputcsv($file, [
                    $order->order_id,
                    $order->user ? $order->user->name : 'Guest',
                    $order->email,
                    $order->service_name,
                    $order->target,
                    $order->quantity,
                    $order->price,
                    $order->status,
                    $order->payment ? $order->payment->status : 'N/A',
                    $order->created_at->format('Y-m-d H:i:s'),
                ]);
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }
} 