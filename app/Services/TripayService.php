<?php

namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TripayService
{
    protected string $merchantCode;
    protected string $apiKey;
    protected string $privateKey;
    protected string $baseUrl;
    protected bool $sandbox;

    public function __construct()
    {
        $this->merchantCode = config('services.tripay.merchant_code');
        $this->apiKey = config('services.tripay.api_key');
        $this->privateKey = config('services.tripay.private_key');
        $this->sandbox = config('services.tripay.sandbox', true);
        $this->baseUrl = config('services.tripay.base_url');
    }

    /**
     * Get available payment channels
     *
     * @return array
     */
    public function getPaymentChannels(): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
            ])->get($this->baseUrl . '/merchant/payment-channel');

            if ($response->successful()) {
                return $response->json()['data'] ?? [];
            }

            Log::error('Failed to get Tripay payment channels', [
                'status' => $response->status(),
                'response' => $response->body()
            ]);

            return [];
        } catch (\Exception $e) {
            Log::error('Exception getting Tripay payment channels', [
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }

    /**
     * Create a new transaction
     *
     * @param array $data
     * @return array|null
     */
    public function createTransaction(array $data): ?array
    {
        try {
            $payload = [
                'method' => $data['payment_method'],
                'merchant_ref' => $data['merchant_ref'],
                'amount' => $data['amount'],
                'customer_name' => $data['customer_name'],
                'customer_email' => $data['customer_email'],
                'customer_phone' => $data['customer_phone'],
                'order_items' => $data['order_items'],
                'callback_url' => $data['callback_url'],
                'return_url' => $data['return_url'],
                'expired_time' => $data['expired_time'] ?? (time() + (24 * 60 * 60)), // 24 hours default
            ];

            // Generate signature
            $signature = $this->generateSignature($payload);
            $payload['signature'] = $signature;

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/transaction/create', $payload);

            if ($response->successful()) {
                $result = $response->json();
                
                Log::info('Tripay transaction created successfully', [
                    'merchant_ref' => $data['merchant_ref'],
                    'reference' => $result['data']['reference'] ?? null
                ]);

                return $result['data'] ?? null;
            }

            Log::error('Failed to create Tripay transaction', [
                'status' => $response->status(),
                'response' => $response->body(),
                'payload' => $payload
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Exception creating Tripay transaction', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            return null;
        }
    }

    /**
     * Get transaction detail
     *
     * @param string $reference
     * @return array|null
     */
    public function getTransactionDetail(string $reference): ?array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
            ])->get($this->baseUrl . '/transaction/detail', [
                'reference' => $reference
            ]);

            if ($response->successful()) {
                return $response->json()['data'] ?? null;
            }

            Log::error('Failed to get Tripay transaction detail', [
                'reference' => $reference,
                'status' => $response->status(),
                'response' => $response->body()
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Exception getting Tripay transaction detail', [
                'reference' => $reference,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Generate signature for transaction
     *
     * @param array $data
     * @return string
     */
    protected function generateSignature(array $data): string
    {
        $signature = hash_hmac(
            'sha256',
            $this->merchantCode . $data['merchant_ref'] . $data['amount'],
            $this->privateKey
        );

        return $signature;
    }

    /**
     * Validate callback signature
     *
     * @param string $signature
     * @param string $body
     * @return bool
     */
    public function validateCallbackSignature(string $signature, string $body): bool
    {
        $expectedSignature = hash_hmac('sha256', $body, $this->privateKey);
        return hash_equals($expectedSignature, $signature);
    }

    /**
     * Get calculator/fee information
     *
     * @param string $paymentMethod
     * @param int $amount
     * @return array|null
     */
    public function getCalculator(string $paymentMethod, int $amount): ?array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
            ])->get($this->baseUrl . '/merchant/fee-calculator', [
                'code' => $paymentMethod,
                'amount' => $amount
            ]);

            if ($response->successful()) {
                return $response->json()['data'] ?? null;
            }

            Log::error('Failed to get Tripay calculator', [
                'payment_method' => $paymentMethod,
                'amount' => $amount,
                'status' => $response->status(),
                'response' => $response->body()
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Exception getting Tripay calculator', [
                'payment_method' => $paymentMethod,
                'amount' => $amount,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Check if service is properly configured
     *
     * @return bool
     */
    public function isConfigured(): bool
    {
        return !empty($this->merchantCode) && 
               !empty($this->apiKey) && 
               !empty($this->privateKey);
    }

    /**
     * Get merchant balance
     *
     * @return array|null
     */
    public function getMerchantBalance(): ?array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
            ])->get($this->baseUrl . '/merchant/balance');

            if ($response->successful()) {
                return $response->json()['data'] ?? null;
            }

            Log::error('Failed to get Tripay merchant balance', [
                'status' => $response->status(),
                'response' => $response->body()
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Exception getting Tripay merchant balance', [
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }
}