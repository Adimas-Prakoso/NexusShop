<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use App\Services\MidtransService;

class CallbackController extends Controller
{
    /**
     * Handle the callback request from various providers
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response|\Illuminate\Http\JsonResponse
     */
    public function handle(Request $request)
    {
        // Get all data from the callback request
        $data = $request->all();
        
        // Get source parameter if present
        $source = $request->query('source', '');
        
        // Log the callback data for debugging purposes
        Log::info('Callback received:', ['source' => $source, 'data' => $data]);
        
        // Check provider based on request structure or explicit source parameter
        $provider = $this->detectProvider($request, $source);
        
        // Add provider info to the log for monitoring
        Log::info("Provider detected: {$provider}");
        
        // Handle response based on detected provider
        switch ($provider) {
            case 'iak':
                return $this->handleIakCallback($request, $data);
            case 'medanpedia':
                return $this->handleMedanpediaCallback($request, $data);
            case 'vipreseller':
                return $this->handleVipResellerCallback($request, $data);
            case 'apigames':
                return $this->handleApiGamesCallback($request, $data);
            case 'digi':
                return $this->handleDigiCallback($request, $data);
            case 'digiflazz':
                return $this->handleDigiflazzCallback($request, $data);
            case 'v-tiger':
                return $this->handleVTigerCallback($request, $data);
            case 'midtrans':
                return $this->handleMidtransCallback($request, $data);
            case 'payment':
                return $this->handlePaymentCallback($request, $data);
            default:
                return $this->handleGenericCallback($request, $data);
        }
    }
    
    /**
     * Detect the provider based on request structure
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $source
     * @return string
     */
    protected function detectProvider(Request $request, string $source): string
    {
        // If source is explicitly provided, use it
        if (!empty($source)) {
            return strtolower($source);
        }
        
        // Get path segments for URL pattern matching
        $path = $request->path();
        $segments = explode('/', $path);
        $lastSegment = end($segments);
        
        // Check URL patterns (e.g., if callback URL contains provider name)
        if ($lastSegment && !in_array($lastSegment, ['callback', 'api', 'webhook'])) {
            if (in_array(strtolower($lastSegment), ['iak', 'medanpedia', 'vipreseller', 'apigames', 'digi', 'digiflazz', 'vtiger', 'v-tiger', 'midtrans', 'payment'])) {
                return strtolower($lastSegment);
            }
        }
        
        // JSON request data
        $jsonData = [];
        if ($request->header('Content-Type') === 'application/json') {
            $jsonData = $request->json()->all();
        }
        
        // Check if this is an IAK-specific callback by looking for IAK-specific data structure
        $isIakCallback = $request->has('data.ref_id') || $request->has('data.tr_id') || $request->has('data.sign');
        
        // Also check for JSON payload with IAK structure
        if (!$isIakCallback && !empty($jsonData)) {
            $isIakCallback = isset($jsonData['data']['ref_id']) || isset($jsonData['data']['tr_id']) || isset($jsonData['data']['sign']);
        }
        
        if ($isIakCallback) {
            return 'iak';
        }
        
        // Check for MedanPedia structure
        if ($request->has('code') && $request->has('status') && $request->has('data')) {
            return 'medanpedia';
        }
        
        // Check for VIP Reseller structure
        if (($request->has('trxid') && $request->has('status')) || 
            isset($jsonData['trxid']) && isset($jsonData['status'])) {
            return 'vipreseller';
        }
        
        // Check for APIGames structure
        if (($request->has('status') && $request->has('price') && $request->has('message') && $request->has('product_code')) ||
            (isset($jsonData['status']) && isset($jsonData['price']) && isset($jsonData['message']) && isset($jsonData['product_code']))) {
            return 'apigames';
        }
        
        // Check for Digiflazz structure
        if (($request->has('data') && ($request->has('topic') || $request->has('callback_url'))) ||
            (isset($jsonData['data']) && (isset($jsonData['topic']) || isset($jsonData['callback_url'])))) {
            return 'digiflazz';
        }
        
        // Check for V-Tiger structure (API integration)
        if (($request->has('module') && $request->has('record_id')) ||
            (isset($jsonData['module']) && isset($jsonData['record_id']))) {
            return 'v-tiger';
        }
        
        // Check for Midtrans structure
        if ($this->isMidtransCallback($request, $jsonData)) {
            return 'midtrans';
        }
        
        // Detect payment gateway callbacks
        if ($this->isPaymentGatewayCallback($request, $jsonData)) {
            return 'payment';
        }
        
        // Default to generic handling if no specific provider is detected
        return 'generic';
    }
    
