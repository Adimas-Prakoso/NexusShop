<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function create(Request $request)
    {
        $serviceId = $request->get('service_id');
        $serviceName = $request->get('service_name');
        $price = $request->get('price');
        $min = $request->get('min');
        $max = $request->get('max');
        $type = $request->get('type');
        
        return Inertia::render('Order/Create', [
            'service' => [
                'id' => $serviceId,
                'name' => $serviceName,
                'price' => $price,
                'min' => $min,
                'max' => $max,
                'type' => $type,
            ]
        ]);
    }

    public function store(Request $request)
    {
        Log::info('Order store method called', [
            'request_data' => $request->all(),
            'user_agent' => $request->userAgent(),
            'ip' => $request->ip()
        ]);

        $request->validate([
            'email' => 'required|email',
            'service_id' => 'required|integer',
            'service_name' => 'required|string',
            'target' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'comments' => 'nullable|string',
            'usernames' => 'nullable|string',
        ]);

        // Generate unique order ID
        $orderId = 'ORD-' . strtoupper(Str::random(10));

        Log::info('Creating order', ['order_id' => $orderId]);

        // Create order
        $order = Order::create([
            'order_id' => $orderId,
            'email' => $request->email,
            'service_id' => $request->service_id,
            'service_name' => $request->service_name,
            'target' => $request->target,
            'quantity' => $request->quantity,
            'comments' => $request->comments,
            'usernames' => $request->usernames,
            'price' => $request->price,
            'status' => 'pending',
        ]);

        Log::info('Order created successfully', [
            'order_id' => $order->id,
            'order_id_string' => $order->order_id
        ]);

        // Create payment
        $paymentId = 'PAY-' . strtoupper(Str::random(10));
        $midtransOrderId = 'NXS-' . $order->id . '-' . time();

        Log::info('Creating payment', [
            'payment_id' => $paymentId,
            'midtrans_order_id' => $midtransOrderId
        ]);

        $payment = Payment::create([
            'order_id' => $order->id,
            'payment_id' => $paymentId,
            'midtrans_order_id' => $midtransOrderId,
            'payment_method' => $request->payment_method,
            'amount' => $request->price,
            'status' => 'pending',
            'expired_at' => now()->setTimezone('Asia/Jakarta')->addHours(24), // Use Jakarta timezone to match Midtrans
        ]);

        Log::info('Payment created successfully', [
            'payment_id' => $payment->id,
            'payment_id_string' => $payment->payment_id
        ]);

        // Process payment with Midtrans
        Log::info('Processing payment with Midtrans', [
            'order_id' => $order->order_id,
            'payment_method' => $payment->payment_method,
            'amount' => $payment->amount
        ]);

        $paymentResult = $this->processMidtransPayment($payment, $order);

        Log::info('Midtrans payment result', [
            'success' => $paymentResult['success'],
            'message' => $paymentResult['message'] ?? 'No message',
            'has_data' => isset($paymentResult['data'])
        ]);

        if ($paymentResult['success']) {
            $data = $paymentResult['data'];
            
            // Extract QR code URL for QRIS
            $qrCodeUrl = null;
            if (isset($data['actions'])) {
                foreach ($data['actions'] as $action) {
                    if ($action['name'] === 'generate-qr-code' && isset($action['url'])) {
                        $qrCodeUrl = $action['url'];
                        break;
                    }
                }
            }
            
            // Alternative QR code extraction methods for different Midtrans responses
            if (!$qrCodeUrl && isset($data['qr_string'])) {
                // Some Midtrans responses include qr_string directly
                $qrCodeUrl = 'data:image/png;base64,' . $data['qr_string'];
            }
            
            // Extract VA number for bank transfer
            $vaNumber = null;
            if (isset($data['va_numbers']) && is_array($data['va_numbers']) && count($data['va_numbers']) > 0) {
                $vaNumber = $data['va_numbers'][0]['va_number'] ?? null;
            }
            
            // Extract expiry time from Midtrans response
            $expiryTime = null;
            if (isset($data['expiry_time'])) {
                try {
                    // Midtrans expiry_time format: "2024-01-01 17:39:00"
                    // Midtrans uses WIB (Asia/Jakarta) timezone
                    $expiryTime = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $data['expiry_time'], 'Asia/Jakarta');
                    // Keep in Jakarta timezone for consistency with Midtrans dashboard
                } catch (\Exception $e) {
                    Log::warning('Failed to parse Midtrans expiry_time', [
                        'expiry_time' => $data['expiry_time'],
                        'error' => $e->getMessage()
                    ]);
                }
            } else {
                // If Midtrans doesn't provide expiry_time, calculate it based on transaction_time + 24 hours
                if (isset($data['transaction_time'])) {
                    try {
                        // transaction_time format: "2024-01-01 17:39:00"
                        $transactionTime = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $data['transaction_time'], 'Asia/Jakarta');
                        $expiryTime = $transactionTime->addHours(24); // Keep in Jakarta timezone
                        Log::info('Calculated expiry_time from transaction_time', [
                            'transaction_time' => $data['transaction_time'],
                            'calculated_expiry_jakarta' => $expiryTime->toDateTimeString()
                        ]);
                    } catch (\Exception $e) {
                        Log::warning('Failed to parse transaction_time for expiry calculation', [
                            'transaction_time' => $data['transaction_time'] ?? 'NOT_FOUND',
                            'error' => $e->getMessage()
                        ]);
                    }
                }
            }
            
            Log::info('Midtrans payment response parsed', [
                'order_id' => $order->order_id,
                'payment_method' => $payment->payment_method,
                'qr_code_url' => $qrCodeUrl,
                'qr_code_found' => !empty($qrCodeUrl),
                'va_number' => $vaNumber,
                'expiry_time_raw' => $data['expiry_time'] ?? null,
                'transaction_time_raw' => $data['transaction_time'] ?? null,
                'expiry_time_parsed_jakarta' => $expiryTime ? $expiryTime->setTimezone('Asia/Jakarta')->toDateTimeString() : null,
                'expiry_time_parsed_iso' => $expiryTime ? $expiryTime->toISOString() : null,
                'current_time_jakarta' => now()->setTimezone('Asia/Jakarta')->toDateTimeString(),
                'current_time_iso' => now()->toISOString(),
                'expiry_source' => isset($data['expiry_time']) ? 'midtrans_expiry_time' : (isset($data['transaction_time']) ? 'calculated_from_transaction_time' : 'not_available'),
                'transaction_status' => $data['transaction_status'] ?? 'pending',
                'response_structure' => array_keys($data)
            ]);

            // Update payment with response data
            $updateData = [
                'midtrans_response' => $data,
            ];
            
            if ($qrCodeUrl) {
                $updateData['qr_code_url'] = $qrCodeUrl;
            }
            
            if ($vaNumber) {
                $updateData['va_number'] = $vaNumber;
            }
            
            // Use expiry time from Midtrans if available, otherwise keep our default
            if ($expiryTime) {
                $updateData['expired_at'] = $expiryTime;
            }
            
            $payment->update($updateData);

            Log::info('Redirecting to payment page', [
                'order_id' => $order->order_id,
                'route' => 'order.payment',
                'url' => route('order.payment', $order->order_id)
            ]);

            // Try to redirect, but also provide fallback
            try {
                // Force HTTPS for redirect
                $paymentUrl = route('order.payment', $order->order_id);
                if (!str_starts_with($paymentUrl, 'https://')) {
                    $paymentUrl = str_replace('http://', 'https://', $paymentUrl);
                }
                
                return redirect()->away($paymentUrl);
            } catch (\Exception $e) {
                Log::error('Redirect failed, providing fallback', [
                    'order_id' => $order->order_id,
                    'error' => $e->getMessage()
                ]);
                
                // Return JSON response with payment URL as fallback
                $paymentUrl = route('order.payment', $order->order_id);
                if (!str_starts_with($paymentUrl, 'https://')) {
                    $paymentUrl = str_replace('http://', 'https://', $paymentUrl);
                }
                
                return response()->json([
                    'success' => true,
                    'message' => 'Order created successfully!',
                    'payment_url' => $paymentUrl,
                    'order_id' => $order->order_id,
                    'manual_redirect' => true
                ]);
            }
        } else {
            Log::error('Payment processing failed', [
                'order_id' => $order->order_id,
                'error_message' => $paymentResult['message']
            ]);

            $payment->update(['status' => 'failed']);
            return back()->withErrors(['payment' => 'Payment processing failed: ' . $paymentResult['message']]);
        }
    }

    public function payment($orderId)
    {
        $order = Order::with('payment')->where('order_id', $orderId)->firstOrFail();
        
        // Ensure payment data is properly formatted for frontend
        $payment = $order->payment;
        if ($payment) {
            // Format expired_at as ISO string for consistent frontend handling
            $payment->expired_at = $payment->expired_at ? $payment->expired_at->toISOString() : null;
            
            // Log payment data for debugging
            Log::info('Payment page data', [
                'order_id' => $order->order_id,
                'payment_id' => $payment->payment_id,
                'payment_method' => $payment->payment_method,
                'qr_code_url' => $payment->qr_code_url,
                'qr_code_available' => !empty($payment->qr_code_url),
                'va_number' => $payment->va_number,
                'expired_at' => $payment->expired_at,
                'status' => $payment->status
            ]);
        }
        
        return Inertia::render('Order/Payment', [
            'order' => $order,
            'payment' => $payment,
            'sandbox_mode' => config('services.midtrans.sandbox', true),
        ]);
    }

    public function status($orderId)
    {
        $order = Order::with('payment')->where('order_id', $orderId)->firstOrFail();
        
        // Check Medanpedia status if we have a Medanpedia order ID
        $medanpediaStatus = null;
        if ($order->medanpedia_order_id) {
            $medanpediaService = new \App\Services\MedanpediaService();
            $medanpediaStatus = $medanpediaService->checkOrderStatus($order->medanpedia_order_id);
        }
        
        return Inertia::render('Order/Status', [
            'order' => $order,
            'payment' => $order->payment,
            'medanpedia_status' => $medanpediaStatus,
        ]);
    }

    public function checkStatus($orderId)
    {
        $order = Order::with('payment')->where('order_id', $orderId)->firstOrFail();
        
        // Check payment status from Midtrans
        if ($order->payment && $order->payment->status === 'pending') {
            $this->checkMidtransStatus($order->payment);
        }

        // If payment is paid, process the order with Medanpedia
        if ($order->payment && $order->payment->status === 'paid' && $order->status === 'pending') {
            $this->processOrderWithMedanpedia($order);
        }

        // Check order status from Medanpedia if we have a Medanpedia order ID
        $medanpediaStatus = null;
        if ($order->medanpedia_order_id) {
            $medanpediaService = new \App\Services\MedanpediaService();
            $statusResult = $medanpediaService->checkOrderStatus($order->medanpedia_order_id);
            $medanpediaStatus = $statusResult;
            
            if ($statusResult['success']) {
                // Update order with latest status from Medanpedia
                $order->update([
                    'status' => strtolower($statusResult['status']),
                    'start_count' => $statusResult['start_count'],
                    'remains' => $statusResult['remains'],
                    'medanpedia_response' => array_merge($order->medanpedia_response ?? [], [
                        'last_status_check' => now()->toISOString(),
                        'status_result' => $statusResult
                    ])
                ]);
                
                Log::info('Order status updated from Medanpedia', [
                    'order_id' => $order->order_id,
                    'medanpedia_order_id' => $order->medanpedia_order_id,
                    'status' => $statusResult['status'],
                    'start_count' => $statusResult['start_count'],
                    'remains' => $statusResult['remains']
                ]);
            } else {
                Log::warning('Failed to check order status from Medanpedia', [
                    'order_id' => $order->order_id,
                    'medanpedia_order_id' => $order->medanpedia_order_id,
                    'error' => $statusResult['message']
                ]);
            }
        }

        return response()->json([
            'order' => $order->fresh(['payment']),
            'medanpedia_status' => $medanpediaStatus,
        ]);
    }

    public function markAsPaid($orderId)
    {
        // Only allow in sandbox mode
        if (!config('services.midtrans.sandbox', true)) {
            return response()->json([
                'success' => false,
                'message' => 'This feature is only available in sandbox mode'
            ], 403);
        }

        $order = Order::with('payment')->where('order_id', $orderId)->firstOrFail();
        
        if (!$order->payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found'
            ], 404);
        }

        if ($order->payment->status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Payment is already marked as paid'
            ], 400);
        }

        // Update payment status to paid
        $order->payment->update([
            'status' => 'paid',
            'midtrans_response' => array_merge($order->payment->midtrans_response ?? [], [
                'sandbox_manual_paid' => true,
                'paid_at' => now()->toISOString()
            ])
        ]);

        // Process the order with Medanpedia
        $this->processOrderWithMedanpedia($order);

        Log::info('Payment marked as paid in sandbox mode', [
            'order_id' => $order->order_id,
            'payment_id' => $order->payment->payment_id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payment marked as paid successfully',
            'order' => $order->fresh(['payment'])
        ]);
    }

    private function processMidtransPayment(Payment $payment, Order $order)
    {
        try {
            $isSandbox = config('services.midtrans.sandbox', true);
            $serverKey = $isSandbox
                ? config('services.midtrans.sandbox_server_key')
                : config('services.midtrans.production_server_key');

            $params = [
                'transaction_details' => [
                    'order_id' => $payment->midtrans_order_id,
                    'gross_amount' => (int) $payment->amount,
                ],
                'customer_details' => [
                    'email' => $order->email,
                ],
                'item_details' => [
                    [
                        'id' => $order->service_id,
                        'price' => (int) $payment->amount,
                        'quantity' => 1,
                        'name' => $order->service_name,
                    ]
                ],
                // Set custom expiry to match our database setting (24 hours from now)
                'custom_expiry' => [
                    'expiry_duration' => 24,
                    'unit' => 'hour'
                ]
            ];

            // Set payment method specific parameters
            if ($payment->payment_method === 'qris') {
                $params['payment_type'] = 'qris';
                $params['qris'] = [
                    'acquirer' => 'gopay' // Ensure QRIS is properly configured
                ];
            } elseif ($payment->payment_method === 'bank_transfer') {
                $params['payment_type'] = 'bank_transfer';
                $params['bank_transfer'] = [
                    'bank' => 'bca',
                ];
            } elseif (in_array($payment->payment_method, ['gopay', 'shopeepay', 'dana', 'ovo'])) {
                $params['payment_type'] = $payment->payment_method;
            }

            $url = $isSandbox 
                ? 'https://api.sandbox.midtrans.com/v2/charge'
                : 'https://api.midtrans.com/v2/charge';

            Log::info('Midtrans payment request', [
                'order_id' => $payment->midtrans_order_id,
                'payment_method' => $payment->payment_method,
                'custom_expiry' => $params['custom_expiry'],
                'current_expired_at' => $payment->expired_at->toISOString(),
                'params' => $params,
                'url' => $url
            ]);

            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'Authorization' => 'Basic ' . base64_encode($serverKey . ':'),
            ])->post($url, $params);

            if ($response->successful()) {
                $data = $response->json();
                
                Log::info('Midtrans API Response', [
                    'order_id' => $payment->midtrans_order_id,
                    'payment_method' => $payment->payment_method,
                    'response_keys' => array_keys($data),
                    'transaction_status' => $data['transaction_status'] ?? 'unknown',
                    'actions' => $data['actions'] ?? [],
                    'va_numbers' => $data['va_numbers'] ?? [],
                    'expiry_time' => $data['expiry_time'] ?? 'NOT_FOUND',
                    'transaction_time' => $data['transaction_time'] ?? 'NOT_FOUND',
                    'has_expiry_time' => isset($data['expiry_time']),
                    'has_transaction_time' => isset($data['transaction_time']),
                    'complete_response' => $data
                ]);
                
                return [
                    'success' => true,
                    'data' => $data,
                ];
            } else {
                $errorResponse = $response->json();
                Log::error('Midtrans payment failed', [
                    'order_id' => $payment->midtrans_order_id,
                    'response' => $response->body(),
                    'status' => $response->status(),
                    'error_messages' => $errorResponse['error_messages'] ?? []
                ]);
                return [
                    'success' => false,
                    'message' => $errorResponse['error_messages'][0] ?? 'Payment processing failed',
                ];
            }
        } catch (\Exception $e) {
            Log::error('Midtrans payment exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    private function checkMidtransStatus(Payment $payment)
    {
        try {
            $isSandbox = config('services.midtrans.sandbox', true);
            $serverKey = $isSandbox
                ? config('services.midtrans.sandbox_server_key')
                : config('services.midtrans.production_server_key');

            $url = $isSandbox
                ? 'https://api.sandbox.midtrans.com/v2/' . $payment->midtrans_order_id . '/status'
                : 'https://api.midtrans.com/v2/' . $payment->midtrans_order_id . '/status';

            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Authorization' => 'Basic ' . base64_encode($serverKey . ':'),
            ])->get($url);

            if ($response->successful()) {
                $data = $response->json();
                $transactionStatus = $data['transaction_status'] ?? '';

                if (in_array($transactionStatus, ['capture', 'settlement'])) {
                    $payment->update([
                        'status' => 'paid',
                        'transaction_id' => $data['transaction_id'] ?? null,
                        'paid_at' => now(),
                        'midtrans_response' => $data,
                    ]);
                } elseif (in_array($transactionStatus, ['deny', 'cancel', 'expire', 'failure'])) {
                    $payment->update([
                        'status' => 'failed',
                        'midtrans_response' => $data,
                    ]);
                }
            }
        } catch (\Exception $e) {
            Log::error('Midtrans status check failed', [
                'payment_id' => $payment->id,
                'message' => $e->getMessage(),
            ]);
        }
    }

    private function processOrderWithMedanpedia(Order $order)
    {
        try {
            $params = [
                'api_id' => config('services.medanpedia.api_id'),
                'api_key' => config('services.medanpedia.api_key'),
                'service' => $order->service_id,
                'target' => $order->target,
                'quantity' => $order->quantity,
            ];

            // Add optional parameters
            if ($order->comments) {
                $params['comments'] = $order->comments;
            }
            if ($order->usernames) {
                $params['usernames'] = $order->usernames;
            }

            $response = Http::post('https://api.medanpedia.co.id/order', $params);

            if ($response->successful()) {
                $data = $response->json();
                
                $order->update([
                    'status' => 'processing',
                    'medanpedia_order_id' => $data['order'] ?? null,
                    'medanpedia_response' => $data,
                ]);

                Log::info('Order processed with Medanpedia', [
                    'order_id' => $order->order_id,
                    'medanpedia_order_id' => $data['order'] ?? null,
                ]);
            } else {
                Log::error('Medanpedia order failed', [
                    'order_id' => $order->order_id,
                    'response' => $response->body(),
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Medanpedia order exception', [
                'order_id' => $order->order_id,
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function webhook(Request $request)
    {
        $isSandbox = config('services.midtrans.sandbox', true);
        $serverKey = $isSandbox
            ? config('services.midtrans.sandbox_server_key')
            : config('services.midtrans.production_server_key');

        $hashed = hash('sha512', $request->order_id . $request->status_code . $request->gross_amount . $serverKey);
        
        if ($hashed !== $request->signature_key) {
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        $payment = Payment::where('midtrans_order_id', $request->order_id)->first();
        
        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        $transactionStatus = $request->transaction_status;

        if (in_array($transactionStatus, ['capture', 'settlement'])) {
            $payment->update([
                'status' => 'paid',
                'transaction_id' => $request->transaction_id,
                'paid_at' => now(),
                'midtrans_response' => $request->all(),
            ]);

            // Process order with Medanpedia
            $this->processOrderWithMedanpedia($payment->order);
        } elseif (in_array($transactionStatus, ['deny', 'cancel', 'expire', 'failure'])) {
            $payment->update([
                'status' => 'failed',
                'midtrans_response' => $request->all(),
            ]);
        }

        return response()->json(['message' => 'OK']);
    }
}
