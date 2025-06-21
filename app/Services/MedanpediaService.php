<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class MedanpediaService
{
    private $apiUrl = 'https://api.medanpedia.co.id/services';
    private $apiKey;
    private $apiId;

    public function __construct()
    {
        $this->apiKey = config('services.medanpedia.api_key');
        $this->apiId = config('services.medanpedia.api_id');
    }

    /**
     * Get all services from Medanpedia API
     */
    public function getAllServices()
    {
        try {
            // Cache for 1 hour to avoid too many API calls
            return Cache::remember('medanpedia_services', 3600, function () {
                $response = Http::timeout(30)->post($this->apiUrl, [
                    'api_id' => $this->apiId,
                    'api_key' => $this->apiKey,
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    return $data['data'] ?? [];
                }

                Log::error('Medanpedia API Error: ' . $response->body());
                return [];
            });
        } catch (\Exception $e) {
            Log::error('Medanpedia Service Error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get services by category
     */
    public function getServicesByCategory($category)
    {
        $allServices = $this->getAllServices();
        
        // Category mapping for better URL to API category matching
        $categoryMappings = [
            'instagram' => ['Instagram'],
            'youtube' => ['Youtube', 'YouTube'],
            'facebook' => ['Facebook'],
            'twitter' => ['Twitter'],
            'tiktok' => ['TikTok', 'Tiktok'],
            'telegram' => ['Telegram'],
            'linkedin' => ['LinkedIn'],
            'spotify' => ['Spotify'],
            'soundcloud' => ['SoundCloud'],
            'twitch' => ['Twitch'],
            'discord' => ['Discord'],
            'reddit' => ['Reddit'],
            'pinterest' => ['Pinterest'],
            'snapchat' => ['Snapchat'],
            'whatsapp' => ['WhatsApp'],
            'traffic-website' => ['Website Traffic'],
            'website-traffic' => ['Website Traffic'],
            'seo' => ['SEO'],
            'google' => ['Google'],
            'shopee' => ['Shopee'],
            'tokopedia' => ['Tokopedia'],
            'live-streaming' => ['Live Stream', 'Live'],
            'comments' => ['Comments', 'komentar'],
            'likes' => ['Likes'],
            'followers' => ['Followers'],
            'subscribers' => ['Subscribers', 'Subscribe'],
            'views' => ['Views'],
            'shares' => ['Shares'],
            'saves' => ['Saves'],
            'story' => ['Story'],
            'reels' => ['Reels'],
            'shorts' => ['Shorts'],
            'premium' => ['Premium'],
        ];
        
        // Check if we have a specific mapping
        if (isset($categoryMappings[$category])) {
            $searchTerms = $categoryMappings[$category];
        } else {
            // Fallback: convert dash-separated category to space-separated
            $searchTerms = [str_replace('-', ' ', $category)];
        }
        
        return collect($allServices)->filter(function ($service) use ($searchTerms) {
            foreach ($searchTerms as $term) {
                if (stripos($service['category'], $term) !== false) {
                    return true;
                }
            }
            return false;
        })->values()->toArray();
    }

    /**
     * Search services by name or category
     */
    public function searchServices($query)
    {
        $allServices = $this->getAllServices();
        
        // Convert dash-separated query to space-separated for better matching
        $searchQuery = str_replace('-', ' ', $query);
        
        return collect($allServices)->filter(function ($service) use ($searchQuery, $query) {
            // Search in service name and category
            $nameMatch = stripos($service['name'], $searchQuery) !== false || 
                        stripos($service['name'], $query) !== false;
            
            $categoryMatch = stripos($service['category'], $searchQuery) !== false || 
                           stripos($service['category'], $query) !== false;
            
            return $nameMatch || $categoryMatch;
        })->values()->toArray();
    }

    /**
     * Check order status from Medanpedia API
     * Based on documentation from check.html
     */
    public function checkOrderStatus($orderId)
    {
        try {
            $response = Http::timeout(30)->post('https://api.medanpedia.co.id/status', [
                'api_id' => $this->apiId,
                'api_key' => $this->apiKey,
                'id' => $orderId,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                Log::info('Medanpedia status check response', [
                    'order_id' => $orderId,
                    'response' => $data
                ]);

                if ($data['status'] === true) {
                    // Single order response
                    if (isset($data['data'])) {
                        return [
                            'success' => true,
                            'status' => $data['data']['status'] ?? 'Unknown',
                            'charge' => $data['data']['charge'] ?? 0,
                            'start_count' => $data['data']['start_count'] ?? 0,
                            'remains' => $data['data']['remains'] ?? 0,
                            'message' => $data['msg'] ?? 'Order found',
                        ];
                    }
                    
                    // Multiple orders response
                    if (isset($data['orders']) && isset($data['orders'][$orderId])) {
                        $orderData = $data['orders'][$orderId];
                        return [
                            'success' => true,
                            'status' => $orderData['status'] ?? 'Unknown',
                            'charge' => $orderData['charge'] ?? 0,
                            'start_count' => $orderData['start_count'] ?? 0,
                            'remains' => $orderData['remains'] ?? 0,
                            'message' => $orderData['msg'] ?? 'Order found',
                        ];
                    }
                } else {
                    return [
                        'success' => false,
                        'message' => $data['msg'] ?? 'Order not found',
                    ];
                }
            }

            Log::error('Medanpedia status check failed', [
                'order_id' => $orderId,
                'status' => $response->status(),
                'response' => $response->body()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to check order status',
            ];

        } catch (\Exception $e) {
            Log::error('Medanpedia status check exception', [
                'order_id' => $orderId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Exception occurred while checking order status: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Check multiple order statuses at once
     */
    public function checkMultipleOrderStatuses($orderIds)
    {
        try {
            // Ensure we don't exceed 50 orders limit as per documentation
            $orderIds = array_slice($orderIds, 0, 50);
            $orderIdString = implode(',', $orderIds);

            $response = Http::timeout(30)->post('https://api.medanpedia.co.id/status', [
                'api_id' => $this->apiId,
                'api_key' => $this->apiKey,
                'id' => $orderIdString,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                Log::info('Medanpedia multiple status check response', [
                    'order_ids' => $orderIds,
                    'response' => $data
                ]);

                if ($data['status'] === true && isset($data['orders'])) {
                    $results = [];
                    foreach ($orderIds as $orderId) {
                        if (isset($data['orders'][$orderId])) {
                            $orderData = $data['orders'][$orderId];
                            $results[$orderId] = [
                                'success' => true,
                                'status' => $orderData['status'] ?? 'Unknown',
                                'charge' => $orderData['charge'] ?? 0,
                                'start_count' => $orderData['start_count'] ?? 0,
                                'remains' => $orderData['remains'] ?? 0,
                                'message' => $orderData['msg'] ?? 'Order found',
                            ];
                        } else {
                            $results[$orderId] = [
                                'success' => false,
                                'message' => 'Order not found in response',
                            ];
                        }
                    }
                    return $results;
                }
            }

            Log::error('Medanpedia multiple status check failed', [
                'order_ids' => $orderIds,
                'status' => $response->status(),
                'response' => $response->body()
            ]);

            return array_fill_keys($orderIds, [
                'success' => false,
                'message' => 'Failed to check order status',
            ]);

        } catch (\Exception $e) {
            Log::error('Medanpedia multiple status check exception', [
                'order_ids' => $orderIds,
                'error' => $e->getMessage()
            ]);

            return array_fill_keys($orderIds, [
                'success' => false,
                'message' => 'Exception occurred while checking order status: ' . $e->getMessage(),
            ]);
        }
    }
}