    /**
     * Detect if callback is from a payment gateway
     * 
     * @param \Illuminate\Http\Request $request
     * @param array $jsonData
     * @return bool
     */
    protected function isPaymentGatewayCallback(Request $request, array $jsonData = []): bool
    {
        // Common payment gateway signatures
        $paymentSignatures = [
            // Midtrans
            $request->has('transaction_status') && $request->has('order_id') && $request->has('signature_key'),
            isset($jsonData['transaction_status']) && isset($jsonData['order_id']) && isset($jsonData['signature_key']),
            
            // Xendit
            $request->has('external_id') && ($request->has('payment_method') || $request->has('status')),
            isset($jsonData['external_id']) && (isset($jsonData['payment_method']) || isset($jsonData['status'])),
            
            // Doku
            $request->has('TRANSIDMERCHANT') && $request->has('RESULTMSG'),
            
            // PayPal
            $request->has('txn_id') && $request->has('payment_status'),
            
            // Others
            $request->has('invoice') && $request->has('payment_status'),
            isset($jsonData['invoice']) && isset($jsonData['payment_status']),
        ];
        
        return in_array(true, $paymentSignatures);
    }
    
    /**
     * Check if callback is from Midtrans
     * 
     * @param \Illuminate\Http\Request $request
     * @param array $jsonData
     * @return bool
     */
    protected function isMidtransCallback(Request $request, array $jsonData = []): bool
    {
        // Check for core Midtrans notification fields in request
        $hasMidtransFields = (
            $request->has('order_id') && 
            $request->has('transaction_status') && 
            $request->has('gross_amount') && 
            $request->has('signature_key')
        );
        
        // Check for core Midtrans notification fields in JSON data
        $hasMidtransJsonFields = (
            isset($jsonData['order_id']) && 
            isset($jsonData['transaction_status']) && 
            isset($jsonData['gross_amount']) && 
            isset($jsonData['signature_key'])
        );
        
        // Additional Midtrans-specific fields that might be present
        $hasMidtransSpecificFields = (
            $request->has('transaction_id') || 
            $request->has('payment_type') || 
            $request->has('merchant_id') ||
            isset($jsonData['transaction_id']) || 
            isset($jsonData['payment_type']) || 
            isset($jsonData['merchant_id'])
        );
        
        // Check for Midtrans User-Agent header
        $userAgent = $request->header('User-Agent', '');
        $hasMidtransUserAgent = strpos(strtolower($userAgent), 'midtrans') !== false;
        
        return ($hasMidtransFields || $hasMidtransJsonFields) && $hasMidtransSpecificFields || $hasMidtransUserAgent;
    }

    /**
     * Handle IAK-specific callback
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  array  $data
     * @return \Illuminate\Http\JsonResponse
     */
    protected function handleIakCallback(Request $request, array $data): \Illuminate\Http\JsonResponse
    {
        Log::info('IAK callback detected');
        
        // For IAK, the data might be in the 'data' field of the JSON payload
        // Extract it if it exists, otherwise use the entire payload
        $iakData = $request->json('data') ?? $data;
        
        // Log the processed IAK data
        Log::info('Processed IAK data:', ['data' => $iakData]);
        
        // IAK expects a specific response format
        return response()->json([
            'rc' => '00',
            'status' => true,
            'message' => 'Success',
            'data' => $iakData
        ]);
    }
        
