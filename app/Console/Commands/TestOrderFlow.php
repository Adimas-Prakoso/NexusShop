<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class TestOrderFlow extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:order-flow {--email=test@example.com}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the order flow by creating a sample order';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->option('email');
        
        $this->info('Creating test order...');
        
        // Generate unique order ID
        $orderId = 'ORD-' . strtoupper(Str::random(10));
        
        // Create test order
        $order = Order::create([
            'order_id' => $orderId,
            'email' => $email,
            'service_id' => 1,
            'service_name' => 'Instagram Followers - Test Service',
            'target' => '@testaccount',
            'quantity' => 1000,
            'price' => 25000,
            'status' => 'pending',
        ]);
        
        $this->info("Order created with ID: {$order->order_id}");
        
        // Create test payment
        $paymentId = 'PAY-' . strtoupper(Str::random(10));
        $midtransOrderId = 'MT-' . $order->id . '-' . time();
        
        $payment = Payment::create([
            'order_id' => $order->id,
            'payment_id' => $paymentId,
            'midtrans_order_id' => $midtransOrderId,
            'payment_method' => 'qris',
            'amount' => 25000,
            'status' => 'pending',
            'expired_at' => now()->addHours(24),
        ]);
        
        $this->info("Payment created with ID: {$payment->payment_id}");
        
        $this->info('Test URLs:');
        $this->line("Order Create: " . url("/order/create?service_id=1&service_name=Instagram%20Followers&price=25000&min=100&max=10000&type=Default"));
        $this->line("Payment Page: " . url("/order/{$order->order_id}/payment"));
        $this->line("Status Page: " . url("/order/{$order->order_id}/status"));
        
        $this->info('Test order flow created successfully!');
        
        return Command::SUCCESS;
    }
}
