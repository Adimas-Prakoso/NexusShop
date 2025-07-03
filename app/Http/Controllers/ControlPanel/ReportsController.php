<?php

namespace App\Http\Controllers\ControlPanel;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReportsController extends Controller
{
    /**
     * Display the sales reports
     */
    public function index(Request $request)
    {
        // Default to this month if no period specified
        $period = $request->input('period', 'this_month');
        
        // Define date ranges for different periods
        $dateRange = $this->getDateRange($period);
        $startDate = $dateRange['start'];
        $endDate = $dateRange['end'];
        
        // Get sales data
        $salesData = $this->getSalesData($startDate, $endDate);
        
        // Get top products
        $topProducts = $this->getTopProducts($startDate, $endDate);
        
        // Get payment method distribution
        $paymentMethods = $this->getPaymentMethodDistribution($startDate, $endDate);
        
        // Get orders status distribution
        $orderStatuses = $this->getOrderStatusDistribution($startDate, $endDate);
        
        // Get user growth
        $userGrowth = $this->getUserGrowth($startDate, $endDate);
        
        // Available periods for dropdown
        $periods = [
            'today' => 'Today',
            'yesterday' => 'Yesterday',
            'this_week' => 'This Week',
            'last_week' => 'Last Week',
            'this_month' => 'This Month',
            'last_month' => 'Last Month',
            'this_year' => 'This Year',
            'all_time' => 'All Time'
        ];
        
        return Inertia::render('ControlPanel/Reports/Index', [
            'salesData' => $salesData,
            'topProducts' => $topProducts,
            'paymentMethods' => $paymentMethods,
            'orderStatuses' => $orderStatuses,
            'userGrowth' => $userGrowth,
            'periods' => $periods,
            'currentPeriod' => $period,
            'dateRange' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d')
            ],
        ]);
    }
    
    /**
     * Get the date range based on period
     */
    private function getDateRange($period)
    {
        $now = Carbon::now();
        
        switch ($period) {
            case 'today':
                return [
                    'start' => $now->copy()->startOfDay(),
                    'end' => $now->copy()->endOfDay()
                ];
            case 'yesterday':
                return [
                    'start' => $now->copy()->subDay()->startOfDay(),
                    'end' => $now->copy()->subDay()->endOfDay()
                ];
            case 'this_week':
                return [
                    'start' => $now->copy()->startOfWeek(),
                    'end' => $now->copy()->endOfWeek()
                ];
            case 'last_week':
                return [
                    'start' => $now->copy()->subWeek()->startOfWeek(),
                    'end' => $now->copy()->subWeek()->endOfWeek()
                ];
            case 'this_month':
                return [
                    'start' => $now->copy()->startOfMonth(),
                    'end' => $now->copy()->endOfMonth()
                ];
            case 'last_month':
                return [
                    'start' => $now->copy()->subMonth()->startOfMonth(),
                    'end' => $now->copy()->subMonth()->endOfMonth()
                ];
            case 'this_year':
                return [
                    'start' => $now->copy()->startOfYear(),
                    'end' => $now->copy()->endOfYear()
                ];
            case 'all_time':
            default:
                return [
                    'start' => Carbon::createFromTimestamp(0),
                    'end' => $now
                ];
        }
    }
    
    /**
     * Get sales data grouped by day
     */
    private function getSalesData($startDate, $endDate)
    {
        // For longer periods like years, group by month instead of day
        $isLongPeriod = $startDate->diffInDays($endDate) > 31;
        $groupFormat = $isLongPeriod ? 'Y-m' : 'Y-m-d';
        $labelFormat = $isLongPeriod ? 'M Y' : 'M d';
        
        // Get successful payments grouped by day/month
        $payments = Payment::where('status', 'paid')
            ->orWhere('status', 'success')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select(
                DB::raw("DATE_FORMAT(created_at, '{$groupFormat}') as date"),
                DB::raw('SUM(amount) as total')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        
        // Format data for charts
        $labels = [];
        $data = [];
        
        // Create all dates in range for consistent graphing
        $period = ($isLongPeriod) ? 
            Carbon::parse($startDate)->monthsUntil($endDate) :
            Carbon::parse($startDate)->daysUntil($endDate);
            
        foreach ($period as $date) {
            $dateKey = $date->format($groupFormat);
            $labels[] = $date->format($labelFormat);
            
            $payment = $payments->firstWhere('date', $dateKey);
            $data[] = $payment ? (float) $payment->total : 0;
        }
        
        // Calculate summary statistics
        $totalSales = array_sum($data);
        $salesCount = Payment::where('status', 'paid')
            ->orWhere('status', 'success')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();
        
        $averageSale = $salesCount > 0 ? $totalSales / $salesCount : 0;
        
        return [
            'labels' => $labels,
            'data' => $data,
            'summary' => [
                'total' => $totalSales,
                'count' => $salesCount,
                'average' => $averageSale
            ]
        ];
    }
    
    /**
     * Get top selling products
     */
    private function getTopProducts($startDate, $endDate)
    {
        $topProducts = Order::join('payments', 'orders.id', '=', 'payments.order_id')
            ->where(function($query) {
                $query->where('payments.status', 'paid')
                      ->orWhere('payments.status', 'success');
            })
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->select(
                'orders.service_id',
                'orders.service_name',
                DB::raw('COUNT(*) as order_count'),
                DB::raw('SUM(orders.price) as total_revenue')
            )
            ->groupBy('orders.service_id', 'orders.service_name')
            ->orderBy('total_revenue', 'desc')
            ->limit(5)
            ->get();
            
        return $topProducts;
    }
    
    /**
     * Get payment method distribution
     */
    private function getPaymentMethodDistribution($startDate, $endDate)
    {
        $paymentMethods = Payment::where('status', 'paid')
            ->orWhere('status', 'success')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select(
                'payment_method',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(amount) as total')
            )
            ->groupBy('payment_method')
            ->orderBy('total', 'desc')
            ->get();
            
        // Format for chart
        $labels = $paymentMethods->pluck('payment_method')->map(function($method) {
            return match($method) {
                'qris' => 'QRIS',
                'bank_transfer' => 'Bank Transfer',
                'credit_card' => 'Credit Card',
                'gopay' => 'GoPay',
                'shopeepay' => 'ShopeePay',
                'dana' => 'DANA',
                'ovo' => 'OVO',
                default => ucfirst(str_replace('_', ' ', $method)),
            };
        });
        
        return [
            'labels' => $labels,
            'data' => $paymentMethods->pluck('count'),
            'totals' => $paymentMethods->pluck('total')
        ];
    }
    
    /**
     * Get order status distribution
     */
    private function getOrderStatusDistribution($startDate, $endDate)
    {
        $orderStatuses = Order::whereBetween('created_at', [$startDate, $endDate])
            ->select(
                'status',
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('status')
            ->get();
            
        // Format for chart
        $labels = $orderStatuses->pluck('status')->map(function($status) {
            return ucfirst($status);
        });
        
        $data = $orderStatuses->pluck('count');
        
        // Define colors for each status
        $colors = [
            'pending' => '#fbbf24',    // Yellow
            'processing' => '#3b82f6', // Blue
            'completed' => '#10b981',  // Green
            'cancelled' => '#ef4444',  // Red
            'partial' => '#f97316',    // Orange
        ];
        
        // Map colors to the statuses in the data
        $backgroundColors = $orderStatuses->pluck('status')->map(function($status) use ($colors) {
            return $colors[$status] ?? '#6b7280'; // Default gray
        });
        
        return [
            'labels' => $labels,
            'data' => $data,
            'backgroundColors' => $backgroundColors
        ];
    }
    
    /**
     * Get user growth data
     */
    private function getUserGrowth($startDate, $endDate)
    {
        // For longer periods like years, group by month instead of day
        $isLongPeriod = $startDate->diffInDays($endDate) > 31;
        $groupFormat = $isLongPeriod ? 'Y-m' : 'Y-m-d';
        $labelFormat = $isLongPeriod ? 'M Y' : 'M d';
        
        $userSignups = User::whereBetween('created_at', [$startDate, $endDate])
            ->select(
                DB::raw("DATE_FORMAT(created_at, '{$groupFormat}') as date"),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();
            
        // Format data for charts
        $labels = [];
        $data = [];
        
        // Create all dates in range for consistent graphing
        $period = ($isLongPeriod) ? 
            Carbon::parse($startDate)->monthsUntil($endDate) :
            Carbon::parse($startDate)->daysUntil($endDate);
            
        foreach ($period as $date) {
            $dateKey = $date->format($groupFormat);
            $labels[] = $date->format($labelFormat);
            
            $signup = $userSignups->firstWhere('date', $dateKey);
            $data[] = $signup ? (int) $signup->count : 0;
        }
        
        $totalUsers = User::whereBetween('created_at', [$startDate, $endDate])->count();
        
        return [
            'labels' => $labels,
            'data' => $data,
            'total' => $totalUsers
        ];
    }
    
    /**
     * Export reports data to CSV
     */
    public function export(Request $request)
    {
        $period = $request->input('period', 'this_month');
        $reportType = $request->input('report_type', 'sales');
        
        $dateRange = $this->getDateRange($period);
        $startDate = $dateRange['start'];
        $endDate = $dateRange['end'];
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$reportType}-report-{$startDate->format('Y-m-d')}-to-{$endDate->format('Y-m-d')}.csv\"",
        ];
        
        // Generate appropriate report data based on type
        switch ($reportType) {
            case 'sales':
                return $this->exportSalesData($startDate, $endDate, $headers);
                
            case 'products':
                return $this->exportProductsData($startDate, $endDate, $headers);
                
            case 'payment_methods':
                return $this->exportPaymentMethodsData($startDate, $endDate, $headers);
                
            case 'user_growth':
                return $this->exportUserGrowthData($startDate, $endDate, $headers);
                
            default:
                return response()->json(['error' => 'Invalid report type'], 400);
        }
    }
    
    /**
     * Export sales data to CSV
     */
    private function exportSalesData($startDate, $endDate, $headers)
    {
        $payments = Payment::where('status', 'paid')
            ->orWhere('status', 'success')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->with('order')
            ->get();
            
        $columns = [
            'Payment ID', 'Order ID', 'User Email', 'Service', 'Amount', 'Payment Method', 'Date'
        ];
        
        $callback = function() use ($payments, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            
            foreach ($payments as $payment) {
                fputcsv($file, [
                    $payment->payment_id,
                    $payment->order ? $payment->order->order_id : 'N/A',
                    $payment->order ? $payment->order->email : 'N/A',
                    $payment->order ? $payment->order->service_name : 'N/A',
                    $payment->amount,
                    $payment->payment_method,
                    $payment->created_at->format('Y-m-d H:i:s'),
                ]);
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }
    
    /**
     * Export top products data to CSV
     */
    private function exportProductsData($startDate, $endDate, $headers)
    {
        $products = Order::join('payments', 'orders.id', '=', 'payments.order_id')
            ->where(function($query) {
                $query->where('payments.status', 'paid')
                      ->orWhere('payments.status', 'success');
            })
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->select(
                'orders.service_id',
                'orders.service_name',
                DB::raw('COUNT(*) as order_count'),
                DB::raw('SUM(orders.price) as total_revenue')
            )
            ->groupBy('orders.service_id', 'orders.service_name')
            ->orderBy('total_revenue', 'desc')
            ->get();
            
        $columns = ['Service ID', 'Service Name', 'Order Count', 'Total Revenue'];
        
        $callback = function() use ($products, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            
            foreach ($products as $product) {
                fputcsv($file, [
                    $product->service_id,
                    $product->service_name,
                    $product->order_count,
                    $product->total_revenue,
                ]);
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }
    
    /**
     * Export payment methods data to CSV
     */
    private function exportPaymentMethodsData($startDate, $endDate, $headers)
    {
        $paymentMethods = Payment::where('status', 'paid')
            ->orWhere('status', 'success')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select(
                'payment_method',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(amount) as total')
            )
            ->groupBy('payment_method')
            ->orderBy('total', 'desc')
            ->get();
            
        $columns = ['Payment Method', 'Count', 'Total Amount'];
        
        $callback = function() use ($paymentMethods, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            
            foreach ($paymentMethods as $method) {
                $formattedMethod = match($method->payment_method) {
                    'qris' => 'QRIS',
                    'bank_transfer' => 'Bank Transfer',
                    'credit_card' => 'Credit Card',
                    'gopay' => 'GoPay',
                    'shopeepay' => 'ShopeePay',
                    'dana' => 'DANA',
                    'ovo' => 'OVO',
                    default => ucfirst(str_replace('_', ' ', $method->payment_method)),
                };
                
                fputcsv($file, [
                    $formattedMethod,
                    $method->count,
                    $method->total,
                ]);
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }
    
    /**
     * Export user growth data to CSV
     */
    private function exportUserGrowthData($startDate, $endDate, $headers)
    {
        // For longer periods like years, group by month instead of day
        $isLongPeriod = $startDate->diffInDays($endDate) > 31;
        $groupFormat = $isLongPeriod ? 'Y-m' : 'Y-m-d';
        
        $userSignups = User::whereBetween('created_at', [$startDate, $endDate])
            ->select(
                DB::raw("DATE_FORMAT(created_at, '{$groupFormat}') as date"),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();
            
        $columns = ['Date', 'New Users'];
        
        $callback = function() use ($userSignups, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            
            foreach ($userSignups as $signup) {
                fputcsv($file, [
                    $signup->date,
                    $signup->count,
                ]);
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }
} 