    /**
     * Handle MedanPedia-specific callback
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  array  $data
     * @return \Illuminate\Http\JsonResponse
     */
    protected function handleMedanpediaCallback(Request $request, array $data): \Illuminate\Http\JsonResponse
    {
        Log::info('MedanPedia callback detected');
        
        // Return MedanPedia expected format
        return response()->json([
            'success' => true,
            'message' => 'Callback received',
            'data' => $data
        ]);
    }
    
    /**
     * Handle VIP Reseller-specific callback
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  array  $data
     * @return \Illuminate\Http\JsonResponse
     */
    protected function handleVipResellerCallback(Request $request, array $data): \Illuminate\Http\JsonResponse
    {
        Log::info('VIP Reseller callback detected');
        
        // Return VIP Reseller expected format
        return response()->json([
            'status' => 'success',
            'message' => 'Callback processed successfully',
            'data' => $data
        ]);
    }
    
    /**
     * Handle API Games-specific callback
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  array  $data
     * @return \Illuminate\Http\JsonResponse
     */
    protected function handleApiGamesCallback(Request $request, array $data): \Illuminate\Http\JsonResponse
    {
        Log::info('API Games callback detected');
        
        // Return API Games expected format
        return response()->json([
            'status' => true,
            'message' => 'OK',
            'data' => $data
        ]);
    }
    
    /**
     * Handle Digi-specific callback
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  array  $data
     * @return \Illuminate\Http\JsonResponse
     */
    protected function handleDigiCallback(Request $request, array $data): \Illuminate\Http\JsonResponse
    {
        Log::info('Digi callback detected');
        
        // Return Digi expected format
        return response()->json([
            'status' => 200,
            'message' => 'Success',
            'data' => $data
        ]);
    }
    
    /**
     * Handle Digiflazz-specific callback
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  array  $data
     * @return \Illuminate\Http\JsonResponse
     */
    protected function handleDigiflazzCallback(Request $request, array $data): \Illuminate\Http\JsonResponse
    {
        Log::info('Digiflazz callback detected');
        
        // Return Digiflazz expected format
        return response()->json([
            'success' => true,
            'message' => 'Callback received successfully',
            'data' => $data
        ]);
    }
    
    /**
     * Handle V-Tiger-specific callback
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  array  $data
     * @return \Illuminate\Http\JsonResponse
     */
    protected function handleVTigerCallback(Request $request, array $data): \Illuminate\Http\JsonResponse
    {
        Log::info('V-Tiger callback detected');
        
        // Return V-Tiger expected format
        return response()->json([
            'success' => true,
            'code' => 200,
            'message' => 'Webhook received'
        ]);
    }

