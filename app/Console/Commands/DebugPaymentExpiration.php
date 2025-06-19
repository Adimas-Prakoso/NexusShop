<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Console\Command;
use Carbon\Carbon;

class DebugPaymentExpiration extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'debug:payment-expiration {orderId? : Order ID to debug}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Debug payment expiration issues';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $orderId = $this->argument('orderId');
        
        if ($orderId) {
            $this->debugSpecificOrder($orderId);
        } else {
            $this->debugAllRecentPayments();
        }
        
        return Command::SUCCESS;
    }
    
    private function debugSpecificOrder($orderId)
    {
        $this->info("🔍 Debugging Order: {$orderId}");
        $this->info('===========================');
        
        $order = Order::with('payment')->where('order_id', $orderId)->first();
        
        if (!$order) {
            $this->error("❌ Order not found: {$orderId}");
            return;
        }
        
        $this->displayOrderInfo($order);
        
        if ($order->payment) {
            $this->displayPaymentInfo($order->payment);
            $this->analyzeExpiration($order->payment);
        } else {
            $this->warn("⚠️  No payment found for this order");
        }
    }
    
    private function debugAllRecentPayments()
    {
        $this->info('🔍 Debugging Recent Payments');
        $this->info('============================');
        
        $payments = Payment::with('order')
            ->where('created_at', '>=', now()->subHours(24))
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();
            
        if ($payments->isEmpty()) {
            $this->warn('⚠️  No recent payments found');
            return;
        }
        
        foreach ($payments as $payment) {
            $this->line("");
            $this->line("📋 Order: {$payment->order->order_id}");
            $this->analyzeExpiration($payment);
        }
    }
    
    private function displayOrderInfo($order)
    {
        $this->info('📦 Order Information:');
        $this->line("   Order ID: {$order->order_id}");
        $this->line("   Email: {$order->email}");
        $this->line("   Service: {$order->service_name}");
        $this->line("   Amount: Rp " . number_format($order->price));
        $this->line("   Status: {$order->status}");
        $this->line("   Created: {$order->created_at->format('Y-m-d H:i:s T')}");
        $this->line("");
    }
    
    private function displayPaymentInfo($payment)
    {
        $this->info('💳 Payment Information:');
        $this->line("   Payment ID: {$payment->payment_id}");
        $this->line("   Midtrans Order ID: {$payment->midtrans_order_id}");
        $this->line("   Method: {$payment->payment_method}");
        $this->line("   Amount: Rp " . number_format($payment->amount));
        $this->line("   Status: {$payment->status}");
        $this->line("   Created: {$payment->created_at->format('Y-m-d H:i:s T')}");
        $this->line("   Updated: {$payment->updated_at->format('Y-m-d H:i:s T')}");
        $this->line("");
    }
    
    private function analyzeExpiration($payment)
    {
        $this->info('⏰ Expiration Analysis:');
        
        if (!$payment->expired_at) {
            $this->error("   ❌ expired_at is NULL - This is the problem!");
            $this->line("   💡 Solution: Set expired_at when creating payment");
            return;
        }
        
        $now = Carbon::now('UTC');
        $expiredAt = Carbon::parse($payment->expired_at)->utc();
        $createdAt = Carbon::parse($payment->created_at)->utc();
        
        $this->line("   Expired At: {$expiredAt->format('Y-m-d H:i:s T')}");
        $this->line("   Current Time: {$now->format('Y-m-d H:i:s T')}");
        
        // Calculate differences
        $timeSinceCreated = $now->diffInMinutes($createdAt);
        $timeUntilExpiry = $now->diffInMinutes($expiredAt, false);
        
        $this->line("   Time since created: {$timeSinceCreated} minutes");
        
        if ($timeUntilExpiry > 0) {
            $hours = floor($timeUntilExpiry / 60);
            $minutes = $timeUntilExpiry % 60;
            $this->line("   ✅ Time until expiry: {$hours}h {$minutes}m");
            $this->info("   Status: ACTIVE");
        } else {
            $expiredMinutes = abs($timeUntilExpiry);
            $hours = floor($expiredMinutes / 60);
            $minutes = $expiredMinutes % 60;
            $this->line("   ❌ Expired since: {$hours}h {$minutes}m ago");
            $this->error("   Status: EXPIRED");
        }
        
        // Check timezone issues
        $this->line("");
        $this->info('🌍 Timezone Analysis:');
        $this->line("   App Timezone: " . config('app.timezone', 'UTC'));
        $this->line("   Server Timezone: " . date_default_timezone_get());
        $this->line("   Database Timezone: " . $expiredAt->getTimezone()->getName());
        
        // Recommendations
        $this->line("");
        $this->info('💡 Recommendations:');
        
        if (!$payment->expired_at) {
            $this->line("   1. Ensure expired_at is set during payment creation");
            $this->line("   2. Check OrderController@store method");
        } elseif ($timeUntilExpiry > 0) {
            $this->line("   1. Payment is still active and valid");
            $this->line("   2. If frontend shows expired, check JavaScript timezone handling");
            $this->line("   3. Verify frontend date parsing logic");
        } else {
            $this->line("   1. Payment has genuinely expired");
            $this->line("   2. Check if expiration time was set correctly");
        }
        
        $this->line("");
    }
}
