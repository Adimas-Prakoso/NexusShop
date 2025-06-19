<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TestPaymentGeneration extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:payment {--method=qris : Payment method} {--amount=25000 : Payment amount}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test payment generation with Midtrans API';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $method = $this->option('method');
        $amount = (int) $this->option('amount');
        
        $this->info('🧪 Testing Payment Generation');
        $this->info('============================');
        
        // Check configuration
        $this->checkConfiguration();
        
        // Create test order
        $order = $this->createTestOrder($amount);
        
        // Create test payment
        $payment = $this->createTestPayment($order, $method, $amount);
        
        // Test Midtrans API
        $result = $this->testMidtransAPI($payment, $order);
        
        if ($result['success']) {
            $this->info('✅ Payment generation successful!');
            $this->displayPaymentInfo($payment, $result['data']);
        } else {
            $this->error('❌ Payment generation failed: ' . $result['message']);
        }
        
        return Command::SUCCESS;
    }
    
    private function checkConfiguration()
    {
        $this->info('📋 Configuration Check:');
        
        $isSandbox = config('services.midtrans.sandbox', true);
        $serverKey = $isSandbox 
            ? config('services.midtrans.sandbox_server_key')
            : config('services.midtrans.production_server_key');
            
        $this->line("   Mode: " . ($isSandbox ? 'Sandbox' : 'Production'));
        $this->line("   Server Key: " . ($serverKey ? 'Configured' : 'Missing'));
        $this->line("   API URL: " . ($isSandbox ? 'sandbox.midtrans.com' : 'api.midtrans.com'));
        $this->line("");
    }
    
    private function createTestOrder($amount)
    {
        $orderId = 'TEST-' . strtoupper(Str::random(8));
        
        return Order::create([
            'order_id' => $orderId,
            'email' => 'test@nexusshop.store',
            'service_id' => 999,
            'service_name' => 'Test Payment Service',
            'target' => '@test_account',
            'quantity' => 1000,
            'price' => $amount,
            'status' => 'pending',
        ]);
    }
    
    private function createTestPayment($order, $method, $amount)
    {
        $paymentId = 'TEST-PAY-' . strtoupper(Str::random(8));
        $midtransOrderId = 'TEST-MT-' . $order->id . '-' . time();
        
        return Payment::create([
            'order_id' => $order->id,
            'payment_id' => $paymentId,
            'midtrans_order_id' => $midtransOrderId,
            'payment_method' => $method,
            'amount' => $amount,
            'status' => 'pending',
            'expired_at' => now()->addHours(24),
        ]);
    }
    
    private function testMidtransAPI($payment, $order)
    {
        try {
            $isSandbox = config('services.midtrans.sandbox', true);
            $serverKey = $isSandbox
                ? config('services.midtrans.sandbox_server_key')
                : config('services.midtrans.production_server_key');

            if (!$serverKey) {
                return [
                    'success' => false,
                    'message' => 'Server key not configured'
                ];
            }

            $params = [
                'transaction_details' => [
                    'order_id' => $payment->midtrans_order_id,
                    'gross_amount' => (int) $payment->amount,
                ],
                'customer_details' => [
                    'email' => $order->email,
                    'first_name' => 'Test',
                    'last_name' => 'User',
                ],
                'item_details' => [
                    [
                        'id' => $order->service_id,
                        'price' => (int) $payment->amount,
                        'quantity' => 1,
                        'name' => $order->service_name,
                    ]
                ],
            ];

            // Set payment method specific parameters
            if ($payment->payment_method === 'qris') {
                $params['payment_type'] = 'qris';
            } elseif ($payment->payment_method === 'bank_transfer') {
                $params['payment_type'] = 'bank_transfer';
                $params['bank_transfer'] = [
                    'bank' => 'bca',
                ];
            }

            $url = $isSandbox 
                ? 'https://api.sandbox.midtrans.com/v2/charge'
                : 'https://api.midtrans.com/v2/charge';

            $this->info("🔄 Calling Midtrans API...");
            $this->line("   URL: " . $url);
            $this->line("   Order ID: " . $payment->midtrans_order_id);
            $this->line("   Amount: Rp " . number_format($payment->amount));

            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'Authorization' => 'Basic ' . base64_encode($serverKey . ':'),
            ])->post($url, $params);

            if ($response->successful()) {
                $data = $response->json();
                
                // Update payment with response
                $payment->update([
                    'midtrans_response' => $data,
                    'qr_code_url' => $data['qr_code_url'] ?? null,
                    'va_number' => $data['va_numbers'][0]['va_number'] ?? null,
                ]);
                
                return [
                    'success' => true,
                    'data' => $data,
                ];
            } else {
                $errorData = $response->json();
                Log::error('Midtrans payment test failed', [
                    'response' => $response->body(),
                    'status' => $response->status(),
                ]);
                
                return [
                    'success' => false,
                    'message' => $errorData['error_messages'][0] ?? 'Unknown error',
                ];
            }
        } catch (\Exception $e) {
            Log::error('Midtrans payment test exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }
    
    private function displayPaymentInfo($payment, $data)
    {
        $this->info('💳 Payment Information:');
        $this->line("   Payment ID: " . $payment->payment_id);
        $this->line("   Midtrans Order ID: " . $payment->midtrans_order_id);
        $this->line("   Payment Method: " . ucfirst($payment->payment_method));
        $this->line("   Amount: Rp " . number_format($payment->amount));
        $this->line("   Status: " . ($data['transaction_status'] ?? 'pending'));
        
        if (isset($data['qr_code_url'])) {
            $this->line("   QR Code URL: " . $data['qr_code_url']);
        }
        
        if (isset($data['va_numbers'][0]['va_number'])) {
            $this->line("   VA Number: " . $data['va_numbers'][0]['va_number']);
        }
        
        $this->line("");
        $this->info('🔗 Test URLs:');
        $baseUrl = config('app.url');
        $this->line("   Payment Page: " . $baseUrl . "/order/" . $payment->order->order_id . "/payment");
        $this->line("   Status Page: " . $baseUrl . "/order/" . $payment->order->order_id . "/status");
    }
}