    /**
     * Handle Midtrans-specific callback
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  array  $data
     * @return \Illuminate\Http\JsonResponse
     */
    protected function handleMidtransCallback(Request $request, array $data): \Illuminate\Http\JsonResponse
    {
        Log::info('Midtrans callback detected', ['data' => $data]);
        
        try {
            $midtransService = new MidtransService();
            
            // Validate if this is a proper Midtrans notification
            if (!$midtransService->isValidMidtransNotification($data)) {
                Log::warning('Invalid Midtrans notification format', ['data' => $data]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid notification format'
                ], 400);
            }
            
            // Validate signature for security
            $isValidSignature = $midtransService->validateNotificationSignature(
                $data['order_id'],
                $data['status_code'] ?? '200',
                $data['gross_amount'],
                $data['signature_key']
            );
            
            if (!$isValidSignature) {
                Log::warning('Invalid Midtrans callback signature', ['order_id' => $data['order_id'] ?? 'unknown']);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid signature'
                ], 400);
            }
            
            Log::info('Midtrans callback signature validated successfully');
            
            // Process the notification data
            $processedData = $midtransService->processNotification($data);
            
            // Log the processed Midtrans data
            Log::info('Processed Midtrans callback data:', ['data' => $processedData]);
            
            // Here you can add your business logic to handle the payment status
            // For example:
            // - Update order status in database
            // - Send confirmation emails
            // - Update inventory
            // - Process refunds if needed
            
            switch ($processedData['transaction_status']) {
                case 'capture':
                case 'settlement':
                    Log::info('Midtrans payment successful', ['order_id' => $processedData['order_id']]);
                    // Handle successful payment
                    break;
                    
                case 'pending':
                    Log::info('Midtrans payment pending', ['order_id' => $processedData['order_id']]);
                    // Handle pending payment
                    break;
                    
                case 'deny':
                case 'cancel':
                case 'expire':
                case 'failure':
                    Log::info('Midtrans payment failed', [
                        'order_id' => $processedData['order_id'],
                        'status' => $processedData['transaction_status']
                    ]);
                    // Handle failed payment
                    break;
                    
                default:
                    Log::warning('Unknown Midtrans transaction status', [
                        'order_id' => $processedData['order_id'],
                        'status' => $processedData['transaction_status']
                    ]);
            }
            
            // Midtrans expects a simple 'OK' response for successful processing
            return response()->json([
                'status' => 'success',
                'message' => 'OK'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error processing Midtrans callback', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Handle Payment Gateway-specific callback
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  array  $data
     * @return \Illuminate\Http\JsonResponse
     */
    protected function handlePaymentCallback(Request $request, array $data): \Illuminate\Http\JsonResponse
    {
        Log::info('Payment gateway callback detected');
        
        // Determine payment gateway type for more specific logging
        $gatewayType = $this->detectPaymentGatewayType($request, $data);
        Log::info("Payment gateway type: {$gatewayType}");
        
        // Return generic payment gateway response
        return response()->json([
            'status' => 'success',
            'message' => 'Payment notification received',
            'timestamp' => now()->timestamp
        ]);
    }
    
    /**
     * Detect specific payment gateway type
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  array  $data
     * @return string
     */
    protected function detectPaymentGatewayType(Request $request, array $data): string
    {
        // Midtrans - Enhanced detection
        if (($request->has('transaction_status') && $request->has('order_id') && $request->has('signature_key')) ||
            (isset($data['transaction_status']) && isset($data['order_id']) && isset($data['signature_key']))) {
            return 'midtrans';
        }
        
        // Additional Midtrans detection by checking specific fields
        if ($request->has('merchant_id') || isset($data['merchant_id']) || 
            $request->has('payment_type') || isset($data['payment_type']) ||
            $request->has('transaction_id') || isset($data['transaction_id'])) {
            // Check if it also has order_id which is common in Midtrans
            if ($request->has('order_id') || isset($data['order_id'])) {
                return 'midtrans';
            }
        }
        
        // Xendit
        if ($request->has('external_id') && ($request->has('payment_method') || $request->has('status'))) {
            return 'xendit';
        }
        
        // Doku
        if ($request->has('TRANSIDMERCHANT') && $request->has('RESULTMSG')) {
            return 'doku';
        }
        
        // PayPal
        if ($request->has('txn_id') && $request->has('payment_status')) {
            return 'paypal';
        }
        
        return 'unknown';
    }
    
    /**
     * Handle generic callback for other providers
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  array  $data
     * @return \Inertia\Response|\Illuminate\Http\JsonResponse
     */
    protected function handleGenericCallback(Request $request, array $data)
    {
        Log::info('Generic callback detected');
        
        // Check if the request is from other API services
        if ($request->wantsJson() || $request->ajax() || $request->header('Accept') === 'application/json') {
            // Return JSON response for API calls
            return response()->json([
                'status' => 'success',
                'message' => 'Callback received successfully',
                'data' => $data,
                'timestamp' => now()->format('Y-m-d H:i:s')
            ]);
        }
        
        // For browser access, return the Inertia page
        return Inertia::render('Callback', [
            'callbackData' => $data,
            'timestamp' => now()->format('Y-m-d H:i:s')
        ]);
    }
}

