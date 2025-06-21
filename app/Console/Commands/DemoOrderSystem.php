<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class DemoOrderSystem extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'demo:order-system {--clean : Clean existing demo data}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Demonstrate the complete order system with sample data';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if ($this->option('clean')) {
            $this->cleanDemoData();
            return Command::SUCCESS;
        }

        $this->info('🚀 NexusShop Order System Demo');
        $this->info('================================');
        
        $this->createDemoOrders();
        $this->showDemoURLs();
        $this->showSystemInfo();
        
        return Command::SUCCESS;
    }

    private function cleanDemoData()
    {
        $this->info('🧹 Cleaning demo data...');
        
        $demoOrders = Order::where('email', 'LIKE', '%demo%')->get();
        
        foreach ($demoOrders as $order) {
            if ($order->payment) {
                $order->payment->delete();
            }
            $order->delete();
        }
        
        $this->info("✅ Cleaned {$demoOrders->count()} demo orders");
    }

    private function createDemoOrders()
    {
        $this->info('📝 Creating demo orders...');
        
        $demoData = [
            [
                'service_name' => 'Instagram Followers - Premium',
                'target' => '@demo_account_1',
                'quantity' => 1000,
                'price' => 25000,
                'payment_method' => 'qris',
                'status' => 'pending'
            ],
            [
                'service_name' => 'YouTube Views - High Quality',
                'target' => 'https://youtube.com/watch?v=demo123',
                'quantity' => 5000,
                'price' => 50000,
                'payment_method' => 'bank_transfer',
                'status' => 'paid'
            ],
            [
                'service_name' => 'TikTok Likes - Real Users',
                'target' => '@tiktok_demo',
                'quantity' => 2000,
                'price' => 30000,
                'payment_method' => 'gopay',
                'status' => 'completed'
            ]
        ];

        $createdOrders = [];

        foreach ($demoData as $index => $data) {
            $orderId = 'DEMO-' . strtoupper(Str::random(8));
            
            $order = Order::create([
                'order_id' => $orderId,
                'email' => "demo{$index}@nexusshop.store",
                'service_id' => $index + 1,
                'service_name' => $data['service_name'],
                'target' => $data['target'],
                'quantity' => $data['quantity'],
                'price' => $data['price'],
                'status' => $data['status'] === 'paid' ? 'processing' : $data['status'],
                'medanpedia_order_id' => $data['status'] === 'completed' ? 'MP-' . rand(10000, 99999) : null,
                'start_count' => $data['status'] === 'completed' ? rand(1000, 5000) : null,
                'remains' => $data['status'] === 'completed' ? 0 : $data['quantity'],
            ]);

            $paymentId = 'DEMO-PAY-' . strtoupper(Str::random(8));
            $midtransOrderId = 'DEMO-NXS-' . $order->id . '-' . time();

            $payment = Payment::create([
                'order_id' => $order->id,
                'payment_id' => $paymentId,
                'midtrans_order_id' => $midtransOrderId,
                'payment_method' => $data['payment_method'],
                'amount' => $data['price'],
                'status' => $data['status'] === 'pending' ? 'pending' : 'paid',
                'qr_code_url' => $data['payment_method'] === 'qris' ? 'https://api.sandbox.midtrans.com/v2/qris/demo-qr.png' : null,
                'va_number' => $data['payment_method'] === 'bank_transfer' ? '1234567890123456' : null,
                'paid_at' => $data['status'] !== 'pending' ? now() : null,
                'expired_at' => now()->addHours(24),
                'transaction_id' => $data['status'] !== 'pending' ? 'TXN-' . strtoupper(Str::random(10)) : null,
            ]);

            $createdOrders[] = $order;
            
            $this->line("✅ Created {$data['service_name']} - Status: {$data['status']}");
        }

        $this->info("🎉 Created " . count($createdOrders) . " demo orders");
    }

    private function showDemoURLs()
    {
        $this->info('');
        $this->info('🔗 Demo URLs:');
        $this->info('============');
        
        $baseUrl = config('app.url');
        
        // Get demo orders
        $orders = Order::where('email', 'LIKE', '%demo%')->take(3)->get();
        
        foreach ($orders as $order) {
            $this->line("📋 Order: {$order->service_name}");
            $this->line("   Payment: {$baseUrl}/order/{$order->order_id}/payment");
            $this->line("   Status:  {$baseUrl}/order/{$order->order_id}/status");
            $this->line("");
        }
        
        $this->line("🛒 Order Creation:");
        $this->line("   {$baseUrl}/order/create?service_id=1&service_name=Demo%20Service&price=25000&min=100&max=10000&type=Default");
        $this->line("");
        
        $this->line("🏪 Social Media Products:");
        $this->line("   {$baseUrl}/products/social/instagram");
        $this->line("   {$baseUrl}/products/social/youtube");
        $this->line("   {$baseUrl}/products/social/tiktok");
    }

    private function showSystemInfo()
    {
        $this->info('');
        $this->info('ℹ️  System Information:');
        $this->info('=====================');
        
        $totalOrders = Order::count();
        $totalPayments = Payment::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $completedOrders = Order::where('status', 'completed')->count();
        
        $this->line("📊 Statistics:");
        $this->line("   Total Orders: {$totalOrders}");
        $this->line("   Total Payments: {$totalPayments}");
        $this->line("   Pending Orders: {$pendingOrders}");
        $this->line("   Completed Orders: {$completedOrders}");
        $this->line("");
        
        $this->line("⚙️  Configuration:");
        $this->line("   Midtrans Sandbox: " . (config('services.midtrans.sandbox') ? 'Enabled' : 'Disabled'));
        $this->line("   Medanpedia API: " . (config('services.medanpedia.api_key') ? 'Configured' : 'Not Configured'));
        $this->line("");
        
        $this->line("🧪 Testing Commands:");
        $this->line("   php artisan test:order-flow");
        $this->line("   php artisan demo:order-system --clean");
        $this->line("");
        
        $this->info("✨ Order system is ready for production!");
        $this->info("📚 Check ORDER_SYSTEM_README.md for complete documentation");
    }
}
