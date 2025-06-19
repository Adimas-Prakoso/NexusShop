<?php

namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MidtransService
{
    protected string $serverKey;
    protected string $clientKey;
    protected string $baseUrl;
    protected bool $sandbox;

    public function __construct()
    {
        $this->serverKey = config('services.midtrans.server_key');
        $this->clientKey = config('services.midtrans.client_key');
        $this->sandbox = config('services.midtrans.sandbox', true);
        $this->baseUrl = config('services.midtrans.base_url');
    }

    /**
     * Validate Midtrans notification signature
     *
     * @param string $orderId
     * @param string $statusCode
     * @param string $grossAmount
     * @param string $signatureKey
     * @return bool
     */
    public function validateNotificationSignature(string $orderId, string $statusCode, string $grossAmount, string $signatureKey): bool
    {
        $input = $orderId . $statusCode . $grossAmount . $this->serverKey;
        $hash = hash('sha512', $input);
        
        return hash_equals($hash, $signatureKey);
    }

    /**
     * Get transaction status from Midtrans
     *
     * @param string $orderId
     * @return array|null
     */
    public function getTransactionStatus(string $orderId): ?array
    {
        try {
            $response = Http::withBasicAuth($this->serverKey, '')
                ->get("{$this->baseUrl}/{$orderId}/status");

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Failed to get Midtrans transaction status', [
                'order_id' => $orderId,
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Exception when getting Midtrans transaction status', [
                'order_id' => $orderId,
                'error' => $e->getMessage()
            ]);

            return null;
        }
    }

    /**
     * Create Midtrans transaction
     *
     * @param array $transactionData
     * @return array|null
     */
    public function createTransaction(array $transactionData): ?array
    {
        try {
            $response = Http::withBasicAuth($this->serverKey, '')
                ->withHeaders([
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->post("{$this->baseUrl}/charge", $transactionData);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Failed to create Midtrans transaction', [
                'data' => $transactionData,
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Exception when creating Midtrans transaction', [
                'data' => $transactionData,
                'error' => $e->getMessage()
            ]);

            return null;
        }
    }

    /**
     * Check if notification data is valid Midtrans format
     *
     * @param array $data
     * @return bool
     */
    public function isValidMidtransNotification(array $data): bool
    {
        $requiredFields = ['order_id', 'transaction_status', 'gross_amount', 'signature_key'];
        
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Process Midtrans notification data
     *
     * @param array $notificationData
     * @return array
     */
    public function processNotification(array $notificationData): array
    {
        // Extract important Midtrans fields
        $processedData = [
            'order_id' => $notificationData['order_id'] ?? null,
            'transaction_id' => $notificationData['transaction_id'] ?? null,
            'transaction_status' => $notificationData['transaction_status'] ?? null,
            'transaction_time' => $notificationData['transaction_time'] ?? null,
            'settlement_time' => $notificationData['settlement_time'] ?? null,
            'gross_amount' => $notificationData['gross_amount'] ?? null,
            'currency' => $notificationData['currency'] ?? 'IDR',
            'payment_type' => $notificationData['payment_type'] ?? null,
            'signature_key' => $notificationData['signature_key'] ?? null,
            'status_code' => $notificationData['status_code'] ?? null,
            'fraud_status' => $notificationData['fraud_status'] ?? null,
            'merchant_id' => $notificationData['merchant_id'] ?? null,
            'masked_card' => $notificationData['masked_card'] ?? null,
            'bank' => $notificationData['bank'] ?? null,
            'va_numbers' => $notificationData['va_numbers'] ?? null,
            'biller_code' => $notificationData['biller_code'] ?? null,
            'bill_key' => $notificationData['bill_key'] ?? null,
        ];

        // Add status mapping for easier processing
        $processedData['is_success'] = in_array($notificationData['transaction_status'] ?? '', ['capture', 'settlement']);
        $processedData['is_pending'] = ($notificationData['transaction_status'] ?? '') === 'pending';
        $processedData['is_failed'] = in_array($notificationData['transaction_status'] ?? '', ['deny', 'cancel', 'expire', 'failure']);

        return $processedData;
    }
}
